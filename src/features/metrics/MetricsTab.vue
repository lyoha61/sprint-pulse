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
	const activeClasses = 'px-3 py-1 rounded-lg text-sm transition-all bg-slate-800 text-white';
	const inactiveClasses = 'px-3 py-1 rounded-lg text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:border-slate-300';

	return activeFilter.value === filter ? activeClasses : inactiveClasses;
}

</script>

<template>
	<div>
		<div class="mb-4 flex items-center gap-3 text-slate-600">
      <div class="flex items-center gap-2">
        <Funnel class="h-4 w-4 text-slate-400" />

        <span class="text-sm">
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
        <TriangleAlert class="mr-1 inline h-4 w-4 align-[-2px] text-amber-500" />
        Проблемы
      </button>

      <button
        type="button"
        :class="getFilterButtonClasses(FILTERS.normal)"
        @click="setFilter(FILTERS.normal)"
      >
        <Check class="mr-1 inline h-4 w-4 align-[-2px] text-emerald-600" />
        Норма
      </button>
    </div>

		<TransitionGroup
			name="metrics-list"
			tag="div"
			class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
		>
			<MetricCard
				v-for="metric in filteredMetrics"
				:key="metric.id"
				:metric="metric"
			/>
		</TransitionGroup>
	</div>
</template>

<style scoped>
.metrics-list-move,
.metrics-list-enter-active,
.metrics-list-leave-active {
	transition: all 0.5s ease;
}

.metrics-list-enter-from,
.metrics-list-leave-to {
	opacity: 0;
	transform: translateY(8px);
}

.metrics-list-leave-active {
	position: absolute;
}
</style>