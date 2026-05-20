<script setup>
import { computed } from 'vue'
import { getTeamById } from '@src/mocks/teams'
import MemberCard from './MemberCard.vue'

const props = defineProps({
  activeSprint: {
    type: Object,
    required: true
  }
})

const teamData = computed(() => {
  if (props.activeSprint && props.activeSprint.teamId) {
    return getTeamById(props.activeSprint.teamId)
  }
  return null
})
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-5">
    <div class="flex justify-between items-start mb-6">
      <div>
        <h3 class="text-xl font-semibold text-slate-800">Команда</h3>
        <p class="text-xs text-slate-400">Прогресс каждого разработчика в спринте</p>
      </div>

      <div class="flex space-x-4">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span class="text-sm text-slate-600">В порядке</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span class="text-sm text-slate-600">Риск</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span class="text-sm text-slate-600">Блокер</span>
        </div>
      </div>
    </div>

    <div v-if="teamData && teamData.members && teamData.members.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MemberCard 
          v-for="member in teamData.members" 
          :key="member.id"
          :member="member"
        />
      </div>
    </div>

    <div v-else class="text-center py-8 text-slate-500">
      Данные о команде недоступны
    </div>
  </div>
</template>