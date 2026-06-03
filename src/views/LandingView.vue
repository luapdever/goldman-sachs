<script setup>
import { ref } from 'vue'

// FAQ
const faqs = ref([
  {
    q: "Qu'est-ce que Oyoyo ?",
    a: "Oyoyo est une plateforme d'investissement qui vous permet de faire fructifier votre capital en souscrivant à des machines de rendement. Vous choisissez une machine, vous investissez, et vous suivez vos gains depuis votre tableau de bord.",
    open: true,
  },
  {
    q: "Comment fonctionne un investissement ?",
    a: "Vous sélectionnez une machine correspondant à votre budget, vous indiquez votre moyen de paiement, vous effectuez le dépôt à l'adresse fournie, puis vous téléversez la capture de votre paiement. Votre investissement est ensuite validé et activé.",
    open: false,
  },
  {
    q: "Quels moyens de paiement sont acceptés ?",
    a: "Vous pouvez déposer via Binance Pay ou via un wallet crypto (USDT). Les instructions et l'adresse de dépôt s'affichent automatiquement selon le moyen choisi lors de votre investissement.",
    open: false,
  },
  {
    q: "Mes données et mes fonds sont-ils en sécurité ?",
    a: "Chaque dépôt est tracé et confirmé avant activation. Vos informations de compte sont protégées et accessibles uniquement depuis votre espace personnel sécurisé.",
    open: false,
  },
  {
    q: "Comment suivre mes gains ?",
    a: "Une fois connecté, votre tableau de bord affiche en temps réel vos investissements, le montant total investi et l'état de chaque opération.",
    open: false,
  },
])

const toggleFaq = (i) => {
  faqs.value[i].open = !faqs.value[i].open
}

const utilities = ref([
  { icon: '💎', title: 'Rendements attractifs', text: "Des machines de 10 % à 55 % de rendement selon le montant investi." },
  { icon: '⚡', title: 'Simple et rapide', text: "Investissez en quelques étapes, sans paperasse, directement depuis votre téléphone." },
  { icon: '🔒', title: 'Dépôts sécurisés', text: "Chaque paiement est confirmé par une preuve avant activation de votre investissement." },
  { icon: '📈', title: 'Suivi en temps réel', text: "Visualisez vos gains et l'état de vos investissements à tout moment." },
])

const steps = ref([
  { n: '01', title: 'Créez votre compte', text: "Inscrivez-vous gratuitement en quelques secondes avec votre email." },
  { n: '02', title: 'Choisissez une machine', text: "Sélectionnez la machine adaptée à votre budget et à vos objectifs." },
  { n: '03', title: 'Déposez & investissez', text: "Effectuez votre dépôt, joignez la preuve, et suivez vos rendements." },
])
</script>

