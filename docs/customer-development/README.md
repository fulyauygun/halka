# Halka customer development

This folder is the working pack for the follow-on Customer Development Plan. It is designed to
collect evidence about the existing product and guide the planned five interviews and three
moderated testnet sessions. It does not claim that those sessions have happened.

## Status

- **Product evidence available:** Month One testnet lifecycle, public contract and app, transaction
  records, and the Month Two wallet/preflight implementation documented in
  [`../month-two-integration.md`](../month-two-integration.md).
- **Customer evidence:** no structured interviews or external moderated usability sessions have
  been recorded yet. H1–H4 remain untested.
- **Scheduled interviews:** 0 of 5 recorded in the tracker.
- **Usability sessions:** 0 of 3 recorded in the tracker.
- **Recording:** no recordings are available; ask for separate, explicit consent before recording.

## Working materials

- [`interview-guide-tr.md`](interview-guide-tr.md): structured Turkish interview guide; discovery
  questions come before the Halka prototype.
- [`usability-session-script-tr.md`](usability-session-script-tr.md): moderator setup, tasks,
  observation rubric, and safe testnet boundaries.
- [`summary-template.md`](summary-template.md): anonymized interview/session summary that separates
  direct observations from interpretation and product decisions.
- [`participant-tracker.csv`](participant-tracker.csv): eight anonymized activity slots (five
  interviews and three usability sessions). No names, contact details, or wallet secrets belong in
  this tracker.
- [`learning-log.md`](learning-log.md): evidence log and decision record for H1–H4.

## Hypotheses and evidence standard

| Hypothesis | Evidence to collect | Current state |
| --- | --- | --- |
| H1 — organizers have a meaningful coordination/trust problem | Recent real examples of tracking, payout order, missed payments, and custody; current workarounds | Not tested with structured interviews |
| H2 — wallet setup is a barrier and wallet choice/action explanation helps | Observed wallet-selection and connection behavior, help requests, stops, and participant explanations | Not tested with external participants |
| H3 — preflight/status explanations improve transaction comprehension | Whether a participant can explain the current state, eligibility, and next step before signing | Not tested with external participants |
| H4 — the non-custodial boundary improves trust | Participant's own explanation of who holds keys and when funds move, before and after the explanation | Not tested with external participants |

Treat the five interviews and three usability sessions as directional discovery, not statistically
representative validation. Record the participant's behavior and words first; keep moderator
interpretations and roadmap decisions in separate fields. Do not count familiarity with altın günü
or positive reactions to a demo as evidence of demand by itself.

## Activity sequence

1. Recruit five organizers or circle members who have recently participated in an informal savings
   circle. Record an anonymized ID and scheduling status; keep contact details outside this repo.
2. Run the interview guide before showing Halka. Complete one summary per participant.
3. Use observations from the interviews to adjust the moderator wording in the usability script,
   without changing the core tasks or leading participants toward a preferred answer.
4. Run three moderated sessions with testnet-only accounts/assets. Participants control their own
   wallets and decide whether to sign. Never collect a seed phrase, secret key, or wallet recovery
   information.
5. Complete the learning log and roadmap decision after the sessions. Only add recordings or
   transaction hashes when they actually exist and the participant consented to recording.

## Evidence that still needs to be produced

- Five confirmed interview slots and five anonymized written summaries.
- A usability script updated from interview observations.
- Three anonymized usability summaries, with screen recordings only where participants separately
  consented.
- A customer-learning summary and a roadmap decision tied to observations.
- Optional design-partner follow-up after the current period; no mainnet or real-funds pilot is
  implied by this plan.
