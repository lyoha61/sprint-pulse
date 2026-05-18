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
    normal:
      'rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 bg-white p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow',
    warning:
      'rounded-xl border border-slate-200 border-l-4 border-l-amber-400 bg-amber-50/30 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow',
    critical:
      'rounded-xl border border-slate-200 border-l-4 border-l-red-500 bg-red-50/30 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow',
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

const insightClasses = computed(() => {
  const classes = {
    normal: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    critical: 'bg-red-50 text-red-700',
  };

  return classes[props.metric.status] || classes.normal;
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

const shouldShowAiInsight = computed(() => {
  return props.metric.status !== 'normal';
});
</script>

<template>
  <article :class="cardClasses">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-2 text-slate-500">
        <component :is="IconComponent" class="h-4 w-4" />

        <h3 class="text-sm font-medium text-slate-600">
          {{ metric.title }}
        </h3>
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

    <p :class="['text-sm font-medium', trendClasses]">
      {{ trendIcon }} {{ formattedTrendPercent }} к прошлому спринту
    </p>

    <p class="text-sm leading-6 text-slate-500">
      {{ metric.description }}
    </p>

    <div
      v-if="shouldShowAiInsight"
      :class="[
        'mt-auto rounded-lg px-3 py-2 text-sm leading-5',
        insightClasses,
      ]"
    >
      ⚠ {{ metric.aiInsight }}
    </div>
  </article>
</template>