import { BRANDMARK_DATA_URI } from "./chart-constants";


export function buildBrandmark() {
	return [
		{
			type: "group" as const,
			right: 20, bottom: 0, z: 100, silent: true,
			children: [
				{ type: "rect" as const, shape: { width: 162, height: 28, r: 8 }, style: { fill: "#ffffff", stroke: "#e0e0e0", lineWidth: 1 } },
				{ type: "image" as const, left: 8, top: 6, style: { image: BRANDMARK_DATA_URI, width: 16, height: 16 } },
				{ type: "text" as const, left: 30, top: 8, style: { text: "Made with PointViz.co", fontSize: 12, fontWeight: 600, fill: "#141414" } },
			],
		},
	];
}