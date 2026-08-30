// app/composables/useCsvImport.ts
import { ChartSpecSchema, type ChartSpec } from "~/lib/schema";

export interface ParsedCsv {
	spec: ChartSpec | null;
	error: string | null;
	preview: { categories: string[]; seriesNames: string[] } | null;
}

// Minimal CSV parser: handles commas, tabs, and quoted fields.
function parseRows(text: string): string[][] {
	const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
	// auto-detect delimiter: tab if present in the header, else comma
	const delim = lines[0]?.includes("\t") ? "\t" : ",";
	return lines.map((line) => {
		const cells: string[] = [];
		let cur = "";
		let inQuotes = false;
		for (let i = 0; i < line.length; i++) {
			const ch = line[i];
			if (ch === '"') {
				if (inQuotes && line[i + 1] === '"') {
					cur += '"';
					i++;
				} else {
					inQuotes = !inQuotes;
				}
			} else if (ch === delim && !inQuotes) {
				cells.push(cur.trim());
				cur = "";
			} else {
				cur += ch;
			}
		}
		cells.push(cur.trim());
		return cells;
	});
}

export function csvToSpec(text: string): ParsedCsv {
	if (!text.trim()) return { spec: null, error: null, preview: null };

	const rows = parseRows(text);
	if (rows.length < 2) {
		return { spec: null, error: "Need a header row and at least one data row.", preview: null };
	}

	const header = rows[0];
	if (header.length < 2) {
		return { spec: null, error: "Need at least two columns: a category column and one value column.", preview: null };
	}

	// Convention: first column = categories, remaining columns = series.
	const [, ...seriesNames] = header;
	const dataRows = rows.slice(1);

	const categories = dataRows.map((r) => r[0]);

	// Build one series per value column, parsing numbers and flagging bad cells.
	const series: ChartSpec["series"] = [];
	for (let col = 1; col < header.length; col++) {
		const values: number[] = [];
		for (let r = 0; r < dataRows.length; r++) {
			const raw = dataRows[r][col] ?? "";
			// strip common formatting: %, currency, thousands separators
			const cleaned = raw.replace(/[%$€£,\s]/g, "");
			const num = Number(cleaned);
			if (raw === "" || Number.isNaN(num)) {
				return {
					spec: null,
					error: `Row ${r + 2}, column "${header[col]}": "${raw}" is not a number.`,
					preview: null,
				};
			}
			values.push(num);
		}
		series.push({ name: header[col], values });
	}

	const candidate = {
		type: "bar" as const,
		orientation: "vertical" as const,
		stack: false,
		categories,
		series,
	};

	// Validate through the real schema so imported data meets the same contract.
	const parsed = ChartSpecSchema.safeParse(candidate);
	if (!parsed.success) {
		return { spec: null, error: "Parsed data didn't form a valid chart.", preview: null };
	}

	return {
		spec: parsed.data,
		error: null,
		preview: { categories, seriesNames },
	};
}