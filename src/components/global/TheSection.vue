<script setup>
import { KeyboardBackspace } from 'mdue'
import { RouterLink } from 'vue-router'

defineProps({
  title: String,
  titleMuted: Boolean,
  linkTo: [String, Object],
  linkText: {
    type: String,
    default: "Voir plus"
  }
})

</script>

<template>
    <section>
        <div class="section-title" :class="{ 'text-muted': titleMuted }">
            <h3>{{ title }}</h3>
            <RouterLink v-if="linkTo" :to="linkTo" class="text-info2">
                <span class="pe-1">{{ linkText }}</span>
                <KeyboardBackspace style="font-size: 25px; transform: rotateZ(180deg);" />
            </RouterLink>

            <div v-if="!linkTo && $slots['end-actions']">
                <slot name="end-actions"></slot>
            </div>
        </div>
        <div class="section-body">
            <div v-if="$slots.desc">
                <slot name="desc"></slot>
            </div>
            <slot></slot>
        </div>
    </section>
</template>

<style scoped>

    section {
        margin: 30px 0;
        position: relative;
    }
    section .section-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* flex-wrap: wrap; */
        gap: 10px;
    }
    section .section-body {
        margin-top: 10px;
    }
    .end-actions {
        position: absolute;
        right: 0;
        top: 0;
    }
</style>