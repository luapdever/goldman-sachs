<script setup>

const l = useLang();

const props = defineProps({
  pages: Array,
  bgNone: Boolean,
});

</script>

<template>
  <div id="page_breadcrumb" :class="{ 'bg-none': bgNone }">
    <div class="container">
      <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li 
            v-for="(p, index) in pages" :key="'Brc' + index" 
            class="breadcrumb-item" :class="{ active: index === pages?.length - 1 }"
            :aria-current="index === pages?.length - 1 ? 'page' : null"
          >
            <span v-if="index === pages?.length - 1">{{ p.label }}</span>
            <nuxt-link v-else class="text-decoration-none" :to="p.to">
              {{ p.label }}
            </nuxt-link>
          </li>
        </ol>
      </nav>

      <div v-if="pages && pages?.length > 0" id="page_title">
        <h1 class="m-0 p-0">{{ pages[pages?.length - 1].label ?? l.data.home_label }}</h1>
      </div>

      <slot />
    </div>
  </div>
</template>
