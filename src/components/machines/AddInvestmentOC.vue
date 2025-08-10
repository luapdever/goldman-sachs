<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores'
import { useAppUtils } from '@/composables/useAppUtils'
import no_result from '../../assets/img/no-result.svg'
import BaseOffcanvas from '../base/BaseOffcanvas.vue'
import { CheckCircle, ContentCopy, Check, Information } from 'mdue'

// Composables
const router = useRouter()
const store = useMainStore()
const appUtils = useAppUtils()

// Reactive data
const step = ref(1)
const investment_created = ref(null)
const is_loading = ref(false)
const in_subfields_loading = ref(false)
const machinesearch = ref('')
const errors = ref({})

const ticket_data = ref({
  machine: "",
})

const tmp_data = ref({
  machine: "",
})

const allowed_exts = ref(["png", "jpeg", "jpg"])
const reset_states = ref({})

// Computed properties
const machines_options = computed(() => {
  let cats = []

  cats = store.machines_list.filter((cat) => {
    return search_without_accents(machinesearch.value?.toLowerCase(), cat?.label?.toLowerCase())
  })

  cats.sort((a, b) => {
    if (a.label < b.label) {
      return -1
    }
    if (a.label > b.label) {
      return 1
    }
    return 0
  })

  return cats
})

const ready_for_submit = computed(() => {
  return true
})

// Methods
const add_error = (field, value) => {
  errors.value[field] = value
}

const has_error = (field) => {
  if (!errors.value[field]) {
    return false
  }
  if (errors.value[field] == "") {
    return false
  }
  return errors.value[field]
}

const search_without_accents = (search, text) => {
  if (!search || !text) return true
  
  const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  
  return normalizedText.includes(normalizedSearch)
}

const prev = () => {
  if (is_loading.value || investment_created.value) return

  if (step.value > 1) {
    step.value -= 1
  } else {
    step.value = 1
  }
}

const close_oc = () => {
  investment_created.value = null
  window.jQuery("#add_investment_close").click()
  router.push({ name: "machines" })
}

const get_machines_list = () => {
  let ajax_config = {
    url: appUtils.makeAjaxUrl('/machines/categories', 9001),
    type: 'GET',
    max_retry: 2,
  }

  appUtils.ajax(ajax_config, { showError: false }, (status, response) => {
    if (!window._.isUndefined(response) && window._.isArray(response)) {
      store.machines_list = response
    } else if (!window._.isUndefined(response?.error)) {
      store.machines_list = []
    }
  })
}

const next_step = async (event) => {
  let flag = 1

  switch (step.value) {
    case 1:
      flag = validate_primary_fields()
      break
  
    case 2:
      flag = validate_secondary_fields()
      break
  
    default:
      break
  }

  if (flag == 0) {
    appUtils.toggleGlobalAlert("Veuillez vérifier les erreurs au niveau des champs.", "error", false)
    return
  } else if (step.value == 2) {
    submit_ticket()
    return
  } else if (ready_for_submit.value) {
    submit_ticket()
    return
  }

  step.value += 1

  await nextTick()
  setTimeout(() => {
    window.jQuery('.offcanvas-body').animate({
      scrollTop: window.jQuery("#addinvestmentctn").offset().top
    }, 100)
  }, 10)
}

const submit_ticket = async () => {
  is_loading.value = true

  let form_data = { ...ticket_data.value }

  // MSIDN Field
  if (tmp_data.value.msisdn_field) {
    if (tmp_data.value.msisdn_field == tmp_data.value.bulkable_field) {
      form_data.msisdn = tmp_data.value.attrs[tmp_data.value.msisdn_field].split(',')
    } else {
      form_data.msisdn = tmp_data.value.attrs[tmp_data.value.msisdn_field]
    }
  }
  
  // Subcategories fields process
  form_data.attrs = await treat_all_fields()

  if (!form_data.attrs) {
    is_loading.value = false
    return
  }

  let ajax_config = {
    url: appUtils.makeAjaxUrl('/machines/create', 9001),
    type: 'POST',
    max_retry: 2,
    data: form_data,
  }

  appUtils.ajax(ajax_config, { showError: false }, (status, response) => {
    is_loading.value = false
    if (window._.isUndefined(response?.error)) {
      if (!response || !Array.isArray(response) || response.length == 0) {
        appUtils.toggleGlobalAlert("Désolé, aucun ticket n'a été ajouté. Veuillez réessayer à nouveau.", "error", false)
        return
      }

      appUtils.toggleGlobalAlert("Ticket(s) ajouté(s) avec succès.", "success", false)
      
      reset()
      investment_created.value = [...response]
      store.machines_list = [...response, ...store.machines_list]
      store.current_investments = [...response, ...store.current_investments]
    } else if (!window._.isUndefined(response?.error)) {
      appUtils.toggleGlobalAlert(response.error, "error", false)
    }
  })
}

const validate_primary_fields = () => {
  let flag = 1
  
  add_error("machine", false)
  if (window._.isEmpty(ticket_data.value.machine)) {
    flag = 0
    add_error("machine", "Veuillez sélectionner une catégorie.")
  }

  return flag
}

