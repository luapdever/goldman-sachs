<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { useAppUtils } from '../composables/useAppUtils';
import { signIn } from '../services/auth';

// Composables
const appUtils = useAppUtils();
const router = useRouter();

// État réactif
const inLoading = ref(true);
const inSubmitting = ref(false);
const activeStep = ref(0);
const formData = ref({});

// Configuration des étapes de connexion
const steps = ref([
  {
    label: "Login",
    fields: [
      {
        name: 'identifier',
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
      }
    ]
  }
]);

// Computed
const currentStepFields = computed(() => steps.value[activeStep.value]?.fields ?? []);
const isLastStep = computed(() => activeStep.value === steps.value.length - 1);

// Méthodes
const initFields = () => {
  steps.value.forEach((step) => {
    step?.fields?.forEach((field) => {
      if (field?.value != null && formData.value[field?.name] == null) {
        formData.value[field?.name] = field?.value;
      }
    });
  });
};

const scrollToCtn = () => {
  window.jQuery([document.documentElement, document.body]).animate({
    scrollTop: window.jQuery("#supplierCtn").offset().top - 200
  }, 10);
};

const validateCurrentStep = () => {
  return appUtils.validateFields(steps.value[activeStep.value]?.fields ?? [], formData.value);
};

const handleLoginSuccess = (response) => {
  if (response?.jwt && response?.user) {
    appUtils.utils_set_cookies("access_tchavi", response.jwt, 60 * 3);
    router.replace({ name: 'dashboard' });
  }
};

const submitRequest = async () => {
  // Validation de tous les steps
  let flag = 1;
  for (const st of steps.value) {
    flag *= appUtils.validateFields(st?.fields ?? [], formData.value);
  }

  if (flag === 0) return;

  inSubmitting.value = true;

  try {
    const response = await signIn(formData.value);
    handleLoginSuccess(response);
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
  } finally {
    inSubmitting.value = false;
  }
};

const goToStep = (step = null) => {
  const finalStep = step ?? activeStep.value + 1;

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

// Lifecycle
onMounted(() => {
  initFields();
});
</script>

<template>
  <div>
    <main-layout white blank fixed>
      <form @submit.prevent="goToStep()" class="login-ctn w-100 vh-100 p-3 d-flex justify-content-center align-items-center flex-column">
        <div v-if="activeStep === 0" class="w-100">
          <div class="text-center">
            <h2 class="mt-3">
              <span class="fw-bold">Goldman</span> Sachs
            </h2>
            <p class="mt-1 px-4">
              Bienvenue !<br />
              Veuillez entrer vos informations pour vous connecter.
            </p>
          </div>
          <div class="mt-3">
            <base-input
              v-for="field in currentStepFields"
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
          <base-button 
            :disabled="inSubmitting" 
            block 
            fixh 
            @click.prevent="goToStep()"
          >
            <span v-if="!inSubmitting">Connexion</span>
            <span v-else class="gs-loader" role="status"></span>
          </base-button>
          <div class="mt-3">
            Nouveau ? 
            <router-link :to="{ name: 'register' }" class="btn-link">
              Créer un compte
            </router-link>
          </div>
        </div>
      </form>
    </main-layout>
  </div>
</template>

<style scoped>
@media (min-width: 500px) {
  .login-ctn {
    max-width: 450px;
    margin: auto;
  }
}
</style>