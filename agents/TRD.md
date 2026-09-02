# Technical Requirements Document (TRD)

This document is the single source of truth for the domain requirements
behind the calculators in `business/calculators/**`. Every calculator
links to an equation here through its `@equation` tag, as
`agents/DOCUMENTATION_STANDARDS.md` requires.

Reference files:

- Calculator: `business/calculators/application/application-quotas.calculator.ts`
- Value object: `business/value-objects/quota-price.vo.ts`
- Documentation rules: `agents/DOCUMENTATION_STANDARDS.md`

When you add a calculator, add its equation here in the same change and
match the `@equation` value exactly.

---

## Worked example (Carteira LP A)

The benchmark calculation used throughout the tests and the
documentation is the Carteira *LP A* worked example.

| Amount            | Quota price | Result                        |
| ------------------- | ----------- | ------------------------------- |
| `1000000`         | `4.428199`  | `225825.442804` quotas         |

This example appears in the calculator tests and in the `@equation` and
`@example` blocks of the calculators. Keep this example stable; tests
depend on it.

## Symbol legend

Use these symbols in every `@equation` tag. Do not invent a symbol that
this document does not list.

| Symbol | Meaning                                                |
| -------- | -------------------------------------------------------- |
| `A`    | application (investment) amount                         |
| `W`    | withdrawal (redemption) amount                          |
| `Q_t`  | quota price at time `t`                                 |
| `Q^A`  | quotas bought                                          |
| `Q^W`  | quotas redeemed                                         |
| `Q`    | quota quantity                                          |
| `V_t`  | position value at time `t`                              |
| `Δ`    | net cash flow for a period                              |
| `E`    | earnings for a period                                   |
| `IB_0` | invested basis at the start of the period               |
| `GF`   | daily growth factor for a period (`k`)                  |
| `R`    | return (rentability) for a period, as a percentage      |
| `S`    | spread (portfolio return minus a benchmark), in points  |
| `T`    | target return, as a percentage                          |
| `T̄`   | cumulative target over a period                         |
| `BR`   | benchmark (indicator) return                            |
| `BR̄`  | cumulative benchmark return over a period                |
| `π`    | inflation index (IPCA)                                  |
| `m`    | market return                                          |
| `f`    | risk-free rate                                          |
| `r^p`  | real monthly portfolio return                           |

Super- and subscripts:

- Superscript `i` = investor (a single position). Example: `Aₜⁱ`.
- Superscript `P` = portfolio (consolidated). Example: `Aₜᴾ`.
- Superscript `n` = index of one operation.
- Subscript `t` = date (business day). Example: `Qₜ`.
- Subscript `0` = start of the period.
- Subscript `k` = one business day inside the evaluated period.

---

## Application amount and quotas

### Application quotas

The number of quotas bought for one application.

Qₜᴬ˒ⁱ = Aₜⁿ˒ⁱ / Qₜ

`@equation` reference: `Qₜᴬ˒ⁱ = Aₜⁿ˒ⁱ / Qₜ`

Worked example: `1000000 / 4.428199 = 225825.442804`.

### Withdrawal quotas

The number of quotas redeemed for one withdrawal.

Qₜᵂˢ = Wₜⁿ / Qₜ

`@equation` reference: `Qₜᵂˢ = Wₜⁿ / Qₜ`

---

## Per-position aggregation (superscript `i`)

### Application sum (position)

The total application for a position is the sum of its operations.

Aₜⁱ = ∑ₙ Aₜⁿ,ⁱ

`@equation` reference: `Aₜⁱ = ∑ₙ Aₜⁿ,ⁱ`

### Withdrawal sum (position)

The total withdrawal for a position is the sum of its operations.

Wₜ = ∑ₙ Wₜ,ⁱ

`@equation` reference: `Wₜ = ∑ₙ Wₜ,ⁱ`

### Application quotas sum (position)

The total quotas bought for a position is the sum of the quotas bought
per operation.

Qₜᴬ,ⁱ = ∑ₙ (Aₜⁿ,ⁱ / Qₜ)

`@equation` reference: `Qₜᴬ,ⁱ = ∑ₙ (Aₜⁿ,ⁱ / Qₜ)`

### Withdrawal quotas sum (position)

The total quotas redeemed for a position is the sum of the quotas
redeemed per operation.

Qₜᵂ,ⁱ = ∑ₙ (Wₜⁿ,ⁱ / Qₜ)

`@equation` reference: `Qₜᵂ,ⁱ = ∑ₙ (Wₜⁿ,ⁱ / Qₜ)`

### Net cash flow (position)

The net cash flow for a position is the application minus the
withdrawal.

Δₜⁱ = Aₜⁱ − Wₜⁱ

`@equation` reference: `Δₜⁱ = Aₜⁱ − Wₜⁱ`

### Quotas held (position)

The quotas held today equal the quotas held yesterday plus the quotas
bought today minus the quotas redeemed today.

Qₜⁱ = Qₜ₋₁ⁱ + Qₜᴬ,ⁱ − Qₜᵂ,ⁱ

`@equation` reference: `Qₜⁱ = Qₜ₋₁ⁱ + Qₜᴬ,ⁱ − Qₜᵂ,ⁱ`

### Earnings (position)

Earnings for a period equal the current value minus the invested basis
at the start of the period minus the net cash flow.

