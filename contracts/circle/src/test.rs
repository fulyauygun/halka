#![cfg(test)]

use soroban_sdk::{
    testutils::{Address as _, Ledger as _},
    token::{StellarAssetClient, TokenClient},
    vec, Address, Env, Vec as SVec,
};

use crate::{CircleContract, CircleContractClient, CircleStatus, Error};

const AMOUNT: i128 = 1_000;
const TIMEOUT: u64 = 86_400;

struct Setup<'a> {
    client: CircleContractClient<'a>,
    creator: Address,
    token: TokenClient<'a>,
    token_admin: StellarAssetClient<'a>,
    members: SVec<Address>,
}

fn setup(env: &Env, member_count: u32) -> Setup<'_> {
    env.mock_all_auths();
    let contract_id = env.register(CircleContract, ());
    let client = CircleContractClient::new(env, &contract_id);

    let creator = Address::generate(env);
    let sac = env.register_stellar_asset_contract_v2(Address::generate(env));
    let token = TokenClient::new(env, &sac.address());
    let token_admin = StellarAssetClient::new(env, &sac.address());

    let mut members = soroban_sdk::vec![env];
    for _ in 0..member_count {
        members.push_back(Address::generate(env));
    }

    Setup {
        client,
        creator,
        token,
        token_admin,
        members,
    }
}

/// Creates a circle, funds every member with enough balance for `rounds`
/// worth of deposits, and joins everyone so the circle becomes `Active`.
fn setup_active_circle(env: &Env, member_count: u32, rounds: u32) -> Setup<'_> {
    let s = setup(env, member_count);
    let circle_id = s.client.create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &s.members,
        &AMOUNT,
        &TIMEOUT,
    );
    assert_eq!(circle_id, 0);

    for m in s.members.iter() {
        s.token_admin.mint(&m, &(AMOUNT * rounds as i128));
        s.client.join_circle(&circle_id, &m);
    }
    assert_eq!(s.client.get_circle(&circle_id).status, CircleStatus::Active);

    s
}

#[test]
fn test_create_circle_success() {
    let env = Env::default();
    let s = setup(&env, 3);

    let circle_id = s.client.create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &s.members,
        &AMOUNT,
        &TIMEOUT,
    );

    let circle = s.client.get_circle(&circle_id);
    assert_eq!(circle.status, CircleStatus::Forming);
    assert_eq!(circle.round_index, 0);
    assert_eq!(circle.round_deposit_count, 0);
    assert_eq!(circle.members.len(), 3);
    assert_eq!(circle.contribution_amount, AMOUNT);
}

#[test]
fn test_create_circle_rejects_too_few_members() {
    let env = Env::default();
    let s = setup(&env, 1);

    let result = s.client.try_create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &s.members,
        &AMOUNT,
        &TIMEOUT,
    );

    assert_eq!(result, Err(Ok(Error::InvalidMemberCount)));
}

#[test]
fn test_create_circle_rejects_duplicate_member() {
    let env = Env::default();
    let s = setup(&env, 2);
    let dup = s.members.get(0).unwrap();
    let members_with_dup = vec![&env, s.members.get(0).unwrap(), s.members.get(1).unwrap(), dup];

    let result = s.client.try_create_circle(
        &s.creator,
        &s.token.address,
        &members_with_dup,
        &members_with_dup,
        &AMOUNT,
        &TIMEOUT,
    );

    assert_eq!(result, Err(Ok(Error::DuplicateMember)));
}

#[test]
fn test_create_circle_rejects_payout_order_mismatch() {
    let env = Env::default();
    let s = setup(&env, 3);
    let outsider = Address::generate(&env);
    let bad_payout_order = vec![
        &env,
        s.members.get(0).unwrap(),
        s.members.get(1).unwrap(),
        outsider,
    ];

    let result = s.client.try_create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &bad_payout_order,
        &AMOUNT,
        &TIMEOUT,
    );

    assert_eq!(result, Err(Ok(Error::InvalidPayoutOrder)));
}

