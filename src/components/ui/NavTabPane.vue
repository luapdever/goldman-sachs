<script setup>

const props = defineProps({
  paneId: {
    type: String,
    default: "label"
  },
  tabPrefix: {
    type: String,
    default: ""
  },
  active: {
    type: Boolean,
    default: () => false
  },
})

</script>

<template>
  <div 
    class="tab-pane fade" 
    :class="{ show: active, active: active }" 
    :id="paneId" role="tabpanel" 
    :aria-labelledby="`${paneId}-tab`" 
    tabindex="0"
  >
    <slot />
  </div>
</template>
