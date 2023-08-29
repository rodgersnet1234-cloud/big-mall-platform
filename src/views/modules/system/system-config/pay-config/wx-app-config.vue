<template>
  <div class="public-微信app配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.wechatOpenPlatformApplicationConfig') }}
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
        :label="`${$t('platform.config.wechatOpenPlatformApplication')} appId：`"
        style="width:640px"
        prop="appId"
      >
        <el-input
          v-model="dataForm.appId"
          :placeholder="`${$t('platform.config.wechatOpenPlatformApplication')} appId`"
          controls-position="right"
        />
      </el-form-item>
      <el-button
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
  appId: null
})
const dataRule = {
  appId: [
    { required: true, message: `${$t('platform.config.wechatOpenPlatformApplication')} appId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ]
}

onMounted(() => {
  init()
})

const init = () => {
  nextTick(() => {
    api.get('MX_APP_CONFIG').then(data => {
      if (data) {
        dataForm.value = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
const dataFormRef = ref()
// 表单提交
const onSubmit = () => {
  const obj = {}
  obj.appId = dataForm.value.appId
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'MX_APP_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: $t('platform.config.wechatOpenPlatformApplicationConfig')
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
