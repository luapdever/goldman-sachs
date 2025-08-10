/* eslint-disable no-unused-vars */
// import Vue from 'vue'
import { useMainStore } from "@/stores";

import uniqid from 'uniqid';
import moment from "moment";
import Compressor from 'compressorjs';
import sound from '/sound/elegant-notification-sound.mp3'

const fr_months = {
    "January": "Janvier",
    "February": "Février",
    "March": "Mars",
    "April": "Avril",
    "May": "Mai",
    "June": "Juin",
    "July": "Juillet",
    "August": "Août",
    "September": "Septembre",
    "October": "Octobre",
    "November": "Novembre",
    "December": "Décembre",
}

let utils = {
    data: function () {
        return {
            errors: {},
        }
    },
    methods: {
        baseURL: function() {
            // return window.location.origin + window.location.pathname.replace(route.path, "");
        },
        playAppSound: function() {
            const audio = new Audio(sound);
            setTimeout(() => {
            audio.play().catch(console.warn);
            }, 50);
        },
        strip_html: function(html)
        {
            let tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        },
        html_encode: function(html)
        {
            html = window.jQuery.trim(html);
            return html.replace(/[&"'\<\>]/g, function(c) 
            {
                switch (c) 
                {
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
        copy_text: function(text_copy) {
            let TempText = document.createElement("input");
            TempText.value = text_copy;
            document.body.appendChild(TempText);
            TempText.select();
            TempText.setSelectionRange(0, 99999);
            let res = document.execCommand("copy");
            document.body.removeChild(TempText);

            return res;
        },
        text_truncate: function(input, l = 100) {
            if (input.length > l) {
               return input.substring(0, l) + '...';
            }
            return input;
        },
        bytes_to_size: function(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return 'n/a';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            if (i == 0) return bytes + ' ' + sizes[i];
            return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        },
        format_price: function(price) {
            const PriceFormat = new Intl.NumberFormat('fr-FR')
            return PriceFormat.format(price);
        },
        datetime_format: function(dateString, type = 'datetime-local') {
            if (!dateString || dateString == "") {
                if(type == 'datetime-local') return ("--/--/----, --:--:--");
                if(type == 'date') return ("--/--/----");
                if(type == 'time') return ("--:--:--");
            }
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();

            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            const out_date = `${day}/${month}/${year}`
            const out_time = `${hours}:${minutes}:${seconds}`
            
            if(type == 'datetime-local') return `${out_date}, ${out_time}`;
            if(type == 'date') return `${out_date}`;
            if(type == 'time') return `${out_time}`;
        },
        add_error: function(field, value) {
            this.errors[field] = value;
        },
        has_error: function(field) {
            if (!this.errors[field]) {
                return false;
            }
            if (this.errors[field] == "") {
                return false;
            }
            return this.errors[field];
        },
        is_valid_URL(str) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
              '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!pattern.test(str);
        },
        replace_links_with_anchors(text) {
            // Regex pour détecter tous les liens commençant par http ou https
            const linkRegex = /(https?:\/\/[^\s"']+)/gi;
          
            // Remplace chaque lien par une balise <a>
            return text.replace(linkRegex, (match) => {
                return `
                <a href="${match}" target="_blank" class="d-block my-2">
                    <div class="d-flex align-items-center gap-1 p-1 pe-2 border rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M17.346 15.539q0 2.271-1.565 3.866T11.952 21t-3.838-1.595t-1.576-3.867v-8.73q0-1.587 1.092-2.697Q8.72 3 10.308 3t2.678 1.11t1.091 2.698v8.269q0 .88-.615 1.517q-.614.637-1.498.637t-1.52-.627t-.636-1.527V6.769h1v8.308q0 .479.327.816q.328.338.807.338t.807-.338t.328-.816V6.789q-.006-1.166-.802-1.977Q11.48 4 10.308 4q-1.163 0-1.966.821q-.804.821-.804 1.987v8.73q-.005 1.853 1.283 3.157Q10.11 20 11.96 20q1.823 0 3.1-1.305t1.287-3.156v-8.77h1z"/></svg>
                        <span class="text-decoration-underline">Document</span>
                    </div>
                </a>`;
            });
        },
        logged_user: function() {
            let str_user = this.utils_get_cookies("logged_user")
            return JSON.parse(str_user);
        },
        compress_img(file, cb) {
            let result = new Compressor(file, {
                quality: 0.6,
                success: (result) => {
                    cb(null, result);
                },
                error: (err) => {
                    console.log(err);
                    cb(err, null);
                }
            })

            return result;
        },
        timeago: function (_date) {
            moment.updateLocale('en', {
                relativeTime: {
                    future: " %s",
                    past: "%s",
                    s: "Maintenant",
                    m: "1 min",
                    mm: "%d min",
                    h: "1 h",
                    hh: "%d h",
                    d: "Hier",
                    dd: "%d jours",
                    M: "1 mois",
                    MM: "%d mois",
                    y: "1 an",
                    yy: "%d ans"
                }
            });
            return moment(_date).fromNow()
        },
        message_timeago: function (_date) {
            const currentDate = moment();
            const messageDate = moment(_date);
          
            const daysDifference = currentDate.diff(messageDate, 'days');
          
            if (daysDifference > 1) {
                return messageDate.format("DD/MM/YYYY HH:mm");
            } else if(daysDifference == 1) {
                moment.updateLocale('en', {
                    relativeTime: {
                        future: " %s",
                        past: "%s", 
                        d: "Hier",
                    }
                });

                return moment(_date).fromNow() + messageDate.format(" à HH:mm");
            } else {
                moment.updateLocale('en', {
                    relativeTime: {
                    future: " %s",
                    past: "%s",
                    s: "Maintenant",
                    m: "1 min",
                    mm: "%d min",
                    h: "1 h",
                    hh: "%d h",
                    }
                });
              
              return moment(_date).fromNow();
            }
        },          
        moment_datetime_format: function (_date, format = "DD-MM-YYYY à HH:mm") {
            const m_date = moment(_date);

            if(!m_date.isValid()) {
                return null;
            }

            let o_date = m_date.format(format);

            Object.keys(fr_months).forEach((ky, index) => {
                o_date = o_date.replace(ky, fr_months[ky]);
            })
          
            return o_date;
        }, 
        remove_accents : function(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        },
        search_without_accents : function(search_term, text) {
            const normalized_search_term = this.remove_accents(search_term).toLowerCase();
            const normalized_text = this.remove_accents(text).toLowerCase();
            return normalized_text.includes(normalized_search_term);
        },
        add_query_params: function (url, param, value) {
            param = encodeURIComponent(param);
            var r = "([&?]|&amp;)" + param + "\\b(?:=(?:[^&#]*))*";
            var a = document.createElement('a');
            var regex = new RegExp(r);
            var str = param + (value ? "=" + encodeURIComponent(value) : "");
            a.href = url;
            var q = a.search.replace(regex, "$1" + str);
            if (q === a.search) {
                a.search += (a.search ? "&" : "") + str;
            } else {
                a.search = q;
            }
            return a.href;
        },
        moment: function (date) {
            if (window.window._.isUndefined(date)) {
                return moment();
            }
            return moment(date);
        },
        uniqid: function (times = 1) {
            let i = times;

            let output = uniqid.process();
            
            while(i > 1) {
                output += "-"+uniqid.process();
                i--;
            }

            return output
        },
        utils_getValidationState: function ({ dirty, validated, valid = null }) {
            return dirty || validated ? valid : null;
        },
        utils_get_cookies: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
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
            date.setTime(date.getTime() + (c_minutes_duration * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },
        utils_delete_cookies: function (name) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
        },
        utils_get_config_item: function (key1, key2) {
            let store = useMainStore();

            if (window._.isNull(store.configs)) {
                return false;
            }
            if (window._.isUndefined(store.configs[key1])) {
                return null;
            }
            if (!window._.isUndefined(key1)) {
                if (!window._.isUndefined(store.configs[key1][key2])) {
                    return store.configs[key1][key2];
                }
            }
            return store.configs[key1];
        },
        get_app_config: async function (next) {
            let store = useMainStore();

            if (!window._.isNull(store.configs)) {
                return;
            }
            var config = {
                url: import.meta.env.VUE_APP_BASE_CONFIG_ENDPOINT_URL,
                type: "get",
                show_error: true,
                retry: 10000,
                //max_retry: 2,
            };
            config = await this.utils_async_ajax(config, function (status, data) {
                if (status === 200) {
                    if (window._.isUndefined(data.error)) {
                        store.app_is_ready =  true;
                        store.configs =  data;
                        if (!window._.isUndefined(next)) {
                            next();
                        }
                    }

                }
            });
            return config;
        },
        utils_show_global_alert: function (data) {
            let store = useMainStore();
            store.commit("set_alert", { show: true, type: data.type, message: data.text });
        },
        show_alert: (type = 'success', message = '') => {
            let store = useMainStore();
            store.commit("set_alert", { show: true, type, message });
        },
        make_ajax_url(url = "", port = 9000) {
            let store = useMainStore();
            let final_url = store.yt_api_url;

            switch (port) {
                case 9000:
                    final_url += "/svc-users";
                    break;
                case 9001:
                    final_url += "/svc-core";
                    break;
                case 3000:
                    final_url += "/svc-chat";
                    break;
            
                default:
                    break;
            }

            final_url += url
            return final_url;
        },
        ajax_params: function (ajax_config, cb) {
            let store = useMainStore();
            
            var default_config = {
                url: "",
                show_error: true,
                show_remote_error: true,
                data: {},
                type: "POST",
                dataType: "json",
                retry: 5000,
                max_retry: 1,
                headers: {},
                timeout: 60000
            };
            ajax_config = window._.assign(default_config, ajax_config);

            var auth_cookie = this.utils_get_cookies("access_tchavi");
            var yt_x_api_key = store.yt_x_api_key;
            var user_ip_address = store.user_ip_address;

            if (!window._.isNull(auth_cookie)) {
                ajax_config["headers"]["Authorization"] = "Bearer " + auth_cookie;
            }
            
            if (!window._.isNull(yt_x_api_key)) {
                ajax_config["headers"]["X-GOU-BABA"] = "" + yt_x_api_key;
            }
            
            if (!window._.isNull(user_ip_address)) {
                ajax_config["headers"]["X-FITEADE"] = "" + user_ip_address;
            }

            var self = this;
            var max_retry = 0;
            var timeInterval = null;
            return window._.assign(ajax_config, {
                complete: function (response) {
                    clearInterval(timeInterval);

                    // let timeout_timer = setTimeout(() => {
                    //     self.utils_show_global_alert({ text: "Erreur connexion réseau", type: "danger" });
                    // }, ajax_config.timeout);

                    if (response.status === 200) {
                        if (!window._.isUndefined(cb)) {
                            cb(response.status, response.responseJSON);
                        }
                        if (ajax_config.show_remote_error) {
                            if (!window._.isUndefined(response.responseJSON)) {
                                if (window._.isObject(response.responseJSON)) {
                                    var error_keys = ["error", "unauthorized", "internal_error"];

                                    for (let index = 0; index < error_keys.length; index++) {
                                        const error = error_keys[index];
                                        if (!window._.isUndefined(response.responseJSON[error])) {
                                            if (window._.isString(response.responseJSON[error])) {
                                                return self.utils_show_global_alert({ text: response.responseJSON[error], type: "danger" });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return;
                    }
                    else if(response.status === 401) {
                        self.utils_delete_cookies("access_tchavi");
                        self.$router.replace({ name: "login" });
                        return;
                    }
                    max_retry += 1;

                    if (!window._.isUndefined(cb)) {
                        if (ajax_config.max_retry != 0) {
                            if (ajax_config.retry) {
                                if (ajax_config.max_retry == max_retry) {
                                    self.show_ajax_message(ajax_config, response);
                                    cb(response.status, null);
                                    return;
                                }
                            }
                        }
                        cb(response.status, null);
                    }
                    if (ajax_config.retry) {
                        var that = this;
                        timeInterval = setTimeout(function () {
                            window.$.ajax(that);
                        }, ajax_config.retry);
                    }
                    self.show_ajax_message(ajax_config, response);
                },
                error: function(error, a, b) {
                    console.error("Request error : ", error, error.status, b);
                    console.log("Request headers : ", error.getAllResponseHeaders());

                    let error_message = (error.responseJSON && (error.responseJSON.internal_error || error.responseJSON.error)) ? (error.responseJSON.internal_error ?? error.responseJSON.error) : "Une erreur est survenue";

                    if(error.responseText && !error.responseJSON) {
                        error_message += ' <br /><iframe srcdoc="'+ error.responseText + '" style="width: 100% !important; max-height: 200px !important;"></iframe>';
                    }

                    if(error.status === 401) {
                        self.utils_delete_cookies("access_tchavi");
                        self.$router.replace({ name: "login" });
                    }

                    if (ajax_config.show_remote_error) {
                        return self.show_alert(
                            "danger", 
                            error_message,
                        );
                    }
                }
            });
        },
        utils_async_ajax: async function (ajax_config, cb, retry) {
            try {
                return await window.$.ajax(this.ajax_params(ajax_config, cb));
            } catch (error) {
                console.log(error);
            }
        },
        utils_ajax: function (ajax_config, cb, retry) {
            try {
                window.$.ajax(this.ajax_params(ajax_config, cb));
            } catch (error) {
                console.log(error);
            }
        },
        show_ajax_message: function (ajax_config, response) {
            if (ajax_config.show_error) {
                switch (response.status) {
                    case 401:

                        break;
                    case 500:

                        break;
                    case 0:

                        break;
                    default:

                        break;
                }
                this.utils_show_global_alert({ text: "Une erreur s'est produite", type: "danger" });
            }
        },
        isEmpty: function (el) {
            return window._.isEmpty(el);
        },
        isNull: function (el) {
            return window._.isNull(el);
        },
        isObject: function (el) {
            return window._.isObject(el);
        },
        isArray: function (el) {
            return window._.isArray(el);
        },
        isImage: function(url = "") {
            if(!url) return false;

            const urlParts = url.split(".");
            const ext = urlParts.length > 0 ? urlParts[urlParts.length -1] : "";

            if(['png', 'jpeg', 'jpg', 'gif', 'webp'].includes(ext.toLowerCase())) {
                return true;
            }

            return false;

            // let http = new XMLHttpRequest();

            // http.open('HEAD', url, false);
            // http.send();

            // return http.status != 404;
        },
        utils_set_page_title: function (title) {
            document.title = title + " | Goldman Sachs" || "Goldman Sachs";
        },
        formatToAmount(amount, devise) {
            return new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: devise,
            }).format(parseInt(amount));
        },
    }
};
export default utils;