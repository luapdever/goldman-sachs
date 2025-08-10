<script setup>
import { RouterView } from 'vue-router'
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import TheAlertContainer from './components/global/TheAlertContainer.vue'
import TheHeader from './components/global/TheHeader.vue'
import TheInstallAppBtn from './components/global/TheInstallAppBtn.vue'
import TheNotifModal from './components/global/TheNotifModal.vue'
import { useMainStore } from "@/stores"
import { useAppUtils } from "@/composables/useAppUtils.js"
import sound from '/sound/elegant-notification-sound.mp3'

// Store et utilitaires
const store = useMainStore()
const appUtils = useAppUtils()
const router = useRouter()

// État réactif
const windowWidth = ref(window.innerWidth)

// Computed
const socket = computed(() => store.socket)

const chat_event_handlers = () => {
  // store.socket.on("NEW_TICKET_CHAT_MESSAGE", (data) => {
  //   toast.info(
  //     "<strong>Message Ticket #"+ data.ticket_id + "</strong> \n" + appUtils.htmlEncode(appUtils.textTruncate(data.content, 30)), 
  //     {
  //       dangerouslyHTMLString: true,
  //       onClick: (event) => {
  //         if(windowWidth.value > 768) {
  //           router.replace({ name: 'tickets', hash: '#'+ data.ticket_id + '-discussion' });
  //         } else {
  //           router.push({ name: 'single-ticket', params: { ticket_id: data.ticket_id }, hash: '#details' });
  //         }
  //       }
  //     }
  //   );
  // });

  store.socket?.on("TICKET_CLOSED", (data) => {
    console.log("TICKET_CLOSED", data.id)
    appUtils.playAppSound()
    
    toast.success(
      "<strong>Ticket #"+ data.id + "</strong> \n Ticket fermé. Cliquer pour en savoir plus.", 
      {
        dangerouslyHTMLString: true,
        onClick: (event) => {
          if(windowWidth.value > 768) {
            router.push({ name: 'tickets', hash: '#'+ data.id + '-details' })
          } else {
            router.push({ name: 'single-ticket', params: { ticket_id: data.id }, hash: '#details' })
          }
        }
      }
    )
  })

  store.socket?.on("TICKET_STATUS_UPDATED", (data) => {
    console.log("TICKET_STATUS_UPDATED", data.id)
    appUtils.playAppSound()

    toast.warning(
      "<strong>Ticket #"+ data.id + "</strong> \n Ticket en cours de traitement. Cliquer pour en savoir plus.", 
      {
        dangerouslyHTMLString: true,
        onClick: (event) => {
          if(windowWidth.value > 768) {
            router.push({ name: 'tickets', hash: '#'+ data.id + '-details' })
          } else {
            router.push({ name: 'single-ticket', params: { ticket_id: data.id }, hash: '#details' })
          }
        }
      }
    )
  })
}

// Watchers
watch(socket, () => {
  chat_event_handlers()
})

// Lifecycle
onMounted(() => {
  chat_event_handlers()
})
</script>

<template>
  <div>
    <div v-if="!store.app_is_ready" id="loader">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
    
    <TheAlertContainer />
    
    <TheHeader v-if="!store.page_blank" />
    <router-view v-slot="{ Component }">
      <transition :name="store.transition_name ?? 'slide'">
        <!-- <keep-alive> -->
          <component :is="Component" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>

    <the-install-app-btn />
    <the-notif-modal />
  </div>
</template>
