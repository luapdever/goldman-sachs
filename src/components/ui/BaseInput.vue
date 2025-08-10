<script setup>
import { computed, onMounted, ref } from 'vue'
import { Information, Close, FileDocument } from 'mdue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useAppUtils } from '@/composables/useAppUtils';
import { useLang } from '@/composables/useLang';

const appUtils = useAppUtils();
const l = useLang()

const props = defineProps({
    'modelValue': [String, Array, Number, Object],
    'modelPreviews': [Object],
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
    boolRadio: Boolean,

    allowed_exts: Array,
    allowed_mime_types: Array,
    arrIndex: Number,
    configs: Array,
    file_max_size: {
        type: Number,
        default: 1024*1000*8
    },
    accept: String,
    multiple: Boolean,
    max: Number,
    disabled: Boolean,
    autocomplete: String,
    pattern: String,
    extraClass: Object,

    options: {
        type: Array,
        default: (() => [])()
    }
})

const emit = defineEmits(['update:modelValue', 'update:modelPreviews']);

const input_value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
});

let previews = computed({
  get() {
    return props.modelPreviews
  },
  set(value) {
    emit('update:modelPreviews', value)
  }
});

let dp = ref();

const handleChange = (event) => {
    for(let file of (event.target.files ?? [])) {
        if(props.max && input_value.value?.length >= props.max) {
            return; 
        }

        let names = file.name.toString().split('.');
        let extension = names.pop();
        
        if(props.allowed_exts && !props.allowed_exts.includes(extension.toLowerCase())) {
            appUtils.toggleGlobalAlert("Fichier non autorisé", "danger");
            continue;
        }
        
        if(props.allowed_mime_types && !props.allowed_mime_types.includes(file.type)) {
            appUtils.toggleGlobalAlert("Fichier non autorisé", "danger");
            continue;
        }
        
        if(file.size && file.size > (props.file_max_size ?? 1024*1000*8)) {
            appUtils.toggleGlobalAlert("Fichier trop volumineux", "danger");
            continue;
        }
        
        if(file.type.toString().includes("image") && appUtils.compress_img) {
            appUtils.compress_img(file, (err, result) => {
                if(!err) {
                    if(props.multiple) {
                        input_value.value.push(result);
                    } else {
                        input_value.value = [result];
                    }
                    readAndPreview(result);
                }
            });
        } else {
            if(props.multiple) {
                input_value.value.push(file);
            } else {
                input_value.value = [file];
            }
            readAndPreview(file)
        }
    }
}

const readAndPreview = (file) => {
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          previews.value = { ...previews?.value, [file.name]: reader.result };
        },
        false,
      );

      reader.readAsDataURL(file);
    }
}

const addArrayEl = () => {
    let copy = input_value.value;
    let el = {};

    for(const config of props.configs) {
        el[config.name] = config.value ?? "";
    }

    copy.push(el);

    input_value.value = [...(copy ?? [])];
}

const removeArrayEl = (ind) => {
    let copy = input_value.value;
    copy?.splice(ind, 1);
    input_value.value = [...(copy ?? [])];
}

// const open_date_picker = (event) => {
//     document.getElementById(props.name).showPicker();
// } 

onMounted(() => {
    if(props.value) {
        input_value.value = props.value;
    }
});
</script>

