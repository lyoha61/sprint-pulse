<script setup>
import DashboardTabs from '../components/DashboardTabs.vue';
import Header from '../components/Header.vue';
import SprintDisplay from '../components/SprintDisplay.vue';
import MetricCard from '../components/MetricCard.vue';

import { getSprintById } from '../mocks/sprints';
import { getDashboardMetrics } from '../utils/getDashboardMetrics';

const activeSprint = getSprintById(5);
const dashboardMetrics = getDashboardMetrics(activeSprint.id, activeSprint.teamId);
</script>

<template>
	<Header />

	<div class="px-6 py-6">
		<SprintDisplay :sprint="activeSprint" />

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