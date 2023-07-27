<template>
  <div class="mod-protocol">
    <el-tabs>
      <el-tab-pane
        v-for="(params, index) in configArr"
        :key="index"
        class="title"
        :label="params.title"
      >
        <protocol-config-components :params="params" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import protocolConfigComponents from './protocol-config-components.vue'

const configArr = [
  // 服务条款参数
  {
    title: $t('platform.config.serviceProtocolConfig'),
    keyCN: 'SERVICE_PROTOCOL_CN',
    keyEN: 'SERVICE_PROTOCOL_EN',
    remarkCN: $t('platform.config.serviceProtocolChineseConfig'),
    remarkEN: $t('platform.config.serviceProtocolEnglishConfig')
  },
  // 隐私策略参数
  {
    title: $t('platform.config.privacyProtocolConfig'),
    keyCN: 'PRIVACY_PROTOCOL_CN',
    keyEN: 'PRIVACY_PROTOCOL_EN',
    remarkCN: $t('platform.config.privacyProtocolChineseConfig'),
    remarkEN: $t('platform.config.privacyProtocolEnglishConfig')
  },
  // 商家注册协议
  {
    title: $t('platform.config.merchantRegisterProtocolConfig'),
    keyCN: 'MERCHANT_REGISTER_PROTOCOL_CN',
    keyEN: 'MERCHANT_REGISTER_PROTOCOL_EN',
    remarkCN: $t('platform.config.merchantRegisterProtocolChineseConfig'),
    remarkEN: $t('platform.config.merchantRegisterProtocolEnglishConfig')
  },
  // 开店协议
  {
    title: $t('platform.config.shopProtocolConfig'),
    keyCN: 'SHOP_PROTOCOL_CN',
    keyEN: 'SHOP_PROTOCOL_EN',
    remarkCN: $t('platform.config.shopProtocolChineseConfig'),
    remarkEN: $t('platform.config.shopProtocolEnglishConfig')
  },
  // 供应商注册协议
  {
    title: $t('platform.config.supplierRegisterProtocolConfig'),
    keyCN: 'SUPPLIER_REGISTER_PROTOCOL_CN',
    keyEN: 'SUPPLIER_REGISTER_PROTOCOL_EN',
    remarkCN: $t('platform.config.supplierRegisterProtocolChineseConfig'),
    remarkEN: $t('platform.config.supplierRegisterProtocolEnglishConfig')
  },
  // 供应商开店协议
  {
    title: $t('platform.config.supplierShopProtocolConfig'),
    keyCN: 'SUPPLIER_SHOP_PROTOCOL_CN',
    keyEN: 'SUPPLIER_SHOP_PROTOCOL_EN',
    remarkCN: $t('platform.config.supplierShopProtocolChineseConfig'),
    remarkEN: $t('platform.config.supplierShopProtocolEnglishConfig')
  }
]

</script>
<style lang="scss">
/*
通用样式
*/
.mod-protocol {
  background: #f2f2f6;
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
}
</style>
