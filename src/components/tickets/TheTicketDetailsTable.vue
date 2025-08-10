<template>
  <div class="details-ctn">
    <table class="table table-striped">
      <tbody>
        <tr></tr>
        <tr>
          <td class="fw-bold">#{{ ticket.id }}</td>
          <td class="text-end">
            <base-badge :color="status[ticket.status] ? status[ticket.status].color : 1" style="font-size: 12px; padding: 5px !important;">
                <span class="px-1">{{ status[ticket.status] ? status[ticket.status].label : status.pending.label }}</span>
            </base-badge>
          </td>
        </tr>
        <tr>
          <td class="text-info2 fw-bold">Date de création</td>
          <td class="text-muted text-end">
            {{ moment_datetime_format(ticket.created_date) }}
          </td>
        </tr>
        <tr>
          <td class="text-info2 fw-bold">Catégorie</td>
          <td class="text-muted text-end">
            <base-badge color="x" outline style="font-size: 12px; padding: 5px !important;">
              <span class="px-1">{{ get_category(ticket.category) ? get_category(ticket.category).title : 'Inconnu' }}</span>
            </base-badge>
          </td>
        </tr>
        <tr v-if="ticket.attrs.subcategory">
          <td class="text-info2 fw-bold">Sous catégorie</td>
          <td class="text-muted text-end">
            <base-badge color="x" outline style="font-size: 12px; padding: 5px !important;">
              <span class="px-1">
                {{ 
                  get_subcategory(ticket.category, ticket.attrs.subcategory) 
                  ? get_subcategory(ticket.category, ticket.attrs.subcategory).title 
                  : 'Inconnu' 
                }}
              </span>
            </base-badge>
          </td>
        </tr>

        <!-- ATTRS -->
        <template v-if="ticket.attrs.attrs">
          <!-- SIM SWAP -->
          <template v-if="ticket.attrs.attrs.action == 'sim_swap'">
            <tr>
              <td>
                <div class="text-info2 fw-bold mb-2">Numéro de la SIM vierge</div>
              </td>
              <td>
                <div class="text-muted text-end">
                  {{ ticket.attrs.attrs.b_number }}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="text-info2 fw-bold mb-2">Numéro de téléphone à retirer</div>
              </td>
              <td>
                <div class="text-muted text-end">
                  {{ ticket.attrs.attrs.msisdn }}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="text-info2 fw-bold mb-2">Autre numéro</div>
              </td>
              <td>
                <div class="text-muted text-end">
                  {{ ticket.attrs.attrs.other_msisdn }}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="text-info2 fw-bold mb-2">Type de pièce</div>
              </td>
              <td>
                <div class="text-muted text-end">
                  {{ ticket.attrs.attrs.card_type }}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="text-info2 fw-bold mb-2">Date d'expiration de la pièce</div>
              </td>
              <td>
                <div class="text-muted text-end">
                  {{ ticket.attrs.attrs.card_date }}
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="text-info2 fw-bold mb-2">Photo de la pièce</div>
                <div>
                  <a :href="ticket.attrs.attrs.card_url" target="_blank" download>
                    <img :src="ticket.attrs.attrs.card_url" class="img-fluid img-thumbnail" width="250" alt="">
                  </a>
                </div>
              </td>
            </tr>
            <tr v-if="ticket.attrs.attrs.other_pieces_urls">
              <td colspan="2">
                <div class="text-info2 fw-bold mb-2">Autres pièces</div>
                <div v-for="(piece, index) in ticket.attrs.attrs.other_pieces_urls" :key="'Piece'+index" class="mb-2">
                  <a :href="piece" target="_blank" download>
                    <img :src="piece" class="img-fluid img-thumbnail" width="250" alt="">
                  </a>
                </div>
              </td>
            </tr>
            <tr v-for="(question, ind) in ticket.attrs.attrs.questions" :key="'Question'+ind">
              <td colspan="2">
                <div class="text-info2 fw-bold mb-2">{{ question.title }}</div>
                <div>
                  {{ question.answer }}
                </div>
              </td>
            </tr>
          </template>

          <!-- OTHER TICKETS TYPES -->
          <template v-else v-for="(attr, index) in Object.keys(ticket.attrs.attrs)" :key="'Attr'+index">
            <template v-if="!ticket.attrs.attrs[attr].type || ticket.attrs.attrs[attr].type != 'group'">
              <tr>
                <td colspan="2">
                  <div class="text-info2 fw-bold mb-2 text-uppercase">
                    {{ ticket.attrs.attrs[attr].label ?? attr }}
                  </div>
                  <div v-if="get_field_type(attr)?.type == 'file'">
                    <a :href="(ticket.attrs.attrs[attr].value ?? ticket.attrs.attrs[attr])" target="_blank" download>
                      <img :src="(ticket.attrs.attrs[attr].value ?? ticket.attrs.attrs[attr])" class="img-fluid img-thumbnail" width="250" alt="Image" @error="(err) => { console.log(err) }">
                    </a>
                  </div>
                  <div v-else-if="['date', 'datetime-local', 'time'].includes(get_field_type(attr)?.type)">
                    <span>
                      {{ 
                        moment_datetime_format(
                          ticket.attrs.attrs[attr].value ?? ticket.attrs.attrs[attr], 
                          'DD MMMM YYYY' + (get_field_type(attr)?.type?.includes('time') ? ' à HH:mm' : '')
                        ) 
                      }}
                    </span>
                  </div>
                  <div v-else>
                    <template v-if="isArray((ticket.attrs.attrs[attr].value ?? ticket.attrs.attrs[attr]))">
                      <div v-for="(s_attr, ind) in (ticket.attrs.attrs[attr].value ?? ticket.attrs.attrs[attr])" :key="'Attr'+ind">
                        <a v-if="is_valid_URL(s_attr)" :href="s_attr" target="_blank" download>
                          <img v-if="isImage(s_attr)" :src="s_attr" alt="Image" class="img-fluid img-thumbnail mb-2" width="250" />
                          <div v-else class="d-inline-flex align-items-center gap-1 p-1 pe-2 border rounded">
                            <FileDocumentOutline class="fs-3" />
                            <span class="text-decoration-underline">Document</span>
                          </div>
                        </a>
                        <span v-else>{{ s_attr }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <div>{{ (ticket.attrs.attrs[attr].value ?? ticket.attrs.attrs[attr]) }}</div>
                    </template>
                  </div>
                </td>
              </tr>
            </template>
            
            <template v-else>
              <tr>
                <td class="text-info2 fw-bold" colspan="2"></td>
              </tr>
              <tr>
                <td class="text-info2 fw-bold" colspan="2">{{ ticket.attrs.attrs[attr].label ?? attr }}</td>
              </tr>
              <tr v-for="(subfield, ind) in ticket.attrs.attrs[attr].value" :key="'Sub Attr'+ind">
                <td colspan="2">
                  <div class="text-info2 fw-bold mb-2 text-uppercase">
                    {{ subfield.label }}
                  </div>
                  <div v-if="get_field_type(attr, ind)?.type == 'file'">
                    <a :href="(subfield.value)" target="_blank" download>
                      <img v-if="isImage((subfield.value))" :src="(subfield.value)" class="img-fluid img-thumbnail" width="250" alt="Image">
                      <div v-else class="d-inline-flex align-items-center gap-1 p-1 pe-2 border rounded">
                        <FileDocumentOutline class="fs-3" />
                        <span class="text-decoration-underline">Document</span>
                      </div>
                    </a>
                  </div>
                  <div v-else-if="['date', 'datetime-local', 'time'].includes(get_field_type(attr, ind)?.type)">
                    <span>
                      {{ 
                        moment_datetime_format(
                          subfield.value, 
                          'DD MMMM YYYY' + (get_field_type(attr, ind)?.type?.includes('time') ? ' à HH:mm' : '')
                        ) 
                      }}
                    </span>
                  </div>
                  <div v-else>
                    <template v-if="isArray((subfield.value))">
                      <div v-for="(s_attr, ind) in (subfield.value)" :key="'Attr'+ind">
                        <a v-if="is_valid_URL(s_attr)" :href="s_attr" target="_blank" download>
                          <img :src="s_attr" alt="Image" class="img-fluid img-thumbnail mb-2" width="250" />
                        </a>
                        <span v-else>{{ s_attr }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <div>{{ (subfield.value) }}</div>
                    </template>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </template>

        <!-- End of Fields -->

        <tr>
          <td class="text-info2 fw-bold">Etat actuel</td>
          <td class="text-muted text-end">
            <base-badge :color="status[ticket.status] ? status[ticket.status].color : 1" style="font-size: 12px; padding: 5px !important;">
                <span class="px-1">{{ status[ticket.status] ? status[ticket.status].label : status.pending.label }}</span>
            </base-badge>
          </td>
        </tr>
        <tr v-if="ticket.status == 'closed'">
          <td class="text-info2 fw-bold">Date de fermeture</td>
          <td class="text-muted">
            {{ moment_datetime_format(ticket.closed_date) }}
          </td>
        </tr>
        <tr v-if="ticket.status == 'closed'">
          <td colspan="2">
            <div class="text-info2 fw-bold mb-2">Feedback Client</div>
            <div class="text-muted" v-html="replace_links_with_anchors(ticket?.customer_feedback ?? 'Aucun feedback')"></div>
          </td>
        </tr>
        <tr v-if="ticket.status == 'closed'">
          <td colspan="2">
            <div class="text-info2 fw-bold mb-2">Feedback Agent</div>
            <div class="text-muted" v-html="replace_links_with_anchors(ticket?.agent_feedback ?? 'Aucun feedback')"></div>
          </td>
        </tr>
        <tr>
          <td class="text-info2 fw-bold">Note</td>
          <td class="text-muted">
            <span v-for="n in 5" :key="'Star'+n" class="px-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path 
                  d="M8.99975 13.1397L12.1122 15.0222C12.6823 15.3672 13.3797 14.8572 13.2297 14.2122L12.4047 10.6722L15.1572 8.28719C15.6597 7.85219 15.3897 7.02719 14.7297 6.97469L11.1072 6.66719L9.68975 3.32219C9.43475 2.71469 8.56475 2.71469 8.30975 3.32219L6.89225 6.65969L3.26975 6.96719C2.60975 7.01969 2.33975 7.84469 2.84225 8.27969L5.59475 10.6647L4.76975 14.2047C4.61975 14.8497 5.31725 15.3597 5.88725 15.0147L8.99975 13.1397Z" 
                  :fill="ticket.notation && n <= parseInt(ticket.notation, 10) ? '#F2C94C' : '#b0b0b0'"
                />
              </svg>
            </span>
          </td>
        </tr>
        <!-- <tr>
          <td colspan="2">
            <div class="text-info2 fw-bold mb-2">Pièces jointes</div>
            <div class="w-100">
              <div v-for="(piece, index) in ticket.pieces" :key="'Piece'+index" class="border border-dark rounded p-3 d-flex justify-content-between align-items-center">
                <div class="w-75 text-truncate fw-bold">{{ piece.name }}</div>
              </div>
            </div>
          </td>
        </tr> -->
      </tbody>
    </table>

    <div class="mt-5 mb-5 p-3">
      <base-button v-if="!relanched && !cancelled && !['cancelled', 'closed'].includes(ticket.status)" :disabled="in_relaunching || !can_relaunch" dark outline block @click="relaunch_ticket()">
        <span v-if="!in_relaunching">Relancer</span>
        <span v-else class="spinner-border text-dark" role="status"></span>
      </base-button><br>
      <base-button v-if="!cancelled && !['cancelled', 'closed'].includes(ticket.status)" :disabled="in_cancelling" danger block @click="cancel_ticket()">
        <span v-if="!in_cancelling">Annuler</span>
        <span v-else class="spinner-border text-dark" role="status"></span>
      </base-button>
    </div>
  </div>
</template>

<script>
import { FileDocumentOutline } from 'mdue';

export default {
  components: {
    FileDocumentOutline,
  },
  props: {
    ticket: Object
  },
  data() {
    return {
      in_cancelling: false,
      in_relaunching: false,
      cancelled: false,
      relanched: false,
    }
  },
  mounted() {
    
  },
  computed: {
    status() {
      return store.status_types;
    },
    socket() {
      return store.socket;
    },
    can_relaunch() {
      let now_date = new Date();
      let ticket_date = new Date(this.ticket.created_date)

      return (now_date.getTime() - ticket_date.getTime()) > 1000*60*60*2;
    },
    cat_fields() {
      let fields = []
      let cat = this.get_subcategory(this.ticket?.category, this.ticket?.attrs.subcategory);

      if(!cat) {
        return [];
      }

      fields = cat?.metas?.fields ?? [];

      return fields;
    },
  },
  methods: {
    get_category(category_id) {
      let category = store.categories_list.find((cat) => cat.id == category_id);

      return category;
    },
    get_subcategory(category_id, subcategory_id) {
      let category = this.get_category(category_id);

      if(!subcategory_id || !category) return category;

      if(!category.subcategories) {
        return null;
      }

      let subcategory = category.subcategories.find((subcat) => subcat.id == subcategory_id);

      return subcategory;
    },
    get_field_type(field_name, subfield_name = null) {
      const field = this.cat_fields.find((fld) => fld?.name == field_name);

      if(!subfield_name || !field) {
        return field;
      }

      const subfield = field.values.find((subfld) => subfld?.name == subfield_name);
      return subfield;
    },
    cancel_ticket() {
      this.in_cancelling = true;

      let ajax_config = {
        url: this.make_ajax_url('/tickets/cancel', 9001),
        type: 'POST',
        max_retry: 2,
        data: {
          ticket_id: this.ticket.id,
        },
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.in_cancelling = false;
        if (_.isUndefined(response.error)) {
          this.cancelled = true;
          this.show_alert("success", "Ticket annulé avec succès.");
        }
      })
    },
    relaunch_ticket() {
      this.in_relaunching = true;

      let ajax_config = {
        url: this.make_ajax_url('/tickets/relaunch', 9001),
        type: 'POST',
        max_retry: 2,
        data: {
          ticket_id: this.ticket.id,
        },
      }

      this.utils_async_ajax(ajax_config, (status, response) => {
        this.in_relaunching = false;
        if (_.isUndefined(response.error)) {
          this.show_alert("success", "Ticket relancé avec succès.");
          this.relanched = true;
        }
      })
    }
  },
}
</script>

<style scoped>
table tr td {
  padding: 20px;
}

.details-ctn {
  max-height: 87vh;
  overflow: auto;
}
.details-ctn::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

.details-ctn::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, .4);
  box-shadow: 0 0 1px rgba(255, 255, 255, .5);
}

@media screen and (min-width: 993px) {
  table tr td:nth-child(2) {
    text-align: right;
  }
}
@media screen and (min-width: 768px) {
  /* .details-ctn {
    max-height: 85vh;
  } */
}
</style>
