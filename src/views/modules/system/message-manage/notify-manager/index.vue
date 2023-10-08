<template>
  <div class="app-container mod-notify-log">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="消息模板"
        name="first"
      >
        <templateManager />
      </el-tab-pane>
      <el-tab-pane
        label="消息记录"
        name="second"
      >
        <notifyLog />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import templateManager from './components/template-manager/index.vue'
import notifyLog from './components/notify-log.vue'

const activeName = ref('first')

</script>
