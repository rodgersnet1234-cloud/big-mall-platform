<template>
  <div class="mod-pay">
    <shopWithdraw
      v-if="paySettlementTypeState===1"
      ref="shopWithdrawRef"
    />
    <supplierWithdraw
      v-if="paySettlementTypeState===1"
      ref="supplierWithdrawRef"
    />
    <userWithdraw
      v-if="paySettlementTypeState===1"
      ref="userWithdrawRef"
    />
    <el-dialog
      v-model="allinpayVisible"
      title="编辑"
    >
      <div class="allinpay-config gray-box top-redius border-bottom-gray">
        <div class="title">
          {{ '通联支付设置' }}
        </div>
        <el-form
          ref="dataFormRef"
          label-width="180px"
          class="set-form"
          label-position="left"
          :model="dataForm"
          :rules="dataRule"
          @submit.prevent
        >
          <div class="allinpay-switch">
            <el-tooltip
              class="item"
              effect="dark"
              content="开启后将采用通联的支付体系并不能关闭，请谨慎开启。"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <el-form-item
            :label="`请求地址：`"
            style="width:640px"
            prop="requestUrl"
          >
            <el-input
              v-model="dataForm.requestUrl"
              :placeholder="`请输入请求地址`"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            :label="`appId：`"
            style="width:640px"
            prop="appId"
          >
            <el-input
              v-model="dataForm.appId"
              :placeholder="`请输入appId`"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            :label="`签名秘钥：`"
            style="width:640px"
            prop="appSecret"
          >
            <el-input
              v-model="dataForm.appSecret"
              :placeholder="`请输入签名秘钥`"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            :label="`商户私钥：`"
            style="width:640px"
            prop="appPrivateKey"
          >
            <el-input
              v-model="dataForm.appPrivateKey"
              :placeholder="`请输入商户私钥`"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            :label="`托管账户集编号：`"
            style="width:640px"
            prop="accountSetNo"
          >
            <el-input
              v-model="dataForm.accountSetNo"
              :placeholder="`请输入托管账户集编号`"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            :label="`应用公钥证书路径：`"
            style="width:640px"
            prop="appCertPath"
          >
            <el-input
              v-model="dataForm.appCertPath"
              :placeholder="`请输入应用公钥证书路径`"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            :label="`应用私钥证书路径：`"
            style="width:640px"
            prop="appPrivateCertPath"
          >
            <el-input
              v-model="dataForm.appPrivateCertPath"
              :placeholder="`请输入应用私钥证书路径`"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            :label="`集团商户号：`"
            style="width:640px"
            prop="vspCusId"
          >
            <el-input
              v-model="dataForm.vspCusId"
              :placeholder="`请输入集团商户号`"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            :label="`微信子商户号：`"
            style="width:640px"
            prop="wechatSubAppId"
          >
            <el-input
              v-model="dataForm.wechatSubAppId"
              :placeholder="`请输入微信子商户号`"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            :label="`支付宝子商户号：`"
            style="width:640px"
            prop="alipaySubAppId"
          >
            <el-input
              v-model="dataForm.alipaySubAppId"
              :placeholder="`请输入支付宝子商户号`"
              controls-position="right"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="allinpayVisible = false">
            {{ $t('platform.config.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="onSubmit('ALLINPAY_CONFIG')"
          >
            {{ $t('platform.config.save') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import userWithdraw from './user-withdraw-config.vue'
import shopWithdraw from './shop-withdraw-config.vue'
import supplierWithdraw from './supplier-withdraw-config.vue'
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['unSetState', 'toggle', 'appIdState'])
const allinpayVisible = ref(false)
const exposeVisible = () => {
  allinpayVisible.value = true
}
const dataForm = ref({
  requestUrl: '',
  appId: '',
  appSecret: '',
  appPrivateKey: '',
  accountSetNo: '',
  appCertPath: '',
  vspCusId: '',
  wechatSubAppId: '',
  alipaySubAppId: ''
})
const appId = ref('') // 保存的appid，无数据时标识未保存
// eslint-disable-next-line no-unused-vars
const validEmptyTab = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}
const dataRule = reactive({
  requestUrl: [
    { required: true, message: '请求地址不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  appId: [
    { required: true, message: 'appId不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  appSecret: [
    { required: true, message: '签名秘钥不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  appPrivateKey: [
    { required: true, message: '商户私钥不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  accountSetNo: [
    { required: true, message: '托管账户集编号不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  appCertPath: [
    { required: true, message: '应用公钥证书路径不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  appPrivateCertPath: [
    { required: true, message: '应用私钥证书路径不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  vspCusId: [
    { required: true, message: '集团商户号不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ]
})
const paySettlementType = ref(false)
const unSet = ref(false)
onMounted(() => {
  init()
})

const init = () => {
  nextTick(() => {
    api.get('PAY_SETTLEMENT_CONFIG').then(data => {
      if (data) {
        paySettlementType.value = JSON.parse(data).paySettlementType === 1
        unSet.value = paySettlementType.value
        emit('unSetState', unSet.value)
      }
    })
    api.get('ALLINPAY_CONFIG').then(data => {
      if (data) {
        dataForm.value = JSON.parse(data)
        appId.value = JSON.parse(data).appId // 获取appid，用于判断是否保存完成

        emit('appIdState', appId.value)
      } else {
        emit('appIdState', '')
      }
    })
  })
}
const dataFormRef = ref()
// 表单提交
const onSubmit = (paramKey) => {
  if (paramKey === 'PAY_SETTLEMENT_CONFIG') {
    if (!unSet.value && appId.value) {
      dataFormRef.value?.validate((valid) => {
        if (valid) {
          const params = {
            paramKey: 'PAY_SETTLEMENT_CONFIG',
            paramValue: JSON.stringify({ paySettlementType: paySettlementType.value === true ? 1 : 0 }),
            remark: '支付结算配置'
          }
          api.save(params).then(() => {
            ElMessage.success('保存成功')
            allinpayVisible.value = false
            // 开启通联后，更新pinia中的配置
            useAllinpayStore().getPaySettlementType()
          })
        }
      })
    }
  } else if (paramKey === 'ALLINPAY_CONFIG') {
    dataFormRef.value?.validate((valid) => {
      if (valid) {
        api.save({
          paramKey: 'ALLINPAY_CONFIG',
          paramValue: JSON.stringify(dataForm.value),
          remark: '通联支付配置'
        }).then(() => {
          // 保存成功后，更新appid
          init()
          allinpayVisible.value = false
          ElMessage({
            message: $t('table.actionSuccess'),
            type: 'success',
            duration: 1500
          })
        })
      }
    })
  }
}
const useAllinpay = useAllinpayStore()
// 结算方式 1:通联 0：非通联
const paySettlementTypeState = computed(() => {
  return useAllinpay.paySettlementType
})
defineExpose({ init, exposeVisible })
</script>
<style lang="scss" scoped>
  .allinpay-switch {
    margin-bottom:18px;
    margin-top: 18px;
    display:flex;
    align-items: center;

  }
</style>
