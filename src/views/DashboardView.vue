<script setup>
import { onMounted } from 'vue'
import TheSection from '../components/global/TheSection.vue'
import TheMachinesList from '../components/machines/TheMachinesList.vue'
import DashboardSummary from '../components/machines/DashboardSummary.vue'
import { useDashboard } from '@/composables/useDashboard'
import { useAppUtils } from '../composables/useAppUtils'
import no_result from '../assets/img/no-result.svg';

const appUtils = useAppUtils();
// Use the machines composable
const {
  pagination,
  summary,
  isProcessing,
  currentInvestments,
  availableMachines,
  getCurrentInvestments,
  selectMachine,
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
          <div class="table-responsive">
            <div v-if="currentInvestments.length == 0" class="w-100 d-flex justify-content-center align-items-center">
              <div class="text-center">
                <img :src="no_result" alt="No result">
                <p class="fw-bold text-muted m-0 p-0">Aucun investissement trouvé pour le moment.</p>
              </div>
            </div>
            <table class="table table-striped bg-white">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Machine</th>
                  <th scope="col">Montant</th>
                  <th scope="col">Date</th>
                  <th scope="col">Adresse Wallet</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentInvestments" :key="'Investment' + index">
                  <th scope="row">#{{ item?.id }}</th>
                  <td>{{ item?.machine?.label ?? "Inconnu" }} ({{ item?.machine?.rate ?? "0" }}%)</td>
                  <td><span class="fw-bold">{{ item?.amount ?? 0 }} USD</span></td>
                  <td>{{ appUtils.momentDatetimeFormat(item.date, "DD/MM/YYYY") }}</td>
                  <td>{{ item?.wallet_type == 'binance' ? "Binance" : "Wallet" }} : {{ item?.wallet_addr ?? "-" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TheSection>
        <TheSection 
          title="Machines disponibles"
          title-muted
        >
          <div class="row">
            <div v-if="availableMachines.length == 0" class="w-100 d-flex justify-content-center align-items-center">
              <div class="text-center">
                <img :src="no_result" alt="No result">
                <p class="fw-bold text-muted m-0 p-0">Aucune machine pour le moment.</p>
              </div>
            </div>

            <div v-for="(item, index) in availableMachines" :key="'Machine' + index" class="col-lg-3 col-12">
              <div class="card">
                <img :src="item?.image?.url ?? '...'" class="card-img-top" alt="..." width="100%" height="150" style="object-fit: cover;">
                <div class="card-body">
                  <h5 class="card-title">{{ item?.label ?? "Inconnu" }}</h5>
                  <p class="card-text">Générez {{ item?.rate }}% de rendement avec cette machine d'extraction. Investissez maintenant et commencez à gagner dès aujourd'hui </p>
                  <base-button 
                    :disabled="inSubmitting" 
                    block 
                    fixh 
                    @click.prevent="selectMachine(item?.id)"
                  >
                    Investir
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </TheSection>

        <button id="openAddI" class="d-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#addinvestment" aria-controls="addinvestment">Go</button>
      </div>
    </main-layout>
  </div>
</template>