<template>
    <div class="form-group mb-3" :class="{ 'radio-box': type == 'radio' }">
        <!-- Radio -->
        <label v-if="type == 'radio' && boolRadio" class="d-flex align-items-center">
            <span :class="{ checkmark: true, checked: false }"></span>
            <input type="radio" :id="name + (arrIndex >= 0 ? '_' + arrIndex : '')" v-model="input_value" :value="value" />
            <div>
                <p class="m-0">{{ label }}</p>
            </div>
        </label>

        <!-- Not Radio ? Normal Label -->
        <label v-else-if="label" :for="name + (arrIndex >= 0 ? '_' + arrIndex : '')" class="form-label fw-bold" :class="{ 'required': fieldError }">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </label>

        <p v-if="topDesc" class="form-text mt-1">
            {{ topDesc }}
        </p>
        <div v-if="$slots.topDesc" class="form-text mt-1">
            <slot name="topDesc"></slot>
        </div>

        <!-- Text area -->
        <textarea v-if="type == 'textarea'" :id="name + (arrIndex >= 0 ? '_' + arrIndex : '')" v-model="input_value" :placeholder="ph" :disabled="disabled" class="form-control" :class="{ 'is-invalid': fieldError }" rows="5"></textarea>
        
        <!-- Select -->
        <select v-else-if="type == 'select'" :id="name + (arrIndex >= 0 ? '_' + arrIndex : '')" v-model="input_value" :disabled="disabled" class="form-select" :class="{ 'is-invalid': fieldError }">
            <option value="" disabled>{{ ph }}</option>
            <template v-for="(opt, index) in options" :key="'Option '+index">
                <option v-if="!opt.is_group" :value="opt.value ?? (opt.label ?? opt)">
                    {{ opt.label ?? opt }}
                </option>
                <optgroup v-else :label="opt.label ?? opt">
                    <option v-for="(subopt, ind) in opt.value" :key="'SubOption '+ind" :value="subopt.value ?? (subopt.label ?? subopt)" v-html="subopt.label ?? subopt"></option>
                </optgroup>
            </template>
        </select>
        
        <!-- File -->
        <label v-else-if="type == 'file'" :for="name + (arrIndex >= 0 ? '_' + arrIndex : '')" class="field-input" :class="{ 'is-invalid': fieldError }">
            <input type="file" :id="name + (arrIndex >= 0 ? '_' + arrIndex : '')" :multiple="multiple" :accept="accept" class="form-control" @change="handleChange($event)" />
            <div class="files-list mt-2" @click.prevent>
                <div v-for="(file, index) in input_value" :key="'File'+index" class="rounded p-3 mb-2 d-flex justify-content-between align-items-center gap-2">
                    <div class="d-flex align-items-center gap-2 w-100">
                        <div v-if="file.type.toString().includes('image') && previews[file.name]" style="width: 80px; height: 50px;">
                            <img :src="previews[file.name]" alt="Preview" class="img-preview">
                        </div>
                        <div v-else>
                            <FileDocument style="font-size: 40px;" />
                        </div>
                        <div class="w-75">
                            <div class="fw-bold fs-6 text-truncate">{{ file.name }}</div>
                            <small>{{ appUtils.bytesToSize(file.size) }}</small>
                        </div>
                    </div>
                    <div class="close-btn">
                        <button @click="($event) => input_value.splice(index, 1)">
                            <Close style="font-size: 15px;" />
                        </button>
                    </div>
                </div>
            </div>
            <button v-if="(multiple && (!max || max && max > input_value?.length)) || (!multiple && input_value && input_value.length == 0)" @click="$event.target.parentNode.click();" type="button" class="btn btn-link btn-sm fw-bold text-decoration-none">
                {{ ph ?? l._s('Ajouter un fichier') }}
            </button>
        </label>

        <label 
            v-else-if="['date', 'datetime-local', 'time'].includes(type)" 
            :for="name + (arrIndex >= 0 ? '_' + arrIndex : '')" 
            class="d-block sform-control sfield-date"
            :class="{ 'is-invalid': fieldError }"
            >
            <!-- @click="($event) => open_date_picker($event)" -->
            <!-- <div class="d-flex justify-content-between align-items-center">
                <div>{{ datetime_format(input_value, type) }}</div>
                <div>
                 style="font-size: 20px;" />
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
            >
                <!-- <template #action-buttons>
                    <div class="mt-3 d-flex align-items-center">
                        <button class="btn" style="font-size: 11px;" @click="dp?.closeMenu()">Annuler</button>
                        <button class="btn btn-primary" style="font-size: 11px;" @click="dp?.selectDate()">Selectionner</button>
                    </div>
                </template> -->
            </VueDatePicker>
            <!-- <input :id="name + (arrIndex >= 0 ? '_' + arrIndex : '')" :type="type" v-model="input_value" :placeholder="ph" :disabled="disabled" class="form-control" :class="{ 'is-invalid': fieldError, ...extraClass }" :autocomplete="autocomplete" :pattern="pattern" /> -->
        </label>

        <!-- Radio non boolean type -->
         <div v-else-if="['radio', 'checkbox'].includes(type) && !boolRadio" class="d-flex gap-3 flex-wrap">
             <div v-for="(opt, ind) in options" :key="'RCheckbox' + ind">
                <input :id="`${name}_opt_${ind}`" :type="type" v-model="input_value" :disabled="disabled" :checked="opt?.value == input_value" :value="opt?.value ?? opt" class="form-check-input me-2">
                <label :for="`${name}_opt_${ind}`" type="button" class="form-check-label">
                    {{ opt?.label ?? opt }}
                </label>
             </div>
         </div>
        
        <!-- Array input type -->
        <div v-else-if="['array'].includes(type)">
            <div v-for="(inpval, kind) in (input_value ?? [])" :key="'InputVal' + kind" class="row">
                <div v-for="(config, ky) in configs" :key="'Config' + ky" :class="config.class">
                    <BaseInput
                        :arr-index="kind"
                        :type="config.type"
                        :label="config.label"
                        :name="config.name"
                        :required="config.required"
                        :options="config.options"
                        :ph="`${config.ph ? l._s(`${config.ph}`) : ''}`"
                        :accept="config.allowed_exts ? `.${config.allowed_exts.join(', .')}` : null"
                        autocomplete="off"
                        v-model="inpval[`${config.name}`]"
                        :model-previews="previews"
                        @update:modelPreviews="(data) => previews = { ...(previews ?? {}), ...(data ?? {}) }"
                    >
                        <template v-if="config.bottomDesc" v-slot:desc>
                            <span v-html="config.bottomDesc"></span>
                        </template>

                        <template v-if="config.type == 'file'" v-slot:topDesc>
                            <div v-if="config.importUrl" class="mb-2">
                                <div>{{ config.importDesc }}</div>
                                <a target="_blank" rel="noopener noreferrer" download :href="config.importUrl[`${l.current_lang.value}_version`] ?? config.importUrl" class="download-link fs-6">{{ l.data.click_download }}</a>
                            </div>
                            <div v-if="config.topDesc" v-html="config.topDesc"></div>
                            <div>{{ l.data.allowed_exts }}: <strong>{{ config.allowed_exts ? `.${config.allowed_exts.join(', .')}` : 'Tout' }}</strong></div>
                            <div v-if="config.file_max_size">{{ l.data.max_size }}: {{ appUtils.bytesToSize(config.file_max_size, true) }}</div>
                        </template>
                    </BaseInput>
                </div>

                <div class="col-12 d-flex justify-content-end mb-2">
                    <button v-if="!required || (required && input_value.length > 1)" class="btn btn-danger fw-bold px-4" type="button" @click="() => removeArrayEl(kind)">{{ l._s("Retirer") }}</button>
                </div>
                <hr>
            </div>

            <div>
                <button class="btn btn-dark" type="button" @click="() => addArrayEl()">{{ ph }}</button>
            </div>
        </div>
        
        <!-- Other input type -->
        <input v-else :id="name + (arrIndex >= 0 ? '_' + arrIndex : '')" :type="type" v-model="input_value" :placeholder="ph" :disabled="disabled" class="form-control" :class="{ 'is-invalid': fieldError, ...extraClass }" :autocomplete="autocomplete" :pattern="pattern" />
        
        <p v-if="$slots.desc" class="form-text mt-1 mb-0">
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
input::placeholder {
    font-size: 13px;
}
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

/* select {
    position: relative;
    -webkit-appearance: auto !important;
    -moz-appearance: auto !important;
    appearance: auto !important;
} */
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
    border-radius: 3px;
}
</style>