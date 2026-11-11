# Halka product analysis — desk review

**Review date:** 2026-11-11  
**Evidence base:** public repository and a read-only check of the listed production URL.  
**Evidence limit:** This is a product/code review, separate from the five-interview synthesis at [`interview-synthesis.md`](interview-synthesis.md). Interview signals do not validate usability or market demand.

## Current product state

- The Soroban contract and testnet records demonstrate the fixed-circle lifecycle: create, join,
  contribute, payout, and timeout reclaim.
- The web app source uses English copy and declares `lang="en"`.
- The app source integrates Stellar Wallets Kit for Freighter/Varial, Albedo, and Hana. Manual
  compatibility testing with those wallets is still outstanding.
- Deposit, payout, and reclaim check live contract state and simulate the contract call before
  asking a connected wallet to sign.
- Before this review, the dashboard exposed the payout action only after every member had
  deposited. A participant therefore could not deliberately inspect the incomplete-payout error
  through the normal UI. A read-only “Check why payout is unavailable” action has now been added;
  it runs Soroban simulation and never signs or submits a transaction.
- The app source does not currently show a prominent plain-language explanation of the key
  custody boundary. The repository documents the boundary, but user comprehension still needs to
  be observed during sessions.

## H1–H4 product evidence and unresolved customer questions

| Hypothesis | What product evidence shows | What remains unknown | Provisional product implication |
| --- | --- | --- | --- |
| H1 — coordination and trust problem | Contract state and dashboard can represent membership, contribution status, round, and payout order. | Whether organizers experience these issues often or urgently, how groups handle disputes, and whether existing tools suffice. | Use the reported interview signals to guide follow-up on real workflows and workarounds; do not broaden the product until source notes and usability evidence support it. Do not expand financial mechanics based on assumption. |
| H2 — wallet barrier | Multiple wallet paths are implemented in source. | Whether participants can find, connect, and use a supported wallet; which wallets they already know; where they stop or request help. | Run the planned wallet sessions before adding more wallet integrations. Record availability and fallback by wallet. |
| H3 — transaction explanation | Live-state checks and Soroban simulation map contract errors to plain language. Incomplete payout now has a visible, read-only simulation path. | Whether participants notice, understand, and trust the explanation; whether it reduces confusion or failed attempts. | Observe the same incomplete-round task with participants and record their own explanation before moderator help. |
| H4 — trust boundary | Signing is delegated to the external wallet; the application does not store secrets. | Whether users notice this boundary, believe it, or remain more concerned about contract risk, group behavior, or wallet unfamiliarity. | Ask for the participant's own explanation before and after the moderator's factual security explanation; do not equate architecture with trust. |

## Live Vercel language check

On 2026-11-11, `https://web-psi-liart-24.vercel.app` returned HTTP 200 but served Turkish HTML
(`lang="tr"`, title “Halka — Dijital Altın Günü”). The current repository source is English. The
other Vercel URL listed in the repository About area, `https://halka-sage.vercel.app`, returned
HTTP 404 in the same read-only check. Therefore the source language and production deployment are
currently out of sync.

The available Vercel CLI account is authenticated but lists only the unrelated `guardrail-console`
project; it cannot inspect or deploy the Halka project. Do not create a new project or claim the
production site is English. The existing Halka Vercel project owner must reconnect/grant the correct
project access or the repository's Vercel integration must be corrected, then the production URL
must be checked again.

## Current decisions and next evidence

1. Keep the existing contract mechanics and testnet-only scope unchanged while usability evidence is gathered.
2. Use the new read-only payout simulation path to test H3 without asking a participant to sign an
   invalid call.
3. Use the source's English interface for sessions only with participants able to read it; record
   language difficulty separately so it is not misattributed to wallet or transaction complexity.
4. Resolve the production deployment mismatch before presenting the Vercel URL as the English
   prototype.
5. Five interviews are summarized; reconcile the IDs with source notes where available. After three usability sessions, update [`learning-log.md`](learning-log.md) with source-linked observations. Interview signals alone do not validate H1–H4.
