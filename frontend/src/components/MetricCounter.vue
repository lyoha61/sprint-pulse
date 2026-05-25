<script setup>
import { defineProps } from 'vue';

const props = defineProps({
	problems: {
		type: Number,
		default: 0,
	},
	attention: {
		type: Number,
		default: 0,
	},
	norm: {
		type: Number,
		default: 0,
	}
})
</script>

<template>
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-1.5 text-sm">
			<span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
			<span class="text-slate-600">{{ problems }} проблем</span>
		</div>
		
		<div class="flex items-center gap-1.5 text-sm">
			<span class="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
			<span class="text-slate-600">{{ attention }} внимание</span>
		</div>
		
		<div class="flex items-center gap-1.5 text-sm">
			<span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
			<span class="text-slate-600">{{ norm }} норма</span>
		</div>
	</div>
</template>