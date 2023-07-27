<template>
  <div class="app-container">
    <div class="main-content">
      <el-tabs
        v-model="activeName"
        class="tabs"
      >
        <el-tab-pane
          :label="$t('rbac.menuResource.platformsMenuResources')"
          name="menuPermission"
        >
          <menuPermission v-if="activeName === 'menuPermission'" />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rbac.menuResource.suppliersMenuResources')"
          name="supplier-menu-permission"
        >
          <supplier-menu-permission v-if="activeName === 'supplier-menu-permission'" />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rbac.menuResource.merchantsMenuResources')"
          name="shopMenuPermission"
        >
          <shopMenuPermission v-if="activeName === 'shopMenuPermission'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import shopMenuPermission from '../shop-menu-permission/index.vue'
import menuPermission from '../menu-permission/index.vue'
import supplierMenuPermission from '../supplier-menu-permission/index.vue'

const activeName = ref('menuPermission')

</script>
<style lang="scss" scoped>
  .main-content {
    margin-top: 0;
  }
</style>
