<template>
  <div>
    <transition name="fade">
      <div v-if="canShowModal" class="w-100 notif-modal" @click.self="closeModal()">
        <div class="d-flex flex-column justify-content-center align-items-center text-center py-4 px-3">
          <p>
            Soyez informé(e) <strong>en temps réel</strong> en autorisant les notifications sur votre appareil. <br />
            <template v-if="isDenied">
              <p class="m-0 mt-1">Si vous ne recevez pas de demande pour autoriser les notifications, veuillez l'autoriser dans les ⚙️<strong>Paramètres</strong> </p>
            </template>
          </p>
          <div>
            <base-button dark @click="authorizeNotification">Autoriser</base-button>
            <button @click="closeModal()" class="btn">Ignorer</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores'
import { subscribe_to_push_service } from '../../helpers/push_scripts'
import BaseButton from '../base/BaseButton.vue'

// Store et route
const store = useMainStore()
const route = useRoute()

// État réactif
const isDenied = ref(false)

// Computed
const canShowModal = computed(() => {
  if (!store.show_notif_modal) {
    return false
  }

  if (!('Notification' in window)) {
    return false
  }

  let permission = Notification.permission
  if (permission == 'granted') {
    subtopush()
    return false
  } else if (permission == 'default') {
    return true
  }

  return true
})

// Méthodes
const showModal = () => {
  store.show_notif_modal = true
}

const closeModal = () => {
  store.show_notif_modal = false
}

const subtopush = () => {
  if (route.meta?.middlewares && route.meta?.middlewares?.includes('auth') && !store.subscribed_to_push) {
    subscribe_to_push_service()
  }
}

const authorizeNotification = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(async (permission) => {
      if (permission === 'granted') {
        console.log('Notification granted for this browser.')
      }
      console.log('Notification permission : ', permission)

      subtopush()
      closeModal()
    }).catch((error) => {
      console.error("Error when requesting notification:", error)
      closeModal()
    })

    isDenied.value = false
  } else {
    closeModal()
  }
}

// Lifecycle
onMounted(() => {
  if ('Notification' in window) {
    let permission = Notification.permission
    console.log('Notification permission : ', permission)
    if (permission == 'default') {
      showModal()
    } else if (permission == 'granted') {
      isDenied.value = false
      store.show_notif_modal = false

      subtopush()
    } else if (permission == 'denied') {
      isDenied.value = true
    }
  } else {
    console.log("No notification objet found.")
  }
})
</script>

<style scoped>
@keyframes animateDCtn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes animateDCtnDIV {
  0% {
    transform: translate(-50%, 0%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

.notif-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: var(--color-primary);
}

.notif-modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh !important;
  z-index: 99999;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(7.5px);
  animation: animateDCtn .2s linear;
}
.notif-modal>div {
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 85%;
  max-width: 450px;
  max-height: 80vh;
  background-color: white;
  border-radius: 30px;
  padding: 15px;
  box-shadow: 0px 0px 5px #00000033;
  animation: animateCCtnDIV .2s linear;
}
</style>