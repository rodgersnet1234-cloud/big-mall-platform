<template>
  <div class="miniapp-小程序配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.miniProgramsConfig') }}
    </div>
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
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
        @click="onSubmit()"
      >
        {{ $t('platform.config.save') }}
      </el-button>
    </el-form>
    <template>
      <span class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      </span>
    </template>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

let dataForm = reactive({
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
        dataForm = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
// 表单提交
const onSubmit = () => {
  const obj = {}
  obj.appId = dataForm.appId
  obj.secret = dataForm.secret

  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'MA_CONFIG',
        paramValue: JSON.stringify(dataForm),
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
