<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { useAppUtils } from '../composables/useAppUtils';
import { forgotPassword, verifyResetOtp, resetPassword } from '../services/auth';

const appUtils = useAppUtils();
const router = useRouter();

const inSubmitting = ref(false);
const activeStep = ref(0); // 0: email, 1: code, 2: nouveau mot de passe
const formData = ref({
  email: '',
  code: '',
  password: '',
  passwordConfirmation: '',
});

const requestOtp = async (resend = false) => {
  if (!formData.value.email) {
    appUtils.toggleGlobalAlert('Veuillez saisir votre adresse email.', 'danger');
    return;
  }

  inSubmitting.value = true;
  try {
    const res = await forgotPassword(formData.value.email);
    if (res?.ok) {
      if (!resend) activeStep.value = 1;
      appUtils.toggleGlobalAlert(
        resend ? 'Un nouveau code a été envoyé.' : 'Un code a été envoyé à votre adresse email.',
        'success'
      );
    }
  } catch (e) {
    console.error(e);
  } finally {
    inSubmitting.value = false;
  }
};

const verifyCode = async () => {
  if (!formData.value.code || String(formData.value.code).trim().length < 6) {
    appUtils.toggleGlobalAlert('Veuillez saisir le code à 6 chiffres.', 'danger');
    return;
  }

  inSubmitting.value = true;
  try {
    const res = await verifyResetOtp(formData.value.email, formData.value.code);
    if (res?.ok) {
      activeStep.value = 2;
    }
  } catch (e) {
    console.error(e);
  } finally {
    inSubmitting.value = false;
  }
};

const submitNewPassword = async () => {
  if (!formData.value.password || formData.value.password.length < 6) {
    appUtils.toggleGlobalAlert('Le mot de passe doit contenir au moins 6 caractères.', 'danger');
    return;
  }
  if (formData.value.password !== formData.value.passwordConfirmation) {
    appUtils.toggleGlobalAlert('Les mots de passe ne correspondent pas.', 'danger');
    return;
  }

  inSubmitting.value = true;
  try {
    const res = await resetPassword({
      email: formData.value.email,
      code: formData.value.code,
      password: formData.value.password,
      passwordConfirmation: formData.value.passwordConfirmation,
    });

    if (res?.ok) {
      appUtils.toggleGlobalAlert('Mot de passe réinitialisé avec succès.', 'success');
      if (res?.jwt) {
        appUtils.utils_set_cookies('access_tchavi', res.jwt, 60 * 3);
        router.replace({ name: 'dashboard' });
      } else {
        router.replace({ name: 'login' });
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    inSubmitting.value = false;
  }
};

const onSubmit = () => {
  if (activeStep.value === 0) return requestOtp(false);
  if (activeStep.value === 1) return verifyCode();
  return submitNewPassword();
};
</script>

<template>
  <div>
    <main-layout white blank fixed>
      <form
        @submit.prevent="onSubmit()"
        class="forgot-ctn w-100 vh-100 p-3 d-flex justify-content-center align-items-center flex-column"
      >
        <div class="w-100">
          <div class="text-center">
            <h1 class="oy-brand mt-3">OYOYO</h1>
            <p class="oy-tagline mt-1 px-4">Mot de passe oublié</p>
          </div>

          <!-- Étape 1 : email -->
          <div v-if="activeStep === 0" class="mt-3">
            <p class="step-hint">Saisissez l'adresse email associée à votre compte. Nous vous enverrons un code de vérification.</p>
            <base-input
              label="Email"
              type="email"
              name="email"
              v-model="formData.email"
              ph="Entrer votre email"
              autocomplete="email"
              :required="true"
            />
          </div>

          <!-- Étape 2 : code OTP -->
          <div v-else-if="activeStep === 1" class="mt-3">
            <p class="step-hint">Un code à 6 chiffres a été envoyé à <span class="fw-bold">{{ formData.email }}</span>. Saisissez-le ci-dessous.</p>
            <base-input
              label="Code de vérification"
              type="text"
              name="code"
              v-model="formData.code"
              ph="000000"
              autocomplete="one-time-code"
              :required="true"
            />
            <div class="text-center mt-2">
              <button type="button" class="btn btn-link p-0" :disabled="inSubmitting" @click="requestOtp(true)">
                Renvoyer le code
              </button>
            </div>
          </div>

          <!-- Étape 3 : nouveau mot de passe -->
          <div v-else class="mt-3">
            <p class="step-hint">Choisissez votre nouveau mot de passe.</p>
            <base-input
              label="Nouveau mot de passe"
              type="password"
              name="password"
              v-model="formData.password"
              ph="Au moins 6 caractères"
              autocomplete="new-password"
              :required="true"
            />
            <base-input
              label="Confirmer le mot de passe"
              type="password"
              name="passwordConfirmation"
              v-model="formData.passwordConfirmation"
              ph="Confirmer le mot de passe"
              autocomplete="new-password"
              :required="true"
            />
          </div>
        </div>

        <div class="w-100 text-center">
          <base-button :disabled="inSubmitting" block fixh @click.prevent="onSubmit()">
            <span v-if="!inSubmitting">
              {{ activeStep === 0 ? 'Envoyer le code' : (activeStep === 1 ? 'Vérifier' : 'Réinitialiser') }}
            </span>
            <span v-else class="gs-loader" role="status"></span>
          </base-button>

          <div v-if="activeStep > 0" class="mt-2">
            <button type="button" class="btn btn-link p-0" @click="activeStep = activeStep - 1">Précédent</button>
          </div>

          <div class="mt-3">
            <router-link :to="{ name: 'login' }" class="btn-link">Retour à la connexion</router-link>
          </div>
        </div>
      </form>
    </main-layout>
  </div>
</template>

<style scoped>
@media (min-width: 500px) {
  .forgot-ctn {
    max-width: 450px;
    margin: auto;
  }
}
.step-hint {
  font-size: 14px;
  color: var(--oy-text-muted);
  text-align: center;
  margin-bottom: 18px;
}
</style>
