<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores'
import { useAppUtils } from '@/composables/useAppUtils'
import no_result from '../../assets/img/no-result.svg'
import BaseOffcanvas from '../base/BaseOffcanvas.vue'
import { CheckCircle, ContentCopy, Check, Information } from 'mdue'
import { getMachines, placeInvestment } from '../../services/app'

// Composables
const router = useRouter()
const store = useMainStore()
const appUtils = useAppUtils()

// Reactive data
const step = ref(1)
const investment_created = ref(null)
const inSubmitting = ref(false)
const in_subfields_loading = ref(false)
const machinesearch = ref('')
const errors = ref({})

const allowed_exts = ref(["png", "jpeg", "jpg"])
const reset_states = ref({})

const activeStep = ref(0);
const formData = ref({});

// Configuration des étapes de connexion
const steps = ref([
  {
    label: "Machine",
    fields: [
      {
        name: 'machine',
        label: 'Machine',
        type: 'hidden',
        placeholder: 'Sélectionner la machine',
        required: true,
        value: null
      },
    ]
  },
  {
    label: "Machine",
    fields: [
      {
        name: 'amount',
        label: 'Montant (en USD)',
        type: 'number',
        placeholder: '',
        required: true,
        readonly: true,
        value: ""
      },
      {
        name: 'wallet_type',
        label: 'Moyen de paiement',
        type: 'radio',
        required: true,
        options: [
          {
            label: "Binance",
            value: "binance",
          },
          {
            label: "Wallet",
            value: "wallet",
          },
        ],
        value: "binance"
      },
      {
        name: 'wallet_addr',
        label: 'Adresse Wallet',
        type: 'text',
        placeholder: 'Entrer votre adresse Wallet',
        required: true,
        autocomplete: 'off',
        value: ""
      }
    ]
  },
]);

const currentStepFields = computed(() => steps.value[activeStep.value]?.fields ?? []);
const isLastStep = computed(() => activeStep.value === steps.value.length - 1);

watch(
  () => formData.value.machine,
  (newVal, oldVal) => {
    if(newVal) {
      let machine = store.machines_list.find((m) => m.id == newVal);
      formData.value.amount = machine.amount;
    }
  }
);

// Computed properties
const machines_options = computed(() => {
  let cats = []

  cats = store.machines_list.filter((cat) => {
    return appUtils.searchWithoutAccents(machinesearch.value?.toLowerCase(), cat?.label?.toLowerCase())
  })

  cats.sort((a, b) => {
    if (a?.label?.length < b?.label?.length) {
      return -1
    }
    if (a?.label?.length > b?.label?.length) {
      return 1
    }
    return 0
  })

  return cats
})

const initFields = () => {
  steps.value.forEach((step) => {
    step?.fields?.forEach((field) => {
      if (field?.value != null && formData.value[field?.name] == null) {
        formData.value[field?.name] = field?.value;
      }

      if(field?.name == 'machine') {
        formData.value.machine = store.machine_selected ?? "";
      }
    });
  });
};

const validateCurrentStep = () => {
  return appUtils.validateFields(steps.value[activeStep.value]?.fields ?? [], formData.value);
};

const close_oc = () => {
  investment_created.value = null
  window.jQuery("#add_investment_close").click()
}

const get_machines_list = async () => {
  const response = await getMachines();

  if (!window._.isUndefined(response) && response?.results) {
    let machines = response?.results?.sort((a, b) => {
    if (a?.label?.length < b?.label?.length) {
      return -1
    }
    if (a?.label?.length > b?.label?.length) {
      return 1
    }
    return 0
  })
    store.machines_list = machines;
  } else if (!window._.isUndefined(response?.error)) {
    store.machines_list = []
  }
}

