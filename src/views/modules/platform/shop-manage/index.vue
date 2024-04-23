<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="店铺设置"
        name="1"
      >
        <shop-manage :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane
        v-if="paySettlementType!==1"
        label="开店申请"
        name="2"
      >
        <audit-shop :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane
        v-if="paySettlementType!==1"
        label="工商信息变更申请"
        name="3"
      >
        <change-businessInfor :active-name="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import ShopManage from './components/shop-manage/index.vue'
import AuditShop from './components/audit-shop/index.vue'
import changeBusinessInfor from './components/change-businessInfor/index.vue'
const route = useRoute()

const activeName = ref(route.query.activeName || '1')
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联

</script>
