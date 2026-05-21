<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['success', 'warning', 'error'].includes(value),
  },
  text: {
    type: String,
    required: true,
  },
});

const badgeClasses = computed(() => {
  const classes = {
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
  };

  return classes[props.type] || classes.success;
});
</script>

<template>
  <span
    :class="[
      'inline-flex min-w-max items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium leading-none',
      badgeClasses,
    ]"
  >
    {{ text }}
  </span>
</template>