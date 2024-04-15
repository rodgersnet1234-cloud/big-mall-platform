<template>
  <div class="shortmsg-短信服务平台配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      短信服务平台
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
        label="短信类型："
        style="width:640px"
        prop="smsType"
      >
        <el-select
          v-model="dataForm.smsType"
          style="width:100%"
          placeholder="短信类型"
          clearable
          @change="onChangeSmsType"
        >
          <el-option
            v-for="sms in smsTypeList"
            :key="sms.value"
            :label="sms.label"
            :value="sms.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.SMSService')} accessKeyId：`"
        style="width:640px"
        prop="accessKeyId"
      >
        <el-input
          v-model.trim="dataForm.accessKeyId"
          :placeholder="`${$t('platform.config.SMSService')} accessKeyId`"
          controls-position="right"
          @blur="onTrimSpace('accessKeyId')"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.shortMessage')} accessKeySecret：`"
        style="width:640px"
        prop="accessKeySecret"
      >
        <el-input
          v-model.trim="dataForm.accessKeySecret"
          :placeholder="`${$t('platform.config.shortMessage')} accessKeySecret`"
          controls-position="right"
          @blur="onTrimSpace('accessKeySecret')"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.shortMessageSign')} signName：`"
        style="width:640px"
        prop="signName"
      >
        <el-input
          v-model.trim="dataForm.signName"
          :placeholder="`${$t('platform.config.shortMessageSign')} signName`"
          controls-position="right"
          @blur="onTrimSpace('signName')"
        />
      </el-form-item>
      <!-- 云片短信 -->
      <el-form-item
        v-if="dataForm.smsType==='yunpian'"
        label="推送地址："
        style="width:640px"
        prop="callbackUrl"
      >
        <el-input
          v-model.trim="dataForm.callbackUrl"
          placeholder="推送地址"
          controls-position="right"
          @blur="onTrimSpace('callbackUrl')"
        />
      </el-form-item>
      <!-- 华为云 -->
      <template v-if="dataForm.smsType==='huawei'">
        <el-form-item
          label="国内短信签名通道号："
          style="width:640px"
          prop="sender"
        >
          <el-input
            v-model.trim="dataForm.sender"
            placeholder="国内短信签名通道号"
            controls-position="right"
            @blur="onTrimSpace('sender')"
          />
        </el-form-item>
        <el-form-item
          label="短信状态报告接收地址："
          style="width:640px"
          prop="statusCallBack"
        >
          <el-input
            v-model.trim="dataForm.statusCallBack"
            placeholder="短信状态报告接收地址"
            controls-position="right"
            @blur="onTrimSpace('statusCallBack')"
          />
        </el-form-item>
        <el-form-item
          label="APP接入地址："
          style="width:640px"
          prop="url"
        >
          <el-input
            v-model.trim="dataForm.url"
            placeholder="APP接入地址"
            controls-position="right"
            @blur="onTrimSpace('url')"
          />
        </el-form-item>
      </template>
      <!-- 亿美软通 -->
      <el-form-item
        v-if="dataForm.smsType==='emay'"
        label="APP接入地址："
        style="width:640px"
        prop="requestUrl"
      >
        <el-input
          v-model.trim="dataForm.requestUrl"
          placeholder="APP接入地址"
          controls-position="right"
          @blur="onTrimSpace('requestUrl')"
        />
      </el-form-item>
      <!-- 联麓短信 -->
      <template v-if="dataForm.smsType==='lianlu'">
        <el-form-item
          label="企业mchId："
          style="width:640px"
          prop="mchId"
        >
          <el-input
            v-model.trim="dataForm.mchId"
            placeholder="企业mchId"
            controls-position="right"
            @blur="onTrimSpace('mchId')"
          />
        </el-form-item>
        <el-form-item
          label="企业appKey："
          style="width:640px"
          prop="appKey"
        >
          <el-input
            v-model.trim="dataForm.appKey"
            placeholder="企业appKey"
            controls-position="right"
            @blur="onTrimSpace('appKey')"
          />
        </el-form-item>
        <el-form-item
          label="企业appId："
          style="width:640px"
          prop="appId"
        >
          <el-input
            v-model.trim="dataForm.appId"
            placeholder="企业appId"
            controls-position="right"
            @blur="onTrimSpace('appId')"
          />
        </el-form-item>
      </template>
      <!-- 亿美软通 -->
      <el-form-item
        v-if="dataForm.smsType==='qiniu'"
        label="签名ID："
        style="width:640px"
        prop="signatureId"
      >
        <el-input
          v-model.trim="dataForm.signatureId"
          placeholder="签名ID"
          controls-position="right"
          @blur="onTrimSpace('signatureId')"
        />
      </el-form-item>
    </el-form>

    <el-button
      v-permission="['platform:config:save']"
      @click="onSubmit()"
    >
      {{ $t('platform.config.save') }}
    </el-button>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const smsTypeList = [
  {
    label: '合一短信',
    value: 'unisms'
  },
  {
    label: '云片短信',
    value: 'yunpian'
  },
  {
    label: '天翼云短信',
    value: 'ctyun'
  },
  {
    label: '网易云短信',
    value: 'netease'
  },
  {
    label: '阿里云国内短信',
    value: 'alibaba'
  },
  {
    label: '腾讯云国内短信',
    value: 'tencent'
  },
  {
    label: '华为云国内短信',
    value: 'huawei'
  },
  {
    label: '京东云国内短信',
    value: 'jdcloud'
  },
  {
    label: '容联云国内短信',
    value: 'cloopen'
  },
  {
    label: '亿美软通国内短信',
    value: 'emay'
  },
  {
    label: '联麓短信',
    value: 'lianlu'
  },
  {
    label: '鼎众短信',
    value: 'dingzhong'
  },
  {
    label: '七牛云短信',
    value: 'qiniu'
  }
]

