<script setup>
import { computed, ref } from 'vue'
import { Information, Close, CalendarOutline } from 'mdue'
import utils from '../../mixins/utils-mixins';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
    'modelValue': [String, Array, Number, Object],
    label: String,
    name: String,
    value: String,
    ph: String,
    topDesc: String,
    type: {
        type: String,
        default: "text"
    },
    fieldError: [String, Boolean],
    required: Boolean,

    allowed_exts: Array,
    allowed_mime_types: Array,
    file_max_size: {
        type: Number,
        default: 1024*1000*8
    },
    accept: String,
    multiple: Boolean,
    disabled: Boolean,
    autocomplete: String,
    extraClass: Object,
    min: [Number, String],
    max: [Number, String],
    minlength: [Number, String],
    maxlength: [Number, String],

    options: {
        type: Array,
        default: (() => [])()
    }
})
const emit = defineEmits(['update:modelValue'])

const input_value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
});

let previews = ref({});
let dp = ref();

const handle_change = (event) => {

    for(let file of (event.target.files ?? [])) {
        let names = file.name.toString().split('.');
        let extension = names.pop();
        
        if(props.allowed_exts && !props.allowed_exts.includes(extension.toLowerCase())) {
            utils.methods.show_alert("danger", "Fichier non autorisé");
            continue;
        }
        
        if(props.allowed_mime_types && !props.allowed_mime_types.includes(file.type)) {
            utils.methods.show_alert("danger", "Fichier non autorisé");
            continue;
        }
        
        if(file.size && file.size > (props.file_max_size ?? 1024*1000*8)) {
            utils.methods.show_alert("danger", "Fichier trop volumineux");
            continue;
        }
        
        if(file.type.toString().includes("image")) {
            utils.methods.compress_img(file, (err, result) => {
                if(!err) {
                    if(props.multiple) {
                        input_value.value.push(result);
                    } else {
                        input_value.value = [result]
                    }
                    readAndPreview(result)
                }
            });
        } else {
            if(props.multiple) {
                input_value.value.push(file);
            } else {
                input_value.value = [file];
            }
        }
    }
}

const readAndPreview = (file) => {
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          previews.value = { ...previews.value, [file.name]: reader.result };
        },
        false,
      );

      reader.readAsDataURL(file);
    }
}

const open_date_picker = (event) => {
    document.getElementById(props.name).showPicker();
} 
</script>

