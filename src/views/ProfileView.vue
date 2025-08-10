<script setup>
import logo from '../assets/img/logo.svg'
import otp_verif from '../assets/img/otp_verif.svg'
</script>

<template>
  <div>
    <main-layout>
      <div class="p-3 profile-ctn">
        <div class="avatar">{{ user ? user.fullname.split('')[0] : '.' }}</div>

        <div class="accordion mt-4" id="profileAccordion">
          <div class="accordion-item">
            <h2 class="accordion-header" id="privateInfo">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#privateInfoCollapse" aria-expanded="true" aria-controls="privateInfoCollapse">
                Informations personnelles
              </button>
            </h2>
            <div id="privateInfoCollapse" class="accordion-collapse collapsed show" aria-labelledby="privateInfo" data-bs-parent="#profileAccordion">
              <div class="accordion-body">
                <base-input label="Nom complet" name="fullname" type="text" :ph="user.fullname" disabled />
                <base-input label="Téléphone" name="phone" type="text" :ph="user.phone" disabled />
                <base-input label="Entreprise" name="company" type="text" :ph="user.company" disabled />
                <base-input label="Région" name="region" type="text" :ph="user.region" disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    user() {
      return store.user;
    }
  },
  mounted() {
    
  },
  methods: {
    
  }
}
</script>

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