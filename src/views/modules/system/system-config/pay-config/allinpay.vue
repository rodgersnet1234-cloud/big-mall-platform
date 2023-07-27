<template>
  <div class="mod-pay">
    <allinpay ref="allinpayRef" />
    <shopWithdraw
      v-if="paySettlementType===1"
      ref="shopWithdrawRef"
    />
    <supplierWithdraw
      v-if="paySettlementType===1"
      ref="supplierWithdrawRef"
    />
    <userWithdraw
      v-if="paySettlementType===1"
      ref="userWithdrawRef"
    />
  </div>
</template>
<script setup>
import allinpay from './allinpay-config.vue'
import userWithdraw from './user-withdraw-config.vue'
import shopWithdraw from './shop-withdraw-config.vue'
import supplierWithdraw from './supplier-withdraw-config.vue'
import useStore from 'element-plus/es/components/table/src/store/index'

// 结算方式 1:通联 0：非通联
const paySettlementType = computed(() => {
  return useStore.state.allinpay.paySettlementType
})

</script>
<style lang="scss" scoped>
</style>
