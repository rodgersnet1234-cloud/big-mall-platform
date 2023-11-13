<template>
  <div
    class="mod-platform-pconfigs"
  >
    <div
      v-if="!wxConfigVisible&&!alipayConfigVisible"
    >
      <!-- 直连支付 -->
      <div class="tips-text">
        <h4>直连支付</h4>
        <span class="tips-content">配置开通后可使用相应支付方式，不可进行清分结算</span>
      </div>
      <div style="display:flex">
        <!-- 微信支付 -->
        <div class="pay-card">
          <img src="@/assets/images/icon_WeChat.png">
          <div
            class="card-text"
          >
            <span>微信支付</span>
            <el-button
              type="primary"
              link
              @click="onWxConfigEdit"
            >
              编辑
            </el-button>
          </div>
          <el-switch
            v-model="weChatPay"
            v-permission="['platform:sysConfig:save']"
            @change="onWeChatPayChange"
          />
        </div>
        <!-- 支付宝支付 -->
        <div class="pay-card">
          <img src="@/assets/images/icon_Alipay.png">
          <div
            class="card-text"
          >
            <span>支付宝支付</span>
            <el-button
              type="primary"
              link
              @click="onAlipayEdit"
            >
              编辑
            </el-button>
          </div>
          <el-switch
            v-model="Alipay"
            v-permission="['platform:sysConfig:save']"
            @change="onAlipayChange"
          />
        </div>
        <!-- 余额支付 -->
        <div class="pay-card">
          <img src="@/assets/images/icon_balance.png">
          <div
            class="card-text"
          >
            <span>余额支付</span>
          </div>
          <el-switch
            v-model="balancePay"
            v-permission="['platform:sysConfig:save']"
            @change="onUnionPayChange"
          />
        </div>
      </div>
      <!-- 聚合支付 -->
      <div class="tips-text">
        <h4>聚合支付</h4>
        <span class="tips-content">配置开通后将采取通联的支付体系进行线上分账，无需重复配置微信/支付宝信息。开通后无法关闭，请谨慎开启。</span>
      </div>
      <div class="pay-card">
        <img src="@/assets/images/icon_allinpay.png">
        <div
          class="card-text"
        >
          <span>通联支付</span>
          <el-button
            type="primary"
            link
            @click="onAllinConfigEdit"
          >
            编辑
          </el-button>
        </div>

        <el-switch
          v-model="allinpay"
          v-permission="['platform:sysConfig:save']"
          :disabled="disable"
          @change="onAllinpayChange"
        />
      </div>
    </div>
    <wx-config
      ref="wxConfigRef"
      @toggle="(state)=>weChatPay=state"
      @init-message="(state)=>WeChatMessageConfig=state"
    />

    <alipay-config
      ref="alipayConfigRef"
      @init-message="(state)=>alipayMessageConfig=state"
      @toggle="(state)=>Alipay=state"
    />
    <allinpay-config
      ref="allinpayConfigRef"
      @un-set-state="unSetState"
      @app-id-state="getAppidState"
      @toggle="(state)=>allinpay=state"
    />
  </div>
</template>
<script setup>
import WxConfig from './wx-config.vue'
import AlipayConfig from './alipay-config.vue'
import AllinpayConfig from './allinpay.vue'
import * as api from '@/api/platform/sys-config.js'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const weChatPay = ref(false)
const Alipay = ref(false)
const balancePay = ref(false)
const wxConfigVisible = ref(false)
const alipayConfigVisible = ref(false)
const WeChatMessageConfig = ref(false)// 是否填写微信配置内容
const alipayMessageConfig = ref(false)// 是否填写微信配置内容
const alipayConfigRef = ref(null)
const wxConfigRef = ref(null)
const allinpayConfigRef = ref(null)
onMounted(() => {
  // 微信开启状态
  api.get('WXPAY_STATUS_CONFIG').then(res => {
    weChatPay.value = !!JSON.parse(res)?.wxPayStatus
  })
  // 支付宝开启状态
  api.get('ALIPAY_STATUS_CONFIG').then(res => {
    Alipay.value = !!JSON.parse(res)?.alipayStatus
  })
  // 余额开启状态
  api.get('BALANCE_PAY_STATUS_CONFIG').then(res => {
    balancePay.value = !!JSON.parse(res)?.balancePayStatus
  })
})
// 微信
const onWeChatPayChange = (state) => {
  const paramValue = state ? { wxPayStatus: 1 } : { wxPayStatus: 0 }
  const hasOtherPayments = Alipay.value || balancePay.value
  if (!state && !hasOtherPayments) {
    weChatPay.value = true
    ElMessage.error('至少保留一项支付方式')
    return
  }
  if (WeChatMessageConfig.value) {
    wxConfigRef.value.exposeVisible(true)
    weChatPay.value = false
    return
  }
  updatePayConfig('WXPAY_STATUS_CONFIG', paramValue, '微信支付状态')
}
// 支付宝
const onAlipayChange = (state) => {
  const paramValue = state ? { alipayStatus: 1 } : { alipayStatus: 0 }
  const hasOtherPayments = weChatPay.value || balancePay.value
  if (!state && !hasOtherPayments) {
    Alipay.value = true
    ElMessage.error('至少保留一项支付方式')
    return
  }
  if (alipayMessageConfig.value) {
    alipayConfigRef.value.exposeVisible(true)
    Alipay.value = false
    return
  }
  updatePayConfig('ALIPAY_STATUS_CONFIG', paramValue, '支付宝支付状态')
}
// 开启支付宝配置信息弹窗
const onAlipayEdit = () => {
  alipayConfigRef.value.exposeVisible()
}
// 开启微信配置信息弹窗
const onWxConfigEdit = () => {
  wxConfigRef.value.exposeVisible()
}
const onAllinConfigEdit = () => {
  allinpayConfigRef.value.exposeVisible()
}
// 余额支付状态
const onUnionPayChange = (state) => {
  const paramValue = state ? { balancePayStatus: 1 } : { balancePayStatus: 0 }
  const hasOtherPayments = weChatPay.value || Alipay.value
  if (!state && !hasOtherPayments) {
    balancePay.value = true
    ElMessage.error('至少保留一项支付方式')
    return
  }
  updatePayConfig('BALANCE_PAY_STATUS_CONFIG', paramValue, '余额支付配置')
}

