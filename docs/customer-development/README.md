# Halka customer development

This folder contains the Customer Development Plan, research tools, and current evidence summary. The project team reports that five interviews are complete; three moderated testnet usability sessions remain planned.

## Status

- **Product evidence available:** Month One testnet lifecycle, public contract and app, transaction
  records, and the Month Two wallet/preflight implementation documented in
  [`../month-two-integration.md`](../month-two-integration.md).
- **Customer evidence:** the project team reports five interviews complete; their anonymized synthesis is linked below. Interview dates, consent status, and individual source notes are not recorded in the public files.
- **Interviews:** 5 of 5 reported complete. The tracker uses anonymous IDs; no participant names or contact details are published.
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
- [`interview-synthesis.md`](interview-synthesis.md): anonymized synthesis of the five interviews reported complete by the project team. It is qualitative evidence, not market-wide validation.

## Hypotheses and evidence standard

| Hypothesis | Evidence to collect | Current state |
| --- | --- | --- |
| H1 — organizers have a meaningful coordination/trust problem | Recent examples of contribution tracking, payout order, missed payments, custody, and workarounds | Preliminary interview signal; check source notes and recurrence before deciding |
| H2 — wallet setup is a barrier and wallet choice/action explanation helps | Observed wallet selection and connection, help requests, stops, and participant explanations | Interview concerns reported; actual wallet-task behavior remains untested |
| H3 — transaction explanations improve comprehension | Whether a participant can explain eligibility and next steps before signing, including the incomplete-round message | Need reported; comprehension effect remains untested in usability sessions |
| H4 — the non-custodial boundary improves trust | Participant's own explanation of who holds keys and when funds move, before and after a factual explanation | Trust concerns reported; effect of the boundary on trust remains unclear |

Treat the five interviews and three usability sessions as directional discovery, not statistically
representative validation. Record behavior and participant words first; keep moderator
interpretations and roadmap decisions separate. Do not treat familiarity with altın günü or
positive reactions to a demo as demand evidence by itself.

## Activity sequence

1. Reconcile the five interview IDs against private source notes; add dates, segment, and consent information only when verified. Keep the name-to-ID key outside the public repository.
2. Run three moderated sessions using testnet-only accounts and assets. Participants control their own wallets and decide whether to sign. Never collect a seed phrase, secret key, or wallet recovery information.
3. Observe wallet connection, incomplete-payout comprehension, and the participant's understanding of the custody boundary. Record the interface language used.
4. Complete the learning log and roadmap decision using traceable interview and usability evidence; include recordings or transaction hashes only when they exist and sharing is permitted.

## Evidence still to produce

- Confirm dates, participant segments, moderators, and consent status against source records; link individual anonymized summaries or a private note index where appropriate.
- Three anonymized usability summaries, with recordings only where separately consented.
- A learning review and roadmap decision tied to evidence IDs.
- Optional design-partner follow-up after the current period. No mainnet or real-funds pilot is
  implied by this plan.
