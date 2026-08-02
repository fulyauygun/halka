#![no_std]

mod errors;
mod storage;
mod types;

use soroban_sdk::{contract, contractimpl, token::TokenClient, Address, Env, Vec};

pub use errors::Error;
pub use types::{Circle, CircleStatus};

use storage::{
    clear_deposited, get_circle, has_deposited, is_joined, next_circle_id, set_circle,
    set_deposited, set_joined,
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

    /// Pays a member's fixed contribution into the contract for the round
    /// currently being funded. Rejects non-members, members who already
    /// deposited this round, and circles that are not yet `Active`.
    pub fn deposit(env: Env, circle_id: u64, member: Address) -> Result<(), Error> {
        member.require_auth();

        let mut circle = get_circle(&env, circle_id)?;
        if circle.status != CircleStatus::Active {
            return Err(Error::CircleNotActive);
        }
        if !circle.members.iter().any(|m| m == member) {
            return Err(Error::NotMember);
        }
        if has_deposited(&env, circle_id, circle.round_index, &member) {
            return Err(Error::AlreadyDepositedThisRound);
        }

        let token_client = TokenClient::new(&env, &circle.token);
        token_client.transfer(
            &member,
            &env.current_contract_address(),
            &circle.contribution_amount,
        );

        set_deposited(&env, circle_id, circle.round_index, &member);
        circle.round_deposit_count += 1;
        set_circle(&env, circle_id, &circle);

        Ok(())
    }

    /// Releases the full round pool to the member whose turn it is, but
    /// only once every member has deposited for the current round.
    /// Callable by anyone — the invariant is enforced by contract state,
    /// not by caller identity, so no single party can block or gate a
    /// payout that is otherwise due.
    pub fn payout(env: Env, circle_id: u64) -> Result<(), Error> {
        let mut circle = get_circle(&env, circle_id)?;
        if circle.status != CircleStatus::Active {
            return Err(Error::CircleNotActive);
        }
        if circle.round_deposit_count != circle.members.len() {
            return Err(Error::RoundNotComplete);
        }

        let recipient = circle.payout_order.get(circle.round_index).unwrap();
        let pool = circle.contribution_amount * (circle.members.len() as i128);

        let token_client = TokenClient::new(&env, &circle.token);
        token_client.transfer(&env.current_contract_address(), &recipient, &pool);

        for m in circle.members.iter() {
            clear_deposited(&env, circle_id, circle.round_index, &m);
        }

        circle.round_index += 1;
        circle.round_deposit_count = 0;
        if circle.round_index == circle.payout_order.len() {
            circle.status = CircleStatus::Completed;
        } else {
            circle.round_deadline = env.ledger().timestamp() + circle.round_timeout_secs;
        }
        set_circle(&env, circle_id, &circle);

        Ok(())
    }

    /// Lets a member individually withdraw their own contribution for the
    /// current round once its deadline has passed. This is the escape
    /// hatch that keeps a stalled round from locking funds indefinitely —
    /// it cannot be blocked by an uncooperative member because it only
    /// ever moves the caller's own deposit.
    pub fn reclaim(env: Env, circle_id: u64, member: Address) -> Result<(), Error> {
        member.require_auth();

        let mut circle = get_circle(&env, circle_id)?;
        if circle.status != CircleStatus::Active {
            return Err(Error::CircleNotActive);
        }
        if env.ledger().timestamp() < circle.round_deadline {
            return Err(Error::RoundNotTimedOut);
        }
        if !has_deposited(&env, circle_id, circle.round_index, &member) {
            return Err(Error::NothingToReclaim);
        }

        clear_deposited(&env, circle_id, circle.round_index, &member);
        circle.round_deposit_count -= 1;
        set_circle(&env, circle_id, &circle);

        let token_client = TokenClient::new(&env, &circle.token);
        token_client.transfer(
            &env.current_contract_address(),
            &member,
            &circle.contribution_amount,
        );

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

    /// Read-only view of whether a member has deposited for the round
    /// currently being funded.
    pub fn has_deposited_current_round(env: Env, circle_id: u64, member: Address) -> Result<bool, Error> {
        let circle = get_circle(&env, circle_id)?;
        Ok(has_deposited(&env, circle_id, circle.round_index, &member))
    }
}

#[cfg(test)]
mod test;
