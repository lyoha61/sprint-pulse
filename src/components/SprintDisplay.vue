<script setup>
import { defineProps, computed } from 'vue';
import { formatDateRangeForSprint } from '../utils/dateUtils';

const props = defineProps({
	sprint: {
    type: Object,
    required: true
  }
})

const sprintDate = computed(() => {
  return formatDateRangeForSprint(
    props.sprint.startDate,
    props.sprint.endDate
  )
})
</script>

<template>

<div class="mb-6">
	<div class="flex items-center gap-2">
		<h2 class="text-slate-800 text-xl leading-normal">
			{{ sprint.name }}
		</h2>
		<span class="text-xs text-slate-400">
			{{ sprintDate }}
		</span>
	</div>
</div>
</template>