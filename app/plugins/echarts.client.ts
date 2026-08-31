// plugins/echarts.client.ts
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
	GridComponent,
	TooltipComponent,
	LegendComponent,
	TitleComponent,
	DatasetComponent,
	MarkLineComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
	CanvasRenderer,
	BarChart,
	LineChart,
	GridComponent,
	TooltipComponent,
	LegendComponent,
	TitleComponent,
	DatasetComponent,
	MarkLineComponent,
]);

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.component("VChart", VChart);
});