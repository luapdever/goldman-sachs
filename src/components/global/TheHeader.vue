<script setup>
import { KeyboardBackspace, Menu, HomeOutline, ArchiveOutline, TrendingUp, AccountOutline, AccountArrowLeftOutline, ChevronDown } from 'mdue'
import { useRoute } from 'vue-router'
// import logo from '../../assets/img/logo.svg'
import gs_search from '../../assets/img/gs_search.svg'
import TheSearchOC from './TheSearchOC.vue'
import { useHeader } from '@/composables/useHeader'
import { useMainStore } from "@/stores"

const route = useRoute()
const store = useMainStore()

// Use the header composable
const {
  menuOpen,
  showProfileMenu,
  isProcessing,
  pageTitle,
  user,
  hasHistory,
  toggleMenu,
  logout,
  cropLeadingDigits
} = useHeader()
</script>

<template>
    <div>
        <!-- Header -->
        <header class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
                <template v-if="route.name == 'dashboard'">
                    <button type="button" class="p-0" @click="toggleMenu($event)">
                        <Menu style="font-size: 25px;" class="text-white" />
                    </button>
                    <!-- <img :src="logo" alt="GS Logo" width="40" /> -->
                </template>
                <div type="button" v-else @click="hasHistory() ? router.go(-1) : router.push('/')">
                    <KeyboardBackspace style="font-size: 25px;" class="text-white" />
                </div>
                <div>
                    <h4>{{ pageTitle }}</h4>
                </div>
            </div>

            <!-- Profile Menu -->
            <div class="d-flex align-items-center gap-2">
                <button v-if="route.name == 'tickets'" type="button" data-bs-toggle="offcanvas" data-bs-target="#searchOC" aria-controls="searchOC">
                    <img :src="gs_search" alt="GS Search" />
                </button>

                <div class="position-relative p-menu">
                    <button @click="showProfileMenu = !showProfileMenu" class="btn d-inline-flex align-items-center">
                        <div class="profile-badge small position-relative">
                            <span>{{ user ? user?.fullname?.split('')[0] : '' }}</span>
                            <span class="u-status" :class="{ 'connected': store.connected }"></span>
                        </div>
                        <ChevronDown style="font-size: 25px;" />
                    </button>
                    <div v-if="user != null" class="profile-menu" :class="{ 'show': showProfileMenu }" @click.self="showProfileMenu = !showProfileMenu">
                        <div>
                            <div class="px-3">
                                <div class="font-weight-bold fw-bold">{{ user?.fullname }}</div>
                                <div class="text-muted">{{ cropLeadingDigits(user?.phone) }}</div>
                            </div>
                            <hr>
                            <div>
                                <button :disabled="isProcessing" @click="logout($event)" class="btn text-info2 font-weight-bold fw-bold py-0">
                                    {{ !isProcessing ? "Déconnexion" : "..." }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Menu -->
        <div class="menu-content" :class="{ show: menuOpen }" @click.self="toggleMenu($event)">
            <div class="menu-content-body px-4 py-5 bg-white">
                <div v-if="user != null" class="m-profile d-flex align-items-center border-bottom gap-2 pb-3 mb-3">
                    <div class="profile-badge position-relative">
                        <span>{{ user ? user?.fullname?.split('')[0] : '' }}</span>
                        <span class="u-status" :class="{ 'connected': store.connected }"></span>
                    </div>
                    <div>
                        <div class="fw-bold">{{ user?.fullname }}</div>
                        <div class="text-muted">{{ cropLeadingDigits(user?.phone) }}</div>
                    </div>
                </div>

                <div class="menu-list">
                    <router-link @click="toggleMenu($event)" :to="{ name: 'dashboard' }" class="d-flex align-items-center gap-2 mb-3 text-muted">
                        <div><HomeOutline style="font-size: 30px;" /></div>
                        <div class="fs-6">Accueil</div>
                    </router-link>
                    
                    <router-link @click="toggleMenu($event)" :to="{ name: 'tickets' }" class="d-flex align-items-center gap-2 mb-3 text-muted">
                        <div><ArchiveOutline style="font-size: 30px;" /></div>
                        <div class="fs-6">Tickets</div>
                    </router-link>
                    
                    <router-link @click="toggleMenu($event)" :to="{ name: 'statistics' }" class="d-flex align-items-center gap-2 mb-3 text-muted">
                        <div><TrendingUp style="font-size: 30px;" /></div>
                        <div class="fs-6">Statistiques</div>
                    </router-link>
                    
                    <router-link @click="toggleMenu($event)" :to="{ name: 'profile' }" class="d-flex align-items-center gap-2 mb-3 text-muted">
                        <div><AccountOutline style="font-size: 30px;" /></div>
                        <div class="fs-6">Mon compte</div>
                    </router-link>
                    
                    <router-link @click.prevent="($event) => { toggleMenu($event); logout($event) }" :to="{ name: 'profile' }" class="d-flex align-items-center gap-2 mb-3 text-muted">
                        <div><AccountArrowLeftOutline style="font-size: 30px;" /></div>
                        <div class="fs-6">Déconnexion</div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
header {
    padding: 0 20px;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 70px;
    z-index: 9999;
    background: #03045E;
    color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
}

header h4 {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
header button {
    background: none;
    border: none;
}
.menu-content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.60);
    opacity: 0;
    pointer-events: none;
    z-index: 999999;
    transition: .2s;
}
.menu-content.show {
    opacity: 1;
    pointer-events: all;
}
.menu-content .menu-content-body {
    width: 80%;
    height: 100%;
    overflow: auto;
    transform: translateX(-100%);
    transition: .4s;
}
.menu-content.show .menu-content-body {
    transform: translateX(0);
}

.profile-badge {
    background-color: #00678F;
    color: white;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    border-radius: 50%;
}
.profile-badge.small {
    width: 30px;
    height: 30px;
    font-size: 18px;
}

.p-menu {
    display: none;
}


@media (min-width: 993px) {
    .menu-content {
        z-index: 99;
        background: none;
    }
    .menu-content .menu-content-body {
        max-width: 250px;
    }
    .m-profile {
        display: none !important;
    }
    .menu-list {
        margin-top: 60px;
    }

    .p-menu {
        display: initial;
    }
    .profile-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        opacity: 0;
        pointer-events: none;
        background-color: #00000000;
        z-index: 999;
    }
    .profile-menu>div {
        position: absolute;
        right: 30px;
        top: 65px;
        width: max-content;
        border-radius: 8px;
        background-color: white;
        padding: 10px 0;
        box-shadow: 0px 0px 15px #00000022;
        z-index: 9999;
    }
    .profile-menu>div::before {
        width: 15px;
        height: 15px;
        content: "";
        position: absolute;
        top: 0;
        right: 18px;
        background-color: white;
        transform: rotateZ(45deg) translateY(-55%);
    }
    .profile-menu.show {
        opacity: 1;
        pointer-events: all;
        transition: .5s;
    }
}
</style>