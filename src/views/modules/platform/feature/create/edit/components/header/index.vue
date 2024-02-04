<!--结构必须如下 创建新组件是可以复制以下html-->
<template>
  <div class="micro-header-box component-header">
    <!--预览控制区-->
    <div class="design-preview-controller">
      <div
        v-if="formData.bgType===0"
        class="preview-header"
        :style="{ 'background': formData.bgColor }"
      >
        <div
          class="preview-header-title"
          :style="{color: formData.textColor}"
        >
          {{ formData.title || $t('shopFeature.header.microTitle') }}
        </div>
      </div>
      <div
        v-else-if="formData.bgType===1"
        class="preview-header"
        :style="[formData.bgImg ? {'background-image': `url(${checkFileUrl(formData.bgImg)}) !important`} : { 'background': formData.bgColor }]"
      >
        <div
          class="preview-header-title"
          :style="{color: formData.textColor}"
        >
          {{ formData.title || $t('shopFeature.header.microTitle') }}
        </div>
      </div>
      <div
        v-else
        class="preview-header"
      >
        <div
          class="preview-header-title"
          :style="{color: formData.textColor}"
        >
          {{ formData.title || $t('shopFeature.header.microTitle') }}
        </div>
      </div>
    </div>
    <!--编辑工作区-->
    <div
      v-show="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          {{ $t('shopFeature.header.pageName') }}
        </div>
        <div style="padding: 20px 0;background: #fff">
          <el-form
            ref="formDataRef"
            :model="formData"
            :rules="rules"
            label-width="100px"
            @submit.prevent
          >
            <el-form-item
              :label="$t('shopFeature.header.pageName')"
              prop="title"
            >
              <el-input
                v-model.trim="formData.title"
                maxlength="10"
                :placeholder="$t('shopFeature.header.pageNamePlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="$t('shopFeature.header.fontColor')">
              <el-radio
                v-model="formData.textColor"
                label="#ffffff"
              >
                {{ $t('shopFeature.header.white') }}
              </el-radio>
              <el-radio
                v-model="formData.textColor"
                label="#000000"
              >
                {{ $t('shopFeature.header.black') }}
              </el-radio>
            </el-form-item>
            <el-form-item :label="$t('shopFeature.header.headerBg')">
              <el-radio
                v-model="formData.bgType"
                :label="0"
              >
                {{ $t('shopFeature.header.customColor') }}
              </el-radio>
              <el-radio
                v-model="formData.bgType"
                :label="1"
              >
                {{ $t('shopFeature.header.pic') }}
              </el-radio>
              <div v-if="formData.bgType === 1">
                <img-upload v-model="formData.bgImg" />
                <el-button
                  style="margin-top: 15px;"
                  plain
                  @click="formData.bgImg=''"
                >
                  {{ $t('shopFeature.header.reset') }}
                </el-button>
              </div>
              <el-form-item
                v-if="formData.bgType === 0"
                prop="bgColor"
              >
                <el-color-picker v-model="formData.bgColor" />
              </el-form-item>
            </el-form-item>
            <div class="header-edit-tips">
              字体/背景仅小程序及APP生效
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ImgUpload from '@/components/img-upload/index.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  isCheckMySelf: { // 是否开始内部验证 比如提示弹窗等。。。
    type: Boolean,
    default: false
  },
  currentComponent: { // 当前组件
    type: Object,
    default: () => {
      return {}
    }
  },
  indexKey: { // 当前组件排序索引 type_ + key
    type: String,
    default: () => {
      return ''
    }
  },
  current: { // 当前排序索引 key
    type: Number,
    default: () => {
      return null
    }
  },
  isShowEdit: { // 是否为编辑状态
    type: Boolean,
    default: false
  },
  dataField: { // 所有上传到后端的字段
    type: Object,
    default: () => { }
  },
  isStartCheckFieldRules: { // 是否开始校验规则
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits(['myCheckResult', 'componentsValueChance'])

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
}, { deep: true })

const formData = reactive({
  title: '',
  bgImg: '',
  textColor: '#ffffff',
  description: '',
  category: '',
  gmtStart: '',
  bgType: 0,
  bgColor: '#e43130'
})

/** 设置或者重设formData的数据 */
const setFormData = () => {
  if (props.dataField) {
    for (const el in props.dataField) {
      formData[el] = props.dataField[el]
    }
  }
}

watch(() => formData, (val) => {
  if (val) {
    emit('componentsValueChance', {
      indexKey: props.indexKey,
      current: props.current,
      dataField: val
    })
  }
}, { deep: true })

watch(() => props.isStartCheckFieldRules, () => {
  startCheckFieldRulesCommonFun()
}, { deep: true })

onMounted(() => {
  setFormData()
})

const formDataRef = ref(null)
/* 校验 */
const startCheckFieldRulesCommonFun = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      myCheckResult(true)
    } else {
      ElMessage.error($t('shopFeature.header.pageNameCanntEmpty'))
    }
  })
}

/**
 * 返回校验结果
 * isHeader 是否为顶部 特殊情况
 * 结果：Boolean true false
 * */
const myCheckResult = ($isPass) => {
  emit('myCheckResult', {
    data: {
      isPass: $isPass,
      dataField: props.dataField,
      isHeader: (props.currentComponent.type.indexOf('config') !== -1),
      current: props.current
    }
  })
}

// eslint-disable-next-line no-unused-vars
const validateBgColor = (rule, value, callback) => {
  const colorTest = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
  if (!colorTest.test(value)) {
    callback(new Error($t('shopFeature.header.colorErrTips')))
  } else {
    callback()
  }
}

// eslint-disable-next-line no-unused-vars
const validatePageTitle = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error($t('shopFeature.header.pageNameCanntEmpty')))
  } else {
    callback()
  }
}

const rules = {
  bgColor: [
    { validator: validateBgColor, trigger: 'blur' }
  ],
  title: [
    { required: true, validator: validatePageTitle, trigger: 'blur' }
  ]
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
