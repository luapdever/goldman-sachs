<script setup>
import { useLang } from '@/composables/useLang';
import NavTabPane from './NavTabPane.vue';


const l = useLang();

defineProps({
  items: {
    type: Array,
    default: () => [
      {
        id: 'default',
        label: 'Default Tab',
        active: true,
      }
    ]
  },
  labelName: {
    type: String,
    default: "label"
  },
  tabId: {
    type: String,
    default: "tabExample"
  },
  tabPrefix: {
    type: String,
    default: ""
  },
  tabPanesId: {
    type: String,
    default: "id"
  },
  tabSticky: {
    type: Boolean,
  },
  active: {
    type: Number,
    default: 0
  },
})

</script>

<template>
  <div>
    <div class="bg-white mb-3" :class="{ 'tab-sticky': tabSticky }" style="box-shadow: 0px 2px 6px 0px #00000026;">
      <div class="container">
        <ul class="nav nav-pills special-tab" :id="tabId" role="tablist">
          <li v-for="(item, index) in items" :key="`Tab item ${index}`" class="nav-item" role="presentation">
            <button v-if="!item.link" class="nav-link" :class="{ active: item.active || index == active }" :id="`${tabPrefix + item[tabPanesId]}-tab`" data-bs-toggle="pill" :data-bs-target="`#${tabPrefix + item[tabPanesId]}`" type="button" role="tab" :aria-controls="tabPrefix + item[tabPanesId]" aria-selected="true">
              {{ item.lg ? l.data[item.lg] : l._s(item[labelName]) }}
            </button>
            <router-link v-else :to="item.link" class="nav-link" :class="{ active: item.active || index == active }" :id="`${tabPrefix + item[tabPanesId]}-tab`">
              {{ item.lg ? l.data[item.lg] : l._s(item[labelName]) }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="container">
      <slot />
      <div class="tab-content" id="bundles-tabContent">
        <template v-if="$slots.paneslist">
          <slot name="paneslist"></slot>
        </template>
        <template v-else>
          <NavTabPane 
            v-for="(tab, index) in items" 
            :key="`Tab item ${index}`" 
            :active="tab.active || index == active" 
            :pane-id="tabPrefix + tab[tabPanesId]"
          >
            <slot :name="tabPrefix + tab[tabPanesId]"></slot>
          </NavTabPane>
        </template>
      </div>
    </div>
  </div>
</template>
