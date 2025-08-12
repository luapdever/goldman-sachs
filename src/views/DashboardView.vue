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

            <table v-else class="table table-striped bg-white">
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
                  <p class="card-text">Générez <span class="fw-bold">{{ item?.rate }}%</span> de rendement avec cette machine d'extraction. Investissez <span class="fw-bold">{{ item?.amount }} USD</span> et commencez à gagner dès aujourd'hui </p>
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

        <TheSection 
          title="Support & Contact"
          title-muted
        >
          <div class="support-banner mb-4">
            <div class="support-content text-center">
              <h4 class="text-white mb-3">Besoin d'aide ?</h4>
              <p class="text-white-50 mb-4">Notre équipe support est disponible 24/7 pour vous accompagner</p>
              <div class="support-links">
                <a href="https://t.me/Alaba_229" target="_blank" class="btn btn-light me-1">
                  Telegram Support
                </a>
                <a href="mailto:svenlelandais602@gmail.com" class="btn btn-outline-light">
                  Email
                </a>
              </div>
            </div>
          </div>
        </TheSection>

        <button id="openAddI" class="d-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#addinvestment" aria-controls="addinvestment">Go</button>
      </div>
    </main-layout>
  </div>
</template>

<style scoped>
.support-banner {
  background: linear-gradient(135deg, #667eea 0%, var(--color-primary) 100%);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.support-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.support-content {
  position: relative;
  z-index: 2;
}

.support-icon {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.support-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.support-links .btn {
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.support-links .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .support-banner {
    padding: 1.5rem;
  }
  
  .support-links {
    flex-direction: column;
    align-items: center;
  }
  
  .support-links .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
