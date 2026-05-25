<script setup>
import AverageTaskCompletionChart from './AverageTaskCompletionChart.vue'
import MissedBugsChart from './MissedBugsChart.vue'
import CodeReviewRetreatsChart from './CodeReviewRetreatsChart.vue'
import SprintExecutionChart from './SprintExecutionChart.vue';
</script>

<template>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <AverageTaskCompletionChart />
    <MissedBugsChart />
    <CodeReviewRetreatsChart />
    <SprintExecutionChart />
  </div>
</template>

<style>
  @reference "tailwindcss";

  h3 {
    @apply text-lg font-medium text-slate-800;
  }

</style>