<script setup>
import { computed } from 'vue'
import { Close } from 'mdue'

const props = defineProps({
    modelValue: Boolean,
    mTitle: String,
    position: String,
})
const emit = defineEmits(['update:modelValue'])

const modal_shown = computed({
  get() {
    if(props.modelValue) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
    <div 
      :class="{ 'base-modal': true, hide: !modal_shown }" 
      @click.self="$event => modal_shown = !modal_shown"
    >
      <div :class="{
        'base-modal-dialog': true,
        [position ?? 'center']: true
      }">
        <div v-if="mTitle" class="d-flex justify-content-between align-items-center p-3">
          <h3>{{ mTitle }}</h3>
          <Close style="font-size: 22px;" @click="$event => modal_shown = !modal_shown" />
        </div>
        <slot></slot>
      </div>
    </div>
</template>

<style scoped>
.base-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999999;
  background: #23232355;
  overflow: hidden;
  transition: all .2s;
}
.base-modal.hide {
  opacity: 0;
  pointer-events: none;
}
.base-modal .base-modal-dialog {
  position: absolute;
  width: 100%;
  max-height: 80%;
  overflow-y: auto;
  background-color: white;
  background: #FFFFFF;
  transition: all .4s;
}
.base-modal .base-modal-dialog.bottom {
  border-radius: 16px 16px 0px 0px;
  bottom: 0;
}
.base-modal.hide .base-modal-dialog.bottom {
  transform: translateY(100%);
}
.base-modal .base-modal-dialog.top {
  border-radius: 0px 0px 16px 16px;
  top: 0;
}
.base-modal.hide .base-modal-dialog.top {
  transform: translateY(-100%);
}
.base-modal .base-modal-dialog.center {
  width: 90%;
  border-radius: 0px 0px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.base-modal.hide .base-modal-dialog.center {
  transform: translate(-50%, 0);
}
</style>