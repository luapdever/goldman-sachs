<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useMainStore } from '@/stores'
import { useAppUtils } from '@/composables/useAppUtils'

const props = defineProps({
  machine: { type: Object, required: true },
  is_new: { type: Boolean, default: false }
})

const store = useMainStore()
const appUtils = useAppUtils()

const windowWidth = ref(window.innerWidth)

function onResize() {
  windowWidth.value = window.innerWidth
}

function get_category(category_id) {
  const category = store.machines_list.find((cat) => cat.id == category_id)
  return category
}

const status = store.status_types

onMounted(() => {
  nextTick(() => {
    window.addEventListener('resize', onResize)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
    <div type="button" class="col-12 mb-1 p-0">
        <base-card :extraClass="{ 'card-new': is_new }" :animated="is_new">
            <div class="o-machine">
                <div>
                    <h4 class="text-info2">{{ machine.label ?? 'Inconnu' }}</h4>
                    
                    <p>{{ machine.rate ?? 0 }}%</p>
                    <p class="text-muted machine-date">{{ appUtils.momentDatetimeFormat(machine.created_date, "DD MMMM YYYY") }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <img :src="machine?.image?.url" alt="Machine image" class="mb-1 img-fluid img-thumbnail machine-image">
                    </div>
                </div>
                <div>
                    <div class="text-center">
                        <base-badge :color="status['closed'] ? status['closed'].color : 1" style="width: 85px; font-size: 12px; padding: 5px !important;">
                            <span class="px-1">Disponible</span>
                        </base-badge>
                    </div>

                    <!-- <router-link :to="!(windowWidth > 768) ? { name: 'single-machine', params: { machine_id: machine.id }, hash: '#discussion' } : '#'+ machine.id + '-discussion'">
                        <base-badge circle class="message-badge" :class="{ 'muted': !machine.unread_messages_count || machine.unread_messages_count == 0 }">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 14.25C13.3282 14.25 14.7427 14.25 15.621 13.371C16.5 12.4927 16.5 11.0782 16.5 8.25C16.5 5.42175 16.5 4.00725 15.621 3.129C14.7427 2.25 13.3282 2.25 10.5 2.25H7.5C4.67175 2.25 3.25725 2.25 2.379 3.129C1.5 4.00725 1.5 5.42175 1.5 8.25C1.5 11.0782 1.5 12.4927 2.379 13.371C2.86875 13.8615 3.525 14.0783 4.5 14.1735" stroke="inherit" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.00006 8.25V8.2575M6.00006 8.25V8.2575M12.0001 8.25V8.2575M10.5001 14.25C9.57306 14.25 8.55156 14.625 7.61931 15.1088C6.12081 15.8865 5.37156 16.2758 5.00256 16.0275C4.63356 15.78 4.70331 15.0112 4.84356 13.4745L4.87506 13.125" stroke="inherit" stroke-width="1.6" stroke-linecap="round"/>
                            </svg>
        
                            <span v-if="machine.unread_messages_count && machine.unread_messages_count > 0">
                                {{ machine.unread_messages_count > 99 ? '+99' : machine.unread_messages_count }}
                            </span>
                        </base-badge>
                    </router-link> -->
                </div>
            </div>
        </base-card>
    </div>
</template>

<style scoped>
.machine-image {
    width: 50px;
    height: 40px;
    object-fit: cover;
}
.message-badge {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    padding: 5px !important;
    position: relative;
    color: black;
    stroke: black;
}
.message-badge.muted {
    color: #999;
    stroke: #999;
}
.message-badge>span {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 10px;
    font-weight: bold;
    width: 20px;
    height: 20px;
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #D81822;
    color: white;
}

.o-machine {
    display: flex;
    justify-content: space-between;
}
.o-machine>div:nth-child(2) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
}

@media screen and (min-width: 993px) {
    .o-machine {
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .o-machine>div:nth-child(1) {
        width: 85%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
    }
    .o-machine>div:nth-child(1)>* {
        width: 18%;
    }
    .o-machine>div:nth-child(1)>.machine-date {
        width: 25%;
    }
    .o-machine>div:nth-child(1)>div {
        width: 25%;
    }
    .o-machine>div:nth-child(1) p {
        margin-bottom: 0;
    }
    .o-machine>div:nth-child(2) {
        width: 10%;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }
    .o-machine>div:nth-child(2)>* {
        width: 45%;
    }
    .o-machine>div:nth-child(2)>*:nth-child(2) {
        text-align: right;
    }
}

@media screen and (min-width: 993px) and (max-width: 1200px) {
    .o-machine>div:nth-child(1) {
        width: 80%;
    }
    .o-machine>div:nth-child(2) {
        width: 15%;
    }
}
</style>