<template>
  <div class="page-distribution-user">
    <el-tabs>
      <el-tab-pane label="分销员管理">
        <user />
      </el-tab-pane>
      <el-tab-pane label="分销员审核">
        <auditing />
      </el-tab-pane>
      <el-tab-pane label="关系查询">
        <bind />
      </el-tab-pane>
      <el-tab-pane label="封禁记录">
        <ban />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import user from './components/distribution-user.vue'
import auditing from './components/distribution-auditing.vue'
import bind from './components/distribution-bind.vue'
import ban from './components/distribution-ban.vue'
</script>

<style lang="scss" scoped>
.page-distribution-user{
  background-color: #fff;
  padding: 20px;
  :deep(.el-tabs__nav-scroll) {
    padding-top: 10px;
  }
}
</style>
