// app/lib/examples.ts
export interface ChartExample {
  name: string;
  description: string;
  json: string;
}

export const examples: ChartExample[] = [
  {
    name: "MRR Growth",
    description: "Monthly recurring revenue over the second half of the year — a 5× run.",
    json: `{
  "type": "area",
  "title": "Strong revenue growth drove a 5× increase in MRR this year",
  "subtitle": "Monthly recurring revenue ($)",
  "categories": ["Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
  "series": [
    { "name": "MRR", "values": [14200, 18900, 27400, 34800, 51600, 71000] }
  ]
}`,
  },
  {
    name: "Government Debt by Creditor",
    description:
      "General government gross debt held by domestic vs. external creditors (% of GDP).",
    json: `{
  "type": "bar",
  "orientation": "horizontal",
  "stack": true,
  "title": "General Government Gross Debt by Creditor Residence",
  "subtitle": "% of GDP, latest available quarter",
  "style": {
    "theme": "datapoint",
    "legend": { "position": "top" }
  },
  "categories": ["Japan", "United Kingdom", "Italy", "United States", "Canada"],
  "series": [
    { "name": "domestic", "values": [178.1, 121.4, 90.0, 106.4, 95.5] },
    { "name": "external", "values": [26.1, 27.4, 48.9, 31.5, 29.9] }
  ]
}`,
  },
  {
    name: "Unpaid Work by Sex",
    description: "Average hours per day spent on unpaid care and domestic work.",
    json: `{
  "type": "bar",
  "title": "Unpaid Work by Sex",
  "subtitle": "Average hours per day",
  "categories": ["South Korea", "Japan", "Sweden"],
  "series": [
    { "name": "male", "values": [0.8, 0.9, 2.1] },
    { "name": "female", "values": [3.5, 3.2, 2.3] }
  ]
}`,
  },
];