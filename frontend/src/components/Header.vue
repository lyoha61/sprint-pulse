<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft, ChevronRight } from '@lucide/vue';

import logo from '@src/assets/logo.svg';
import DateRangeSprintPicker from '@src/components/DateRangeSprintPicker.vue';

import { currentSprint, sprints } from '@src/mocks/sprints';

const route = useRoute();
const router = useRouter();

const activeSprint = ref(Number(route.params.id) || currentSprint?.id || 1);

const sprintList = computed(() => {
	return sprints.slice(0, 4);
});

const currentSprintId = computed(() => {
	return currentSprint?.id;
});

const minSprintId = computed(() => {
	return sprintList.value[0]?.id || 1;
});

const maxSprintId = computed(() => {
	return sprintList.value[sprintList.value.length - 1]?.id || 4;
});

const activeSprintIndex = computed(() => {
	const index = sprintList.value.findIndex((sprint) => sprint.id === activeSprint.value);

	return index === -1 ? 0 : index;
});

const activeSliderStyle = computed(() => {
	const count = sprintList.value.length || 1;
	const width = 100 / count;

	return {
		width: `calc(${width}% - 4px)`,
		left: `calc(${activeSprintIndex.value * width}% + ${activeSprintIndex.value * 2}px)`,
	};
});

watch(
	() => route.params.id,
	(newId) => {
		if (newId) {
			activeSprint.value = Number(newId);
		}
	}
);

function setActiveSprint(sprintNumber) {
	activeSprint.value = sprintNumber;

	router.push({
		path: `/sprint/${sprintNumber}`,
		query: route.query,
	});
}

function nextSprint() {
	if (activeSprint.value < maxSprintId.value) {
		setActiveSprint(activeSprint.value + 1);
	}
}

function prevSprint() {
	if (activeSprint.value > minSprintId.value) {
		setActiveSprint(activeSprint.value - 1);
	}
}

function getSprintButtonClasses(sprintId) {
	return [
		'sprint-button',
		{
			'sprint-button-active': activeSprint.value === sprintId && currentSprintId.value !== sprintId,
			'sprint-button-current': currentSprintId.value === sprintId,
		},
	];
}
</script>

<template>
	<header class="flex h-auto w-full items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
		<div class="flex items-center">
			<div class="rounded-lg bg-[#025CFF] px-3 py-2">
				<img
					:src="logo"
					alt="SprintPulse Logo"
					class="h-6 w-auto"
				/>
			</div>

			<h1 class="px-2 font-semibold">
				SprintPules
			</h1>
		</div>

		<div class="flex items-center gap-3">
			<div class="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
				<button
					type="button"
					class="chevron-button"
					:disabled="activeSprint === minSprintId"
					@click="prevSprint"
				>
					<ChevronLeft class="h-4 w-4" />
				</button>

				<ul class="relative flex gap-2">
					<div class="absolute inset-y-1 left-0 right-0">
						<div
							class="absolute bottom-0 top-0 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out"
							:style="activeSliderStyle"
						></div>
					</div>

					<li
						v-for="sprint in sprintList"
						:key="sprint.id"
						class="relative z-10"
					>
						<button
							type="button"
							:class="getSprintButtonClasses(sprint.id)"
							@click="setActiveSprint(sprint.id)"
						>
							{{ sprint.name }}
						</button>
					</li>
				</ul>

				<button
					type="button"
					class="chevron-button"
					:disabled="activeSprint === maxSprintId"
					@click="nextSprint"
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>

			<DateRangeSprintPicker />
		</div>
	</header>
</template>

<style scoped>
@reference "tailwindcss";

.sprint-button {
	@apply relative z-10 rounded-lg px-3 py-1.5 text-sm text-slate-500 transition-all hover:text-slate-700;
}

.sprint-button-active,
.sprint-button-active:hover {
	@apply text-indigo-700;
}

.sprint-button-current,
.sprint-button-current:hover {
	@apply bg-emerald-600 text-white shadow-sm;
}

.chevron-button {
	@apply flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white;
}

button:disabled {
	@apply cursor-not-allowed opacity-50;
}

.chevron-button:disabled {
	@apply hover:bg-transparent;
}
</style>