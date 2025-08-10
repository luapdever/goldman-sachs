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
  background-color: #eee;
  color: black;
}
.c-badge.block {
  display: block;
  width: 100%;
}
.c-badge.color-0 {
  background-color: #03045E22;
  color: var(--color-0);
}
.c-badge.color-x {
  background-color: #A3E5FF;
  color: var(--color-x);
}
.c-badge.color-1 {
  background-color: #ff9f0026;
  color: var(--color-1);
}
.c-badge.color-2 {
  background-color: #A3E5FF;
  /* background-color: #0d99ff33; */
  color: var(--color-2);
}
.c-badge.color-3 {
  background-color: #FCC1DB;
  color: var(--color-3);
}
.c-badge.color-4 {
  background-color: #ff5e5e26;
  color: var(--color-4);
}
.c-badge.color-5 {
  background-color: #3ac97726;
  color: var(--color-5);
}


.c-badge.outline {
  background: none !important;
  border: 1px solid black;
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
