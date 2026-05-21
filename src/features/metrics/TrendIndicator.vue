<script setup>
import { computed } from 'vue';
import { TrendingUp, TrendingDown } from '@lucide/vue';

const props = defineProps({
	trend: {
		type: String,
		default: 'stable',
		validator: (value) => ['up', 'down', 'stable'].includes(value),
	},
	trendPercent: {
		type: Number,
		default: 0,
	},
});

const trendClasses = computed(() => {
	const classes = {
		up: 'text-emerald-600',
		down: 'text-red-500',
		stable: 'text-slate-500',
	};

	return classes[props.trend] || classes.stable;
});

const TrendIcon = computed(() => {
	if (props.trendPercent > 0) {
		return TrendingUp;
	}

	if (props.trendPercent < 0) {
		return TrendingDown;
	}

	return null;
});

const formattedTrendPercent = computed(() => {
	if (props.trendPercent > 0) {
		return `+${props.trendPercent}%`;
	}

	return `${props.trendPercent}%`;
});
</script>

<template>
    <div :class="['flex items-center gap-1.5 text-xs font-semibold', trendClasses]">
	    <component
			:is="TrendIcon"
			v-if="TrendIcon"
			class="h-3.5 w-3.5"
			stroke-width="2"
		/>

	    <span
            v-else
            class="text-sm leading-none"
	    >
		—
	    </span>

	    <span>
		    {{ formattedTrendPercent }} к прошлому спринту
	    </span>
    </div>
</template>