const visible = ref(false)
const dataForm = ref({
  accessKeyId: null,
  accessKeySecret: null,
  signName: null
  // paramValue: null
})
const dataRule = {
  smsType: [
    { required: true, message: '短信类型不能为空', trigger: 'blur' }
  ],
  accessKeyId: [
    { required: true, message: `${$t('platform.config.SMSService')} accessKeyId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  accessKeySecret: [
    { required: true, message: `${$t('platform.config.shortMessage')} accessKeySecret ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  signName: [
    { required: true, message: `${$t('platform.config.shortMessageSign')} signName ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  // 云片
  callbackUrl: [
    { required: true, message: '推送地址不能为空', trigger: 'blur' }
  ],
  // 华为云
  sender: [
    { required: true, message: '国内短信签名通道号不能为空', trigger: 'blur' }
  ],
  statusCallBack: [
    { required: true, message: '短信状态报告接收地址不能为空', trigger: 'blur' }
  ],
  url: [
    { required: true, message: 'APP接入地址不能为空', trigger: 'blur' }
  ],
  // 亿美软通
  requestUrl: [
    { required: true, message: 'APP接入地址不能为空', trigger: 'blur' }
  ],
  mchId: [
    { required: true, message: '企业mchId不能为空', trigger: 'blur' }
  ],
  appKey: [
    { required: true, message: '企业appKey不能为空', trigger: 'blur' }
  ],
  appId: [
    { required: true, message: '企业appId不能为空', trigger: 'blur' }
  ],
  signatureId: [
    { required: true, message: '签名ID不能为空', trigger: 'blur' }
  ]
}

onMounted(() => {
  init()
})

const onChangeSmsType = (smsType) => {
  dataForm.value = {
    smsType
  }
  if (tempDataForm.smsType === smsType) {
    dataForm.value = JSON.parse(JSON.stringify(tempDataForm))
  }
}

// 去除空格
const onTrimSpace = (attr) => {
  dataForm.value[attr] = dataForm.value[attr]?.trim()
}

const dataFormRef = ref()
let tempDataForm = {}
const init = () => {
  nextTick(() => {
    api.get('SMS_CONFIG').then(data => {
      if (data) {
        tempDataForm = JSON.parse(data)
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
      api.save({
        paramKey: 'SMS_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: '短信服务平台'
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
defineExpose({ init })
</script>
<style lang="scss" scoped>
@use '../index.scss';
</style>
