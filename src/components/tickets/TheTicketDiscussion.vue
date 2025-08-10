<script setup>
import { Plus, Send, ClockOutline, CloseCircleOutline, Close, MessageAlert } from 'mdue'
</script>

<template>
  <div class="mb-5 p-3 position-relative" id="messageContainer">
    <div v-if="is_loading" class="w-100 py-3 d-flex justify-content-center align-items-center">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="messages.length == 0">
      <p class="text-center p-5">
        <MessageAlert style="font-size: 50px; color: #ccc;" /> <br />
        <span class="text-muted">Aucun message pour le moment. </span>
      </p>
    </div>

    <div v-for="(message, index) in messages" :key="'Message'+index" class="message my-2" :class="{ 'me': message.author == 'external_temp_agent' }">
      <div class="message-content">
        <div v-if="message.type == 'text'">{{ message.content }}</div>
        <a v-if="message.type == 'file'" :href="message.content" target="_blank">
          <object :data="message.content" type=""></object>
        </a>
      </div>
      <div v-if="!message.status" class="text-end">
        <small v-if="!message_statuses[message.external_id]" class="text-info2"><ClockOutline /> En cours</small>
        <small v-else-if="message_statuses[message.external_id] == 'failed'" class="fw-bold text-danger "><CloseCircleOutline /> Non envoyé</small>
        <span v-else>{{ message_timeago(message.created_date) }}</span>
      </div>
      <div 
        v-else-if="(index == messages.length - 1) || (index < messages.length - 1 && message_timeago(message.created_date) != message_timeago(messages[index+1].created_date))" 
        class="message-date text-muted px-2">
        <span>{{ message_timeago(message.created_date) }}</span>
      </div>
    </div>

    <div class="message-form">
      <div class="px-3 py-2 d-flex align-items-end gap-2">
        <div class="pb-1">
          <label for="linked_files">
            <button class="rounded-circle" @click="open_file_pop()">
              <Plus style="font-size: 15px;" />
            </button>
            <base-input class="d-none" name="linked_files" type="file" multiple :allowed_exts="allowed_exts" :accept="accept_ext.join(',')" v-model="linked_files" :field-error="errors.linked_files" />
          </label>
  
        </div>
        <div class="w-100">
          <textarea v-model="message_input" class="form-control" :rows="message_input.split('\n').length"></textarea>
        </div>
        <div>
          <button :disabled="in_sending" class="rounded p-1" @click="send_message($event)">
            <Send v-if="!in_sending" style="font-size: 25px;" />
            <span v-else class="spinner-border text-light" role="status" style="border-width: 2px !important; width: 20px; height: 20px;"></span>
          </button>
        </div>
      </div>
      <div v-if="linked_files.length > 0" class="text-info2 fw-bold px-5 py-2 d-flex flex-wrap gap-2">
        <div class="badge badge-dark px-0 py-3 d-flex align-items-center gap-2" v-for="(file, index) in linked_files" :key="'File'+index">
          <span class="ps-2">{{ file.name }}</span>
          <button class="btn btn-dark p-1 h-auto" @click="($event) => linked_files.splice(index, 1)">
            <Close style="font-size: 15px;" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ticket: Object
  },
  data() {
    return {
      message_input: "",
      linked_files: [],
      allowed_exts: ["png", "jpeg", "jpg", "pdf"],

      message_statuses: {},

      messages: [],
      page: -1,
      size: 15,

      in_sending: false,
      is_loading: false,
    }
  },
  computed: {
    socket() {
      return store.socket;
    },
    user() {
      return store.user;
    },
    accept_ext() {
      let out = this.allowed_exts.map((ext) => "."+ext);

      return out;
    },
  },
  mounted() {
    this.load_messages();
    window.jQuery('#messageContainer')[0].addEventListener('scroll', this.handleScroll);

    this.chat_event_handlers();
  },
  methods: {
    load_messages() {
      this.is_loading = true;
      this.page += 1;

      let ajax_config = {
        url: this.make_ajax_url('/chat/get-messages', 3000),
        type: 'POST',
        max_retry: 2,
        data: {
          ticket_id: this.ticket.id,
          page: this.page,
          size: this.size,
        },
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.is_loading = false;
        
        if (_.isUndefined(response.error)) {
          const scrollOffset = window.jQuery('#messageContainer')[0].scrollTop;

          this.messages.unshift(...response.reverse());

          if(this.page == 0) {
            setTimeout(() => {
              this.scrollToBottom();
            }, 20);
          } else {
            this.$nextTick(() => {
              window.jQuery('#messageContainer')[0].scrollTop = scrollOffset;
            });
          }
        }
      })
    },
    handleScroll() {
      const top = window.jQuery('#messageContainer')[0].scrollTop;
      if (top == 0 && !this.loading) {
        this.load_messages();
      }
    },
    chat_event_handlers() {
      store.socket.on("TICKET_CHAT_MESSAGE_FAILED", (data) => {
        this.message_statuses[data.external_id] = 'failed';
      });
      
      store.socket.on("TICKET_CHAT_MESSAGE_UPDATED", (data) => {
        this.message_statuses[data.external_id] = true;

        let mes_index = this.messages.findIndex((mess) => mess.external_id == data.external_id);

        if(mes_index < 0) {
          return
        }

        this.messages[mes_index] = {
          ...data,
        }
      });

      // store.socket.on("NEW_TICKET_CHAT_MESSAGE", (data) => {
      //   let mes_index = this.messages.findIndex((mess) => mess.external_id == data.external_id);

      //   if(data.ticket_id == this.ticket.id) {
      //     if(mes_index < 0) {
      //       this.messages.push(data)
      //     } else {
      //       this.messages[mes_index] = {
      //         ...data,
      //       }
      //     }
      //   }

      // });
    },
    open_file_pop() {
      window.jQuery('#linked_files').click()
    },
    scrollToBottom() {
      let messageContainer = document.getElementById("messageContainer");
      messageContainer.scrollTop = messageContainer.scrollHeight;
    },
    async send_message(event) {
      if(!this.message_input) {
        return
      }
      event.preventDefault();
      let date = new Date();

      if(this.linked_files.length > 0) {
        this.in_sending = true;
        let responses = await this.upload_linked_files();

        let linked_files_data = [];

        responses.forEach((res) => {
          if(_.isUndefined(res.error) || !res.success) {
            let ext_id = this.uniqid(4);

            linked_files_data.push({
              type: "file",
              content: res.file_url,
              external_id: ext_id,
              ticket_id: this.ticket.id,
              created_date: date.toISOString(),
              author: "external_temp_agent"
            });
          }
        });

        if(linked_files_data.length != responses.length) {
          this.show_alert("danger", "Erreur lors du traitement des fichiers. Veuillez réessayer");
          this.is_loading = false;
          return 
        }

        linked_files_data.forEach((lf_data, ind) => {
          this.messages.push(lf_data)

          store.socket.emit("NEW_TICKET_CHAT_MESSAGE", lf_data);
        });
      }

      let external_id = this.uniqid(4);

      let message_data = {
        type: "text",
        content: this.message_input,
        external_id,
        ticket_id: this.ticket.id,
        created_date: date.toISOString(),
        author: "external_temp_agent"
      };

      this.messages.push(message_data)

      store.socket.emit("NEW_TICKET_CHAT_MESSAGE", message_data);

      setTimeout(() => {
        this.scrollToBottom();
      }, 20);

      this.message_input = "";
      this.linked_files = [];
      this.in_sending = false;
    },
    async upload_linked_files() {
      var self = this
      let requests = this.linked_files.map(async (message_file, index) => {
        
        let upload_form_data = new FormData();
        let extension = message_file.type.split("/");
        upload_form_data.append('file', message_file, "message_file." + extension[1]);

        let ajax_config = {
          url: self.store.upload_api_url,
          type: 'POST',
          data: upload_form_data,
          mimeType: "multipart/form-data",
          contentType: false,
          dataType: "json",
          cache: false,
          processData: false,
        }

        return this.utils_async_ajax(ajax_config, (status, response) => {});
      });

      return await Promise.all(requests);
    },
  },
  beforeUnmount() {
    window.jQuery('#messageContainer')[0].removeEventListener('scroll', this.handleScroll);
  },
}
</script>

<style scoped>
#messageContainer {
  height: 73vh;
  overflow: auto;
}
#messageContainer::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

#messageContainer::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, .4);
  box-shadow: 0 0 1px rgba(255, 255, 255, .5);
}
.message .message-content {
  max-width: 70%;
  width: fit-content;
  padding: 8px 16px;
  border-radius: 16px;
  background: #F3F3F1;
  word-break: break-all;
  overflow: hidden;
}
.message .message-content object {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #aaa;
  cursor: pointer;
}
.message.me .message-content {
  background: #00678F;
  color: white;
  margin-left: auto;
}
.message.me .message-date {
  text-align: right;
}

.message-form {
  position: fixed;
  bottom: 0;
  right: 0;
  max-width: 700px;
  width: 100%;
  border-top: 1px solid #888;
  background-color: white;
}
.message-form button {
  border: none;
  background: none;
  background-color: #00678F;
  color: white;
}
.message-form textarea {
  min-height: 43px;
  max-height: 100px;
}

@media screen and (min-width: 768px) {
  #messageContainer {
    height: 78vh;
  }
}
</style>