<template>
    <div class="form-group mb-2" :class="{ 'radio-box': type == 'radio' }">
        <!-- Radio -->
        <label v-if="type == 'radio'" class="d-flex align-items-center">
            <span :class="{ checkmark: true, checked: false }"></span>
            <input type="radio" :id="name" v-model="input_value" :value="value" />
            <div>
                <p class="m-0">{{ label }}</p>
            </div>
        </label>

        <!-- Not Radio ? Normal Label -->
        <label v-else-if="label" :for="name" :class="{ 'required': fieldError, 'fw-bold': type == 'file' }">
            {{ label }} <span v-if="required" class="required">*</span>
        </label>

        <p v-if="topDesc" class="text-muted mt-1">
            {{ topDesc }}
        </p>
        <div v-if="$slots.topDesc" class="text-muted mt-1">
            <slot name="topDesc"></slot>
        </div>

        <!-- Text area -->
        <textarea v-if="type == 'textarea'" :id="name" v-model="input_value" :placeholder="ph" :disabled="disabled" class="form-control" :class="{ 'is-invalid': fieldError }" rows="5" :minlength="minlength ?? min" :maxlength="maxlength ?? max"></textarea>
        
        <!-- Select -->
        <select v-else-if="type == 'select'" :id="name" v-model="input_value" :disabled="disabled" class="form-control" :class="{ 'is-invalid': fieldError }">
            <option value="" disabled>{{ ph }}</option>
            <template v-for="(opt, index) in options" :key="'Option '+index">
                <option v-if="!opt.is_group" :value="opt.value ?? (opt.label ?? opt)">
                    {{ opt.label ?? opt }}
                </option>
                <optgroup v-else :label="opt.label ?? opt">
                    <option v-for="(subopt, ind) in opt.value" :key="'SubOption '+ind" :value="subopt.value ?? (subopt.label ?? subopt)">
                        {{ subopt.label ?? subopt }}
                    </option>
                </optgroup>
            </template>
        </select>
        
        <!-- File -->
        <label v-else-if="type == 'file'" :for="name" class="field-input" :class="{ 'is-invalid': fieldError }">
            <input type="file" :id="name" :multiple="multiple" :accept="accept" class="form-control" @change="handle_change($event)" />
            <div class="files-list" @click.prevent>
                <div v-for="(file, index) in input_value" :key="'File'+index" class="rounded p-3 mb-2 d-flex justify-content-between align-items-center gap-2">
                    <div v-if="file.type.toString().includes('image') && previews[file.name]" style="width: 15%;">
                        <img :src="previews[file.name]" alt="Preview" class="img-preview">
                    </div>
                    <div class="w-75">
                        <div class="fw-bold fs-6 text-truncate">{{ file.name }}</div>
                        <small>{{ bytes_to_size(file.size) }}</small>
                    </div>
                    <div class="close-btn">
                        <button @click="($event) => input_value.splice(index, 1)">
                            <Close style="font-size: 15px;" />
                        </button>
                    </div>
                </div>
            </div>
            <base-button v-if="multiple || (!multiple && input_value && input_value.length == 0)" @click="$event.target.parentNode.click();" dark outline small right type="button">{{ ph ?? 'Ajouter un fichier' }}</base-button>
        </label>

        <label 
            v-else-if="['date', 'datetime-local', 'time'].includes(type)" 
            :for="name" 
            class="d-block sform-control sfield-date"
            :class="{ 'is-invalid': fieldError }"
            >
            <!-- @click="($event) => open_date_picker($event)" -->
            <!-- <div class="d-flex justify-content-between align-items-center">
                <div>{{ datetime_format(input_value, type) }}</div>
                <div>
                    <CalendarOutline style="font-size: 20px;" />
                </div>
            </div> -->
            <VueDatePicker 
                ref="dp"
                v-model="input_value" :placeholder="ph" :disabled="disabled" 
                locale="fr-FR"
                :enable-time-picker="type.includes('time')"
                :time-picker="type == 'time'"
                :time-picker-inline="type.includes('datetime')"
                minutes-grid-increment="1"
                :format="(type == 'time' ? '' : 'dd/MM/yyyy ') + (type.includes('datetime') ? 'à ' : '') + (type.includes('time') ? 'HH:mm' : '')"
                :state="fieldError ? false : null"
                auto-apply
                :min-date="min ? (min == 'now' ? (new Date) : (new Date(min))) : null"
                :max-date="max ? (max == 'now' ? (new Date) : (new Date(max))) : null"
                :model-type="type == 'time' ? null : (type.includes('datetime') ? `yyyy-MM-dd'T'HH:mm:ss.SSSXXX` : `yyyy-MM-dd`)"
            >
                <!-- <template #action-buttons>
                    <div class="mt-3 d-flex align-items-center">
                        <button class="btn" style="font-size: 11px;" @click="dp?.closeMenu()">Annuler</button>
                        <button class="btn btn-primary" style="font-size: 11px;" @click="dp?.selectDate()">Selectionner</button>
                    </div>
                </template> -->
            </VueDatePicker>
            <!-- <input :id="name" :type="type" v-model="input_value" :placeholder="ph" :disabled="disabled" class="form-control" :class="{ 'is-invalid': fieldError, ...extraClass }" :autocomplete="autocomplete" /> -->
        </label>

        <!-- Other input type -->
        <input v-else :id="name" :type="type" v-model="input_value" :placeholder="ph" :disabled="disabled" class="form-control" :class="{ 'is-invalid': fieldError, ...extraClass }" :autocomplete="autocomplete" :min="min" :max="max" />
        
        <p v-if="$slots.desc" class="text-muted mt-1 px-2">
            <slot name="desc"></slot>
        </p>
        <div v-if="fieldError" class="invalid-feedback">
            <span style="padding-right: 3px;">
                <Information style="font-size: 18px;" />
            </span>
            <span>{{ fieldError }}</span>
        </div>
    </div>
</template>

<style scoped>
.field-input {
    display: block;
    margin-bottom: 30px;
}
.field-input input[type="file"] {
    display: none;
}
.files-list>div {
    background-color: #001A24;
    color: white;
}
.files-list .close-btn button {
    width: 30px;
    height: 30px;
    background-color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

select {
    position: relative;
    -webkit-appearance: auto !important;
    -moz-appearance: auto !important;
    appearance: auto !important;
}
/* select::after {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    content: "x";
    background: red;
    z-index: 22;
} */
.field-date input {
    width: 0;
    height: 0;
    overflow: hidden;
    padding: 0;
    opacity: 0;
}

.img-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: white;
    padding: 2px;
    border-radius: 5px;
}
</style>