<template>
  <div class="oy-landing">
    <!-- NAV -->
    <header class="oy-nav">
      <div class="oy-container oy-nav-inner">
        <router-link :to="{ name: 'home' }" class="oy-logo">
          <img src="/oyoyo-logo.svg" alt="Oyoyo" width="34" height="34" />
          <span>OYOYO</span>
        </router-link>
        <nav class="oy-nav-links">
          <a href="#histoire">À propos</a>
          <a href="#inscription">Inscription</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div class="oy-nav-cta">
          <router-link :to="{ name: 'login' }" class="oy-btn oy-btn-ghost">Connexion</router-link>
          <router-link :to="{ name: 'register' }" class="oy-btn oy-btn-gold">S'inscrire</router-link>
        </div>
      </div>
    </header>

    <!-- HERO -->
    <section class="oy-hero">
      <div class="oy-hero-bg"></div>
      <div class="oy-container oy-hero-inner">
        <div class="oy-hero-text">
          <span class="oy-badge">Plateforme d'investissement</span>
          <h1>Faites fructifier votre capital avec <span class="oy-gold-text">Oyoyo</span></h1>
          <p>
            Investissez dans des machines de rendement, suivez vos gains en temps réel
            et atteignez vos objectifs financiers — simplement, en toute sécurité.
          </p>
          <div class="oy-hero-actions">
            <router-link :to="{ name: 'register' }" class="oy-btn oy-btn-gold oy-btn-lg">Commencer maintenant</router-link>
            <a href="#histoire" class="oy-btn oy-btn-ghost oy-btn-lg">En savoir plus</a>
          </div>
          <div class="oy-hero-stats">
            <div><strong>10–55 %</strong><span>de rendement</span></div>
            <div><strong>10</strong><span>machines</span></div>
            <div><strong>24/7</strong><span>support</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- HISTOIRE & UTILITÉS -->
    <section id="histoire" class="oy-section">
      <div class="oy-container">
        <span class="oy-eyebrow">Notre histoire</span>
        <h2 class="oy-section-title">Pourquoi Oyoyo ?</h2>
        <p class="oy-section-lead">
          Oyoyo est né d'une idée simple : rendre l'investissement accessible à tous.
          Là où les placements traditionnels sont complexes et réservés à une minorité,
          Oyoyo propose une expérience claire, transparente et mobile — pour que chacun
          puisse faire travailler son argent, quel que soit son budget de départ.
        </p>

        <div class="oy-grid">
          <div v-for="(u, i) in utilities" :key="'u'+i" class="oy-card">
            <div class="oy-card-icon">{{ u.icon }}</div>
            <h3>{{ u.title }}</h3>
            <p>{{ u.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- COMMENT S'INSCRIRE -->
    <section id="inscription" class="oy-section oy-section-alt">
      <div class="oy-container">
        <span class="oy-eyebrow">Démarrage</span>
        <h2 class="oy-section-title">Comment s'inscrire</h2>
        <p class="oy-section-lead">Trois étapes suffisent pour lancer votre premier investissement.</p>

        <div class="oy-steps">
          <div v-for="(s, i) in steps" :key="'s'+i" class="oy-step">
            <div class="oy-step-n">{{ s.n }}</div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </div>
        </div>

        <div class="oy-center">
          <router-link :to="{ name: 'register' }" class="oy-btn oy-btn-gold oy-btn-lg">Créer mon compte</router-link>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="oy-section">
      <div class="oy-container oy-container-narrow">
        <span class="oy-eyebrow">Questions fréquentes</span>
        <h2 class="oy-section-title">FAQ</h2>

        <div class="oy-faq">
          <div v-for="(f, i) in faqs" :key="'f'+i" class="oy-faq-item" :class="{ open: f.open }">
            <button class="oy-faq-q" @click="toggleFaq(i)">
              <span>{{ f.q }}</span>
              <span class="oy-faq-chevron">{{ f.open ? '−' : '+' }}</span>
            </button>
            <div v-show="f.open" class="oy-faq-a">{{ f.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="oy-cta">
      <div class="oy-container oy-cta-inner">
        <h2>Prêt à investir avec Oyoyo ?</h2>
        <p>Rejoignez la plateforme et commencez à faire fructifier votre capital dès aujourd'hui.</p>
        <router-link :to="{ name: 'register' }" class="oy-btn oy-btn-gold oy-btn-lg">S'inscrire gratuitement</router-link>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="oy-footer">
      <div class="oy-container oy-footer-inner">
        <div class="oy-logo">
          <img src="/oyoyo-logo.svg" alt="Oyoyo" width="28" height="28" />
          <span>OYOYO</span>
        </div>
        <div class="oy-footer-links">
          <a href="#histoire">À propos</a>
          <a href="#inscription">Inscription</a>
          <a href="#faq">FAQ</a>
          <router-link :to="{ name: 'login' }">Connexion</router-link>
        </div>
        <div class="oy-footer-copy">© {{ new Date().getFullYear() }} Oyoyo. Tous droits réservés.</div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.oy-landing {
  background: var(--oy-bg);
  color: var(--oy-text);
  min-height: 100vh;
  overflow-x: hidden;
}
.oy-container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
}
.oy-container-narrow { max-width: 760px; }
.oy-gold-text {
  background: var(--oy-gold-grad);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--oy-gold);
}

/* Boutons */
.oy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: .25s;
  cursor: pointer;
  border: 1px solid transparent;
}
.oy-btn-lg { padding: 14px 28px; font-size: 15px; }
.oy-btn-gold {
  background: var(--oy-gold-grad);
  color: var(--oy-bg);
  box-shadow: var(--oy-shadow-gold);
}
.oy-btn-gold:hover { filter: brightness(1.06); transform: translateY(-1px); }
.oy-btn-ghost {
  background: transparent;
  color: var(--oy-text);
  border-color: var(--oy-border);
}
.oy-btn-ghost:hover { border-color: var(--oy-gold); color: var(--oy-gold); }

/* NAV */
.oy-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(11, 11, 13, 0.82);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--oy-border);
}
.oy-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}
.oy-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--oy-text);
  font-weight: 800;
  letter-spacing: 0.18em;
}
.oy-logo span { color: var(--oy-gold); }
.oy-nav-links { display: flex; gap: 28px; }
.oy-nav-links a {
  color: var(--oy-text-muted);
  text-decoration: none;
  font-size: 14px;
  transition: .2s;
}
.oy-nav-links a:hover { color: var(--oy-gold); }
.oy-nav-cta { display: flex; gap: 10px; }

