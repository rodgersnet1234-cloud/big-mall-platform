<template>
  <div class="wx-ma-config gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.miniProgramsConfig') }}
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
      <el-form-item
        :label="`${$t('platform.config.miniPrograms')} AppId：`"
        style="width:640px"
        prop="appId"
      >
        <el-input
          v-model="dataForm.appId"
          :placeholder="`${$t('platform.config.miniPrograms')} AppId`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.miniPrograms')} secret：`"
        style="width:640px"
        prop="secret"
      >
        <el-input
          v-model="dataForm.secret"
          :placeholder="`${$t('platform.config.miniPrograms')} secret`"
          controls-position="right"
        />
      </el-form-item>
      <el-button
        v-permission="['platform:config:save']"
        @click="onSubmit()"
      >
        {{ $t('platform.config.save') }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const dataForm = ref({
  // id: null,
  // paramKey: 'MA_CONFIG',
  appId: null,
  secret: null
  // paramValue: null
})
const dataRule = {
  appId: [
    { required: true, message: `${$t('platform.config.miniPrograms')} appId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  secret: [
    { required: true, message: `${$t('platform.config.miniPrograms')} secret ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ]
}

onMounted(() => {
  init()
})

const dataFormRef = ref()
const init = () => {
  // $refs['dataForm'].resetFields()
  nextTick(() => {
    api.get('MA_CONFIG').then(data => {
      if (data) {
        dataForm.value = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
// 表单提交
const onSubmit = () => {
  const obj = {}
  obj.appId = dataForm.value.appId
  obj.secret = dataForm.value.secret

  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'MA_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: $t('platform.config.miniProgramsConfig')
      }).then(data => {
        if (data) {
          init()
        }
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            emit('refreshDataList')
          }
        })
      })
    }
  })
}
defineExpose({ init })
</script>
