<template>
  <div class="micro-notice-box component-notice">
    <div class="design-preview-controller">
      <div class="notice-content">
        <span class="iconfont_ckq ckq_notice" />
        {{ formData.titleText }}
      </div>
    </div>
    <div
      v-show="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          <div style="flex: 1;">
            {{ $t('shopFeature.notice.announcement') }}
            {{ currentComponent.customRemark }}
          </div>
          <custom-remark-edit-popover
            :index="currentUseComponents.findIndex(item => item.id === currentComponent.id)"
            :current-edit-component="currentEditComponent"
            @set-current-component="setCurrentComponent"
            @save-edit="saveCustomRemark"
          />
        </div>
        <div class="add-notice">
          <p>{{ $t('shopFeature.notice.announcementTips1') }}</p>
          <p>{{ $t('shopFeature.notice.announcementTips2') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'

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
  },
  currentUseComponents: {
    type: Array,
    default: () => {}
  }
})

const emit = defineEmits(['myCheckResult', 'componentsValueChance'])

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
}, { deep: true })

const formData = reactive({
  titleText: $t('shopFeature.notice.announcement')
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

/* 校验 */
const startCheckFieldRulesCommonFun = () => {
  myCheckResult(true)
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

// 自定义标签
const currentEditComponent = ref({})
const setCurrentComponent = (index) => {
  currentEditComponent.value = props.currentUseComponents[index]
}
const saveCustomRemark = (remark) => {
  currentEditComponent.value.customRemark = remark
}

</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
