import { ref, computed } from 'vue'
import { useMainStore } from '@/stores'
import { useAppUtils } from '@/composables/useAppUtils'
import { getInvestments, getStatistics } from '../services/app'

export const useDashboard = () => {
  const store = useMainStore()
  const appUtils = useAppUtils()

  // Reactive state
  const pagination = ref({
    page: 0,
    count: 0,
    size: 1000,
  })

  const summary = ref({
    new: 0,
    opened: 0,
    pending: 0,
    cancelled: 0,
    closed: 0
  })

  const isProcessing = ref(false)

  // Computed properties
  const currentInvestments = computed(() => {
    return store.current_investments
  })

  // Methods
  const getCurrentInvestments = async (fromFilter = false) => {
    isProcessing.value = true

    let filterData = {}

    /* Filter options */
    if (fromFilter) {
      filterData = { ...filterData, ...pagination.value }
    }

    filterData.size = pagination.value.size

    const response = await getInvestments();
    isProcessing.value = false;
    
    if (response?.results) {
      store.current_investments = response?.results ?? []
      pagination.value.count = parseInt(response?.pagination?.total ?? 0)
      pagination.value.page = parseInt(response.pagination?.page ?? 0)
    } else {
      store.current_investments = []
    }
  }

  const changePage = (page) => {
    pagination.value.page = page
    getCurrentInvestments(true)
  }

  // Optional: get statistics method (commented in original)
  const getStats = async () => {
    const response = await getStatistics();
    if (response?.data) {
      summary.value = response?.data ?? {};
    }
  }

  return {
    // State
    pagination,
    summary,
    isProcessing,
    
    // Computed
    currentInvestments,
    
    // Methods
    getCurrentInvestments,
    changePage,
    getStats
  }
} 