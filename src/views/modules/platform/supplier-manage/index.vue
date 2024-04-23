<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="供应商设置"
        name="1"
      >
        <supplier-manage :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane
        v-if="paySettlementType!==1"
        label="开店申请"
        name="2"
      >
        <audit-supplier :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane
        v-if="paySettlementType!==1"
        label="工商信息变更申请"
        name="3"
      >
        <supplier-change-businessInfor :active-name="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import SupplierManage from './components/supplier-manage/index.vue'
import AuditSupplier from './components/audit-supplier/index.vue'
import supplierChangeBusinessInfor from './components/supplier-change-businessInfor/index.vue'

const route = useRoute()
const activeName = ref(route.query.activeName || '1')
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联

</script>
