<script setup>

import { Plus } from 'mdue'

import AddTicketOC from '../tickets/AddTicketOC.vue';
</script>

<template>
    <div v-if="['dashboard', 'tickets'/* , 'profile' */].includes($route.name)" class="bottom-action">
        <button type="button" data-bs-toggle="offcanvas" data-bs-target="#addTicket" aria-controls="addTicket">
            <Plus style="font-size: 35px;" class="text-black" />
        </button>
    </div>

    <div>
        <AddTicketOC />
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
    components: { AddTicketOC }
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
    background: #fc0;
    padding: 10px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
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