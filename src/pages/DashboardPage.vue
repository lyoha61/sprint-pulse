<script setup>
import DashboardTabs from '../components/DashboardTabs.vue';
import Header from '../components/Header.vue';
import MetricCounter from '../components/MetricCounter.vue';
import SprintDisplay from '../components/SprintDisplay.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { getMetricsSummary } from '../mocks/metrics';
import { getSprintById } from '../mocks/sprints';

import { getDashboardMetrics } from '../utils/getDashboardMetrics';
import { getBadgeByMetricStatus } from '../utils/metricStatusBadge';

const dashboardMetrics = getDashboardMetrics(5,1);
const activeSprint = getSprintById(1);
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
	<DashboardTabs/>
	<main class="p-6">
		<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			<div
				v-for="metric in dashboardMetrics"
				:key="metric.id"
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
			>
				<div class="mb-4 flex items-start justify-between gap-3">
					<div>
						<h2 class="text-sm font-semibold text-slate-900">
							{{ metric.title }}
						</h2>

						<p class="mt-1 text-xs leading-5 text-slate-500">
							{{ metric.description }}
						</p>
					</div>

					<StatusBadge
						:type="getBadgeByMetricStatus(metric.status).type"
						:text="getBadgeByMetricStatus(metric.status).text"
					/>
				</div>

				<div class="flex items-end gap-2">
					<span class="text-3xl font-bold text-slate-900">
						{{ metric.value }}
					</span>

					<span class="pb-1 text-sm text-slate-500">
						{{ metric.unit }}
					</span>
				</div>
			</div>
		</div>
	</main>
</div>
</template>