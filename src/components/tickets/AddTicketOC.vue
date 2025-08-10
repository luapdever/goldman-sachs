<script setup>
import no_result from '../../assets/img/no-result.svg'
import BaseOffcanvas from '../base/BaseOffcanvas.vue';
import { CheckCircle, ContentCopy, Check, Information } from 'mdue'
</script>

<template>
  <div>
    <BaseOffcanvas 
      fullscreen position="end" oc-id="addTicket" 
      :noClose="step > 1 && !tickets_created"
      @onClose="($event) => prev()" 
      @onHidden="reset()"
    >
        <template v-slot:oc-header>
          <h3 id="addTicketLabel">Ajouter un ticket </h3>
        </template>

        <template v-slot:oc-body>
          <div v-if="!store?.categories_list || store?.categories_list.length <= 0" class="w-100 h-100 d-flex justify-content-center align-items-center">
            <div class="text-center">
              <img :src="no_result" alt="No result" />
              <p class="p-3">Sorry !! Aucune catégorie ne vous a été attribué pour effectuer un ajout de ticket.</p>
            </div>
          </div>

          <div v-else id="addticketctn" class="position-relative">
            <div v-if="is_loading" class="t-overlay">
              <span class="spinner-border text-primary" role="status"></span>
            </div>

            <div v-if="tickets_created" class="px-3 py-5 d-flex justify-content-center">
              <div class="text-center d-flex flex-column justify-content-center align-items-center">
                <CheckCircle style="color: green; font-size: 50px;" />
                <h3 class="mt-2 mb-1">Ticket ajouté</h3>
                <p class="text-muted">Votre plainte à été enregistré avec succès.</p>
                <div class="my-3">
                  <div 
                    v-for="(tick, index) in tickets_created" 
                    :key="'Tick' + index"
                    class="mb-1 d-flex justify-content-center position-relative ticket-id-copy" 
                  >
                    <input readonly :id="'ticket_id_' + tick.id" type="text" :value="tick.id" class="form-control pe-5 fw-bold" />
                    <button 
                      :disabled="clipboard.includes(tick.id)" 
                      class="btn btn-dark position-absolute top-0 end-0" 
                      @click.prevent="($event) => { if (copy_ticket_id(tick.id, 'ticket_id_' + tick.id)) clipboard.push(tick.id); }"
                    >
                      <Check v-if="clipboard.includes(tick.id)" />
                      <ContentCopy v-else />
                    </button>
                  </div>

                </div>
                
                <div class="mt-2 d-flex justify-content-center align-items-center gap-2">
                  <button class="btn btn-dark" @click.prevent="close_oc()" type="button">Retour aux tickets</button>
                  <button class="btn btn-primary" @click.prevent="($event) => reset()" type="button">Ajouter un nouveau</button>
                </div>
              </div>
            </div>
            <form v-else id="addticketform" @submit.prevent="" class="px-4 mb-5">
              <div v-if="step == 1" class="mt-3">
                
                <div class="mb-3">
                  <base-input label="Rechercher une catégorie" name="subcatsearch" v-model="subcatsearch" type="search" ph="Rechercher" />
                </div>

                <div class="mb-3">
                  <div v-if="has_error('category')" class="text-danger">
                    <span style="padding-right: 3px;">
                      <Information style="font-size: 18px;" />
                    </span>
                    <span>{{ has_error('category') }}</span>
                  </div>

                  <div v-if="has_error('subcategory')" class="text-danger">
                    <span style="padding-right: 3px;">
                      <Information style="font-size: 18px;" />
                    </span>
                    <span>{{ has_error('subcategory') }}</span>
                  </div>
                </div>

                <!-- CATEGORY -->
                <div v-if="!categories_options || categories_options.length == 0" class="p-3 text-center">
                  <p class="text-muted">Aucun résultat...</p>
                </div>
                <div v-for="(cat, index) in categories_options" :key="'SubCat' + index" class="mb-4">
                  <h3 class="mb-1">{{ cat.label }}</h3>

                  <!-- SUBCATEGORY -->
                  <div class="subcats">
                    <div v-if="!cat.subcategories || cat.subcategories.length == 0" class="col-lg-4 col-6 p-1 cat-radio">
                      <input type="radio" name="subcategory" :id="'subcat' + index" :value="cat.value" v-model="tmp_data.category" @change="handle_category_change()" class="d-none" />
                      <label class="card p-2 d-flex justify-content-center align-items-center text-center" :for="'subcat' + index" type="button">
                        {{ cat.label }}
                      </label>
                    </div>

                    <div v-for="(subcat, ind) in cat.subcategories" :key="'SubCat' + ind" class="col-lg-4 col-6 p-1 cat-radio">
                      <input type="radio" name="subcategory" :id="'cat' + index + 'subcat' + ind" :value="cat.value + '#' + subcat.id" v-model="tmp_data.category" @change="handle_category_change()" class="d-none" />
                      <label class="card p-2 d-flex justify-content-center align-items-center text-center" :for="'cat' + index + 'subcat' + ind" type="button">
                        {{ subcat.title }}
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              <div v-if="step == 2" class="mt-3 mb-3">
                <div v-if="cur_cat" class="mb-2">
                  <p class="m-0">
                    <span><strong>Catégorie sélectionnée : </strong></span>
                    <span v-if="cur_cat?.title || cur_cat?.label" class="mb-1 badge text-bg-secondary">
                      {{ cur_cat?.title ?? cur_cat?.label }}
                    </span>
                    <span v-if="cur_subcat?.label || cur_subcat?.title" class="ms-1 mb-1 badge text-bg-secondary">
                      {{ cur_subcat?.label ?? cur_subcat?.title }}
                    </span>
                  </p>
                </div>
                <!-- <div v-if="ticket_data.msisdn && !ticket_data.msisdn.includes(',')"> -->
                  <div>
                  <div v-if="subcategory_fields.length > 0">
                    <div v-for="(field, index) in subcategory_fields" :key="'SubCat Field'+index">
                      <base-input 
                        v-if="field.type != 'group'" 
                        :label="field.label" 
                        :name="field.name" 
                        :type="field.type" 
                        :options="field.options" 
                        :ph="field.ph" 
                        v-model="attrs[field.name]" 
                        :allowed_exts="field.allowed_exts ?? null" 
                        :multiple="field.multiple ?? null" 
                        :min="field.min ?? null" 
                        :max="field.max ?? null" 
                        :field-error="errors[field.name]" 
                        :required="field.required ?? false" 
                        @update:modelValue="auto_validate()" 
                        :accept="field.allowed_exts ? ('.' + field.allowed_exts.join(',.')) : null"
                      >
                        <template v-if="field.desc" v-slot:desc>
                          {{ field.desc }}
                        </template>

                        <template v-if="field.top_desc && !(field.type == 'file')" v-slot:topDesc>
                          {{ field.top_desc }}
                        </template>

                        <template v-else-if="field.type == 'file'" v-slot:topDesc>
                          <template v-if="field.top_desc">
                            {{ field.top_desc }}
                          </template>
                          <div class="px-2">
                            <p class="m-0">
                              <span>Extensions autorisées : </span>
                              <strong class="text-uppercase">{{ field.allowed_exts ? field.allowed_exts.join(', ') : "Tous" }}</strong>
                            </p>
                            <p class="m-0">
                              <span>Taille maximale : </span>
                              <strong>{{ field.file_max_size ? bytes_to_size(parseInt(field.file_max_size)) : "8 MB" }}</strong>
                            </p>
                          </div>
                        </template>
                      </base-input>

                      <div v-else>
                        <div class="mb-2">
                          <h3>{{ field.label }}</h3>
                          <span v-if="errors[field.name]" class="text-danger fw-bold">{{ errors[field.name] }}</span>
                        </div>
                        <div class="px-2">
                          <base-input 
                            v-for="(subfield, ind) in field.values" :key="'SubCat subfield'+ind" 
                            :label="subfield.label" 
                            :name="subfield.name" 
                            :type="subfield.type" 
                            :options="subfield.options" 
                            :ph="subfield.ph" 
                            v-model="attrs[field.name][subfield.name]" 
                            :allowed_exts="subfield.allowed_exts ?? null" 
                            :multiple="subfield.multiple ?? null"
                            :min="subfield.min ?? null" 
                            :max="subfield.max ?? null" 
                            :field-error="errors[subfield.name]" 
                            :required="subfield.required ?? false" 
                            @update:modelValue="auto_validate()"
                          >
                            <template v-if="subfield.type == 'file'" v-slot:topDesc>
                              <div class="px-2">
                                <p class="m-0">
                                  <span>Extensions autorisées : </span>
                                  <strong class="text-uppercase">{{ subfield.allowed_exts ? subfield.allowed_exts.join(', ') : "Tous" }}</strong>
                                </p>
                                <p class="m-0">
                                  <span>Taille maximale : </span>
                                  <strong>{{ subfield.file_max_size ? bytes_to_size(parseInt(subfield.file_max_size)) : "8 MB" }}</strong>
                                </p>
                              </div>
                            </template>
                          </base-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- <base-input name="pieces" type="file" multiple :allowed_exts="allowed_exts" label="Pièces jointes" ph="Ajouter des pièces" top-desc="Pièce d’identité, justificatifs, documents, etc" v-model="pieces" :field-error="errors.pieces" /> -->
              </div>

              <div class="position-sticky w-100 bottom-0 start-0 bg-white px-2 py-3">
                <div>
                  <base-button :disabled="is_loading || in_subfields_loading" block @click="next_step($event)">
                    <span>
                      {{ step != 1 ? "Créer ticket" : "Suivant" }}
                    </span>
                    <!-- <span v-else class="spinner-border text-dark" role="status"></span> -->
                  </base-button>
                </div>
                
                <div v-if="step > 1" class="my-3 text-center">
                  <button @click="($event) => prev()" class="btn text-info2" type="button">Précédent</button>
                </div>
              </div>
            </form>
            <button id="add_ticket_close" class="d-none" data-bs-dismiss="offcanvas" type="button"></button>
          </div>
        </template>
    </BaseOffcanvas>
  </div>
