export const RPC_URL = "https://soroban-testnet.stellar.org";

/** Native XLM's Stellar Asset Contract on testnet — every funded testnet
 * account already has a balance, so it needs no faucet/trustline setup. */
export const NATIVE_TOKEN_ID =
  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

/** Circle's official testnet USDC Stellar Asset Contract. Requires the
 * member's wallet to hold testnet USDC (see https://faucet.circle.com). */
export const USDC_TOKEN_ID =
  "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";

export const TOKEN_OPTIONS = [
  { id: NATIVE_TOKEN_ID, label: "XLM (testnet, faucet gerektirmez)", decimals: 7 },
  { id: USDC_TOKEN_ID, label: "USDC (testnet, faucet.circle.com gerekir)", decimals: 7 },
] as const;

export function stellarExpertTxUrl(hash: string) {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}

export function stellarExpertAddressUrl(address: string) {
  return `https://stellar.expert/explorer/testnet/account/${address}`;
}
