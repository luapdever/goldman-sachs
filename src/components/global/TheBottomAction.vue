<script setup>

import { Plus } from 'mdue'

import AddInvestmentOC from '../machines/AddInvestmentOC.vue';
import { useMainStore } from '@/stores'
const store = useMainStore()

</script>

<template>
    <div v-if="['dashboard', 'machines'/* , 'profile' */].includes($route.name)" class="bottom-action">
        <button type="button" data-bs-toggle="offcanvas" data-bs-target="#addinvestment" aria-controls="addinvestment">
            <Plus style="font-size: 20px;" /> Investir
        </button>
    </div>

    <div>
        <AddInvestmentOC />
    </div>
</template>

<script>
export default {
    data() {
        return {
            menu_open: false
        };
    },
    computed: {
        wind_width() {
            return window.innerWidth;
        }
    },
    components: { AddInvestmentOC }
}
</script>

<style scoped>
.bottom-action {
    position: fixed;
    /* padding: 15px; */
    bottom: 15px;
    right: 15px;
    z-index: 9999;
}
.bottom-action button {
    border: none;
    background: var(--oy-gold-grad);
    color: var(--oy-bg);
    font-weight: 700;
    padding: 12px 22px;
    border-radius: 30px;
    box-shadow: var(--oy-shadow-gold);
    cursor: pointer;
    transition: .25s;
}
.bottom-action button:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
}

@media screen and (min-width: 993px) {
    .bottom-action {
        bottom: 35px;
        right: 35px;
    }
}
</style>