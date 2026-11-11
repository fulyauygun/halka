import assert from "node:assert/strict";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { Keypair } from "@stellar/stellar-sdk";
import { KeypairSigner } from "@stellar/stellar-sdk/contract";

import { Client, Errors, networks } from "../src/lib/contracts/circle.js";
import { NATIVE_TOKEN_ID, RPC_URL } from "../src/lib/config.js";

const secrets = [
  process.env.HALKA_TESTNET_CREATOR_SECRET,
  process.env.HALKA_TESTNET_MEMBER1_SECRET,
  process.env.HALKA_TESTNET_MEMBER2_SECRET,
  process.env.HALKA_TESTNET_OUTSIDER_SECRET,
];
assert(secrets.every(Boolean), "Set HALKA_TESTNET_CREATOR_SECRET, HALKA_TESTNET_MEMBER1_SECRET, HALKA_TESTNET_MEMBER2_SECRET, and HALKA_TESTNET_OUTSIDER_SECRET.");

const [creator, member1, member2, outsider] = secrets.map((secret) => Keypair.fromSecret(secret!));
const accounts = [creator, member1, member2, outsider];
const clients = accounts.map((keypair) => new Client({
  contractId: networks.testnet.contractId,
  networkPassphrase: networks.testnet.networkPassphrase,
  rpcUrl: RPC_URL,
  errorTypes: Errors,
  publicKey: keypair.publicKey(),
  signTransaction: new KeypairSigner(keypair, networks.testnet.networkPassphrase),
}));
const [creatorClient, member1Client, member2Client, outsiderClient] = clients;
const logPath = path.resolve(process.env.HALKA_TX_LOG ?? "../docs/testnet-regression.jsonl");

async function record(scenario: string, outcome: string, txHash?: string) {
  const line = JSON.stringify({ at: new Date().toISOString(), scenario, outcome, txHash: txHash ?? null });
  await mkdir(path.dirname(logPath), { recursive: true });
  await appendFile(logPath, `${line}\n`);
  console.log(line);
}

async function submit(scenario: string, tx: Awaited<ReturnType<typeof creatorClient.payout>>) {
  assert.equal(tx.result.isErr(), false, `${scenario}: transaction preflight returned a contract error`);
  const sent = await tx.signAndSend();
  assert.equal(sent.getTransactionResponse?.status, "SUCCESS", `${scenario}: transaction did not succeed`);
  await record(scenario, "passed", sent.sendTransactionResponse?.hash);
}

async function rejected(scenario: string, expected: string, build: () => Promise<{ result: { isErr(): boolean; unwrapErr(): { message: string } } }>) {
  let message = "";
  try {
    const tx = await build();
    if (tx.result.isErr()) message = tx.result.unwrapErr().message;
  } catch (error) {
    message = error instanceof Error ? error.message : String(error);
  }
  assert(message.includes(expected), `${scenario}: expected ${expected}, got ${message || "no rejection"}`);
  await record(scenario, `rejected:${expected}`);
}

async function circle(timeoutSeconds: bigint) {
  const members = [creator.publicKey(), member1.publicKey(), member2.publicKey()];
  const created = await creatorClient.create_circle({
    creator: members[0], token: NATIVE_TOKEN_ID, members,
    payout_order: members, contribution_amount: 10_000_000n,
    round_timeout_secs: timeoutSeconds,
  });
  assert.equal(created.result.isErr(), false, "create_circle failed simulation");
  const sent = await created.signAndSend();
  assert.equal(sent.getTransactionResponse?.status, "SUCCESS", "create_circle failed on testnet");
  const id = created.result.unwrap();
  await record(`create_circle:${id}`, "passed", sent.sendTransactionResponse?.hash);
  for (const [index, client] of clients.slice(0, 3).entries()) {
    await submit(`join_circle:${id}:member${index + 1}`, await client.join_circle({ circle_id: id, member: members[index] }));
  }
  return id;
}

async function main() {
  await mkdir(path.dirname(logPath), { recursive: true });
  await appendFile(logPath, "");

  const lifecycleId = await circle(120n);
  await rejected("payout_before_complete", "RoundNotComplete", () => creatorClient.payout({ circle_id: lifecycleId }));
  await rejected("non_member_deposit", "NotMember", () => outsiderClient.deposit({ circle_id: lifecycleId, member: outsider.publicKey() }));

  await submit("deposit:lifecycle:member1", await member1Client.deposit({ circle_id: lifecycleId, member: member1.publicKey() }));
  await rejected("duplicate_deposit", "AlreadyDepositedThisRound", () => member1Client.deposit({ circle_id: lifecycleId, member: member1.publicKey() }));
  await rejected("reclaim_before_timeout", "RoundNotTimedOut", () => member1Client.reclaim({ circle_id: lifecycleId, member: member1.publicKey() }));
  await submit("deposit:lifecycle:member2", await member2Client.deposit({ circle_id: lifecycleId, member: member2.publicKey() }));
  await submit("deposit:lifecycle:creator", await creatorClient.deposit({ circle_id: lifecycleId, member: creator.publicKey() }));
  await submit("payout:lifecycle", await creatorClient.payout({ circle_id: lifecycleId }));

  const reclaimId = await circle(8n);
  await submit("deposit:reclaim:member1", await member1Client.deposit({ circle_id: reclaimId, member: member1.publicKey() }));
  const stateTx = await creatorClient.get_circle({ circle_id: reclaimId });
  assert.equal(stateTx.result.isErr(), false);
  const deadlineMs = Number(stateTx.result.unwrap().round_deadline) * 1000;
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, deadlineMs - Date.now() + 500)));
  await rejected("reclaim_non_depositor", "NothingToReclaim", () => member2Client.reclaim({ circle_id: reclaimId, member: member2.publicKey() }));
  await submit("reclaim_after_timeout:recorded_depositor", await member1Client.reclaim({ circle_id: reclaimId, member: member1.publicKey() }));
}

main().catch(async (error: unknown) => {
  await record("harness", `failed:${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
