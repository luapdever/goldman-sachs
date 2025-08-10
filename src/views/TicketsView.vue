<script setup>
import TheSection from '../components/global/TheSection.vue';
import { FilterVariant } from 'mdue'

import BaseOffcanvas from '../components/base/BaseOffcanvas.vue';
import TheTicketsList from '../components/tickets/TheTicketsList.vue';
import UnreadCount from '../components/tickets/UnreadCount.vue';
</script>

<template>
  <div>
    <main-layout>
      <div class="px-4 py-1 mb-5">
        <unread-count />

        <TheSection title="Liste des tickets" title-muted>
          <template v-slot:end-actions>
            <div type="button" class="ticket-filter d-flex align-items-center gap-2" data-bs-toggle="offcanvas" data-bs-target="#ticketFilter" aria-controls="ticketFilter">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16H17.82C17.6098 15.4209 17.2264 14.9205 16.7218 14.5668C16.2173 14.2132 15.6161 14.0235 15 14.0235C14.3839 14.0235 13.7827 14.2132 13.2782 14.5668C12.7736 14.9205 12.3902 15.4209 12.18 16H3C2.73478 16 2.48043 16.1054 2.29289 16.2929C2.10536 16.4804 2 16.7348 2 17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H12.18C12.3902 18.5792 12.7736 19.0795 13.2782 19.4332C13.7827 19.7868 14.3839 19.9765 15 19.9765C15.6161 19.9765 16.2173 19.7868 16.7218 19.4332C17.2264 19.0795 17.6098 18.5792 17.82 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17C22 16.7348 21.8946 16.4804 21.7071 16.2929C21.5196 16.1054 21.2652 16 21 16ZM15 18C14.8022 18 14.6089 17.9414 14.4444 17.8315C14.28 17.7216 14.1518 17.5654 14.0761 17.3827C14.0004 17.2 13.9806 16.9989 14.0192 16.8049C14.0578 16.6109 14.153 16.4328 14.2929 16.2929C14.4327 16.153 14.6109 16.0578 14.8049 16.0192C14.9989 15.9806 15.2 16.0004 15.3827 16.0761C15.5654 16.1518 15.7216 16.28 15.8315 16.4444C15.9414 16.6089 16 16.8022 16 17C16 17.2652 15.8946 17.5196 15.7071 17.7071C15.5196 17.8946 15.2652 18 15 18ZM3 8.00001H6.18C6.3902 8.57916 6.77363 9.07955 7.27817 9.43316C7.7827 9.78678 8.38388 9.97648 9 9.97648C9.61612 9.97648 10.2173 9.78678 10.7218 9.43316C11.2264 9.07955 11.6098 8.57916 11.82 8.00001H21C21.2652 8.00001 21.5196 7.89465 21.7071 7.70711C21.8946 7.51958 22 7.26522 22 7.00001C22 6.73479 21.8946 6.48044 21.7071 6.2929C21.5196 6.10536 21.2652 6.00001 21 6.00001H11.82C11.6098 5.42085 11.2264 4.92047 10.7218 4.56685C10.2173 4.21323 9.61612 4.02353 9 4.02353C8.38388 4.02353 7.7827 4.21323 7.27817 4.56685C6.77363 4.92047 6.3902 5.42085 6.18 6.00001H3C2.73478 6.00001 2.48043 6.10536 2.29289 6.2929C2.10536 6.48044 2 6.73479 2 7.00001C2 7.26522 2.10536 7.51958 2.29289 7.70711C2.48043 7.89465 2.73478 8.00001 3 8.00001ZM9 6.00001C9.19778 6.00001 9.39112 6.05865 9.55557 6.16854C9.72002 6.27842 9.84819 6.4346 9.92388 6.61732C9.99957 6.80005 10.0194 7.00112 9.98079 7.1951C9.9422 7.38908 9.84696 7.56726 9.70711 7.70711C9.56725 7.84696 9.38907 7.94221 9.19509 7.98079C9.00111 8.01938 8.80004 7.99957 8.61732 7.92389C8.43459 7.8482 8.27841 7.72003 8.16853 7.55558C8.05865 7.39113 8 7.19779 8 7.00001C8 6.73479 8.10536 6.48044 8.29289 6.2929C8.48043 6.10536 8.73478 6.00001 9 6.00001Z" fill="black"/>
                </svg>
              </div>
              <div class="fs-6">Filtrer</div>
            </div>
          </template>
          
          <template v-slot:desc>
            <div v-if="filters.length > 0 && in_filtering" class="d-flex flex-wrap gap-2 mb-2">
              <div class="text-muted">Filtrer par : </div>

              <div v-for="(opt, ind) in filters" :key="'Filter'+ind" class="card bg-muted text-dark px-2 d-flex flex-row align-items-center gap-2" style="font-size: 12px;">
                <span>{{ opt.value }}</span>
                <button @click="remove_filter(opt.filter_key)" class="border-0 bg-muted text-dark p-0 fs-4 text-muted">&times;</button>
              </div>
            </div>
          </template>

          <the-tickets-list 
            :tickets="store.tickets_list" 
            :page="pagination.page" 
            :count="pagination.count" 
            @change-page="(page) => { pagination.page = page; get_tickets(true) }" 
            :is_processing="is_processing" 
            ticketListId="for_tickets"
          ></the-tickets-list>
        </TheSection>
      </div>

      <BaseOffcanvas oc-id="ticketFilter">
        <template v-slot:oc-header>
          <div type="button" class="d-flex align-items-center gap-2">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 16H17.82C17.6098 15.4209 17.2264 14.9205 16.7218 14.5668C16.2173 14.2132 15.6161 14.0235 15 14.0235C14.3839 14.0235 13.7827 14.2132 13.2782 14.5668C12.7736 14.9205 12.3902 15.4209 12.18 16H3C2.73478 16 2.48043 16.1054 2.29289 16.2929C2.10536 16.4804 2 16.7348 2 17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H12.18C12.3902 18.5792 12.7736 19.0795 13.2782 19.4332C13.7827 19.7868 14.3839 19.9765 15 19.9765C15.6161 19.9765 16.2173 19.7868 16.7218 19.4332C17.2264 19.0795 17.6098 18.5792 17.82 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17C22 16.7348 21.8946 16.4804 21.7071 16.2929C21.5196 16.1054 21.2652 16 21 16ZM15 18C14.8022 18 14.6089 17.9414 14.4444 17.8315C14.28 17.7216 14.1518 17.5654 14.0761 17.3827C14.0004 17.2 13.9806 16.9989 14.0192 16.8049C14.0578 16.6109 14.153 16.4328 14.2929 16.2929C14.4327 16.153 14.6109 16.0578 14.8049 16.0192C14.9989 15.9806 15.2 16.0004 15.3827 16.0761C15.5654 16.1518 15.7216 16.28 15.8315 16.4444C15.9414 16.6089 16 16.8022 16 17C16 17.2652 15.8946 17.5196 15.7071 17.7071C15.5196 17.8946 15.2652 18 15 18ZM3 8.00001H6.18C6.3902 8.57916 6.77363 9.07955 7.27817 9.43316C7.7827 9.78678 8.38388 9.97648 9 9.97648C9.61612 9.97648 10.2173 9.78678 10.7218 9.43316C11.2264 9.07955 11.6098 8.57916 11.82 8.00001H21C21.2652 8.00001 21.5196 7.89465 21.7071 7.70711C21.8946 7.51958 22 7.26522 22 7.00001C22 6.73479 21.8946 6.48044 21.7071 6.2929C21.5196 6.10536 21.2652 6.00001 21 6.00001H11.82C11.6098 5.42085 11.2264 4.92047 10.7218 4.56685C10.2173 4.21323 9.61612 4.02353 9 4.02353C8.38388 4.02353 7.7827 4.21323 7.27817 4.56685C6.77363 4.92047 6.3902 5.42085 6.18 6.00001H3C2.73478 6.00001 2.48043 6.10536 2.29289 6.2929C2.10536 6.48044 2 6.73479 2 7.00001C2 7.26522 2.10536 7.51958 2.29289 7.70711C2.48043 7.89465 2.73478 8.00001 3 8.00001ZM9 6.00001C9.19778 6.00001 9.39112 6.05865 9.55557 6.16854C9.72002 6.27842 9.84819 6.4346 9.92388 6.61732C9.99957 6.80005 10.0194 7.00112 9.98079 7.1951C9.9422 7.38908 9.84696 7.56726 9.70711 7.70711C9.56725 7.84696 9.38907 7.94221 9.19509 7.98079C9.00111 8.01938 8.80004 7.99957 8.61732 7.92389C8.43459 7.8482 8.27841 7.72003 8.16853 7.55558C8.05865 7.39113 8 7.19779 8 7.00001C8 6.73479 8.10536 6.48044 8.29289 6.2929C8.48043 6.10536 8.73478 6.00001 9 6.00001Z" fill="black"/>
              </svg>
            </div>
            <h3 id="ticketFilterLabel">Filtrer</h3>
          </div>
        </template>
        
        <template v-slot:oc-body>
          <form id="filter_form" @submit="get_tickets(true)" class="p-3">
            <base-input label="Sous catégorie" name="category" type="select" :options="categories_options" ph="Choisir une sous catégorie" v-model="filter_data.category" :field-error="errors.category" />
            <base-input label="Statut" name="status" type="select" :options="statuses" ph="Choisir un statut" v-model="filter_data.status" :field-error="errors.status" />
            <base-input label="Date de début" name="start_date" ph="Choisir la date" type="date" v-model="filter_data.start_date" :field-error="errors.start_date" />
            <base-input label="Date de fin" name="end_date" ph="Choisir la date" type="date" v-model="filter_data.end_date" :field-error="errors.end_date" />

            <div class="w-100 text-center">
              <button @click.prevent class="d-none" data-bs-dismiss="offcanvas" id="ticketFilterClose"></button>
              <base-button @click.prevent="get_tickets(true)" block>Valider</base-button>
              <button class="btn text-info2" @click.prevent="reset($event)">Réinitialiser</button>
            </div>
          </form>
        </template>
      </BaseOffcanvas>
    </main-layout>
  </div>
