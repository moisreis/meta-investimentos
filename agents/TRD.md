# Mathematical Integrity Verification

Summary of the equations used in the Meta Investimentos TRD's mathematical verification chapter, with formula, required inputs, inputs actually used in the worked example (Carteira LP A), and the resulting output.

---

## Positions — CAIXA BRASIL IRF-M 1 TÍTULOS PÚBLICOS FI RENDA FIXA

### ApplicationQuotas

**Equation:**
$$Q^{A,i}_t = \sum_n \frac{A^{n,i}_t}{Q_t}$$

**Inputs needed:** amount of each application (n); quota price on the application date

**Inputs used:**
- A¹ = R$ 1,000,000.00 (application on 05/05/2026)
- Q(05/05) = 4.428199

**Result:**
$$Q^{A,i}_m = \frac{1{,}000{,}000.00}{4.428199} = 225{,}825.442804 \text{ quotas}$$

---

### RedemptionQuotas

**Equation:**
$$Q^{W,i}_t = \sum_n \frac{W^{n,i}_t}{Q_t}$$

**Inputs needed:** amount of each redemption (n); quota price on the redemption date

**Inputs used:**
- W¹ = R$ 1,000,000.00 (redemption on 19/05/2026)
- Q(19/05) = 4.450869

**Result:**
$$Q^{W,i}_m = \frac{1{,}000{,}000.00}{4.450869} = 224{,}675.226343 \text{ quotas}$$

---

### QuotasHeld

**Equation:**
$$Q^i_t = Q^i_{t-1} + Q^{A,i}_t - Q^{W,i}_t$$

**Inputs needed:** prior period balance (or initial position); ApplicationQuotas; RedemptionQuotas

**Inputs used:**
- IB₀ = R$ 1,513,005.63 (initial position)
- Q(30/04) = 4.423720 (quota price used to convert the initial position)
- Q^{A,i}_m = 225,825.442804 (from ApplicationQuotas above)
- Q^{W,i}_m = 224,675.226343 (from RedemptionQuotas above)

**Result:**
$$Q_0 = \frac{1{,}513{,}005.63}{4.423720} = 342{,}021.111191 \text{ quotas}$$
$$Q^i_m = 342{,}021.111191 + 225{,}825.442804 - 224{,}675.226343 = 343{,}171.327652 \text{ quotas}$$

---

### ApplicationTotal

**Equation:**
$$A^i_t = \sum_n A^{n,i}_t$$

**Inputs needed:** all individual application amounts for the Position in the period

**Inputs used:** single application of R$ 1,000,000.00

**Result:**
$$A^i_m = R\$\ 1{,}000{,}000.00$$

---

### RedemptionTotal

**Equation:**
$$W^i_t = \sum_n W^{n,i}_t$$

**Inputs needed:** all individual redemption amounts for the Position in the period

**Inputs used:** single redemption of R$ 1,000,000.00

**Result:**
$$W^i_m = R\$\ 1{,}000{,}000.00$$

---

### CashFlowNet

**Equation:**
$$\Delta^i_t = A^i_t - W^i_t$$

**Inputs needed:** ApplicationTotal; RedemptionTotal

**Inputs used:** A^i_m = 1,000,000.00; W^i_m = 1,000,000.00

**Result:**
$$\Delta^i_m = 1{,}000{,}000.00 - 1{,}000{,}000.00 = R\$\ 0.00$$

---

### Return

**Equation:**
$$R^i_t = \left(\prod_{k \in t} \frac{V^i_k - \Delta^i_k}{V^i_{k-1}}\right) - 1, \quad \text{where } V^i_k = Q^i_k \cdot Q_k$$

**Inputs needed:** daily quota balance and daily quota price (to compute the daily market value V) for every business day in the period; daily net cash flow (Δ)

**Inputs used (shown for the first business day):**
- V(30/04) = 342,021.111191 × 4.423720 = R$ 1,513,005.63
- V(04/05) = 342,021.111191 × 4.424818 = R$ 1,513,381.17
- Δ(04/05) = R$ 0.00
- Daily factor f(04/05) = (1,513,381.17 − 0.00) / 1,513,005.63 = 1.00024821
- Same procedure repeated for all 20 business days in the period, forming the chain of factors (1.00024821 × 1.00076410 × ... × 1.00040729)

**Result:**
$$R^i_m = 1.01055899 - 1 = 1.0559\%$$

---

### Earnings

**Equation:**
$$E^i_t = V^i_t - IB^i_0 - \Delta^i_t$$

**Inputs needed:** ending market value of the Position; initial balance; net cash flow for the period

**Inputs used:**
- V(29/05) = 343,171.327652 × 4.470430 = R$ 1,534,123.40
- IB₀ = R$ 1,513,005.63
- Δ^i_m = R$ 0.00

**Result:**
$$E^i_m = 1{,}534{,}123.40 - 1{,}513{,}005.63 - 0.00 = R\$\ 21{,}117.77$$

---

## Portfolios — Carteira LP A (aggregated across all 7 Funds)

### ApplicationTotal (Portfolio)

**Equation:**
$$A^P_t = \sum_i A^i_t$$

**Inputs needed:** ApplicationTotal of every Position in the portfolio

**Inputs used:** 1,000,000 + 1,100,000 + 0 + 1,000,000 + 1,000,000 + 1,000,000 + 40,000
(the Gestão Estratégica fund had no applications)

**Result:**
$$A^P_m = R\$\ 5{,}140{,}000.00$$

---

### RedemptionTotal (Portfolio)

**Equation:**
$$W^P_t = \sum_i W^i_t$$

**Inputs needed:** RedemptionTotal of every Position in the portfolio

