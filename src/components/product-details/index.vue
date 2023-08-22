<template>
  <div class="prod-details">
    <el-tabs
      v-model="activeName"
      type="card"
    >
      <!-- 中文 -->
      <el-tab-pane
        label="中文信息"
        name="Zh"
      >
        <!-- 详情 -->
        <el-form-item label="商品详情">
          <tiny-mce
            v-if="!disabled"
            ref="contentZhRef"
            v-model="dataFormPar.detailZh"
            :disabled="disabled || !dataFormPar.categoryId"
            :width="850"
          />
          <div
            v-if="disabled"
            class="det"
            v-html="dataFormPar.detailZh"
          />
          <div
            v-if="disabled && !dataFormPar.detailZh"
            class="det-empty"
          >
            暂无详情
          </div>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import TinyMce from '@/components/tiny-mce/index.vue'
import DOMPurify from 'dompurify'

const props = defineProps({
  dataForm: {
    type: Object,
    default: () => {
      return {}
    }
  },
  disabled: {
    type: Boolean,
    default: () => {
      return true
    }
  },
  isScoreProd: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})
const emit = defineEmits('update:dataForm')
const activeName = ref('Zh')
const dataFormPar = ref(props.dataForm)

onMounted(() => {
  dataFormPar.value.detailZh = props.dataForm.detailZh ? DOMPurify.sanitize(props.dataForm.detailZh) : ''
})

const contentZhRef = ref(null)

watch(() => props.dataForm, (newVal) => {
  if (!props.disabled) {
    emit('update:dataForm', newVal)
  }
}, { deep: true })

</script>

<style lang="scss" scoped>
.prod-details {
  ::v-deep(.el-input__inner) {
    padding-right: 60px;
  }
  ::v-deep(.el-textarea__inner) {
    padding-right: 40px;
  }
}
</style>
