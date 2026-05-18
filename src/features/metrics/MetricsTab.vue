<script setup>
import { computed, defineProps } from 'vue';
import MetricCard from './MetricCard.vue';
import { getDashboardMetrics } from '@src/utils/getDashboardMetrics';

const props = defineProps({
  activeSprint: {
    type: Object,
    required: true
  }
});

const dashboardMetrics = computed(() => {
  return getDashboardMetrics(
    props.activeSprint.id, 
    props.activeSprint.teamId
  );
});

</script>

<template>
<div 
	class="grid gap-4 mt-4 md:grid-cols-2 xl:grid-cols-3">
	<MetricCard
		v-for="metric in dashboardMetrics"
		:key="metric.id"
		:metric="metric"
	/>
</div>
</template>