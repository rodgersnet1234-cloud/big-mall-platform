<template>
  <div class="component-upload-container">
    <el-button
      icon="el-icon-upload"
      type="primary"
      @click="clickUpload()"
    >
      {{ $t('table.upload') }}
    </el-button>
    <div>
      <el-dialog
        v-model:visible="dialogVisible"
        :append-to-body="dialogVisible"
      >
        <imgs-upload v-model="imgUrls" />
        <el-button @click="dialogVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import ImgsUpload from '@/components/imgs-upload/index.vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['successCBK'])

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  color: {
    type: String,
    default: '#FFFFFF'
  }
})

let dialogVisible = ref(false)
let imgUrls = ref([])
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const clickUpload = () => {
  dialogVisible = true
  imgUrls = ''
  // $set(imgUrls, '')
}
const handleSubmit = () => {
  if (!imgUrls) {
    ElMessage.warning('请选择图片上传')
    return
  }
  const imageArray = imgUrls.split(',')
  const data = []
  imageArray.forEach(img => {
    data.push(resourcesUrl + img)
  })
  imgUrls = ''
  dialogVisible = false
  emit('successCBK', data)
}

</script>

<style lang="scss" scoped>
:deep(.component-upload-container) {
  .editor-slide-upload {
    margin-bottom: 20px;

    .el-upload--picture-card {
      width: 100%;
    }
  }
  .v-modal {
    z-index: 9 !important;
  }
}
</style>
