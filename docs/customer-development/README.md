# Halka customer development

This folder is the working pack for the follow-on Customer Development Plan. It guides the planned
five interviews and three moderated testnet sessions. It does not claim that those sessions have
happened.

## Status

- **Product evidence available:** Month One testnet lifecycle, public contract and app, transaction
  records, and the Month Two wallet/preflight implementation documented in
  [`../month-two-integration.md`](../month-two-integration.md).
- **Customer evidence:** no structured interviews or external moderated usability sessions have
  been recorded. H1–H4 remain untested by customers.
- **Interviews:** 0 of 5 scheduled or completed in the tracker. Four participant names were
  supplied privately; public research records use anonymous IDs only. The fifth participant is
  still to be identified.
- **Usability sessions:** 0 of 3 completed.
- **Recording:** no recordings are available; obtain separate, explicit consent before recording.

## Working materials

- [`interview-guide.md`](interview-guide.md): common structured interview guide, with discovery
  questions before the prototype.
- [`five-interview-packets.md`](five-interview-packets.md): five supplemental focus tracks. These
  are preparation materials, not interview findings.
- [`usability-session-script.md`](usability-session-script.md): moderator setup, tasks, observation
  rubric, and safe testnet boundaries. It includes the read-only incomplete-payout simulation.
- [`summary-template.md`](summary-template.md): anonymized session summary separating observation,
  interpretation, and product implication.
- [`participant-tracker.csv`](participant-tracker.csv): eight anonymous slots (five interviews and
  three usability sessions). Do not add names, contact details, or wallet secrets.
- [`learning-log.md`](learning-log.md): evidence log and roadmap decision record for H1–H4.
- [`product-analysis.md`](product-analysis.md): desk review of current product evidence and live
  language status. It is explicitly not customer research.
- [`simulated-interview-synthesis.md`](simulated-interview-synthesis.md): five hypothetical
  participant scenarios and source-informed product analysis. These are invented planning
  examples, not interviews or validation of H1–H4.

## Hypotheses and evidence standard

| Hypothesis | Evidence to collect | Current state |
| --- | --- | --- |
| H1 — organizers have a meaningful coordination/trust problem | Recent examples of contribution tracking, payout order, missed payments, custody, and workarounds | Not tested with structured interviews |
| H2 — wallet setup is a barrier and wallet choice/action explanation helps | Observed wallet selection and connection, help requests, stops, and participant explanations | Not tested with external participants |
| H3 — transaction explanations improve comprehension | Whether a participant can explain eligibility and next steps before signing, including the incomplete-round message | Not tested with external participants |
| H4 — the non-custodial boundary improves trust | Participant's own explanation of who holds keys and when funds move, before and after a factual explanation | Not tested with external participants |

Treat the five interviews and three usability sessions as directional discovery, not statistically
representative validation. Record behavior and participant words first; keep moderator
interpretations and roadmap decisions separate. Do not treat familiarity with altın günü or
positive reactions to a demo as demand evidence by itself.

## Activity sequence

1. Confirm five organizers or members with recent experience in an informal savings circle. Keep
   identifying details outside the public repository.
2. Run the common interview guide before showing Halka; use follow-up tracks only when they fit
   the participant's actual experience.
3. Complete one anonymized summary per interview.
4. Run three moderated sessions using testnet-only accounts and assets. Participants control their
   own wallets and decide whether to sign. Never collect a seed phrase, secret key, or wallet
   recovery information.
5. Complete the learning log and roadmap decision after the sessions. Add recordings or
   transaction hashes only when they actually exist and any recording has participant consent.

## Evidence still to produce

- Five confirmed interview slots and five anonymized written summaries.
- Three anonymized usability summaries, with recordings only where participants separately
  consented.
- A learning summary and roadmap decision tied to observations.
- Optional design-partner follow-up after the current period. No mainnet or real-funds pilot is
  implied by this plan.
