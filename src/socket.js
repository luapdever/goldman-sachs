import { reactive } from "vue";
import { io } from "socket.io-client";
import { useAppUtils } from '@/composables/useAppUtils.js';
import { useMainStore } from "@/stores";

export const init_socket = () => {
  const appUtils = useAppUtils();
  let store = useMainStore();

  const URL = store.yt_ws_url;
  const path = store.yt_ws_path;

  let auth_cookie = appUtils.utils_get_cookies("access_token");
  let yt_x_api_key = store.yt_x_api_key;

  const extraHeaders = {
    Authorization: "Bearer " + auth_cookie,
    "X-GOU-BABA": "" + yt_x_api_key,
  };


  const socket = io(URL, {
    transports: ["websocket"],
    path,
    // extraHeaders,
    // auth: {
    //   token: "Bearer " + auth_cookie,
    // }
  });

  socket.on("connect", () => {
    console.log("Connected");
    store.connected = true;
  });

  socket.on("disconnect", () => {
    store.connected = false;
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  return socket;
}