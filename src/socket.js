import { reactive } from "vue";
import { io } from "socket.io-client";
import { useAppUtils } from '@/composables/useAppUtils.js';
import { useMainStore } from "@/stores";
import { getProfile } from "./services/auth";

export const init_socket = () => {
  const appUtils = useAppUtils();
  let store = useMainStore();

  const URL = store.yt_ws_url;
  const path = store.yt_ws_path;

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
  
  socket.on("pulse", () => {
    console.log("Hi. I'm alive");
    socket.emit('IM_ALIVE', "Hi. I'm alive");
    getProfile();
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  return socket;
}