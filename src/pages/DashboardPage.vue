<script setup>
import DashboardTabs from '@src/components/DashboardTabs.vue';
import Header from '@src/components/Header.vue';
import MetricCounter from '@src/components/MetricCounter.vue';
import SprintDisplay from '@src/components/SprintDisplay.vue';
import { getMetricsSummary } from '@src/mocks/metrics';
import { getSprintById } from '@src/mocks/sprints';
import { getDashboardMetrics } from '@src/utils/getDashboardMetrics';
import { useRoute, useRouter } from 'vue-router';
import { computed, defineProps } from "vue";
import MetricsTab from '@src/features/metrics/MetricsTab.vue';
import TeamsTab from '@src/features/team/TeamsTab.vue'; // Подключаем таб команд
import ChartsTab from '../features/charts/ChartsTab.vue';

const route = useRoute();
const router = useRouter();

defineProps({
  sprintId: [String, Number],
  tab: String
});

const sprintId = computed(() => Number(route.params.id));
const activeTab = computed(() => route.query.tab || "metrics");
const activeSprint = computed(() => getSprintById(sprintId.value));
const dashboardMetrics = computed(() => getDashboardMetrics(activeSprint.value.id, activeSprint.value.teamId));
const metricsSummary = computed(() => getMetricsSummary(sprintId.value, 1));

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

		<DashboardTabs class="mb-6" />

		<div v-if="activeTab === 'metrics'">
    	<MetricsTab 
				:active-sprint="activeSprint"
			/>
  	</div>

		 <div v-else-if="activeTab === 'graphs'">
        <ChartsTab/>
    </div>
    
    <div v-else-if="activeTab === 'team'">
      <TeamsTab :active-sprint="activeSprint" />
      </div>
    </div>
</template>