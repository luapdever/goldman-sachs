<script setup>
import TheSection from '../components/global/TheSection.vue'

import TheTicketsList from '../components/tickets/TheTicketsList.vue'
import TicketSummary from '../components/tickets/TicketSummary.vue'
import UnreadCount from '../components/tickets/UnreadCount.vue'
</script>

<template>
  <div class="dash-b">
    <main-layout>
      <div class="px-4 py-1 mb-5">
        <unread-count />
        
        <ticket-summary />
        
        <TheSection :title="'En attente ' + (pagination && pagination.count != 0 ? '(' + pagination.count + ')' : '')"
          title-muted
        >
          <the-tickets-list
            :tickets="pending_tickets"
            :page="pagination.page" 
            :count="pagination.count" 
            :size="pagination.size" 
            @change-page="(page) => { pagination.page = page; get_pending_tickets(true) }" 
            :is_processing="is_processing"
            ticketListId="for_dash"
          ></the-tickets-list>
        </TheSection>
      </div>
    </main-layout>
  </div>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {
      pagination: {
        page: 0,
        count: 0,
        size: 1000,
      },
      summary: {
        new: 0,
        opened: 0,
        pending: 0,
        cancelled: 0,
        closed: 0
      },
      is_processing: false
    }
  },
  computed: {
    pending_tickets() {
      return store.pending_tickets;
    }
  },
  mounted() {
    // this.get_statistics()
    this.get_pending_tickets()
  },
  methods: {
    // get_statistics() {
    //   let ajax_config = {
    //     url: this.make_ajax_url('/analytics/tickets-summary', 9001),
    //     type: 'POST',
    //     max_retry: 2,
    //     data: {}
    //   }

    //   this.utils_async_ajax(ajax_config, (status, response) => {
    //     if (_.isUndefined(response.error)) {
    //       this.summary = { ...response }
    //     }
    //   })
    // },
    get_pending_tickets(from_filter = false) {
      this.is_processing = true

      let flter_data = {};

        /* Filter options */
        if(from_filter) {
          flter_data = { ...flter_data, ...this.pagination };
        }

        flter_data.size = this.pagination.size

      let ajax_config = {
        url: this.make_ajax_url('/tickets/get-list', 9001),
        type: 'POST',
        max_retry: 2,
        data: {
          status: 'new',
          status: ['new', 'pending'],
          ...flter_data,
        }
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.is_processing = false

        if (_.isUndefined(response.error)) {
          store.pending_tickets = response.content ?? []
          this.pagination.count = parseInt(response.totalElements ?? 0)
          this.pagination.page = parseInt(response.current ?? 0)
        } else if (!_.isUndefined(response.error)) {
          store.pending_tickets = []
        }
      })
    }
  },
  components: { TheSection, TheTicketsList, TicketSummary, UnreadCount }
}
</script>
