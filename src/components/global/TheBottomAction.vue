<script setup>

import { Plus } from 'mdue'

import AddInvestmentOC from '../machines/AddInvestmentOC.vue';
import { useMainStore } from '@/stores'
const store = useMainStore()

</script>

<template>
    <div v-if="['dashboard', 'machines'/* , 'profile' */].includes($route.name)" class="bottom-action">
        <button type="button" data-bs-toggle="offcanvas" data-bs-target="#addinvestment" aria-controls="addinvestment">
            <Plus style="font-size: 20px;" class="text-white" /> Investir
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
    background: none;
    border: none;
    background: var(--color-primary);
    color: white;
    padding: 10px 20px;
    border-radius: 30px;
    box-shadow: 0px 4px 6px 0px rgba(54, 64, 73, 0.20);
    cursor: pointer;
}

@media screen and (min-width: 993px) {
    .bottom-action {
        bottom: 35px;
        right: 35px;
    }
}
</style>