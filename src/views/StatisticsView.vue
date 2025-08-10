<script setup>
import TicketSummary from '../components/tickets/TicketSummary.vue';

import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

</script>

<template>
  <div>
    <main-layout>
      <div class="px-4 py-1 position-relative">
        <div v-if="is_processing" class="t-overlay">
          <span class="spinner-border text-primary" role="status"></span>
        </div>

        <ticket-summary @data-changed="(flter_data) => get_categories_sumary(flter_data)" hide-link />

        <div class="mb-3">
          <base-card v-if="categories_summary && categories_summary.length > 0" animated>
            <h3 class="text-muted fs-5">Tickets par catégorie</h3>

            <div class="divider mb-3 mt-2"></div>

            <Bar
              id="tickets-by-cats"
              :options="by_categories.chartOptions"
              :data="by_categories.data"
              :style="chart_styles"
            />
          </base-card>
        </div>

        <div class="mb-3">
          <base-card v-if="tickets_by_date && tickets_by_date.length > 0 && by_days" animated>
            <h3 class="text-muted fs-5">Tickets par date</h3>

            <div class="divider mb-3 mt-2"></div>

            <Line
              id="tickets-by-day"
              :options="by_days.chartOptions"
              :data="by_days.data"
              :style="chart_styles"
            />
          </base-card>
        </div>
      </div>
    </main-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories_summary: [],
      tickets_by_date: [],
      is_processing: false,
    }
  },
  computed: {
    chart_styles() {
      return {
        width: '100%',
        height: window.innerWidth > 768 ? 60 + 'vh' : 250 + 'px',
        overflow: 'auto'
      };
    },
    by_categories() {
      let labels = []
      let data = []

      labels = this.categories_summary.map((value) => value.title);
      data = this.categories_summary.map((value) => parseInt(value.ticket_count) ?? 0);

      return {
        chartOptions: {
          responsive: true,
          scales: {
            x: {
              grid: {
                drawOnChartArea: false,
                borderDash: [6, 4],
              },
            },
          },
        },
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Tickets traités',
              backgroundColor: '#0d99ff',
              // backgroundColor: '#15655B',
              borderRadius: 5,
              data: data,
            }
          ]
        },
      }
    },
    by_days() {
      if(!this.tickets_by_date || this.tickets_by_date.length <=1) {
        return null;
      }

      let labels = []

      labels = this.tickets_by_date.map((value) => this.moment_datetime_format(value.created_date, "DD-MM-YYYY"));
      let total_data = this.tickets_by_date.map((value) => parseInt(value.total_tickets) ?? 0);
      let closed_data = this.tickets_by_date.map((value) => parseInt(value.closed_tickets) ?? 0);

      return {
        chartOptions: {
          responsive: true,
          scales: {
            x: {
              grid: {
                drawOnChartArea: false,
                borderDash: [6, 4],
              },
            },
          },
        },
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total',
              borderRadius: 10,
              fill: false,
              borderColor: '#000000',
              tension: 0.6,
              data: total_data,
            },
            {
              label: 'Tickets traités',
              borderRadius: 10,
              fill: false,
              borderColor: '#0d99ff',
              // borderColor: '#15655B',
              tension: 0.6,
              data: closed_data,
            },
          ]
        },
      }
    },
  },
  mounted() {
    this.get_categories_sumary()
  },
  methods: {
    get_categories_sumary(flter_data) {
      this.is_processing = true;
      let ajax_config = {
        url: this.make_ajax_url('/analytics/tickets-count/by-categories', 9001),
        type: 'POST',
        max_retry: 2,
        data: flter_data ?? {}
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.is_processing = false;
        if (_.isUndefined(response.error)) {
          this.categories_summary = response?.by_category ?? [];
          this.tickets_by_date = response?.by_day ?? [];
        }
      })
    }
  },
  components: { TicketSummary, Bar }
}
</script>
