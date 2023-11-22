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
import WxConfig from './components/wx-config/index.vue'
import AlipayConfig from './components/alipay-config.vue'
import AllinpayConfig from './components/allinpay/index.vue'

</script>
<style lang="scss" scoped>
.mod-platform-pconfigs {
  background-color: #fff;
  padding: 20px;
}
</style>
<!-- eslint-disable-next-line -->
<style lang="scss">
@use 'index';
</style>
