<script setup>
import { computed } from 'vue';

import Header from '../components/Header.vue';
import MetricCard from '../components/MetricCard.vue';

import { currentSprint } from '../mocks/sprints';
import { getDashboardMetrics } from '../utils/getDashboardMetrics';

const dashboardMetrics = computed(() => getDashboardMetrics(currentSprint.id));
</script>

<template>
  <Header />

  <main class="min-h-screen bg-slate-50 px-8 py-8">
    <section class="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        v-for="metric in dashboardMetrics"
        :key="metric.id"
        :metric="metric"
      />
    </section>
  </main>
</template>