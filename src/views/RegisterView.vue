<script setup>
// import logo from '../assets/img/logo.svg'
import otp_verif from '../assets/img/otp_verif.svg'

import { onMounted, ref, watch } from 'vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { useAppUtils } from '../composables/useAppUtils';
import { signUp } from '../services/auth';
import { Check } from 'mdue';
import { useRouter } from 'vue-router';

const appUtils = useAppUtils();
const router = useRouter();

let inLoading = ref(true);
let inSubmitting = ref(false);
let activeStep = ref(0);
let formData = ref({});
let previews = ref({});
let steps = ref([
  {
    label: "Register",
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
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Entrer email',
        required: true,
        autocomplete: 'off',
        value: ""
      },
      {
        name: 'password',
        label: 'Mot de passe',
        type: 'password',
        placeholder: 'Entrer votre mot de passe',
        required: true,
        autocomplete: 'off',
        value: ""
      },
      {
        name: 'password_confirmation',
        label: 'Confirmer votre mot de passe',
        type: 'password',
        placeholder: 'Entrer à nouveau votre mot de passe',
        required: true,
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
}

const scrollToCtn = () => {
  window.jQuery([document.documentElement, document.body]).animate({
    scrollTop: window.jQuery("#supplierCtn").offset().top - 200
  }, 10);
}

const submitRequest = async () => {
  let flag = 1;
  for(const st of steps.value) {
    flag *= appUtils.validateFields(st?.fields ?? [], formData.value);
  }

  if(flag == 0) return;

  if(formData.value.password != formData.value.password_confirmation) {
    appUtils.toggleGlobalAlert("Les mots de passe ne correspondent pas.", "error");
    return;
  }
  
  inSubmitting.value = true;

  // let finalFormData = new FormData();
  let fields = [];

  for(const step of steps.value) {
    fields.push(...step.fields);
  }

  const response = await signUp(formData.value);
  if(response && response?.user) {
    // scrollToCtn();
    router.push({ name: 'login' })
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
    // scrollToCtn();
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
    <main-layout white blank fixed>
      <form @submit.prevent="goToStep()" class="register-ctn w-100 vh-100 p-3 d-flex justify-content-center align-items-center flex-column">
        <div v-if="activeStep == 0" class="w-100">
          <div class="text-center">
            <h2 class="mt-3">Inscription - <span class="fw-bold">Goldman</span> Sachs</h2>
            <p class="mt-1 px-4">
              Veuillez entrer vos informations pour vous inscrire.
            </p>
          </div>
          <div class="mt-3">
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
        </div>
  
        <div class="w-100 text-center">
          <base-button :disabled="inSubmitting" block fixh @click.prevent="goToStep()">
            <span v-if="!inSubmitting">Connexion</span>
            <span v-else class="gs-loader" role="status"></span>
          </base-button>
          <div class="mt-3">J'ai déjà un compte. <router-link :to="{ name: 'login' }" class="btn-link">Connectez-vous</router-link></div>
        </div>
      </form>
    </main-layout>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
@media (min-width: 500px) {
  .register-ctn {
    max-width: 450px;
    margin: auto;
  }
}

</style>