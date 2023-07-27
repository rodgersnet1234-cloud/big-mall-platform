<template>
  <div class="quickbird-快递100物流配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.quickHdConfig') }}
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

const props = defineProps({
  changeFlag: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['activationConfig'])
let dataForm = reactive({
  customer: null,
  key: null,
  reqUrl: null,
  isOpen: false
})
let activationEventOriginate = ref(false)
const quick100 = reactive({
  // customer: null,
  // key: null,
  // reqUrl: null
})
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

// watch(changeFlag, (newVal, oldVal) => {
//   if (!activationEventOriginate) {
//     dataForm.isOpen = false
//   }
//   activationEventOriginate = false
// })

onMounted(() => {
  init()
})

const init = () => {
  // $refs['dataForm'].resetFields()
  nextTick(() => {
    api.get('QUICK100_CONFIG').then(data => {
      if (data) {
        dataForm = JSON.parse(data)
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
      getQuickBirdParam()
      api.saveDeliveryConfig({
        paramKey: 'QUICK100_CONFIG',
        paramValue: JSON.stringify(dataForm),
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
            if (dataForm.isOpen) {
              activationEventOriginate = true
              emit('activationConfig')
            }
          }
        })
      })
    }
  })
}
/**
   * dataform -> quickBird
   */
const getQuickBirdParam = () => {
  quick100.customer = dataForm.customer
  quick100.key = dataForm.key
  quick100.reqUrl = dataForm.reqUrl
  quick100.isOpen = dataForm.isOpen
}
/**
   *  quick100 -> dataform
   */

const getDataParam = (data) => {
  const obj = JSON.parse(data.paramValue)
  dataForm.id = data.id
  dataForm.paramKey = data.paramKey
  dataForm.paramValue = data.paramValue
  dataForm.customer = data.quick100.customer == null ? obj.customer : data.quick100.customer
  dataForm.key = data.quick100.key
  dataForm.reqUrl = data.quick100.reqUrl
}

</script>
