<template>
  <div class="mod-uploadfile gray-box">
    <el-form
      ref="dataFormRef"
      label-width="150px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit(dataFormRef)"
    >
      <el-form-item
        style="width:800px"
        label="文件存储服务:"
      >
        <el-radio-group
          v-model="radioValue"
          @change="onchangeRadio"
        >
          <el-radio
            label="1"
            size="large"
          >
            minio
          </el-radio>
          <el-radio
            label="2"
            size="large"
          >
            {{ $t('sysManagement.OtherCloudServers') }}
            <span class="cloud-storage">
              {{ $t('sysManagement.IncludingCloud') }}
            </span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div>
        <el-form-item
          :label="$t('sysManagement.endPoint') + ':'"
          style="width:640px"
          prop="endPoint"
        >
          <el-input
            v-model="dataForm.endPoint"
            :placeholder="`${$t('sysManagement.fileUpload')} endPoint`"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          :label="$t('sysManagement.bucketName') + ':'"
          style="width:640px"
          prop="bucketName"
        >
          <el-input
            v-model="dataForm.bucketName"
            :placeholder="`${$t('sysManagement.fileUpload')} bucketName`"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          label="accessKey:"
          style="width:640px"
          prop="accessKey"
        >
          <el-input
            v-model="dataForm.accessKey"
            :placeholder="`${$t('sysManagement.fileUpload')} accessKey`"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          label="secretKey:"
          style="width:640px"
          prop="secretKey"
        >
          <el-input
            v-model="dataForm.secretKey"
            :placeholder="`${$t('sysManagement.fileUpload')} secretKey`"
            controls-position="right"
          />
        </el-form-item>
      </div>
      <el-button
        class="default-btn"
        @click="onSubmit(dataFormRef)"
      >
        {{ $t('sysManagement.save') }}
      </el-button>
    </el-form>
  </div>
</template>
<script setup>
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
const dataRule = reactive({
  endPoint: [
    { required: true, message: `${$t('sysManagement.fileUpload')} endPoint ${$t('sysManagement.nullTips')}`, trigger: 'blur' }
  ],
  bucketName: [
    { required: true, message: `${$t('sysManagement.fileUpload')} bucketName ${$t('sysManagement.nullTips')}`, trigger: 'blur' }
  ],
  accessKey: [
    { required: true, message: `${$t('sysManagement.fileUpload')} accessKey ${$t('sysManagement.nullTips')}`, trigger: 'blur' }
  ],
  secretKey: [
    { required: true, message: `${$t('sysManagement.fileUpload')} secretKey ${$t('sysManagement.nullTips')}`, trigger: 'blur' }
  ]
})
const radioValue = ref('1')

const dataForm = ref({
  accessKey: '',
  secretKey: '',
  endPoint: '',
  bucketName: ''
})
onMounted(() => {
  init()
})

const dataFormRef = ref(null)
let storage
const getConfig = () => {
  nextTick(() => {
    request({
      url: '/mall4cloud_admin/p/sys_config/info/' + 'UPLOAD_FILE_CONFIG',
      method: 'get'
    }).then((data) => {
      if (data) {
        dataForm.value = JSON.parse(data).storageType === radioValue.value ? JSON.parse(data) : ''
        storage = JSON.parse(data).storageType
      }
    })
    dataFormRef.value?.resetFields()
  })
}
const init = () => {
  getConfig()
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      dataForm.value.storageType = radioValue.value
      request({
        url: '/mall4cloud_admin/p/sys_config/save',
        method: 'post',
        data: {
          paramKey: 'UPLOAD_FILE_CONFIG',
          paramValue: JSON.stringify(dataForm.value)
        }
      }).then(() => {
        ElMessage({
          message: $t('platform.config.operationSuccess'),
          type: 'success',
          duration: 1500
        })
      })
    }
  })
}
const onchangeRadio = () => {
  dataFormRef.value?.clearValidate()
  if (storage === radioValue.value) {
    getConfig()
  } else {
    dataForm.value = {}
  }
}
</script>
<style lang="scss" scoped>
/*
通用样式
*/
.mod-uploadfile {
  .cloud-storage{
  font-size: 12px;
}

  .gray-box {
    background: #f2f2f6;
    padding: 20px 35px;
    height: 100%;
  }

  .set-form {
    margin: 20px;
  }

}

</style>
