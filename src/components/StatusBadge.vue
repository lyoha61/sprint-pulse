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
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
    error: 'border-red-500/40 bg-red-500/10 text-red-300',
  };

  return classes[props.type];
});
</script>

<template>
  <span
    :class="[
      'inline-flex w-fit min-w-max items-center justify-center whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium leading-none',
      badgeClasses,
    ]"
  >
    {{ text }}
  </span>
</template>