const submitRequest = async () => {
  // Validation de tous les steps
  let flag = 1;
  for (const st of steps.value) {
    flag *= appUtils.validateFields(st?.fields ?? [], formData.value);
  }

  if (flag === 0) return;

  inSubmitting.value = true;

  try {
    const response = await placeInvestment(formData.value);
    if (response?.id) {
      investment_created.value = response;
      store.current_investments.push(response);
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
  } finally {
    inSubmitting.value = false;
  }
};

const goToStep = (step = null) => {
  const finalStep = step ?? (activeStep.value + 1);

  // Validation de l'étape actuelle si on avance
  if (finalStep > activeStep.value) {
    const isValid = validateCurrentStep();
    if (!isValid) return;
  }

  // Si c'est la dernière étape, soumettre
  if (isLastStep.value) {
    submitRequest();
    return;
  }

  // Sinon, passer à l'étape suivante
  if (activeStep.value < steps.value.length - 1) {
    activeStep.value = finalStep;
  }
};

const reset = () => {
  activeStep.value = 0
  investment_created.value = null
  // machinesearch.value = ""
  store.machine_selected = null;
  formData.value = {}
  initFields();

  setTimeout(() => {
    // machinesearch.value = ""
    window.jQuery("#addinvestmentform")[0].reset()
  }, 80)
}

// Lifecycle
onMounted(() => {
  initFields();
  get_machines_list()
})
</script>

<template>
  <div>
    <BaseOffcanvas 
      fullscreen position="end" oc-id="addinvestment" 
      :noClose="step > 0 && !investment_created"
      @onClose="($event) => activeStep <= 0 ? close_oc() : (activeStep = activeStep - 1)" 
      @onHidden="reset()"
      @onShown="initFields()"
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
            <div v-if="inSubmitting" class="t-overlay">
              <span class="spinner-border text-primary" role="status"></span>
            </div>

            <div v-if="investment_created" class="px-3 py-5 d-flex justify-content-center">
              <div class="text-center d-flex flex-column justify-content-center align-items-center">
                <CheckCircle style="color: green; font-size: 50px;" />
                <h3 class="mt-2 mb-1">Succès</h3>
                <p class="text-muted">Votre investissement à été enregistré avec succès.</p>
                
                <div class="mt-2 d-flex justify-content-center align-items-center gap-2">
                  <button class="btn btn-dark" @click.prevent="close_oc()" type="button">Retour</button>
                  <button class="btn btn-primary" @click.prevent="($event) => reset()" type="button">Investir encore</button>
                </div>
              </div>
            </div>
            <form v-else id="addinvestmentform" @submit.prevent="" class="px-4 mb-5">
              <div v-if="activeStep == 0" class="mt-3">
                
                <div class="mb-3">
                  <base-input label="Rechercher une machine" name="machinesearch" v-model="machinesearch" type="search" ph="Rechercher" />
                </div>

                <div class="mb-3">
                  <div v-if="appUtils.hasError('machine')" class="text-danger">
                    <span style="padding-right: 3px;">
                      <Information style="font-size: 18px;" />
                    </span>
                    <span>Veuillez sélectionner une machine</span>
                  </div>
                </div>

                <!-- machine -->
                <div v-if="!machines_options || machines_options.length == 0" class="p-3 text-center">
                  <p class="text-muted">Aucun résultat...</p>
                </div>
                <div>
                  <div class="submach">
                    <div v-for="(machine, index) in machines_options" :key="'Machine' + index" class="col-lg-4 col-6 machine-radio mb-2">
                      <input type="radio" name="machine" :id="'machine' + index" :value="machine.id" v-model="formData.machine" class="d-none" />
                      <label class="card text-center" :for="'machine' + index" type="button">
                        <img :src="machine?.image?.url" alt="Machine image" class="mb-1">
                        <p class="m-0 pt-2 pb-0 px-1 fw-bold">{{ machine.label }}</p>
                        <p class="m-0 pt-0 pb-3 px-1">{{ machine.amount }} USD pour {{ machine.rate }}%</p>
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              <div v-if="activeStep > 0" class="mt-3 mb-3">
                <base-input
                  v-for="field in currentStepFields"
                  :key="field.name"
                  :label="field.label"
                  :type="field.type"
                  :name="field.name"
                  v-model="formData[field.name]"
                  :ph="field.placeholder"
                  :options="field.options"
                  :field-error="appUtils.hasError(field.name)"
                  :required="field.required"
                  :readonly="field.readonly ?? false"
                  :autocomplete="field.autocomplete"
                />
              </div>

              <div class="position-sticky w-100 bottom-0 start-0 bg-white px-2 py-3">
                <div>
                  <base-button 
                    :disabled="inSubmitting" 
                    block 
                    fixh 
                    @click.prevent="goToStep()"
                  >
                    <span v-if="!inSubmitting">{{ isLastStep ? "Investir" : "Suivant" }}</span>
                    <span v-else class="gs-loader" role="status"></span>
                  </base-button>
                </div>
                
                <div v-if="activeStep > 0" class="my-3 text-center">
                  <button @click="($event) => activeStep = activeStep - 1" class="btn text-info2" type="button">Précédent</button>
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

.submach {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}
.submach .card {
  /* width: 100%;
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; */
}
.submach .machine-radio label {
  overflow: hidden;
  transition: .3s;
} 
.submach .machine-radio input:checked ~ label {
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
}
.submach .machine-radio label>img {
  display: block;
  width: 100%;
  height: 80px;
  object-fit: cover;
  background-color: #eee;
  transition: .3s;
}
.submach .machine-radio input:checked ~ label>img {
  background-color: #eee;
  opacity: 0.6;
}
</style>
