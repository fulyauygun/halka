use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InvalidMemberCount = 1,
    DuplicateMember = 2,
    InvalidPayoutOrder = 3,
    InvalidAmount = 4,
    InvalidTimeout = 5,
    CircleNotFound = 6,
    CircleNotForming = 7,
    CircleNotActive = 8,
    NotMember = 9,
    AlreadyJoined = 10,
    AlreadyDepositedThisRound = 11,
    RoundNotComplete = 12,
    RoundNotTimedOut = 13,
    NothingToReclaim = 14,
}