**Inputs used:** 1,000,000 + 1,000,000 + 0 + 500,000 + 1,000,000 + 500,000 + 0
(Gestão Estratégica and BB Previd. had no redemptions)

**Result:**
$$W^P_m = R\$\ 4{,}000{,}000.00$$

---

### CashFlowNet (Portfolio)

**Equation:**
$$\Delta^P_t = A^P_t - W^P_t$$

**Inputs needed:** Portfolio ApplicationTotal; Portfolio RedemptionTotal

**Inputs used:** A^P_m = 5,140,000.00; W^P_m = 4,000,000.00

**Result:**
$$\Delta^P_m = R\$\ 1{,}140{,}000.00$$

---

### Earnings (Portfolio)

**Equation:**
$$E^P_t = V^P_t - IB^P_0 - \Delta^P_t$$

**Inputs needed:** ending market value of the whole Portfolio; sum of all Positions' initial balances; Portfolio net cash flow

**Inputs used:**
- IB^P_0 = R$ 6,072,272.64 (sum of the seven initial positions)
- V^P_t = R$ 7,303,437.91 (ending portfolio market value — not derived step-by-step in the source text)
- Δ^P_m = R$ 1,140,000.00

**Result:**
$$E^P_m = 7{,}303{,}437.91 - 6{,}072{,}272.64 - 1{,}140{,}000.00 = R\$\ 91{,}165.27$$

---

### Return (Portfolio)

**Equation:**
$$R^P_t = \left(\prod_{k \in t} \frac{V^P_k - \Delta^P_k}{V^P_{k-1}}\right) - 1$$

**Inputs needed:** total daily portfolio market value (sum of the market values of all Positions) and daily net cash flow of the portfolio, for every business day in the period

**Inputs used:**
- V^P_0 (30/04/2026) = R$ 6,072,272.64
- (daily factors analogous to the Position-level calculation, implied but not detailed in the source text)

**Result:**
$$R^P_m = 1.04\%$$

---

## Portfolios — Target, CumulativeTarget, Benchmarks, and Spreads

The chapter defines **Target**, **CumulativeTarget**, **CumulativeBenchmark**,
and the three spread metrics (**InflationSpread**, **RiskFreeSpread**,
**MarketSpread**) without walking through numerical examples; the equations
and worked verifications using the Jacoprev portfolio are provided here.

### Target

**Equation:**
$$T_t = (1 + \pi_t) \cdot (1 + r^P_t) - 1$$

where the portfolio's monthly interest rate is the annual rate defined for the
Portfolio converted to a monthly base by compound interest:

$$r^P_t = (1 + r^P_a)^{\frac{1}{12}} - 1$$

**Inputs needed:** monthly inflation index (πₜ, IPCA); annual interest rate of
the Portfolio (r^P_a)

**Inputs used:**
- r^P_a = 44.30% a.a. (Portfolio `annual_interest_rate` = 0.4430)
- πₜ = 0.45% (monthly IPCA)

**Result:**
$$r^P_t = (1.4430)^{\frac{1}{12}} - 1 = 3.1032\%$$
$$T_m = (1 + 0.0045) \cdot (1 + 0.031032) - 1 = 3.57\%$$

### CumulativeTarget

**Equation:**
$$\bar{T}_t = \prod_{k=1}^{t} (1 + T_k) - 1$$

**Inputs needed:** monthly Target factors (Tₖ) for every month in the period

**Inputs used:** monthly targets of 3.57%, 2.91%, and 3.44%

**Result:**
$$\bar{T}_m = (1.0357) \cdot (1.0291) \cdot (1.0344) - 1 = 10.25\%$$

### CumulativeBenchmark

**Equation:**
$$\bar{BR}_t = \prod_{k=1}^{t} (1 + BR_k) - 1$$

BRₖ is the monthly value of the reference index, being πₖ (IPCA), fₖ (CDI),
or mₖ (Ibovespa) depending on the index being evaluated.

**Inputs used:** monthly IPCA values of 0.45%, 0.42%, and 0.51%

**Result:**
$$\bar{BR}_m = (1.0045) \cdot (1.0042) \cdot (1.0051) - 1 = 1.39\%$$

### InflationSpread

**Equation:**
$$S^\pi_t = R^P_t - \pi_t$$

**Inputs needed:** Portfolio Return; monthly inflation index (πₜ, IPCA)

**Inputs used:** R^P_m = 1.04% (Portfolio Return, May 2026); π_m = 0.45%

**Result:**
$$S^\pi_m = 1.04\% - 0.45\% = 0.59\%$$

### RiskFreeSpread

**Equation:**
$$S^f_t = R^P_t - f_t$$

**Inputs needed:** Portfolio Return; monthly risk-free index (fₜ, CDI)

**Inputs used:** R^P_m = 1.04% (Portfolio Return, May 2026); f_m = 0.95%

**Result:**
$$S^f_m = 1.04\% - 0.95\% = 0.09\%$$

### MarketSpread

**Equation:**
$$S^m_t = R^P_t - m_t$$

**Inputs needed:** Portfolio Return; monthly market index (mₜ, Ibovespa)

**Inputs used:** R^P_m = 1.04% (Portfolio Return, May 2026); m_m = 1.20%

**Result:**
$$S^m_m = 1.04\% - 1.20\% = -0.16\%$$

---

## Notes

- The chapter does not walk through numerical examples for **Target**, **CumulativeTarget**, **CumulativeBenchmark**, or the three spread metrics (**InflationSpread**, **RiskFreeSpread**, **MarketSpread**); the equations were added to this summary alongside their implementations and worked verifications.
- The Portfolio's ending market value, V^P_t = R$ 7,303,437.91, used in the Portfolio Earnings calculation, appears without an explicit derivation in the source text (unlike the Position-level V calculations, which show the Q × Q multiplication).
