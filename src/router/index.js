import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
// import MachinesView from '../views/MachinesView.vue'
import ProfileView from '../views/ProfileView.vue'
import AboutView from '../views/AboutView.vue'
import { useMainStore } from "@/stores";
import { useAppUtils } from "@/composables/useAppUtils";

import utils from '../mixins/utils-mixins';
import { init_socket } from '../socket'
import { subscribe_service_worker } from '../helpers/push_scripts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Goldman Sachs', middlewares: ['guest'], page_blank: true, transition_name: 'fade' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: 'Register - Goldman Sachs', middlewares: ['guest'], page_blank: true, transition_name: 'fade' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: 'Goldman Sachs', middlewares: ['auth'], page_blank: false, transition_name: 'slide' }
    },
    // {
    //   path: '/machines',
    //   name: 'machines',
    //   component: MachinesView,
    //   meta: { title: 'Liste des machines', middlewares: ['auth'], page_blank: false, transition_name: 'slide' }
    // },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { title: 'Mon compte', middlewares: ['auth'], page_blank: false, transition_name: 'slide' }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: () => import('../views/404View.vue'),
      meta: { title: '404 - Not Found', /* middlewares: ['guest'], */ page_blank: true }
    }
  ]
})

// eslint-disable-next-line no-unused-vars
router.beforeEach((to, from) => {
  let store = useMainStore();
  const appUtils = useAppUtils();
  
  if(to.meta.middlewares) {
    if(to.meta.middlewares.includes('auth') && !appUtils.utils_get_cookies("access_tchavi")) {
      router.replace({ name: "login" })
    } else if(to.meta.middlewares.includes('guest') && appUtils.utils_get_cookies("access_tchavi")) {
      router.replace({ name: "dashboard" })
    }

    if(to.meta.middlewares.includes('auth')) {
      subscribe_service_worker();
      if(!store.socket || !store.socket.connected) {
        store.socket = init_socket();
        store.connected = true;
      }
    }
  }

  if(window && window.innerWidth > 768) {
    store.transition_name = 'fade';
  } else if(to.meta.transition_name) {
    store.transition_name = to.meta.transition_name;
  } else {
    store.transition_name = 'slide';
  }

  document.title = to.meta.title || "Goldman Sachs";
  store.page_title = to.meta.title || "Goldman Sachs";

  if(to.meta.page_blank != null) {
    store.page_blank = to.meta.page_blank;
  }
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});

export default router
