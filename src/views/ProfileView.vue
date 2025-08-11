<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import logo from '../assets/img/logo.svg'
import otp_verif from '../assets/img/otp_verif.svg'
import { useAppUtils } from '../composables/useAppUtils'
import { useMainStore } from '@/stores'
import { updateProfile } from '../services/auth';

const appUtils = useAppUtils();
const store = useMainStore()

let formData = ref({
  firstname: "",
  lastname: "",
  password: "",
  password_confirmation: "",
})

const user = computed(() => {
  return store.user;
})

watch(user, (newVal) => {
  formData.value = { ...newVal }
})

let inLoading = ref(true);
let inSubmitting = ref(false);
let activeStep = ref(0);
let previews = ref({});
let steps = ref([
  {
    label: "Profile",
    fields: [
      {
        name: 'firstname',
        label: 'Prénoms',
        type: 'text',
        placeholder: 'Entrer votre prénom',
        required: true,
        value: ""
      },
      {
        name: 'lastname',
        label: 'Nom',
        type: 'text',
        placeholder: 'Entrer votre nom',
        required: true,
        value: ""
      },
      {
        name: 'password',
        label: 'Mot de passe',
        type: 'password',
        placeholder: 'Entrer votre mot de passe',
        autocomplete: 'off',
        value: ""
      },
      {
        name: 'password_confirmation',
        label: 'Confirmer votre mot de passe',
        type: 'password',
        placeholder: 'Entrer à nouveau votre mot de passe',
        autocomplete: 'off',
        value: ""
      }
    ]
  }
]);


const initFields = async () => {
  steps.value.forEach((step) => {
    step?.fields?.forEach((field) => {
      if(field?.value != null && formData.value[field?.name] == null) {
        formData.value[field?.name] = field?.value;
      }
    })
  })

  formData.value = {
    ...formData.value,
    ...user.value,
  }
}

const submitRequest = async () => {
  let flag = 1;
  for(const st of steps.value) {
    flag *= appUtils.validateFields(st?.fields ?? [], formData.value);
  }

  if(flag == 0) return;

  if(formData.value.password && formData.value.password != formData.value.password_confirmation) {
    appUtils.toggleGlobalAlert("Les mots de passe ne correspondent pas.", "error");
    return;
  }
  
  inSubmitting.value = true;

  // let finalFormData = new FormData();
  let fields = [];

  for(const step of steps.value) {
    fields.push(...step.fields);
  }

  const response = await updateProfile(formData.value);
  if(response && response?.user) {
    store.user = { ...response?.user };
  }

  inSubmitting.value = false;
}

const goToStep = (step = null) => {
  const finalStep = step ?? activeStep.value + 1;
  let flag = 1;

  if(finalStep > activeStep.value) {
    flag *= appUtils.validateFields(steps.value[activeStep.value]?.fields ?? [], formData.value);
  }

  if(flag == 0) return;

  if(activeStep.value < steps.value.length - 1) {
    activeStep.value = finalStep;
    return;
  }

  submitRequest();
}

onMounted(() => {
  initFields();
})
</script>

<template>
  <div>
    <main-layout>
      <div class="p-3 profile-ctn">
        <div class="avatar">{{ user ? user?.firstname?.split('')[0] : '.' }}</div>

        <div class="accordion mt-4" id="profileAccordion">
          <div class="accordion-item">
            <h2 class="accordion-header" id="privateInfo">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#privateInfoCollapse" aria-expanded="true" aria-controls="privateInfoCollapse">
                Informations personnelles
              </button>
            </h2>
            <div id="privateInfoCollapse" class="accordion-collapse collapsed show" aria-labelledby="privateInfo" data-bs-parent="#profileAccordion">
              <div class="accordion-body">
                <div>
                  <base-input
                    v-for="field in (steps[activeStep]?.fields ?? [])"
                    :key="field.name"
                    :label="field.label"
                    :type="field.type"
                    :name="field.name"
                    v-model="formData[field.name]"
                    :ph="field.placeholder"
                    :field-error="appUtils.hasError(field.name)"
                    :required="field.required"
                    :autocomplete="field.autocomplete"
                  />
                </div>

                <div class="w-100 d-flex justify-content-end">
                  <base-button :disabled="inSubmitting" fixh @click.prevent="goToStep()">
                    <span v-if="!inSubmitting">Enregistrer</span>
                    <span v-else class="gs-loader" role="status"></span>
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main-layout>
  </div>
</template>

<style scoped>
.profile-ctn {
  max-width: 800px;
  margin: auto;
}
.avatar {
    background-color: #00678F;
    color: white;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    border-radius: 50%;
    margin: 20px auto;
}
</style>