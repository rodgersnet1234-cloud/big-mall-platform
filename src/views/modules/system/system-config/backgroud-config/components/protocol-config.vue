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

const configArr = ref([
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
])

</script>
<style lang="scss" scoped>
.mod-protocol {
  background: #f2f2f6;
  .title {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
  }
}
</style>
