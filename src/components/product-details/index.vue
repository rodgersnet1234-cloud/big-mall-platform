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
        <el-form-item
          v-if="disabled"
          label="商品详情"
        >
          <div
            v-rich="dataFormPar.detailZh"
            class="det"
          />
          <div
            v-if="!dataFormPar.detailZh"
            class="det-empty"
          >
            暂无详情
          </div>
        </el-form-item>

        <el-form-item
          v-else
          label="商品详情"
        >
          <div class="prod-det-box">
            <div class="prod-content">
              <tiny-mce
                v-if="!disabled"
                ref="contentZhRef"
                v-model="dataFormPar.detailZh"
                :disabled="!dataFormPar.categoryId"
                :width="850"
              />
            </div>

            <!-- 详情预览 -->
            <div class="details-preview">
              <div class="preview-box-title">
                详情页预览图
              </div>
              <div
                v-rich="dataFormPar.detailZh"
                class="preview-con"
              />
            </div>
          </div>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import TinyMce from '@/components/tiny-mce/index.vue'

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
  dataFormPar.value.detailZh = props.dataForm.detailZh ? props.dataForm.detailZh : ''
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

  .prod-det-box {
    width: 100%;
    display: flex;
    justify-content: space-between;

  }

  .prod-content {
    width: 60%;
    margin-right: 30px;

    // 富文本编辑框样式修改
    & :deep(.tinymce-container) {

      .mce-panel,
      .mce-container-body.mce-flow-layout {
        border-color: #DCDCDC !important;
      }

      .mce-edit-area {
        border-top: 0;
      }
    }
  }

  // 详情预览
  .details-preview {
    width: 40%;
    border: 1px solid #DCDCDC;
    box-sizing: border-box;

    .preview-box-title {
      height: 45px;
      line-height: 45px;
      background: #f9f9f9;
      text-align: center;
      border-bottom: 1px solid #DCDCDC;
    }

    .preview-con {
      height: auto;
      // max-height: 580px;
      overflow-y: auto;
      padding: 0 10px;
      box-sizing: border-box;
    }
  }
}
</style>
