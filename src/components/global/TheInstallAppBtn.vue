<template>
  <div>
    <transition name="fade">
      <div v-if="showInstallButton" class="w-100 install-app" @click.self="showInstallButton = false">
        <div class="d-flex flex-column justify-content-center align-items-center text-center py-4 px-3">
          <p>
            Bénéficiez d'une <strong>meilleure expérience</strong> en installant l'application. <br />
            <template v-if="isInIoS">
              <p class="m-0 mt-1">Pour installer, appuyez sur <strong>Partager</strong> puis <strong>"Sur l'écran d'accueil"</strong> 📲</p>
            </template>
          </p>
          <div>
            <base-button v-if="isInIoS" dark @click="installPWAOnIOS">OK, j'ai compris</base-button>
            <base-button v-else dark @click="installPWA">Installer</base-button>

            <button @click="showInstallButton = false" class="btn">Ignorer</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showInstallButton: false,
      deferredPrompt: null
    }
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);

    const isInstalledOnIOS = localStorage.getItem("is_installed_on_ios");

    if(this.isInIoS && !isInstalledOnIOS) {
      this.showInstallButton = true;
    }
  },
  computed: {
    isInIoS() {
      return this.isIos() && !this.isInStandaloneMode();
    }
  },
  methods: {
    isIos() {
      return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    },
    isInStandaloneMode() {
      return ('standalone' in window.navigator) && window.navigator.standalone;
    },
    onBeforeInstallPrompt(event) {
      event.preventDefault();

      if(window.innerWidth > 768) return;

      this.deferredPrompt = event

      this.showInstallButton = true
    },
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt()

        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log("L'utilisateur a accepté l'installation")
            this.showInstallButton = false;
          } else {
            console.log("L'utilisateur a refusé l'installation")
          }

        })
      } else {
        this.showInstallButton = false;
      }
    },
    installPWAOnIOS() {
      this.showInstallButton = false;

      localStorage.setItem("is_installed_on_ios", "true");
    }
  }
}
</script>

<style scoped>
@keyframes animateDCtn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes animateDCtnDIV {
  0% {
    transform: translate(-50%, 0%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

.install-app {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fc0;
}

.install-app {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh !important;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(7.5px);
  animation: animateDCtn .2s linear;
}
.install-app>div {
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 85%;
  max-width: 450px;
  max-height: 80vh;
  background-color: white;
  border-radius: 30px;
  padding: 15px;
  box-shadow: 0px 0px 5px #00000033;
  animation: animateCCtnDIV .2s linear;
}
</style>