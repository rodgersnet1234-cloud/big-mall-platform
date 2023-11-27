<template>
  <div class="pay-wx-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.wechatPaymentConfiguration') }}
      <el-tooltip
        class="item"
        effect="dark"
        content="开启通联支付后将无需设置此处支付配置信息"
        placement="right"
      >
        <el-icon><QuestionFilled /></el-icon>
      </el-tooltip>
    </div>
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      :disabled="paySettlementType===1"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="`${$t('platform.config.wechatPay')} mchId：`"
        style="width:640px"
        prop="mchId"
      >
        <el-input
          v-model="dataForm.mchId"
          :placeholder="`${$t('platform.config.wechatPay')} mchId`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`支付接口类型:`"
        style="width:640px"
        prop="version"
      >
        <el-radio-group v-model="dataForm.version">
          <el-radio :label="2">
            v2
          </el-radio>
          <el-radio :label="3">
            v3
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- v2配置 -->
      <el-form-item
        v-if="dataForm.version === 2"
        :label="`${$t('platform.config.wechatPay')} mchKey：`"
        style="width:640px"
        prop="mchKey"
      >
        <el-input
          v-model="dataForm.mchKey"
          :placeholder="`${$t('platform.config.wechatPay')} mchKey`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.version === 2"
        :label="`${$t('platform.config.paymentCertificatePath')}：`"
        style="width:640px"
        prop="keyPath"
      >
        <el-input
          v-model="dataForm.keyPath"
          :placeholder="`${$t('platform.config.paymentCertificatePath')}`"
          controls-position="right"
        />
      </el-form-item>
      <!-- v3配置 -->
      <el-form-item
        v-if="dataForm.version === 3"
        :label="`微信支付 apiv3Key:`"
        style="width:640px"
        prop="apiv3Key"
      >
        <el-input
          v-model="dataForm.apiv3Key"
          :placeholder="`微信支付 apiv3Key`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.version === 3"
        :label="`证书序列号:`"
        style="width:640px"
        prop="certSerialNo"
      >
        <el-input
          v-model="dataForm.certSerialNo"
          :placeholder="`证书序列号`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.version === 3"
        :label="`商户apiclient_key.pem:`"
        style="width:640px"
        prop="privateKeyContent"
      >
        <el-input
          v-model="dataForm.privateKeyContent"
          type="textarea"
          rows="10"
          :placeholder="`商户apiclient_key.pem`"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.version === 3"
        :label="`商户apiclient_cert.pem:`"
        style="width:640px"
        prop="privateCertContent"
      >
        <el-input
          v-model="dataForm.privateCertContent"
          type="textarea"
          rows="10"
          :placeholder="`商户apiclient_cert.pem`"
          controls-position="right"
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

const emit = defineEmits(['refreshDataList'])

const dataForm = reactive({
  mchId: null,
  mchKey: null,
  keyPath: null,
  signType: null,
  version: 3,
  apiv3Key: null,
  certSerialNo: null,
  privateKeyPath: null,
  privateKeyContent: null,
  privateCertPath: null,
  privateCertContent: null
})
const dataRule = {
  mchId: [
    { required: true, message: `${$t('platform.config.wechatPay')} mchId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  mchKey: [
    { required: true, message: `${$t('platform.config.wechatPay')} mchKey ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  keyPath: [
    { required: true, message: `${$t('platform.config.paymentCertificatePath')} ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  apiv3Key: [
    { required: true, message: '微信支付apiv3Key不能为空', trigger: 'blur' }
  ],
  certSerialNo: [
    { required: true, message: '证书序列号不能为空', trigger: 'blur' }
  ],
  privateKeyContent: [
    { required: true, message: '商户apiclient_key.pem不能为空', trigger: 'blur' }
  ],
  privateCertContent: [
    { required: true, message: '商户apiclient_cert.pem不能为空', trigger: 'blur' }
  ]
}

const useAllinpay = useAllinpayStore()
// 结算方式 1:通联 0：非通联
const paySettlementType = computed(() => {
  return useAllinpay.paySettlementType
})

onMounted(() => {
  init()
})

const dataFormRef = ref()
const init = () => {
  nextTick(() => {
    api.get('WXPAY_CONFIG').then(data => {
      if (data) {
        Object.assign(dataForm, JSON.parse(data))
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
        paramKey: 'WXPAY_CONFIG',
        paramValue: JSON.stringify(dataForm),
        remark: $t('platform.config.paymentCertificatePath')
      }).then(() => {
        init()
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
