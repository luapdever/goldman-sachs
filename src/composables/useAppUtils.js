/* eslint-disable no-unused-vars */
import { useMainStore } from "@/stores";
import moment from "moment";
import { ref } from "vue";
import sound from '/sound/elegant-notification-sound.mp3';
import { useRouter } from "vue-router";

const frMonths = {
  January: "Janvier",
  February: "Février",
  March: "Mars",
  April: "Avril",
  May: "Mai",
  June: "Juin",
  July: "Juillet",
  August: "Août",
  September: "Septembre",
  October: "Octobre",
  November: "Novembre",
  December: "Décembre",
};

const frDays = {
  Monday: "Lundi",
  Tuesday: "Mardi",
  Wednesday: "Mercredi",
  Thursday: "Jeudi",
  Friday: "Vendredi",
  Saturday: "Samedi",
  Sunday: "Dimanche",
};

const apiURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337/api";
// const apiURL = import.meta.env.VITE_API_BASE_URL || "https://goudo-goldman.onrender.com/api";

export const useAppUtils = () => {
  const router = useRouter();
  let errors = ref({});
  const store = useMainStore();
  let isLoading = ref({});

  let methods = {
    playAppSound: function() {
      const audio = new Audio(sound);
      setTimeout(() => {
        audio.play().catch(console.warn);
      }, 50);
    },
    stripHTML(html) {
      let tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
    htmlEncode(html) {
      html = window.jQuery.trim(html);
      // eslint-disable-next-line no-useless-escape
      return html.replace(/[&"'\<\>]/g, function (c) {
        switch (c) {
          case "&":
            return "&amp;";
          case "'":
            return "&#39;";
          case '"':
            return "&quot;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          default:
            return "";
        }
      });
    },
    copyText(text_copy) {
      let TempText = document.createElement("input");
      TempText.value = text_copy;
      document.body.appendChild(TempText);
      TempText.select();
      TempText.setSelectionRange(0, 99999);
      let res = document.execCommand("copy");
      document.body.removeChild(TempText);

      return res;
    },
    textTruncate(input, l = 100) {
      if (input.length > l) {
        return input.substring(0, l) + "...";
      }
      return input;
    },
    bytesToSize(bytes, toInt = false) {
      let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "n/a";
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      if (i == 0) return bytes + " " + sizes[i];

      let finalSize = (bytes / Math.pow(1024, i)).toFixed(1);
      return (toInt ? parseInt(finalSize) : finalSize) + " " + sizes[i];
    },
    cropLeadingDigits(number) {
      if (!number) {
        return "";
      }

      if (number.length < 11) return number;

      return number.toString().startsWith("229")
        ? number.toString().slice(3)
        : number;
    },
    remainingTime(dateString) {
      const now = new Date();
      const date = new Date(dateString);

      const diff = now - date;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const heures = Math.floor(minutes / 60);
      const jours = Math.floor(heures / 24);

      if (jours >= 30) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("fr-FR", options);
      } else if (jours >= 1) {
        return `${jours}j`;
      } else if (heures >= 1) {
        return `${heures}h`;
      } else if (minutes >= 1) {
        return `${minutes} min`;
      } else {
        return `un instant`;
      }
    },
    momentDatetimeFormat(_date, format = "DD-MM-YYYY à HH:mm") {
      const m_date = moment(_date);

      let o_date = m_date.format(format);

      Object.keys(frMonths).forEach((ky, index) => {
        o_date = o_date.replace(ky, frMonths[ky]);
      });

      Object.keys(frDays).forEach((ky, index) => {
        o_date = o_date.replace(ky, frDays[ky]);
      });

      return o_date;
    },
    // uniqid(times = 1) {
    //   let i = times;

    //   let output = uniqid.process();

    //   while (i > 1) {
    //     output += "-" + uniqid.process();
    //     i--;
    //   }

    //   return output;
    // },
    formatPrice(price) {
      const PriceFormat = new Intl.NumberFormat("fr-FR");
      return PriceFormat.format(price);
    },
    addError(field, value) {
      errors.value[field] = value;
    },
    hasError(field) {
      if (!errors.value[field]) {
        return false;
      }
      return errors.value[field];
    },
    toggleLoading(field) {
      isLoading.value[field] = isLoading.value[field] ? false : true;
    },
    inLoading(field) {
      return isLoading.value[field] ?? false;
    },
    constructFormData(formData, fields) {
      let finalFormData = new FormData();

      for(const field of fields) {
        if(formData[field.name] != null) {
          if(field.type == 'file') {
            if(field.multiple) {
              for(const ind in formData[field.name]) {
                if(formData[field.name][ind]) {
                  finalFormData.append(`${field.name}[${ind}]`, formData[field.name][ind], formData[field.name][ind].name);
                }
              }
            } else if(formData[field.name]?.length > 0) {
              finalFormData.append(`${field.name}`, formData[field.name][0], formData[field.name][0].name);
            }
            continue;
          }
    
          if(Array.isArray(formData[field.name]) && formData[field.name].length > 0) {
            for(const key in formData[field.name]) {
              if(formData[field.name][key] != null) {
                finalFormData.append(`${field.name}[${key}]`, formData[field.name][key]);
              }
            }
            continue;
          }
    
          finalFormData.append(field.name, formData[field.name])
        }
      }

      return finalFormData;
    },
    isValidURL(str) {
      let pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      ); // fragment locator
      return !!pattern.test(str);
    },
    addQueryParams(url, param, value) {
      param = encodeURIComponent(param);
      let r = "([&?]|&amp;)" + param + "\\b(?:=(?:[^&#]*))*";
      let a = document.createElement("a");
      let regex = new RegExp(r);
      let str = param + (value ? "=" + encodeURIComponent(value) : "");
      a.href = url;
      let q = a.search.replace(regex, "$1" + str);
      if (q === a.search) {
        a.search += (a.search ? "&" : "") + str;
      } else {
        a.search = q;
      }
      return a.href;
    },
    searchWithoutAccents(search, text) {
      if (!search || !text) return true
      
      const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      
      return normalizedText.includes(normalizedSearch)
    },
    validateFields(fields = [], formData = {}) {
      let flag = 1;

      for (let field of fields) {
        if(!field.required) continue;
        if(field.condition && formData[field.condition?.fieldname] != field.condition?.value) continue;

        this.addError(field.name, false);
        if (formData[field.name] == null || formData[field.name] == undefined) {
          this.addError(field.name, "Ce champ est requis.");
          flag *= 0;
        } else if (typeof(formData[field.name]) == "string" && (!formData[field.name] || !formData[field.name].trim())) {
          this.addError(field.name, "Ce champ est requis.");
          flag *= 0;
        } else {
          if (field.type == "email") {
            // eslint-disable-next-line no-useless-escape
            let testReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

            if (!testReg.test(formData[field.name]?.trim()?.toLowerCase())) {
              this.addError(field.name, "Veuillez ajouter une adresse email valide.");
              flag *= 0;
            }
          }

          if(field.type == "file") {
            if(!Array.isArray(formData[field.name]) || (Array.isArray(formData[field.name]) && formData[field.name].length == 0)) {
              this.addError(field.name, "Vous devez téléverser un fichier.");
              flag *= 0;
            }

          }

          if(field.type == "array") {
            if(!Array.isArray(formData[field.name])) {
              this.addError(field.name, "Ce champ doit être un tableau.");
              flag *= 0;
            } else if(Array.isArray(formData[field.name]) && formData[field.name].length == 0) {
              this.addError(field.name, "Vous devez ajouter au moins un élément.");
              flag *= 0;
            } else if(Array.isArray(formData[field.name])) {
              for(const subFormData of formData[field.name]) {
                flag *= this.validateFields(field.configs, subFormData);
                if(flag == 0) {
                  this.addError(field.name, "Informations manquantes.");
                }
              }
            }

          }
        }
      }

      if (flag == 0) {
        this.toggleGlobalAlert(
          "Veuillez vérifier les erreurs au niveau des champs.",
          "error",
          false
        );
      }

      return flag;
    },
    makeAjaxUrl(url = "", port = null) {
      return apiURL + (port ? ":" + port : "") + url;
    },
    async ajax(
      params,
      options = { showError: true, loadingKey: "submit" },
      cb = (err, data, status = 200) => {}
    ) {
      if (options === null) {
        options = { showError: true, loadingKey: "submit" };
      }
      let { showError, loadingKey } = options;

      if (showError === undefined || showError === null) {
        showError = true;
      }

      if (loadingKey === undefined || loadingKey === null) {
        loadingKey = "submit";
      }

      if (!this.inLoading(loadingKey)) {
        this.toggleLoading(loadingKey);
      }

      let ajaxConfig = {};

      let defaultConfig = {
        url: "",
        show_error: true,
        show_remote_error: true,
        data: undefined,
        type: "POST",
        dataType: "json",
        retry: 5000,
        max_retry: 1,
        headers: {},
        timeout: 60000,
      };

      ajaxConfig = { ...defaultConfig, ...params };

      let auth_cookie = this.utils_get_cookies('access_tchavi');

      if(ajaxConfig.dataType == 'json') {
        ajaxConfig["headers"]["Content-Type"] = "application/json";
        ajaxConfig.data = JSON.stringify(ajaxConfig.data);
      }

      if (auth_cookie) {
        ajaxConfig["headers"]["Authorization"] = "Bearer " + auth_cookie;
      }
      
      // if (store.basicToken) {
      //   ajaxConfig["headers"]["Authorization"] = "Basic " + store.basicToken;
      // }

      // if(ajaxConfig.url) {
      //   let curlang = this.utils_get_cookies("curlang");
      //   ajaxConfig.url = this.addQueryParams(ajaxConfig.url, 'lang', curlang ?? 'fr');
      // }

      // let self = this;
      // let max_retry = 0;
      // let timeInterval = null;

      try {
        const response = await window.jQuery.ajax(ajaxConfig);

        if (this.inLoading(loadingKey)) {
          this.toggleLoading(loadingKey);
        }

        if (
          response?.status === 401 ||
          response?.error?.name == "UnauthorizedError"
        ) {
          this.utils_delete_cookies("access_tchavi");
          return;
        }

        if (response && (response?.error?.message || response?.error)) {
          if (showError) {
            this.toggleGlobalAlert(
              response?.error?.message ?? response?.error,
              "error",
              false
            );
          }
        }

        if(cb) {
          cb(null, response, response?.status);
        }
        return response ?? null;
      } catch (error) {
        if (this.inLoading(loadingKey)) {
          this.toggleLoading(loadingKey);
        }

        if (!error.responseJSON) {
          console.error("Request error : ", error);
          if(cb) {
            cb(error, null, error.status);
          }
          if (showError) {
            this.toggleGlobalAlert(
              "Une erreur est survenue. Veuillez réessayer.",
              "error",
              false
            );
          }
        }

        if (
          error.status === 401 ||
          error.responseJSON?.error?.name == "UnauthorizedError"
        ) {
          this.utils_delete_cookies("access_tchavi");
          return;
        }

        if (
          error.responseJSON &&
          (error.responseJSON?.error?.message || error.responseJSON?.error)
        ) {
          if (showError) {
            this.toggleGlobalAlert(
              error.responseJSON?.error?.message ?? error.responseJSON?.error,
              "error",
              false
            );
          }
        } else {
          if (showError) {
            this.toggleGlobalAlert(
              "Une erreur est survenue. Veuillez réessayer.",
              "error",
              false
            );
          }
        }

        console.error("Request error : ", error);
        if(cb) {
          cb(error, null, error.status);
        }

        return null;
      }
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    },
    base64ToBlob(base64Data) {
      const parts = base64Data.split(",");
      const contentType = parts[0].match(/:(.*?);/)[1];
      const b64Data = atob(parts[1]);

      let buffer = new Uint8Array(b64Data.length);
      for (let i = 0; i < b64Data.length; i++) {
        buffer[i] = b64Data.charCodeAt(i);
      }

      return new Blob([buffer], { type: contentType });
    },
    toggleGlobalAlert(content, type = "success", isToast = false) {
      if (!document) return;

      let global_alert = document.getElementById("global_alert");

      if (!global_alert) {
        global_alert = document.createElement("div");
        global_alert.setAttribute("id", "global_alert");
        document.body.appendChild(global_alert);
      }

      if (typeof content != "undefined") {
        if (isToast) {
          global_alert.classList.add("c-toast");
        }

        global_alert.innerHTML = content;
        global_alert.classList.remove("success");
        global_alert.classList.remove("error");
        global_alert.classList.remove("danger");
        global_alert.classList.add(type);
        global_alert.classList.add("open");

        setTimeout(function () {
          global_alert.innerHTML = "";
          global_alert.classList.remove("open");
        }, 5000);
      }
    },
    utils_async_ajax: async function (ajaxConfig, cb, retry) {
      return window.jQuery.ajax(this.ajax_params(ajaxConfig, cb));
    },
    formatToAmount(amount, devise = "XOF") {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: devise,
        maximumFractionDigits: 2,
      }).format(parseFloat(amount));
    },
    utils_get_cookies: function (cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return null;
    },
    utils_set_cookies: function (cname, cvalue, c_minutes_duration) {
      var date = new Date();
      date.setTime(date.getTime() + c_minutes_duration * 60 * 1000);
      var expires = "; expires=" + date.toGMTString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    utils_delete_cookies: function (name) {
      document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    },
  };

  return {
    errors: errors.value,
    ...methods,
    isLoading: isLoading.value,
  };
};
