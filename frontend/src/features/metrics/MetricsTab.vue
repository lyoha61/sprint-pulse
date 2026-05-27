<script setup>
import { computed, defineProps } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	Funnel,
	TriangleAlert,
	Check,
	SquareCheckBig,
} from '@lucide/vue';
import MetricCard from './MetricCard.vue';
import CheckCustom from "@src/assets/check.svg";

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

	const activeClasses = 'border-indigo-600 bg-indigo-600 text-white shadow-sm';
	const inactiveClasses =
		'border-slate-200 bg-white text-slate-600 hover:border-slate-300';

	return [
		baseClasses,
		activeFilter.value === filter ? activeClasses : inactiveClasses,
	];
}

function getIconClasses(filter) {
	const activeClasses = 'h-4 w-4 text-white mr-1.5';
	const inactiveClasses = 'h-4 w-4 text-slate-600 mr-1.5';
	
	return activeFilter.value === filter ? activeClasses : inactiveClasses;
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
        <TriangleAlert :class="getIconClasses(FILTERS.problems)"  />
        Проблемы
      </button>

      <button
				type="button"
				:class="getFilterButtonClasses(FILTERS.normal)"
				@click="setFilter(FILTERS.normal)"
			>
			<svg 
				:class="[getIconClasses(FILTERS.normal), 'w-1', 'h-1']" 
				viewBox="5.5 5 12 14.5"
				fill="none" 
				xmlns="http://www.w3.org/2000/svg"
			>
				<path 
					d="M8.5 12.5L11.5 16.5L17.5 8" 
					stroke="currentColor" 
					stroke-width="2" 
					stroke-linecap="round" 
					stroke-linejoin="round"
				/>
			</svg>
				Норма
			</button>
    </div>

		<Transition name="metrics-content" mode="out-in">
			<div
				v-if="filteredMetrics.length === 0"
				key="empty-state"
				class="flex py-16 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400"
			>
				<div class=" flex flex-col items-center">
					<SquareCheckBig class="text-slate-400 h-8 w-8 opacity-30 mb-3" />
					<p class="text-lg">
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