/* HERO */
.oy-hero { position: relative; padding: 90px 0 80px; overflow: hidden; }
.oy-hero-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(11,11,13,0.96) 0%, rgba(11,11,13,0.78) 45%, rgba(11,11,13,0.45) 100%),
    url('/img/landing-hero.jpg') center/cover no-repeat;
  z-index: 0;
}
.oy-hero-inner { position: relative; z-index: 1; }
.oy-hero-text { max-width: 620px; }
.oy-badge {
  display: inline-block;
  background: rgba(var(--oy-gold-rgb), 0.14);
  color: var(--oy-gold);
  border: 1px solid rgba(var(--oy-gold-rgb), 0.3);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 13px;
  margin-bottom: 18px;
}
.oy-hero-text h1 {
  font-size: 48px;
  line-height: 1.1;
  font-weight: 800;
  margin: 0 0 18px;
}
.oy-hero-text p {
  font-size: 18px;
  color: var(--oy-text-muted);
  line-height: 1.6;
  margin: 0 0 28px;
}
.oy-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
.oy-hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
.oy-hero-stats div { display: flex; flex-direction: column; }
.oy-hero-stats strong { font-size: 28px; color: var(--oy-gold); }
.oy-hero-stats span { font-size: 13px; color: var(--oy-text-muted); }

/* SECTIONS */
.oy-section { padding: 80px 0; }
.oy-section-alt { background: var(--oy-surface); border-top: 1px solid var(--oy-border); border-bottom: 1px solid var(--oy-border); }
.oy-eyebrow {
  display: block;
  color: var(--oy-gold);
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.oy-section-title { font-size: 34px; font-weight: 800; margin: 0 0 16px; }
.oy-section-lead { font-size: 17px; color: var(--oy-text-muted); line-height: 1.7; max-width: 720px; margin: 0 0 40px; }

/* Cards */
.oy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
}
.oy-card {
  background: var(--oy-surface);
  border: 1px solid var(--oy-border);
  border-radius: var(--oy-radius);
  padding: 26px 22px;
  transition: .25s;
}
.oy-card:hover { border-color: var(--oy-gold); transform: translateY(-3px); box-shadow: var(--oy-shadow); }
.oy-card-icon { font-size: 32px; margin-bottom: 14px; }
.oy-card h3 { font-size: 18px; margin: 0 0 8px; color: var(--oy-text); }
.oy-card p { font-size: 14px; color: var(--oy-text-muted); line-height: 1.6; margin: 0; }

/* Steps */
.oy-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.oy-step {
  background: var(--oy-bg);
  border: 1px solid var(--oy-border);
  border-radius: var(--oy-radius);
  padding: 28px 24px;
  position: relative;
}
.oy-step-n {
  font-size: 30px;
  font-weight: 800;
  background: var(--oy-gold-grad);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}
.oy-step h3 { font-size: 18px; margin: 0 0 8px; }
.oy-step p { font-size: 14px; color: var(--oy-text-muted); line-height: 1.6; margin: 0; }
.oy-center { text-align: center; }

/* FAQ */
.oy-faq { display: flex; flex-direction: column; gap: 12px; }
.oy-faq-item {
  background: var(--oy-surface);
  border: 1px solid var(--oy-border);
  border-radius: 12px;
  overflow: hidden;
  transition: .2s;
}
.oy-faq-item.open { border-color: var(--oy-gold); }
.oy-faq-q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: none;
  border: none;
  color: var(--oy-text);
  padding: 18px 20px;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}
.oy-faq-chevron { color: var(--oy-gold); font-size: 22px; flex-shrink: 0; line-height: 1; }
.oy-faq-a {
  padding: 0 20px 18px;
  color: var(--oy-text-muted);
  font-size: 15px;
  line-height: 1.7;
}

/* CTA */
.oy-cta {
  padding: 80px 0;
  background: linear-gradient(135deg, #1f1f26 0%, #0b0b0d 100%);
  border-top: 1px solid var(--oy-gold);
}
.oy-cta-inner { text-align: center; }
.oy-cta h2 { font-size: 32px; font-weight: 800; margin: 0 0 12px; }
.oy-cta p { color: var(--oy-text-muted); font-size: 17px; margin: 0 0 28px; }

/* FOOTER */
.oy-footer { background: var(--oy-bg); border-top: 1px solid var(--oy-border); padding: 40px 0; }
.oy-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.oy-footer-links { display: flex; gap: 22px; flex-wrap: wrap; }
.oy-footer-links a { color: var(--oy-text-muted); text-decoration: none; font-size: 14px; }
.oy-footer-links a:hover { color: var(--oy-gold); }
.oy-footer-copy { font-size: 13px; color: var(--oy-text-dim); width: 100%; text-align: center; padding-top: 10px; border-top: 1px solid var(--oy-border-soft); }

/* Responsive */
@media (max-width: 860px) {
  .oy-nav-links { display: none; }
  .oy-hero-text h1 { font-size: 36px; }
  .oy-section { padding: 56px 0; }
  .oy-section-title { font-size: 27px; }
}
@media (max-width: 480px) {
  .oy-nav-cta .oy-btn-ghost { display: none; }
  .oy-hero-stats { gap: 24px; }
}
</style>
