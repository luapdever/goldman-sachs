<script setup>
import no_result from '../../assets/img/no-result.svg'
import BaseOffcanvas from '../base/BaseOffcanvas.vue'
import TheTicketsList from '../tickets/TheTicketsList.vue'
</script>

<template>
  <div>
    <BaseOffcanvas fullscreen headerLight position="end" oc-id="searchOC" @onShown="focus_input($event)">
      <template v-slot:oc-header>
        <form class="w-100">
          <input id="search_input" type="search" v-model="search" @input="search_tickets($event)" class="form-control search-input" />
        </form>
      </template>
      <template v-slot:oc-body>
        <div v-if="!search || (!tickets)" class="px-2 d-flex justify-content-center align-items-center">
          <div class="text-center">
            <img :src="no_result" alt="No result">
            <p class="fw-bold d-none">Aucun élément trouvé, veuillez effectuer votre recherche par mot clé, ou par un numéro</p>
          </div>
        </div>

        <div v-else class="p-3">
          <the-tickets-list :tickets="tickets" :is_processing="is_processing" ticketListId="for_search"></the-tickets-list>
        </div>
      </template>
    </BaseOffcanvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tickets: [],
      search: "",
      is_processing: false,
      timeout_timer: setTimeout(() => {}, 0),
    }
  },
  mounted() {},
  methods: {
    search_tickets() {
      clearTimeout(this.timeout_timer);

      this.tickets = [];
      if(this.search && this.search.trim()) {
        this.is_processing = true;
      } else {
        return;
      }

      this.timeout_timer = setTimeout(() => {
        this.get_filtered_tickets();
      }, 800);
    },
    get_filtered_tickets() {
      this.is_processing = true;

      let ajax_config = {
        url: this.make_ajax_url('/tickets/search', 9001),
        type: 'POST',
        max_retry: 2,
        data: {
          search: this.search.trim(),
        }
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.is_processing = false;
        
        if (!_.isUndefined(response) && _.isArray(response)) {
          this.tickets = response
        } else if(!_.isUndefined(response.error)) {
          this.tickets = []
        }
      })
    },
    focus_input() {
      window.jQuery('#search_input').focus();
    }
  },
  components: { BaseOffcanvas, TheTicketsList }
}
</script>

<style scoped>
.search-input {
  width: 100%;
  max-width: 500px;
  background-color: #F3F3F1;
  border: none;
  border-radius: 30px;
  margin-right: 20px;
}
</style>
