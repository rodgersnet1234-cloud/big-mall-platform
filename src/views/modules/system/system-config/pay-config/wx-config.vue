<template>
  <el-dialog
    v-model="wxConfigVisible"
    title="编辑"
  >
    <div class="mod-pay">
      <div class="pay-wx-set gray-box top-redius border-bottom-gray">
        <div class="title">
          {{ $t('platform.config.wechatPaymentConfiguration') }}
          <el-tooltip
            class="item"
            effect="dark"
            content="开启通联支付后将无需设置此处支付配置信息"
            placement="right"
          >
            <el-icon class="question">
              <QuestionFilled />
            </el-icon>
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
        </el-form>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="wxConfigVisible = false">
          {{ $t('platform.config.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('platform.config.save') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'
// import app from './wx-app-config.vue'

const emit = defineEmits(['refreshDataList', 'toggle', 'initMessage'])
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
const wxConfigVisible = ref(false)
let changeSwitch = ''
const exposeVisible = (isSwitch) => {
  changeSwitch = isSwitch
  wxConfigVisible.value = true
}
const dataFormRef = ref()
const init = () => {
  nextTick(() => {
    api.get('WXPAY_CONFIG').then(data => {
      if (data) {
        Object.assign(dataForm, JSON.parse(data))
        if (changeSwitch) {
          emit('toggle', true)
        }
        emit('initMessage', false)
      } else {
        emit('initMessage', true)
      }
    })
    wxConfigVisible.value = false
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
defineExpose({ init, exposeVisible })
</script>
<style lang="scss" scoped>
/*
通用样式
*/
.mod-pay {
  :deep(.sdp-top) {
    .IsdistributionText {
      display: inline-block;
      padding-left: 10px;
    }
  }
  :deep(.footer-bar-pagination) {
    width: calc(100% + 30px);
    background-color: white;
    bottom: 0px;
    position: fixed;
    height: 50px;
    text-align: center;
    z-index: 100;
    left: -30px;
    line-height: 50px;
  }
  :deep(#tabs) {
    margin-top: 20px;
  }

  :deep(.tips) {
    color: #9797a1;
    font-size: 12px;
  }
  :deep(.title) {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
  }
  :deep(.gray-box) {
    padding: 20px 35px;
    height: 100%;
  }

  :deep(.bottom-redius) {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  :deep(.top-redius) {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  :deep(.set-form) {
    margin-left: 20%;
    margin: 20px;
  }

  :deep(.valid-input) {
    margin-left: 20px;
    border-top-left-radius: 0px;
  }

  /**
    elenemt
    **/
  :deep(.el-checkbox__label),
  :deep(.el-radio__label) {
    padding-left: 5px;
    font-size: 13px;
  }
  :deep(.el-checkbox__inner),
  :deep(.el-radio__inner) {
    border: 2px solid #b2aebc;
  }
  :deep(.el-checkbox__inner::after) {
    left: 3px;
    top: 0px;
  }

  :deep(.el-input__inner) {
    border-radius: 0%;
  }
}
</style>