#[test]
#[should_panic]
fn test_create_circle_rejects_unauthorized_caller() {
    let env = Env::default();
    let s = setup(&env, 2);
    env.set_auths(&[]);

    s.client
        .create_circle(&s.creator, &s.token.address, &s.members, &s.members, &AMOUNT, &TIMEOUT);
}

#[test]
fn test_join_circle_activates_once_all_members_joined() {
    let env = Env::default();
    let s = setup(&env, 3);
    let circle_id = s.client.create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &s.members,
        &AMOUNT,
        &TIMEOUT,
    );

    s.client.join_circle(&circle_id, &s.members.get(0).unwrap());
    assert_eq!(s.client.get_circle(&circle_id).status, CircleStatus::Forming);

    s.client.join_circle(&circle_id, &s.members.get(1).unwrap());
    s.client.join_circle(&circle_id, &s.members.get(2).unwrap());

    let circle = s.client.get_circle(&circle_id);
    assert_eq!(circle.status, CircleStatus::Active);
    assert!(circle.round_deadline > 0);
}

#[test]
fn test_join_circle_rejects_duplicate_join() {
    let env = Env::default();
    let s = setup(&env, 2);
    let circle_id = s.client.create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &s.members,
        &AMOUNT,
        &TIMEOUT,
    );
    let member = s.members.get(0).unwrap();

    s.client.join_circle(&circle_id, &member);
    let result = s.client.try_join_circle(&circle_id, &member);

    assert_eq!(result, Err(Ok(Error::AlreadyJoined)));
}

#[test]
fn test_join_circle_rejects_non_member() {
    let env = Env::default();
    let s = setup(&env, 2);
    let circle_id = s.client.create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &s.members,
        &AMOUNT,
        &TIMEOUT,
    );
    let outsider = Address::generate(&env);

    let result = s.client.try_join_circle(&circle_id, &outsider);

    assert_eq!(result, Err(Ok(Error::NotMember)));
}

#[test]
#[should_panic]
fn test_join_circle_rejects_unauthorized_caller() {
    let env = Env::default();
    let s = setup(&env, 2);
    let circle_id = s.client.create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &s.members,
        &AMOUNT,
        &TIMEOUT,
    );
    env.set_auths(&[]);

    s.client.join_circle(&circle_id, &s.members.get(0).unwrap());
}

#[test]
fn test_has_joined_reflects_state() {
    let env = Env::default();
    let s = setup(&env, 2);
    let circle_id = s.client.create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &s.members,
        &AMOUNT,
        &TIMEOUT,
    );
    let member = s.members.get(0).unwrap();

    assert!(!s.client.has_joined(&circle_id, &member));
    s.client.join_circle(&circle_id, &member);
    assert!(s.client.has_joined(&circle_id, &member));
}

#[test]
fn test_deposit_success() {
    let env = Env::default();
    let s = setup_active_circle(&env, 3, 1);
    let member = s.members.get(0).unwrap();
    let contract_address = s.client.address.clone();

    s.client.deposit(&0, &member);

    assert_eq!(s.token.balance(&member), 0);
    assert_eq!(s.token.balance(&contract_address), AMOUNT);
    assert_eq!(s.client.get_circle(&0).round_deposit_count, 1);
    assert!(s.client.has_deposited_current_round(&0, &member));
}

#[test]
fn test_deposit_rejects_when_circle_not_active() {
    let env = Env::default();
    let s = setup(&env, 2);
    let circle_id = s.client.create_circle(
        &s.creator,
        &s.token.address,
        &s.members,
        &s.members,
        &AMOUNT,
        &TIMEOUT,
    );
    let member = s.members.get(0).unwrap();
    s.token_admin.mint(&member, &AMOUNT);

    let result = s.client.try_deposit(&circle_id, &member);

    assert_eq!(result, Err(Ok(Error::CircleNotActive)));
}

#[test]
fn test_deposit_rejects_non_member() {
    let env = Env::default();
    let s = setup_active_circle(&env, 2, 1);
    let outsider = Address::generate(&env);
    s.token_admin.mint(&outsider, &AMOUNT);

    let result = s.client.try_deposit(&0, &outsider);

    assert_eq!(result, Err(Ok(Error::NotMember)));
}