Eₜⁱ = Vₜⁱ − IB₀ⁱ − Δₜⁱ

`@equation` reference: `Eₜⁱ = Vₜⁱ − IB₀ⁱ − Δₜⁱ`

### Daily factor (position)

The daily growth factor neutralizes the day's cash flow.

(Vₖᴾ - Δₖᴾ) / Vₖ₋₁ᴾ

`@equation` reference: `(Vₖᴾ - Δₖᴾ) / Vₖ₋₁ᴾ`

---

## Per-portfolio aggregation (superscript `P`)

### Application sum (portfolio)

The total application for a portfolio is the sum over its positions.

Aₜᴾ = ∑ᵢ Aₜⁱ

`@equation` reference: `Aₜᴾ = ∑ᵢ Aₜⁱ`

### Withdrawal sum (portfolio)

The total withdrawal for a portfolio is the sum over its positions.

Wₜᴾ = ∑ᵢ Wₜⁱ

`@equation` reference: `Wₜᴾ = ∑ᵢ Wₜⁱ`

### Application quotas sum (portfolio)

The total quotas bought for a portfolio is the sum over its positions.

Qₜᴬᴾ = ∑ᵢ Qₜᴬⁱ

`@equation` reference: `Qₜᴬᴾ = ∑ᵢ Qₜᴬⁱ`

### Withdrawal quotas sum (portfolio)

The total quotas redeemed for a portfolio is the sum over its positions.

Qₜᵂᴾ = ∑ᵢ Qₜᵂⁱ

`@equation` reference: `Qₜᵂᴾ = ∑ᵢ Qₜᵂⁱ`

### Quotas held sum (portfolio)

The total quotas held for a portfolio is the sum over its positions.

Qₜᴾ = ∑ᵢ Qₜⁱ

`@equation` reference: `Qₜᴾ = ∑ᵢ Qₜⁱ`

### Net cash flow (portfolio)

The net cash flow for a portfolio is the application minus the
withdrawal.

Δₜᴾ = Aₜᴾ - Wₜᴾ

`@equation` reference: `Δₜᴾ = Aₜᴾ - Wₜᴾ`

### Earnings (portfolio)

Earnings for a portfolio equal the current value minus the invested
basis at the start of the period minus the net cash flow.

Eₜᴾ = Vₜᴾ − IB₀ᴾ − Δₜᴾ

`@equation` reference: `Eₜᴾ = Vₜᴾ − IB₀ᴾ − Δₜᴾ`

### Daily factor (portfolio)

The daily growth factor neutralizes the day's cash flow.

(Vₖᴾ - Δₖᴾ) / Vₖ₋₁ᴾ

`@equation` reference: `(Vₖᴾ - Δₖᴾ) / Vₖ₋₁ᴾ`

---

## Return, target, and cumulative factors

### Return (position)

The Time-Weighted Return for a position chains its daily growth factors.

Rₜⁱ = ( ∏_{k ∈ t} (Vₖⁱ - Δₖⁱ) / Vₖ₋₁ⁱ ) - 1

`@equation` reference: `Rₜⁱ = ( ∏_{k ∈ t} (Vₖⁱ - Δₖⁱ) / Vₖ₋₁ⁱ ) - 1`

### Return (portfolio)

The Time-Weighted Return for a portfolio chains its daily growth factors.

Rₜᴾ = ( ∏_{k ∈ t} (Vₖᴾ - Δₖᴾ) / Vₖ₋₁ᴾ ) - 1

`@equation` reference: `Rₜᴾ = ( ∏_{k ∈ t} (Vₖᴾ - Δₖᴾ) / Vₖ₋₁ᴾ ) - 1`

### Cumulative target

The cumulative target compounds the daily target returns over the
period.

T̄ₜ = ∏ₖ₌₁..ₜ (1 + Tₖ) − 1

`@equation` reference: `T̄ₜ = ∏ₖ₌₁..ₜ (1 + Tₖ) − 1`

### Cumulative benchmark

The cumulative benchmark return compounds the daily benchmark returns
over the period.

BR̄ₜ = ∏ₖ₌₁..ₜ (1 + BRₖ) − 1

`@equation` reference: `BR̄ₜ = ∏ₖ₌₁..ₜ (1 + BRₖ) − 1`

### Target

The target return for a period, based on inflation and the real monthly
portfolio return.

Tₜ = (1 + πₜ) · (1 + rᵖₜ) − 1, where rᵖₜ = (1 + rᵖₐ)^(1/12) − 1

`@equation` reference: `Tₜ = (1 + πₜ) · (1 + rᵖₜ) − 1, where rᵖₜ = (1 + rᵖₐ)^(1/12) − 1`

---

## Spreads (portfolio vs benchmark)

### Market spread

Sₜᵖ = Rₜᵖ − mₜ

`@equation` reference: `Sₜᵖ = Rₜᵖ − mₜ`

### Inflation spread

Sₜᵖ = Rₜᵖ − πₜ

`@equation` reference: `Sₜᵖ = Rₜᵖ − πₜ`

### Risk-free spread

Sₜᵖ = Rₜᵖ − fₜ

`@equation` reference: `Sₜᵖ = Rₜᵖ − fₜ`

---

## Change control

A change that adds a calculator, changes an equation, or changes a
validation rule must update this document in the same commit. A second
reviewer must confirm that every `@equation` tag matches the equation in
this document and that the code matches the documented invariant.
