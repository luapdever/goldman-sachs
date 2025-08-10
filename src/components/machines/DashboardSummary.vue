<script setup>
import { ref, computed, onMounted } from 'vue'
import TheSection from '../global/TheSection.vue'
import { ListStatus, Refresh, Close, Check } from 'mdue'
import DateRangePicker from 'vue3-daterange-picker'
import { useAppUtils } from '@/composables/useAppUtils'
import { getStatistics } from '../../services/app'

const appUtils = useAppUtils();

// Props
const props = defineProps({
  hideLink: {
    type: Boolean,
    default: false,
  }
})

// Emits
const emit = defineEmits(['data-changed'])

// Reactive data
const summary = ref({
  investments: 0,
  machines: 0,
  amount_investments: 0,
})

const is_processing = ref(false)
const filter_data = ref({
  start_date: '',
  end_date: '',
})

const date_range = ref({
  startDate: new Date(),
  endDate: new Date()
})

const locale_data = ref({
  format: 'dd/mm/yyyy',
  applyLabel: 'Valider',
  cancelLabel: 'Annuler',
  customRangeLabel: 'Personnalisé',
  daysOfWeek: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  monthNames: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
  firstDay: 0
})


const ranges = computed(() => {
  let today = new Date()
  today.setHours(0, 0, 0, 0)

  let yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  return {
    "Aujourd'hui": [today, today],
    'Hier': [yesterday, yesterday],
    'Mois dernier': [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0)],
    'Ce mois': [new Date(today.getFullYear(), today.getMonth(), 1), new Date(today.getFullYear(), today.getMonth() + 1, 0)],
    'Cette année': [new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31)],
  }
})

// Methods
const get_range_date = (data) => {
  filter_data.value.start_date = data.startDate ? data.startDate.toISOString() : ''
  filter_data.value.end_date = data.endDate ? data.endDate.toISOString() : ''

  get_stats(true)
}

const get_stats = async (from_filter = false) => {
  let flter_data = {}

  /* Filter options */
  if (from_filter) {
    Object.keys(filter_data.value).forEach((ky, ind) => {
      if (!_.isEmpty(filter_data.value[ky])) {
        flter_data[ky] = filter_data.value[ky]
      }
    })

    // Note: add_error method needs to be implemented or imported from a mixin/utility
    // this.add_error("start_date", false)
    // this.add_error("end_date", false)
    
    if (!_.isEmpty(flter_data.start_date) || !_.isEmpty(flter_data.end_date)) {
      if (_.isEmpty(flter_data.start_date)) {
        // this.add_error("start_date", "Vous devez spécifier la date de début")
        return
      } else if (_.isEmpty(flter_data.end_date)) {
        // this.add_error("end_date", "Vous devez spécifier la date de fin")
        return
      }

      let s_date = new Date(flter_data.start_date)
      let e_date = new Date(flter_data.end_date)

      if (s_date > e_date) {
        // this.add_error("end_date", "La date de fin ne peut être antérieur à la date de début.")
        return
      }

      flter_data.start_date = s_date.getTime()
      flter_data.end_date = e_date.getTime()
    }

    emit("data-changed", flter_data)
  }

  const response = await getStatistics(flter_data);

  if (_.isUndefined(response?.error)) {
    summary.value = { ...response }
  }
}

// Lifecycle
onMounted(() => {
  get_stats()
})

// Note: These utility functions need to be imported or defined
// make_ajax_url, utils_async_ajax, add_error, and _ (lodash) should be available
// You may need to import them from your existing utilities
</script>

<template>
  <div>
    <TheSection title="Statistiques" title-muted>
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

        <div class="dropdown-menu">
          <form id="filter_form" @submit.prevent class="p-3">

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
                  {{ summary?.investments ?? 0 }} investissements
                </div>
              </div>
            </div>
          </base-card>
        </div>
        <div class="p-1 col-lg-4 col-6">
          <base-card>
            <div class="d-flex gap-2 align-items-center">
              <base-badge circle color="0">
                <ListStatus style="font-size: 20px" />
              </base-badge>
              <div>
                <span style="font-size: 12px">Total</span>
                <div style="font-size: 14px" class="fw-bold color-0">
                  {{ summary?.machines ?? 0 }} machines
                </div>
              </div>
            </div>
          </base-card>
        </div>
        <div class="p-1 col-lg-4 col-6">
          <base-card>
            <div class="d-flex gap-2 align-items-center">
              <base-badge circle color="0">
                <ListStatus style="font-size: 20px" />
              </base-badge>
              <div>
                <span style="font-size: 12px">Montant investi</span>
                <div style="font-size: 14px" class="fw-bold color-0">
                  {{ summary?.amount_investments ?? 0 }} USDT
                </div>
              </div>
            </div>
          </base-card>
        </div>
      </div>
    </TheSection>
  </div>
</template>
