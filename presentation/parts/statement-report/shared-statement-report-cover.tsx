import { Text, View, Image } from "@react-pdf/renderer"
import type { ReactElement } from "react"
import { readFileSync } from "node:fs"

import type { StatementReportData } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

/**
 * @summary
 * Renders the cover of the institutional report.
 *
 * @remarks
 * Carries the three brand colors of the report as a mark
 * over the title, the institution name centered on a single
 * line, the portfolio identification and the period card
 * that repeats the reference month, the range and the
 * issuance stored in the model. There is no logo asset in
 * the registry, so the mark is built from the brand green,
 * blue and purple only.
 *
 * @explanation
 * Use this component as the first page of the statement
 * document, before the dashboard.
 *
 * @param data - The report model to render.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function StatementReportCoverSection(props: {
  data: StatementReportData
}): ReactElement {
  const { data: DATA } = props

  return (
    <View style={tw("flex-1 justify-between items-center")}>
      {/* Logo in the top-left, small */}
      <View
        style={tw(
          "flex-row gap-1 justify-start items-center w-full"
        )}
      >
        {/* The logo is a decorative brand mark with no readable text. */}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop. */}
        <Image
          src={readFileSync("public/logo.svg")}
          style={{ width: 16, height: 16 }}
        />
      </View>
      {/* Two-columns grid */}
      <View
        style={tw(
          "flex flex-row w-full h-full items-start justify-start mt-12 gap-12"
        )}
      >
        {/* Column with data such as name, institution and date */}
        <View
          style={tw(
            "flex flex-col justify-start gap-12 w-1/2 h-fit"
          )}
        >
          {/* Report title */}
          <View
            style={tw(
              "flex flex-col justify-start gap-2 w-full"
            )}
          >
            <Text
              style={[
                tw(
                  "text-subdued text-left uppercase tracking-widest font-light"
                ),
                { fontSize: 11 },
              ]}
            >
              Insights
            </Text>
            <Text
              style={[
                tw(
                  "text-left capitalize tracking-widest font-medium"
                ),
                { fontSize: 32 },
              ]}
            >
              Análise da Carteira
            </Text>
          </View>
          {/* Portfolio name */}
          <View
            style={tw(
              "flex flex-col justify-start gap-2 w-full"
            )}
          >
            <Text
              style={[
                tw(
                  "text-subdued text-left uppercase tracking-widest font-light"
                ),
                { fontSize: 9 },
              ]}
            >
              Instituição
            </Text>
            <Text
              style={[
                tw(
                  "text-left capitalize tracking-widest font-medium"
                ),
                { fontSize: 16 },
              ]}
            >
              {DATA.cover.portfolioName}
            </Text>
          </View>
          {/* Prepared for */}
          <View
            style={tw(
              "flex flex-col justify-start gap-2 w-full"
            )}
          >
            <Text
              style={[
                tw(
                  "text-subdued text-left uppercase tracking-widest font-light"
                ),
                { fontSize: 9 },
              ]}
            >
              Período de referência
            </Text>
            <Text
              style={[
                tw(
                  "text-left capitalize tracking-widest font-medium"
                ),
                { fontSize: 16 },
              ]}
            >
              Agosto, 2026
            </Text>
          </View>
          {/* Prepared for */}
          <View
            style={tw(
              "flex flex-col justify-start gap-2 w-full"
            )}
          >
            <Text
              style={[
                tw(
                  "text-subdued text-left uppercase tracking-widest font-light"
                ),
                { fontSize: 9 },
              ]}
            >
              Preparado para
            </Text>
            <Text
              style={[
                tw(
                  "text-left capitalize tracking-widest font-medium"
                ),
                { fontSize: 16 },
              ]}
            >
              {DATA.cover.portfolioAcronym}
            </Text>
          </View>
          {/* Prepared by */}
          <View
            style={tw(
              "flex flex-col justify-start gap-2 w-full"
            )}
          >
            <Text
              style={[
                tw(
                  "text-subdued text-left uppercase tracking-widest font-light"
                ),
                { fontSize: 9 },
              ]}
            >
              Preparado por
            </Text>
            <Text
              style={[
                tw(
                  "text-left capitalize tracking-widest font-medium"
                ),
                { fontSize: 16 },
              ]}
            >
              {STATEMENT_REPORT_COPY.institution}
            </Text>
          </View>
        </View>
        {/* Column with illustration */}
        <View style={tw("flex flex-col gap-2 w-1/2 h-full")}>
          {/* The illustration is decorative and carries no readable text. */}
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop. */}
          <Image
            src={readFileSync("public/flat-8.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.1,
            }}
          />
        </View>
      </View>
    </View>
  )
}
