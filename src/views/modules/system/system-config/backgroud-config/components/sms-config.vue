<template>
  <div class="shortmsg-短信服务平台配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.alidayuSMSServicePlatform') }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <!-- <el-form-item label="短信服务平台名称" style="width:640px" prop="shortmsgName">
        <el-input
          disabled="true"
          v-model="dataForm.shortmsgName"
          placeholder="短信服务平台名称"
          controls-position="right"
        ></el-input>
      </el-form-item>-->
      <el-form-item
        :label="`${$t('platform.config.SMSService')} accessKeyId：`"
        style="width:640px"
        prop="accessKeyId"
      >
        <el-input
          v-model.trim="dataForm.accessKeyId"
          :placeholder="`${$t('platform.config.SMSService')} accessKeyId`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.shortMessage')} accessKeySecret：`"
        style="width:640px"
        prop="accessKeySecret"
      >
        <el-input
          v-model.trim="dataForm.accessKeySecret"
          :placeholder="`${$t('platform.config.shortMessage')} accessKeySecret`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.shortMessageSign')} signName：`"
        style="width:640px"
        prop="signName"
      >
        <el-input
          v-model.trim="dataForm.signName"
          :placeholder="`${$t('platform.config.shortMessageSign')} signName`"
          controls-position="right"
        />
      </el-form-item>
    </el-form>

    <el-button
      v-permission="['platform:config:save']"
      @click="onSubmit()"
    >
      {{ $t('platform.config.save') }}
    </el-button>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = ref({
  accessKeyId: null,
  accessKeySecret: null,
  signName: null
  // paramValue: null
})
const dataRule = {
  accessKeyId: [
    { required: true, message: `${$t('platform.config.SMSService')} accessKeyId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  accessKeySecret: [
    { required: true, message: `${$t('platform.config.shortMessage')} accessKeySecret ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  signName: [
    { required: true, message: `${$t('platform.config.shortMessageSign')} signName ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ]
}

onMounted(() => {
  init()
})

const dataFormRef = ref()
const init = () => {
  nextTick(() => {
    api.get('ALIDAYU_CONFIG').then(data => {
      if (data) {
        dataForm.value = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'ALIDAYU_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: $t('platform.config.alidayuSMSServicePlatform')
      }).then(data => {
        if (data) {
          init()
        }
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
@use '../index.scss';
</style>
