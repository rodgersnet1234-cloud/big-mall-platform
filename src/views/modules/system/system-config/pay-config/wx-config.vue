<template>
  <div class="mod-pay">
    <app ref="appRef" />
    <pay ref="payRef" />
  </div>
</template>
<script setup>
import app from './wx-app-config.vue'
import pay from './wx-pay-config.vue'

</script>
<style lang="scss" scoped>
/*
通用样式
*/
.mod-pay {
  :deep(.sdp-top) {
    .IsdistributionText {
      display: inline-block;
      padding-left: 10px;
    }
  }
  :deep(.footer-bar-pagination) {
    width: calc(100% + 30px);
    background-color: white;
    bottom: 0px;
    position: fixed;
    height: 50px;
    text-align: center;
    z-index: 100;
    left: -30px;
    line-height: 50px;
  }
  :deep(#tabs) {
    margin-top: 20px;
  }

  :deep(.tips) {
    color: #9797a1;
    font-size: 12px;
  }
  :deep(.title) {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
  }
  :deep(.gray-box) {
    background: #f2f2f6;
    padding: 20px 35px;
    height: 100%;
  }
  :deep(.border-bottom-gray) {
    border-bottom: 1px solid #dddce2;
  }
  :deep(.bottom-redius) {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  :deep(.top-redius) {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  :deep(.set-form) {
    margin-left: 20%;
    margin: 20px;
  }

  :deep(.valid-input) {
    margin-left: 20px;
    border-top-left-radius: 0px;
  }

  /**
    elenemt
    **/
  :deep(.el-checkbox__label),
  :deep(.el-radio__label) {
    padding-left: 5px;
    font-size: 13px;
  }
  :deep(.el-checkbox__inner),
  :deep(.el-radio__inner) {
    border: 2px solid #b2aebc;
  }
  :deep(.el-checkbox__inner::after) {
    left: 3px;
    top: 0px;
  }

  :deep(.el-input__inner) {
    border-radius: 0%;
  }
}
</style>
