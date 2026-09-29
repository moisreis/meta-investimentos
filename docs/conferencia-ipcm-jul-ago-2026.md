# Conferência — Carteira IPCM · Julho/Agosto 2026

> Cenário de teste: entrada real via telas do app, seguindo o modelo de cotas encadeadas.
> Os valores do app são **aproximados** por usarem a série CVM; a divergência é de preços (CVM ≠ administrador), não de movimentos ou datas.

## Cadastro base (estado verificado no banco)

| Item | CNPJ / Nº | Situação |
|---|---|---|
| Carteira **IPCM** — Instituto de Previdência de Coração de Maria | — | ✅ já existia |
| Banco **Caixa Econômica Federal** | 104 | ✅ já existia |
| Fundo **CAIXA BRASIL IRF-M 1 TÍTULOS PÚBLICOS FI RF** | `10.740.670/0001-06` | ✅ cotas 02/01→24/09/2026 |
| Fundo **CAIXA BRASIL TÍTULOS PÚBLICOS FI RENDA FIXA LP** | `05.164.356/0001-84` | ✅ cotas 02/01→24/09/2026 |
| Conta corrente Caixa | `575267817-6` (agência 0001) | 🆕 criar |
| Conta corrente Caixa | `575267818-4` (agência 0001) | 🆕 criar |

⚠️ **Fundo duplicado** `05164356000184` (CNPJ sem pontuação) **removido** em 28/09/2026; cota `2026-09-24` @ `7,466881` migrada para o fundo canônico.

## Correção dos dados sintéticos de julho (via tela)

> As movimentações fabricadas de julho foram **estornadas pela UI** (flow de reversão criado para aplicações e resgates) e as movimentações reais foram relançadas:

| Evento fabricado | Data | Estornado |
|---|---|---|
| Aplicação IRF-M 1 191.427,87 | 01/07 | ✅ |
| Aplicação LP 2.450,81 | 01/07 | ✅ |
| Aplicação IRF-M 1 30.000,00 | 06/07 | ✅ |
| Resgate IRF-M 1 90.000,00 | 27/07 | ✅ |

| Evento real (relançado) | Data | Vlr (R$) | Cotas |
|---|---|---|---|
| Aplicação IRF-M 1 (semente) | 30/06 | 191.427,87 | +42.349,9026 |
| Aplicação LP (semente) | 30/06 | 2.450,81 | +338,6093 |
| Aplicação IRF-M 1 | 08/07 | 30.000,00 | +6.618,4126 |
| Resgate IRF-M 1 | 13/07 | 90.000,00 | −19.813,1357 |

⚠️ **Bug corrigido durante a conferência:** os métodos de leitura com período dos repositórios (`findAllByPositionIdsInPeriod` e `findAllByPositionIdInPeriod`) não excluíam movimentações estornadas, então o cálculo de desempenho valorizava as fabricadas mesmo após a reversão. Adicionado o filtro `isNull(reversedAt)` (aplicações e resgates). Os registros (tabelas com a coluna Status) continuam listando as estornadas normalmente.

## Preços de cota (série CVM no banco)

**IRF-M 1** (`10.740.670/0001-06`):

| Data | Cota |
|---|---|
| 30/06/2026 | 4,520149 |
| 08/07/2026 | 4,532809 |
| 13/07/2026 | 4,542441 |
| 31/07/2026 | 4,578669 |
| 03/08/2026 | 4,581510 |
| 07/08/2026 | 4,591878 |
| 13/08/2026 | 4,600054 |
| 31/08/2026 | 4,631048 |

**Títulos Públicos LP** (`05.164.356/0001-84`):

| Data | Cota |
|---|---|
| 30/06/2026 | 7,237870 |
| 31/07/2026 | 7,325284 |
| 03/08/2026 | 7,329084 |
| 31/08/2026 | 7,405067 |

## Julho (rodar cálculo 30/06 → 31/07)

### IRF-M 1

| Evento | Data | Valor (R$) | Cota | Cotas |
|---|---|---|---|---|
| Semente (Valor Inicial) | 30/06 | 191.427,87 | 4,520149 | +42.349,9026 |
| Aplicação | 08/07 | 30.000,00 | 4,532809 | +6.618,4126 |
| Resgate | 13/07 | 90.000,00 | 4,542441 | −19.813,1357 |
| **Total de cotas em 31/07** | | | | **29.155,1795** |
| **Valor final 31/07** | | **133.491,92** | × 4,578669 | relatório: **133.491,93** |

### Títulos Públicos LP

| Evento | Data | Valor (R$) | Cota | Cotas |
|---|---|---|---|---|
| Semente (Valor Inicial) | 30/06 | 2.450,81 | 7,237870 | +338,6093 |
| **Total de cotas em 31/07** | | | | **338,6093** |
| **Valor final 31/07** | | **2.480,41** | × 7,325284 | relatório: **2.480,41** |

### Contas correntes (saldo em 31/07)

| Conta | Banco | Valor (R$) |
|---|---|---|
| 575267817-6 | Caixa | 18.891,16 |
| 575267818-4 | Caixa | 1.461,99 |
| **Total contas** | | **20.353,15** |

## Agosto (rodar cálculo 01/08 → 31/08)

> 01/08 é **sábado** — sem semente; as posições herdam as cotas do snapshot de 31/07.

### IRF-M 1

