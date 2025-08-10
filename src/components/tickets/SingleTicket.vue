<script setup>

import TheTicketDetailsTable from './TheTicketDetailsTable.vue';
import TheTicketDiscussion from './TheTicketDiscussion.vue';
import no_result from '../../assets/img/no-result.svg';

</script>

<template>
  <div>
      <div v-if="ticket">
        <div class="tabs">
          <div :class="{ 'active': cur_tab == 'details' }" @click="cur_tab = 'details'">
            Détails
          </div>
          <!-- <div class="d-flex justify-content-center align-items-center gap-2" :class="{ 'active': cur_tab == 'discussion' }" @click="cur_tab = 'discussion'">
            <span>Discussion</span>
            <span v-if="unread_messages_count && unread_messages_count > 0" class="badge badge-danger">{{ unread_messages_count }}</span>
          </div> -->
        </div>
        <div class="tabs-content">
          <transition name="fade">
            <div v-if="cur_tab == 'details'">
              <TheTicketDetailsTable :ticket="ticket" />
            </div>
          </transition>
          <transition name="fade">
            <div v-if="cur_tab == 'discussion'">
              <TheTicketDiscussion :ticket="ticket" />
            </div>
          </transition>
        </div>
      </div>
      <div v-else class="text-center w-100 vh-100 d-flex justify-content-center align-items-center">
        <div>
          <img :src="no_result" alt="No result">
          <p class="text-muted text-center p-4">Aucun ticket trouvé pour ce numéro.</p>
        </div>
      </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
    mounted() {
      this.cur_tab = this.$route.hash.includes('discussion') ? 'discussion' : 'details';
      this.unread_messages_count = this.ticket.unread_messages_count ?? 0
      this.chat_event_handlers()
    },
    props: {
      ticket: Object,
    },
    data() {
      return {
        cur_tab: "details",
        unread_messages_count: 0,
        filter_data: {
          category: "",
          status: "",
          date: "",
        },
      };
    },
    watch: {
      cur_tab(newVal, oldVal) {
        this.$router.replace('#'+ this.ticket.id + '-'+newVal);

        if(newVal == 'discussion') {
          this.unread_messages_count = 0;

          let ajax_config = {
            url: this.make_ajax_url('/chat/mark-as-read', 3000),
            type: 'POST',
            max_retry: 2,
            data: {
              ticket_id: this.ticket.id,
            },
            show_error: false,
            show_remote_error: false,
          }

          this.utils_async_ajax(ajax_config, (status, response) => {});
        }
      }
    },
    methods: {
      chat_event_handlers() {
        // store.socket.on("NEW_TICKET_CHAT_MESSAGE", (data) => {          
        //   if(data.ticket_id == this.ticket.id) {
        //     if(this.cur_tab != 'discussion') {
        //       this.unread_messages_count += 1;
        //     } else {
        //       this.unread_messages_count = 0;
        //     }
        //   } else {
        //     toast.info(data.content);
        //   }
        // });
      },
    },
    components: { TheTicketDetailsTable, TheTicketDiscussion }
}
</script>

<style scoped>
.tabs {
  display: flex;
  align-items: stretch;
}
.tabs>div {
  width: 50%;
  width: 100%;
  text-align: center;
  padding: 20px 8px;
  border-bottom: 3px solid #eee;
  cursor: pointer;
  transition: .2s;
}
.tabs>div.active {
  border-bottom: 3px solid #000;
  font-weight: bold;
}
</style>