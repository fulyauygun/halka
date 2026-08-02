import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q",
  }
} as const


export interface Circle {
  contribution_amount: i128;
  creator: string;
  members: Array<string>;
  /**
 * Permutation of `members` fixing the payout rotation order.
 */
payout_order: Array<string>;
  /**
 * Ledger timestamp after which the current round's deposits become
 * individually reclaimable. Meaningless while `status == Forming`.
 */
round_deadline: u64;
  round_deposit_count: u32;
  /**
 * Index into `payout_order` for the round currently being funded.
 */
round_index: u32;
  round_timeout_secs: u64;
  status: CircleStatus;
  token: string;
}

export type DataKey = {tag: "NextCircleId", values: void} | {tag: "Circle", values: readonly [u64]} | {tag: "Joined", values: readonly [u64, string]} | {tag: "Deposited", values: readonly [u64, u32, string]};

/**
 * A round only starts counting toward its timeout once every member has
 * joined and the circle becomes `Active`. `Forming` circles never expire.
 */
export type CircleStatus = {tag: "Forming", values: void} | {tag: "Active", values: void} | {tag: "Completed", values: void};

export const Errors = {
  1: {message:"InvalidMemberCount"},
  2: {message:"DuplicateMember"},
  3: {message:"InvalidPayoutOrder"},
  4: {message:"InvalidAmount"},
  5: {message:"InvalidTimeout"},
  6: {message:"CircleNotFound"},
  7: {message:"CircleNotForming"},
  8: {message:"CircleNotActive"},
  9: {message:"NotMember"},
  10: {message:"AlreadyJoined"},
  11: {message:"AlreadyDepositedThisRound"},
  12: {message:"RoundNotComplete"},
  13: {message:"RoundNotTimedOut"},
  14: {message:"NothingToReclaim"}
}

