#![no_std]

mod errors;
mod storage;
mod types;

use soroban_sdk::{contract, contractimpl, Address, Env, Vec};

pub use errors::Error;
pub use types::{Circle, CircleStatus};

use storage::{
    get_circle, is_joined, next_circle_id, set_circle, set_joined,
};

#[contract]
pub struct CircleContract;

#[contractimpl]
impl CircleContract {
    /// Creates a circle with a fixed, invite-only member list and a fixed
    /// payout rotation order. The circle starts in `Forming` status — no
    /// round timeout runs and no deposits are accepted until every listed
    /// member has called `join_circle`.
    pub fn create_circle(
        env: Env,
        creator: Address,
        token: Address,
        members: Vec<Address>,
        payout_order: Vec<Address>,
        contribution_amount: i128,
        round_timeout_secs: u64,
    ) -> Result<u64, Error> {
        creator.require_auth();

        if members.len() < 2 {
            return Err(Error::InvalidMemberCount);
        }
        if contribution_amount <= 0 {
            return Err(Error::InvalidAmount);
        }
        if round_timeout_secs == 0 {
            return Err(Error::InvalidTimeout);
        }
        if payout_order.len() != members.len() {
            return Err(Error::InvalidPayoutOrder);
        }

        for i in 0..members.len() {
            let m = members.get(i).unwrap();
            for j in (i + 1)..members.len() {
                if members.get(j).unwrap() == m {
                    return Err(Error::DuplicateMember);
                }
            }
        }
        for m in payout_order.iter() {
            if !members.iter().any(|member| member == m) {
                return Err(Error::InvalidPayoutOrder);
            }
        }

        let circle_id = next_circle_id(&env);
        let circle = Circle {
            creator,
            token,
            members,
            payout_order,
            contribution_amount,
            round_index: 0,
            round_deposit_count: 0,
            round_deadline: 0,
            round_timeout_secs,
            status: CircleStatus::Forming,
        };
        set_circle(&env, circle_id, &circle);
        Ok(circle_id)
    }

    /// Confirms an invited member's participation. Once every member listed
    /// at creation has joined, the circle becomes `Active` and its first
    /// round timeout starts counting.
    pub fn join_circle(env: Env, circle_id: u64, member: Address) -> Result<(), Error> {
        member.require_auth();

        let mut circle = get_circle(&env, circle_id)?;
        if circle.status != CircleStatus::Forming {
            return Err(Error::CircleNotForming);
        }
        if !circle.members.iter().any(|m| m == member) {
            return Err(Error::NotMember);
        }
        if is_joined(&env, circle_id, &member) {
            return Err(Error::AlreadyJoined);
        }

        set_joined(&env, circle_id, &member);

        let joined_count = circle
            .members
            .iter()
            .filter(|m| is_joined(&env, circle_id, m))
            .count() as u32;

        if joined_count == circle.members.len() {
            circle.status = CircleStatus::Active;
            circle.round_deadline = env.ledger().timestamp() + circle.round_timeout_secs;
            set_circle(&env, circle_id, &circle);
        }

        Ok(())
    }

    /// Read-only view of a circle's full state.
    pub fn get_circle(env: Env, circle_id: u64) -> Result<Circle, Error> {
        get_circle(&env, circle_id)
    }

    /// Read-only view of whether a member has confirmed participation.
    pub fn has_joined(env: Env, circle_id: u64, member: Address) -> bool {
        is_joined(&env, circle_id, &member)
    }
}

#[cfg(test)]
mod test;
