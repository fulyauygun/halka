use soroban_sdk::{contracttype, Address, Vec};

/// A round only starts counting toward its timeout once every member has
/// joined and the circle becomes `Active`. `Forming` circles never expire.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CircleStatus {
    Forming,
    Active,
    Completed,
}

#[contracttype]
#[derive(Clone)]
pub struct Circle {
    pub creator: Address,
    pub token: Address,
    pub members: Vec<Address>,
    /// Permutation of `members` fixing the payout rotation order.
    pub payout_order: Vec<Address>,
    pub contribution_amount: i128,
    /// Index into `payout_order` for the round currently being funded.
    pub round_index: u32,
    pub round_deposit_count: u32,
    /// Ledger timestamp after which the current round's deposits become
    /// individually reclaimable. Meaningless while `status == Forming`.
    pub round_deadline: u64,
    pub round_timeout_secs: u64,
    pub status: CircleStatus,
}

#[contracttype]
pub enum DataKey {
    NextCircleId,
    Circle(u64),
    Joined(u64, Address),
    Deposited(u64, u32, Address),
}
