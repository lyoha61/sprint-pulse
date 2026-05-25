<script setup>
import { ref, watch } from 'vue';
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import logo from '@src/assets/logo.svg';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const activeSprint = ref(Number(route.params.id) || 1);

watch(() => route.params.id, (newId) => {
  if (newId) {
    activeSprint.value = Number(newId);
  }
});

const setActiveSprint = (sprintNumber) => {
	activeSprint.value = sprintNumber;
	router.push({
		path: `/sprint/${sprintNumber}`,
		query: route.query
	});
};

const nextSprint = () => {
	if (activeSprint.value < 4) {
		setActiveSprint(activeSprint.value + 1);
	}
};

const prevSprint = () => {
	if (activeSprint.value > 1) {
		setActiveSprint(activeSprint.value - 1);
	}
};
</script>

<template>
<div class="w-full h-auto flex justify-between bg-white px-6 py-4 items-center border-b border-slate-200">
	<div class="flex items-center">
		<div class="bg-[#025CFF] rounded-lg p-2 px-3">
			<img 
				:src="logo" 
				alt="SprintPulse Logo" 
				class="h-6 w-auto"
			/>
		</div>
		<h1 class="px-2 font-semibold">SprintPules</h1>
	</div>

	<div class="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
		<button 
			class="chevron-button"
			@click="prevSprint"
			:disabled="activeSprint === 1"
		>
			<ChevronLeft />
		</button>
		
		<ul class="flex gap-2 relative">
			<div class="absolute inset-y-1 left-0 right-0">
				<div 
					class="absolute top-0 bottom-0 bg-white shadow-sm rounded-lg transition-all duration-300 ease-in-out"
					:style="{ 
						width: 'calc(25% - 4px)',
						left: `calc(${(activeSprint - 1) * 25}% + ${(activeSprint - 1) * 2}px)`
					}"
				></div>
			</div>
			
			<li v-for="n in 4" :key="n" class="relative z-10">
				<button 
					:class="['sprint-button', { 'sprint-button-active': activeSprint === n }]"
					@click="setActiveSprint(n)"
				>
					Спринт {{ n }}
				</button>
			</li>
		</ul>
		
		<button 
			class="chevron-button"
			@click="nextSprint"
			:disabled="activeSprint === 4"
		>
			<ChevronRight />
		</button>
	</div>

</div>
</template>

<style scoped>
@reference "tailwindcss";

.sprint-button {
	@apply px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 rounded-lg transition-colors relative z-10;
}

.sprint-button-active, .sprint-button-active:hover  {
	@apply text-indigo-700;
}

.chevron-button {
	@apply w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 transition-colors;
}

button:disabled {
	@apply opacity-50 cursor-not-allowed;
}

.chevron-button:disabled {
	@apply hover:bg-transparent;
}
</style>