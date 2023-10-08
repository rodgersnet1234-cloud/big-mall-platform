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
import allinpay from './components/allinpay-config.vue'
import userWithdraw from './components/user-withdraw-config.vue'
import shopWithdraw from './components/shop-withdraw-config.vue'
import supplierWithdraw from './components/supplier-withdraw-config.vue'

const useAllinpay = useAllinpayStore()
// 结算方式 1:通联 0：非通联
const paySettlementType = computed(() => {
  return useAllinpay.paySettlementType
})

</script>
