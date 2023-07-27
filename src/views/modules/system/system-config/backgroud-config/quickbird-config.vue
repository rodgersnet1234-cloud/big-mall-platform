<template>
  <div class="quickbird-快递鸟物流配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.expressBirdConfig') }}
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
    default: true
  }
})
const emit = defineEmits(['activationConfig'])

let dataForm = reactive({
  // id: null,
  // paramKey: 'QUICKBIRD_CONFIG',
  eBusinessID: null,
  appKey: null,
  reqUrl: null,
  isOpen: true
  // paramValue: null
})
let activationEventOriginate = ref(false)
const quickBird = reactive({
  // eBusinessID: null,
  // appKey: null,
  // reqUrl: null
})
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

// watch: {
//   changeFlag: function (newVal, oldVal) {
//     if (!activationEventOriginate) {
//       dataForm.isOpen = false
//     }
//     activationEventOriginate = false
//   }
// },

onMounted(() => {
  init()
})
const dataFormRef = ref()
const init = () => {
  // $refs['dataForm'].resetFields()
  nextTick(() => {
    api.get('QUICKBIRD_CONFIG').then(data => {
      if (data) {
        dataForm = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      getQuickBirdParam()
      api.saveDeliveryConfig({
        paramKey: 'QUICKBIRD_CONFIG',
        paramValue: JSON.stringify(dataForm),
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
  quickBird.eBusinessID = dataForm.eBusinessID
  quickBird.appKey = dataForm.appKey
  quickBird.reqUrl = dataForm.reqUrl
}
/**
 *  quickBird -> dataform
 */

const getDataParam = (data) => {
  const obj = JSON.parse(data.paramValue)
  dataForm.id = data.id
  dataForm.paramKey = data.paramKey
  dataForm.paramValue = data.paramValue
  dataForm.eBusinessID = data.quickBird.eBusinessID == null ? obj.eBusinessID : data.quickBird.eBusinessID
  dataForm.appKey = data.quickBird.appKey
  dataForm.reqUrl = data.quickBird.reqUrl
}

</script>
