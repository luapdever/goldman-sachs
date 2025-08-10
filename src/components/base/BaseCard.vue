<template>
  <div class="card" :class="{ ['bg-'+bg]: true, ['text-'+textColor]: true, animated, ...extraClass }">
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bg: {
      type: String,
      default: "light",
    },
    textColor: {
      type: String,
      default: "dark",
    },
    animated: {
      type: Boolean,
      default: false,
    },
    extraClass: {
      type: Object,
      default: () => { return {} },
    }
  },
}
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    transform: translateY(-45px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
.card {
  transition: 0.4s;
}
.card.animated {
  animation: fadeIn 0.8s;
}
.card.card-new {
  border-left: 8px solid #03045E;
}
</style>