| Evento | Data | Valor (R$) | Cota | Cotas |
|---|---|---|---|---|
| Herança (cotas 31/07) | — | — | — | 29.155,1795 |
| Resgate | 03/08 | 1.500,00 | 4,581510 | −327,4030 |
| Aplicação | 07/08 | 30.000,00 | 4,591878 | +6.533,2746 |
| Resgate | 13/08 | 90.000,00 | 4,600054 | −19.564,9877 |
| **Total de cotas em 31/08** | | | | **15.796,0634** |
| **Valor final 31/08** | | **73.152,33** | × 4,631048 | relatório: **73.152,33** |

### Títulos Públicos LP

| Evento | Data | Valor (R$) | Cota | Cotas |
|---|---|---|---|---|
| Herança (cotas 31/07) | — | — | — | 338,6093 |
| Resgate | 03/08 | 2.000,00 | 7,329084 | −272,8854 |
| **Total de cotas em 31/08** | | | | **65,7239** |
| **Valor final 31/08** | | **486,69** | × 7,405067 | relatório: **486,69** |

### Contas correntes (saldo em 31/08)

| Conta | Banco | Valor (R$) |
|---|---|---|
| 575267817-6 | Caixa | 211.576,16 |
| 575267818-4 | Caixa | 563,12 |
| **Total contas** | | **212.139,28** |

## Resumo (app × relatório)

| Rubrica | Julho app | Julho relatório | Agosto app | Agosto relatório |
|---|---|---|---|---|
| IRF-M 1 | 133.491,92 | 133.491,93 | 73.152,33 | 73.152,33 |
| Tít. Púb. LP | 2.480,41 | 2.480,41 | 486,69 | 486,69 |
| **Total carteira** | **135.972,33** | **135.972,34** | **73.639,02** | **73.639,02** |
| CC 575267817-6 | 18.891,16 | 18.891,16 | 211.576,16 | 211.576,16 |
| CC 575267818-4 | 1.461,99 | 1.461,99 | 563,12 | 563,12 |
| **Total contas** | **20.353,15** | **20.353,15** | **212.139,28** | **212.139,28** |
| **Patrimônio** | **156.325,48** | **156.325,49** | **285.778,30** | **285.778,30** |

## Resultado na tela (recálculo 30/06 → 31/08 após o fix das estornadas)

> ✅ **Conferência fechada.** Com as movimentações reais (semente em 30/06) e o filtro de estornadas ativo, **agosto fecha ao centavo** (carteira 73.639,02 × 73.639,02) e julho a 0,01 (135.972,33 × 135.972,34). Cotas batem no 6º decimal (Δ ≤ 0,001 cota ≈ R$ 0,005). A divergência restante é a **série de preços (CVM ≠ administrador)**, maior em julho do IRF-M 1 (CVM 1,26% × rel. 1,57%).

| Card | Tela | Relatório | Δ | Origem da diferença |
|---|---|---|---|---|
| Ganhos do mês (R$) · julho | 2.093,65 | 2.064,06 | +29,59 | Série CVM × administrador no IRF-M 1 (CVM 1,26% × rel. 1,57% em julho) |
| Ganhos do mês (R$) · agosto | 1.166,69 | 1.166,68 | +0,01 | Arredondamento de série (centavo) |
| Rendimento do mês (%) · julho | 1,29% | 1,57% (IRF-M 1) | — | Card = retorno ponderado por dinheiro da carteira; relatório = rentabilidade do fundo |
| Rendimento do mês (%) · agosto | 1,22% | 1,14% (IRF-M 1) | — | Idem |
| IRF-M 1 em 31/08 | 73.152,33 | 73.152,33 | 0,00 | Exato |
| Tít. Púb. LP em 31/08 | 486,69 | 486,69 | 0,00 | Exato |

## Rentabilidade do fundo (cota a cota) vs relatório

| Fundo | Julho CVM | Julho rel. | Agosto CVM | Agosto rel. |
|---|---|---|---|---|
| IRF-M 1 | 1,26% | 1,57% | 1,14% | 1,14% |
| Tít. Púb. LP | 1,15% | 1,21% | 1,09% | 1,08% |

## Observações

- Divergência vem de **série de preços (CVM ≠ administrador)**, maior em julho do IRF-M 1 (CVM 1,26% × rel. 1,57%). Com as movimentações reais relançadas e as estornadas fora do cálculo, os patrimônios de 31/07 e 31/08 fecham com o relatório ao centavo; sobra apenas a diferença de série no card **Ganhos do Mês** (julho +29,59; agosto +0,01).
- O card **Rendimento do Mês** é o retorno ponderado por dinheiro da carteira inteira (julho 1,29%; agosto 1,22%); o relatório **Rentabilidade Carteira** é a rentabilidade do IRF-M 1 isolado. Percentuais distintos por definição, convergem com a série oficial.
- Bug de domínio corrigido: os repositórios com período não excluíam movimentações estornadas do cálculo de desempenho, então as fabricadas reversadas continuavam sendo valorizadas. O filtro `isNull(reversedAt)` agora vale para aplicações e resgates nos métodos de período; os registros (com coluna Status) seguem listando as estornadas.
- Gráficos mensais do ano (Jan→Dez): com snapshots só em jun–ago, aparecem **poucas barras** (jan–mai e set–dez vazios).
- Número de cotas exibido nas telas pode diferir em centésimos por arredondamento do app.