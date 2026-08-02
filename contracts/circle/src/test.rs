#![cfg(test)]

use soroban_sdk::{testutils::Address as _, vec, Address, Env};

use crate::{CircleContract, CircleContractClient, CircleStatus, Error};

fn setup(
    env: &Env,
    member_count: u32,
) -> (CircleContractClient<'_>, Address, Address, soroban_sdk::Vec<Address>) {
    env.mock_all_auths();
    let contract_id = env.register(CircleContract, ());
    let client = CircleContractClient::new(env, &contract_id);

    let creator = Address::generate(env);
    let token = Address::generate(env);
    let mut members = soroban_sdk::vec![env];
    for _ in 0..member_count {
        members.push_back(Address::generate(env));
    }

    (client, creator, token, members)
}

#[test]
fn test_create_circle_success() {
    let env = Env::default();
    let (client, creator, token, members) = setup(&env, 3);

    let circle_id = client.create_circle(
        &creator,
        &token,
        &members,
        &members,
        &1_000_i128,
        &86_400_u64,
    );

    let circle = client.get_circle(&circle_id);
    assert_eq!(circle.status, CircleStatus::Forming);
    assert_eq!(circle.round_index, 0);
    assert_eq!(circle.round_deposit_count, 0);
    assert_eq!(circle.members.len(), 3);
    assert_eq!(circle.contribution_amount, 1_000_i128);
}

#[test]
fn test_create_circle_rejects_too_few_members() {
    let env = Env::default();
    let (client, creator, token, members) = setup(&env, 1);

    let result = client.try_create_circle(
        &creator,
        &token,
        &members,
        &members,
        &1_000_i128,
        &86_400_u64,
    );

    assert_eq!(result, Err(Ok(Error::InvalidMemberCount)));
}

#[test]
fn test_create_circle_rejects_duplicate_member() {
    let env = Env::default();
    let (client, creator, token, members) = setup(&env, 2);
    let dup = members.get(0).unwrap();
    let members_with_dup = vec![&env, members.get(0).unwrap(), members.get(1).unwrap(), dup];

    let result = client.try_create_circle(
        &creator,
        &token,
        &members_with_dup,
        &members_with_dup,
        &1_000_i128,
        &86_400_u64,
    );

    assert_eq!(result, Err(Ok(Error::DuplicateMember)));
}

#[test]
fn test_create_circle_rejects_payout_order_mismatch() {
    let env = Env::default();
    let (client, creator, token, members) = setup(&env, 3);
    let outsider = Address::generate(&env);
    let bad_payout_order = vec![
        &env,
        members.get(0).unwrap(),
        members.get(1).unwrap(),
        outsider,
    ];

    let result = client.try_create_circle(
        &creator,
        &token,
        &members,
        &bad_payout_order,
        &1_000_i128,
        &86_400_u64,
    );

    assert_eq!(result, Err(Ok(Error::InvalidPayoutOrder)));
}

#[test]
fn test_join_circle_activates_once_all_members_joined() {
    let env = Env::default();
    let (client, creator, token, members) = setup(&env, 3);
    let circle_id = client.create_circle(
        &creator,
        &token,
        &members,
        &members,
        &1_000_i128,
        &86_400_u64,
    );

    client.join_circle(&circle_id, &members.get(0).unwrap());
    assert_eq!(
        client.get_circle(&circle_id).status,
        CircleStatus::Forming
    );

    client.join_circle(&circle_id, &members.get(1).unwrap());
    client.join_circle(&circle_id, &members.get(2).unwrap());

    let circle = client.get_circle(&circle_id);
    assert_eq!(circle.status, CircleStatus::Active);
    assert!(circle.round_deadline > 0);
}

#[test]
fn test_join_circle_rejects_duplicate_join() {
    let env = Env::default();
    let (client, creator, token, members) = setup(&env, 2);
    let circle_id = client.create_circle(
        &creator,
        &token,
        &members,
        &members,
        &1_000_i128,
        &86_400_u64,
    );
    let member = members.get(0).unwrap();

    client.join_circle(&circle_id, &member);
    let result = client.try_join_circle(&circle_id, &member);

    assert_eq!(result, Err(Ok(Error::AlreadyJoined)));
}

#[test]
fn test_join_circle_rejects_non_member() {
    let env = Env::default();
    let (client, creator, token, members) = setup(&env, 2);
    let circle_id = client.create_circle(
        &creator,
        &token,
        &members,
        &members,
        &1_000_i128,
        &86_400_u64,
    );
    let outsider = Address::generate(&env);

    let result = client.try_join_circle(&circle_id, &outsider);

    assert_eq!(result, Err(Ok(Error::NotMember)));
}

#[test]
fn test_has_joined_reflects_state() {
    let env = Env::default();
    let (client, creator, token, members) = setup(&env, 2);
    let circle_id = client.create_circle(
        &creator,
        &token,
        &members,
        &members,
        &1_000_i128,
        &86_400_u64,
    );
    let member = members.get(0).unwrap();

    assert!(!client.has_joined(&circle_id, &member));
    client.join_circle(&circle_id, &member);
    assert!(client.has_joined(&circle_id, &member));
}
