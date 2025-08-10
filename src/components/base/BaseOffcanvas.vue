<script setup>

import { KeyboardBackspace } from 'mdue'

</script>

<template>
    <div 
      class="offcanvas" :class="{ 
        'offcanvas-end': !position && windowWidth > 768, 
        'offcanvas-bottom': !position && windowWidth <= 768, 
        ['offcanvas-'+position]: true,
        fullscreen,
        'header-light': headerLight
      }" 
      data-bs-backdrop="static"
      tabindex="-1" 
      :id="ocId" 
      :aria-labelledby="ocId+'Label'"
    >
      <div class="offcanvas-header">
        <div type="button" class="w-100 d-flex align-items-center gap-2">
          <div type="button" v-if="fullscreen && !hideCloseBtn" @click="($event) => noClose ? $emit('onClose') : null" :data-bs-dismiss="noClose ? '' : 'offcanvas'">
            <KeyboardBackspace style="font-size: 25px;" />
          </div>
          <slot name="oc-header"></slot>
        </div>
        <button v-if="!fullscreen" type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <slot name="oc-body"></slot>
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
.offcanvas.offcanvas-bottom {
  border-radius: 8px 8px 0 0;
  height: 65%;
}
.offcanvas {
  z-index: 999999;
}
.offcanvas .offcanvas-header {
  background-color: var(--color-primary);
}
.offcanvas.header-light .offcanvas-header {
  background-color: white;
}
.offcanvas.offcanvas-bottom .offcanvas-header{
  border-radius: 8px 8px 0 0;
}
.offcanvas .offcanvas-body {
  padding: 0;
}
.offcanvas.header-light .offcanvas-body {
  background-color: #F3F3F1;
}
.offcanvas-header .btn-close {
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
}

.offcanvas.fullscreen {
  max-width: 700px;
  width: 100%;
  height: 100%;
}
</style>