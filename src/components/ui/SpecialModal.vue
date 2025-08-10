<template>
  <div 
    class="modal fade" :class="{ 
      'header-light': headerLight,
      'primary': primary,
    }" 
    tabindex="-1" 
    :id="mdId" 
    :aria-labelledby="mdId+'Label'"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div 
      class="modal-dialog" 
      :class="{
        'modal-dialog-centered': centered, 
        'modal-dialog-scrollable': scrollable
      }"
    >
      <div class="modal-content">
        <div v-if="!$slots['md-in-overlay'] && showOverlay" class="mv-overlay x3 rounded">
          <span class="mv-loader primary"></span>
        </div>
        <slot v-else-if="showOverlay" name="md-in-overlay"></slot>

        <div class="modal-header" :class="{ 'bg-black text-white': dark }">
          <h5 class="modal-title">
            <slot name="md-header"></slot>
          </h5>
          <button type="button" :disabled="showOverlay" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot name="md-body"></slot>
        </div>
        
        <div v-if="$slots['md-footer']"  class="modal-footer p-3 border-top">
          <slot name="md-footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mdId: String,
    headerLight: Boolean,
    primary: Boolean,
    noClose: Boolean,
    centered: Boolean,
    scrollable: Boolean,
    dark: Boolean,
    showOverlay: Boolean,
  },
  computed: {
    windowWidth() {
      return window.innerWidth;
    }
  },
  mounted() {
    var self = this;    
    var modalElement = document.getElementById(self.mdId);

    // console.log(modalElement);
    // console.log(this.mdId + " mounted");

    modalElement.addEventListener('show.bs.modal', function() {
      // console.log(self.mdId+" show");
      self.$emit('onShow');
    });

    modalElement.addEventListener('shown.bs.modal', function() {
      // console.log(self.mdId+" shown");
      self.$emit('onShown');
    });

    modalElement.addEventListener('hide.bs.modal', function() {
      // console.log(self.mdId+" hide");
      self.$emit('onHide');
    });

    modalElement.addEventListener('hidden.bs.modal', function() {
      // console.log(self.mdId+" hidden");
      self.$emit('onHidden');
    });
  },
}
</script>

<style scoped>
.modal.header-light .modal-header {
  background-color: white;
}
.modal.header-light .modal-body {
  background-color: #F3F3F1;
}
</style>