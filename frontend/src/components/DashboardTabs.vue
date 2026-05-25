<script setup>
import { 
	LayoutDashboard, 
	ChartNoAxesColumn, 
	Users, 
} from '@lucide/vue';
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const TABS = {
	metrics: "metrics",
	graphs: "graphs",
	team: "team",
}

const activeTab = ref(route.query.tab || "metrics");

const setActiveTab = (tabName) => {
	activeTab.value = tabName;
}

const getTabElement = (tabName) => {
	switch(tabName) {
		case 'metrics': return metricsTab.value;
		case 'graphs': return graphsTab.value;
		case 'team': return teamTab.value;
		default: return null;
	}
};

const activeTabOffset = computed(() => {
	let offset = 0;
	const tabs = Object.keys(TABS);
	const activeIndex = tabs.indexOf(activeTab.value);
	
	for (let i = 0; i < activeIndex; i++) {
		const tabElement = getTabElement(tabs[i]);
		if (tabElement) {
			offset += tabElement.offsetWidth;
		}
	}
	
	return offset;
});

const activeTabWidth = computed(() => {
	const tabElement = getTabElement(activeTab.value);
	return tabElement ? tabElement.offsetWidth : 0;
});

const metricsTab = ref(null);
const graphsTab = ref(null);
const teamTab = ref(null);

onMounted(() => {
  if (!route.query.tab) {
    router.replace({
      query: { 
        ...route.query,
        tab: activeTab.value 
      }
    });
  }
});

watch(activeTab, (newTab) => {
  router.push({
    query: { 
      ...route.query,
      tab: newTab 
    }
  });
});

</script>

<template>
	<div class="border bg-white border-slate-200 w-fit rounded-xl p-1 ">
		<ul class="flex relative">
			<div 
				class="absolute top-0 bottom-0 rounded-lg bg-indigo-600 shadow-sm transition-all ease-in-out duration-300" 
				:style="{
					width: activeTabWidth + 'px',
					left: activeTabOffset + 'px'
				}"
			/>
			
			<li>
				<button 
					ref="metricsTab"
					:class="['tab relative z-10', { 'tab-active': activeTab === TABS.metrics }]"
					@click="setActiveTab(TABS.metrics)"
				> 
					<LayoutDashboard class="w-5 h-5" />
					Обзор метрик
				</button>
			</li>
			<li>
				<button 
					ref="graphsTab"
					:class="['tab relative z-10', { 'tab-active': activeTab === TABS.graphs }]"
					@click="setActiveTab(TABS.graphs)"
				>
					<ChartNoAxesColumn class="w-5 h-5"  />
					Графики
				</button>
			</li>
			<li>
				<button 
					ref="teamTab"
					:class="['tab relative z-10', { 'tab-active': activeTab === TABS.team }]"
					@click="setActiveTab(TABS.team)"
				>
					<Users class="w-5 h-5"  />
					Команда
				</button>
			</li>
		</ul>
	</div>
</template>

<style scoped >
@reference "tailwindcss";

.tab {
	@apply flex px-4 py-2 items-center rounded-lg text-sm transition-all text-slate-500 gap-2 whitespace-nowrap;
}

.tab:not(.tab-active) {
	@apply hover:text-slate-700 hover:bg-slate-50;
}

.tab-active, .tab-active:hover {
	@apply text-white;
}
</style>