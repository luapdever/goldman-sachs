<script setup>

import TheMachine from './TheMachine.vue';
import BaseOffcanvas from '../base/BaseOffcanvas.vue';
import no_result from '../../assets/img/no-result.svg';
import { ChevronLeft, ChevronRight } from 'mdue';

</script>

<template>
  <div>
    <div v-if="is_processing" class="w-100 py-4 d-flex justify-content-center align-items-center">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="machines.length == 0" class="w-100 d-flex justify-content-center align-items-center">
      <div class="text-center">
        <img :src="no_result" alt="No result">
        <p class="fw-bold text-muted m-0 p-0">Aucun investissement trouvé pour le moment.</p>
      </div>
    </div>

    <div class="row m-0 p-0">
      <router-link 
        v-for="(machine, index) in machines"
        :key="'Machine' + index"
        :to="!(windowWidth > 768) ? { name: 'single-machine', params: { machine_id: machine.id }, hash: '#details' } : '#'+ machine.id + '-details'"
        :replace="windowWidth > 768"
        @click="!(windowWidth > 768) ? null :view_machine(machine.id)"
        :id="'machine_el_'+machine.id"
      >
        <TheMachine
          :machine="machine"
          :is_new="is_new_machine(machine, index) && !['closed', 'cancelled'].includes(machine.status)"
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
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
  components: {  },
  props: {
    machines: Array,
    machineListId: String,
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
      cur_machine: null,
      current_machine: null,
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

    this.show_hash_machine();

    this.$router.afterEach((to, from) => {
      this.show_hash_machine();
    });
  },
  watch: {
    cur_machine(newVal, oldVal) {
      if(this.windowWidth > 768) {
        if(oldVal == null && newVal != null) {
          let oc_el = document.getElementById('singleMachine_'+this.machineListId);
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
      //     "<strong>Message Machine #"+ data.machine_id + "</strong> \n" + this.html_encode(this.text_truncate(data.content, 30)), 
      //     {
      //       dangerouslyHTMLString: true,
      //       onClick: (event) => {
      //         if(this.windowWidth > 768) {
      //           this.$router.replace({ name: 'machines', hash: '#'+ data.machine_id + '-discussion' });
      //         } else {
      //           this.$router.push({ name: 'single-machine', params: { machine_id: data.machine_id }, hash: '#details' });
      //         }
      //       }
      //     }
      //   );
      // });
      
      store.socket?.on("TICKET_CLOSED", (data) => {
        toast.info(
          "<strong>Machine #"+ data.id + "</strong> \n Machine fermé.", 
          {
            dangerouslyHTMLString: true,
            onClick: (event) => {
              if(this.windowWidth > 768) {
                this.$router.replace({ name: 'machines', hash: '#'+ data.id + '-details' });
              } else {
                this.$router.push({ name: 'single-machine', params: { machine_id: data.id }, hash: '#details' });
              }
            }
          }
        );
      });
      store.socket?.on("TICKET_STATUS_UPDATED", (data) => {
        toast.info(
          "<strong>Machine #"+ data.id + "</strong> \n Statut de machine mis à jour.", 
          {
            dangerouslyHTMLString: true,
            onClick: (event) => {
              if(this.windowWidth > 768) {
                this.$router.replace({ name: 'machines', hash: '#'+ data.id + '-details' });
              } else {
                this.$router.push({ name: 'single-machine', params: { machine_id: data.id }, hash: '#details' });
              }
            }
          }
        );
      });
    },
    onResize() {
      this.windowWidth = window.innerWidth
    },
    is_new_machine(machine, index) {
      let is_new = !this.unanimated.includes(machine.id) && (new Date(machine.created_date)).getTime() - ((new Date()).getTime() - 60000*5) > 0;

      if(is_new) {
        setTimeout(() => {
          this.unanimated.push(machine.id);
        }, 60000*5)
      }

      return is_new
    },
    view_machine(machine_id) {
      // this.unanimated.push(machine.id);
      this.cur_machine = machine_id;
    },
    show_hash_machine() {
      if(this.windowWidth > 768) {
        if(this.$route.hash && this.$route.hash.includes('-')) {
          let t_id = this.$route.hash.split('-')[0].split('#')[1];
          this.view_machine(t_id);
        }
      }
    },
    load_machine_details() {
      let ajax_config = {
        url: this.make_ajax_url('/machines/get-details', 9001),
        type: 'POST',
        max_retry: 2,
        data: {
          machine_id: this.cur_machine,
        }
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.load_in_processing = false;
        
        if (!_.isUndefined(response) && !_.isUndefined(response.machine)) {
          this.current_machine = response.machine;
        } else if(!_.isUndefined(response.error)) {
          this.current_machine = null;
        }
      })
    },
    handle_hidden() {
      this.$router.replace('#');
      this.cur_machine = null;
      this.current_machine = null;
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