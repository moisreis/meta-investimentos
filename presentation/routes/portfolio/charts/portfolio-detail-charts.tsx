"use client"

import { EntityChartSections } from "@/presentation/parts/charts/entity-chart-sections"

// The portfolio screen keeps the route-owned name of its
// chart renderer, so the page and the overview hook import
// the part through the route instead of reaching into the
// shared kit directly.
export { EntityChartSections as PortfolioDetailCharts }