export interface Client {
  /**
   * Construct and simulate a payout transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Releases the full round pool to the member whose turn it is, but
   * only once every member has deposited for the current round.
   * Callable by anyone — the invariant is enforced by contract state,
   * not by caller identity, so no single party can block or gate a
   * payout that is otherwise due.
   */
  payout: ({circle_id}: {circle_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pays a member's fixed contribution into the contract for the round
   * currently being funded. Rejects non-members, members who already
   * deposited this round, and circles that are not yet `Active`.
   */
  deposit: ({circle_id, member}: {circle_id: u64, member: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a reclaim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Lets a member individually withdraw their own contribution for the
   * current round once its deadline has passed. This is the escape
   * hatch that keeps a stalled round from locking funds indefinitely —
   * it cannot be blocked by an uncooperative member because it only
   * ever moves the caller's own deposit.
   */
  reclaim: ({circle_id, member}: {circle_id: u64, member: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_circle transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Read-only view of a circle's full state.
   */
  get_circle: ({circle_id}: {circle_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Circle>>>

  /**
   * Construct and simulate a has_joined transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Read-only view of whether a member has confirmed participation.
   */
  has_joined: ({circle_id, member}: {circle_id: u64, member: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a join_circle transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Confirms an invited member's participation. Once every member listed
   * at creation has joined, the circle becomes `Active` and its first
   * round timeout starts counting.
   */
  join_circle: ({circle_id, member}: {circle_id: u64, member: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a create_circle transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Creates a circle with a fixed, invite-only member list and a fixed
   * payout rotation order. The circle starts in `Forming` status — no
   * round timeout runs and no deposits are accepted until every listed
   * member has called `join_circle`.
   */
  create_circle: ({creator, token, members, payout_order, contribution_amount, round_timeout_secs}: {creator: string, token: string, members: Array<string>, payout_order: Array<string>, contribution_amount: i128, round_timeout_secs: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<u64>>>

  /**
   * Construct and simulate a has_deposited_current_round transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Read-only view of whether a member has deposited for the round
   * currently being funded.
   */
  has_deposited_current_round: ({circle_id, member}: {circle_id: u64, member: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<boolean>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAR1SZWxlYXNlcyB0aGUgZnVsbCByb3VuZCBwb29sIHRvIHRoZSBtZW1iZXIgd2hvc2UgdHVybiBpdCBpcywgYnV0Cm9ubHkgb25jZSBldmVyeSBtZW1iZXIgaGFzIGRlcG9zaXRlZCBmb3IgdGhlIGN1cnJlbnQgcm91bmQuCkNhbGxhYmxlIGJ5IGFueW9uZSDigJQgdGhlIGludmFyaWFudCBpcyBlbmZvcmNlZCBieSBjb250cmFjdCBzdGF0ZSwKbm90IGJ5IGNhbGxlciBpZGVudGl0eSwgc28gbm8gc2luZ2xlIHBhcnR5IGNhbiBibG9jayBvciBnYXRlIGEKcGF5b3V0IHRoYXQgaXMgb3RoZXJ3aXNlIGR1ZS4AAAAAAAAGcGF5b3V0AAAAAAABAAAAAAAAAAljaXJjbGVfaWQAAAAAAAAGAAAAAQAAA+kAAAACAAAAAw==",
        "AAAAAAAAAMBQYXlzIGEgbWVtYmVyJ3MgZml4ZWQgY29udHJpYnV0aW9uIGludG8gdGhlIGNvbnRyYWN0IGZvciB0aGUgcm91bmQKY3VycmVudGx5IGJlaW5nIGZ1bmRlZC4gUmVqZWN0cyBub24tbWVtYmVycywgbWVtYmVycyB3aG8gYWxyZWFkeQpkZXBvc2l0ZWQgdGhpcyByb3VuZCwgYW5kIGNpcmNsZXMgdGhhdCBhcmUgbm90IHlldCBgQWN0aXZlYC4AAAAHZGVwb3NpdAAAAAACAAAAAAAAAAljaXJjbGVfaWQAAAAAAAAGAAAAAAAAAAZtZW1iZXIAAAAAABMAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAStMZXRzIGEgbWVtYmVyIGluZGl2aWR1YWxseSB3aXRoZHJhdyB0aGVpciBvd24gY29udHJpYnV0aW9uIGZvciB0aGUKY3VycmVudCByb3VuZCBvbmNlIGl0cyBkZWFkbGluZSBoYXMgcGFzc2VkLiBUaGlzIGlzIHRoZSBlc2NhcGUKaGF0Y2ggdGhhdCBrZWVwcyBhIHN0YWxsZWQgcm91bmQgZnJvbSBsb2NraW5nIGZ1bmRzIGluZGVmaW5pdGVseSDigJQKaXQgY2Fubm90IGJlIGJsb2NrZWQgYnkgYW4gdW5jb29wZXJhdGl2ZSBtZW1iZXIgYmVjYXVzZSBpdCBvbmx5CmV2ZXIgbW92ZXMgdGhlIGNhbGxlcidzIG93biBkZXBvc2l0LgAAAAAHcmVjbGFpbQAAAAACAAAAAAAAAAljaXJjbGVfaWQAAAAAAAAGAAAAAAAAAAZtZW1iZXIAAAAAABMAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAChSZWFkLW9ubHkgdmlldyBvZiBhIGNpcmNsZSdzIGZ1bGwgc3RhdGUuAAAACmdldF9jaXJjbGUAAAAAAAEAAAAAAAAACWNpcmNsZV9pZAAAAAAAAAYAAAABAAAD6QAAB9AAAAAGQ2lyY2xlAAAAAAAD",
        "AAAAAAAAAD9SZWFkLW9ubHkgdmlldyBvZiB3aGV0aGVyIGEgbWVtYmVyIGhhcyBjb25maXJtZWQgcGFydGljaXBhdGlvbi4AAAAACmhhc19qb2luZWQAAAAAAAIAAAAAAAAACWNpcmNsZV9pZAAAAAAAAAYAAAAAAAAABm1lbWJlcgAAAAAAEwAAAAEAAAAB",
        "AAAAAAAAAKVDb25maXJtcyBhbiBpbnZpdGVkIG1lbWJlcidzIHBhcnRpY2lwYXRpb24uIE9uY2UgZXZlcnkgbWVtYmVyIGxpc3RlZAphdCBjcmVhdGlvbiBoYXMgam9pbmVkLCB0aGUgY2lyY2xlIGJlY29tZXMgYEFjdGl2ZWAgYW5kIGl0cyBmaXJzdApyb3VuZCB0aW1lb3V0IHN0YXJ0cyBjb3VudGluZy4AAAAAAAALam9pbl9jaXJjbGUAAAAAAgAAAAAAAAAJY2lyY2xlX2lkAAAAAAAABgAAAAAAAAAGbWVtYmVyAAAAAAATAAAAAQAAA+kAAAACAAAAAw==",
        "AAAAAAAAAOpDcmVhdGVzIGEgY2lyY2xlIHdpdGggYSBmaXhlZCwgaW52aXRlLW9ubHkgbWVtYmVyIGxpc3QgYW5kIGEgZml4ZWQKcGF5b3V0IHJvdGF0aW9uIG9yZGVyLiBUaGUgY2lyY2xlIHN0YXJ0cyBpbiBgRm9ybWluZ2Agc3RhdHVzIOKAlCBubwpyb3VuZCB0aW1lb3V0IHJ1bnMgYW5kIG5vIGRlcG9zaXRzIGFyZSBhY2NlcHRlZCB1bnRpbCBldmVyeSBsaXN0ZWQKbWVtYmVyIGhhcyBjYWxsZWQgYGpvaW5fY2lyY2xlYC4AAAAAAA1jcmVhdGVfY2lyY2xlAAAAAAAABgAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAAB21lbWJlcnMAAAAD6gAAABMAAAAAAAAADHBheW91dF9vcmRlcgAAA+oAAAATAAAAAAAAABNjb250cmlidXRpb25fYW1vdW50AAAAAAsAAAAAAAAAEnJvdW5kX3RpbWVvdXRfc2VjcwAAAAAABgAAAAEAAAPpAAAABgAAAAM=",
        "AAAAAAAAAFZSZWFkLW9ubHkgdmlldyBvZiB3aGV0aGVyIGEgbWVtYmVyIGhhcyBkZXBvc2l0ZWQgZm9yIHRoZSByb3VuZApjdXJyZW50bHkgYmVpbmcgZnVuZGVkLgAAAAAAG2hhc19kZXBvc2l0ZWRfY3VycmVudF9yb3VuZAAAAAACAAAAAAAAAAljaXJjbGVfaWQAAAAAAAAGAAAAAAAAAAZtZW1iZXIAAAAAABMAAAABAAAD6QAAAAEAAAAD",
        "AAAAAQAAAAAAAAAAAAAABkNpcmNsZQAAAAAACgAAAAAAAAATY29udHJpYnV0aW9uX2Ftb3VudAAAAAALAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAAB21lbWJlcnMAAAAD6gAAABMAAAA6UGVybXV0YXRpb24gb2YgYG1lbWJlcnNgIGZpeGluZyB0aGUgcGF5b3V0IHJvdGF0aW9uIG9yZGVyLgAAAAAADHBheW91dF9vcmRlcgAAA+oAAAATAAAAgUxlZGdlciB0aW1lc3RhbXAgYWZ0ZXIgd2hpY2ggdGhlIGN1cnJlbnQgcm91bmQncyBkZXBvc2l0cyBiZWNvbWUKaW5kaXZpZHVhbGx5IHJlY2xhaW1hYmxlLiBNZWFuaW5nbGVzcyB3aGlsZSBgc3RhdHVzID09IEZvcm1pbmdgLgAAAAAAAA5yb3VuZF9kZWFkbGluZQAAAAAABgAAAAAAAAATcm91bmRfZGVwb3NpdF9jb3VudAAAAAAEAAAAP0luZGV4IGludG8gYHBheW91dF9vcmRlcmAgZm9yIHRoZSByb3VuZCBjdXJyZW50bHkgYmVpbmcgZnVuZGVkLgAAAAALcm91bmRfaW5kZXgAAAAABAAAAAAAAAAScm91bmRfdGltZW91dF9zZWNzAAAAAAAGAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAAMQ2lyY2xlU3RhdHVzAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAADE5leHRDaXJjbGVJZAAAAAEAAAAAAAAABkNpcmNsZQAAAAAAAQAAAAYAAAABAAAAAAAAAAZKb2luZWQAAAAAAAIAAAAGAAAAEwAAAAEAAAAAAAAACURlcG9zaXRlZAAAAAAAAAMAAAAGAAAABAAAABM=",
        "AAAAAgAAAI1BIHJvdW5kIG9ubHkgc3RhcnRzIGNvdW50aW5nIHRvd2FyZCBpdHMgdGltZW91dCBvbmNlIGV2ZXJ5IG1lbWJlciBoYXMKam9pbmVkIGFuZCB0aGUgY2lyY2xlIGJlY29tZXMgYEFjdGl2ZWAuIGBGb3JtaW5nYCBjaXJjbGVzIG5ldmVyIGV4cGlyZS4AAAAAAAAAAAAADENpcmNsZVN0YXR1cwAAAAMAAAAAAAAAAAAAAAdGb3JtaW5nAAAAAAAAAAAAAAAABkFjdGl2ZQAAAAAAAAAAAAAAAAAJQ29tcGxldGVkAAAA",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAADgAAAAAAAAASSW52YWxpZE1lbWJlckNvdW50AAAAAAABAAAAAAAAAA9EdXBsaWNhdGVNZW1iZXIAAAAAAgAAAAAAAAASSW52YWxpZFBheW91dE9yZGVyAAAAAAADAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAABAAAAAAAAAAOSW52YWxpZFRpbWVvdXQAAAAAAAUAAAAAAAAADkNpcmNsZU5vdEZvdW5kAAAAAAAGAAAAAAAAABBDaXJjbGVOb3RGb3JtaW5nAAAABwAAAAAAAAAPQ2lyY2xlTm90QWN0aXZlAAAAAAgAAAAAAAAACU5vdE1lbWJlcgAAAAAAAAkAAAAAAAAADUFscmVhZHlKb2luZWQAAAAAAAAKAAAAAAAAABlBbHJlYWR5RGVwb3NpdGVkVGhpc1JvdW5kAAAAAAAACwAAAAAAAAAQUm91bmROb3RDb21wbGV0ZQAAAAwAAAAAAAAAEFJvdW5kTm90VGltZWRPdXQAAAANAAAAAAAAABBOb3RoaW5nVG9SZWNsYWltAAAADg==" ]),
      options
    )
  }
  public readonly fromJSON = {
    payout: this.txFromJSON<Result<void>>,
        deposit: this.txFromJSON<Result<void>>,
        reclaim: this.txFromJSON<Result<void>>,
        get_circle: this.txFromJSON<Result<Circle>>,
        has_joined: this.txFromJSON<boolean>,
        join_circle: this.txFromJSON<Result<void>>,
        create_circle: this.txFromJSON<Result<u64>>,
        has_deposited_current_round: this.txFromJSON<Result<boolean>>
  }
}