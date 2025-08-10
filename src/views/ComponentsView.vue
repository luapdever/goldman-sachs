<script setup>

import TheSection from '../components/global/TheSection.vue';

</script>

<template>
  <div>
    <main-layout white>
      <div>{{ input }}</div>
      <div class="p-3">
        <TheSection title="Statistiques du jour" linkTo="/" linkText="Tous">
          <div>
            <base-input label="Input" name="input" v-model="input" type="text" />
            <base-input label="Number" name="input" type="number" required field-error="Champ requis" />
            <base-input label="Text Area" name="input" type="textarea" required field-error="Champ requis" />

            <base-input label="Select" name="input" type="select" :options="options" />

            <base-input label="Radio" name="input" type="radio" />
          </div>
        </TheSection>

        <base-card>Hello</base-card>
      </div>
    </main-layout>
  </div>
</template>

<script>
export default {
    data() {
        return {
            input: "Hello",
            options: [
              { label: "Hello", value: 'hell' }
            ]
        };
    },
    components: { TheSection }
}
</script>
