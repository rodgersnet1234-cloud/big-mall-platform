<template>
  <div class="ali-live-config gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.aliLiveConfig') }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit(dataFormRef)"
    >
      <el-form-item
        :label="$t('platform.config.pushDomain')"
        style="width:640px"
        prop="pushDomain"
      >
        <el-input
          v-model="dataForm.pushDomain"
          :placeholder="$t('platform.config.pushDomain')"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.pullDomain')"
        style="width:640px"
        prop="pullDomain"
      >
        <el-input
          v-model="dataForm.pullDomain"
          :placeholder="$t('platform.config.pullDomain')"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.appName')"
        style="width:640px"
        prop="appName"
      >
        <el-input
          v-model="dataForm.appName"
          :placeholder="$t('platform.config.appName')"
          controls-position="right"
          maxlength="50"
          show-word-limit
          @input="inputLimit"
        />
        <p class="live-tips">
          {{ $t("platform.config.liveTip2") }}
        </p>
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.pushAuthKey')"
        style="width:640px"
        prop="pushAuthKey"
      >
        <el-input
          v-model="dataForm.pushAuthKey"
          :placeholder="$t('platform.config.pushAuthKey')"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.pullAuthKey')"
        style="width:640px"
        prop="pullAuthKey"
      >
        <el-input
          v-model="dataForm.pullAuthKey"
          :placeholder="$t('platform.config.pullAuthKey')"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item
        :label="$t('platform.config.isHttps')"
        prop="isHttps"
      >
        <el-switch
          v-model="dataForm.isHttps"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <el-button
        @click="onSubmit(dataFormRef)"
      >
        {{ $t('platform.config.save') }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import * as api from '@/api/platform/sys-config.js'

const emit = defineEmits(['refreshDataList'])
const dataFormRef = ref(null)
const dataForm = ref({
  pushDomain: null,
  pullDomain: null,
  appName: null,
  pushAuthKey: null,
  pullAuthKey: null,
  isHttps: 0
})

const dataRule = {
  pushDomain: [
    { required: true, message: `${$t('platform.config.pushDomain')} accessKeyId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  pullDomain: [
    { required: true, message: `${$t('platform.config.pullDomain')} accessKeyId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  appName: [
    { required: true, message: `${$t('platform.config.appName')} accessKeyId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  pushAuthKey: [
    { required: true, message: `${$t('platform.config.pushAuthKey')} accessKeyId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  pullAuthKey: [
    { required: true, message: `${$t('platform.config.pullAuthKey')} accessKeyId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ]
}

onMounted(() => {
  init()
})

const init = () => {
  nextTick(() => {
    api.get('ALI_LIVE_CONFIG').then(data => {
      if (data) {
        dataForm.value = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
const inputLimit = (val) => {
  // 正则匹配非数字、大小写字母、短划线(-)、下划线(_)、等号(=)
  const reg = /[^A-Za-z0-9_=-]/
  // 没有则返回-1，有则返回对应位置
  const n = val.search(reg)
  if (n !== -1) {
    dataForm.value.appName = val.slice(0, n)
  }
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'ALI_LIVE_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: $t('platform.config.aliLiveConfig')
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
</script>
<style lang="scss" scoped>
@use '../index.scss';
</style>
