<script setup>
import { ref } from 'vue';
import { ChevronLeft, ChevronRight } from '@lucide/vue';

const activeSprint = ref(1);

const setActiveSprint = (sprintNumber) => {
	activeSprint.value = sprintNumber;
};

const nextSprint = () => {
	if (activeSprint.value < 4) {
		activeSprint.value++;
	}
};

const prevSprint = () => {
	if (activeSprint.value > 1) {
		activeSprint.value--;
	}
};
</script>

<template>
<div class="w-full h-auto flex justify-between bg-white px-6 py-4 items-center border-b border-slate-200">
	<h1 class="px-2 font-semibold">SprintPules</h1>

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