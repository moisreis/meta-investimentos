Verify the @agents/TRD.md for the portfolio's daily-factor and return calculators; then, go to @business/calculators/portfolio\ and add them based on the already present files and the @business/calculators/position/daily-factor.calculator.ts and @business/calculators/position/return.calculator.ts from the position; then, go to @__tests__/__unit__/calculators/portfolio\ and add the unit tests based on the present files. The documentation and code structure and conventions must remain consistent. For the unit tests, use this portfolio: '[
  {
    "id": 25,
    "annual_interest_rate": "0.4430",
    "created_at": "2026-04-07 14:17:06.11716",
    "name": "Jacoprev - Plano Previdenciário",
    "updated_at": "2026-04-07 14:17:06.11716",
    "user_id": 2
  }
]' and those positions '[
  {
    "id": 97,
    "created_at": "2026-04-07 14:20:33.591855",
    "investment_fund_id": 4,
    "percentage_allocation": "61.3155",
    "portfolio_id": 25,
    "total_invested_value": "7490919.74",
    "total_quotas_held": "995248.2566342491524363512201396128318906",
    "updated_at": "2026-08-11 14:42:07.283333"
  },
  {
    "id": 99,
    "created_at": "2026-04-07 14:21:22.16973",
    "investment_fund_id": 10,
    "percentage_allocation": "5.1955",
    "portfolio_id": 25,
    "total_invested_value": "563690.14",
    "total_quotas_held": "127963.58592187433084398838716353778",
    "updated_at": "2026-07-10 14:48:11.274121"
  },
  {
    "id": 113,
    "created_at": "2026-04-07 14:40:38.957679",
    "investment_fund_id": 7,
    "percentage_allocation": "6.5249",
    "portfolio_id": 25,
    "total_invested_value": "736735.08",
    "total_quotas_held": "317185.526740209398706051738937101",
    "updated_at": "2026-07-10 14:46:43.739739"
  },
  {
    "id": 100,
    "created_at": "2026-04-07 14:21:42.414184",
    "investment_fund_id": 12,
    "percentage_allocation": "14.4598",
    "portfolio_id": 25,
    "total_invested_value": "1643276.46",
    "total_quotas_held": "645484.903056838667340148646211928",
    "updated_at": "2026-08-11 14:41:12.839105"
  },
  {
    "id": 101,
    "created_at": "2026-04-07 14:22:11.072345",
    "investment_fund_id": 13,
    "percentage_allocation": "2.2913",
    "portfolio_id": 25,
    "total_invested_value": "1594454.55",
    "total_quotas_held": "39675.797272623537206712021226199",
    "updated_at": "2026-07-10 14:47:52.067614"
  },
  {
    "id": 141,
    "created_at": "2026-04-10 15:26:25.584354",
    "investment_fund_id": 3,
    "percentage_allocation": "8.9846",
    "portfolio_id": 25,
    "total_invested_value": "941618.41",
    "total_quotas_held": "233291.47462828878051525613897221",
    "updated_at": "2026-07-13 12:20:20.456316"
  },
  {
    "id": 158,
    "created_at": "2026-04-15 13:11:40.700615",
    "investment_fund_id": 158,
    "percentage_allocation": "1.2286",
    "portfolio_id": 25,
    "total_invested_value": "139516.41",
    "total_quotas_held": "136899.217962246324702682721562812",
    "updated_at": "2026-06-09 12:34:12.369589"
  }
]' and those applications '[
  {
    "id": 150,
    "cotization_date": "2025-12-31",
    "created_at": "2026-04-07 14:20:33.741205",
    "financial_value": "1790919.73",
    "fund_investment_id": 97,
    "liquidation_date": "2025-12-31",
    "number_of_quotas": "264157.23207452075290692915032695",
    "quota_value_at_application": "6.779749",
    "request_date": "2025-12-31",
    "updated_at": "2026-04-07 14:20:33.741205"
  },
  {
    "id": 206,
    "cotization_date": "2026-02-09",
    "created_at": "2026-04-10 15:08:35.290576",
    "financial_value": "2400000.0",
    "fund_investment_id": 97,
    "liquidation_date": "2026-02-09",
    "number_of_quotas": "348604.58667769806514286760099474",
    "quota_value_at_application": "6.884591",
    "request_date": "2026-02-09",
    "updated_at": "2026-04-10 15:08:35.290576"
  },
  {
    "id": 682,
    "cotization_date": "2026-05-05",
    "created_at": "2026-06-15 12:13:35.459305",
    "financial_value": "1100000.0",
    "fund_investment_id": 97,
    "liquidation_date": "2026-05-05",
    "number_of_quotas": "155070.58249021927544257144242709",
    "quota_value_at_application": "7.093544",
    "request_date": "2026-05-05",
    "updated_at": "2026-06-15 12:13:35.459305"
  },
  {
    "id": 735,
    "cotization_date": "2026-03-02",
    "created_at": "2026-06-22 14:54:44.165938",
    "financial_value": "0.01",
    "fund_investment_id": 97,
    "liquidation_date": "2026-03-02",
    "number_of_quotas": "0.0014423643467149647176045328318906",
    "quota_value_at_application": "6.933061",
    "request_date": "2026-03-02",
    "updated_at": "2026-06-22 14:54:44.165938"
  },
  {
    "id": 736,
    "cotization_date": "2026-03-02",
    "created_at": "2026-06-22 15:00:36.905502",
    "financial_value": "2000000.0",
    "fund_investment_id": 97,
    "liquidation_date": "2026-03-02",
    "number_of_quotas": "288472.86934299294352090656637811",
    "quota_value_at_application": "6.933061",
    "request_date": "2026-03-02",
    "updated_at": "2026-06-22 15:00:36.905502"
  },
  {
    "id": 738,
    "cotization_date": "2026-04-07",
    "created_at": "2026-06-22 15:39:01.390687",
    "financial_value": "1000000.0",
    "fund_investment_id": 97,
    "liquidation_date": "2026-04-07",
    "number_of_quotas": "142356.83991161917950927034859346",
    "quota_value_at_application": "7.024601",
    "request_date": "2026-04-07",
    "updated_at": "2026-06-22 15:39:01.390687"
  },
  {
    "id": 764,
    "cotization_date": "2026-06-01",
    "created_at": "2026-07-10 14:47:20.997231",
    "financial_value": "1000000.0",
    "fund_investment_id": 97,
    "liquidation_date": "2026-06-01",
    "number_of_quotas": "139567.59447016442597872124541189",
    "quota_value_at_application": "7.164987",
    "request_date": "2026-06-01",
    "updated_at": "2026-07-10 14:47:20.997231"
  },
  {
    "id": 818,
    "cotization_date": "2026-07-01",
    "created_at": "2026-08-11 14:41:36.662841",
    "financial_value": "4000000.0",
    "fund_investment_id": 97,
    "liquidation_date": "2026-07-01",
    "number_of_quotas": "552358.85539645625890937572540253",
    "quota_value_at_application": "7.241669",
    "request_date": "2026-07-01",
    "updated_at": "2026-08-11 14:41:36.662841"
  },
  {
    "id": 819,
    "cotization_date": "2026-07-31",
    "created_at": "2026-08-11 14:42:07.183996",
    "financial_value": "4000000.0",
    "fund_investment_id": 97,
    "liquidation_date": "2026-07-31",
    "number_of_quotas": "546053.91408715348101179421849037",
    "quota_value_at_application": "7.325284",
    "request_date": "2026-07-31",
    "updated_at": "2026-08-11 14:42:07.183996"
  },
  {
    "id": 152,
    "cotization_date": "2025-12-31",
    "created_at": "2026-04-07 14:21:22.2442",
    "financial_value": "162690.14",
    "fund_investment_id": 99,
    "liquidation_date": "2025-12-31",
    "number_of_quotas": "36044.206567311262691564302596492",
    "quota_value_at_application": "4.513628",
    "request_date": "2025-12-31",
    "updated_at": "2026-04-07 14:21:22.2442"
  },
  {
    "id": 155,
    "cotization_date": "2026-01-02",
    "created_at": "2026-04-07 14:25:08.495365",
    "financial_value": "1100000.0",
    "fund_investment_id": 99,
    "liquidation_date": "2026-01-02",
    "number_of_quotas": "243337.20608183739942430841353875",
    "quota_value_at_application": "4.520476",
    "request_date": "2026-01-02",
    "updated_at": "2026-04-07 14:25:08.495365"
  },
  {
    "id": 207,
    "cotization_date": "2026-02-23",
    "created_at": "2026-04-10 15:10:10.260561",
    "financial_value": "1000.0",
    "fund_investment_id": 99,
    "liquidation_date": "2026-02-23",
    "number_of_quotas": "216.98601221370865548523279995278",
    "quota_value_at_application": "4.608592",
    "request_date": "2026-02-23",
    "updated_at": "2026-04-10 15:10:10.260561"
  },
  {
    "id": 514,
    "cotization_date": "2026-04-07",
    "created_at": "2026-05-12 12:32:50.752945",
    "financial_value": "300000.0",
    "fund_investment_id": 99,
    "liquidation_date": "2026-04-07",
    "number_of_quotas": "64358.761479994078993943840544733",
    "quota_value_at_application": "4.66137",
    "request_date": "2026-04-07",
    "updated_at": "2026-05-12 12:32:50.752945"
  },
  {
    "id": 643,
    "cotization_date": "2026-05-05",
    "created_at": "2026-06-09 12:44:37.718849",
    "financial_value": "1000000.0",
    "fund_investment_id": 99,
    "liquidation_date": "2026-05-05",
    "number_of_quotas": "212221.31627300319902412149925022",
    "quota_value_at_application": "4.712062",
    "request_date": "2026-05-05",
    "updated_at": "2026-06-09 12:44:37.718849"
  },
  {
    "id": 168,
    "cotization_date": "2025-12-31",
    "created_at": "2026-04-07 14:40:39.028305",
    "financial_value": "86735.08",
    "fund_investment_id": 113,
    "liquidation_date": "2025-12-31",
    "number_of_quotas": "37661.126163679310823954425455051",
    "quota_value_at_application": "2.30304",
    "request_date": "2025-12-31",
    "updated_at": "2026-04-07 14:40:39.028305"
  },
  {
    "id": 169,
    "cotization_date": "2026-01-02",
    "created_at": "2026-04-07 14:40:56.972212",
    "financial_value": "1100000.0",
    "fund_investment_id": 113,
    "liquidation_date": "2026-01-02",
    "number_of_quotas": "476198.30975574489969964873881042",
    "quota_value_at_application": "2.309962",
    "request_date": "2026-01-02",
    "updated_at": "2026-04-07 14:40:56.972212"
  },
  {
    "id": 762,
    "cotization_date": "2026-06-01",
    "created_at": "2026-07-10 14:46:26.864901",
    "financial_value": "800000.0",
    "fund_investment_id": 113,
    "liquidation_date": "2026-06-01",
    "number_of_quotas": "332845.43739634985051079292936437",
    "quota_value_at_application": "2.403518",
    "request_date": "2026-06-01",
    "updated_at": "2026-07-10 14:46:26.864901"
  },
  {
    "id": 153,
    "cotization_date": "2025-12-31",
    "created_at": "2026-04-07 14:21:42.491452",
    "financial_value": "1243276.46",
    "fund_investment_id": 100,
    "liquidation_date": "2025-12-31",
    "number_of_quotas": "504837.91931211130439302171091848",
    "quota_value_at_application": "2.462724",
    "request_date": "2025-12-31",
    "updated_at": "2026-04-07 14:21:42.491452"
  },
  {
    "id": 506,
    "cotization_date": "2026-04-07",
    "created_at": "2026-05-12 12:29:41.499519",
    "financial_value": "1000000.0",
    "fund_investment_id": 100,
    "liquidation_date": "2026-04-07",
    "number_of_quotas": "392092.89778608666194064027201837",
    "quota_value_at_application": "2.550416",
    "request_date": "2026-04-07",
    "updated_at": "2026-05-12 12:29:41.499519"
  },
  {
    "id": 636,
    "cotization_date": "2026-05-05",
    "created_at": "2026-06-09 12:35:20.404613",
    "financial_value": "1000000.0",
    "fund_investment_id": 100,
    "liquidation_date": "2026-05-05",
    "number_of_quotas": "388088.17673846039210877024947084",
    "quota_value_at_application": "2.576734",
    "request_date": "2026-05-05",
    "updated_at": "2026-06-09 12:35:20.404613"
  },
  {
    "id": 763,
    "cotization_date": "2026-06-01",
    "created_at": "2026-07-10 14:47:05.936795",
    "financial_value": "1000000.0",
    "fund_investment_id": 100,
    "liquidation_date": "2026-06-01",
    "number_of_quotas": "384060.12230778655013770475685346",
    "quota_value_at_application": "2.603759",
    "request_date": "2026-06-01",
    "updated_at": "2026-07-10 14:47:05.936795"
  },
  {
    "id": 816,
    "cotization_date": "2026-07-01",
    "created_at": "2026-08-11 14:40:44.253763",
    "financial_value": "800000.0",
    "fund_investment_id": 100,
    "liquidation_date": "2026-07-01",
    "number_of_quotas": "303870.89741052616385402497894744",
    "quota_value_at_application": "2.632697",
    "request_date": "2026-07-01",
    "updated_at": "2026-08-11 14:40:44.253763"
  },
  {
    "id": 817,
    "cotization_date": "2026-07-31",
    "created_at": "2026-08-11 14:41:12.749117",
    "financial_value": "600000.0",
    "fund_investment_id": 100,
    "liquidation_date": "2026-07-31",
    "number_of_quotas": "225263.61474515551824522647628387",
    "quota_value_at_application": "2.663546",
    "request_date": "2026-07-31",
    "updated_at": "2026-08-11 14:41:12.749117"
  },
  {
    "id": 154,
    "cotization_date": "2025-12-31",
    "created_at": "2026-04-07 14:22:11.201669",
    "financial_value": "1244454.55",
    "fund_investment_id": 101,
    "liquidation_date": "2025-12-31",
    "number_of_quotas": "196089.2822618042732164717231134",
    "quota_value_at_application": "6.346367",
    "request_date": "2025-12-31",
    "updated_at": "2026-04-07 14:22:11.201669"
  },
  {
    "id": 683,
    "cotization_date": "2026-05-05",
    "created_at": "2026-06-15 12:16:07.004631",
    "financial_value": "1000000.0",
    "fund_investment_id": 101,
    "liquidation_date": "2026-05-05",
    "number_of_quotas": "150579.25581021351987894632466905",
    "quota_value_at_application": "6.641021",
    "request_date": "2026-05-05",
    "updated_at": "2026-06-15 12:16:07.004631"
  },
  {
    "id": 737,
    "cotization_date": "2026-03-02",
    "created_at": "2026-06-22 15:04:58.254633",
    "financial_value": "600000.0",
    "fund_investment_id": 101,
    "liquidation_date": "2026-03-02",
    "number_of_quotas": "92467.048596673836972579513185647",
    "quota_value_at_application": "6.488798",
    "request_date": "2026-03-02",
    "updated_at": "2026-06-22 15:04:58.254633"
  },
  {
    "id": 739,
    "cotization_date": "2026-04-07",
    "created_at": "2026-06-22 15:41:46.262465",
    "financial_value": "1000000.0",
    "fund_investment_id": 101,
    "liquidation_date": "2026-04-07",
    "number_of_quotas": "152111.49772783450269047211606107",
    "quota_value_at_application": "6.574125",
    "request_date": "2026-04-07",
    "updated_at": "2026-06-22 15:41:46.262465"
  },
  {
    "id": 765,
    "cotization_date": "2026-06-01",
    "created_at": "2026-07-10 14:47:36.371684",
    "financial_value": "1000000.0",
    "fund_investment_id": 101,
    "liquidation_date": "2026-06-01",
    "number_of_quotas": "149016.35052102821877924911555071",
    "quota_value_at_application": "6.710673",
    "request_date": "2026-06-01",
    "updated_at": "2026-07-10 14:47:36.371684"
  },
  {
    "id": 209,
    "cotization_date": "2025-12-31",
    "created_at": "2026-04-10 15:26:25.692929",
    "financial_value": "1641618.41",
    "fund_investment_id": 141,
    "liquidation_date": "2025-12-31",
    "number_of_quotas": "386893.47303701371363605082727719",
    "quota_value_at_application": "4.243076",
    "request_date": "2025-12-31",
    "updated_at": "2026-04-10 15:26:25.692929"
  },
  {
    "id": 210,
    "cotization_date": "2026-02-09",
    "created_at": "2026-04-10 15:29:25.59481",
    "financial_value": "2400000.0",
    "fund_investment_id": 141,
    "liquidation_date": "2026-02-09",
    "number_of_quotas": "557033.49953046717935411037340276",
    "quota_value_at_application": "4.308538",
    "request_date": "2026-02-09",
    "updated_at": "2026-04-10 15:29:25.59481"
  },
  {
    "id": 248,
    "cotization_date": "2026-03-02",
    "created_at": "2026-04-15 13:04:40.663181",
    "financial_value": "2000000.0",
    "fund_investment_id": 141,
    "liquidation_date": "2026-03-02",
    "number_of_quotas": "460956.62789944599927675905082577",
    "quota_value_at_application": "4.338803",
    "request_date": "2026-03-02",
    "updated_at": "2026-04-15 13:04:40.663181"
  },
  {
    "id": 508,
    "cotization_date": "2026-04-07",
    "created_at": "2026-05-12 12:30:34.413919",
    "financial_value": "1000000.0",
    "fund_investment_id": 141,
    "liquidation_date": "2026-04-07",
    "number_of_quotas": "228060.31283033110936518271622113",
    "quota_value_at_application": "4.384805",
    "request_date": "2026-04-07",
    "updated_at": "2026-05-12 12:30:34.413919"
  },
  {
    "id": 637,
    "cotization_date": "2026-05-05",
    "created_at": "2026-06-09 12:36:30.767132",
    "financial_value": "1000000.0",
    "fund_investment_id": 141,
    "liquidation_date": "2026-05-05",
    "number_of_quotas": "225825.4428041738864942609851093",
    "quota_value_at_application": "4.428199",
    "request_date": "2026-05-05",
    "updated_at": "2026-06-09 12:36:30.767132"
  },
  {
    "id": 766,
    "cotization_date": "2026-06-01",
    "created_at": "2026-07-13 12:19:45.172119",
    "financial_value": "1000000.0",
    "fund_investment_id": 141,
    "liquidation_date": "2026-06-01",
    "number_of_quotas": "223642.40116795007585950247616867",
    "quota_value_at_application": "4.471424",
    "request_date": "2026-06-01",
    "updated_at": "2026-07-13 12:19:45.172119"
  },
  {
    "id": 251,
    "cotization_date": "2026-03-09",
    "created_at": "2026-04-15 13:14:04.703315",
    "financial_value": "99516.41",
    "fund_investment_id": 158,
    "liquidation_date": "2026-03-09",
    "number_of_quotas": "98279.561715806574262901386056479",
    "quota_value_at_application": "1.012585",
    "request_date": "2026-03-09",
    "updated_at": "2026-04-15 13:14:04.703315"
  },
  {
    "id": 635,
    "cotization_date": "2026-05-11",
    "created_at": "2026-06-09 12:34:12.131238",
    "financial_value": "40000.0",
    "fund_investment_id": 158,
    "liquidation_date": "2026-05-11",
    "number_of_quotas": "38619.656246439750439781335506333",
    "quota_value_at_application": "1.035742",
    "request_date": "2026-05-11",
    "updated_at": "2026-06-09 12:34:12.131238"
  }
]' and those withdrawals '[
  {
    "id": 28,
    "cotization_date": "2026-01-19",
    "created_at": "2026-04-07 14:26:50.776539",
    "fund_investment_id": 97,
    "liquidation_date": "2026-01-19",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "146514.67234557536678116788310473",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-01-19",
    "updated_at": "2026-04-07 14:26:50.776539"
  },
  {
    "id": 43,
    "cotization_date": "2026-02-18",
    "created_at": "2026-04-10 15:09:08.122118",
    "fund_investment_id": 97,
    "liquidation_date": "2026-02-18",
    "redeemed_liquid_value": "2000000.0",
    "redeemed_quotas": "289713.02910471576037429764508213",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-02-18",
    "updated_at": "2026-04-10 15:09:08.122118"
  },
  {
    "id": 66,
    "cotization_date": "2026-03-18",
    "created_at": "2026-04-15 13:06:10.638004",
    "fund_investment_id": 97,
    "liquidation_date": "2026-03-18",
    "redeemed_liquid_value": "1800000.0",
    "redeemed_quotas": "258032.22048337175863150031544439",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-03-18",
    "updated_at": "2026-04-15 13:06:10.638004"
  },
  {
    "id": 190,
    "cotization_date": "2026-04-16",
    "created_at": "2026-05-12 12:37:32.186155",
    "fund_investment_id": 97,
    "liquidation_date": "2026-04-16",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "141787.29693577801100212709302863",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-04-16",
    "updated_at": "2026-05-12 12:37:32.186155"
  },
  {
    "id": 353,
    "cotization_date": "2026-05-19",
    "created_at": "2026-06-15 12:14:14.398848",
    "fund_investment_id": 97,
    "liquidation_date": "2026-05-19",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "140244.64556461582714118162004163",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-05-19",
    "updated_at": "2026-06-15 12:14:14.398848"
  },
  {
    "id": 510,
    "cotization_date": "2026-07-16",
    "created_at": "2026-08-11 14:41:51.386573",
    "fund_investment_id": 97,
    "liquidation_date": "2026-07-16",
    "redeemed_liquid_value": "3000000.0",
    "redeemed_quotas": "411896.78745219594534294389224341",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-07-16",
    "updated_at": "2026-08-11 14:41:51.386573"
  },
  {
    "id": 26,
    "cotization_date": "2026-01-19",
    "created_at": "2026-04-07 14:25:50.431433",
    "fund_investment_id": 99,
    "liquidation_date": "2026-01-19",
    "redeemed_liquid_value": "500000.0",
    "redeemed_quotas": "110448.00582812037153825576533068",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-01-19",
    "updated_at": "2026-04-07 14:25:50.431433"
  },
  {
    "id": 187,
    "cotization_date": "2026-04-16",
    "created_at": "2026-05-12 12:33:31.055649",
    "fund_investment_id": 99,
    "liquidation_date": "2026-04-16",
    "redeemed_liquid_value": "500000.0",
    "redeemed_quotas": "106301.23985514117442460201878811",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-04-16",
    "updated_at": "2026-05-12 12:33:31.055649"
  },
  {
    "id": 331,
    "cotization_date": "2026-05-19",
    "created_at": "2026-06-09 12:45:25.097469",
    "fund_investment_id": 99,
    "liquidation_date": "2026-05-19",
    "redeemed_liquid_value": "500000.0",
    "redeemed_quotas": "106020.34403177556935045151944116",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-05-19",
    "updated_at": "2026-06-09 12:45:25.097469"
  },
  {
    "id": 431,
    "cotization_date": "2026-06-18",
    "created_at": "2026-07-10 14:48:10.93434",
    "fund_investment_id": 99,
    "liquidation_date": "2026-06-18",
    "redeemed_liquid_value": "500000.0",
    "redeemed_quotas": "105445.30077744820263212559800666",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-06-18",
    "updated_at": "2026-07-10 14:48:10.93434"
  },
  {
    "id": 33,
    "cotization_date": "2026-01-19",
    "created_at": "2026-04-07 14:42:01.753466",
    "fund_investment_id": 113,
    "liquidation_date": "2026-01-19",
    "redeemed_liquid_value": "500000.0",
    "redeemed_quotas": "215713.52208841752128768892729548",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-01-19",
    "updated_at": "2026-04-07 14:42:01.753466"
  },
  {
    "id": 429,
    "cotization_date": "2026-06-18",
    "created_at": "2026-07-10 14:46:43.448478",
    "fund_investment_id": 113,
    "liquidation_date": "2026-06-18",
    "redeemed_liquid_value": "750000.0",
    "redeemed_quotas": "313805.82448714714104065542739726",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-06-18",
    "updated_at": "2026-07-10 14:46:43.448478"
  },
  {
    "id": 30,
    "cotization_date": "2026-01-19",
    "created_at": "2026-04-07 14:27:32.923209",
    "fund_investment_id": 100,
    "liquidation_date": "2026-01-19",
    "redeemed_liquid_value": "500000.0",
    "redeemed_quotas": "201665.5151565751226227164909555",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-01-19",
    "updated_at": "2026-04-07 14:27:32.923209"
  },
  {
    "id": 63,
    "cotization_date": "2026-03-18",
    "created_at": "2026-04-15 13:03:58.025378",
    "fund_investment_id": 100,
    "liquidation_date": "2026-03-18",
    "redeemed_liquid_value": "200000.0",
    "redeemed_quotas": "78929.058956455232819018430329912",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-03-18",
    "updated_at": "2026-04-15 13:03:58.025378"
  },
  {
    "id": 64,
    "cotization_date": "2026-03-27",
    "created_at": "2026-04-15 13:04:18.131074",
    "fund_investment_id": 100,
    "liquidation_date": "2026-03-27",
    "redeemed_liquid_value": "300000.0",
    "redeemed_quotas": "117996.46718577245797260830010749",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-03-27",
    "updated_at": "2026-04-15 13:04:18.131074"
  },
  {
    "id": 188,
    "cotization_date": "2026-04-16",
    "created_at": "2026-05-12 12:36:56.493403",
    "fund_investment_id": 100,
    "liquidation_date": "2026-04-16",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "390530.87595684946245377578919456",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-04-16",
    "updated_at": "2026-05-12 12:36:56.493403"
  },
  {
    "id": 324,
    "cotization_date": "2026-05-19",
    "created_at": "2026-06-09 12:35:39.577384",
    "fund_investment_id": 100,
    "liquidation_date": "2026-05-19",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "385967.01139953568168528635857493",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-05-19",
    "updated_at": "2026-06-09 12:35:39.577384"
  },
  {
    "id": 509,
    "cotization_date": "2026-07-16",
    "created_at": "2026-08-11 14:40:58.726665",
    "fund_investment_id": 100,
    "liquidation_date": "2026-07-16",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "377639.79658809996578583442911814",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-07-16",
    "updated_at": "2026-08-11 14:40:58.726665"
  },
  {
    "id": 27,
    "cotization_date": "2026-01-19",
    "created_at": "2026-04-07 14:26:26.20676",
    "fund_investment_id": 101,
    "liquidation_date": "2026-01-19",
    "redeemed_liquid_value": "500000.0",
    "redeemed_quotas": "78257.254760545321593493003175366",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-01-19",
    "updated_at": "2026-04-07 14:26:26.20676"
  },
  {
    "id": 191,
    "cotization_date": "2026-04-16",
    "created_at": "2026-05-12 12:37:59.724604",
    "fund_investment_id": 101,
    "liquidation_date": "2026-04-16",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "151542.68176900621794777566409413",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-04-16",
    "updated_at": "2026-05-12 12:37:59.724604"
  },
  {
    "id": 354,
    "cotization_date": "2026-05-19",
    "created_at": "2026-06-15 12:16:38.541647",
    "fund_investment_id": 101,
    "liquidation_date": "2026-05-19",
    "redeemed_liquid_value": "500000.0",
    "redeemed_quotas": "74872.436087016745220330861295069",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-05-19",
    "updated_at": "2026-06-15 12:16:38.541647"
  },
  {
    "id": 430,
    "cotization_date": "2026-06-18",
    "created_at": "2026-07-10 14:47:51.77873",
    "fund_investment_id": 101,
    "liquidation_date": "2026-06-18",
    "redeemed_liquid_value": "1250000.0",
    "redeemed_quotas": "185047.37286764360823428240923389",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-06-18",
    "updated_at": "2026-07-10 14:47:51.77873"
  },
  {
    "id": 46,
    "cotization_date": "2026-01-19",
    "created_at": "2026-04-10 15:27:27.871539",
    "fund_investment_id": 141,
    "liquidation_date": "2026-01-19",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "234212.93562727728164972097041914",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-01-19",
    "updated_at": "2026-04-10 15:27:27.871539"
  },
  {
    "id": 47,
    "cotization_date": "2026-02-18",
    "created_at": "2026-04-10 15:29:54.856513",
    "fund_investment_id": 141,
    "liquidation_date": "2026-02-18",
    "redeemed_liquid_value": "1800000.0",
    "redeemed_quotas": "416602.82614099413469509996384813",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-02-18",
    "updated_at": "2026-04-10 15:29:54.856513"
  },
  {
    "id": 65,
    "cotization_date": "2026-03-18",
    "created_at": "2026-04-15 13:05:01.045606",
    "fund_investment_id": 141,
    "liquidation_date": "2026-03-18",
    "redeemed_liquid_value": "1800000.0",
    "redeemed_quotas": "413075.01763600839184846939641937",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-03-18",
    "updated_at": "2026-04-15 13:05:01.045606"
  },
  {
    "id": 189,
    "cotization_date": "2026-04-16",
    "created_at": "2026-05-12 12:37:15.758378",
    "fund_investment_id": 141,
    "liquidation_date": "2026-04-16",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "227032.02173150512013967009976922",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-04-16",
    "updated_at": "2026-05-12 12:37:15.758378"
  },
  {
    "id": 325,
    "cotization_date": "2026-05-19",
    "created_at": "2026-06-09 12:37:05.590032",
    "fund_investment_id": 141,
    "liquidation_date": "2026-05-19",
    "redeemed_liquid_value": "1000000.0",
    "redeemed_quotas": "224675.22634343989903994029031185",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-05-19",
    "updated_at": "2026-06-09 12:37:05.590032"
  },
  {
    "id": 432,
    "cotization_date": "2026-06-18",
    "created_at": "2026-07-13 12:20:20.000115",
    "fund_investment_id": 141,
    "liquidation_date": "2026-06-18",
    "redeemed_liquid_value": "1500000.0",
    "redeemed_quotas": "333522.2551618683560977095692649",
    "redemption_type": "partial",
    "redemption_yield": "0.0",
    "request_date": "2026-06-18",
    "updated_at": "2026-07-13 12:20:20.000115"
  }
]' and those quotas '[
  {
    "created_at": "2026-08-16 17:50:15.29419",
    "date": "2026-01-02",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.349803",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294199"
  },
  {
    "created_at": "2026-08-16 17:50:15.541235",
    "date": "2026-01-02",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.784513",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541267"
  },
  {
    "created_at": "2026-08-16 17:50:16.283097",
    "date": "2026-01-02",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.245962",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283103"
  },
  {
    "created_at": "2026-08-16 17:50:16.354968",
    "date": "2026-01-02",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.520476",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.354975"
  },
  {
    "created_at": "2026-08-16 17:50:17.845552",
    "date": "2026-01-02",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.464277",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.845588"
  },
  {
    "created_at": "2026-08-16 17:50:17.849803",
    "date": "2026-01-02",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.309962",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.849821"
  },
  {
    "created_at": "2026-08-16 17:50:15.294235",
    "date": "2026-01-05",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.353339",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.29424"
  },
  {
    "created_at": "2026-08-16 17:50:15.541324",
    "date": "2026-01-05",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.788708",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.54133"
  },
  {
    "created_at": "2026-08-16 17:50:16.283144",
    "date": "2026-01-05",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.248145",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283149"
  },
  {
    "created_at": "2026-08-16 17:50:16.355017",
    "date": "2026-01-05",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.520042",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.355023"
  },
  {
    "created_at": "2026-08-16 17:50:17.84565",
    "date": "2026-01-05",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.465750",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.845656"
  },
  {
    "created_at": "2026-08-16 17:50:17.849955",
    "date": "2026-01-05",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.313061",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.849965"
  },
  {
    "created_at": "2026-08-16 17:50:15.294277",
    "date": "2026-01-06",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.356873",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294282"
  },
  {
    "created_at": "2026-08-16 17:50:15.541371",
    "date": "2026-01-06",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.792755",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541376"
  },
  {
    "created_at": "2026-08-16 17:50:16.283208",
    "date": "2026-01-06",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.250058",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283218"
  },
  {
    "created_at": "2026-08-16 17:50:16.356417",
    "date": "2026-01-06",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.519183",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.356449"
  },
  {
    "created_at": "2026-08-16 17:50:17.845694",
    "date": "2026-01-06",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.467168",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.8457"
  },
  {
    "created_at": "2026-08-16 17:50:17.850233",
    "date": "2026-01-06",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.315164",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.850329"
  },
  {
    "created_at": "2026-08-16 17:50:15.294321",
    "date": "2026-01-07",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.360245",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294326"
  },
  {
    "created_at": "2026-08-16 17:50:15.541411",
    "date": "2026-01-07",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.796331",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541416"
  },
  {
    "created_at": "2026-08-16 17:50:16.283327",
    "date": "2026-01-07",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.253019",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283336"
  },
  {
    "created_at": "2026-08-16 17:50:16.356514",
    "date": "2026-01-07",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.520430",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.35652"
  },
  {
    "created_at": "2026-08-16 17:50:17.845963",
    "date": "2026-01-07",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.468426",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.845975"
  },
  {
    "created_at": "2026-08-16 17:50:17.850658",
    "date": "2026-01-07",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.315783",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.850669"
  },
  {
    "created_at": "2026-08-16 17:50:15.294362",
    "date": "2026-01-08",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.363822",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294367"
  },
  {
    "created_at": "2026-08-16 17:50:15.541449",
    "date": "2026-01-08",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.799994",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541508"
  },
  {
    "created_at": "2026-08-16 17:50:16.283403",
    "date": "2026-01-08",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.254843",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283413"
  },
  {
    "created_at": "2026-08-16 17:50:16.356766",
    "date": "2026-01-08",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.523768",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.356776"
  },
  {
    "created_at": "2026-08-16 17:50:17.846028",
    "date": "2026-01-08",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.469795",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846033"
  },
  {
    "created_at": "2026-08-16 17:50:17.850718",
    "date": "2026-01-08",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.317009",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.850724"
  },
  {
    "created_at": "2026-08-16 17:50:15.294402",
    "date": "2026-01-09",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.367361",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294407"
  },
  {
    "created_at": "2026-08-16 17:50:15.541563",
    "date": "2026-01-09",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.803352",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541569"
  },
  {
    "created_at": "2026-08-16 17:50:16.283498",
    "date": "2026-01-09",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.256286",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283506"
  },
  {
    "created_at": "2026-08-16 17:50:16.356814",
    "date": "2026-01-09",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.522679",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.35682"
  },
  {
    "created_at": "2026-08-16 17:50:17.8461",
    "date": "2026-01-09",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.471075",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846105"
  },
  {
    "created_at": "2026-08-16 17:50:17.850869",
    "date": "2026-01-09",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.315247",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.850879"
  },
  {
    "created_at": "2026-08-16 17:50:15.29444",
    "date": "2026-01-12",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.370862",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294445"
  },
  {
    "created_at": "2026-08-16 17:50:15.541607",
    "date": "2026-01-12",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.807435",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541613"
  },
  {
    "created_at": "2026-08-16 17:50:16.283565",
    "date": "2026-01-12",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.258866",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283571"
  },
  {
    "created_at": "2026-08-16 17:50:16.356855",
    "date": "2026-01-12",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.525942",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.356859"
  },
  {
    "created_at": "2026-08-16 17:50:17.846144",
    "date": "2026-01-12",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.472524",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846149"
  },
  {
    "created_at": "2026-08-16 17:50:17.851098",
    "date": "2026-01-12",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.319106",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851128"
  },
  {
    "created_at": "2026-08-16 17:50:15.294481",
    "date": "2026-01-13",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.374351",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294486"
  },
  {
    "created_at": "2026-08-16 17:50:15.54165",
    "date": "2026-01-13",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.811486",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541655"
  },
  {
    "created_at": "2026-08-16 17:50:16.283613",
    "date": "2026-01-13",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.261660",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283619"
  },
  {
    "created_at": "2026-08-16 17:50:16.356891",
    "date": "2026-01-13",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.527848",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.356896"
  },
  {
    "created_at": "2026-08-16 17:50:17.846186",
    "date": "2026-01-13",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.473956",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846191"
  },
  {
    "created_at": "2026-08-16 17:50:17.851178",
    "date": "2026-01-13",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.321705",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851184"
  },
  {
    "created_at": "2026-08-16 17:50:15.294522",
    "date": "2026-01-14",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.378040",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294527"
  },
  {
    "created_at": "2026-08-16 17:50:15.541689",
    "date": "2026-01-14",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.814733",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541695"
  },
  {
    "created_at": "2026-08-16 17:50:16.283658",
    "date": "2026-01-14",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.263375",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283663"
  },
  {
    "created_at": "2026-08-16 17:50:16.35693",
    "date": "2026-01-14",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.523791",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.356935"
  },
  {
    "created_at": "2026-08-16 17:50:17.846226",
    "date": "2026-01-14",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.475240",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846231"
  },
  {
    "created_at": "2026-08-16 17:50:17.851384",
    "date": "2026-01-14",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.319674",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851397"
  },
  {
    "created_at": "2026-08-16 17:50:15.294561",
    "date": "2026-01-15",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.381965",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294566"
  },
  {
    "created_at": "2026-08-16 17:50:15.54173",
    "date": "2026-01-15",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.818196",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541735"
  },
  {
    "created_at": "2026-08-16 17:50:16.283702",
    "date": "2026-01-15",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.265418",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283708"
  },
  {
    "created_at": "2026-08-16 17:50:16.356966",
    "date": "2026-01-15",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.526100",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.356972"
  },
  {
    "created_at": "2026-08-16 17:50:17.846268",
    "date": "2026-01-15",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.476685",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846273"
  },
  {
    "created_at": "2026-08-16 17:50:17.851457",
    "date": "2026-01-15",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.319479",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851463"
  },
  {
    "created_at": "2026-08-16 17:50:15.294602",
    "date": "2026-01-16",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.385518",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294607"
  },
  {
    "created_at": "2026-08-16 17:50:15.541774",
    "date": "2026-01-16",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.821132",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541779"
  },
  {
    "created_at": "2026-08-16 17:50:16.283748",
    "date": "2026-01-16",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.266890",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283753"
  },
  {
    "created_at": "2026-08-16 17:50:16.357007",
    "date": "2026-01-16",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.524537",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357012"
  },
  {
    "created_at": "2026-08-16 17:50:17.84631",
    "date": "2026-01-16",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.477858",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846315"
  },
  {
    "created_at": "2026-08-16 17:50:17.851518",
    "date": "2026-01-16",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.314898",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851524"
  },
  {
    "created_at": "2026-08-16 17:50:15.294642",
    "date": "2026-01-19",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.389184",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294647"
  },
  {
    "created_at": "2026-08-16 17:50:15.541817",
    "date": "2026-01-19",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.825255",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541822"
  },
  {
    "created_at": "2026-08-16 17:50:16.283793",
    "date": "2026-01-19",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.269619",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283798"
  },
  {
    "created_at": "2026-08-16 17:50:16.357208",
    "date": "2026-01-19",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.527017",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357222"
  },
  {
    "created_at": "2026-08-16 17:50:17.846352",
    "date": "2026-01-19",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.479353",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846357"
  },
  {
    "created_at": "2026-08-16 17:50:17.851558",
    "date": "2026-01-19",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.317889",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851563"
  },
  {
    "created_at": "2026-08-16 17:50:15.29468",
    "date": "2026-01-20",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.392644",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294685"
  },
  {
    "created_at": "2026-08-16 17:50:15.541859",
    "date": "2026-01-20",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.828672",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.541864"
  },
  {
    "created_at": "2026-08-16 17:50:16.283839",
    "date": "2026-01-20",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.271429",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283844"
  },
  {
    "created_at": "2026-08-16 17:50:16.357287",
    "date": "2026-01-20",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.526600",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357294"
  },
  {
    "created_at": "2026-08-16 17:50:17.846392",
    "date": "2026-01-20",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.480601",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846397"
  },
  {
    "created_at": "2026-08-16 17:50:17.851597",
    "date": "2026-01-20",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.316010",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851601"
  },
  {
    "created_at": "2026-08-16 17:50:15.294729",
    "date": "2026-01-21",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.395689",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294735"
  },
  {
    "created_at": "2026-08-16 17:50:15.542329",
    "date": "2026-01-21",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.833216",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.542342"
  },
  {
    "created_at": "2026-08-16 17:50:16.283882",
    "date": "2026-01-21",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.274224",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283888"
  },
  {
    "created_at": "2026-08-16 17:50:16.357332",
    "date": "2026-01-21",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.532435",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357337"
  },
  {
    "created_at": "2026-08-16 17:50:17.846498",
    "date": "2026-01-21",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.481981",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846506"
  },
  {
    "created_at": "2026-08-16 17:50:17.851639",
    "date": "2026-01-21",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.321320",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851644"
  },
  {
    "created_at": "2026-08-16 17:50:15.294772",
    "date": "2026-01-22",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.399299",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294778"
  },
  {
    "created_at": "2026-08-16 17:50:15.542396",
    "date": "2026-01-22",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.837538",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.542402"
  },
  {
    "created_at": "2026-08-16 17:50:16.283927",
    "date": "2026-01-22",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.277233",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283933"
  },
  {
    "created_at": "2026-08-16 17:50:16.357369",
    "date": "2026-01-22",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.539468",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357374"
  },
  {
    "created_at": "2026-08-16 17:50:17.846547",
    "date": "2026-01-22",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.483518",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.846552"
  },
  {
    "created_at": "2026-08-16 17:50:17.851678",
    "date": "2026-01-22",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.325834",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851684"
  },
  {
    "created_at": "2026-08-16 17:50:15.294815",
    "date": "2026-01-23",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.402779",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.29482"
  },
  {
    "created_at": "2026-08-16 17:50:15.542439",
    "date": "2026-01-23",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.841591",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.542452"
  },
  {
    "created_at": "2026-08-16 17:50:16.283971",
    "date": "2026-01-23",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.279537",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.283976"
  },
  {
    "created_at": "2026-08-16 17:50:16.357411",
    "date": "2026-01-23",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.546133",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357418"
  },
  {
    "created_at": "2026-08-16 17:50:17.848266",
    "date": "2026-01-23",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.484918",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.848356"
  },
  {
    "created_at": "2026-08-16 17:50:17.851718",
    "date": "2026-01-23",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.328145",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851722"
  },
  {
    "created_at": "2026-08-16 17:50:15.294857",
    "date": "2026-01-26",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.406382",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294863"
  },
  {
    "created_at": "2026-08-16 17:50:15.54249",
    "date": "2026-01-26",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.845585",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.542495"
  },
  {
    "created_at": "2026-08-16 17:50:16.284026",
    "date": "2026-01-26",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.281984",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.284031"
  },
  {
    "created_at": "2026-08-16 17:50:16.357457",
    "date": "2026-01-26",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.551010",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357463"
  },
  {
    "created_at": "2026-08-16 17:50:17.848501",
    "date": "2026-01-26",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.486359",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.848512"
  },
  {
    "created_at": "2026-08-16 17:50:17.851756",
    "date": "2026-01-26",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.331253",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851761"
  },
  {
    "created_at": "2026-08-16 17:50:15.294901",
    "date": "2026-01-27",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.409821",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294907"
  },
  {
    "created_at": "2026-08-16 17:50:15.542532",
    "date": "2026-01-27",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.849980",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.542537"
  },
  {
    "created_at": "2026-08-16 17:50:16.284095",
    "date": "2026-01-27",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.285751",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.2841"
  },
  {
    "created_at": "2026-08-16 17:50:16.357506",
    "date": "2026-01-27",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.559078",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357512"
  },
  {
    "created_at": "2026-08-16 17:50:17.848637",
    "date": "2026-01-27",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.487846",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.84865"
  },
  {
    "created_at": "2026-08-16 17:50:17.851795",
    "date": "2026-01-27",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.337700",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.8518"
  },
  {
    "created_at": "2026-08-16 17:50:15.294943",
    "date": "2026-01-28",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.413535",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294948"
  },
  {
    "created_at": "2026-08-16 17:50:15.542572",
    "date": "2026-01-28",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.854100",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.542577"
  },
  {
    "created_at": "2026-08-16 17:50:16.284231",
    "date": "2026-01-28",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.288676",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.284245"
  },
  {
    "created_at": "2026-08-16 17:50:16.357547",
    "date": "2026-01-28",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.564201",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357552"
  },
  {
    "created_at": "2026-08-16 17:50:17.848712",
    "date": "2026-01-28",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.489379",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.848718"
  },
  {
    "created_at": "2026-08-16 17:50:17.851833",
    "date": "2026-01-28",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.341998",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851839"
  },
  {
    "created_at": "2026-08-16 17:50:15.294987",
    "date": "2026-01-29",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.417071",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.294993"
  },
  {
    "created_at": "2026-08-16 17:50:15.542611",
    "date": "2026-01-29",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.858381",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.542616"
  },
  {
    "created_at": "2026-08-16 17:50:16.284306",
    "date": "2026-01-29",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.291221",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.284311"
  },
  {
    "created_at": "2026-08-16 17:50:16.357588",
    "date": "2026-01-29",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.570468",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.357595"
  },
  {
    "created_at": "2026-08-16 17:50:17.848758",
    "date": "2026-01-29",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.490929",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.848763"
  },
  {
    "created_at": "2026-08-16 17:50:17.851873",
    "date": "2026-01-29",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.347670",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851886"
  },
  {
    "created_at": "2026-08-16 17:50:15.295818",
    "date": "2026-01-30",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.420635",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.295835"
  },
  {
    "created_at": "2026-08-16 17:50:15.542652",
    "date": "2026-01-30",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.862079",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:15.542657"
  },
  {
    "created_at": "2026-08-16 17:50:16.284354",
    "date": "2026-01-30",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.293465",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.284359"
  },
  {
    "created_at": "2026-08-16 17:50:16.357634",
    "date": "2026-01-30",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.572181",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:16.35764"
  },
  {
    "created_at": "2026-08-16 17:50:17.848809",
    "date": "2026-01-30",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.492280",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.848816"
  },
  {
    "created_at": "2026-08-16 17:50:17.851922",
    "date": "2026-01-30",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.348484",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:17.851927"
  },
  {
    "created_at": "2026-08-16 17:50:00.425203",
    "date": "2026-02-02",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.424180",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425223"
  },
  {
    "created_at": "2026-08-16 17:50:00.647114",
    "date": "2026-02-02",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.865470",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647148"
  },
  {
    "created_at": "2026-08-16 17:50:01.301819",
    "date": "2026-02-02",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.295915",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.301826"
  },
  {
    "created_at": "2026-08-16 17:50:01.352233",
    "date": "2026-02-02",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.570822",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352238"
  },
  {
    "created_at": "2026-08-16 17:50:03.00624",
    "date": "2026-02-02",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.493575",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006276"
  },
  {
    "created_at": "2026-08-16 17:50:03.007404",
    "date": "2026-02-02",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.346589",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007418"
  },
  {
    "created_at": "2026-08-16 17:50:09.897742",
    "date": "2026-02-02",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.000000",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.897776"
  },
  {
    "created_at": "2026-08-16 17:50:00.42526",
    "date": "2026-02-03",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.427751",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425264"
  },
  {
    "created_at": "2026-08-16 17:50:00.647194",
    "date": "2026-02-03",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.869692",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647199"
  },
  {
    "created_at": "2026-08-16 17:50:01.301865",
    "date": "2026-02-03",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.298760",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.301871"
  },
  {
    "created_at": "2026-08-16 17:50:01.352273",
    "date": "2026-02-03",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.574336",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352278"
  },
  {
    "created_at": "2026-08-16 17:50:03.006322",
    "date": "2026-02-03",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.495068",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006328"
  },
  {
    "created_at": "2026-08-16 17:50:03.007453",
    "date": "2026-02-03",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.350816",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007458"
  },
  {
    "created_at": "2026-08-16 17:50:09.897835",
    "date": "2026-02-03",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.000534",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.897841"
  },
  {
    "created_at": "2026-08-16 17:50:00.425298",
    "date": "2026-02-04",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.431391",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425303"
  },
  {
    "created_at": "2026-08-16 17:50:00.647236",
    "date": "2026-02-04",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.872967",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647241"
  },
  {
    "created_at": "2026-08-16 17:50:01.30191",
    "date": "2026-02-04",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.301220",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.301915"
  },
  {
    "created_at": "2026-08-16 17:50:01.352314",
    "date": "2026-02-04",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.573603",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.35232"
  },
  {
    "created_at": "2026-08-16 17:50:03.006363",
    "date": "2026-02-04",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.496326",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006369"
  },
  {
    "created_at": "2026-08-16 17:50:03.007511",
    "date": "2026-02-04",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.348950",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007515"
  },
  {
    "created_at": "2026-08-16 17:50:09.897884",
    "date": "2026-02-04",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.001075",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.897891"
  },
  {
    "created_at": "2026-08-16 17:50:00.425336",
    "date": "2026-02-05",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.434834",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425341"
  },
  {
    "created_at": "2026-08-16 17:50:00.647275",
    "date": "2026-02-05",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.876750",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.64728"
  },
  {
    "created_at": "2026-08-16 17:50:01.301952",
    "date": "2026-02-05",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.303755",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.301958"
  },
  {
    "created_at": "2026-08-16 17:50:01.352357",
    "date": "2026-02-05",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.575967",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352363"
  },
  {
    "created_at": "2026-08-16 17:50:03.006407",
    "date": "2026-02-05",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.497690",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006412"
  },
  {
    "created_at": "2026-08-16 17:50:03.007549",
    "date": "2026-02-05",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.351284",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007554"
  },
  {
    "created_at": "2026-08-16 17:50:09.897935",
    "date": "2026-02-05",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.001619",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.897941"
  },
  {
    "created_at": "2026-08-16 17:50:00.425373",
    "date": "2026-02-06",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.438396",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425378"
  },
  {
    "created_at": "2026-08-16 17:50:00.647317",
    "date": "2026-02-06",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.880402",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647323"
  },
  {
    "created_at": "2026-08-16 17:50:01.301994",
    "date": "2026-02-06",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.306290",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302"
  },
  {
    "created_at": "2026-08-16 17:50:01.352404",
    "date": "2026-02-06",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.575734",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352409"
  },
  {
    "created_at": "2026-08-16 17:50:03.006451",
    "date": "2026-02-06",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.499045",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006456"
  },
  {
    "created_at": "2026-08-16 17:50:03.007588",
    "date": "2026-02-06",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.351525",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007593"
  },
  {
    "created_at": "2026-08-16 17:50:09.897976",
    "date": "2026-02-06",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.002146",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.89798"
  },
  {
    "created_at": "2026-08-16 17:50:00.425411",
    "date": "2026-02-09",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.441896",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425415"
  },
  {
    "created_at": "2026-08-16 17:50:00.647357",
    "date": "2026-02-09",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.884591",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647362"
  },
  {
    "created_at": "2026-08-16 17:50:01.302036",
    "date": "2026-02-09",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.308538",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302042"
  },
  {
    "created_at": "2026-08-16 17:50:01.352443",
    "date": "2026-02-09",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.579512",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352449"
  },
  {
    "created_at": "2026-08-16 17:50:03.006495",
    "date": "2026-02-09",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.500505",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.0065"
  },
  {
    "created_at": "2026-08-16 17:50:03.007625",
    "date": "2026-02-09",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.355042",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.00763"
  },
  {
    "created_at": "2026-08-16 17:50:09.898027",
    "date": "2026-02-09",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.002690",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898032"
  },
  {
    "created_at": "2026-08-16 17:50:00.425449",
    "date": "2026-02-10",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.445053",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425454"
  },
  {
    "created_at": "2026-08-16 17:50:00.647396",
    "date": "2026-02-10",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.887989",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647401"
  },
  {
    "created_at": "2026-08-16 17:50:01.30211",
    "date": "2026-02-10",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.310556",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302115"
  },
  {
    "created_at": "2026-08-16 17:50:01.352483",
    "date": "2026-02-10",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.581433",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352488"
  },
  {
    "created_at": "2026-08-16 17:50:03.006535",
    "date": "2026-02-10",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.501625",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.00654"
  },
  {
    "created_at": "2026-08-16 17:50:03.007666",
    "date": "2026-02-10",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.354146",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007671"
  },
  {
    "created_at": "2026-08-16 17:50:09.898089",
    "date": "2026-02-10",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.003219",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898096"
  },
  {
    "created_at": "2026-08-16 17:50:00.425488",
    "date": "2026-02-11",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.448522",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425493"
  },
  {
    "created_at": "2026-08-16 17:50:00.647433",
    "date": "2026-02-11",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.891858",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647438"
  },
  {
    "created_at": "2026-08-16 17:50:01.30215",
    "date": "2026-02-11",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.313449",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302155"
  },
  {
    "created_at": "2026-08-16 17:50:01.352524",
    "date": "2026-02-11",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.584843",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.35253"
  },
  {
    "created_at": "2026-08-16 17:50:03.006588",
    "date": "2026-02-11",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.503001",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006592"
  },
  {
    "created_at": "2026-08-16 17:50:03.007716",
    "date": "2026-02-11",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.356477",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007721"
  },
  {
    "created_at": "2026-08-16 17:50:09.898143",
    "date": "2026-02-11",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.003761",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898148"
  },
  {
    "created_at": "2026-08-16 17:50:00.425527",
    "date": "2026-02-12",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.451991",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425532"
  },
  {
    "created_at": "2026-08-16 17:50:00.64749",
    "date": "2026-02-12",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.895624",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647497"
  },
  {
    "created_at": "2026-08-16 17:50:01.302343",
    "date": "2026-02-12",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.316019",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302356"
  },
  {
    "created_at": "2026-08-16 17:50:01.352563",
    "date": "2026-02-12",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.589487",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352568"
  },
  {
    "created_at": "2026-08-16 17:50:03.006625",
    "date": "2026-02-12",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.504350",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006629"
  },
  {
    "created_at": "2026-08-16 17:50:03.007756",
    "date": "2026-02-12",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.358453",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.00776"
  },
  {
    "created_at": "2026-08-16 17:50:09.898195",
    "date": "2026-02-12",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.004303",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898203"
  },
  {
    "created_at": "2026-08-16 17:50:00.425565",
    "date": "2026-02-13",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.455885",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.42557"
  },
  {
    "created_at": "2026-08-16 17:50:00.647539",
    "date": "2026-02-13",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.899426",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647544"
  },
  {
    "created_at": "2026-08-16 17:50:01.302413",
    "date": "2026-02-13",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.318303",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302419"
  },
  {
    "created_at": "2026-08-16 17:50:01.352601",
    "date": "2026-02-13",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.594769",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352606"
  },
  {
    "created_at": "2026-08-16 17:50:03.006663",
    "date": "2026-02-13",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.505882",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006668"
  },
  {
    "created_at": "2026-08-16 17:50:03.007794",
    "date": "2026-02-13",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.360188",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007798"
  },
  {
    "created_at": "2026-08-16 17:50:09.898253",
    "date": "2026-02-13",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.004847",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898261"
  },
  {
    "created_at": "2026-08-16 17:50:00.425603",
    "date": "2026-02-18",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.459539",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425608"
  },
  {
    "created_at": "2026-08-16 17:50:00.647578",
    "date": "2026-02-18",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.903383",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647583"
  },
  {
    "created_at": "2026-08-16 17:50:01.30246",
    "date": "2026-02-18",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.320662",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302465"
  },
  {
    "created_at": "2026-08-16 17:50:01.35264",
    "date": "2026-02-18",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.599947",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352644"
  },
  {
    "created_at": "2026-08-16 17:50:03.006702",
    "date": "2026-02-18",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.507363",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006707"
  },
  {
    "created_at": "2026-08-16 17:50:03.007834",
    "date": "2026-02-18",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.363427",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007839"
  },
  {
    "created_at": "2026-08-16 17:50:09.898305",
    "date": "2026-02-18",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.005392",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898311"
  },
  {
    "created_at": "2026-08-16 17:50:00.42564",
    "date": "2026-02-19",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.462945",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425645"
  },
  {
    "created_at": "2026-08-16 17:50:00.647615",
    "date": "2026-02-19",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.906805",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.64762"
  },
  {
    "created_at": "2026-08-16 17:50:01.302502",
    "date": "2026-02-19",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.322926",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302507"
  },
  {
    "created_at": "2026-08-16 17:50:01.352677",
    "date": "2026-02-19",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.599386",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352682"
  },
  {
    "created_at": "2026-08-16 17:50:03.006745",
    "date": "2026-02-19",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.508625",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006751"
  },
  {
    "created_at": "2026-08-16 17:50:03.007875",
    "date": "2026-02-19",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.362419",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007881"
  },
  {
    "created_at": "2026-08-16 17:50:09.898348",
    "date": "2026-02-19",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.005930",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898352"
  },
  {
    "created_at": "2026-08-16 17:50:00.425679",
    "date": "2026-02-20",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.466727",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425685"
  },
  {
    "created_at": "2026-08-16 17:50:00.647653",
    "date": "2026-02-20",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.910905",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647658"
  },
  {
    "created_at": "2026-08-16 17:50:01.302544",
    "date": "2026-02-20",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.325682",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302549"
  },
  {
    "created_at": "2026-08-16 17:50:01.352716",
    "date": "2026-02-20",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.605979",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352721"
  },
  {
    "created_at": "2026-08-16 17:50:03.006788",
    "date": "2026-02-20",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.510168",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006794"
  },
  {
    "created_at": "2026-08-16 17:50:03.007921",
    "date": "2026-02-20",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.366713",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007926"
  },
  {
    "created_at": "2026-08-16 17:50:09.898391",
    "date": "2026-02-20",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.006477",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898396"
  },
  {
    "created_at": "2026-08-16 17:50:00.42572",
    "date": "2026-02-23",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.470687",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425726"
  },
  {
    "created_at": "2026-08-16 17:50:00.647695",
    "date": "2026-02-23",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.914730",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647699"
  },
  {
    "created_at": "2026-08-16 17:50:01.302587",
    "date": "2026-02-23",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.328115",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302592"
  },
  {
    "created_at": "2026-08-16 17:50:01.352754",
    "date": "2026-02-23",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.608592",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352759"
  },
  {
    "created_at": "2026-08-16 17:50:03.00683",
    "date": "2026-02-23",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.511685",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006835"
  },
  {
    "created_at": "2026-08-16 17:50:03.007961",
    "date": "2026-02-23",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.368205",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007965"
  },
  {
    "created_at": "2026-08-16 17:50:09.898434",
    "date": "2026-02-23",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.007025",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.89844"
  },
  {
    "created_at": "2026-08-16 17:50:00.425762",
    "date": "2026-02-24",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.474423",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425767"
  },
  {
    "created_at": "2026-08-16 17:50:00.647734",
    "date": "2026-02-24",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.918605",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647739"
  },
  {
    "created_at": "2026-08-16 17:50:01.302629",
    "date": "2026-02-24",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.330535",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302635"
  },
  {
    "created_at": "2026-08-16 17:50:01.352795",
    "date": "2026-02-24",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.614513",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352801"
  },
  {
    "created_at": "2026-08-16 17:50:03.00687",
    "date": "2026-02-24",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.513146",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006876"
  },
  {
    "created_at": "2026-08-16 17:50:03.008003",
    "date": "2026-02-24",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.370648",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.008008"
  },
  {
    "created_at": "2026-08-16 17:50:09.898478",
    "date": "2026-02-24",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.007583",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898484"
  },
  {
    "created_at": "2026-08-16 17:50:00.425802",
    "date": "2026-02-25",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.477961",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425808"
  },
  {
    "created_at": "2026-08-16 17:50:00.647773",
    "date": "2026-02-25",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.922316",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647777"
  },
  {
    "created_at": "2026-08-16 17:50:01.302672",
    "date": "2026-02-25",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.332719",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302678"
  },
  {
    "created_at": "2026-08-16 17:50:01.352839",
    "date": "2026-02-25",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.619265",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352844"
  },
  {
    "created_at": "2026-08-16 17:50:03.006913",
    "date": "2026-02-25",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.514492",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006918"
  },
  {
    "created_at": "2026-08-16 17:50:03.008041",
    "date": "2026-02-25",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.371417",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.008072"
  },
  {
    "created_at": "2026-08-16 17:50:09.898522",
    "date": "2026-02-25",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.008140",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898527"
  },
  {
    "created_at": "2026-08-16 17:50:00.425848",
    "date": "2026-02-26",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.481502",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425853"
  },
  {
    "created_at": "2026-08-16 17:50:00.647811",
    "date": "2026-02-26",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.926564",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647816"
  },
  {
    "created_at": "2026-08-16 17:50:01.302715",
    "date": "2026-02-26",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.335590",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.30272"
  },
  {
    "created_at": "2026-08-16 17:50:01.352882",
    "date": "2026-02-26",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.627786",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352888"
  },
  {
    "created_at": "2026-08-16 17:50:03.006978",
    "date": "2026-02-26",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.515949",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.006983"
  },
  {
    "created_at": "2026-08-16 17:50:03.008108",
    "date": "2026-02-26",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.374449",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.008113"
  },
  {
    "created_at": "2026-08-16 17:50:09.898565",
    "date": "2026-02-26",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.008699",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898571"
  },
  {
    "created_at": "2026-08-16 17:50:00.425888",
    "date": "2026-02-27",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.485149",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.425893"
  },
  {
    "created_at": "2026-08-16 17:50:00.647851",
    "date": "2026-02-27",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.929743",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:00.647856"
  },
  {
    "created_at": "2026-08-16 17:50:01.302758",
    "date": "2026-02-27",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.336833",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.302763"
  },
  {
    "created_at": "2026-08-16 17:50:01.352924",
    "date": "2026-02-27",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.626311",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:01.352929"
  },
  {
    "created_at": "2026-08-16 17:50:03.007016",
    "date": "2026-02-27",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.517180",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.007021"
  },
  {
    "created_at": "2026-08-16 17:50:03.008149",
    "date": "2026-02-27",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.370661",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:03.008154"
  },
  {
    "created_at": "2026-08-16 17:50:09.898608",
    "date": "2026-02-27",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.009255",
    "source": "CVM",
    "updated_at": "2026-08-16 17:50:09.898614"
  },
  {
    "created_at": "2026-08-16 17:49:46.16282",
    "date": "2026-03-02",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.488798",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.162842"
  },
  {
    "created_at": "2026-08-16 17:49:46.37156",
    "date": "2026-03-02",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.933061",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371595"
  },
  {
    "created_at": "2026-08-16 17:49:47.026769",
    "date": "2026-03-02",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.338803",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.026774"
  },
  {
    "created_at": "2026-08-16 17:49:47.085025",
    "date": "2026-03-02",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.627913",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.08503"
  },
  {
    "created_at": "2026-08-16 17:49:48.593019",
    "date": "2026-03-02",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.518433",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593063"
  },
  {
    "created_at": "2026-08-16 17:49:48.594697",
    "date": "2026-03-02",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.368021",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.594705"
  },
  {
    "created_at": "2026-08-16 17:49:55.827462",
    "date": "2026-03-02",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.009811",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.82752"
  },
  {
    "created_at": "2026-08-16 17:49:46.162887",
    "date": "2026-03-03",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.492319",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.162893"
  },
  {
    "created_at": "2026-08-16 17:49:46.371651",
    "date": "2026-03-03",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.935866",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371658"
  },
  {
    "created_at": "2026-08-16 17:49:47.026808",
    "date": "2026-03-03",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.339195",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.026814"
  },
  {
    "created_at": "2026-08-16 17:49:47.085081",
    "date": "2026-03-03",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.621425",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085086"
  },
  {
    "created_at": "2026-08-16 17:49:48.593117",
    "date": "2026-03-03",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.519533",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593123"
  },
  {
    "created_at": "2026-08-16 17:49:48.594748",
    "date": "2026-03-03",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.359867",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.594754"
  },
  {
    "created_at": "2026-08-16 17:49:55.827596",
    "date": "2026-03-03",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.010362",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.827604"
  },
  {
    "created_at": "2026-08-16 17:49:46.162932",
    "date": "2026-03-04",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.496149",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.162938"
  },
  {
    "created_at": "2026-08-16 17:49:46.371701",
    "date": "2026-03-04",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.940237",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371706"
  },
  {
    "created_at": "2026-08-16 17:49:47.026847",
    "date": "2026-03-04",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.342276",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.026852"
  },
  {
    "created_at": "2026-08-16 17:49:47.085117",
    "date": "2026-03-04",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.624987",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085122"
  },
  {
    "created_at": "2026-08-16 17:49:48.59316",
    "date": "2026-03-04",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.521166",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593165"
  },
  {
    "created_at": "2026-08-16 17:49:48.59479",
    "date": "2026-03-04",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.365261",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.594795"
  },
  {
    "created_at": "2026-08-16 17:49:55.827656",
    "date": "2026-03-04",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.010913",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.827663"
  },
  {
    "created_at": "2026-08-16 17:49:46.162977",
    "date": "2026-03-05",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.499699",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.162983"
  },
  {
    "created_at": "2026-08-16 17:49:46.371742",
    "date": "2026-03-05",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.942932",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371748"
  },
  {
    "created_at": "2026-08-16 17:49:47.026884",
    "date": "2026-03-05",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.343293",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.026889"
  },
  {
    "created_at": "2026-08-16 17:49:47.085154",
    "date": "2026-03-05",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.613500",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085159"
  },
  {
    "created_at": "2026-08-16 17:49:48.593199",
    "date": "2026-03-05",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.522230",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593205"
  },
  {
    "created_at": "2026-08-16 17:49:48.594839",
    "date": "2026-03-05",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.355328",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.594845"
  },
  {
    "created_at": "2026-08-16 17:49:55.827715",
    "date": "2026-03-05",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.011466",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.827721"
  },
  {
    "created_at": "2026-08-16 17:49:46.163023",
    "date": "2026-03-06",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.503341",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163028"
  },
  {
    "created_at": "2026-08-16 17:49:46.371784",
    "date": "2026-03-06",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.945872",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371789"
  },
  {
    "created_at": "2026-08-16 17:49:47.026922",
    "date": "2026-03-06",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.343941",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.026927"
  },
  {
    "created_at": "2026-08-16 17:49:47.085191",
    "date": "2026-03-06",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.608322",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085196"
  },
  {
    "created_at": "2026-08-16 17:49:48.59324",
    "date": "2026-03-06",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.523368",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593246"
  },
  {
    "created_at": "2026-08-16 17:49:48.594889",
    "date": "2026-03-06",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.348313",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.594895"
  },
  {
    "created_at": "2026-08-16 17:49:55.827769",
    "date": "2026-03-06",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.012027",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.827778"
  },
  {
    "created_at": "2026-08-16 17:49:46.163088",
    "date": "2026-03-09",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.507052",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163094"
  },
  {
    "created_at": "2026-08-16 17:49:46.371822",
    "date": "2026-03-09",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.949397",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371828"
  },
  {
    "created_at": "2026-08-16 17:49:47.026962",
    "date": "2026-03-09",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.345227",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.026967"
  },
  {
    "created_at": "2026-08-16 17:49:47.085225",
    "date": "2026-03-09",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.613751",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.08523"
  },
  {
    "created_at": "2026-08-16 17:49:48.59328",
    "date": "2026-03-09",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.524692",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593285"
  },
  {
    "created_at": "2026-08-16 17:49:48.594938",
    "date": "2026-03-09",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.346614",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.594943"
  },
  {
    "created_at": "2026-08-16 17:49:55.827829",
    "date": "2026-03-09",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.012585",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.827839"
  },
  {
    "created_at": "2026-08-16 17:49:46.163181",
    "date": "2026-03-10",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.510744",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163188"
  },
  {
    "created_at": "2026-08-16 17:49:46.371861",
    "date": "2026-03-10",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.954386",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371868"
  },
  {
    "created_at": "2026-08-16 17:49:47.027002",
    "date": "2026-03-10",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.349881",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027007"
  },
  {
    "created_at": "2026-08-16 17:49:47.085259",
    "date": "2026-03-10",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.625460",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085264"
  },
  {
    "created_at": "2026-08-16 17:49:48.593322",
    "date": "2026-03-10",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.526394",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593327"
  },
  {
    "created_at": "2026-08-16 17:49:48.59498",
    "date": "2026-03-10",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.360215",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.594985"
  },
  {
    "created_at": "2026-08-16 17:49:55.827889",
    "date": "2026-03-10",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.013142",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.827898"
  },
  {
    "created_at": "2026-08-16 17:49:46.163224",
    "date": "2026-03-11",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.514369",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163229"
  },
  {
    "created_at": "2026-08-16 17:49:46.371906",
    "date": "2026-03-11",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.957907",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371912"
  },
  {
    "created_at": "2026-08-16 17:49:47.027293",
    "date": "2026-03-11",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.350882",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027307"
  },
  {
    "created_at": "2026-08-16 17:49:47.085297",
    "date": "2026-03-11",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.625879",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085302"
  },
  {
    "created_at": "2026-08-16 17:49:48.59337",
    "date": "2026-03-11",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.527708",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593375"
  },
  {
    "created_at": "2026-08-16 17:49:48.595019",
    "date": "2026-03-11",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.358130",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595023"
  },
  {
    "created_at": "2026-08-16 17:49:55.82795",
    "date": "2026-03-11",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.013699",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.827958"
  },
  {
    "created_at": "2026-08-16 17:49:46.163267",
    "date": "2026-03-12",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.517937",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163273"
  },
  {
    "created_at": "2026-08-16 17:49:46.371937",
    "date": "2026-03-12",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.961164",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.37194"
  },
  {
    "created_at": "2026-08-16 17:49:47.027358",
    "date": "2026-03-12",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.350123",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027366"
  },
  {
    "created_at": "2026-08-16 17:49:47.085332",
    "date": "2026-03-12",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.616641",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085337"
  },
  {
    "created_at": "2026-08-16 17:49:48.593411",
    "date": "2026-03-12",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.528894",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593416"
  },
  {
    "created_at": "2026-08-16 17:49:48.595075",
    "date": "2026-03-12",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.349444",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595081"
  },
  {
    "created_at": "2026-08-16 17:49:55.828015",
    "date": "2026-03-12",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.014262",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828024"
  },
  {
    "created_at": "2026-08-16 17:49:46.16331",
    "date": "2026-03-13",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.521350",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163315"
  },
  {
    "created_at": "2026-08-16 17:49:46.371962",
    "date": "2026-03-13",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.963439",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371965"
  },
  {
    "created_at": "2026-08-16 17:49:47.027404",
    "date": "2026-03-13",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.348678",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027409"
  },
  {
    "created_at": "2026-08-16 17:49:47.085371",
    "date": "2026-03-13",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.595463",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085375"
  },
  {
    "created_at": "2026-08-16 17:49:48.593451",
    "date": "2026-03-13",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.529796",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593457"
  },
  {
    "created_at": "2026-08-16 17:49:48.595116",
    "date": "2026-03-13",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.335630",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595122"
  },
  {
    "created_at": "2026-08-16 17:49:55.828098",
    "date": "2026-03-13",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.014817",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828104"
  },
  {
    "created_at": "2026-08-16 17:49:46.163352",
    "date": "2026-03-16",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.524828",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163357"
  },
  {
    "created_at": "2026-08-16 17:49:46.371988",
    "date": "2026-03-16",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.968570",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.371992"
  },
  {
    "created_at": "2026-08-16 17:49:47.027448",
    "date": "2026-03-16",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.353391",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027453"
  },
  {
    "created_at": "2026-08-16 17:49:47.085405",
    "date": "2026-03-16",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.623188",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.08541"
  },
  {
    "created_at": "2026-08-16 17:49:48.593493",
    "date": "2026-03-16",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.531505",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593498"
  },
  {
    "created_at": "2026-08-16 17:49:48.595158",
    "date": "2026-03-16",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.349095",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595163"
  },
  {
    "created_at": "2026-08-16 17:49:55.828134",
    "date": "2026-03-16",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.015370",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828137"
  },
  {
    "created_at": "2026-08-16 17:49:46.163392",
    "date": "2026-03-17",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.528295",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163399"
  },
  {
    "created_at": "2026-08-16 17:49:46.372011",
    "date": "2026-03-17",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.972000",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372014"
  },
  {
    "created_at": "2026-08-16 17:49:47.027522",
    "date": "2026-03-17",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.354668",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027528"
  },
  {
    "created_at": "2026-08-16 17:49:47.08544",
    "date": "2026-03-17",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.625585",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085445"
  },
  {
    "created_at": "2026-08-16 17:49:48.593533",
    "date": "2026-03-17",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.532683",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593545"
  },
  {
    "created_at": "2026-08-16 17:49:48.595198",
    "date": "2026-03-17",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.347213",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595203"
  },
  {
    "created_at": "2026-08-16 17:49:55.828158",
    "date": "2026-03-17",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.015941",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828161"
  },
  {
    "created_at": "2026-08-16 17:49:46.163437",
    "date": "2026-03-18",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.531430",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163442"
  },
  {
    "created_at": "2026-08-16 17:49:46.372033",
    "date": "2026-03-18",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.975873",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372037"
  },
  {
    "created_at": "2026-08-16 17:49:47.02757",
    "date": "2026-03-18",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.357562",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027575"
  },
  {
    "created_at": "2026-08-16 17:49:47.085477",
    "date": "2026-03-18",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.626860",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085481"
  },
  {
    "created_at": "2026-08-16 17:49:48.593581",
    "date": "2026-03-18",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.533921",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593587"
  },
  {
    "created_at": "2026-08-16 17:49:48.595238",
    "date": "2026-03-18",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.346917",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595243"
  },
  {
    "created_at": "2026-08-16 17:49:55.828187",
    "date": "2026-03-18",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.016505",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828191"
  },
  {
    "created_at": "2026-08-16 17:49:46.163493",
    "date": "2026-03-19",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.534811",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163499"
  },
  {
    "created_at": "2026-08-16 17:49:46.372083",
    "date": "2026-03-19",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.980615",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372087"
  },
  {
    "created_at": "2026-08-16 17:49:47.027614",
    "date": "2026-03-19",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.361230",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.02762"
  },
  {
    "created_at": "2026-08-16 17:49:47.085511",
    "date": "2026-03-19",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.632103",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085516"
  },
  {
    "created_at": "2026-08-16 17:49:48.593622",
    "date": "2026-03-19",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.535511",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593627"
  },
  {
    "created_at": "2026-08-16 17:49:48.595278",
    "date": "2026-03-19",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.352292",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595284"
  },
  {
    "created_at": "2026-08-16 17:49:55.828231",
    "date": "2026-03-19",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.017079",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828236"
  },
  {
    "created_at": "2026-08-16 17:49:46.163536",
    "date": "2026-03-20",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.537797",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163541"
  },
  {
    "created_at": "2026-08-16 17:49:46.372117",
    "date": "2026-03-20",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.982019",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372121"
  },
  {
    "created_at": "2026-08-16 17:49:47.027722",
    "date": "2026-03-20",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.360061",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027727"
  },
  {
    "created_at": "2026-08-16 17:49:47.085548",
    "date": "2026-03-20",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.621449",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085553"
  },
  {
    "created_at": "2026-08-16 17:49:48.593664",
    "date": "2026-03-20",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.536025",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593669"
  },
  {
    "created_at": "2026-08-16 17:49:48.595327",
    "date": "2026-03-20",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.334861",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595332"
  },
  {
    "created_at": "2026-08-16 17:49:55.828267",
    "date": "2026-03-20",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.017652",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828272"
  },
  {
    "created_at": "2026-08-16 17:49:46.163579",
    "date": "2026-03-23",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.541210",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163584"
  },
  {
    "created_at": "2026-08-16 17:49:46.372146",
    "date": "2026-03-23",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.986989",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372149"
  },
  {
    "created_at": "2026-08-16 17:49:47.027762",
    "date": "2026-03-23",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.364408",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027767"
  },
  {
    "created_at": "2026-08-16 17:49:47.085585",
    "date": "2026-03-23",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.632398",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085589"
  },
  {
    "created_at": "2026-08-16 17:49:48.593711",
    "date": "2026-03-23",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.537611",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593716"
  },
  {
    "created_at": "2026-08-16 17:49:48.595368",
    "date": "2026-03-23",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.349583",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595373"
  },
  {
    "created_at": "2026-08-16 17:49:55.828304",
    "date": "2026-03-23",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.018201",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828309"
  },
  {
    "created_at": "2026-08-16 17:49:46.163623",
    "date": "2026-03-24",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.544584",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163628"
  },
  {
    "created_at": "2026-08-16 17:49:46.372169",
    "date": "2026-03-24",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.990082",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372172"
  },
  {
    "created_at": "2026-08-16 17:49:47.027797",
    "date": "2026-03-24",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.366634",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027803"
  },
  {
    "created_at": "2026-08-16 17:49:47.085618",
    "date": "2026-03-24",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.628279",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085623"
  },
  {
    "created_at": "2026-08-16 17:49:48.593751",
    "date": "2026-03-24",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.538756",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593764"
  },
  {
    "created_at": "2026-08-16 17:49:48.595407",
    "date": "2026-03-24",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.344844",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595412"
  },
  {
    "created_at": "2026-08-16 17:49:55.828337",
    "date": "2026-03-24",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.018751",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.82834"
  },
  {
    "created_at": "2026-08-16 17:49:46.163666",
    "date": "2026-03-25",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.548133",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.16367"
  },
  {
    "created_at": "2026-08-16 17:49:46.372193",
    "date": "2026-03-25",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.994485",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372196"
  },
  {
    "created_at": "2026-08-16 17:49:47.027836",
    "date": "2026-03-25",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.369677",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027841"
  },
  {
    "created_at": "2026-08-16 17:49:47.085655",
    "date": "2026-03-25",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.633233",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.08566"
  },
  {
    "created_at": "2026-08-16 17:49:48.593807",
    "date": "2026-03-25",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.540261",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593813"
  },
  {
    "created_at": "2026-08-16 17:49:48.595498",
    "date": "2026-03-25",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.349176",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595504"
  },
  {
    "created_at": "2026-08-16 17:49:55.828363",
    "date": "2026-03-25",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.019321",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828366"
  },
  {
    "created_at": "2026-08-16 17:49:46.163709",
    "date": "2026-03-26",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.551230",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163714"
  },
  {
    "created_at": "2026-08-16 17:49:46.372233",
    "date": "2026-03-26",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "6.997162",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372239"
  },
  {
    "created_at": "2026-08-16 17:49:47.027879",
    "date": "2026-03-26",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.369831",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027885"
  },
  {
    "created_at": "2026-08-16 17:49:47.085693",
    "date": "2026-03-26",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.626865",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085698"
  },
  {
    "created_at": "2026-08-16 17:49:48.593848",
    "date": "2026-03-26",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.541160",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593853"
  },
  {
    "created_at": "2026-08-16 17:49:48.59554",
    "date": "2026-03-26",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.339933",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595546"
  },
  {
    "created_at": "2026-08-16 17:49:55.828385",
    "date": "2026-03-26",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.019888",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828388"
  },
  {
    "created_at": "2026-08-16 17:49:46.163751",
    "date": "2026-03-27",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.554777",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163757"
  },
  {
    "created_at": "2026-08-16 17:49:46.372283",
    "date": "2026-03-27",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.000571",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372289"
  },
  {
    "created_at": "2026-08-16 17:49:47.027932",
    "date": "2026-03-27",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.371832",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027937"
  },
  {
    "created_at": "2026-08-16 17:49:47.085731",
    "date": "2026-03-27",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.630609",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085737"
  },
  {
    "created_at": "2026-08-16 17:49:48.593889",
    "date": "2026-03-27",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.542449",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593894"
  },
  {
    "created_at": "2026-08-16 17:49:48.595588",
    "date": "2026-03-27",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.339799",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595593"
  },
  {
    "created_at": "2026-08-16 17:49:55.828409",
    "date": "2026-03-27",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.020437",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828412"
  },
  {
    "created_at": "2026-08-16 17:49:46.163791",
    "date": "2026-03-30",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.558339",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163796"
  },
  {
    "created_at": "2026-08-16 17:49:46.372321",
    "date": "2026-03-30",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.004633",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372326"
  },
  {
    "created_at": "2026-08-16 17:49:47.027987",
    "date": "2026-03-30",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.374831",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.027992"
  },
  {
    "created_at": "2026-08-16 17:49:47.08577",
    "date": "2026-03-30",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.635671",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085775"
  },
  {
    "created_at": "2026-08-16 17:49:48.593927",
    "date": "2026-03-30",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.543918",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593933"
  },
  {
    "created_at": "2026-08-16 17:49:48.59564",
    "date": "2026-03-30",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.343064",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595646"
  },
  {
    "created_at": "2026-08-16 17:49:55.828432",
    "date": "2026-03-30",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.020988",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.828436"
  },
  {
    "created_at": "2026-08-16 17:49:46.163827",
    "date": "2026-03-31",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.561629",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.163831"
  },
  {
    "created_at": "2026-08-16 17:49:46.372358",
    "date": "2026-03-31",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.009903",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:46.372363"
  },
  {
    "created_at": "2026-08-16 17:49:47.028025",
    "date": "2026-03-31",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.379161",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.02803"
  },
  {
    "created_at": "2026-08-16 17:49:47.085808",
    "date": "2026-03-31",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.650966",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:47.085812"
  },
  {
    "created_at": "2026-08-16 17:49:48.593969",
    "date": "2026-03-31",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.545580",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.593974"
  },
  {
    "created_at": "2026-08-16 17:49:48.595683",
    "date": "2026-03-31",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.357168",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:48.595689"
  },
  {
    "created_at": "2026-08-16 17:49:55.828457",
    "date": "2026-03-31",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.021535",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:55.82846"
  },
  {
    "created_at": "2026-08-16 17:49:33.433627",
    "date": "2026-04-01",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.564908",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433638"
  },
  {
    "created_at": "2026-08-16 17:49:33.612142",
    "date": "2026-04-01",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.013846",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612176"
  },
  {
    "created_at": "2026-08-16 17:49:34.179771",
    "date": "2026-04-01",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.381821",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.179775"
  },
  {
    "created_at": "2026-08-16 17:49:34.222924",
    "date": "2026-04-01",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.656626",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.222929"
  },
  {
    "created_at": "2026-08-16 17:49:35.452214",
    "date": "2026-04-01",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.546910",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452246"
  },
  {
    "created_at": "2026-08-16 17:49:35.453962",
    "date": "2026-04-01",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.360189",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.453974"
  },
  {
    "created_at": "2026-08-16 17:49:41.6707",
    "date": "2026-04-01",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.022082",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.670734"
  },
  {
    "created_at": "2026-08-16 17:49:33.43366",
    "date": "2026-04-02",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.568192",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433663"
  },
  {
    "created_at": "2026-08-16 17:49:33.612224",
    "date": "2026-04-02",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.017631",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612228"
  },
  {
    "created_at": "2026-08-16 17:49:34.179795",
    "date": "2026-04-02",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.383776",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.179798"
  },
  {
    "created_at": "2026-08-16 17:49:34.222959",
    "date": "2026-04-02",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.658619",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.222963"
  },
  {
    "created_at": "2026-08-16 17:49:35.452295",
    "date": "2026-04-02",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.548203",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452301"
  },
  {
    "created_at": "2026-08-16 17:49:35.454007",
    "date": "2026-04-02",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.361076",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454011"
  },
  {
    "created_at": "2026-08-16 17:49:41.670841",
    "date": "2026-04-02",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.022630",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.670849"
  },
  {
    "created_at": "2026-08-16 17:49:33.433685",
    "date": "2026-04-06",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.571186",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433688"
  },
  {
    "created_at": "2026-08-16 17:49:33.612267",
    "date": "2026-04-06",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.021201",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612273"
  },
  {
    "created_at": "2026-08-16 17:49:34.179818",
    "date": "2026-04-06",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.384075",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.179821"
  },
  {
    "created_at": "2026-08-16 17:49:34.222996",
    "date": "2026-04-06",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.661825",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223"
  },
  {
    "created_at": "2026-08-16 17:49:35.452349",
    "date": "2026-04-06",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.549336",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452355"
  },
  {
    "created_at": "2026-08-16 17:49:35.454065",
    "date": "2026-04-06",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.360953",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454071"
  },
  {
    "created_at": "2026-08-16 17:49:41.670983",
    "date": "2026-04-06",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.023178",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.670991"
  },
  {
    "created_at": "2026-08-16 17:49:33.433732",
    "date": "2026-04-07",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.574125",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433736"
  },
  {
    "created_at": "2026-08-16 17:49:33.612314",
    "date": "2026-04-07",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.024601",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.61232"
  },
  {
    "created_at": "2026-08-16 17:49:34.17984",
    "date": "2026-04-07",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.384805",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.179843"
  },
  {
    "created_at": "2026-08-16 17:49:34.223033",
    "date": "2026-04-07",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.661370",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223038"
  },
  {
    "created_at": "2026-08-16 17:49:35.452393",
    "date": "2026-04-07",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.550416",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452398"
  },
  {
    "created_at": "2026-08-16 17:49:35.454109",
    "date": "2026-04-07",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.357806",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454115"
  },
  {
    "created_at": "2026-08-16 17:49:41.671036",
    "date": "2026-04-07",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.023722",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671042"
  },
  {
    "created_at": "2026-08-16 17:49:33.433758",
    "date": "2026-04-08",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.577600",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433762"
  },
  {
    "created_at": "2026-08-16 17:49:33.612357",
    "date": "2026-04-08",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.030420",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612362"
  },
  {
    "created_at": "2026-08-16 17:49:34.179866",
    "date": "2026-04-08",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.392610",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.179869"
  },
  {
    "created_at": "2026-08-16 17:49:34.223088",
    "date": "2026-04-08",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.679040",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223093"
  },
  {
    "created_at": "2026-08-16 17:49:35.452437",
    "date": "2026-04-08",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.552347",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452443"
  },
  {
    "created_at": "2026-08-16 17:49:35.454155",
    "date": "2026-04-08",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.377637",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454161"
  },
  {
    "created_at": "2026-08-16 17:49:41.671142",
    "date": "2026-04-08",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.024268",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671162"
  },
  {
    "created_at": "2026-08-16 17:49:33.433782",
    "date": "2026-04-09",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.581350",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433785"
  },
  {
    "created_at": "2026-08-16 17:49:33.612398",
    "date": "2026-04-09",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.034352",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612404"
  },
  {
    "created_at": "2026-08-16 17:49:34.17989",
    "date": "2026-04-09",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.395364",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.179893"
  },
  {
    "created_at": "2026-08-16 17:49:34.223125",
    "date": "2026-04-09",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.683963",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.22313"
  },
  {
    "created_at": "2026-08-16 17:49:35.452592",
    "date": "2026-04-09",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.553829",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.4526"
  },
  {
    "created_at": "2026-08-16 17:49:35.454206",
    "date": "2026-04-09",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.380469",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454212"
  },
  {
    "created_at": "2026-08-16 17:49:41.671212",
    "date": "2026-04-09",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.024815",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671218"
  },
  {
    "created_at": "2026-08-16 17:49:33.433806",
    "date": "2026-04-10",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.584459",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433809"
  },
  {
    "created_at": "2026-08-16 17:49:33.612442",
    "date": "2026-04-10",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.037855",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612448"
  },
  {
    "created_at": "2026-08-16 17:49:34.179913",
    "date": "2026-04-10",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.395302",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.179916"
  },
  {
    "created_at": "2026-08-16 17:49:34.223159",
    "date": "2026-04-10",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.690670",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223164"
  },
  {
    "created_at": "2026-08-16 17:49:35.452639",
    "date": "2026-04-10",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.555021",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452644"
  },
  {
    "created_at": "2026-08-16 17:49:35.454244",
    "date": "2026-04-10",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.379712",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454249"
  },
  {
    "created_at": "2026-08-16 17:49:41.671254",
    "date": "2026-04-10",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.025362",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671259"
  },
  {
    "created_at": "2026-08-16 17:49:33.433829",
    "date": "2026-04-13",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.587976",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433833"
  },
  {
    "created_at": "2026-08-16 17:49:33.612483",
    "date": "2026-04-13",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.041844",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612489"
  },
  {
    "created_at": "2026-08-16 17:49:34.179937",
    "date": "2026-04-13",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.397286",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.17994"
  },
  {
    "created_at": "2026-08-16 17:49:34.223197",
    "date": "2026-04-13",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.697170",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223202"
  },
  {
    "created_at": "2026-08-16 17:49:35.452681",
    "date": "2026-04-13",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.556443",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452686"
  },
  {
    "created_at": "2026-08-16 17:49:35.45428",
    "date": "2026-04-13",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.382830",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454285"
  },
  {
    "created_at": "2026-08-16 17:49:41.671294",
    "date": "2026-04-13",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.025910",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671299"
  },
  {
    "created_at": "2026-08-16 17:49:33.433854",
    "date": "2026-04-14",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.591289",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433858"
  },
  {
    "created_at": "2026-08-16 17:49:33.612525",
    "date": "2026-04-14",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.045663",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612531"
  },
  {
    "created_at": "2026-08-16 17:49:34.179962",
    "date": "2026-04-14",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.401207",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.179965"
  },
  {
    "created_at": "2026-08-16 17:49:34.223242",
    "date": "2026-04-14",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.701721",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223247"
  },
  {
    "created_at": "2026-08-16 17:49:35.452721",
    "date": "2026-04-14",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.557761",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452727"
  },
  {
    "created_at": "2026-08-16 17:49:35.454346",
    "date": "2026-04-14",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.387140",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454352"
  },
  {
    "created_at": "2026-08-16 17:49:41.671336",
    "date": "2026-04-14",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.026446",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671342"
  },
  {
    "created_at": "2026-08-16 17:49:33.433892",
    "date": "2026-04-15",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.594898",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433898"
  },
  {
    "created_at": "2026-08-16 17:49:33.612577",
    "date": "2026-04-15",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.049588",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612584"
  },
  {
    "created_at": "2026-08-16 17:49:34.179984",
    "date": "2026-04-15",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.404080",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.179987"
  },
  {
    "created_at": "2026-08-16 17:49:34.223286",
    "date": "2026-04-15",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.703874",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223291"
  },
  {
    "created_at": "2026-08-16 17:49:35.452762",
    "date": "2026-04-15",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.559198",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452767"
  },
  {
    "created_at": "2026-08-16 17:49:35.454395",
    "date": "2026-04-15",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.387866",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.4544"
  },
  {
    "created_at": "2026-08-16 17:49:41.671406",
    "date": "2026-04-15",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.026985",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671412"
  },
  {
    "created_at": "2026-08-16 17:49:33.433933",
    "date": "2026-04-16",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.598801",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433938"
  },
  {
    "created_at": "2026-08-16 17:49:33.612623",
    "date": "2026-04-16",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.052818",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612629"
  },
  {
    "created_at": "2026-08-16 17:49:34.180006",
    "date": "2026-04-16",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.404665",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.180009"
  },
  {
    "created_at": "2026-08-16 17:49:34.223322",
    "date": "2026-04-16",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.703614",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223327"
  },
  {
    "created_at": "2026-08-16 17:49:35.452812",
    "date": "2026-04-16",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.560617",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452818"
  },
  {
    "created_at": "2026-08-16 17:49:35.454434",
    "date": "2026-04-16",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.385248",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454439"
  },
  {
    "created_at": "2026-08-16 17:49:41.671472",
    "date": "2026-04-16",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.027521",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671492"
  },
  {
    "created_at": "2026-08-16 17:49:33.433969",
    "date": "2026-04-17",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.602352",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.433974"
  },
  {
    "created_at": "2026-08-16 17:49:33.612668",
    "date": "2026-04-17",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.056895",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612675"
  },
  {
    "created_at": "2026-08-16 17:49:34.180029",
    "date": "2026-04-17",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.409832",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.180033"
  },
  {
    "created_at": "2026-08-16 17:49:34.223359",
    "date": "2026-04-17",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.710427",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223364"
  },
  {
    "created_at": "2026-08-16 17:49:35.452853",
    "date": "2026-04-17",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.562107",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452858"
  },
  {
    "created_at": "2026-08-16 17:49:35.45447",
    "date": "2026-04-17",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.392325",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454475"
  },
  {
    "created_at": "2026-08-16 17:49:41.67153",
    "date": "2026-04-17",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.028069",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671535"
  },
  {
    "created_at": "2026-08-16 17:49:33.434008",
    "date": "2026-04-20",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.605926",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.434013"
  },
  {
    "created_at": "2026-08-16 17:49:33.612712",
    "date": "2026-04-20",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.060547",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612717"
  },
  {
    "created_at": "2026-08-16 17:49:34.180081",
    "date": "2026-04-20",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.411257",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.180085"
  },
  {
    "created_at": "2026-08-16 17:49:34.223403",
    "date": "2026-04-20",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.714712",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223408"
  },
  {
    "created_at": "2026-08-16 17:49:35.452894",
    "date": "2026-04-20",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.563479",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452899"
  },
  {
    "created_at": "2026-08-16 17:49:35.454516",
    "date": "2026-04-20",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.392838",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454521"
  },
  {
    "created_at": "2026-08-16 17:49:41.671593",
    "date": "2026-04-20",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.028620",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671599"
  },
  {
    "created_at": "2026-08-16 17:49:33.434068",
    "date": "2026-04-22",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.609994",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.434074"
  },
  {
    "created_at": "2026-08-16 17:49:33.612752",
    "date": "2026-04-22",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.064132",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612757"
  },
  {
    "created_at": "2026-08-16 17:49:34.180104",
    "date": "2026-04-22",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.412597",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.180108"
  },
  {
    "created_at": "2026-08-16 17:49:34.22344",
    "date": "2026-04-22",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.711967",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223445"
  },
  {
    "created_at": "2026-08-16 17:49:35.452946",
    "date": "2026-04-22",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.564981",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452951"
  },
  {
    "created_at": "2026-08-16 17:49:35.454555",
    "date": "2026-04-22",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.390844",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.45456"
  },
  {
    "created_at": "2026-08-16 17:49:41.671637",
    "date": "2026-04-22",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.029170",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671643"
  },
  {
    "created_at": "2026-08-16 17:49:33.434111",
    "date": "2026-04-23",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.614281",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.434117"
  },
  {
    "created_at": "2026-08-16 17:49:33.612798",
    "date": "2026-04-23",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.067135",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612805"
  },
  {
    "created_at": "2026-08-16 17:49:34.180128",
    "date": "2026-04-23",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.412314",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.180133"
  },
  {
    "created_at": "2026-08-16 17:49:34.223494",
    "date": "2026-04-23",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.703851",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.2235"
  },
  {
    "created_at": "2026-08-16 17:49:35.45299",
    "date": "2026-04-23",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.566427",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.452996"
  },
  {
    "created_at": "2026-08-16 17:49:35.454594",
    "date": "2026-04-23",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.383825",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.4546"
  },
  {
    "created_at": "2026-08-16 17:49:41.671686",
    "date": "2026-04-23",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.029720",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671692"
  },
  {
    "created_at": "2026-08-16 17:49:33.434152",
    "date": "2026-04-24",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.617998",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.434157"
  },
  {
    "created_at": "2026-08-16 17:49:33.612843",
    "date": "2026-04-24",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.071059",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612849"
  },
  {
    "created_at": "2026-08-16 17:49:34.180156",
    "date": "2026-04-24",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.415062",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.180159"
  },
  {
    "created_at": "2026-08-16 17:49:34.223533",
    "date": "2026-04-24",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.708986",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223539"
  },
  {
    "created_at": "2026-08-16 17:49:35.453033",
    "date": "2026-04-24",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.567898",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.453039"
  },
  {
    "created_at": "2026-08-16 17:49:35.454633",
    "date": "2026-04-24",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.387000",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454637"
  },
  {
    "created_at": "2026-08-16 17:49:41.671759",
    "date": "2026-04-24",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.030274",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671767"
  },
  {
    "created_at": "2026-08-16 17:49:33.434194",
    "date": "2026-04-27",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.621693",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.434199"
  },
  {
    "created_at": "2026-08-16 17:49:33.612885",
    "date": "2026-04-27",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.074645",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612891"
  },
  {
    "created_at": "2026-08-16 17:49:34.18018",
    "date": "2026-04-27",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.416848",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.180183"
  },
  {
    "created_at": "2026-08-16 17:49:34.223578",
    "date": "2026-04-27",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.708333",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223584"
  },
  {
    "created_at": "2026-08-16 17:49:35.453111",
    "date": "2026-04-27",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.569298",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.45312"
  },
  {
    "created_at": "2026-08-16 17:49:35.454689",
    "date": "2026-04-27",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.385425",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454694"
  },
  {
    "created_at": "2026-08-16 17:49:41.67181",
    "date": "2026-04-27",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.030825",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671815"
  },
  {
    "created_at": "2026-08-16 17:49:33.434234",
    "date": "2026-04-28",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.625578",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.434239"
  },
  {
    "created_at": "2026-08-16 17:49:33.612927",
    "date": "2026-04-28",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.078383",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612933"
  },
  {
    "created_at": "2026-08-16 17:49:34.180203",
    "date": "2026-04-28",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.419325",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.180206"
  },
  {
    "created_at": "2026-08-16 17:49:34.223617",
    "date": "2026-04-28",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.709557",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223622"
  },
  {
    "created_at": "2026-08-16 17:49:35.453159",
    "date": "2026-04-28",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.570777",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.453164"
  },
  {
    "created_at": "2026-08-16 17:49:35.454731",
    "date": "2026-04-28",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.386116",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454736"
  },
  {
    "created_at": "2026-08-16 17:49:41.671856",
    "date": "2026-04-28",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.031374",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.671862"
  },
  {
    "created_at": "2026-08-16 17:49:33.434275",
    "date": "2026-04-29",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.629600",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.43428"
  },
  {
    "created_at": "2026-08-16 17:49:33.612973",
    "date": "2026-04-29",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.081733",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.612979"
  },
  {
    "created_at": "2026-08-16 17:49:34.180225",
    "date": "2026-04-29",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.420095",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.180228"
  },
  {
    "created_at": "2026-08-16 17:49:34.223659",
    "date": "2026-04-29",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.701988",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223665"
  },
  {
    "created_at": "2026-08-16 17:49:35.453202",
    "date": "2026-04-29",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.572179",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.453207"
  },
  {
    "created_at": "2026-08-16 17:49:35.454769",
    "date": "2026-04-29",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.379463",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454774"
  },
  {
    "created_at": "2026-08-16 17:49:41.672109",
    "date": "2026-04-29",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.031926",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.672126"
  },
  {
    "created_at": "2026-08-16 17:49:33.434306",
    "date": "2026-04-30",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.633555",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.43431"
  },
  {
    "created_at": "2026-08-16 17:49:33.613019",
    "date": "2026-04-30",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.086059",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:33.613025"
  },
  {
    "created_at": "2026-08-16 17:49:34.180256",
    "date": "2026-04-30",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.423720",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.18026"
  },
  {
    "created_at": "2026-08-16 17:49:34.223699",
    "date": "2026-04-30",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.711528",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:34.223704"
  },
  {
    "created_at": "2026-08-16 17:49:35.453537",
    "date": "2026-04-30",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.573857",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.453549"
  },
  {
    "created_at": "2026-08-16 17:49:35.454809",
    "date": "2026-04-30",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.386389",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:35.454813"
  },
  {
    "created_at": "2026-08-16 17:49:41.672224",
    "date": "2026-04-30",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.032479",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:41.672231"
  },
  {
    "created_at": "2026-08-16 17:49:20.010426",
    "date": "2026-05-04",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.637161",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010437"
  },
  {
    "created_at": "2026-08-16 17:49:20.210755",
    "date": "2026-05-04",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.089397",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.210781"
  },
  {
    "created_at": "2026-08-16 17:49:20.754727",
    "date": "2026-05-04",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.424818",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.754731"
  },
  {
    "created_at": "2026-08-16 17:49:20.795435",
    "date": "2026-05-04",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.706298",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.79544"
  },
  {
    "created_at": "2026-08-16 17:49:21.899379",
    "date": "2026-05-04",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.575147",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899416"
  },
  {
    "created_at": "2026-08-16 17:49:21.900547",
    "date": "2026-05-04",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.381637",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900555"
  },
  {
    "created_at": "2026-08-16 17:49:28.05346",
    "date": "2026-05-04",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.033021",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053494"
  },
  {
    "created_at": "2026-08-16 17:49:20.010476",
    "date": "2026-05-05",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.641021",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010481"
  },
  {
    "created_at": "2026-08-16 17:49:20.210811",
    "date": "2026-05-05",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.093544",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.210814"
  },
  {
    "created_at": "2026-08-16 17:49:20.754763",
    "date": "2026-05-05",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.428199",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.754767"
  },
  {
    "created_at": "2026-08-16 17:49:20.795474",
    "date": "2026-05-05",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.712062",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795513"
  },
  {
    "created_at": "2026-08-16 17:49:21.899461",
    "date": "2026-05-05",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.576734",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899466"
  },
  {
    "created_at": "2026-08-16 17:49:21.900589",
    "date": "2026-05-05",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.386340",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900594"
  },
  {
    "created_at": "2026-08-16 17:49:28.053545",
    "date": "2026-05-05",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.033565",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053552"
  },
  {
    "created_at": "2026-08-16 17:49:20.010516",
    "date": "2026-05-06",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.644756",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010521"
  },
  {
    "created_at": "2026-08-16 17:49:20.210864",
    "date": "2026-05-06",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.097656",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.21087"
  },
  {
    "created_at": "2026-08-16 17:49:20.7548",
    "date": "2026-05-06",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.432228",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.754805"
  },
  {
    "created_at": "2026-08-16 17:49:20.795557",
    "date": "2026-05-06",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.722168",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795563"
  },
  {
    "created_at": "2026-08-16 17:49:21.899514",
    "date": "2026-05-06",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.578322",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.89952"
  },
  {
    "created_at": "2026-08-16 17:49:21.900628",
    "date": "2026-05-06",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.394868",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900633"
  },
  {
    "created_at": "2026-08-16 17:49:28.053591",
    "date": "2026-05-06",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.034108",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053597"
  },
  {
    "created_at": "2026-08-16 17:49:20.010555",
    "date": "2026-05-07",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.648220",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.01056"
  },
  {
    "created_at": "2026-08-16 17:49:20.21092",
    "date": "2026-05-07",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.101553",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.210926"
  },
  {
    "created_at": "2026-08-16 17:49:20.754839",
    "date": "2026-05-07",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.434125",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.754843"
  },
  {
    "created_at": "2026-08-16 17:49:20.79559",
    "date": "2026-05-07",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.722592",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795593"
  },
  {
    "created_at": "2026-08-16 17:49:21.899552",
    "date": "2026-05-07",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.579748",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899557"
  },
  {
    "created_at": "2026-08-16 17:49:21.900667",
    "date": "2026-05-07",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.393992",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900672"
  },
  {
    "created_at": "2026-08-16 17:49:28.053633",
    "date": "2026-05-07",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.034651",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053638"
  },
  {
    "created_at": "2026-08-16 17:49:20.010594",
    "date": "2026-05-08",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.651971",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010599"
  },
  {
    "created_at": "2026-08-16 17:49:20.210957",
    "date": "2026-05-08",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.105308",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.21096"
  },
  {
    "created_at": "2026-08-16 17:49:20.754884",
    "date": "2026-05-08",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.436713",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.75489"
  },
  {
    "created_at": "2026-08-16 17:49:20.795618",
    "date": "2026-05-08",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.728080",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795622"
  },
  {
    "created_at": "2026-08-16 17:49:21.899591",
    "date": "2026-05-08",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.581187",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899596"
  },
  {
    "created_at": "2026-08-16 17:49:21.900707",
    "date": "2026-05-08",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.396528",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900712"
  },
  {
    "created_at": "2026-08-16 17:49:28.053677",
    "date": "2026-05-08",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.035197",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053683"
  },
  {
    "created_at": "2026-08-16 17:49:20.010632",
    "date": "2026-05-11",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.655816",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010637"
  },
  {
    "created_at": "2026-08-16 17:49:20.210991",
    "date": "2026-05-11",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.108737",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.210996"
  },
  {
    "created_at": "2026-08-16 17:49:20.754926",
    "date": "2026-05-11",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.437941",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.754931"
  },
  {
    "created_at": "2026-08-16 17:49:20.795648",
    "date": "2026-05-11",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.725020",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795653"
  },
  {
    "created_at": "2026-08-16 17:49:21.899629",
    "date": "2026-05-11",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.582566",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899635"
  },
  {
    "created_at": "2026-08-16 17:49:21.900745",
    "date": "2026-05-11",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.392753",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900751"
  },
  {
    "created_at": "2026-08-16 17:49:28.053723",
    "date": "2026-05-11",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.035742",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053728"
  },
  {
    "created_at": "2026-08-16 17:49:20.01067",
    "date": "2026-05-12",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.659414",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010675"
  },
  {
    "created_at": "2026-08-16 17:49:20.211021",
    "date": "2026-05-12",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.112291",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211025"
  },
  {
    "created_at": "2026-08-16 17:49:20.754967",
    "date": "2026-05-12",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.439924",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.754972"
  },
  {
    "created_at": "2026-08-16 17:49:20.795692",
    "date": "2026-05-12",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.724728",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795698"
  },
  {
    "created_at": "2026-08-16 17:49:21.89967",
    "date": "2026-05-12",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.583921",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899675"
  },
  {
    "created_at": "2026-08-16 17:49:21.900785",
    "date": "2026-05-12",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.391888",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.90079"
  },
  {
    "created_at": "2026-08-16 17:49:28.053765",
    "date": "2026-05-12",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.036286",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.05377"
  },
  {
    "created_at": "2026-08-16 17:49:20.010707",
    "date": "2026-05-13",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.662955",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010712"
  },
  {
    "created_at": "2026-08-16 17:49:20.211091",
    "date": "2026-05-13",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.115481",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211098"
  },
  {
    "created_at": "2026-08-16 17:49:20.755277",
    "date": "2026-05-13",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.440793",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755288"
  },
  {
    "created_at": "2026-08-16 17:49:20.795734",
    "date": "2026-05-13",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.714612",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795739"
  },
  {
    "created_at": "2026-08-16 17:49:21.899709",
    "date": "2026-05-13",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.585107",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899713"
  },
  {
    "created_at": "2026-08-16 17:49:21.900822",
    "date": "2026-05-13",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.384584",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900827"
  },
  {
    "created_at": "2026-08-16 17:49:28.053807",
    "date": "2026-05-13",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.036834",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053812"
  },
  {
    "created_at": "2026-08-16 17:49:20.010745",
    "date": "2026-05-14",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.666853",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.01075"
  },
  {
    "created_at": "2026-08-16 17:49:20.211138",
    "date": "2026-05-14",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.119362",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211144"
  },
  {
    "created_at": "2026-08-16 17:49:20.755341",
    "date": "2026-05-14",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.443665",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755346"
  },
  {
    "created_at": "2026-08-16 17:49:20.795771",
    "date": "2026-05-14",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.721046",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795777"
  },
  {
    "created_at": "2026-08-16 17:49:21.899745",
    "date": "2026-05-14",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.586653",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899751"
  },
  {
    "created_at": "2026-08-16 17:49:21.90119",
    "date": "2026-05-14",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.388038",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901198"
  },
  {
    "created_at": "2026-08-16 17:49:28.053847",
    "date": "2026-05-14",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.037383",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053852"
  },
  {
    "created_at": "2026-08-16 17:49:20.010785",
    "date": "2026-05-15",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.670494",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.01079"
  },
  {
    "created_at": "2026-08-16 17:49:20.211176",
    "date": "2026-05-15",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.122674",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.21118"
  },
  {
    "created_at": "2026-08-16 17:49:20.755376",
    "date": "2026-05-15",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.445128",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755381"
  },
  {
    "created_at": "2026-08-16 17:49:20.795812",
    "date": "2026-05-15",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.714037",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795818"
  },
  {
    "created_at": "2026-08-16 17:49:21.899785",
    "date": "2026-05-15",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.587945",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.89979"
  },
  {
    "created_at": "2026-08-16 17:49:21.901235",
    "date": "2026-05-15",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.383798",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.90124"
  },
  {
    "created_at": "2026-08-16 17:49:28.053926",
    "date": "2026-05-15",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.037928",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053932"
  },
  {
    "created_at": "2026-08-16 17:49:20.010824",
    "date": "2026-05-18",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.674112",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010829"
  },
  {
    "created_at": "2026-08-16 17:49:20.211218",
    "date": "2026-05-18",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.126626",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211223"
  },
  {
    "created_at": "2026-08-16 17:49:20.755425",
    "date": "2026-05-18",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.448479",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755432"
  },
  {
    "created_at": "2026-08-16 17:49:20.795854",
    "date": "2026-05-18",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.719131",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795859"
  },
  {
    "created_at": "2026-08-16 17:49:21.899825",
    "date": "2026-05-18",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.589406",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.89983"
  },
  {
    "created_at": "2026-08-16 17:49:21.901276",
    "date": "2026-05-18",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.387806",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901281"
  },
  {
    "created_at": "2026-08-16 17:49:28.053971",
    "date": "2026-05-18",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.038473",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.053977"
  },
  {
    "created_at": "2026-08-16 17:49:20.010869",
    "date": "2026-05-19",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.678025",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010874"
  },
  {
    "created_at": "2026-08-16 17:49:20.211255",
    "date": "2026-05-19",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.130397",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211259"
  },
  {
    "created_at": "2026-08-16 17:49:20.755466",
    "date": "2026-05-19",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.450869",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.75547"
  },
  {
    "created_at": "2026-08-16 17:49:20.795892",
    "date": "2026-05-19",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.716076",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795898"
  },
  {
    "created_at": "2026-08-16 17:49:21.899864",
    "date": "2026-05-19",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.590895",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.89987"
  },
  {
    "created_at": "2026-08-16 17:49:21.901317",
    "date": "2026-05-19",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.386895",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901322"
  },
  {
    "created_at": "2026-08-16 17:49:28.054018",
    "date": "2026-05-19",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.039021",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.054024"
  },
  {
    "created_at": "2026-08-16 17:49:20.010907",
    "date": "2026-05-20",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.681657",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010912"
  },
  {
    "created_at": "2026-08-16 17:49:20.211294",
    "date": "2026-05-20",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.134590",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211301"
  },
  {
    "created_at": "2026-08-16 17:49:20.755583",
    "date": "2026-05-20",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.454618",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755588"
  },
  {
    "created_at": "2026-08-16 17:49:20.795931",
    "date": "2026-05-20",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.724260",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795936"
  },
  {
    "created_at": "2026-08-16 17:49:21.899903",
    "date": "2026-05-20",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.592434",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899908"
  },
  {
    "created_at": "2026-08-16 17:49:21.901353",
    "date": "2026-05-20",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.395027",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901358"
  },
  {
    "created_at": "2026-08-16 17:49:28.054089",
    "date": "2026-05-20",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.039577",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.054096"
  },
  {
    "created_at": "2026-08-16 17:49:20.010944",
    "date": "2026-05-21",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.685196",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010949"
  },
  {
    "created_at": "2026-08-16 17:49:20.21134",
    "date": "2026-05-21",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.138634",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211345"
  },
  {
    "created_at": "2026-08-16 17:49:20.755611",
    "date": "2026-05-21",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.457200",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755614"
  },
  {
    "created_at": "2026-08-16 17:49:20.795971",
    "date": "2026-05-21",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.728938",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.795976"
  },
  {
    "created_at": "2026-08-16 17:49:21.899944",
    "date": "2026-05-21",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.593918",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899948"
  },
  {
    "created_at": "2026-08-16 17:49:21.901391",
    "date": "2026-05-21",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.398375",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901396"
  },
  {
    "created_at": "2026-08-16 17:49:28.054134",
    "date": "2026-05-21",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.040133",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.05414"
  },
  {
    "created_at": "2026-08-16 17:49:20.01099",
    "date": "2026-05-22",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.688960",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.010995"
  },
  {
    "created_at": "2026-08-16 17:49:20.211381",
    "date": "2026-05-22",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.142461",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211386"
  },
  {
    "created_at": "2026-08-16 17:49:20.755649",
    "date": "2026-05-22",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.459035",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755654"
  },
  {
    "created_at": "2026-08-16 17:49:20.79601",
    "date": "2026-05-22",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.732251",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.796016"
  },
  {
    "created_at": "2026-08-16 17:49:21.899983",
    "date": "2026-05-22",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.595397",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.899988"
  },
  {
    "created_at": "2026-08-16 17:49:21.901428",
    "date": "2026-05-22",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.399692",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901433"
  },
  {
    "created_at": "2026-08-16 17:49:28.054177",
    "date": "2026-05-22",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.040691",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.054183"
  },
  {
    "created_at": "2026-08-16 17:49:20.011028",
    "date": "2026-05-25",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.692594",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.01104"
  },
  {
    "created_at": "2026-08-16 17:49:20.211421",
    "date": "2026-05-25",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.146524",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211425"
  },
  {
    "created_at": "2026-08-16 17:49:20.755682",
    "date": "2026-05-25",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.462439",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755687"
  },
  {
    "created_at": "2026-08-16 17:49:20.79608",
    "date": "2026-05-25",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.739394",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.796086"
  },
  {
    "created_at": "2026-08-16 17:49:21.900022",
    "date": "2026-05-25",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.596881",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900027"
  },
  {
    "created_at": "2026-08-16 17:49:21.901469",
    "date": "2026-05-25",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.406509",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901474"
  },
  {
    "created_at": "2026-08-16 17:49:28.05422",
    "date": "2026-05-25",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.041248",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.054226"
  },
  {
    "created_at": "2026-08-16 17:49:20.011089",
    "date": "2026-05-26",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.696202",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.011094"
  },
  {
    "created_at": "2026-08-16 17:49:20.211457",
    "date": "2026-05-26",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.150132",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.21146"
  },
  {
    "created_at": "2026-08-16 17:49:20.755709",
    "date": "2026-05-26",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.463940",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755713"
  },
  {
    "created_at": "2026-08-16 17:49:20.796121",
    "date": "2026-05-26",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.740342",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.796126"
  },
  {
    "created_at": "2026-08-16 17:49:21.900083",
    "date": "2026-05-26",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.598236",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900089"
  },
  {
    "created_at": "2026-08-16 17:49:21.901511",
    "date": "2026-05-26",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.403879",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901516"
  },
  {
    "created_at": "2026-08-16 17:49:28.054262",
    "date": "2026-05-26",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.041805",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.054268"
  },
  {
    "created_at": "2026-08-16 17:49:20.011131",
    "date": "2026-05-27",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.699662",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.011136"
  },
  {
    "created_at": "2026-08-16 17:49:20.211499",
    "date": "2026-05-27",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.153961",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211504"
  },
  {
    "created_at": "2026-08-16 17:49:20.755735",
    "date": "2026-05-27",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.466176",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755738"
  },
  {
    "created_at": "2026-08-16 17:49:20.796159",
    "date": "2026-05-27",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.744188",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.796165"
  },
  {
    "created_at": "2026-08-16 17:49:21.900124",
    "date": "2026-05-27",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.599584",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900128"
  },
  {
    "created_at": "2026-08-16 17:49:21.901551",
    "date": "2026-05-27",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.404477",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901556"
  },
  {
    "created_at": "2026-08-16 17:49:28.054304",
    "date": "2026-05-27",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.042357",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.054309"
  },
  {
    "created_at": "2026-08-16 17:49:20.01117",
    "date": "2026-05-28",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.703395",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.011174"
  },
  {
    "created_at": "2026-08-16 17:49:20.211541",
    "date": "2026-05-28",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.157797",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211545"
  },
  {
    "created_at": "2026-08-16 17:49:20.755757",
    "date": "2026-05-28",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.468610",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.75576"
  },
  {
    "created_at": "2026-08-16 17:49:20.7962",
    "date": "2026-05-28",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.747389",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.796205"
  },
  {
    "created_at": "2026-08-16 17:49:21.900163",
    "date": "2026-05-28",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.601045",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900169"
  },
  {
    "created_at": "2026-08-16 17:49:21.90159",
    "date": "2026-05-28",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.406233",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901596"
  },
  {
    "created_at": "2026-08-16 17:49:28.054342",
    "date": "2026-05-28",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.042926",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.054347"
  },
  {
    "created_at": "2026-08-16 17:49:20.011216",
    "date": "2026-05-29",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.707103",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.011221"
  },
  {
    "created_at": "2026-08-16 17:49:20.211581",
    "date": "2026-05-29",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.161551",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.211586"
  },
  {
    "created_at": "2026-08-16 17:49:20.755782",
    "date": "2026-05-29",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.470430",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.755785"
  },
  {
    "created_at": "2026-08-16 17:49:20.796239",
    "date": "2026-05-29",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.748278",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:20.796245"
  },
  {
    "created_at": "2026-08-16 17:49:21.900203",
    "date": "2026-05-29",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.602478",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.900208"
  },
  {
    "created_at": "2026-08-16 17:49:21.901629",
    "date": "2026-05-29",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.406473",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:21.901634"
  },
  {
    "created_at": "2026-08-16 17:49:28.054383",
    "date": "2026-05-29",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.043480",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:28.054388"
  },
  {
    "created_at": "2026-08-16 17:49:04.314143",
    "date": "2026-06-01",
    "fund_cnpj": "03.737.206/0001-97",
    "other_public_information": null,
    "quota_value": "6.710673",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:04.314151"
  },
  {
    "created_at": "2026-08-16 17:49:04.570709",
    "date": "2026-06-01",
    "fund_cnpj": "05.164.356/0001-84",
    "other_public_information": null,
    "quota_value": "7.164987",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:04.570743"
  },
  {
    "created_at": "2026-08-16 17:49:05.403393",
    "date": "2026-06-01",
    "fund_cnpj": "10.740.670/0001-06",
    "other_public_information": null,
    "quota_value": "4.471424",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:05.403398"
  },
  {
    "created_at": "2026-08-16 17:49:05.465905",
    "date": "2026-06-01",
    "fund_cnpj": "11.061.217/0001-28",
    "other_public_information": null,
    "quota_value": "4.745212",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:05.46591"
  },
  {
    "created_at": "2026-08-16 17:49:06.856995",
    "date": "2026-06-01",
    "fund_cnpj": "23.215.008/0001-70",
    "other_public_information": null,
    "quota_value": "2.603759",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:06.857024"
  },
  {
    "created_at": "2026-08-16 17:49:06.858311",
    "date": "2026-06-01",
    "fund_cnpj": "23.215.097/0001-55",
    "other_public_information": null,
    "quota_value": "2.403518",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:06.85832"
  },
  {
    "created_at": "2026-08-16 17:49:14.862763",
    "date": "2026-06-01",
    "fund_cnpj": "63.197.167/0001-04",
    "other_public_information": null,
    "quota_value": "1.044031",
    "source": "CVM",
    "updated_at": "2026-08-16 17:49:14.862794"
  }
]' and those histories '[
  {
    "id": 1734,
    "created_at": "2026-06-22 15:03:22.751049",
    "earnings": "27536.9707167618076521644563156921138284126118",
    "fund_investment_id": 97,
    "initial_balance": "1223336.06",
    "last_12_months_return": null,
    "monthly_return": "1.1567528550481597946705960091161",
    "period": "2026-03-31",
    "portfolio_id": 25,
    "updated_at": "2026-06-22 15:03:22.751049",
    "yearly_return": "3.39472744492458349121774272174388653515810767963000117739425846200156539024325118171328469191530642"
  },
  {
    "id": 443,
    "created_at": "2026-04-08 12:06:46.426691",
    "earnings": "16063.52501197047620067778238104205331",
    "fund_investment_id": 97,
    "initial_balance": "807272.54",
    "last_12_months_return": null,
    "monthly_return": "0.98605684953495872023624327262918",
    "period": "2026-02-28",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 15:15:41.358215",
    "yearly_return": "2.21238278880235831739493600721799007139400346545621040570102369122"
  },
  {
    "id": 384,
    "created_at": "2026-04-07 14:25:24.945729",
    "earnings": "16352.80862224182628047775081899525983",
    "fund_investment_id": 97,
    "initial_balance": "1790919.73",
    "last_12_months_return": null,
    "monthly_return": "1.2143517407502844131840279042779",
    "period": "2026-01-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-07 14:36:41.461718",
    "yearly_return": "1.2143517407502844131840279042779"
  },
  {
    "id": 495,
    "created_at": "2026-04-10 12:58:12.344514",
    "earnings": "-0.00000000000000000000000001106445",
    "fund_investment_id": 97,
    "initial_balance": "0.00",
    "last_12_months_return": null,
    "monthly_return": "1.1638149003700971969572737162948",
    "period": "2025-12-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 12:58:12.344514",
    "yearly_return": "1.1638149003700971969572737162948"
  },
  {
    "id": 1737,
    "created_at": "2026-06-25 21:01:57.421578",
    "earnings": "19798.1855314897100431701944935190011154605336",
    "fund_investment_id": 97,
    "initial_balance": "1450873.04",
    "last_12_months_return": null,
    "monthly_return": "1.0864059031915277572314481384407",
    "period": "2026-04-30",
    "portfolio_id": 25,
    "updated_at": "2026-06-25 21:01:57.421578",
    "yearly_return": "4.51801386747503484273532840227570010548313584751091451747606073821094464643289964742534282684429245825440812120179045828335521499294"
  },
  {
    "id": 1715,
    "created_at": "2026-06-15 12:11:32.830153",
    "earnings": "21844.6385097791192720798683972979639650851752",
    "fund_investment_id": 97,
    "initial_balance": "1470671.23",
    "last_12_months_return": null,
    "monthly_return": "1.0653594614439422533738429217143",
    "period": "2026-05-31",
    "portfolio_id": 25,
    "updated_at": "2026-07-02 17:36:28.182214",
    "yearly_return": "5.63150641712547175419030999525206455185412274322132834663709861009356763812272366572957491885073075109180117941134768257702016316181956000077622246299164314047197042"
  },
  {
    "id": 1893,
    "created_at": "2026-07-13 12:18:39.430543",
    "earnings": "27143.1799071303987966960290717424654570587014",
    "fund_investment_id": 97,
    "initial_balance": "1592515.87",
    "last_12_months_return": null,
    "monthly_return": "1.0656769741638368560106602606056",
    "period": "2026-06-30",
    "portfolio_id": 25,
    "updated_at": "2026-07-13 12:18:39.430543",
    "yearly_return": "6.75719705847517363843410722137360641187305825608605984816086183803875092569986375800896408548072784622445286488071141891797091247935561509992481086187697438537807995805155414687030186333259334486352"
  },
  {
    "id": 1900,
    "created_at": "2026-08-06 23:30:39.772953",
    "earnings": "60562.9734374512701008726473364751703468849084",
    "fund_investment_id": 97,
    "initial_balance": "2619659.05",
    "last_12_months_return": null,
    "monthly_return": "1.207731003734524107230442105205",
    "period": "2026-07-31",
    "portfolio_id": 25,
    "updated_at": "2026-08-12 18:37:36.861931",
    "yearly_return": "8.046536826068339698121567627356205358824348800957247918771092334537470470473486545388598353145815193865960463597772130306001700784269089251252089426299029127857944176536113045961834662986610499178467932018207770723591621222066216"
  },
  {
    "id": 411,
    "created_at": "2026-04-08 12:02:04.805594",
    "earnings": "4170.4029353035814910921343367693119009",
    "fund_investment_id": 99,
    "initial_balance": "782542.32",
    "last_12_months_return": null,
    "monthly_return": "0.53293001702652502177220684039616",
    "period": "2026-03-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 15:27:54.02273",
    "yearly_return": "3.04274078413196656880008720257841543728578751047971128986467314210766814080048007654671244416954304"
  },
  {
    "id": 444,
    "created_at": "2026-04-08 12:06:46.885971",
    "earnings": "9148.21008637267607263294838703328665458",
    "fund_investment_id": 99,
    "initial_balance": "772394.11",
    "last_12_months_return": null,
    "monthly_return": "1.1838988876424620985039743614699",
    "period": "2026-02-28",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 15:15:41.784144",
    "yearly_return": "2.4965061365269800701342689295616765098172915957036929562470921369"
  },
  {
    "id": 386,
    "created_at": "2026-04-07 14:25:25.813575",
    "earnings": "9703.972932375950641459247746554096746",
    "fund_investment_id": 99,
    "initial_balance": "162690.14",
    "last_12_months_return": null,
    "monthly_return": "1.2972491308543814421569522344331",
    "period": "2026-01-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-07 14:36:42.349494",
    "yearly_return": "1.2972491308543814421569522344331"
  },
  {
    "id": 496,
    "created_at": "2026-04-10 12:58:12.743995",
    "earnings": "-0.000000000000000000000000001007024",
    "fund_investment_id": 99,
    "initial_balance": "0.00",
    "last_12_months_return": null,
    "monthly_return": "0.76281550133967100484031773486882",
    "period": "2025-12-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 12:58:12.743995",
    "yearly_return": "0.76281550133967100484031773486882"
  },
  {
    "id": 1530,
    "created_at": "2026-06-03 23:45:25.750941",
    "earnings": "8946.630927966834686374161584825612095",
    "fund_investment_id": 99,
    "initial_balance": "599343.65",
    "last_12_months_return": null,
    "monthly_return": "0.78000173192221292115848616414887",
    "period": "2026-05-31",
    "portfolio_id": 25,
    "updated_at": "2026-06-13 23:43:06.118743",
    "yearly_return": "5.198700468891100462864906013521620085271411518242023628889997783935759096725057090469052697463377927376097863012082692669579085149222207031288138461342842681875734208"
  },
  {
    "id": 1259,
    "created_at": "2026-05-12 12:33:33.480557",
    "earnings": "12630.92483686675771733706922079507405036",
    "fund_investment_id": 99,
    "initial_balance": "786712.73",
    "last_12_months_return": null,
    "monthly_return": "1.3021380934627344082928148689971",
    "period": "2026-04-30",
    "portfolio_id": 25,
    "updated_at": "2026-05-12 12:33:33.480557",
    "yearly_return": "4.38449956443021002173861027093937941032362920952182952696726831104500481004832646095517513057193093301128863454743109412959370085184"
  },
  {
    "id": 1745,
    "created_at": "2026-07-07 15:07:31.514694",
    "earnings": "2160.51677575938217967441564122925921828",
    "fund_investment_id": 99,
    "initial_balance": "1108290.28",
    "last_12_months_return": null,
    "monthly_return": "0.46808548277923070216192059521368",
    "period": "2026-06-30",
    "portfolio_id": 25,
    "updated_at": "2026-07-13 12:18:42.617738",
    "yearly_return": "5.6911203138583862028505672155524520451960128642999584605641515747883334881349873114016372030309939241409909770728708404690019048910124929955218655228237804563347993987107782631212570723928442064556544"
  },
  {
    "id": 1901,
    "created_at": "2026-08-06 23:30:40.162647",
    "earnings": "6470.99057648326303644964875047294199682",
    "fund_investment_id": 99,
    "initial_balance": "610450.80",
    "last_12_months_return": null,
    "monthly_return": "1.0600347468527434417830904239887",
    "period": "2026-07-31",
    "portfolio_id": 25,
    "updated_at": "2026-08-06 23:30:40.162647",
    "yearly_return": "6.8114829135232234468591563150528505903719921004519997817712971171284153131018674797914322832069639114465390448937577474350936966114938413077902169545091134755283438422830430479746335299503588219256326821441753240624405320176051670528"
  },
  {
    "id": 425,
    "created_at": "2026-04-08 12:02:12.683991",
    "earnings": "-4022.882815321773257860190799436088563",
    "fund_investment_id": 113,
    "initial_balance": "706802.89",
    "last_12_months_return": null,
    "monthly_return": "-0.56916615239378384340907451550433",
    "period": "2026-03-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-08 19:20:03.789217",
    "yearly_return": "2.35028484090593302765040989301094005007980481366073568350576208815113054936627203821291273302431663"
  },
  {
    "id": 400,
    "created_at": "2026-04-07 14:41:27.008208",
    "earnings": "13455.828297497913563516810896231688604",
    "fund_investment_id": 113,
    "initial_balance": "86735.08",
    "last_12_months_return": null,
    "monthly_return": "1.9732180075031263026260942059191",
    "period": "2026-01-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-07 14:42:24.770028",
    "yearly_return": "1.9732180075031263026260942059191"
  },
  {
    "id": 458,
    "created_at": "2026-04-08 12:06:53.351351",
    "earnings": "6611.981931030235347184870033283490407",
    "fund_investment_id": 113,
    "initial_balance": "700190.91",
    "last_12_months_return": null,
    "monthly_return": "0.9443113089124728974095629350679",
    "period": "2026-02-28",
    "portfolio_id": 25,
    "updated_at": "2026-04-08 12:06:53.351351",
    "yearly_return": "2.9361626372099485896901486730581863148394141935114373276514040689"
  },
  {
    "id": 510,
    "created_at": "2026-04-10 12:58:18.50855",
    "earnings": "0.00000000000000000000000000065504",
    "fund_investment_id": 113,
    "initial_balance": "0.00",
    "last_12_months_return": null,
    "monthly_return": "0.26312627449068261329144674174443",
    "period": "2025-12-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 12:58:18.50855",
    "yearly_return": "0.26312627449068261329144674174443"
  },
  {
    "id": 1088,
    "created_at": "2026-05-06 02:11:15.929477",
    "earnings": "8712.121748055846466162649918500107011",
    "fund_investment_id": 113,
    "initial_balance": "702780.01",
    "last_12_months_return": null,
    "monthly_return": "1.2396655647794302315320757790705",
    "period": "2026-04-30",
    "portfolio_id": 25,
    "updated_at": "2026-05-06 02:11:15.929477",
    "yearly_return": "3.61908607753230512713630679449769290496179841796113529470796586472722694960421159016852459320051577154315889248514984174528119092415"
  },
  {
    "id": 1537,
    "created_at": "2026-06-03 23:45:28.368152",
    "earnings": "5987.962533381938346614101535305299244",
    "fund_investment_id": 113,
    "initial_balance": "711492.13",
    "last_12_months_return": null,
    "monthly_return": "0.8416062930226379689145399178424",
    "period": "2026-05-31",
    "portfolio_id": 25,
    "updated_at": "2026-06-03 23:45:28.368152",
    "yearly_return": "4.4911508267333611226900097262748252227133228991994949836773558346422431235917649865628416610943527524571019672818510960739228208974307177645887562030285816953005396"
  },
  {
    "id": 1751,
    "created_at": "2026-07-07 15:07:33.976891",
    "earnings": "-1382.840515596620399087594684321917746",
    "fund_investment_id": 113,
    "initial_balance": "717480.09",
    "last_12_months_return": null,
    "monthly_return": "0.36667770633620240077491000314568",
    "period": "2026-06-30",
    "portfolio_id": 25,
    "updated_at": "2026-07-13 12:18:45.069077",
    "yearly_return": "4.87429658190912880366819508128385411035767004409133126704475705292520459491045413991660003044104883034573415677308414049056949982889109712441031723646400911710580782602646704589063330008709001408928"
  },
  {
    "id": 1907,
    "created_at": "2026-08-06 23:30:42.725328",
    "earnings": "8970.641067266602214204555280619090482",
    "fund_investment_id": 113,
    "initial_balance": "766097.25",
    "last_12_months_return": null,
    "monthly_return": "1.1709533030513431681486790237391",
    "period": "2026-07-31",
    "portfolio_id": 25,
    "updated_at": "2026-08-06 23:30:42.725328",
    "yearly_return": "6.10232562178685563429206613866886549992175158395571463077830696376740525433435580442350288035205179020710201653154525753445912873123433687667463615579817303863071854725557935026521944551843667800477802147642329700341258614586826848"
  },
  {
    "id": 412,
    "created_at": "2026-04-08 12:02:05.428553",
    "earnings": "7320.41544088526243692749578010684884",
    "fund_investment_id": 100,
    "initial_balance": "763139.51",
    "last_12_months_return": null,
    "monthly_return": "1.128246688754876488769178207359",
    "period": "2026-03-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-15 13:14:38.044723",
    "yearly_return": "3.3644046186255544673296723465560157155686947671380480764716630532743962234032785695636974796129447"
  },
  {
    "id": 445,
    "created_at": "2026-04-08 12:06:47.330428",
    "earnings": "7548.992863472850926080599977078202",
    "fund_investment_id": 100,
    "initial_balance": "755590.52",
    "last_12_months_return": null,
    "monthly_return": "0.99908517502046319033174442678993",
    "period": "2026-02-28",
    "portfolio_id": 25,
    "updated_at": "2026-04-08 12:06:47.330428",
    "yearly_return": "2.21121002597124160076403202307684127758272138056129545727862377433"
  },
  {
    "id": 387,
    "created_at": "2026-04-07 14:25:26.271772",
    "earnings": "12314.05942875971510249629360933305488",
    "fund_investment_id": 100,
    "initial_balance": "1243276.46",
    "last_12_months_return": null,
    "monthly_return": "1.2001344852285517987399318803081",
    "period": "2026-01-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-07 14:36:42.796102",
    "yearly_return": "1.2001344852285517987399318803081"
  },
  {
    "id": 497,
    "created_at": "2026-04-10 12:58:13.159642",
    "earnings": "0.00000000000000000000000000273952",
    "fund_investment_id": 100,
    "initial_balance": "0.00",
    "last_12_months_return": null,
    "monthly_return": "1.1970366449936369803825043875455",
    "period": "2025-12-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 12:58:13.159642",
    "yearly_return": "1.1970366449936369803825043875455"
  },
  {
    "id": 1746,
    "created_at": "2026-07-07 15:07:31.885546",
    "earnings": "13748.768108264024813472219350685869504",
    "fund_investment_id": 100,
    "initial_balance": "286090.58",
    "last_12_months_return": null,
    "monthly_return": "1.1077134946001464757819278395437",
    "period": "2026-06-30",
    "portfolio_id": 25,
    "updated_at": "2026-07-13 12:18:42.997502",
    "yearly_return": "6.8453468598186398475834076412946718862064160553587816525409598189895566660610412083254926894427187278076236251274950850878795903426739398726476276928746341806889314108684039500395848450752716424832"
  },
  {
    "id": 1264,
    "created_at": "2026-05-12 12:36:58.46195",
    "earnings": "7024.763788917294759066648815757904276",
    "fund_investment_id": 100,
    "initial_balance": "270459.93",
    "last_12_months_return": null,
    "monthly_return": "1.1108273949355353200449406422112",
    "period": "2026-04-30",
    "portfolio_id": 25,
    "updated_at": "2026-05-12 12:36:58.46195",
    "yearly_return": "4.5126047417412588661985671151131030976426960881475969090596923186021713754757465940569526226049687271794380815457624455402275132064"
  },
  {
    "id": 1531,
    "created_at": "2026-06-03 23:45:26.123698",
    "earnings": "8605.884651307602740301814822617898928",
    "fund_investment_id": 100,
    "initial_balance": "277484.69",
    "last_12_months_return": null,
    "monthly_return": "1.1119887390791329899058106180724",
    "period": "2026-05-31",
    "portfolio_id": 25,
    "updated_at": "2026-06-13 23:43:06.502575",
    "yearly_return": "5.6747731373877056462681161185742993347652168176272864875013617716494909539883529622295464250011280435923119411092438144387940695080853129876955743458480481751134336"
  },
  {
    "id": 1902,
    "created_at": "2026-08-06 23:30:40.556325",
    "earnings": "19439.38731582365426083849366761345874",
    "fund_investment_id": 100,
    "initial_balance": "1299839.34",
    "last_12_months_return": null,
    "monthly_return": "1.2252470826274101149771254274493",
    "period": "2026-07-31",
    "portfolio_id": 25,
    "updated_at": "2026-08-12 18:37:37.571823",
    "yearly_return": "8.1544663551417048763889091916104624841184228104623616961463905008687834898348226871420131727623569033435569718433268864278809470473349370519301730138086209912401228628143711998845592618114148766418532645721344087677950768929410176"
  },
  {
    "id": 446,
    "created_at": "2026-04-08 12:06:47.791767",
    "earnings": "7601.815422216220005004849138082325476",
    "fund_investment_id": 101,
    "initial_balance": "756556.44",
    "last_12_months_return": null,
    "monthly_return": "1.0047915821410187621629324825348",
    "period": "2026-02-28",
    "portfolio_id": 25,
    "updated_at": "2026-04-08 12:06:47.791767",
    "yearly_return": "2.1867944290016634714002515139764379242661330230300322453114531696"
  },
  {
    "id": 1735,
    "created_at": "2026-06-22 15:33:04.235586",
    "earnings": "15746.261079640636840675351025684579283",
    "fund_investment_id": 101,
    "initial_balance": "764158.26",
    "last_12_months_return": null,
    "monthly_return": "1.1793098354409436082347529717513",
    "period": "2026-03-31",
    "portfolio_id": 25,
    "updated_at": "2026-06-22 15:33:04.235586",
    "yearly_return": "3.3918933462246983195267465622457820506200990343891098829496010136599383349234158759459346164792048"
  },
  {
    "id": 388,
    "created_at": "2026-04-07 14:25:26.728527",
    "earnings": "12101.88989554576885380397348931991379",
    "fund_investment_id": 101,
    "initial_balance": "1244454.55",
    "last_12_months_return": null,
    "monthly_return": "1.1702443303389167377178155628252",
    "period": "2026-01-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-07 14:36:43.243753",
    "yearly_return": "1.1702443303389167377178155628252"
  },
  {
    "id": 498,
    "created_at": "2026-04-10 12:58:13.555961",
    "earnings": "0.0000000000000000000000000190178",
    "fund_investment_id": 101,
    "initial_balance": "0.00",
    "last_12_months_return": null,
    "monthly_return": "1.2251425778795181030363234653299",
    "period": "2025-12-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 12:58:13.555961",
    "yearly_return": "1.2251425778795181030363234653299"
  },
  {
    "id": 1736,
    "created_at": "2026-06-22 15:42:50.558708",
    "earnings": "18899.243295185076148861883903208551306",
    "fund_investment_id": 101,
    "initial_balance": "1379904.52",
    "last_12_months_return": null,
    "monthly_return": "1.096160724722473641834977259458",
    "period": "2026-04-30",
    "portfolio_id": 25,
    "updated_at": "2026-06-22 15:42:50.558708",
    "yearly_return": "4.525234673632961976513491892290536463197850399924775110455721134177488985184480610263113633792884806864372898820849375087511189984"
  },
  {
    "id": 1716,
    "created_at": "2026-06-15 12:12:29.394929",
    "earnings": "23282.349410902920325005705821063080351",
    "fund_investment_id": 101,
    "initial_balance": "1398803.76",
    "last_12_months_return": null,
    "monthly_return": "1.1087267686783331109789547233723",
    "period": "2026-05-31",
    "portfolio_id": 25,
    "updated_at": "2026-06-22 15:42:53.963915",
    "yearly_return": "5.684133930483377340138066392945783774062506179386190137943612626423831801965720621526946201847759806981456384031416224553994887700089399362181674103352675104630432"
  },
  {
    "id": 1747,
    "created_at": "2026-07-07 15:07:32.252865",
    "earnings": "27536.136478294214165414414530127084586",
    "fund_investment_id": 101,
    "initial_balance": "1922086.11",
    "last_12_months_return": null,
    "monthly_return": "1.1425648301509608544851629682741",
    "period": "2026-06-30",
    "portfolio_id": 25,
    "updated_at": "2026-07-13 12:18:43.378374",
    "yearly_return": "6.891643675822718730259375166926255231592177223649896393331057456594892020225705512505225595599376801984508550617890102525961017841158354047550420379639941285282901781762514288453401071784213774112"
  },
  {
    "id": 1903,
    "created_at": "2026-08-06 23:30:40.939965",
    "earnings": "20741.760417118122115303047696789583114",
    "fund_investment_id": 101,
    "initial_balance": "1699622.25",
    "last_12_months_return": null,
    "monthly_return": "1.2203747315638462345822419976249",
    "period": "2026-07-31",
    "portfolio_id": 25,
    "updated_at": "2026-08-06 23:30:40.939965",
    "yearly_return": "8.196122285395723253949858241731092710198709985737641901732967185633944198618211841357143858199624229961134499314442576786934639742508175494471379040115458101101685700311024769703766292338923386871190568213880892048798329691065888"
  },
  {
    "id": 554,
    "created_at": "2026-04-10 15:26:55.558453",
    "earnings": "13910.13354989402995818771887505740681",
    "fund_investment_id": 141,
    "initial_balance": "1641618.41",
    "last_12_months_return": null,
    "monthly_return": "1.187558271404990153369866577926",
    "period": "2026-01-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 15:27:57.313384",
    "yearly_return": "1.187558271404990153369866577926"
  },
  {
    "id": 556,
    "created_at": "2026-04-10 15:30:27.166987",
    "earnings": "15645.82811407400227005324473225459919",
    "fund_investment_id": 141,
    "initial_balance": "655528.54",
    "last_12_months_return": null,
    "monthly_return": "1.0100932463639507949872655302885",
    "period": "2026-02-28",
    "portfolio_id": 25,
    "updated_at": "2026-04-10 15:30:27.166987",
    "yearly_return": "2.20964696366503923097300166200182472014218052845576605198511651"
  },
  {
    "id": 555,
    "created_at": "2026-04-10 15:28:08.063642",
    "earnings": "22088.09161355463511072031407670094944",
    "fund_investment_id": 141,
    "initial_balance": "1271174.37",
    "last_12_months_return": null,
    "monthly_return": "0.9760117578887635285933306631821",
    "period": "2026-03-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-15 13:14:52.145188",
    "yearly_return": "3.20722513572700559688301600065614456275318285888852911118836130639831972734947663923077035846471"
  },
  {
    "id": 730,
    "created_at": "2026-04-22 12:16:31.647602",
    "earnings": "-0.00000000000000000000000000976356",
    "fund_investment_id": 141,
    "initial_balance": "0.00",
    "last_12_months_return": null,
    "monthly_return": "1.1382919209281006149469849863693",
    "period": "2025-12-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-22 12:16:31.647602",
    "yearly_return": "1.1382919209281006149469849863693"
  },
  {
    "id": 1546,
    "created_at": "2026-06-03 23:45:32.190823",
    "earnings": "21117.7683216214467892218115592923464",
    "fund_investment_id": 141,
    "initial_balance": "1513005.63",
    "last_12_months_return": null,
    "monthly_return": "1.055898655430271355329903339271",
    "period": "2026-05-31",
    "portfolio_id": 25,
    "updated_at": "2026-06-13 23:43:12.166445",
    "yearly_return": "5.3582353933797084944978595716880771067766463732143969042541776251632866024988421342540430525946619621796766568691659143217782287728378837098506937425058962802938"
  },
  {
    "id": 1265,
    "created_at": "2026-05-12 12:37:17.624279",
    "earnings": "19743.17101342899647592154729242069092",
    "fund_investment_id": 141,
    "initial_balance": "1493262.46",
    "last_12_months_return": null,
    "monthly_return": "1.0175236763389151483583270859418",
    "period": "2026-04-30",
    "portfolio_id": 25,
    "updated_at": "2026-05-12 12:37:17.624279",
    "yearly_return": "4.25738308717543593374240763069057702513484532604392145628304698261453705865030064116814923072000358837295935926107684133272413878"
  },
  {
    "id": 1760,
    "created_at": "2026-07-07 15:07:37.745394",
    "earnings": "20388.82313701179235314988478337983009",
    "fund_investment_id": 141,
    "initial_balance": "1534123.40",
    "last_12_months_return": null,
    "monthly_return": "1.1121748914533948635813557085113",
    "period": "2026-06-30",
    "portfolio_id": 25,
    "updated_at": "2026-07-17 03:30:41.303055",
    "yearly_return": "6.5300032335032415162961964386214458251547976597049544599659322098178181160444891396784392306306232848796110048400680926826034121377130047415879598959571753975652540715948416178749743331512461994"
  },
  {
    "id": 1916,
    "created_at": "2026-08-06 23:30:46.623353",
    "earnings": "13652.2170952474594357527892526537292",
    "fund_investment_id": 141,
    "initial_balance": "1054512.23",
    "last_12_months_return": null,
    "monthly_return": "1.2946475879445566949231098355386",
    "period": "2026-07-31",
    "portfolio_id": 25,
    "updated_at": "2026-08-06 23:30:46.623353",
    "yearly_return": "7.9091913508030494857975676136840581688194467303447459202078444685809100449846318469912437393698768825449028536392272328017534820531078054335979348677052336251158262622878164131313716356615105027524100886257727186860777230199684"
  },
  {
    "id": 600,
    "created_at": "2026-04-15 13:14:56.621665",
    "earnings": "879.602077356468839652967405205275265",
    "fund_investment_id": 158,
    "initial_balance": "0.00",
    "last_12_months_return": null,
    "monthly_return": "1.216739079816300142184086281465",
    "period": "2026-03-31",
    "portfolio_id": 25,
    "updated_at": "2026-04-15 13:14:56.621665",
    "yearly_return": "1.216739079816300142184086281465"
  },
  {
    "id": 1120,
    "created_at": "2026-05-06 02:11:29.973493",
    "earnings": "1075.571523417787148733192769002106176",
    "fund_investment_id": 158,
    "initial_balance": "100396.01",
    "last_12_months_return": null,
    "monthly_return": "1.0713289314609876313586905979727",
    "period": "2026-04-30",
    "portfolio_id": 25,
    "updated_at": "2026-05-06 02:11:29.973493",
    "yearly_return": "2.301103289059751995283649820907501301159756594999156516105860055"
  },
  {
    "id": 1771,
    "created_at": "2026-07-07 15:07:42.497643",
    "earnings": "1572.424417514361285535013739870458632",
    "fund_investment_id": 158,
    "initial_balance": "142851.60",
    "last_12_months_return": null,
    "monthly_return": "1.100739832100279832866945221758",
    "period": "2026-06-30",
    "portfolio_id": 25,
    "updated_at": "2026-07-07 15:07:42.497643",
    "yearly_return": "4.5291824167331348370827986980495975396700069590568575420005438891671527022839086695674138875239596364917675461631790685160280998"
  },
  {
    "id": 1557,
    "created_at": "2026-06-03 23:45:36.940391",
    "earnings": "1380.012358470538912369206122155684319",
    "fund_investment_id": 158,
    "initial_balance": "101471.58",
    "last_12_months_return": null,
    "monthly_return": "1.0654938260245486833146243168142",
    "period": "2026-05-31",
    "portfolio_id": 25,
    "updated_at": "2026-06-13 23:43:16.548853",
    "yearly_return": "3.39111522855968016011810692045123247336583015438760786531041648614436160042037620003809488636781"
  },
  {
    "id": 1927,
    "created_at": "2026-08-06 23:30:51.604322",
    "earnings": "1732.185804876302746463044475934260236",
    "fund_investment_id": 158,
    "initial_balance": "144424.02",
    "last_12_months_return": null,
    "monthly_return": "1.199375145739293967767681612488",
    "period": "2026-07-31",
    "portfolio_id": 25,
    "updated_at": "2026-08-06 23:30:51.604322",
    "yearly_return": "5.782879450683920317461890206142216319351884259646982831532676941143823889314268461140456582134632496238355306021080187320866448370920949728752881915275825903024"
  }
]'. 