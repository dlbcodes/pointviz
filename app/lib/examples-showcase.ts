// app/lib/examples-showcase.ts

export interface Example {
	id: string;
	title: string;
	description: string;
	category: string;
	chartType: string;
	imageUrl: string;
}

export const EXAMPLES: Example[] = [
	{
		id: "government-expenditure",
		title: "Where OECD governments actually spend the money",
		description:
			"Government expenditure by function, as % of total government expenditure, 2023 (32 OECD/EU countries).",
		category: "Economics",
		chartType: "100% Stacked Bar",
		imageUrl: "/templates/government_spending.webp",
	},
	{
		id: "effective-exit-age",
		title: "Effective Exit Age from the Labour Market",
		description:
			"Average effective exit age of sexes, by country, 2022 (or latest available year).",
		category: "Labor & Society",
		chartType: "Horizontal Bar",
		imageUrl: "/templates/exit_age_labour_market.webp",
	},
	{
		id: "income-wealth-inequality",
		title: "Income inequality vs Wealth distribution accross OECD countries",
		description: "Most recent year available and indicator (years vary).",
		category: "Economics",
		chartType: "Scatter Plot",
		imageUrl: "/templates/income_gini_vs_wealth_concentration.webp",
	},
	{
		id: "annual-hours-worked",
		title: "Who Works the Longest Hours",
		description:
			"Average annual hours actually worked per worker, OECD countries, latest available year (mostly 2025).",
		category: "Labor & Society",
		chartType: "Horizontal Bar",
		imageUrl: "/templates/long_worked_hours.webp",
	},
	{
		id: "oecd-aging-population",
		title: "The OECD Is Getting Old",
		description: "Population by age group, OECD total, 1960–2024.",
		category: "Demographics",
		chartType: "Area Chart",
		imageUrl: "/templates/oecd_getting_older.webp",
	},
	{
		id: "wealth-distribution",
		title: "Wealth Distribution by Country",
		description:
			"Share of net worth (%) across OECD countries. Top 1-10% and bottom 90% calculated from OECD top-1%/top-10% shares (2023).",
		category: "Economics",
		chartType: "100% Stacked Bar",
		imageUrl: "/templates/wealth-distribution.webp",
	},
	{
		id: "paycheck-breakdown",
		title: "Where Does Your Paycheck Actually Go?",
		description:
			"Labour cost breakdown for a single worker at the average wage — take-home pay vs. worker and employer taxes, OECD countries (2024).",
		category: "Labor & Society",
		chartType: "100% Stacked Bar",
		imageUrl: "/templates/tax-wedge.webp",
	},
	{
		id: "government-debt",
		title: "Who's Carrying the Most Debt?",
		description:
			"General government gross debt as a percentage of GDP, latest available year per country (mostly 2025).",
		category: "Economics",
		chartType: "Horizontal Bar",
		imageUrl: "/templates/public_debt.webp",
	},
	{
		id: "rd-investment",
		title: "The Innovation Engine: Who Actually Invests in the Future? (R&D Spending)",
		description:
			"R&D expenditure as % of GDP, most recent year per country (mostly 2023–2024).",
		category: "Innovation",
		chartType: "Horizontal Bar",
		imageUrl: "/templates/rd_spending_pct_gdp.webp",
	},
];

// Categories for the /examples page filter (derived + "All" first)
export const EXAMPLE_CATEGORIES = [
	"All",
	"Economics",
	"Labor & Society",
	"Innovation",
	"Demographics",
];

// The handful featured on the homepage showcase — pick the best-LOOKING charts.
export const FEATURED_EXAMPLE_IDS = [
	"income-wealth-inequality", // the scatter — visually distinctive
	"paycheck-breakdown",       // the viral one — proven appeal
	"oecd-aging-population",    // area chart — nice shape
] as const;

export const FEATURED_EXAMPLES = EXAMPLES.filter((e) =>
	FEATURED_EXAMPLE_IDS.includes(e.id as (typeof FEATURED_EXAMPLE_IDS)[number]),
);