#[test]
fn test_deposit_rejects_duplicate_deposit_same_round() {
    let env = Env::default();
    let s = setup_active_circle(&env, 2, 1);
    let member = s.members.get(0).unwrap();

    s.client.deposit(&0, &member);
    let result = s.client.try_deposit(&0, &member);

    assert_eq!(result, Err(Ok(Error::AlreadyDepositedThisRound)));
}

#[test]
#[should_panic]
fn test_deposit_rejects_unauthorized_caller() {
    let env = Env::default();
    let s = setup_active_circle(&env, 2, 1);
    let member = s.members.get(0).unwrap();
    env.set_auths(&[]);

    s.client.deposit(&0, &member);
}

#[test]
fn test_payout_rejects_round_not_complete() {
    let env = Env::default();
    let s = setup_active_circle(&env, 3, 1);
    s.client.deposit(&0, &s.members.get(0).unwrap());
    s.client.deposit(&0, &s.members.get(1).unwrap());

    let result = s.client.try_payout(&0);

    assert_eq!(result, Err(Ok(Error::RoundNotComplete)));
}

#[test]
fn test_full_cycle_happy_path() {
    let env = Env::default();
    let member_count = 3u32;
    let s = setup_active_circle(&env, member_count, member_count);
    let pool = AMOUNT * member_count as i128;

    for round in 0..member_count {
        for m in s.members.iter() {
            s.client.deposit(&0, &m);
        }
        assert_eq!(s.client.get_circle(&0).round_deposit_count, member_count);

        let recipient = s.members.get(round).unwrap();
        let balance_before = s.token.balance(&recipient);

        s.client.payout(&0);

        assert_eq!(s.token.balance(&recipient), balance_before + pool);

        let circle = s.client.get_circle(&0);
        assert_eq!(circle.round_deposit_count, 0);
        if round + 1 == member_count {
            assert_eq!(circle.status, CircleStatus::Completed);
        } else {
            assert_eq!(circle.round_index, round + 1);
            assert_eq!(circle.status, CircleStatus::Active);
        }
    }
}

#[test]
fn test_reclaim_after_timeout_returns_funds() {
    let env = Env::default();
    let s = setup_active_circle(&env, 2, 1);
    let member = s.members.get(0).unwrap();
    let contract_address = s.client.address.clone();

    s.client.deposit(&0, &member);
    assert_eq!(s.token.balance(&contract_address), AMOUNT);

    let deadline = s.client.get_circle(&0).round_deadline;
    env.ledger().set_timestamp(deadline);

    s.client.reclaim(&0, &member);

    assert_eq!(s.token.balance(&member), AMOUNT);
    assert_eq!(s.token.balance(&contract_address), 0);
    assert_eq!(s.client.get_circle(&0).round_deposit_count, 0);
    assert!(!s.client.has_deposited_current_round(&0, &member));
}

#[test]
fn test_reclaim_rejects_before_timeout() {
    let env = Env::default();
    let s = setup_active_circle(&env, 2, 1);
    let member = s.members.get(0).unwrap();
    s.client.deposit(&0, &member);

    let result = s.client.try_reclaim(&0, &member);

    assert_eq!(result, Err(Ok(Error::RoundNotTimedOut)));
}

#[test]
fn test_reclaim_rejects_nothing_to_reclaim() {
    let env = Env::default();
    let s = setup_active_circle(&env, 2, 1);
    let member = s.members.get(0).unwrap();

    let deadline = s.client.get_circle(&0).round_deadline;
    env.ledger().set_timestamp(deadline);

    let result = s.client.try_reclaim(&0, &member);

    assert_eq!(result, Err(Ok(Error::NothingToReclaim)));
}

#[test]
#[should_panic]
fn test_reclaim_rejects_unauthorized_caller() {
    let env = Env::default();
    let s = setup_active_circle(&env, 2, 1);
    let member = s.members.get(0).unwrap();
    s.client.deposit(&0, &member);
    let deadline = s.client.get_circle(&0).round_deadline;
    env.ledger().set_timestamp(deadline);
    env.set_auths(&[]);

    s.client.reclaim(&0, &member);
}
