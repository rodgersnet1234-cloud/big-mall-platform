<template>
  <div class="wx-mp-config gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t("platform.config.weChatOfficialAccountConfiguration") }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="240px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="`${$t('platform.config.weChatOfficialAccount')}appId：`"
        style="width: 640px"
        prop="appId"
      >
        <el-input
          v-model="dataForm.appId"
          :placeholder="`${$t('platform.config.weChatOfficialAccount')}appId`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.weChatOfficialAccount')}secret：`"
        style="width: 640px"
        prop="secret"
      >
        <el-input
          v-model="dataForm.secret"
          :placeholder="`${$t('platform.config.weChatOfficialAccount')}secret`"
          controls-position="right"
        />
      </el-form-item>
      <el-button
        v-permission="['platform:config:save']"
        @click="onSubmit()"
      >
        {{
          $t("platform.config.save")
        }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const dataForm = ref({
  appId: null,
  secret: null
})
const dataRule = {
  appId: [
    { required: true, message: `${$t('platform.config.weChatOfficialAccount')} appId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  secret: [
    { required: true, message: `${$t('platform.config.weChatOfficialAccount')} secret ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ]
}

onMounted(() => {
  init()
})

const dataFormRef = ref()
const init = () => {
  nextTick(() => {
    api.get('MP_CONFIG').then(data => {
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
        paramKey: 'MP_CONFIG',
        paramValue: JSON.stringify(obj),
        remark: $t('platform.config.weChatOfficialAccountConfiguration')
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
