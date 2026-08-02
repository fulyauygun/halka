use soroban_sdk::{Address, Env};

use crate::errors::Error;
use crate::types::{Circle, DataKey};

const DAY_IN_LEDGERS: u32 = 17280;
const CIRCLE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
const CIRCLE_LIFETIME_THRESHOLD: u32 = CIRCLE_BUMP_AMOUNT - DAY_IN_LEDGERS;

pub fn next_circle_id(env: &Env) -> u64 {
    let key = DataKey::NextCircleId;
    let id: u64 = env.storage().persistent().get(&key).unwrap_or(0);
    env.storage().persistent().set(&key, &(id + 1));
    env.storage()
        .persistent()
        .extend_ttl(&key, CIRCLE_LIFETIME_THRESHOLD, CIRCLE_BUMP_AMOUNT);
    id
}

pub fn set_circle(env: &Env, circle_id: u64, circle: &Circle) {
    let key = DataKey::Circle(circle_id);
    env.storage().persistent().set(&key, circle);
    env.storage()
        .persistent()
        .extend_ttl(&key, CIRCLE_LIFETIME_THRESHOLD, CIRCLE_BUMP_AMOUNT);
}

pub fn get_circle(env: &Env, circle_id: u64) -> Result<Circle, Error> {
    env.storage()
        .persistent()
        .get(&DataKey::Circle(circle_id))
        .ok_or(Error::CircleNotFound)
}

pub fn set_joined(env: &Env, circle_id: u64, member: &Address) {
    let key = DataKey::Joined(circle_id, member.clone());
    env.storage().persistent().set(&key, &true);
    env.storage()
        .persistent()
        .extend_ttl(&key, CIRCLE_LIFETIME_THRESHOLD, CIRCLE_BUMP_AMOUNT);
}

pub fn is_joined(env: &Env, circle_id: u64, member: &Address) -> bool {
    env.storage()
        .persistent()
        .get(&DataKey::Joined(circle_id, member.clone()))
        .unwrap_or(false)
}

pub fn set_deposited(env: &Env, circle_id: u64, round_index: u32, member: &Address) {
    let key = DataKey::Deposited(circle_id, round_index, member.clone());
    env.storage().persistent().set(&key, &true);
    env.storage()
        .persistent()
        .extend_ttl(&key, CIRCLE_LIFETIME_THRESHOLD, CIRCLE_BUMP_AMOUNT);
}

pub fn clear_deposited(env: &Env, circle_id: u64, round_index: u32, member: &Address) {
    env.storage()
        .persistent()
        .remove(&DataKey::Deposited(circle_id, round_index, member.clone()));
}

pub fn has_deposited(env: &Env, circle_id: u64, round_index: u32, member: &Address) -> bool {
    env.storage()
        .persistent()
        .get(&DataKey::Deposited(circle_id, round_index, member.clone()))
        .unwrap_or(false)
}
