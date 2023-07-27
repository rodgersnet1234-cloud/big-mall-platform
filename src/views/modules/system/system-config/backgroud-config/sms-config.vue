<template>
  <div class="shortmsg-短信服务平台配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.alidayuSMSServicePlatform') }}
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
      <!-- <el-form-item label="短信服务平台名称" style="width:640px" prop="shortmsgName">
        <el-input
          disabled="true"
          v-model="dataForm.shortmsgName"
          placeholder="短信服务平台名称"
          controls-position="right"
        ></el-input>
      </el-form-item>-->
      <el-form-item
        :label="`${$t('platform.config.SMSService')} accessKeyId：`"
        style="width:640px"
        prop="accessKeyId"
      >
        <el-input
          v-model="dataForm.accessKeyId"
          :placeholder="`${$t('platform.config.SMSService')} accessKeyId`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.shortMessage')} accessKeySecret：`"
        style="width:640px"
        prop="accessKeySecret"
      >
        <el-input
          v-model="dataForm.accessKeySecret"
          :placeholder="`${$t('platform.config.shortMessage')} accessKeySecret`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.shortMessageSign')} signName：`"
        style="width:640px"
        prop="signName"
      >
        <el-input
          v-model="dataForm.signName"
          :placeholder="`${$t('platform.config.shortMessageSign')} signName`"
          controls-position="right"
        />
      </el-form-item>
    </el-form>

    <template>
      <span class="dialog-footer">
        <!-- <el-button @click="visible = false">取消</el-button> -->
        <el-button
          @click="onSubmit()"
        >{{ $t('platform.config.save') }}</el-button>
      </span>
    </template>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
let dataForm = reactive({
  // id: null,
  // paramKey: 'ALIDAYU_CONFIG',
  // shortmsgName: '阿里短信服务平台',
  accessKeyId: null,
  accessKeySecret: null,
  signName: null
  // paramValue: null
})
const searchForm = reactive({})
const dataRule = {
  // shortmsgName: [
  //   { required: true, message: '短信服务平台名称不能为空', trigger: 'blur' }
  // ],
  accessKeyId: [
    { required: true, message: `${$t('platform.config.SMSService')} accessKeyId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  accessKeySecret: [
    { required: true, message: `${$t('platform.config.shortMessage')} accessKeySecret ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  signName: [
    { required: true, message: `${$t('platform.config.shortMessageSign')} signName ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ]
}

onMounted(() => {
  init()
})

const dataFormRef = ref()
const init = () => {
  // $refs['dataForm'].resetFields()
  nextTick(() => {
    api.get('ALIDAYU_CONFIG').then(data => {
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
      api.save({
        paramKey: 'ALIDAYU_CONFIG',
        paramValue: JSON.stringify(dataForm),
        remark: $t('platform.config.alidayuSMSServicePlatform')
      }).then(data => {
        if (data) {
          init()
        }
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
}

</script>
