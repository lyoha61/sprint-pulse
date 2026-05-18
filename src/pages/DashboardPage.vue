<script setup>
import DashboardTabs from '@src/components/DashboardTabs.vue';
import Header from '@src/components/Header.vue';
import MetricCounter from '@src/components/MetricCounter.vue';
import SprintDisplay from '@src/components/SprintDisplay.vue';
import { getMetricsSummary } from '@src/mocks/metrics';
import { getSprintById } from '@src/mocks/sprints';
import { getDashboardMetrics } from '@src/utils/getDashboardMetrics';
import { useRoute, useRouter } from 'vue-router';
import { computed } from "vue";
import MetricsTab from '@src/features/metrics/MetricsTab.vue';

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

		<div v-if="activeTab === 'metrics'">
    	<MetricsTab 
				:active-sprint="activeSprint"
			/>
  	</div>
	</div>
</template>