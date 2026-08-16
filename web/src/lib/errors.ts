const CONTRACT_ERROR_MESSAGES: Record<string, string> = {
  InvalidMemberCount: "A circle must have at least 2 members.",
  DuplicateMember: "The member list has the same address more than once.",
  InvalidPayoutOrder: "The payout order must be a permutation of the member list.",
  InvalidAmount: "The contribution amount must be greater than zero.",
  InvalidTimeout: "Round duration must be greater than zero.",
  CircleNotFound: "This circle could not be found.",
  CircleNotForming: "This circle is no longer open for joining (it's already active or completed).",
  CircleNotActive: "This circle isn't active yet — waiting for all members to join.",
  NotMember: "This address is not a member of this circle.",
  AlreadyJoined: "This member has already joined.",
  AlreadyDepositedThisRound: "You've already deposited your contribution for this round.",
  RoundNotComplete: "Not all members have contributed for this round yet.",
  RoundNotTimedOut: "The reclaim window for this round hasn't opened yet.",
  NothingToReclaim: "You have no contribution to reclaim.",
};

/** Maps a contract Error variant name (e.g. "NotMember") to a plain-language message. */
export function contractErrorMessage(name: string | undefined): string {
  if (!name) return "An unknown contract error occurred.";
  return CONTRACT_ERROR_MESSAGES[name] ?? name;
}

/** Turns any thrown error (wallet rejection, network failure, contract
 * error) into a message safe to show the user directly. */
export function describeError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (lower.includes("user declined") || lower.includes("rejected")) {
    return "The transaction was not approved in the wallet.";
  }
  if (lower.includes("freighter") && lower.includes("not")) {
    return "Freighter wallet extension not found. Please install it from freighter.app.";
  }
  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Network error — could not reach the Stellar testnet. Please try again.";
  }

  for (const [name, message] of Object.entries(CONTRACT_ERROR_MESSAGES)) {
    if (raw.includes(name)) return message;
  }

  return raw;
}
