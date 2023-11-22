<template>
  <div class="quickbird-快递鸟物流配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.expressBirdConfig') }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="200px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="`${$t('platform.config.expressBirdUser')} id：`"
        style="width:640px"
        prop="eBusinessID"
      >
        <el-input
          v-model="dataForm.eBusinessID"
          :placeholder="`${$t('platform.config.expressBirdUser')} id`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.expressBird')} appKey：`"
        style="width:640px"
        prop="appKey"
      >
        <el-input
          v-model="dataForm.appKey"
          :placeholder="`${$t('platform.config.expressBird')} appKey`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.expressBird')} reqUrl：`"
        style="width:640px"
        prop="reqUrl"
      >
        <el-input
          v-model="dataForm.reqUrl"
          :placeholder="`${$t('platform.config.expressBird')} reqUrl`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.isQuery') + '：'"
        style="width:640px"
        prop="isOpen"
      >
        <el-switch
          v-model="dataForm.isOpen"
          active-color="#13ce66"
          inactive-color="#ff4949"
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

const props = defineProps({
  changeFlag: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['activationConfig'])

const dataForm = ref({
  eBusinessID: null,
  appKey: null,
  reqUrl: null,
  isOpen: true
})
const activationEventOriginate = ref(false)
const dataRule = {
  eBusinessID: [
    { required: true, message: `${$t('platform.config.expressBirdUser')} id ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  appKey: [
    { required: true, message: `${$t('platform.config.expressBird')} appKey ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  reqUrl: [
    { required: true, message: `${$t('platform.config.expressBird')} reqUrl ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ]
}

watch(
  () => props.changeFlag,
  () => {
    if (!activationEventOriginate.value) {
      dataForm.value.isOpen = false
    }
    activationEventOriginate.value = false
  }
)

onMounted(() => {
  init()
})
const dataFormRef = ref()
const init = () => {
  nextTick(() => {
    api.get('QUICKBIRD_CONFIG').then(data => {
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
      api.saveDeliveryConfig({
        paramKey: 'QUICKBIRD_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: $t('platform.config.expressBirdConfig')
      }).then(data => {
        if (data) {
          init()
        }
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            if (dataForm.value.isOpen) {
              activationEventOriginate.value = true
              emit('activationConfig')
            }
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