</template>

<script>
export default {
    mounted() {
        
    },
    data() {
      return {
        tickets: [],
        is_processing: false,
        in_filtering: false,
        filter_data: {
          category: '',
          status: '',
          start_date: '',
          end_date: '',
        },
        pagination: {
          page: 0,
          count: 0,
        },
        new_tickets: [0]
      }
    },
    computed: {
      statuses() {
        let status_types = store.status_types;
        let statuses = [];

        statuses = Object.keys(status_types).map((ky, index) => {
          return {
            label: status_types[ky].label,
            value: ky
          }
        });

        return statuses;
      },
      categories_options() {
        let options = [];

        const cats = store.categories_list;

        for(const cat of cats) {
          if(cat.subcategories && cat.subcategories.length > 0) {
            options.push({
              is_group: true,
              label: cat.title,
              value: cat.subcategories.map((val) => {
                return {
                  label: val.title,
                  value: cat.id + "#" + val.id,
                }
              })
            });
          }
        }

        return options;
      },
      filters() {
        let filter_opts = this.filter_data
        let options = []
        Object.keys(filter_opts).forEach((opt) => {
          if(opt == 'status' && !_.isEmpty(filter_opts[opt])) {
            options.push({
              filter_key: opt,
              label: "Statut",
              value: store.status_types[filter_opts[opt]].label,
            });
          }
          
          else if(opt == 'category' && !_.isEmpty(filter_opts[opt])) {
            let subcat = null;
            let cat = this.categories_options.find((val) => val.value.some((vl) => vl.value == filter_opts[opt]));

            if(cat) {
              subcat = cat.value.find((val) => val.value == filter_opts[opt]);
            }

            if(subcat) {
              options.push({
                filter_key: opt,
                label: "Categorie",
                value: subcat.label,
              });
            }
          }

          else if(opt == 'start_date' && _.isDate(filter_opts[opt])) {
            options.push({
              filter_key: opt,
              label: "Période",
              value: this.moment_datetime_format(filter_opts.start_date, "DD-MM-YYYY") + " à " + this.moment_datetime_format(filter_opts.end_date, "DD-MM-YYYY"),
            });
          }
        });

        return options;
      },
    },

    mounted() {
      this.get_categories_list();
      this.get_tickets();
    },

    methods: {
      get_tickets(from_filter = false) {
        let flter_data = {};

        /* Filter options */
        if(from_filter) {
          Object.keys(this.filter_data).forEach((ky, ind) => {
            if(!_.isEmpty(this.filter_data[ky])) {
              flter_data[ky] = this.filter_data[ky];

              if(ky == 'category') {
                flter_data.category = this.filter_data[ky].split('#')[0];
                flter_data.subcategory = this.filter_data[ky].split('#')[1];
              }
            }
          })

          this.add_error("start_date", false);
          this.add_error("end_date", false);
          if(!_.isEmpty(flter_data.start_date) || !_.isEmpty(flter_data.end_date)) {
            if(_.isEmpty(flter_data.start_date)) {
              this.add_error("start_date", "Vous devez spécifier la date de début");
              return;
            } else if(_.isEmpty(flter_data.end_date)) {
              this.add_error("end_date", "Vous devez spécifier la date de fin");
              return;
            }

            let s_date = new Date(flter_data.start_date);
            let e_date = new Date(flter_data.end_date);

            if(s_date > e_date) {
              this.add_error("end_date", "La date de fin ne peut être antérieur à la date de début.");
              return;
            }

            flter_data.start_date = s_date.getTime();
            flter_data.end_date = e_date.getTime();
          }

          window.jQuery("#ticketFilterClose").click()

          if(this.filters.length > 0) {
            this.in_filtering = true;
          } else {
            this.in_filtering = false;
          }

          flter_data = { ...flter_data, ...this.pagination };
        }


        /* Request */
        this.is_processing = true;

        let ajax_config = {
          url: this.make_ajax_url('/tickets/get-list', 9001),
          type: 'POST',
          max_retry: 2,
          data: flter_data,
        }

        this.utils_async_ajax(ajax_config, (status, response) => {
          this.is_processing = false;
          
          if (_.isUndefined(response.error)) {
            store.tickets_list = response.content ?? [];
            this.pagination.count = parseInt(response.totalElements ?? 0);
            this.pagination.page = parseInt(response.current ?? 0);
          } else if(!_.isUndefined(response.error)) {
            store.tickets_list = []
          }
        })
      },
      get_categories_list() {
        let ajax_config = {
          url: this.make_ajax_url('/tickets/categories', 9001),
          type: 'GET',
          max_retry: 2,
        }

        this.utils_async_ajax(ajax_config, (status, response) => {
          if (!_.isUndefined(response) && _.isArray(response)) {
            store.categories_list = response
          } else if(!_.isUndefined(response.error)) {
            store.categories_list = []
          }
        })
      },
      remove_filter(filter_key) {
        this.filter_data[filter_key] = "";
        if(filter_key == "start_date") {
          this.filter_data.end_date = "";
        }

        this.get_tickets(true);
      },
      reset() {
        this.filter_data.category = "";
        this.filter_data.status = "";
        this.filter_data.start_date = "";
        this.filter_data.end_date = "";

        this.get_tickets(true);

        window.jQuery("#filter_form")[0].reset();
      }
    },
    components: { TheSection, BaseOffcanvas, TheTicketsList, UnreadCount }
}
</script>