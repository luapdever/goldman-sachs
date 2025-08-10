<script setup>
import BaseCard from '../base/BaseCard.vue'
import { Information } from 'mdue'
</script>

<template>
  <div>
    <div v-if="unread_count.chat_count" class="mt-3">
      <base-card animated class="count-ctn">
        <div class="d-flex align-items-center gap-2">
          <Information style="font-size: 25px; color: crimson;" />
          <span>
            Vous avez {{ unread_count.unread_messages_count ?? 0 }} message{{ unread_count.unread_messages_count > 1 ? 's ' : ' ' }} 
            non lu{{ unread_count.unread_messages_count > 1 ? 's ' : ' ' }} de {{ unread_count.chat_count ?? 0 }} conversation{{ unread_count.chat_count > 1 ? 's' : '' }}
          </span>
        </div>
      </base-card>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {
      unread_count: {}
    }
  },
  mounted() {
    this.get_unread_count();
    this.chat_event_handlers();
  },
  methods: {
    chat_event_handlers() {
      // store.socket.on("NEW_TICKET_CHAT_MESSAGE", (data) => {
      //   this.get_unread_count();
      // });
    },
    get_unread_count() {
      let ajax_config = {
        url: this.make_ajax_url('/chat/unread-count', 9001),
        type: 'GET',
        max_retry: 2,
        data: {}
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        if (_.isUndefined(response.error)) {
          this.unread_count = { ...response }
        }
      })
    }
  }
}
</script>

<style scoped>
.count-ctn {
  border-left: 8px solid crimson;
  border-radius: 2px;
}
</style>
