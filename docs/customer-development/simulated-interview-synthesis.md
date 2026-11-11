# Simulated interview synthesis — not customer evidence

**Status:** Synthetic exercise prepared on 2026-11-11. No interviews were conducted for this
document. The five profiles, reactions, examples, and recommendations below are invented for
product planning; they are not statements by Mert Uygun, Hatice Uygun, Ayşenaz Karacar, Çağlar
Selvi, or any other real person. Do not count them toward the five-interview deliverable or cite
them as validation of H1–H4.

## Why use a simulation

Published work on Turkish *gün* groups identifies trust, socialization, solidarity, saving,
investment, consumption, religious sensitivity, and barriers to formal finance as relevant themes.
That study describes themes in its own research sample; it does not establish what Halka's intended
users think. The World Bank describes ROSCAs as pooled contributions paid to members in rotation,
but its Global Findex figures are global/developing-economy context, not a Turkey-specific estimate.
[Adam Academy Journal mixed-method study](https://dergipark.org.tr/en/pub/adamakademi/article/864080)
· [World Bank, Global Findex 2021 report](https://openknowledge.worldbank.org/bitstream/handle/10986/37578/9781464818974.pdf)

The profiles below turn those themes and the current product flow into questions to test. They are
not predictions with measured probabilities.

## Five hypothetical participant scenarios

### S-01 — Informal group organizer

**Scenario:** Coordinates a small group using a messaging app and a shared spreadsheet. The
organizer may value a single view of members, contributions, round, and payout order, while worrying
that moving a trusted social practice into an app could make coordination feel impersonal.

**Probe in a real interview:** Ask them to walk through the last contribution cycle, including a
late payment or disagreement. What records did they check, who resolved it, and what did they do
when someone could not pay?

**Product implication to test:** A clear shared status view may help coordination. Halka does not
currently replace group communication, negotiate missed contributions, or resolve interpersonal
disputes; avoid implying that on-chain state solves those jobs.

### S-02 — Member who needs predictable payout timing

**Scenario:** Joins a circle for a planned expense and wants to know when their turn arrives and
what must happen first. They may interpret “payout available” as a promise of immediate funds even
though all required contributions must be present and a wallet transaction still needs approval.

**Probe in a real interview:** Ask the participant to explain the current round and payout order
from the screen, then ask what they expect to happen after selecting the payout action.

**Product implication to test:** Make round, contribution count, payout order, and prerequisites
visible together. Use language that distinguishes eligibility from a completed transfer.

### S-03 — Wallet-inexperienced participant

**Scenario:** Understands the group practice but has little experience with browser wallets. They
may stop at wallet installation, account selection, network selection, or a signature prompt.

**Probe in a real interview:** Ask which wallet, if any, they already use. Observe the first point
where they hesitate; do not coach until their unaided attempt is recorded.

**Product implication to test:** Wallet availability and a short testnet onboarding path may be
larger barriers than the circle terminology. The source supports several wallet paths, but source
integration is not proof of device compatibility or successful onboarding.

### S-04 — Security-conscious participant

**Scenario:** Worries about who can move funds, whether a transaction is reversible, and what a
smart contract can guarantee. They may distinguish “the app cannot see my secret key” from “my
money is safe.”

**Probe in a real interview:** Ask them to describe, in their own words, who controls the wallet,
what the contract enforces, and what risks remain. Record misconceptions before explaining the
architecture.

**Product implication to test:** Explain wallet custody, contract-enforced rules, and limits in
plain language. Do not use non-custodial architecture as a proxy for user trust or overall safety.

### S-05 — Participant comparing the group with other saving methods

**Scenario:** Values disciplined saving or social participation, but compares a rotating group
with keeping money in an account, buying an asset, or using another financing method. Their main
question may be whether the group fits a specific expense and schedule.

**Probe in a real interview:** Ask about the most recent saving decision and alternatives they
considered. Avoid assuming that every participant joins a *gün* for the same financial or social
reason.

**Product implication to test:** State the product's scope and constraints clearly. The current
fixed-circle flow should not be presented as investment advice, yield, a guarantee of liquidity,
or a substitute for formal financial services.

## Product strengths visible in the current implementation

- **Rule visibility:** Membership, contribution state, round, and payout order can be represented
  from contract state. This can support a shared, inspectable account of a circle's progress.
- **Preflight before signing:** Deposit, payout, and reclaim flows check live state and simulate the
  contract call before asking the wallet to sign. The incomplete-payout path now has a read-only
  action so a participant can inspect why payout is unavailable without submitting an invalid
  transaction.
- **Wallet custody boundary:** The app delegates signing to the wallet and does not store wallet
  secrets. This is a useful architectural property, while user understanding and trust remain
  untested.
- **Testnet scope:** The current prototype can be evaluated without representing the experience as
  a production money service.

## Product weaknesses and risks visible now

- **Deployment and language mismatch:** The repository source is English, but the checked
  production URL served Turkish HTML on 2026-11-11. A participant may see a different product
  from the one described by the research materials.
- **Wallet onboarding burden:** A participant needs a compatible wallet and the correct network.
  There is no customer evidence yet on installation success, wallet preference, or abandonment.
- **Technical concepts carry too much meaning:** “Simulation,” contract errors, testnet, and
  transaction signing can be difficult to interpret. The UI needs usability evidence for its
  plain-language explanations.
- **Trust is broader than key custody:** The contract cannot by itself establish that other members
  will contribute, resolve disputes, or meet a participant's timing needs.
- **No validated demand or segment:** The code demonstrates a working flow, not that organizers
  want to use it, that members will join, or that a rotating payout is the right model for them.
- **Scope and operational readiness:** A testnet prototype is not evidence of production security,
  legal suitability, reliable liquidity, or consumer protection. Keep claims bounded to what is
  implemented and reviewed.

## Provisional product decisions

1. **Fix the production/source mismatch first.** Confirm the intended Vercel project and deploy the
   English build before using the live URL in sessions.
2. **Keep the next prototype focused on status comprehension.** Show round, member contribution
   progress, payout order, and the specific condition blocking the next action in one place.
3. **Test the wallet path before adding more features.** Record whether participants already have a
   compatible wallet, where they stop, and what they expect a signature to do.
4. **Preserve the read-only H3 check.** Ask participants to predict whether payout is available,
   use the check, and explain the result in their own words. Do not ask them to sign an invalid call.
5. **Do not broaden the roadmap based on this simulation.** After real interviews, log evidence by
   participant ID, separate direct observations from interpretation, then decide whether H1–H4 are
   supported, contradicted, or still unclear.

## Replace this exercise with actual evidence

For each real session, store consent status, date, participant ID, moderator, notes, and observed
behavior in the approved research records. Use verbatim quotes only when captured with permission.
Update the learning log with what happened and the source record. Keep this synthetic exercise
clearly separated from actual notes, and retire it from decision-making once real evidence is
available.
