<template>
  <div class="mod-platform-pconfigs">
    <el-tabs class="tabs-top">
      <el-tab-pane :label="$t('platform.config.wechatConfiguration')">
        <wx-config ref="WxConfigRef" />
      </el-tab-pane>
      <el-tab-pane :label="$t('platform.config.alipayConfiguration')">
        <alipay-config ref="alipayConfigRef" />
      </el-tab-pane>
      <el-tab-pane :label="'通联支付'">
        <allinpay-config ref="allinpayConfigRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import WxConfig from './wx-config.vue'
import AlipayConfig from './alipay-config.vue'
import AllinpayConfig from './allinpay.vue'

</script>
<style lang="scss" scoped>
/*
通用样式
*/
.mod-platform-pconfigs {
  background-color: #fff;
  padding: 20px;
  .sdp-top {
    .IsdistributionText {
      display: inline-block;
      padding-left: 10px;
    }
  }
  .footer-bar-pagination {
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
  #tabs {
    margin-top: 20px;
  }

  .tips {
    color: #9797a1;
    font-size: 12px;
  }
  .title {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
  }
  .gray-box {
    background: #f2f2f6;
    padding: 20px 35px;
    height: 100%;
  }
  .border-bottom-gray {
    border-bottom: 1px solid #dddce2;
  }
  .bottom-redius {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .top-redius {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .set-form {
    margin-left: 20%;
    margin: 20px;
  }

  .valid-input {
    margin-left: 20px;
    border-top-left-radius: 0px;
  }

  /**
    elenemt
    **/
  .el-checkbox__label,
  .el-radio__label {
    padding-left: 5px;
    font-size: 13px;
  }
  .el-checkbox__inner,
  .el-radio__inner {
    border: 2px solid #b2aebc;
  }
  .el-checkbox__inner::after {
    left: 3px;
    top: 0px;
  }

  .el-input__inner {
    border-radius: 0%;
  }

  .tabs-top .el-tabs__nav{
    // margin-left: 40px;
  }
}
</style>
