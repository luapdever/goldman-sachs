<script setup>
import TheBottomAction from '../components/global/TheBottomAction.vue'

defineProps({
  white: Boolean,
  blank: Boolean,
  fixed: Boolean,
  fullscreen: {
    type: Boolean,
    default: true
  },
});

import { useMainStore } from "@/stores";
let store = useMainStore();


</script>

<template>
  <main class="main-container" :class="{ white, blank, fullscreen, fixed, 'with-sidebar': store.sidebar_shown }">
    <slot></slot>
  </main>
  <TheBottomAction v-if="!blank" />
</template>
