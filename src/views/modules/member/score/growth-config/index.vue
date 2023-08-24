<template>
  <div class="mod-marketing-distribution page-score-growth-config">
    <el-tabs>
      <el-tab-pane :label="$t('user.score.pointsEarnSetting')">
        <score ref="basicRef" />
      </el-tab-pane>
      <el-tab-pane :label="$t('user.score.growthEarnSetting')">
        <growth ref="growthRef" />
      </el-tab-pane>
      <el-tab-pane :label="$t('user.score.otherConfiguration')">
        <expire ref="expireRef" />
        <question ref="questionRef" />
        <growthDescription ref="growthDescriptionRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import score from './components/score-config.vue'
import growth from './components/growth-config.vue'
import expire from './components/score-expire-config.vue'
import question from './components/score-question-config.vue'
import growthDescription from './components/growth-description.vue'
</script>
<style lang="scss" scoped>
@use "index";
</style>
