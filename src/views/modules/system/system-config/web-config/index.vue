<template>
  <div class="app-container">
    <div class="main-content">
      <el-tabs
        v-model="activeName"
        class="tabs"
      >
        <el-tab-pane
          :label="$t('rbac.webConfig.platformSideConfiguration')"
          name="webConfigBs"
        >
          <!-- <webConfigBs v-if="activeName === 'webConfigBs'" /> -->
          <add-or-update
            v-if="activeName === 'webConfigBs'"
            :config-type="1"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rbac.webConfig.merchantSideConfiguration')"
          name="webConfigShop"
        >
          <!-- <webConfigShop v-if="activeName === 'webConfigShop'" /> -->
          <add-or-update
            v-if="activeName === 'webConfigShop'"
            :config-type="2"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rbac.webConfig.supplierSideConfiguration')"
          name="webConfigSupplier"
        >
          <!-- <webConfigSupplier v-if="activeName === 'webConfigSupplier'" /> -->
          <add-or-update
            v-if="activeName === 'webConfigSupplier'"
            :config-type="6"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rbac.webConfig.pcConfiguration')"
          name="webConfigPc"
        >
          <!-- <webConfigPc v-if="activeName === 'webConfigPc'" /> -->
          <add-or-update
            v-if="activeName === 'webConfigPc'"
            :config-type="3"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rbac.webConfig.h5Configuration')"
          name="webConfigUni"
        >
          <!-- <webConfigUni v-if="activeName === 'webConfigUni'" /> -->
          <add-or-update
            v-if="activeName === 'webConfigUni'"
            :config-type="4"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rbac.webConfig.stationConfiguration')"
          name="webConfigStation"
        >
          <!-- <webConfigStation v-if="activeName === 'webConfigStation'" /> -->
          <add-or-update
            v-if="activeName === 'webConfigStation'"
            :config-type="5"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>

import AddOrUpdate from './webConfig-add-or-update.vue'

const activeName = ref('webConfigBs')

</script>
<style scoped>
  .main-content {
    margin-top: 0;
  }
</style>
