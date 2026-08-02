# UI demo + video runbook (Deliverable 3, optional)

The correctness of the contract and web app is already proven: the
[Week 2 CLI verification](week2-e2e-verification.md) and the
[Week 4 5-member/5-round full cycle](week4-demo-tx-log.md) both ran on real testnet, and every
transaction is independently verifiable on stellar.expert. This document is a runbook for
completing the SOW's Deliverable 3 in its **literal format** — a 5-round demo clicked through
the web app with a real wallet, plus a screen recording — using your own Freighter wallet. This
step requires entering a private key and approving wallet transactions, so it can't be automated.

Estimated time: 20-30 minutes (excluding recording).

## 1. Prep

- Install the [Freighter](https://freighter.app) browser extension.
- Switch its network to **Testnet** in Freighter's settings.
- Set up a screen recording tool (macOS: QuickTime "New Screen Recording", or OBS).

## 2. Import the test wallets into Freighter

Get the secret keys for this project's 5 test accounts locally with these commands (not
committed to the repo, stays on your machine only):

```bash
for m in member1 member2 member3 member4 member5; do
  echo "$m: $(stellar keys secret $m)"
done
```

In Freighter, use **"Add another wallet" → "Import secret key"** to add each one as a separate
account (5 accounts inside a single Freighter install — you can switch between them from the
extension).

## 3. Create a new circle (a fresh run for the live demo)

Live app: **https://web-psi-liart-24.vercel.app**

circle_id 0 and 1 are already used/completed — you'll create a fresh circle_id (likely `2`) for
the video.

1. In Freighter, switch to the **member1** account, connect to the site.
2. On the home page, fill in the "Create a new circle" form:
   - Members: member1, member2, member3, member4, member5's G… addresses (`stellar keys public-key member1`, etc.)
   - Token: **XLM (testnet, no faucet needed)** — so you can proceed right away without waiting on a faucet
   - Round duration: keep it short (e.g. 1 hour) — you won't actually be waiting during the demo anyway
   - Contribution amount: a small value (e.g. 1)
3. Click "Create circle" and approve the signature in Freighter. You'll land on `/circle/{id}` —
   note that ID.

## 4. Join — 5 times

For each member:

1. Switch to that account in Freighter (member2, member3, member4, member5 in turn — member1
   didn't implicitly join when creating the circle, so it needs to join too).
2. Use the dashboard's "Copy invite link" or go directly to `/circle/{id}/join`.
3. Click "Join" and approve in Freighter.

Once all 5 members have joined, the circle automatically becomes **Active**.

## 5. Deposit + payout across 5 rounds

For each round (repeat 5 times):

1. Switch through member1 → member5 in turn, clicking **"Deposit contribution"** on the
   dashboard for each and approving in Freighter.
2. Once all 5 have deposited, the **"Trigger payout"** button appears — you can trigger it from
   any connected account (usually whoever made the last deposit).
3. Show the "Payout history" section updating and the round advancing on the dashboard.

After round 5, the circle moves to **Completed** and "Payout history" shows all 5 entries.

## 6. Video

- To fit 3-4 minutes: show circle creation + 1-2 joins + one full round (5 deposits + payout) in
  real time, and speed through the remaining rounds as a time-lapse.
- Narrate in Turkish, add English captions afterward (YouTube auto-captions + editing, or a tool
  like Descript/CapCut).
- Upload the video (unlisted YouTube or similar) and add the link to this file and to
  [week4-demo-tx-log.md](week4-demo-tx-log.md).

## 7. Collect the tx hashes

The easiest way to gather the transaction hashes generated during the recording: open each
wallet's stellar.expert account page (`https://stellar.expert/explorer/testnet/account/<G-address>`)
and list its recent transactions, or click through to the tx link Freighter shows after each
approval. Add this list to [week4-demo-tx-log.md](week4-demo-tx-log.md) under a "UI demo
(video)" heading.
