<script setup>
import { computed } from 'vue';
import { AlertTriangle } from '@lucide/vue';

const props = defineProps({
	problems: {
		type: Number,
		default: 0,
	},
	attention: {
		type: Number,
		default: 0,
	},
});

const shouldShowAlert = computed(() => {
	return props.problems > 0 || props.attention > 0;
});

const alertCount = computed(() => {
	if (props.problems > 0) {
		return props.problems;
	}

	return props.attention;
});

const alertZoneText = computed(() => {
	if (props.problems > 0) {
		return 'в красной зоне';
	}

	return 'в зоне риска';
});

const indicatorWord = computed(() => {
	const count = alertCount.value;
	const lastDigit = count % 10;
	const lastTwoDigits = count % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return 'показателей';
	}

	if (lastDigit === 1) {
		return 'показатель';
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'показателя';
	}

	return 'показателей';
});

const verbText = computed(() => {
	return alertCount.value === 1 ? 'находится' : 'находятся';
});
</script>

<template>
	<Transition name="global-alert">
		<div
			v-if="shouldShowAlert"
			class="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
		>
			<AlertTriangle
				class="mt-0.5 h-[18px] w-[18px] shrink-0"
				stroke-width="2"
			/>

			<div>
				<p class="text-sm">
					<strong>Требует внимания:</strong>
					{{ alertCount }} {{ indicatorWord }} {{ verbText }} {{ alertZoneText }}.
					Рекомендуется провести синхронизацию команды.
				</p>
			</div>
		</div>
	</Transition>
</template>

<style scoped>
.global-alert-enter-active,
.global-alert-leave-active {
	transition:
		opacity 0.2s ease,
		transform 0.2s ease;
}

.global-alert-enter-from,
.global-alert-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
</style>