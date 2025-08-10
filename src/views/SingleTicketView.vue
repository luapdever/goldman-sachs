<script setup>
import SingleTicket from '../components/machines/SingleTicket.vue'

</script>

<template>
  <div>
    <main-layout white>
      <div class="">
        <div v-if="load_in_processing" class="w-100 h-100 d-flex justify-content-center align-items-center">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        <div v-else>
          <single-ticket :ticket="ticket"></single-ticket>
        </div>
      </div>
    </main-layout>
  </div>
</template>

<script>
export default {
  components: { SingleTicket },
  mounted() {},
  data() {
    return {
      ticket: null,
      load_in_processing: true,
    }
  },

  mounted() {
    this.$store.commit("set_page_title", "Ticket #" + this.$route.params.ticket_id);
    this.load_ticket_details();
  },

  methods: {
    load_ticket_details() {
      this.load_in_processing = true;
      let ajax_config = {
        url: this.make_ajax_url('/machines/get-details', 9001),
        type: 'POST',
        max_retry: 2,
        data: {
          ticket_id: this.$route.params.ticket_id,
        }
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.load_in_processing = false;
        
        if (!_.isUndefined(response) && !_.isUndefined(response.ticket)) {
          this.ticket = response.ticket;
        } else if(!_.isUndefined(response.error)) {
          this.ticket = null;
        }
      })
    },
  },
}
</script>
