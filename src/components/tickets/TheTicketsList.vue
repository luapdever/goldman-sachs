<script setup>

import TheTicket from './TheTicket.vue';
import BaseOffcanvas from '../base/BaseOffcanvas.vue';
import SingleTicket from './SingleTicket.vue';
import no_result from '../../assets/img/no-result.svg';
import { ChevronLeft, ChevronRight } from 'mdue';

</script>

<template>
  <div>
    <div v-if="is_processing" class="w-100 py-4 d-flex justify-content-center align-items-center">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="tickets.length == 0" class="w-100 d-flex justify-content-center align-items-center">
      <div class="text-center">
        <img :src="no_result" alt="No result">
        <p class="fw-bold text-muted m-0 p-0">Aucun ticket trouvé pour le moment.</p>
      </div>
    </div>

    <div class="row m-0 p-0">
      <router-link 
        v-for="(ticket, index) in tickets"
        :key="'Ticket' + index"
        :to="!(windowWidth > 768) ? { name: 'single-ticket', params: { ticket_id: ticket.id }, hash: '#details' } : '#'+ ticket.id + '-details'"
        :replace="windowWidth > 768"
        @click="!(windowWidth > 768) ? null :view_ticket(ticket.id)"
        :id="'ticket_el_'+ticket.id"
      >
        <TheTicket
          :ticket="ticket"
          :is_new="is_new_ticket(ticket, index) && !['closed', 'cancelled'].includes(ticket.status)"
        />
      </router-link>

      <div v-if="!is_processing && count && count > (size ?? 10) && !no_pagination" class="mt-2 d-flex justify-content-end align-items-center gap-3">
        <button :disabled="page == 0" class="btn btn-light pagination-btn" @click="($event) => $emit('change-page', page - 1)">
          <ChevronLeft style="font-size: 21px;" />
        </button>

        <div>Page {{ parseInt(page)+1 }}/{{ Math.ceil((count ?? 10)/size) }}</div>

        <button :disabled="page == Math.ceil((count ?? 10)/size) - 1" class="btn btn-light pagination-btn" @click="($event) => $emit('change-page', page + 1)">
          <ChevronRight style="font-size: 21px;" />
        </button>
      </div>
    </div>
    
    <BaseOffcanvas fullscreen position="end" :oc-id="'singleTicket_'+ticketListId" @onShown="load_ticket_details()" @onHidden="handle_hidden()">
      <template v-slot:oc-header>
        <h3>Ticket <span v-if="cur_ticket != null">#{{ cur_ticket }}</span></h3>
      </template>
      <template v-slot:oc-body>
        <div v-if="load_in_processing" class="w-100 h-100 d-flex justify-content-center align-items-center">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        <div v-else>
          <single-ticket :ticket="current_ticket"></single-ticket>
        </div>
      </template>
    </BaseOffcanvas>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
  components: { SingleTicket },
  props: {
    tickets: Array,
    ticketListId: String,
    is_processing: Boolean,
    no_pagination: {
      type: Boolean,
      default: false,
    },
    page: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 10,
    },
    count: {
      type: Number,
    },
  },
  data() {
    return {
      cur_ticket: null,
      current_ticket: null,
      load_in_processing: true,
      unanimated: [],
      windowWidth: window.innerWidth
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });

    // this.chat_event_handlers();

    this.show_hash_ticket();

    this.$router.afterEach((to, from) => {
      this.show_hash_ticket();
    });
  },
  watch: {
    cur_ticket(newVal, oldVal) {
      if(this.windowWidth > 768) {
        if(oldVal == null && newVal != null) {
          let oc_el = document.getElementById('singleTicket_'+this.ticketListId);
          let bs_oc = new bootstrap.Offcanvas(oc_el);
          bs_oc.show();
        }
      }
    }
  },
  methods: {
    chat_event_handlers() {
      // store.socket.on("NEW_TICKET_CHAT_MESSAGE", (data) => {
      //   toast.info(
      //     "<strong>Message Ticket #"+ data.ticket_id + "</strong> \n" + this.html_encode(this.text_truncate(data.content, 30)), 
      //     {
      //       dangerouslyHTMLString: true,
      //       onClick: (event) => {
      //         if(this.windowWidth > 768) {
      //           this.$router.replace({ name: 'tickets', hash: '#'+ data.ticket_id + '-discussion' });
      //         } else {
      //           this.$router.push({ name: 'single-ticket', params: { ticket_id: data.ticket_id }, hash: '#details' });
      //         }
      //       }
      //     }
      //   );
      // });
      
      store.socket?.on("TICKET_CLOSED", (data) => {
        toast.info(
          "<strong>Ticket #"+ data.id + "</strong> \n Ticket fermé.", 
          {
            dangerouslyHTMLString: true,
            onClick: (event) => {
              if(this.windowWidth > 768) {
                this.$router.replace({ name: 'tickets', hash: '#'+ data.id + '-details' });
              } else {
                this.$router.push({ name: 'single-ticket', params: { ticket_id: data.id }, hash: '#details' });
              }
            }
          }
        );
      });
      store.socket?.on("TICKET_STATUS_UPDATED", (data) => {
        toast.info(
          "<strong>Ticket #"+ data.id + "</strong> \n Statut de ticket mis à jour.", 
          {
            dangerouslyHTMLString: true,
            onClick: (event) => {
              if(this.windowWidth > 768) {
                this.$router.replace({ name: 'tickets', hash: '#'+ data.id + '-details' });
              } else {
                this.$router.push({ name: 'single-ticket', params: { ticket_id: data.id }, hash: '#details' });
              }
            }
          }
        );
      });
    },
    onResize() {
      this.windowWidth = window.innerWidth
    },
    is_new_ticket(ticket, index) {
      let is_new = !this.unanimated.includes(ticket.id) && (new Date(ticket.created_date)).getTime() - ((new Date()).getTime() - 60000*5) > 0;

      if(is_new) {
        setTimeout(() => {
          this.unanimated.push(ticket.id);
        }, 60000*5)
      }

      return is_new
    },
    view_ticket(ticket_id) {
      // this.unanimated.push(ticket.id);
      this.cur_ticket = ticket_id;
    },
    show_hash_ticket() {
      if(this.windowWidth > 768) {
        if(this.$route.hash && this.$route.hash.includes('-')) {
          let t_id = this.$route.hash.split('-')[0].split('#')[1];
          this.view_ticket(t_id);
        }
      }
    },
    load_ticket_details() {
      let ajax_config = {
        url: this.make_ajax_url('/tickets/get-details', 9001),
        type: 'POST',
        max_retry: 2,
        data: {
          ticket_id: this.cur_ticket,
        }
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.load_in_processing = false;
        
        if (!_.isUndefined(response) && !_.isUndefined(response.ticket)) {
          this.current_ticket = response.ticket;
        } else if(!_.isUndefined(response.error)) {
          this.current_ticket = null;
        }
      })
    },
    handle_hidden() {
      this.$router.replace('#');
      this.cur_ticket = null;
      this.current_ticket = null;
      this.load_in_processing = true;
    },
  },
  beforeUnmount() { 
    window.removeEventListener('resize', this.onResize); 
  },
}
</script>

<style scoped>
.row>* {
  box-sizing: border-box;
  padding: 0 !important;
}
.pagination-btn {
  background-color: white !important;
  box-shadow: 0 0 5px #00000011 !important;
}
.pagination-btn[disabled] {
  background-color: #efefef !important;
  box-shadow: none !important;
}
</style>