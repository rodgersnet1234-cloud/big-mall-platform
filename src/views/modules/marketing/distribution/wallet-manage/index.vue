<template>
  <div class="page-distribution-wallet">
    <el-tabs>
      <el-tab-pane label="钱包管理">
        <userWallet />
      </el-tab-pane>
      <el-tab-pane label="钱包流水">
        <userWalletBill />
      </el-tab-pane>
      <el-tab-pane
        v-if="paySettlementType!==1"
        label="提现管理"
      >
        <withdrawCash />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import userWallet from './components/distribution-user-wallet.vue'
import userWalletBill from './components/distribution-user-wallet-bill.vue'
import withdrawCash from './components/distribution-withdraw-cash.vue'
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
</script>

<style lang="scss" scoped>
.page-distribution-wallet {
  background-color: #fff;
  padding: 20px;
  :deep(.el-tabs__nav-scroll) {
    padding-top: 10px;
  }
}
</style>
