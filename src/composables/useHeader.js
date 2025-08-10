import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '@/stores'
import { getProfile } from '../services/auth'

export function useHeader() {
  const router = useRouter()
  const route = useRoute()
  const store = useMainStore()

  // Reactive data
  const menuOpen = ref(false)
  const showProfileMenu = ref(false)
  const isProcessing = ref(false)

  // Computed properties
  const pageTitle = computed(() => {
    return store.page_title || ''
  })

  const user = computed(() => {
    return store.user
  })

  const hasHistory = () => {
    return window.history.length > 2
  }

  // Methods
  const getUserInfo = async () => {
    const response = await getProfile();
    if(response && response?.user) {
      store.user = response
    }
  }

  const toggleMenu = (event) => {
    menuOpen.value = !menuOpen.value
    store.sidebar_shown = !store.sidebar_shown
  }

  const logout = (event) => {
    if (!confirm("Voulez-vous vraiment vous déconnecter ?")) {
      return
    }

    router.replace({ name: 'login' })

    let ajax_config = {
      url: utils.make_ajax_url("/auth/logout/"),
      type: "POST",
      show_error: false,
      show_remote_error: false,
    }

    utils.utils_async_ajax(ajax_config, (status, response) => {
      // console.log(response)
    })

    utils.utils_delete_cookies("access_token")
  }

  const cropLeadingDigits = (phone) => {
    if (!phone) return ''
    return phone.replace(/^\d{2}/, '**')
  }

  // Lifecycle
  onMounted(() => {
    getUserInfo()
  })

  return {
    // Reactive data
    menuOpen,
    showProfileMenu,
    isProcessing,
    
    // Computed
    pageTitle,
    user,
    
    // Methods
    hasHistory,
    getUserInfo,
    toggleMenu,
    logout,
    cropLeadingDigits
  }
} 