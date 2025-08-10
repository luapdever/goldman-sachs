<script setup>

defineProps({
  outline: Boolean,
  dark: Boolean,
  danger: Boolean,
  noround: Boolean,
  block: Boolean,
  fixh: Boolean,
  small: Boolean,
  right: Boolean,
  disabled: Boolean,
  type: String,
  linkTo: [Object, String],
})

</script>

<template>
  <router-link :disabled="disabled" v-if="linkTo" :to="linkTo" :class="{ 'gs-btn': true, outline, dark, danger, noround, block, fixh, small, right }">
    <button :disabled="disabled" :type="type">
      <slot />
    </button>
  </router-link>
  <template v-else>
    <button :disabled="disabled" :type="type" :class="{ 'gs-btn': true, outline, dark, danger, noround, block, fixh, small, right }">
      <slot />
    </button>
  </template>
</template>

<style scoped>
.gs-btn {
  border: none;
  background: none;
  background: linear-gradient(180deg, #03045E 0%, #05078b 100%);
  color: #FFFFFF;
  box-shadow: 0 2px 4px #00000014;
  border-radius: 100px;
  transition: 0.3s;
  padding: 8px 30px;
  text-align: center;
  display: flex;
  width: fit-content;
  justify-content: center;
  align-items: center;
}
.gs-btn>button {
  border: none;
  background: none;
  color: inherit;
}
.gs-btn.outline {
  background: none;
  border: 1.2px solid var(--color-primary);
  color: var(--color-primary);
}
.gs-btn.dark {
  background: none;
  background-color: #232323;
  color: white;
}
.gs-btn.outline.dark {
  background: none;
  border: 1.2px solid #232323;
  color: #232323;
}
.gs-btn.noround {
  border-radius: 8px;
}
.gs-btn.block {
  width: 100%;
}
.gs-btn.fixh {
  height: 40px;
}
.gs-btn.small {
  padding: 5px 15px;
  font-size: 13px;
}
.gs-btn.right {
  margin-left: auto;
}
.gs-btn.danger {
  background: crimson;
  border-color: crimson;
  color: white;
}
/* .gs-btn[disabled] {
  background: #ddd !important;
  border-color: #ddd !important;
  color: #888 !important;
} */
</style>
