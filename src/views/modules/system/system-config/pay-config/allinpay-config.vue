<template>
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
        <div style="color:#606266;font-size:14px;width:180px">
          <span style="color:#ff4949">*</span> 通联支付
        </div>
        <el-switch
          v-model="paySettlementType"
          style="margin-right:12px"
          :disabled="unSet || !appId"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeSwitchType"
        />
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
      <el-button
        @click="onSubmit('ALLINPAY_CONFIG')"
      >
        {{ $t('platform.config.save') }}
      </el-button>
      <el-button
        @click="emit('toggle')"
      >
        {{ $t('platform.config.back') }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import { h } from 'vue'
import * as api from '@/api/platform/sys-config.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
const emit = defineEmits(['unSetState', 'toggle', 'appIdState'])

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
const dataRule = reactive({
  requestUrl: [{ required: true, message: '请求地址不能为空', trigger: 'blur' }],
  appId: [{ required: true, message: 'appId不能为空', trigger: 'blur' }],
  appSecret: [{ required: true, message: '签名秘钥不能为空', trigger: 'blur' }],
  appPrivateKey: [{ required: true, message: '商户私钥不能为空', trigger: 'blur' }],
  accountSetNo: [{ required: true, message: '托管账户集编号不能为空', trigger: 'blur' }],
  appCertPath: [{ required: true, message: '应用公钥证书路径不能为空', trigger: 'blur' }],
  appPrivateCertPath: [{ required: true, message: '应用私钥证书路径不能为空', trigger: 'blur' }],
  vspCusId: [{ required: true, message: '集团商户号不能为空', trigger: 'blur' }]
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
        emit('appIdState', true)
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
const changeSwitchType = (val) => {
  if (val) {
    ElMessageBox({
      message: h('div', { style: 'padding:30px 5px 0', class: 'box' }, [
        h('p', { style: 'line-height:24px;display:flex;align-item:center;' }, [
          h(WarningFilled, { class: 'el-icon-warning', style: 'color:#FAAD14;width:24px' }, null),
          h('span', { style: 'font-weight:bold;margin-left:10px;color:#333333;font-size:18px' }, '确认开启通联支付？ ')
        ]),
        h('p', { style: 'line-height:24px;color:#333333;font-size: 14px;margin:12px 0 20px 34px;' }, '开启后将采用通联支付体系且不能关闭，现有支付体系中的供应商、商家及用户余额将不再显示，请谨慎开启此功能或开启前先将系统内所有账号的余额结清。')
      ]),
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      onClose: () => {
        onSubmit('PAY_SETTLEMENT_CONFIG')
      }
    }).then(action => {
      onSubmit('PAY_SETTLEMENT_CONFIG')
    }).catch(() => {
      paySettlementType.value = false
    })
  }
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
  .allinpay-switch {
    margin-bottom:18px;
    margin-top: 18px;
    display:flex;
    align-items: center;

  }

</style>
