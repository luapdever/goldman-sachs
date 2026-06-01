<script setup>
defineProps({
  outline: Boolean,
  circle: Boolean,
  color: [String, Number],
  block: Boolean
})
</script>

<template>
  <div class="c-badge rounded p-1" :class="{ 'rounded-circle': circle, ['color-'+color]: true, outline, block }">
    <slot></slot>
  </div>
</template>

<style scoped>
.c-badge {
  display: inline-block;
  background-color: var(--oy-surface-2);
  color: var(--oy-text);
}
.c-badge.block {
  display: block;
  width: 100%;
}
.c-badge.color-0 {
  background-color: rgba(var(--oy-gold-rgb), 0.14);
  color: var(--color-0);
}
.c-badge.color-x {
  background-color: rgba(var(--oy-gold-rgb), 0.14);
  color: var(--color-x);
}
.c-badge.color-1 {
  background-color: rgba(232, 199, 101, 0.15);
  color: var(--color-1);
}
.c-badge.color-2 {
  background-color: rgba(90, 182, 216, 0.15);
  color: var(--color-2);
}
.c-badge.color-3 {
  background-color: rgba(168, 132, 42, 0.18);
  color: var(--color-1);
}
.c-badge.color-4 {
  background-color: rgba(255, 94, 94, 0.15);
  color: var(--color-4);
}
.c-badge.color-5 {
  background-color: rgba(58, 201, 119, 0.15);
  color: var(--color-5);
}


.c-badge.outline {
  background: none !important;
  border: 1px solid var(--oy-border);
}
.c-badge.outline.color-x {
  border-color: var(--color-x);
}
.c-badge.outline.color-0 {
  border-color: var(--color-0);
}
.c-badge.outline.color-1 {
  border-color: var(--color-1);
}
.c-badge.outline.color-2 {
  border-color: var(--color-2);
}
.c-badge.outline.color-3 {
  border-color: var(--color-3);
}
.c-badge.outline.color-4 {
  border-color: var(--color-4);
}
.c-badge.outline.color-5 {
  border-color: var(--color-5);
}
</style>
