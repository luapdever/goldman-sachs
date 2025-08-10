<script setup>
import TheSection from '../../components/global/TheSection.vue'
import { ListStatus, Refresh, Close, Check } from 'mdue'
</script>

<template>
  <div>
    <TheSection :title="!hideLink ? 'Statistiques du jour' : 'Statistiques'" title-muted :link-to="!hideLink ? { name: 'statistics' } : null">
      <template v-if="hideLink" v-slot:end-actions>
        <date-range-picker 
          :date-range="date_range" 
          opens="left" 
          :ranges="ranges"
          :locale-data="locale_data"
          :alwaysShowCalendar="false"
          :auto-apply="true" 
          @select="(data) => get_range_date(data)"
        ></date-range-picker>

        <!-- <button class="btn btn-light dropdown-toggle w-100 text-truncate" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          <span v-if="!filter_data.start_date || !filter_data.end_date">Aujourd'hui</span>
          <template v-else>
            <span>{{ moment_datetime_format(filter_data.start_date, "DD MMM YYYY") + " - " + moment_datetime_format(filter_data.end_date, "DD MMM YYYY") }}</span>
          </template>
        </button> -->

        <div class="dropdown-menu">
          <form id="filter_form" @submit.prevent class="p-3">
            <!-- <base-input label="Date de début" name="start_date" type="date" v-model="filter_data.start_date" :field-error="errors.start_date" />
            <base-input label="Date de fin" name="end_date" type="date" v-model="filter_data.end_date" :field-error="errors.end_date" />

            <div class="w-100 text-center">
              <base-button @click.prevent="get_statistics(true)" block>Valider</base-button>
            </div> -->

            

          </form>
        </div>
      </template>
      <div class="row align-items-stretch">
        <div class="p-1 col-lg-4 col-6">
          <base-card>
            <div class="d-flex gap-2 align-items-center">
              <base-badge circle color="0">
                <ListStatus style="font-size: 20px" />
              </base-badge>
              <div>
                <span style="font-size: 12px">Total</span>
                <div style="font-size: 14px" class="fw-bold color-0">
                  {{ summary_total }} Tickets
                </div>
              </div>
            </div>
          </base-card>
        </div>
        <div class="p-1 col-lg-4 col-6">
          <base-card>
            <div class="d-flex gap-2 align-items-center">
              <base-badge circle color="4">
                <Refresh style="font-size: 20px" />
              </base-badge>
              <div>
                <span style="font-size: 12px">Nouveau</span>
                <div style="font-size: 14px" class="fw-bold color-4">
                  {{ summary.new ?? 0 }} Tickets
                </div>
              </div>
            </div>
          </base-card>
        </div>
        <div class="p-1 col-lg-4 col-6">
          <base-card>
            <div class="d-flex gap-2 align-items-center">
              <base-badge circle color="1">
                <Refresh style="font-size: 20px" />
              </base-badge>
              <div>
                <span style="font-size: 12px">En cours</span>
                <div style="font-size: 14px" class="fw-bold color-1">
                  {{ summary.pending ?? 0 }} Tickets
                </div>
              </div>
            </div>
          </base-card>
        </div>
        <div class="p-1 col-lg-4 col-6">
          <base-card>
            <div class="d-flex gap-2 align-items-center">
              <base-badge circle color="5">
                <Refresh style="font-size: 20px" />
              </base-badge>
              <div>
                <span style="font-size: 12px">Ouvert</span>
                <div style="font-size: 14px" class="fw-bold color-5">
                  {{ summary.opened ?? 0 }} Tickets
                </div>
              </div>
            </div>
          </base-card>
        </div>
        <div class="p-1 col-lg-4 col-6">
          <base-card>
            <div class="d-flex gap-2 align-items-center">
              <base-badge circle color="3">
                <Close style="font-size: 20px" />
              </base-badge>
              <div>
                <span style="font-size: 12px">Annulé</span>
                <div style="font-size: 14px" class="fw-bold color-3">
                  {{ summary.cancelled ?? 0 }} Tickets
                </div>
              </div>
            </div>
          </base-card>
        </div>
        <div class="p-1 col-lg-4 col-6">
          <base-card>
            <div class="d-flex gap-2 align-items-center">
              <base-badge circle color="2">
                <Check style="font-size: 20px" />
              </base-badge>
              <div>
                <span style="font-size: 12px">Traité</span>
                <div style="font-size: 14px" class="fw-bold color-2">
                  {{ summary.closed ?? 0 }} Tickets
                </div>
              </div>
            </div>
          </base-card>
        </div>
      </div>
    </TheSection>
  </div>
</template>

<script>
import DateRangePicker from 'vue3-daterange-picker'

export default {
  props: {
    hideLink: {
      type: Boolean,
      default: false,
    }
  },
  mounted() {},
  data() {
    return {
      summary: {
        new: 0,
        opened: 0,
        pending: 0,
        cancelled: 0,
        closed: 0
      },
      is_processing: false,
      filter_data: {
        start_date: '',
        end_date: '',
      },
      date_range: {
        startDate: new Date(),
        endDate: new Date()
      },
      locale_data: {
        format: 'dd/mm/yyyy',
        applyLabel: 'Valider',
        cancelLabel: 'Annuler',
        customRangeLabel: 'Personnalisé',
        daysOfWeek: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        monthNames: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
        firstDay: 0
      }
    }
  },
  computed: {
    summary_total() {
      return (this.summary.new ?? 0) + (this.summary.pending ?? 0) + (this.summary.opened ?? 0) + (this.summary.closed ?? 0) + (this.summary.cancelled ?? 0);
    },
    ranges() {
      let ranges = {};

      let today = new Date()
      today.setHours(0, 0, 0, 0)

      let yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0);

      ranges = {
        "Aujourd'hui": [today, today],
        'Hier': [yesterday, yesterday],
        'Mois dernier': [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0)],
        'Ce mois': [new Date(today.getFullYear(), today.getMonth(), 1), new Date(today.getFullYear(), today.getMonth() + 1, 0)],
        'Cette année': [new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31)],
      }
      return ranges;
    }
  },
  mounted() {
    this.get_statistics();
  },
  methods: {
    get_range_date(data) {
      this.filter_data.start_date = data.startDate ? data.startDate.toISOString() : '';
      this.filter_data.end_date = data.endDate ? data.endDate.toISOString() : '';

      this.get_statistics(true);
    },
    get_statistics(from_filter = false) {
      let flter_data = {};

      /* Filter options */
      if(from_filter) {
        Object.keys(this.filter_data).forEach((ky, ind) => {
          if(!_.isEmpty(this.filter_data[ky])) {
            flter_data[ky] = this.filter_data[ky];
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

        this.$emit("data-changed", flter_data);
      }

      let ajax_config = {
        url: this.make_ajax_url('/analytics/tickets-summary', 9001),
        type: 'POST',
        max_retry: 2,
        data: flter_data
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        if (_.isUndefined(response.error)) {
          this.summary = { ...response }
        }
      });
    }
  },
  components: { TheSection, DateRangePicker }
}
</script>
