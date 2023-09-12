<template>
  <div class="quickbird-阿里快递物流配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.aliQuickConfig') }}
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
        :label="`${$t('platform.config.aliCode')}：`"
        style="width:640px"
        prop="aliCode"
      >
        <el-input
          v-model="dataForm.aliCode"
          :placeholder="`${$t('platform.config.aliCode')}`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.aliQuickConfig')} reqUrl：`"
        style="width:640px"
        prop="reqUrl"
      >
        <el-input
          v-model="dataForm.reqUrl"
          :placeholder="`${$t('platform.config.aliQuickConfig')} reqUrl`"
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
  aliCode: null,
  reqUrl: null,
  isOpen: false
})
const activationEventOriginate = ref(false)
const dataRule = {
  aliCode: [
    { required: true, message: `code ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  reqUrl: [
    { required: true, message: `Url ${$t('platform.config.nullTips')}`, trigger: 'blur' }
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
  // $refs['dataForm'].resetFields()
  nextTick(() => {
    api.get('ALI_QUICK_CONFIG').then(data => {
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
        paramKey: 'ALI_QUICK_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: '阿里快递物流配置'
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
