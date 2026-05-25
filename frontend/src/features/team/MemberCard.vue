<script setup>
defineProps({
  member: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="rounded-lg border border-slate-100 p-4 bg-emerald-50 flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <!-- Аватар с инициалами -->
      <div class="w-9 h-9 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs shrink-0">
        {{ member.name.split(' ').map(n => n[0]).join('').toUpperCase() }}
      </div>
      
      <!-- Имя и роль -->
      <div class="min-w-0">
        <p class="text-sm text-slate-800 truncate">{{ member.name }}</p>
        <p class="text-xs text-slate-400">{{ member.role }}</p>
      </div>
      
      <!-- Статус -->
      <span class="ml-auto shrink-0 flex items-center gap-1 text-xs text-emerald-600 px-2 py-0.5 rounded-full bg-white/60">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
        В норме
      </span>
    </div>
    
    <!-- Прогресс выполнения задач -->
    <div>
      <div class="flex justify-between text-xs text-slate-500 mb-1">
        <span>Задачи: {{ member.tasksCompleted }}/{{ member.tasksCompleted + member.tasksInProgress + 2 }}</span>
        <span>{{ Math.round((member.tasksCompleted / (member.tasksCompleted + member.tasksInProgress + 2)) * 100) }}%</span>
      </div>
      <div class="h-1.5 bg-white/80 rounded-full overflow-hidden">
        <div 
          class="h-full rounded-full transition-all bg-amber-400" 
          :style="{ width: Math.round((member.tasksCompleted / (member.tasksCompleted + member.tasksInProgress + 2)) * 100) + '%' }">
        </div>
      </div>
    </div>
    
    <!-- Открытые PR -->
    <div class="flex items-center gap-1 text-xs text-slate-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-pull-request">
        <circle cx="18" cy="18" r="3"></circle>
        <circle cx="6" cy="6" r="3"></circle>
        <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
        <line x1="6" x2="6" y1="9" y2="21"></line>
      </svg>
      <span>Открытых PR: {{ Math.floor(Math.random() * 5) }}</span>
    </div>
  </div>
</template>