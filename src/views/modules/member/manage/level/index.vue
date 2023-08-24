<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane :label="$t('user.level.ordinaryMemberSet')">
        <Ordinary />
      </el-tab-pane>
      <el-tab-pane :label="$t('user.level.paidMembershipSet')">
        <Vip />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import Ordinary from './components/userLevel-ordinary.vue'
import Vip from './components/userLevel-vip.vue'

</script>

<style scoped>
</style>
