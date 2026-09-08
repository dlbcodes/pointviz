// app/lib/faqs.ts
export interface Faq {
	q: string;
	a: string;
}

export const PRICING_FAQS: Faq[] = [
	{
		q: "Is there a free plan?",
		a: "Yes — Free includes unlimited manual charts, saving, sharing, embedding, and a monthly allowance of AI customizations. No card required.",
	},
	{
		q: "What counts as an AI customization?",
		a: "Each time the AI builds or changes a chart from a natural-language instruction — like \"make it a line chart\" or \"use a colorblind palette.\" Manual edits and JSON tweaks don't count.",
	},
	{
		q: "What happens when I hit my monthly limit?",
		a: "You can still build and edit charts manually — only AI customizations pause until your allowance resets, or you upgrade to Pro for unlimited.",
	},
	{
		q: "What does Pro remove?",
		a: "Pro gives unlimited AI customizations and removes the \"Made with PointViz\" badge from your exports and embeds.",
	},
	{
		q: "Can I cancel anytime?",
		a: "Yes. Pro is month-to-month — cancel whenever, and you keep Pro until the end of your billing period.",
	},
	{
		q: "Do my charts stay if I downgrade?",
		a: "Always. Your charts are yours — downgrading only re-applies the free AI limit and the badge; nothing is deleted.",
	},
	{
		q: "Can I use PointViz in any language?",
		a: "Yes — describe your charts in whatever language you think in. The AI understands natural-language instructions in many languages, not just English.",
	},
	{
		q: "Is team pricing available?",
		a: "Not yet — Pro is per-user for now. Team plans are on the roadmap; get in touch if you need several seats.",
	},
];