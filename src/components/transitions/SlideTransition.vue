<template>
  <transition :css="false" @enter="enter" @leave="leave">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  methods: {
    enter(el, done) {
      el.style.position = 'absolute';
      el.style.transform = 'translateX(100%)';
      el.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        el.style.transform = 'translateX(0)';
        el.addEventListener('transitionend', done);
      }, 0);
    },
    leave(el, done) {
      el.style.position = 'absolute';
      el.style.transform = 'translateX(0)';
      el.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        el.style.transform = 'translateX(-100%)';
        el.addEventListener('transitionend', done);
      }, 0);
    },
  },
};
</script>
