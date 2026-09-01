<!-- app/components/ExportPanel.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { Button, Select, SelectTrigger, SelectContent, SelectItem } from "@dlbcodes/ui";
import { PhX, PhDownloadSimple, PhCopy, PhCheck, PhLink, PhCode, PhDotsSixVertical } from "@phosphor-icons/vue";
import { useResizable } from "~/composables/useResizable";

const emit = defineEmits<{ close: [] }>();

const { width, dragging, startResize } = useResizable({
	min: 300,
	max: 520,
	initial: 360,
	key: "pointviz:export-width",
	side: "right", // handle on the LEFT edge of this panel
});

const { spec, isValid } = useChartSpec();
const { downloadPng, copyPng, effectiveBackground, hasChart } = useChartExport();
const chartStore = useChartStore();
const user = useSupabaseUser();
const authModalOpen = useState("auth-modal-open", () => false);

// ── Image (works on any chart) ──
const scale = ref("2");
const copiedImage = ref(false);

function exportImage() {
	downloadPng({ scale: Number(scale.value), background: effectiveBackground(spec.value) });
}
async function copyImage() {
	const ok = await copyPng({ scale: Number(scale.value), background: effectiveBackground(spec.value) });
	if (ok) { copiedImage.value = true; setTimeout(() => (copiedImage.value = false), 1500); }
}

// ── Share (needs a saved, public chart) ──
const origin = computed(() => (import.meta.client ? window.location.origin : ""));
const isSaved = computed(() => chartStore.currentChartId !== null);
const slug = computed(() => chartStore.savedCharts.find((c) => c.id === chartStore.currentChartId)?.slug ?? null);
const publicUrl = computed(() => (slug.value ? `${origin.value}/c/${slug.value}` : ""));
const embedCode = computed(() =>
	slug.value ? `<iframe src="${origin.value}/embed/${slug.value}" width="640" height="360" frameborder="0"></iframe>` : "",
);

const publishing = ref(false);
const copiedLink = ref(false);
const copiedEmbed = ref(false);

async function makePublicAndCopy(what: "link" | "embed") {
	if (!user.value) { authModalOpen.value = true; return; }
	if (!isSaved.value) {
		// must save first to get a slug
		await chartStore.saveCurrent();
	}
	if (!chartStore.currentChartId) return;

	publishing.value = true;
	try {
		await chartStore.setPublic(chartStore.currentChartId, true); // ensures isPublic
		const text = what === "link" ? publicUrl.value : embedCode.value;
		await navigator.clipboard.writeText(text);
		if (what === "link") { copiedLink.value = true; setTimeout(() => (copiedLink.value = false), 1500); }
		else { copiedEmbed.value = true; setTimeout(() => (copiedEmbed.value = false), 1500); }
	} finally {
		publishing.value = false;
	}
}
</script>

<template>
	<aside
		class="relative hidden md:flex shrink-0 flex-col border-l border-border-default"
		:style="{ width: `${width}px` }"
	>
		<!-- Resize handle on the LEFT edge -->
		<div
			class="group absolute top-0 -left-1.5 z-10 flex h-full w-3 cursor-col-resize items-center justify-center select-none"
			@pointerdown.prevent="startResize"
		>
			<div
				class="flex h-8 w-3 items-center justify-center rounded-full border border-border-default bg-bg-base text-text-tertiary transition-colors hover:border-brand-100 hover:text-brand-100"
				:class="dragging ? 'border-brand-100 text-brand-100' : ''"
			>
				<PhDotsSixVertical class="size-3" />
			</div>
		</div>

		<!-- Header -->
		<div class="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-5">
			<span class="text-sm font-medium">Export & Share</span>
			<Button variant="ghost" size="icon" aria-label="Close" @click="emit('close')">
				<PhX class="size-4" />
			</Button>
		</div>

		<div class="flex-1 space-y-6 overflow-y-auto p-5">
			<!-- Image -->
			<section class="space-y-2">
				<h3 class="text-xs font-medium uppercase tracking-wider text-text-tertiary">Image</h3>
				<div class="flex items-center gap-2">
					<Select v-model="scale" class="w-20 shrink-0">
						<SelectTrigger size="sm" placeholder="Size" />
						<SelectContent>
							<SelectItem value="1" label="1×">1×</SelectItem>
							<SelectItem value="2" label="2×">2×</SelectItem>
							<SelectItem value="3" label="3×">3×</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline" size="sm" class="flex-1" :disabled="!hasChart" @click="copyImage">
						<component :is="copiedImage ? PhCheck : PhCopy" class="size-4" />
						{{ copiedImage ? "Copied" : "Copy" }}
					</Button>
					<Button variant="outline" size="sm" class="flex-1" :disabled="!hasChart" @click="exportImage">
						<PhDownloadSimple class="size-4" />
						Download
					</Button>
				</div>
			</section>

			<!-- Share -->
			<section class="space-y-2">
				<h3 class="text-xs font-medium uppercase tracking-wider text-text-tertiary">Share</h3>
				<p v-if="!isSaved" class="text-xs text-text-tertiary leading-relaxed">
					Sharing saves your chart and makes it public. You'll get a link and embed code.
				</p>
				<Button variant="outline" size="sm" class="w-full" :disabled="!isValid || publishing" @click="makePublicAndCopy('link')">
					<component :is="copiedLink ? PhCheck : PhLink" class="size-4" />
					{{ copiedLink ? "Link copied" : publishing ? "Publishing…" : "Copy public link" }}
				</Button>
				<Button variant="outline" size="sm" class="w-full" :disabled="!isValid || publishing" @click="makePublicAndCopy('embed')">
					<component :is="copiedEmbed ? PhCheck : PhCode" class="size-4" />
					{{ copiedEmbed ? "Embed copied" : "Copy embed code" }}
				</Button>
			</section>
		</div>
	</aside>
</template>