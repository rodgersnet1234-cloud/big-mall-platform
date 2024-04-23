<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn'
const language = zh
onMounted(() => {
  // 获取网站配置
  useWebConfigStore().getWebConfig()
  // 获取通联支付配置信息
  useAllinpayStore().getPaySettlementType()
})
</script>

<template>
  <el-config-provider
    :locale="language"
    namespace="el"
  >
    <router-view />
  </el-config-provider>
</template>

<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="scss">
@use '@/assets/app.scss';
</style>
