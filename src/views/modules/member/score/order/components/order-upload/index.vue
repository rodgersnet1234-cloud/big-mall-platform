<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog
    v-model="visible"
    :modal="false"
    :title="$t('order.order.uploadTips1')"
    :close-on-click-modal="false"
    width="38%"
    class="box"
  >
    <div class="tips">
      <p>批量发货流程为：导出待发货订单，添加快递公司和单号后，选取该文件进而导入数据。</p>
      <p>
        注意：
      </p>
      <p>1.若存在正在退款或者已经退款或者已经部分发货的订单则无法批量发货。</p>
      <p>2.导入期间请不要对导出的订单做发货操作，否则该订单将无法批量发货。 </p>
    </div>
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
      :action="baseURL + '/mall4cloud_order/mp/order/export_order_excel'"
      :headers="{Authorization: tokenVal}"
      class="upload-demo"
      name="excelFile"
    >
      <template #tip>
        <div class="el-upload__tip" />
      </template>
      <template #trigger>
        <el-button
          type="primary"
        >
          {{ $t("order.order.selectFile")
          }}
        </el-button>
      </template>

      <el-button
        style="margin-left: 10px"
        type="success"
        @click="submitUpload"
      >
        {{ $t("order.order.import") }}
      </el-button>

      <el-button
        style="margin-left: 10px"
        type="success"
        @click="exportOrder"
      >
        {{ $t("order.order.exportUndeliveryOrder") }}
      </el-button>
    </el-upload>
  </el-dialog>
</template>
<script setup>
import { getToken } from '@/utils/auth.js'
import * as orderApi from '@/api/order/order.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  param: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['refreshDataList', 'refreshDataList1', 'refreshDataList1'])

const baseURL = ref(import.meta.env.VITE_APP_BASE_API)

const exportOrder = () => {
  if (!props.param.startTime || !props.param.endTime) {
    ElMessage.error($t('order.order.pleExpOrderFirst'))
    return
  }
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    orderApi.exportUndeliveryOrder({
      startTime: props.param.startTime, // 开始时间
      endTime: props.param.endTime, // 结束时间
      orderType: 3
    }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '待发货订单信息.xlsx'
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
    }).catch((e) => {
      ElMessage.error(e)
    })
  })
}

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

let tokenVal = null
// eslint-disable-next-line no-unused-vars
const init = () => {
  visible.value = true
  loading.value = false
  files.value = []
  tokenVal = getToken()
}

let upload = false
// 上传前对文件的大小的判断
const beforeAvatarUpload = (file) => {
  upload = true
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
  upload = false
  uploadRef.value?.submit()
  if (!upload) {
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
  emit('refreshDataList1')
}

defineExpose({
  init
})

</script>
<style lang="scss" scoped>
 div :deep(.el-dialog__body) {
   padding: 10px 20px 30px;
 }
 .tips {
   margin-bottom: 30px;
 }
</style>
