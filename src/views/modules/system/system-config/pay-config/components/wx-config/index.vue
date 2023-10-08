<template>
  <div class="mod-pay">
    <miniapp ref="miniappRef" />
    <mp ref="mpRef" />
    <app ref="appRef" />
    <pay ref="payRef" />
  </div>
</template>
<script setup>
import miniapp from './components/wx-ma-config.vue'
import app from './components/wx-app-config.vue'
import mp from './components/wx-mp-config.vue'
import pay from './components/wx-pay-config.vue'
</script>
