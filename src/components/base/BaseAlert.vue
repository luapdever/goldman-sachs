<script setup>
import { Check, Close, CloseCircleOutline, CloseOutline, InformationOutline } from 'mdue'
import { computed, ref, watch } from 'vue';
import { useMainStore } from "@/stores";
let store = useMainStore();

defineProps({
    type: String,
    message: String
})

let alert = computed(() => store.alert);

let alertEl = ref(null);
let timer = ref(null);

const hideAlert = () => {
    if(alert.value.show) {
        store.commit("set_alert", { ...alert.value, show: false })
    }
}

watch(alert, () => {
    if(alert.value.show) {
        setTimeout(() => {
            hideAlert();
        }, 5000)
    }
})

</script>

<template>
    <div @click="$event => hideAlert()" ref="alertEl" :class="{
            alert: true,
            ['alert-'+type]: true,
            show: alert.show
        }"
    >
        <span>
            <Check v-if="type == 'success'" />
            <CloseCircleOutline v-else-if="type == 'danger'" />
            <InformationOutline v-else-if="type == 'info'" />
        </span>
        <p v-html="message"></p>
    </div>
</template>

<style>
.alert {
    display: flex !important;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    padding: 20px !important;
    border: 0 !important;
    border-radius: 0 !important;
    background-color: var(--oy-surface);
    color: var(--oy-text);
    transform: translateY(-100%);
    transition: transform 0.4s;
    box-shadow: var(--oy-shadow);
}
.alert.alert-success {
    background-color: var(--oy-success);
    color: var(--oy-bg);
}
.alert>p {
    margin: 0;
    font-size: 18px;
    word-break: break-all;
}

.alert>span {
    font-size: 22px;
    margin-bottom: 2px;
}
.alert.show {
    transform: translateY(0%);
}
</style>