</template>

<script>
export default {
    data() {
      return {
        step: 1,
        tickets_created: null,
        is_loading: false,
        in_subfields_loading: false,
        ticket_data: {
          msisdn: "",
          category: "",
          subcategory: "",
        },
        tmp_data: {
          category: "",
        },
        attrs: {
          
        },
        subcategory_fields: [],
        bulkable_field: null,
        msisdn_field: null,
        // no_msisdn_field: false,
        pieces: [],
        pieces_urls: [],
        categories: [],
        cur_cat: null,
        cur_subcat: null,
        subcategories: [],
        subcatsearch: "",

        allowed_exts: ["png", "jpeg", "jpg"],

        reset_states: {},
        clipboard: [],
      };
    },
    computed: {
      categories_options() {
        let options = [];

        let cats = [];

        cats = store.categories_list.filter((cat) => {
          let subcats = [];

          return this.search_without_accents(this.subcatsearch?.toLowerCase(), cat?.title?.toLowerCase()) || cat.subcategories?.some((subcat) => this.search_without_accents(this.subcatsearch?.toLowerCase(), subcat?.title?.toLowerCase()));
        });

        options = cats.map((val) => {
          return {
            label: val.title,
            value: val.id,
            subcategories: val.subcategories?.filter((subcat) => this.search_without_accents(this.subcatsearch?.toLowerCase(), subcat?.title?.toLowerCase())),
          }
        });

        options.sort((a, b) => {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        });

        return options;
      },
      filtered_subcategories() {
        let out = [];

        if(!this.subcategories || this.subcategories.length == 0 ) {
          return [];
        }

        out = this.subcategories.filter((cat) => cat.label?.toLowerCase().includes(this.subcatsearch.toLowerCase()));

        return out;
      },
      ready_for_submit() {
        return (this.step == 2 
          || (this.subcategory_fields && this.subcategory_fields.length == 0));
      }
    },
    mounted() {
      this.get_categories_list();
      this.get_reset_states();
    },
    methods: {
      prev() {
        if(this.is_loading || this.tickets_created) return;

        if(this.subcategory_fields.length > 0) {
          this.step -= 1;
        } else {
          this.step = 1;
        }
      },
      copy_ticket_id: function(text_copy, target_id = null) {        
        if(!event) {
          this.copy_text(text_copy);
          return;
        }

        let el = window.jQuery('#' + target_id)[0];
        el.select();
        el.setSelectionRange(0, 99999);
        let res = document.execCommand("copy");
        
        return res;
      },
      close_oc() {
        this.tickets_created = null;
        window.jQuery("#add_ticket_close").click();
        this.$router.push({ name: "tickets" });
      },
      get_categories_list() {
        let ajax_config = {
          url: this.make_ajax_url('/tickets/categories', 9001),
          type: 'GET',
          max_retry: 2,
        }

        this.utils_async_ajax(ajax_config, (status, response) => {
          if (!_.isUndefined(response) && _.isArray(response)) {
            store.categories_list = response
          } else if(!_.isUndefined(response.error)) {
            store.categories_list = []
          }
        })
      },
      async handle_category_change() {
        let splited_cats = this.tmp_data?.category?.split('#') ?? [];

        this.ticket_data.category = splited_cats[0] ?? null;
        await this.get_subcategories();
        this.ticket_data.subcategory = splited_cats[1] ?? null;

        if(this.ticket_data.subcategory) {
          this.get_subcategory_fields();
        }
      },
      async get_subcategories() {
        // this.in_subfields_loading = true;
        this.subcategories = [];
        this.subcategory_fields = [];
        this.ticket_data.subcategory = "";
        this.attrs = {};
        this.bulkable_field = null;
        this.msisdn_field = null;
        this.cur_cat = null;
        this.cur_subcat = null;
        // this.no_msisdn_field = false;

        // this.in_subfields_loading = false;
        
        let category = await store.categories_list.find((cat) => cat.id == this.ticket_data.category);
        
        if(!category) {
          return
        }

        this.cur_cat = category;

        if(category.metas && category.metas.bulkable_field) {
          this.bulkable_field = category.metas.bulkable_field;
          console.log(this.bulkable_field);
        }
        if(category.metas && category.metas.msisdn_field) {
          this.msisdn_field = category.metas.msisdn_field;
        }

        if(category.metas && category.metas.fields) {
          await category.metas.fields.forEach(async (field, ind) => {
            if(["checkbox", "file"].includes(field.type)) {
              this.attrs[field.name] = [];
            } else if(field.type == 'group') {
              this.attrs[field.name] = {};

              await field.values.forEach((subfield, ind) => {
                if(["checkbox", "file"].includes(subfield.type)) {
                  this.attrs[field.name][subfield.name] = [];
                } else {
                  this.attrs[field.name][subfield.name] = "";
                }
              })

            } else {
              this.attrs[field.name] = "";
            }
          })
  
          this.subcategory_fields = [...category.metas.fields];
        }
                
        if(category.subcategories == null) {
          return
        }

        this.subcategories = await category.subcategories.map((subcat, ind) => {
          return {
            id: subcat.id,
            label: subcat.title,
            value: subcat.id,
            bulkable_field: subcat.metas && subcat.metas.bulkable_field ? subcat.metas.bulkable_field : null,
            msisdn_field: subcat.metas && subcat.metas.msisdn_field ? subcat.metas.msisdn_field : null,
            fields: subcat.metas && subcat.metas.fields ? subcat.metas.fields : []
          }
        });
      },
      get_subcategory_fields() {
        this.subcategory_fields = [];
        this.attrs = {};
        this.bulkable_field = null;
        this.msisdn_field = null;
        this.cur_subcat = null;
        
        let category = store.categories_list.find((cat) => cat.id == this.ticket_data.category);
        let subcategory = this.subcategories.find((subcat) => subcat.id == this.ticket_data.subcategory);

        if(!category || !subcategory) {
          return
        }

        this.cur_subcat = subcategory;

        if(subcategory.bulkable_field) {
          this.bulkable_field = subcategory.bulkable_field;
        }
        if(subcategory.msisdn_field) {
          this.msisdn_field = subcategory.msisdn_field;
        }

        if(subcategory.fields) {
          subcategory.fields.forEach((field, index) => {
            if(["checkbox", "file"].includes(field.type)) {
              this.attrs[field.name] = [];
            } else if(field.type == 'group') {
              this.attrs[field.name] = {};

              field.values.forEach((subfield, ind) => {
                if(["checkbox", "file"].includes(subfield.type)) {
                  this.attrs[field.name][subfield.name] = [];
                } else {
                  this.attrs[field.name][subfield.name] = "";
                }
              })

            } else {
              this.attrs[field.name] = "";
            }
          })
  
          this.subcategory_fields = [...(category.metas && category.metas.fields ? category.metas.fields : []), ...(subcategory.fields ?? [])];
        }
      },
      async upload_files(files_list = []) {
        var self = this
        let requests = files_list.map(async (piece, index) => {
          
          let upload_form_data = new FormData();
          let extension = piece.type.split("/");
          upload_form_data.append('file', piece, "piece." + extension[1]);

          let ajax_config = {
            url: self.store.upload_api_url,
            type: 'POST',
            data: upload_form_data,
            mimeType: "multipart/form-data",
            contentType: false,
            dataType: "json",
            cache: false,
            processData: false,
          }

          return this.utils_async_ajax(ajax_config, (status, response) => {});
        });

        return await Promise.all(requests);
      },
      async treat_all_fields() {
        let attrs = {};

        try {
          for(let key of Object.keys(this.attrs)) {
            let field = this.subcategory_fields.find((fld, index) => key == fld.name)

            if(!field) return;

            // Field file process
            if(field.type == 'file') {
              let responses = await this.upload_files(this.attrs[key]);

              let files_urls = [];
              responses.forEach((res) => {
                if(_.isUndefined(res.error) || !res.success) {
                  files_urls.push(res.file_url);
                }
              });

              if(files_urls.length != responses.length) {
                throw new Error("Erreur lors du traitement des documents. Veuillez réessayer");
              }

              attrs[key] = {
                type: field.type,
                label: field.label,
                value: files_urls,
              };
            } else if(field.type == 'group') {
              attrs[key] = {
                type: field.type,
                label: field.label,
                value: {},
              };

              for(let subkey of Object.keys(this.attrs[key])) {
                let subfield = field.values.find((subfld, ind) => subkey == subfld.name);
                if(subfield.type == 'file') {
                  let subresponses = await this.upload_files(this.attrs[key][subkey]);

                  let subfiles_urls = [];
                  subresponses.forEach((res) => {
                    if(_.isUndefined(res.error) || !res.success) {
                      subfiles_urls.push(res.file_url);
                    }
                  });

                  if(subfiles_urls.length != subresponses.length) {
                    throw new Error("Erreur lors du traitement des documents. Veuillez réessayer");
                  }

                  attrs[key].value[subkey] = {
                    type: subfield.type,
                    label: subfield.label,
                    value: subfiles_urls,
                  };
                } else {
                  attrs[key].value[subkey] = {
                    label: subfield.label,
                    value: this.attrs[key][subkey],
                  };
                }
              }
            } else if(field.name == this.bulkable_field) {  // Bulkable Field
              let field_value = this.attrs[key] ? this.attrs[key].split(',') : []
              attrs[key] = {
                label: field.label,
                value: field_value
              };
            } else {
              attrs[key] = {
                label: field.label,
                value: this.attrs[key]
              };
            }
          };
        } catch (error) {
          this.show_alert("danger", "Erreur lors du traitement des documents. Veuillez réessayer");
          this.is_loading = false;
          return false;
        }

        return attrs;
      },
      async next_step(event) {
        let flag = 1;

        switch (this.step) {
          case 1:
            flag = this.validate_primary_fields();
            break;
        
          case 2:
            flag = this.validate_secondary_fields();
            break;
        
          default:
            break;
        }

        

        if(flag == 0) {
          this.show_alert("danger", "Veuillez vérifier les erreurs au niveau des champs.");
          return;
        } else if(this.step == 2) {
          this.submit_ticket();
          return
        } else if(this.ready_for_submit) {
          this.submit_ticket();
          return;
        }

        this.step += 1;

        setTimeout(() => {
          window.jQuery('.offcanvas-body').animate({
            scrollTop: window.jQuery("#addticketctn").offset().top
          }, 100);
        }, 10);
      },
      async submit_ticket() {
        this.is_loading = true;

        let form_data = {};

        form_data = { ...this.ticket_data };

        // if(this.ticket_data.msisdn.toString().includes(",")) {
        //   form_data.msisdn = this.ticket_data.msisdn.toString().split(',');
        // }

        // MSIDN Field
        if(this.msisdn_field) {
          if(this.msisdn_field == this.bulkable_field) {
            form_data.msisdn = this.attrs[this.msisdn_field].split(',');
          } else {
            form_data.msisdn = this.attrs[this.msisdn_field];
          }
        } 
        // else {
        //   if(store.user) {
        //     form_data.msisdn = this.crop_leading_ligits(store.user.phone);
        //   }
        // }
        
        // Subcategories fields process
        form_data.attrs = await this.treat_all_fields();

        if(!form_data.attrs) {
          return;
        }

        let ajax_config = {
          url: this.make_ajax_url('/tickets/create', 9001),
          type: 'POST',
          max_retry: 2,
          data: form_data,
        }

        this.utils_async_ajax(ajax_config, (status, response) => {
          this.is_loading = false;
          if (_.isUndefined(response.error)) {
            if(!response || !Array.isArray(response) || response.length == 0) {
              this.show_alert("danger", "Désolé, aucun ticket n'a été ajouté. Veuillez réessayer à nouveau.");
              return;
            }

            this.show_alert("success", "Ticket(s) ajouté(s) avec succès.");
            
            this.reset();
            this.tickets_created = [...response];
            store.tickets_list = [...response, ...store.tickets_list];
            store.pending_tickets = [...response, ...store.pending_tickets];
          } else if(!_.isUndefined(response.error)) {
            this.show_alert("danger", response.error);
          }
        })
      },
      validate_primary_fields() {
        let flag = 1;

        // this.add_error("msisdn", false);
        // if (!this.ticket_data.msisdn.toString().includes(",") && !this.is_valid_number(this.ticket_data.msisdn)) {
        //   flag = 0;
        //   this.add_error("msisdn", "Numéro invalide.");
        // } else if(this.ticket_data.msisdn.toString().includes(",")) {
        //   let msisdn_list = this.ticket_data.msisdn.toString().split(',');
        //   msisdn_list.forEach((ms) => {
        //     if(!this.is_valid_number(ms.toString())) {
        //       flag = 0;
        //       this.add_error("msisdn", "Numéro(s) invalide(s).");
        //     }
        //   })
        // }
        
        this.add_error("category", false);
        if (_.isEmpty(this.ticket_data.category)) {
          flag = 0;
          this.add_error("category", "Veuillez sélectionner une catégorie.");
        }
        
        this.add_error("subcategory", false);
        if (this.subcategories.length > 0 && _.isEmpty(this.ticket_data.subcategory)) {
          flag = 0;
          this.add_error("subcategory", "Veuillez sélectionner une sous catégorie.");
        }

        return flag;
      },
      validate_secondary_fields() {
        let flag = 1;

        // if(!this.ticket_data.msisdn.toString().includes(",")) {
          this.subcategory_fields.forEach((field, ind) => {
            if(field.type != "group") {
              if(this.bulkable_field && this.attrs[field.name]) {
                let field_value_array = this.attrs[field.name].toString().split(',');

                if(field_value_array.length > 0) {
                  for(let fvalue of field_value_array) {
                    flag *= this.validate_field(fvalue, field);
                  }

                  return;
                }
              }

              flag *= this.validate_field(this.attrs[field.name], field);
            } else {
              for(let subfield of field.values) {
                flag *= this.validate_field(this.attrs[field.name][subfield.name], subfield);
              }
            }
          })
        // }

        return flag;
      },
      validate_field(field_value, field) {
        let vflag = 1;
        // Required
        this.add_error(field.name, false);
        if (field.required && (_.isUndefined(field_value) || !field_value || _.isEmpty(field_value.toString()))) {
          vflag = 0;
          this.add_error(field.name, "Ce champ est requis.");
          return vflag;
        } 
        
        // Phone
        if (field.type == 'phone' && !_.isEmpty(field_value) && !this.is_valid_number(field_value, "all")) {
          vflag = 0;
          this.add_error(field.name, "Numéro de téléphone invalide.");
          return vflag;
        } 
        
        // Pattern
        if(!_.isUndefined(field.pattern)) {
          let re = new RegExp(field.pattern);

          if(!re.test(field_value)) {
            vflag = 0;
            let error_message = field?.errors?.pattern ?? "Ce champ ne respecte pas le format indiqué.";
            this.add_error(field.name, error_message ?? "Valeur de champ invalide.");
            return vflag;
          }
        }
        
        // MIN
        if(!_.isUndefined(field.min)) {
          let is_ok = this.validate_min(field_value, field);

          if(!is_ok) {
            vflag = 0;
            let error_message = field?.errors?.min ?? `Ce champ doit comporter minimum ${field.min} caractères.`
            if(field.type == 'number') {
              error_message = field?.errors?.min ?? `Ce champ doit être supérieur ou égal à ${field.min}.`
            }

            this.add_error(field.name, error_message ?? "Valeur de champ invalide.");
            return vflag;
          }
        }

        // MAX
        if(!_.isUndefined(field.max)) {
          let is_ok = this.validate_max(field_value, field);

          if(!is_ok) {
            vflag = 0;
            let error_message = field?.errors?.max ?? `Ce champ doit comporter maximum ${field.max} caractères.`
            if(field.type == 'number') {
              error_message = field?.errors?.min ?? `Ce champ doit être inférieur ou égal à ${field.min}.`
            }
            
            this.add_error(field.name, "Valeur de champ invalide.");
            return vflag;
          }
        }

        return vflag;
      },
      validate_min(field_value, field) {
        let is_ok = true;

        switch (field.type) {
          case 'text':
            if(field_value && field_value.toString().length < field.min) {
              is_ok = false;
            }
            break;
        
          case 'number':
            if(field_value && parseFloat(field_value) < field.min) {
              is_ok = false;
            }
            break;
        
          case 'date':
            let min_date = new Date();

            if(field.min != 'now') {
              min_date = new Date(field.min);
            }

            let cur_date = new Date(field_value);

            if(cur_date < min_date) {
              is_ok = false;
            }
            break;
        
          default:
            break;
        }

        return is_ok;
      },
      validate_max(field_value, field) {
        let is_ok = true;

        switch (field.type) {
          case 'text':
            if(field_value && field_value.toString().length > field.max) {
              is_ok = false;
            }
            break;
        
          case 'number':
            if(field_value && parseFloat(field_value) > field.max) {
              is_ok = false;
            }
            break;
        
          case 'date':
            let max_date = new Date();

            if(field.max != 'now') {
              max_date = new Date(field.max);
            }

            let cur_date = new Date(field_value);

            if(cur_date > max_date) {
              is_ok = false;
            }
            break;
        
          default:
            break;
        }

        return is_ok;
      },
      auto_validate() {
        // if(Object.keys(this.errors).length > 0) {
        //   switch (this.step) {
        //     case 1:
        //       this.validate_primary_fields()
        //       break;
          
        //     case 2:
        //       this.validate_secondary_fields()
        //       break;
          
        //     default:
        //       break;
        //   }
        // }
      },
      get_reset_states() {
        this.reset_states.attrs = { val: this.attrs };
        this.reset_states.pieces = { val: this.pieces };
        this.reset_states.pieces_urls = { val: this.pieces_urls };
        this.reset_states.subcategories = { val: this.subcategories };
      },
      reset() {
        this.step = 1
        this.tickets_created = null;
        this.bulkable_field = null;
        this.msisdn_field = null;
        // this.ticket_data.msisdn = "";
        this.ticket_data.category = "";
        this.ticket_data.subcategory = "";
        this.ticket_data.subcatsearch = "";
        Object.keys(this.reset_states).forEach((stat) => {
          this[stat] = this.reset_states[stat].val;
        });

        setTimeout(() => {
          this.subcatsearch = "";
          jQuery("#addticketform")[0].reset();
        }, 80);
      },
    },
    components: { BaseOffcanvas }
}
</script>


<style scoped>
.ticket-id-copy input {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  position: relative;
  user-select: none;
  border: none !important;
  box-shadow: none !important;
}
.ticket-id-copy input::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";

}
.ticket-id-copy button {
  border-bottom-left-radius: 0 !important;
  border-top-left-radius: 0 !important;
  border-bottom-right-radius: 5px !important;
  border-top-right-radius: 5px !important;
}

.subcats {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}
.subcats .card {
  height: 120px !important;
  /* width: 100%;
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; */
}
.subcats .cat-radio label {
  transition: .3s;
} 
.subcats .cat-radio input:checked ~ label {
  background-color: #fc0;
  font-weight: bold;
}
</style>
