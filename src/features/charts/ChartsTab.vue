<script setup>
import AverageTaskCompletionChart from './AverageTaskCompletionChart.vue'
</script>

<template>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <AverageTaskCompletionChart />
    
  </div>
</template>

<style>
  @reference "tailwindcss";

  h3 {
    @apply text-lg font-medium text-slate-800;
  }

</style>