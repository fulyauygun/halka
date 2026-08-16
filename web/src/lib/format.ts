export function formatTokenAmount(stroops: bigint, decimals = 7): string {
  const negative = stroops < 0n;
  const abs = negative ? -stroops : stroops;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const frac = abs % base;
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  const sign = negative ? "-" : "";
  return fracStr ? `${sign}${whole}.${fracStr}` : `${sign}${whole}`;
}

export function parseTokenAmount(input: string, decimals = 7): bigint {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Amount cannot be empty.");
  const [wholePart, fracPart = ""] = trimmed.split(".");
  if (!/^\d*$/.test(wholePart) || !/^\d*$/.test(fracPart) || (!wholePart && !fracPart)) {
    throw new Error("Invalid amount.");
  }
  const paddedFrac = (fracPart + "0".repeat(decimals)).slice(0, decimals);
  const whole = wholePart ? BigInt(wholePart) : 0n;
  const frac = paddedFrac ? BigInt(paddedFrac) : 0n;
  const amount = whole * 10n ** BigInt(decimals) + frac;
  if (amount <= 0n) throw new Error("Amount must be greater than zero.");
  return amount;
}

export function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
