import langConfig from "@/lang/default.json";
import { useMainStore } from "@/stores";
import { useAppUtils } from "@/composables/useAppUtils";
import { computed } from "vue";

/**
 * Functions for intl management.
 */
// eslint-disable-next-line no-unused-vars
export const useLang = (context) => {
  const store = useMainStore();
  const appUtils = useAppUtils();
  const expDate = new Date();
  expDate.setHours(expDate.getHours() + 24);

  let curlang = appUtils.utils_get_cookies("curlang");

  const lang = computed(() => store.current_lang);
  const finalLangConfig = langConfig ?? {};

  // if (!curlang) {
  //   const wnLang = window.navigator.language?.split("-");
  //   curlang = wnLang[0] ?? "fr";
  //   appUtils.utils_set_cookies('curlang', curlang);
  // }

  if(!curlang) {
    curlang = "fr";
    appUtils.utils_set_cookies('curlang', curlang);
  }

  if (curlang != store.current_lang) {
    store.current_lang = curlang;
  }

  /**
   * Return translated string or string.
   */
  const _s = (what = "") => {
    const dt = finalLangConfig[lang.value] ?? {};
    let wh = what;

    wh = wh.trim();
    wh = wh.toLowerCase();
    wh = wh.replace(/(\s)+/g, "_");
    wh = wh.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    wh = wh.replace(/[^a-zA-Z0-9_]/g, "");

    return dt[wh] ?? what;
  };

  const output = computed(() => {
    return {
      /**
       * Get current language.
       */
      current_lang: lang,
      
      /**
       * Get current language.
       */
      languages: [
        { label: "fr-FR", value: "fr" },
        { label: "en-US", value: "en" },
      ],

      /**
       * Get current language content.
       */
      data: finalLangConfig[lang.value],

      _s: _s,

      /**
       * Change current language.
       */
      changeLang(lang = "fr") {
        if (curlang == lang || !lang) return;

        store.current_lang = lang;
        curlang = lang;
        appUtils.utils_set_cookies('curlang', curlang);
        
        // context?.emit('onLangChanged');
        // window.location.reload();
      },
    };
  });

  return output;
};
