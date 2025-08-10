<script setup>
import no_result from '../../assets/img/no-result.svg'
import BaseOffcanvas from '../base/BaseOffcanvas.vue'
import TheTicketsList from '../machines/TheMachinesList.vue'
</script>

<template>
  <div>
    <BaseOffcanvas fullscreen headerLight position="end" oc-id="searchOC" @onShown="focus_input($event)">
      <template v-slot:oc-header>
        <form class="w-100">
          <input id="search_input" type="search" v-model="search" @input="search_machines($event)" class="form-control search-input" />
        </form>
      </template>
      <template v-slot:oc-body>
        <div v-if="!search || (!machines)" class="px-2 d-flex justify-content-center align-items-center">
          <div class="text-center">
            <img :src="no_result" alt="No result">
            <p class="fw-bold d-none">Aucun élément trouvé, veuillez effectuer votre recherche par mot clé, ou par un numéro</p>
          </div>
        </div>

        <div v-else class="p-3">
          <the-machines-list :machines="machines" :is_processing="is_processing" ticketListId="for_search"></the-machines-list>
        </div>
      </template>
    </BaseOffcanvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      machines: [],
      search: "",
      is_processing: false,
      timeout_timer: setTimeout(() => {}, 0),
    }
  },
  mounted() {},
  methods: {
    search_machines() {
      clearTimeout(this.timeout_timer);

      this.machines = [];
      if(this.search && this.search.trim()) {
        this.is_processing = true;
      } else {
        return;
      }

      this.timeout_timer = setTimeout(() => {
        this.get_filtered_machines();
      }, 800);
    },
    get_filtered_machines() {
      this.is_processing = true;

      let ajax_config = {
        url: this.make_ajax_url('/machines/search', 9001),
        type: 'POST',
        max_retry: 2,
        data: {
          search: this.search.trim(),
        }
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.is_processing = false;
        
        if (!_.isUndefined(response) && _.isArray(response)) {
          this.machines = response
        } else if(!_.isUndefined(response.error)) {
          this.machines = []
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
