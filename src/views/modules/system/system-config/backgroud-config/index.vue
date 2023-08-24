<template>
  <div class="mod-platform-pconfigs">
    <el-tabs class="tabs-top">
      <el-tab-pane :label="$t('platform.config.basicConfiguration')">
        <base-config ref="baseConfigRef" />
      </el-tab-pane>
      <el-tab-pane label="系统开关">
        <sys-switch-config ref="sysSwitchConfigRef" />
      </el-tab-pane>
      <el-tab-pane :label="$t('platform.config.expressConfig')">
        <quick-config ref="quickConfigRef" />
      </el-tab-pane>
      <el-tab-pane :label="$t('platform.config.protocolConfig')">
        <protocol-config ref="protocolConfigRef" />
      </el-tab-pane>
      <el-tab-pane :label="$t('platform.config.sensitiveConfiguration')">
        <sensitive-config ref="sensitiveConfigRef" />
      </el-tab-pane>
      <el-tab-pane :label="$t('platform.config.aliLiveConfig')">
        <AliLiveConfig ref="aliLiveConfigRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import BaseConfig from './components/base-config.vue'
import QuickConfig from './components/quick-config.vue'
import ProtocolConfig from './components/protocol-config.vue'
import SensitiveConfig from './components/sensitive-config.vue'
import SysSwitchConfig from './components/sys-switch-config.vue'
import AliLiveConfig from './components/ali-live-config.vue'

</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
