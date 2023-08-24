<template>
  <div class="quickbird-快递100物流配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.quickHdConfig') }}
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
        :label="`${$t('platform.config.quick100')} customer：`"
        style="width:640px"
        prop="customer"
      >
        <el-input
          v-model="dataForm.customer"
          :placeholder="`${$t('platform.config.quick100')} customer`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.quick100')} key：`"
        style="width:640px"
        prop="key"
      >
        <el-input
          v-model="dataForm.key"
          :placeholder="`${$t('platform.config.quick100')}  key`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.quick100')} reqUrl：`"
        style="width:640px"
        prop="reqUrl"
      >
        <el-input
          v-model="dataForm.reqUrl"
          :placeholder="`${$t('platform.config.quick100')} reqUrl`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.isActive') + '：'"
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
    default: false
  }
})
const emit = defineEmits(['activationConfig'])
const dataForm = ref({
  customer: null,
  key: null,
  reqUrl: null,
  isOpen: false
})
const activationEventOriginate = ref(false)
const dataRule = {
  customer: [
    { required: true, message: `快递100  customer ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  key: [
    { required: true, message: `快递100  key ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  reqUrl: [
    { required: true, message: `快递100  reqUrl ${$t('platform.config.nullTips')}`, trigger: 'blur' }
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

const init = () => {
  // $refs['dataForm'].resetFields()
  nextTick(() => {
    api.get('QUICK100_CONFIG').then(data => {
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
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.saveDeliveryConfig({
        paramKey: 'QUICK100_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: '快递100物流配置'
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
