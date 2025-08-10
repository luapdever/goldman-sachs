import { useMainStore } from "@/stores";
let store = useMainStore();;

export const show_alert = (type = 'success', message = '') => {
    store.commit("set_alert", { show: true, type, message });
}