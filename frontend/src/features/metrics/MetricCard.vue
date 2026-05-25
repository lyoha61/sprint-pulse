<script setup>

import { computed } from 'vue';
import {
	SquareCheckBig,
	RotateCcw,
	Users,
	Bug,
	CircleDot,
} from '@lucide/vue';

import StatusBadge from './StatusBadge.vue';
import TrendIndicator from './TrendIndicator.vue';
import { getBadgeByMetricStatus } from '@src/utils/metricStatusBadge';


const props = defineProps({
	metric: {
		type: Object,
		required: true,
	},
});

const badge = computed(() => getBadgeByMetricStatus(props.metric.status));

const metricIcons = {
	1: SquareCheckBig,
	2: RotateCcw,
	3: Users,
	4: Bug,
	5: CircleDot,
};

const MetricIcon = computed(() => metricIcons[props.metric.id] || SquareCheckBig);

const cardClasses = computed(() => {
	const classes = {
		normal:
			'rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 bg-white p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow',
		warning:
			'rounded-xl border border-slate-200 border-l-4 border-l-amber-400 bg-amber-50/30 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow',
		critical:
			'rounded-xl border border-slate-200 border-l-4 border-l-red-500 bg-red-50/30 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow',
	};

	return classes[props.metric.status] || classes.normal;
});

const aiInsightClasses = computed(() => {
	const classes = {
		normal: 'bg-emerald-50 text-emerald-700',
		warning: 'bg-amber-100/60 text-amber-700',
		critical: 'bg-red-100/60 text-red-700',
	};

	return classes[props.metric.status] || classes.warning;
});

const shouldShowAiInsight = computed(() => {
	return props.metric.status !== 'normal';
});
</script>

<template>
	<div :class="cardClasses">
		<div class="flex items-start justify-between gap-3">
			<div class="flex min-w-0 items-start gap-2">
				<component
					:is="MetricIcon"
					class="mt-0.5 h-4 w-4 shrink-0 text-slate-500"
					stroke-width="2"
				/>

				<h2 class="text-sm font-medium leading-5 text-slate-600">
					{{ metric.title }}
				</h2>
			</div>

			<StatusBadge :type="badge.type" :text="badge.text" />
		</div>

		<div class="flex items-end gap-2">
			<span class="text-3xl font-medium leading-none text-slate-900">
				{{ metric.value }}
			</span>

			<span class="pb-1 text-sm text-slate-500">
				{{ metric.unit }}
			</span>
		</div>

		<TrendIndicator
			:trend="metric.trend"
			:trend-percent="metric.trendPercent"
		/>

		<p class="text-sm leading-6 text-slate-500">
			{{ metric.description }}
		</p>

		<div
			v-if="shouldShowAiInsight"
			:class="[
				'mt-auto rounded-lg px-3 py-2 text-sm leading-5',
				aiInsightClasses,
			]"
		>
			⚠ {{ metric.aiInsight || 'Будущая аналитика от ИИ' }}
		</div>
	</div>
</template>