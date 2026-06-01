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
  <router-link :disabled="disabled" v-if="linkTo" :to="linkTo" class="btn" :class="{ 'gs-btn': true, outline, dark, danger, noround, block, fixh, small, right }">
    <button :disabled="disabled" :type="type">
      <slot />
    </button>
  </router-link>
  <template v-else>
    <button :disabled="disabled" :type="type" class="btn" :class="{ 'gs-btn': true, outline, dark, danger, noround, block, fixh, small, right }">
      <slot />
    </button>
  </template>
</template>

<style scoped>
.gs-btn {
  border: none;
  background: var(--oy-gold-grad);
  color: var(--oy-bg);
  font-weight: 700;
  box-shadow: var(--oy-shadow-gold);
  border-radius: 100px;
  transition: 0.3s;
  padding: 8px 30px;
  text-align: center;
  display: flex;
  width: fit-content;
  justify-content: center;
  align-items: center;
}
.gs-btn:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
}
.gs-btn>button {
  border: none;
  background: none;
  color: inherit;
  font-weight: inherit;
}
.gs-btn.outline {
  background: none;
  border: 1.2px solid var(--oy-gold);
  color: var(--oy-gold);
  box-shadow: none;
}
.gs-btn.dark {
  background: none;
  background-color: var(--oy-surface-2);
  border: 1px solid var(--oy-border);
  color: var(--oy-text);
  box-shadow: none;
}
.gs-btn.outline.dark {
  background: none;
  border: 1.2px solid var(--oy-border);
  color: var(--oy-text-muted);
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
  background: var(--oy-danger);
  border-color: var(--oy-danger);
  color: #fff;
}
.gs-btn[disabled] {
  background: var(--oy-surface-3) !important;
  border-color: var(--oy-surface-3) !important;
  color: var(--oy-text-dim) !important;
  box-shadow: none !important;
}
</style>