const validate_secondary_fields = () => {
  let flag = 1
  return flag
}

const treat_all_fields = async () => {
  // Cette méthode semble être utilisée pour traiter les champs dynamiques
  // Pour l'instant, retournons un objet vide
  return {}
}

const reset = () => {
  step.value = 1
  investment_created.value = null
  ticket_data.value.machine = ""
  machinesearch.value = ""

  setTimeout(() => {
    machinesearch.value = ""
    window.jQuery("#addinvestmentform")[0].reset()
  }, 80)
}

// Lifecycle
onMounted(() => {
  get_machines_list()
})
</script>

<template>
  <div>
    <BaseOffcanvas 
      fullscreen position="end" oc-id="addinvestment" 
      :noClose="step > 1 && !investment_created"
      @onClose="($event) => prev()" 
      @onHidden="reset()"
    >
        <template v-slot:oc-header>
          <h3 id="addinvestmentLabel">Investir </h3>
        </template>

        <template v-slot:oc-body>
          <div v-if="!store?.machines_list || store?.machines_list.length <= 0" class="w-100 h-100 d-flex justify-content-center align-items-center">
            <div class="text-center">
              <img :src="no_result" alt="No result" />
              <p class="p-3">Sorry !! Aucune machine n'est disponible actuellement.</p>
            </div>
          </div>

          <div v-else id="addinvestmentctn" class="position-relative">
            <div v-if="is_loading" class="t-overlay">
              <span class="spinner-border text-primary" role="status"></span>
            </div>

            <div v-if="investment_created" class="px-3 py-5 d-flex justify-content-center">
              <div class="text-center d-flex flex-column justify-content-center align-items-center">
                <CheckCircle style="color: green; font-size: 50px;" />
                <h3 class="mt-2 mb-1">Ticket ajouté</h3>
                <p class="text-muted">Votre plainte à été enregistré avec succès.</p>
                
                <div class="mt-2 d-flex justify-content-center align-items-center gap-2">
                  <button class="btn btn-dark" @click.prevent="close_oc()" type="button">Retour aux machines</button>
                  <button class="btn btn-primary" @click.prevent="($event) => reset()" type="button">Investir encore</button>
                </div>
              </div>
            </div>
            <form v-else id="addinvestmentform" @submit.prevent="" class="px-4 mb-5">
              <div v-if="step == 1" class="mt-3">
                
                <div class="mb-3">
                  <base-input label="Rechercher une machine" name="machinesearch" v-model="machinesearch" type="search" ph="Rechercher" />
                </div>

                <div class="mb-3">
                  <div v-if="has_error('machine')" class="text-danger">
                    <span style="padding-right: 3px;">
                      <Information style="font-size: 18px;" />
                    </span>
                    <span>{{ has_error('machine') }}</span>
                  </div>
                </div>

                <!-- machine -->
                <div v-if="!machines_options || machines_options.length == 0" class="p-3 text-center">
                  <p class="text-muted">Aucun résultat...</p>
                </div>
                <div>
                  <div class="subcats">
                    <div v-for="(machine, index) in machines_options" :key="'Machine' + index" class="col-lg-4 col-6 p-1 machine-radio">
                      <input type="radio" name="machine" :id="'machine' + index" :value="machine.value" v-model="tmp_data.machine" class="d-none" />
                      <label class="card p-2 d-flex justify-content-center align-items-center text-center" :for="'machine' + index" type="button">
                        {{ machine.label }}
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              <div v-if="step == 2" class="mt-3 mb-3">
              </div>

              <div class="position-sticky w-100 bottom-0 start-0 bg-white px-2 py-3">
                <div>
                  <base-button :disabled="is_loading || in_subfields_loading" block @click="next_step($event)">
                    <span>
                      {{ step != 1 ? "Investir" : "Suivant" }}
                    </span>
                    <!-- <span v-else class="spinner-border text-dark" role="status"></span> -->
                  </base-button>
                </div>
                
                <div v-if="step > 1" class="my-3 text-center">
                  <button @click="($event) => prev()" class="btn text-info2" type="button">Précédent</button>
                </div>
              </div>
            </form>
            <button id="add_investment_close" class="d-none" data-bs-dismiss="offcanvas" type="button"></button>
          </div>
        </template>
    </BaseOffcanvas>
  </div>
</template>

<style scoped>
.ticket-id-copy input {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  position: relative;
  user-select: none;
  border: none !important;
  box-shadow: none !important;
}
.ticket-id-copy input::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";

}
.ticket-id-copy button {
  border-bottom-left-radius: 0 !important;
  border-top-left-radius: 0 !important;
  border-bottom-right-radius: 5px !important;
  border-top-right-radius: 5px !important;
}

.subcats {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}
.subcats .card {
  height: 120px !important;
  /* width: 100%;
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; */
}
.subcats .machine-radio label {
  transition: .3s;
} 
.subcats .machine-radio input:checked ~ label {
  background-color: #fc0;
  font-weight: bold;
}
</style>
