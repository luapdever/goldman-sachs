<template>
  <div 
    class="offcanvas" :class="{ 
      'offcanvas-end': /* !position &&  */windowWidth > 576, 
      'offcanvas-bottom': /* !position &&  */windowWidth <= 576, 
      // ['offcanvas-'+position]: true,
      fullscreen,
      'header-light': headerLight
    }" 
    tabindex="-1" 
    :id="ocId" 
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    :aria-labelledby="ocId+'Label'"
  >
    <div v-if="!$slots['oc-in-overlay'] && showOverlay" class="mv-overlay x3 rounded">
      <span class="mv-loader primary"></span>
    </div>
    <slot v-else-if="showOverlay" name="oc-in-overlay"></slot>
    
    <div class="offcanvas-header" :class="{ 'bg-black text-center': dark }">
      <h5 class="offcanvas-title">
        <slot name="oc-header"></slot>
      </h5>
      <button type="button" :disabled="showOverlay" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <slot name="oc-body"></slot>
    </div>
    
    <div v-if="$slots['oc-footer']" class="offcanvas-footer p-3 border-top">
      <slot name="oc-footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ocId: String,
    position: String,
    fullscreen: Boolean,
    headerLight: Boolean,
    hideCloseBtn: Boolean,
    noClose: Boolean,
    showOverlay: Boolean,
    dark: Boolean,
  },
  computed: {
    windowWidth() {
      return window.innerWidth;
    }
  },
  mounted() {
    var self = this;    
    var offcanvasElement = document.getElementById(self.ocId);

    // console.log(offcanvasElement);
    // console.log(this.ocId + " mounted");

    offcanvasElement.addEventListener('show.bs.offcanvas', function() {
      // console.log(self.ocId+" show");
      self.$emit('onShow');
    });

    offcanvasElement.addEventListener('shown.bs.offcanvas', function() {
      // console.log(self.ocId+" shown");
      self.$emit('onShown');
    });

    offcanvasElement.addEventListener('hide.bs.offcanvas', function() {
      // console.log(self.ocId+" hide");
      self.$emit('onHide');
    });

    offcanvasElement.addEventListener('hidden.bs.offcanvas', function() {
      // console.log(self.ocId+" hidden");
      self.$emit('onHidden');
    });
  },
}
</script>

<style scoped>
.offcanvas.header-light .offcanvas-header {
  background-color: white;
}
.offcanvas.header-light .offcanvas-body {
  background-color: #F3F3F1;
}
.offcanvas .offcanvas-footer {
  background-color: #ffffff;
}
/* .offcanvas-header .btn-close {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  opacity: 1;
}
.offcanvas.offcanvas-bottom .offcanvas-header .btn-close {
  right: 25px;
  top: -40px;
}
.offcanvas.offcanvas-end .offcanvas-header .btn-close {
  left: -45px;
  top: 25px;
} */
</style>