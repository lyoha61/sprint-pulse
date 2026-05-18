<script setup>
import DashboardTabs from '../components/DashboardTabs.vue';
import Header from '../components/Header.vue';
import MetricCounter from '../components/MetricCounter.vue';
import SprintDisplay from '../components/SprintDisplay.vue';
import MetricCard from '../components/MetricCard.vue';

import { getMetricsSummary } from '../mocks/metrics';
import { getSprintById } from '../mocks/sprints';
import { getDashboardMetrics } from '../utils/getDashboardMetrics';

const activeSprint = getSprintById(5);
const dashboardMetrics = getDashboardMetrics(activeSprint.id, activeSprint.teamId);
const metricsSummary = getMetricsSummary(5,1);
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

		<main class="p-6">
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				<MetricCard
					v-for="metric in dashboardMetrics"
					:key="metric.id"
					:metric="metric"
				/>
			</div>
		</main>
	</div>
</template>