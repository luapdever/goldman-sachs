<script setup>
import { MessageText } from 'mdue'
</script>

<template>
    <div type="button" class="col-12 mb-1 p-0">
        <base-card :extraClass="{ 'card-new': is_new }" :animated="is_new">
            <div class="o-ticket">
                <div>
                    <h4 class="text-info2">#{{ ticket.id }}</h4>
                    
                    <p>{{ !isEmpty(ticket.msisdn) ? crop_leading_ligits(ticket.msisdn) : "Inconnu" }}</p>
                    <p class="text-muted ticket-date">{{ moment_datetime_format(ticket.created_date, "DD MMMM YYYY . HH:mm") }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <base-badge color="x" outline style="font-size: 12px; padding: 5px !important; width: 150px; text-align: center;">
                            <span class="px-1">{{ get_category(ticket.category) ? get_category(ticket.category).title : 'Inconnu' }}</span>
                        </base-badge>
                    </div>
                </div>
                <div>
                    <div class="text-center">
                        <base-badge v-if="ticket.public_status && ticket.status == 'closed'" :color="ticket.public_status == 'success' ? 1 : 3" style="width: 85px; font-size: 12px; padding: 5px !important;">
                            <span class="px-1">{{ ticket.public_status == 'success' ? "Succès" : "Echec" }}</span>
                        </base-badge>
                        <base-badge v-else :color="status[ticket.status] ? status[ticket.status].color : 1" style="width: 85px; font-size: 12px; padding: 5px !important;">
                            <span class="px-1">{{ status[ticket.status] ? status[ticket.status].label : status.pending.label }}</span>
                        </base-badge>
                    </div>

                    <!-- <router-link :to="!(windowWidth > 768) ? { name: 'single-ticket', params: { ticket_id: ticket.id }, hash: '#discussion' } : '#'+ ticket.id + '-discussion'">
                        <base-badge circle class="message-badge" :class="{ 'muted': !ticket.unread_messages_count || ticket.unread_messages_count == 0 }">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 14.25C13.3282 14.25 14.7427 14.25 15.621 13.371C16.5 12.4927 16.5 11.0782 16.5 8.25C16.5 5.42175 16.5 4.00725 15.621 3.129C14.7427 2.25 13.3282 2.25 10.5 2.25H7.5C4.67175 2.25 3.25725 2.25 2.379 3.129C1.5 4.00725 1.5 5.42175 1.5 8.25C1.5 11.0782 1.5 12.4927 2.379 13.371C2.86875 13.8615 3.525 14.0783 4.5 14.1735" stroke="inherit" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.00006 8.25V8.2575M6.00006 8.25V8.2575M12.0001 8.25V8.2575M10.5001 14.25C9.57306 14.25 8.55156 14.625 7.61931 15.1088C6.12081 15.8865 5.37156 16.2758 5.00256 16.0275C4.63356 15.78 4.70331 15.0112 4.84356 13.4745L4.87506 13.125" stroke="inherit" stroke-width="1.6" stroke-linecap="round"/>
                            </svg>
        
                            <span v-if="ticket.unread_messages_count && ticket.unread_messages_count > 0">
                                {{ ticket.unread_messages_count > 99 ? '+99' : ticket.unread_messages_count }}
                            </span>
                        </base-badge>
                    </router-link> -->
                </div>
            </div>
        </base-card>
    </div>
</template>

<script>
export default {
    props: {
        ticket: Object,
        is_new: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            windowWidth: window.innerWidth
        }
    },
    computed: {
        status() {
            return store.status_types;
        },
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        });
    },
    methods: {
        get_category(category_id) {
            let category = store.categories_list.find((cat) => cat.id == category_id);

            return category;
        },
        onResize() {
            this.windowWidth = window.innerWidth
        },
    },
    beforeUnmount() { 
        window.removeEventListener('resize', this.onResize); 
    },
}
</script>

<style scoped>
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

.o-ticket {
    display: flex;
    justify-content: space-between;
}
.o-ticket>div:nth-child(2) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
}

@media screen and (min-width: 993px) {
    .o-ticket {
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .o-ticket>div:nth-child(1) {
        width: 85%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
    }
    .o-ticket>div:nth-child(1)>* {
        width: 18%;
    }
    .o-ticket>div:nth-child(1)>.ticket-date {
        width: 25%;
    }
    .o-ticket>div:nth-child(1)>div {
        width: 25%;
    }
    .o-ticket>div:nth-child(1) p {
        margin-bottom: 0;
    }
    .o-ticket>div:nth-child(2) {
        width: 10%;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }
    .o-ticket>div:nth-child(2)>* {
        width: 45%;
    }
    .o-ticket>div:nth-child(2)>*:nth-child(2) {
        text-align: right;
    }
}

@media screen and (min-width: 993px) and (max-width: 1200px) {
    .o-ticket>div:nth-child(1) {
        width: 80%;
    }
    .o-ticket>div:nth-child(2) {
        width: 15%;
    }
}
</style>