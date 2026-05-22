<script setup>
import { computed, defineProps } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	Funnel,
	TriangleAlert,
	Check,
} from '@lucide/vue';

import MetricCard from './MetricCard.vue';

import { getDashboardMetrics } from '@src/utils/getDashboardMetrics';
const props = defineProps({
  activeSprint: {
    type: Object,
    required: true
  }
});

const route = useRoute();
const router = useRouter();

const FILTERS = {
	all: 'all',
	problems: 'problems',
	normal: 'normal',
};

const dashboardMetrics = computed(() => {
  return getDashboardMetrics(
    props.activeSprint.id, 
    props.activeSprint.teamId
  );
});

const activeFilter = computed(() => {
	const filter = route.query.filter;

	if (Object.values(FILTERS).includes(filter)) {
		return filter;
	}

	return FILTERS.all;
});


const filteredMetrics = computed(() => {
	if (activeFilter.value === FILTERS.problems) {
		return dashboardMetrics.value.filter((metric) => metric.status !== 'normal');
	}

	if (activeFilter.value === FILTERS.normal) {
		return dashboardMetrics.value.filter((metric) => metric.status === 'normal');
	}

	return dashboardMetrics.value;
});

function setFilter(filter) {
	router.push({
		query: {
			...route.query,
			filter,
		},
	});
}

function getFilterButtonClasses(filter) {
	const baseClasses =
		'inline-flex h-8 items-center justify-center rounded-lg border px-3 py-1 text-sm transition-colors box-border';

	const activeClasses = 'border-slate-800 bg-slate-800 text-white';
	const inactiveClasses =
		'border-slate-200 bg-white text-slate-600 hover:border-slate-300';

	return [
		baseClasses,
		activeFilter.value === filter ? activeClasses : inactiveClasses,
	];
}

</script>

<template>
	<div>
		<div class="mb-4 flex items-center gap-4 text-slate-600">
      <div class="flex items-center gap-2">
        <Funnel class="h-4 w-4 text-slate-400" />

        <span class="text-sm text-slate-500">
          Фильтр:
        </span>
      </div>

      <button
        type="button"
        :class="getFilterButtonClasses(FILTERS.all)"
        @click="setFilter(FILTERS.all)"
      >
        Все
      </button>

      <button
        type="button"
        :class="getFilterButtonClasses(FILTERS.problems)"
        @click="setFilter(FILTERS.problems)"
      >
        <TriangleAlert class="mr-1.5 h-4 w-4 text-amber-500" />
        Проблемы
      </button>

      <button
        type="button"
        :class="getFilterButtonClasses(FILTERS.normal)"
        @click="setFilter(FILTERS.normal)"
      >
        <Check class="mr-1.5 h-4 w-4 text-emerald-600" />
        Норма
      </button>
    </div>

		<Transition name="metrics-content" mode="out-in">
			<div
				v-if="filteredMetrics.length === 0"
				key="empty-state"
				class="flex min-h-[220px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400"
			>
				<div class="text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-square-check-big mx-auto mb-3 opacity-30"
					>
						<path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5"></path>
						<path d="m9 11 3 3L22 4"></path>
					</svg>

					<p class="text-sm">
						Нет метрик в этой категории
					</p>
				</div>
			</div>

			<div
				v-else
				:key="activeFilter"
				class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
			>
				<MetricCard
					v-for="metric in filteredMetrics"
					:key="metric.id"
					:metric="metric"
				/>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.metrics-content-enter-active,
.metrics-content-leave-active {
	transition:
		opacity 0.18s ease,
		transform 0.18s ease;
}

.metrics-content-enter-from,
.metrics-content-leave-to {
	opacity: 0;
	transform: translateY(6px);
}
</style>