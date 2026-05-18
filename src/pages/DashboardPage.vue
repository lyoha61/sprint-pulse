<script setup>
import DashboardTabs from '../components/DashboardTabs.vue';
import Header from '../components/Header.vue';
import MetricCounter from '../components/MetricCounter.vue';
import SprintDisplay from '../components/SprintDisplay.vue';
import MetricCard from '../components/MetricCard.vue';
import { getMetricsSummary } from '../mocks/metrics';
import { getSprintById } from '../mocks/sprints';
import { getDashboardMetrics } from '../utils/getDashboardMetrics';
import { useRoute, useRouter } from 'vue-router';
import { computed } from "vue";

const route = useRoute();
const router = useRouter();

const sprintId = Number(route.params.id);
const activeTab = route.query.tab || "metrics";
const activeSprint = getSprintById(sprintId);
const dashboardMetrics = getDashboardMetrics(activeSprint.id, activeSprint.teamId);
const metricsSummary = getMetricsSummary(sprintId, 1);

const switchTab = (tabName) => {
  router.push({
    query: { ...route.query, tab: tabName }
  });
};
</script>

<template>
	<Header />

	<div class="px-6 py-6">
		<div class="flex justify-between mb-6">
			<SprintDisplay 
				:sprint="activeSprint"
			/>
			<MetricCounter 
				:problems="metricsSummary.problems"
				:attention="metricsSummary.attentions"
				:norm="metricsSummary.total - metricsSummary.problems - metricsSummary.attentions"
			/>
		</div>

		<DashboardTabs />

		<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			<MetricCard
				v-for="metric in dashboardMetrics"
				:key="metric.id"
				:metric="metric"
			/>
		</div>
	</div>
</template>