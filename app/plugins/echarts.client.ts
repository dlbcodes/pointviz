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
]);

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.component("VChart", VChart);
});