<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog
    v-model:visible="visible"
    :modal="false"
    :title="$t('product.spu.uploadTips')"
    :close-on-click-modal="false"
    width="38%"
  >
    <el-upload
      ref="uploadRef"
      v-loading="loading"
      :auto-upload="false"
      :v-loading="loading"
      :before-upload="beforeAvatarUpload"
      :file-list="files"
      :limit="1"
      :on-error="uploadFalse"
      :on-preview="handlePreview"
      :on-success="uploadSuccess"
      :action="baseURL + '/mall4cloud_product/mp/spu/export_excel'"
      :headers="{Authorization: tokenVal}"
      class="upload-demo"
      name="excelFile"
    >
      <!-- multiple -->
      <template #tip>
        <div class="el-upload__tip" />
      </template>
      <template #trigger>
        <el-button
          type="primary"
        >
          {{
            $t("product.spu.selectFile")
          }}
        </el-button>
      </template>
      <el-button
        style="margin-left: 10px"
        type="success"
        @click="submitUpload"
      >
        {{ $t("product.spu.import") }}
      </el-button>
      <el-button
        style="margin-left: 10px"
        type="success"
        @click="downloadModel"
      >
        {{ $t("product.spu.downloadTemplate") }}
      </el-button>
    </el-upload>
  </el-dialog>
</template>
<script setup>
import * as api from '@/api/product/list.js'
import { getToken } from '@/utils/auth.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const baseURL = ref(import.meta.env.VUE_APP_BASE_API)

const loading = ref(false)
const files = ref([])
const visible = ref(false)
const uploadSuccess = (response) => {
  loading.value = false
  const data = response.data
  if (!data) {
    alert($t('product.spu.fileSuccess'))
  } else {
    alert(data)
  }
  files.value = []
  visible.value = false
  emit('refreshDataList')
}

const uploadFalse = () => {
  loading.value = false
  alert($t('product.spu.fileUploadFail'))
}

const tokenVal = ref(null)
const init = () => {
  visible.value = true
  loading.value = false
  files.value = []
  tokenVal.value = getToken()
}

const upload = ref(false)
// 上传前对文件的大小的判断
const beforeAvatarUpload = (file) => {
  upload.value = true
  const extension = file.name.split('.')[1] === 'xls'
  const extension2 = file.name.split('.')[1] === 'xlsx'
  const isLt2M = file.size / 1024 / 1024 < 10
  if (!extension && !extension2) {
    alert($t('product.spu.downloadTemplateTips1'))
    return false
  }
  if (!isLt2M) {
    alert($t('product.spu.downloadTemplateTips2'))
    return false
  }
  loading.value = true
  return extension || (extension2 && isLt2M)
}

const uploadRef = ref(null)
const submitUpload = () => {
  upload.value = false
  uploadRef.value?.submit()
  if (!upload.value) {
    ElMessage.error('请选择要上传的文件')
  }
}

const handlePreview = (file) => {
  if (file.response.status) {
    alert($t('product.spu.fileSuccess'))
  } else {
    alert($t('product.spu.fileFail'))
  }
  visible.value = false
  emit('refreshDataList')
}

// 下载模板
const downloadModel = () => {
  loading.value = true
  api.downModel().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = '商品模板信息.xlsxx'
    const elink = document.createElement('a')
    if ('download' in elink) { // 非IE下载
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
    loading.value = false
  }).catch((e) => {
    ElMessage.error(e)
    loading.value = false
  })
  visible.value = false
  emit('refreshDataList')
}

defineExpose({ init })
</script>
