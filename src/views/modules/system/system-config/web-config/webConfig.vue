<template>
  <div>
    <el-tabs
      v-model="activeName"
      class="tabs"
    >
      <el-tab-pane
        :label="$t('rbac.webConfig.platformSideConfiguration')"
        name="webConfigBs"
      >
        <webConfigBs v-if="activeName === 'webConfigBs'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('rbac.webConfig.merchantSideConfiguration')"
        name="webConfigShop"
      >
        <webConfigShop v-if="activeName === 'webConfigShop'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('rbac.webConfig.pcConfiguration')"
        name="webConfigPc"
      >
        <webConfigPc v-if="activeName === 'webConfigPc'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('rbac.webConfig.h5Configuration')"
        name="webConfigUni"
      >
        <webConfigUni v-if="activeName === 'webConfigUni'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('rbac.webConfig.stationConfiguration')"
        name="webConfigStation"
      >
        <webConfigStation v-if="activeName === 'webConfigStation'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import webConfigBs from './webConfig-bs.vue'
import webConfigShop from './webConfig-shop.vue'
import webConfigPc from './webConfig-pc.vue'
import webConfigUni from './webConfig-uni.vue'
import webConfigStation from './webConfig-station.vue'

const activeName = ref('webConfigBs')

</script>
<style scoped>
  div{
    margin-bottom: 150px;
  }
</style>
