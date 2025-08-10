<script setup>
import { onMounted } from 'vue'
import TheSection from '../components/global/TheSection.vue'
import TheMachinesList from '../components/machines/TheMachinesList.vue'
import DashboardSummary from '../components/machines/DashboardSummary.vue'
import { useDashboard } from '@/composables/useDashboard'

// Use the machines composable
const {
  pagination,
  summary,
  isProcessing,
  currentInvestments,
  getCurrentInvestments,
  changePage,
  getStats
} = useDashboard()

// Lifecycle
onMounted(() => {
  // getStatistics() // Uncomment if needed
  getCurrentInvestments()
})
</script>

<template>
  <div class="dash-b">
    <main-layout>
      <div class="px-4 py-1 mb-5">   
        <dashboard-summary />
        
        <TheSection 
          :title="'Mes investissements ' + (pagination.count != 0 ? '(' + pagination.count + ')' : '')"
          title-muted
        >
          <the-machines-list
            :machines="currentInvestments"
            :page="pagination.page" 
            :count="pagination.count" 
            :size="pagination.size" 
            @change-page="changePage" 
            :is_processing="isProcessing"
            ticketListId="for_dash"
          />
        </TheSection>
      </div>
    </main-layout>
  </div>
</template>
