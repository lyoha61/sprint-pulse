<script setup>
import { computed } from 'vue';
import {
  TrendingUp,
  CheckSquare,
  Bug,
  GitMerge,
  Timer,
  Rocket,
  Target,
} from '@lucide/vue';

import StatusBadge from './StatusBadge.vue';
import { getBadgeByMetricStatus } from '../utils/metricStatusBadge';

const props = defineProps({
  metric: {
    type: Object,
    required: true,
  },
});

const icons = {
  TrendingUp,
  CheckSquare,
  Bug,
  GitMerge,
  Timer,
  Rocket,
  Target,
};

const IconComponent = computed(() => icons[props.metric.icon] || TrendingUp);

const badge = computed(() => getBadgeByMetricStatus(props.metric.status));

const cardClasses = computed(() => {
  const classes = {
    normal: 'border-l-emerald-500',
    warning: 'border-l-amber-400',
    critical: 'border-l-red-500',
  };

  return classes[props.metric.status] || classes.normal;
});

const trendClasses = computed(() => {
  const classes = {
    up: 'text-emerald-600',
    down: 'text-red-600',
    stable: 'text-slate-500',
  };

  return classes[props.metric.trend] || classes.stable;
});

const trendIcon = computed(() => {
  if (props.metric.trend === 'up') {
    return '↗';
  }

  if (props.metric.trend === 'down') {
    return '↘';
  }

  return '→';
});

const formattedTrendPercent = computed(() => {
  const percent = props.metric.trendPercent;

  if (percent > 0) {
    return `+${percent}%`;
  }

  return `${percent}%`;
});
</script>

<template>
  <article
    :class="[
      'rounded-2xl border border-slate-200 border-l-4 bg-white p-7 shadow-sm transition hover:shadow-md',
      cardClasses,
    ]"
  >
    <div class="mb-5 flex items-start justify-between gap-4">
      <div class="flex items-center gap-2 text-slate-500">
        <component :is="IconComponent" class="h-5 w-5" />

        <h3 class="text-base font-semibold text-slate-600">
          {{ metric.title }}
        </h3>
      </div>

      <StatusBadge :type="badge.type" :text="badge.text" />
    </div>

    <div class="mb-4 flex items-end gap-2">
      <span class="text-4xl font-semibold leading-none text-slate-900">
        {{ metric.value }}
      </span>

      <span class="pb-1 text-base text-slate-500">
        {{ metric.unit }}
      </span>
    </div>

    <p :class="['mb-5 text-sm font-semibold', trendClasses]">
      {{ trendIcon }} {{ formattedTrendPercent }} к прошлому спринту
    </p>

    <p class="text-sm leading-6 text-slate-500">
      {{ metric.description }}
    </p>
  </article>
</template>