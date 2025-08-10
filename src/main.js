import { createApp } from 'vue'
import App from './App.vue'
import BaseButton from './components/base/BaseButton.vue'
import BaseModal from './components/base/BaseModal.vue'
import BaseInput from './components/base/BaseInput.vue'
import BaseCard from './components/base/BaseCard.vue'
import BaseBadge from './components/base/BaseBadge.vue'
import MainLayout from './layouts/MainLayout.vue'
import router from './router'
import jQuery from 'jquery'
import { createPinia } from 'pinia'
import { useMainStore } from "@/stores";


import { useAppUtils } from '@/composables/useAppUtils.js';

import lodash from 'lodash'

import Skeleton from 'vue-loading-skeleton'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import './assets/theme/js/lib/bootstrap.min.js'

import "./assets/theme/b5/bootstrap.min.css";
import "./assets/theme/b5/bootstrap.min.js";

import './assets/theme/js/base.js'

import './assets/theme/css/style.css'

import './assets/css/theme.css'
import './assets/css/blank-page.css'

import './assets/main.css'
import sound from '/sound/elegant-notification-sound.mp3'

import Vue3Toasity, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { getUserIpAddress, register_service_worker } from './helpers/push_scripts'

const app = createApp(App)

window.jQuery = jQuery
window.$ = jQuery
window._ = lodash

app.use(Skeleton)

app.use(router)
app.use(createPinia())

app.use(
  Vue3Toasity,
  {
    autoClose: 10000,
    position: toast.POSITION.BOTTOM_RIGHT,
    limit: 3,
  },
)
app.component('BaseButton', BaseButton)
app.component('BaseModal', BaseModal)
app.component('BaseCard', BaseCard)
app.component('BaseBadge', BaseBadge)
app.component('BaseInput', BaseInput)
app.component('MainLayout', MainLayout)

app.mount('#app')

getUserIpAddress();

register_service_worker()
  .then(function(register) {
    const store = useMainStore();
    const appUtils = useAppUtils();

    if(register) {
      console.log('Service worker successfully registred.');
      register.update().then(function() {
        console.log('Service worker successfully updated.');
      });
      
      store.show_notif_modal = true;

      navigator.serviceWorker.addEventListener('message', function(event) {
        if (event.data && event.data.action === 'playSound') {
          appUtils.playAppSound();
        }
      });
    }
  })
  .catch((error) => {
    console.error("Error service worker register:", error)
  });