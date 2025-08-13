import { ref } from "vue";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const current_lang = ref(null);
  const form_id = ref("");

  const app_is_ready = ref(false);
  const page_blank = ref(true);
  const sidebar_shown = ref(false);
  const show_notif_modal = ref(false);
  const subscribed_to_push = ref(false);
  const configs = ref(null);
  const user_ip_address = ref(null);
  const page_title = ref('Goldman Sachs');
  const current_tab_index = ref(0);
  const alert = ref({ show: false });

  const global_alert = ref({
    show:false,
    message:{
      type:"error",
      text:"Une erreur s'est produite",
      icon:""
    }

  });
  const settings = ref({
    
  });
  const user = ref({});
  const connected = ref(false);
  const socket = ref(null);
  // const user = ref(null);
  
  // LIVE MODE
  const yt_api_url = ref(import.meta.env.VITE_API_BASE_URL || "http://localhost:1337");
  const yt_ws_url = ref(import.meta.env.VITE_WSS_BASE_URL || "ws://localhost:1337");
  const yt_ws_path = ref(null);
  // const yt_ws_path = ref("/svcws-chat/socket.io");

  const status_types = ref({
    "new": {
      color: 4,
      label: "Nouveau"
    },
    "pending": {
      color: 1,
      label: "En attente"
    },
    "opened": {
      color: 5,
      label: "En attente"
    },
    "closed": {
      color: 2,
      label: "Traité"
    },
    "enabled": {
      color: 5,
      label: "Actif"
    },
    "cancelled": {
      color: 3,
      label: "Annulé"
    },
    "disabled": {
      color: 3,
      label: "Inactif"
    },
  });
  const machines_list = ref([])
  const machine_selected = ref(null)
  const current_investments = ref([])

  return {
    current_lang,
    form_id,
    app_is_ready,
    page_blank,
    sidebar_shown,
    show_notif_modal,
    subscribed_to_push,
    configs,
    user_ip_address,
    page_title,
    current_tab_index,
    alert,
    global_alert,
    settings,
    user,
    connected,
    socket,
    yt_api_url,
    yt_ws_url,
    yt_ws_path,
    status_types,
    machines_list,
    current_investments,
    machine_selected,
  };
});
