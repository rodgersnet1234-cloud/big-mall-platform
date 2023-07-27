<template>
  <div class="app-container">
    <div class="main-content">
      <el-tabs
        v-model="activeName"
        class="tabs"
      >
        <el-tab-pane
          :label="$t('rbac.menu.platformMenu')"
          name="platformMenu"
        >
          <platformMenu v-if="activeName === 'platformMenu'" />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rbac.menu.supplierMenu')"
          name="supplier-menu"
        >
          <supplier-menu v-if="activeName === 'supplier-menu'" />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rbac.menu.shopMenu')"
          name="shop-menu"
        >
          <shop-menu v-if="activeName === 'shop-menu'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import platformMenu from '../menu/index.vue'
import supplierMenu from '../supplier-menu/index.vue'
import shopMenu from '../shop-menu/index.vue'

const activeName = ref('platformMenu')

</script>
<style lang="scss" scoped>
  .main-content {
    margin-top: 0;
  }
</style>
