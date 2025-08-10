import utils from "../mixins/utils-mixins";
import { useMainStore } from "@/stores";
import jQuery from 'jquery'


export const getUserIpAddress = async () => {
  let store = useMainStore();
  
  try {
    const data = await jQuery.getJSON("https://api.ipify.org?format=json");
    store.user_ip_address = data?.ip ?? null;
  } catch (error) {
    console.error("Erreur when getting IP address : ", error);
  }
}

export const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const register_service_worker = async (file_name = 'service-worker.js') => {
  if ('serviceWorker' in navigator) {
    return await navigator.serviceWorker
      .register(file_name, {
        scope: '/goldman-sachs/'
      });
  } else {
    console.log("Service Worker not present in Navigator");
  }
}

export const subscribe_service_worker = () => {
  let store = useMainStore();

  register_service_worker()
    .then((register) => {
      register.update();
      
      store.show_notif_modal = true;
    })
    .catch((error) => {
      console.error("Error service worker register:", error)
    })
}

export const subscribe_to_push_service = async (register = null) => {
  let store = useMainStore();
  
  let final_register = null;
  final_register = register;

  if(!register) {
    final_register = await register_service_worker();
  }

  if(!final_register) {
    console.warn("No service worker registration");
    return;
  }

  if(utils.methods.utils_get_cookies("push_service_subscribed")) {
    console.log("Subscribed to push service");
    store.subscribed_to_push = true;
    return;
  }
  
  const subscription = await final_register.pushManager.subscribe({
    userVisibleOnly: true,

    applicationServerKey: urlBase64ToUint8Array(store.yt_public_vapid_key),
  });

  let ajax_config = {
    url: utils.methods.make_ajax_url('/pushnotif/subscribe', 9001),
    type: 'POST',
    max_retry: 2,
    data: subscription.toJSON(),
    show_error: false,
    show_remote_error: false,
  }

  utils.methods.utils_async_ajax(ajax_config, (status, response) => {
    if(response.success || response.id) {
      utils.methods.utils_set_cookies("push_service_subscribed", response.id ?? "true", 60*24*30);
    }
  });
}
