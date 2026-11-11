# Halka testnet usability session

**Target:** Three moderated sessions, about 30 minutes each. No real money or mainnet. The
participant controls their own test wallet and never shares secret wallet material with the
moderator.

## Before the session

- Explain that the session uses testnet and test assets have no real-money value.
- Ask the participant to use a separate test wallet. Never ask for a mainnet secret key, recovery
  words, QR backup, or a screen showing them.
- Verify the wallet, testnet XLM, and test circle in advance. If a public account address appears
  in a recording, redact it before sharing the recording.
- The contract and wallet must be on Testnet. If the wallet shows another network, stop and let
  the participant change their own wallet network.
- Record the screen only with separate, explicit consent. Moderator notes are sufficient without
  recording consent.
- Prepare a dedicated testnet account/circle for each session. The participant's test address is
  needed before the circle is created; use it only to set up that testnet circle and do not put it
  in the session summary.

## Opening script

> Today we are testing the Halka prototype, not you. If something is unclear, that is useful
> product feedback. We are on testnet; no real money is involved. Your wallet stays under your
> control. We will never ask for a secret key or recovery phrase. You can stop, skip a task, or
> decide not to sign at any time. Would you like to use your wallet for a testnet action today?
> Separately, do you agree to a screen recording?

Ask separately about participating in a testnet action and recording. If the participant does not
want to transact, do not proceed to a signature step; continue with observation tasks. Declining a
recording does not prevent participation.

## Tasks

Give each task in order. Start with open questions and ask the participant to describe what they
see. Do not explain the answer during a task.

### 1. Select and connect a wallet (H2)

> Connect your testnet wallet so you can continue with this test circle. Please talk through which
> option you choose and what you expect to happen.

Record: finding the wallet, noticing the network, recognizing the account, success or failure,
requests for help, and the participant's own description of any difficulty.

### 2. Interpret circle status (H1/H3)

> From this screen, tell me what is happening in the circle and what you think should happen
> next.

Record whether the participant can explain the active round, how many members have contributed,
their own status, and the next payout order. Ask neutrally: “What on the screen helped you work
that out?”

### 3. Understand payout eligibility with missing contributions (H3)

Open the test circle while one or more members have not deposited. Ask:

> Can a payout happen in this state? If not, what do you think needs to happen first? What on the
> screen helps you understand that?

Then ask the participant to choose **Check why payout is unavailable**. This is a read-only
Soroban simulation: it should display the plain-language incomplete-round message and does not
request a wallet signature or submit a transaction. Record whether they understand the message
and can explain the next step. The automated testnet harness separately records the expected
`RoundNotComplete` result; do not ask a participant to sign an invalid transaction.

### 4. Review the deposit preflight (H2/H3/H4)

If the participant wants, start a testnet deposit flow. Before the wallet prompt, ask:

> What do you think will happen if you approve this? What would you like to check first?

The participant decides whether to sign. Stop if they do not want to. If they proceed, they review
the transaction in their own wallet and approve it themselves. Never operate the wallet for them.

### 5. Explain the trust boundary in their own words (H4)

After the action or their choice not to sign, ask:

> Who do you think controls the wallet keys in this flow, and when do the contributions move?
> What led you to that conclusion?

After capturing their answer, explain that Halka does not store wallet keys and the contract
rules govern fund movement. Record what they thought before and after this explanation separately.

## Closing questions

- Which step felt most confusing or reassuring? Why?
- At what point did you want help or consider stopping?
- What would you expect to be different if you used this again?

Do not treat “Would you use it?” as a success measure by itself. Record observed behavior and the
participant's reasoning.

## Observations to capture in every session

| Observation | Record |
| --- | --- |
| Wallet connection | Selected wallet, connection result, network check, error, or help request |
| Circle comprehension | Active round, contribution count, participant status, and next-step explanation |
| Incomplete payout | Whether they understand why payout cannot proceed and which message they used |
| Preflight comprehension | Their explanation of the action, amount, reason, and decision to sign or stop |
| Trust boundary | Who they believe holds the keys and which rule moves funds |
| Moderator intervention | Any hint or explanation, and when it was given |

After each session, complete an anonymous copy of `summary-template.md`. Do not claim a video
exists unless a recording was actually made with consent.
