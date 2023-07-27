<template>
  <div class="page-distribution-set">
    <el-tabs>
      <!-- 分销设置 -->
      <el-tab-pane label="分销设置">
        <basic ref="basicRef" />
      </el-tab-pane>
      <!-- 分销招募推广设置 -->
      <el-tab-pane label="推广设置">
        <recruit />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import basic from './components/set.vue'
import recruit from './components/recruit-set.vue'
</script>
<style lang="scss" scoped>
.page-distribution-set {
  background-color: #fff;
  padding: 20px;
  :deep(.el-tabs__nav-scroll) {
    padding-top: 10px;
  }
}
</style>