const allinpay = ref(false)
const unSet = ref(false)
// 通联开启状态
const unSetState = (state) => {
  allinpay.value = state
  unSet.value = state
}

const appId = ref('')
const getAppidState = (state) => {
  appId.value = state
}
// 通联支付
const onAllinpayChange = (val) => {
  if (!appId.value) {
    allinpayConfigRef.value.exposeVisible()
    allinpay.value = false
    return
  }
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
    }).then(() => {
      onSubmit('PAY_SETTLEMENT_CONFIG')
    }).catch(() => {
      allinpay.value = false
    })
  }
}
const disable = ref(false)
const onSubmit = async (configKey) => {
  if (!appId.value) {
    ElMessage({
      message: '请编辑填写配置信息',
      type: 'error',
      duration: 1500
    })
    allinpay.value = false
    return
  }
  const res = await updatePayConfig(configKey, { paySettlementType: 1 }, '支付结算配置')
  if (res) {
    disable.value = true // 如果配置成功则禁掉Switch按钮
  }
}
// 封装请求
const updatePayConfig = (paramKey, paramValue, remark) => {
  api.save({
    paramKey,
    paramValue: JSON.stringify(paramValue),
    remark
  }).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500
    })
  })
}
</script>
<style lang="scss" scoped>
.mod-platform-pconfigs {
  background-color: #fff;
  padding: 20px;
  min-height: 950px;
  .tips-text{
    padding: 24px 20px ;
    position: relative;
    background-color: #f9f9f9;
    h4{
      display: inline;
      font-size: 16px;
      margin:0 12px 0 10px ;
    }
    .tips-content{
      font-size: 12px;
      color: #999999;
    }
    &::before{
        content: "";
        display: inline-block;
        position: absolute;
        margin-right: 10px;
        width: 4px;
        height: 19px;
        background: #155BD4;
        border-radius: 2px;
      }
  }
  .pay-card{
    display: flex;
    width: 304px;
    height: 108px;
    margin: 40px 20px 40px 0 ;
    padding: 30px;
    border-radius: 8px;
    border: 1px solid #DCDFE6;
    .card-text{
      display: flex;
      flex-direction: column ;
      align-items: flex-start;
      justify-content: space-between;
      flex: 1;
      margin-left: 5px;
    }
    span{
      font-weight: 900;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      color: #333333;
    }
  }
  :deep(.sdp-top) {
    .IsdistributionText {
      display: inline-block;
      padding-left: 10px;
    }
  }
  :deep(.footer-bar-pagination) {
    width: calc(100% + 30px);
    background-color: white;
    bottom: 0;
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
    border-top-left-radius: 0;
  }

  /**
    elenemt
    **/

  :deep(el-checkbox__label,
  .el-radio__label){
    padding-left: 5px;
    font-size: 13px;
  }
  :deep(.el-checkbox__inner,
  .el-radio__inner) {
    border: 2px solid #b2aebc;
  }
  :deep(.el-checkbox__inner::after) {
    left: 3px;
    top: 0;
  }
  :deep(.el-input__inner) {
    border-radius: 0;
  }

}
</style>
