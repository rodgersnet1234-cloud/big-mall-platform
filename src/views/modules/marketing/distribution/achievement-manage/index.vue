<template>
  <div class="page-distribution-achievement">
    <el-tabs>
      <el-tab-pane label="业绩统计">
        <achievement />
      </el-tab-pane>
      <el-tab-pane label="推广效果">
        <income />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import achievement from './components/achievement-basic.vue'
import income from './components/income.vue'
</script>

<style lang="scss" scoped>
.page-distribution-achievement {
  background-color: #fff;
  padding: 20px;
  :deep(.el-tabs__nav-scroll) {
    padding-top: 10px;
  }
}
</style>
