<script setup>
import BaseAlert from '../base/BaseAlert.vue'
import { useMainStore } from "@/stores";

import { computed } from 'vue';

let store = useMainStore();
let alert = computed(() => store.alert);

</script>

<template>
  <div class="alert-container" :class="{ hide: !alert.show }">
    <BaseAlert :type="alert.type" :message="alert.message" />
  </div>
</template>

<style scoped>
.alert-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99999999;
}
.alert-container.hide {
  pointer-events: none;
}
</style>