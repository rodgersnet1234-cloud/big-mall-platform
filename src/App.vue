<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn'
import * as api from '@/api/rbac/web-config'
const language = zh
onMounted(() => {
  // 获取网站配置
  api.getActivity('PLATFROM_WEBSITE_CONFIG').then(data => {
    useWebConfigStore().addData(formatConfigInfo(data))
  })
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
