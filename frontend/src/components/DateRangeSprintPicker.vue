<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CalendarSearch, X } from '@lucide/vue';
import {
	areIntervalsOverlapping,
	endOfDay,
	isAfter,
	isValid,
	parseISO,
	startOfDay,
} from 'date-fns';

import { sprints } from '@src/mocks/sprints';

const route = useRoute();
const router = useRouter();

const isOpen = ref(false);
const startDate = ref('');
const endDate = ref('');
const errorText = ref('');

const isSubmitDisabled = computed(() => {
	return !startDate.value || !endDate.value;
});

function togglePicker() {
	isOpen.value = !isOpen.value;
	errorText.value = '';
}

function closePicker() {
	isOpen.value = false;
	errorText.value = '';
}

function findSprintByDateRange(start, end) {
	return sprints.find((sprint) => {
		const sprintStart = startOfDay(parseISO(sprint.startDate));
		const sprintEnd = endOfDay(parseISO(sprint.endDate));

		return areIntervalsOverlapping(
			{
				start,
				end,
			},
			{
				start: sprintStart,
				end: sprintEnd,
			},
			{
				inclusive: true,
			}
		);
	});
}

function showSprintByPeriod() {
	errorText.value = '';

	const selectedStart = startOfDay(parseISO(startDate.value));
	const selectedEnd = endOfDay(parseISO(endDate.value));

	if (
		!isValid(selectedStart) ||
		!isValid(selectedEnd) ||
		isAfter(selectedStart, selectedEnd)
	) {
		errorText.value = 'Спринт за выбранный период не найден';
		return;
	}

	const foundSprint = findSprintByDateRange(selectedStart, selectedEnd);

	if (!foundSprint) {
		errorText.value = 'Спринт за выбранный период не найден';
		return;
	}

	router.push({
		path: `/sprint/${foundSprint.id}`,
		query: route.query,
	});

	closePicker();
}
</script>

<template>
	<div class="relative">
		<button
			type="button"
			class="flex items-center gap-1.5 rounded-xl border border-violet-600 bg-violet-600 px-3 py-2 text-sm text-white transition-all hover:bg-violet-700"
			@click="togglePicker"
		>
			<CalendarSearch
				class="h-[13px] w-[13px]"
				stroke-width="2"
			/>

			<span>
				Выбрать период
			</span>
		</button>

		<div
			v-if="isOpen"
			class="absolute right-0 top-full z-50 mt-2 w-68 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<p class="text-sm text-slate-700">
					Выбор периода
				</p>

				<button
					type="button"
					class="text-slate-400 hover:text-slate-600"
					@click="closePicker"
				>
					<X
						class="h-[13px] w-[13px]"
						stroke-width="2"
					/>
				</button>
			</div>

			<div class="mb-4 flex flex-col gap-3">
				<div>
					<label class="mb-1 block text-xs text-slate-500">
						Дата начала
					</label>

					<input
						v-model="startDate"
						type="date"
						class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
					/>
				</div>

				<div>
					<label class="mb-1 block text-xs text-slate-500">
						Дата окончания
					</label>

					<input
						v-model="endDate"
						type="date"
						:min="startDate"
						class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
					/>
				</div>
			</div>

			<p
				v-if="errorText"
				class="mb-3 text-center text-xs text-amber-600"
			>
				{{ errorText }}
			</p>

			<button
				type="button"
				class="w-full rounded-lg bg-violet-600 py-2 text-sm text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
				:disabled="isSubmitDisabled"
				@click="showSprintByPeriod"
			>
				Показать спринт
			</button>
		</div>
	</div>
</template>