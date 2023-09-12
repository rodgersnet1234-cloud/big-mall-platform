<template>
  <div>
    <el-table
      v-loading="pageLoading"
      :data="pageVO.list"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      style="width: 100%"
    >
      <!-- 支付时间 -->
      <el-table-column
        prop="payTime"
        :label="$t('user.userManager.payTime')"
        width="160"
      >
        <template #default="{row}">
          <span>{{ row.payTime || '-' }}</span>
        </template>
      </el-table-column>
      <!-- 订单id -->
      <el-table-column
        prop="orderId"
        :label="$t('order.order.orderId')"
        width="180"
      />
      <!-- 商品总额 -->
      <el-table-column
        prop="total"
        :label="$t('user.userManager.prodTotalPrice')"
      />
      <!-- 订单运费 -->
      <el-table-column
        prop="freightAmount"
        :label="$t('user.userManager.orderFreight')"
      />
      <!-- 实付金额 -->
      <el-table-column
        prop="actualTotal"
        :label="$t('order.order.actualAmount')"
      />
      <!-- 优惠金额 -->
      <el-table-column
        prop="reduceAmount"
        :label="$t('order.order.preferentialAmount')"
      />
      <!-- 支付积分 -->
      <el-table-column
        prop="orderScore"
        :label="$t('user.userManager.payScore')"
      >
        <template #default="{row}">
          <span>{{
            row.orderScore||0
          }}</span>
        </template>
      </el-table-column>
      <!-- 订单类型 -->
      <el-table-column
        prop="orderType"
        :label="$t('order.order.orderType')"
      >
        <template #default="{row}">
          <span>{{
            ['普通订单','团购订单','秒杀订单','积分订单'][row.orderType]
          }}</span>
        </template>
      </el-table-column>
      <!-- 支付方式 -->
      <el-table-column
        prop="payType"
        :label="$t('order.order.paymentMethod')"
        align="center"
      >
        <template #default="scope">
          <span>{{
            [
              $t("order.order.pointsPayment"),
              $t("order.order.weixinPay"),
              $t("order.order.aliPayPayment"),
              $t("order.order.wechatScanCodePayment"),
              $t("order.order.wechatH5Payment"),
              $t("order.order.weclAccountPay"),
              $t("order.order.alipayH5Payment"),
              $t("order.order.alipayAPPPayment"),
              $t("order.order.wechatAPPPayment"),
              $t("order.order.balancePayment"),
            ][scope.row.payType]
              || '-'
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="onGetData()"
    />
    <!-- /分页 -->
  </div>
</template>

<script setup>
import * as api from '@/api/user/user-manager.js'
import Pagination from '@/components/Pagination/index.vue'
import Big from 'big.js'

// 缩小倍数
const divTimes = 100
let userId = null

// 查询的参数
const pageQuery = ref({
  pageSize: 10,
  pageNum: 1
})

// 精度运算-除法
const bigDivide = (a, b) => {
  if (a == null) {
    return ''
  }
  const y = new Big(b)
  return new Big(a).div(y).valueOf()
}
const defaultPageVO = {
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
}
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const onInit = (id) => {
  userId = id
  Object.assign(pageVO.value, defaultPageVO)
  onGetData()
}
// 获取数据
const pageLoading = ref(true)
const onGetData = () => {
  if (!userId) {
    return
  }
  pageLoading.value = true
  api.tradeDetail({ ...pageQuery.value, userId }).then(resPageVO => {
    resPageVO.list.forEach(item => {
      item.total = bigDivide(item.total, divTimes)
      item.freightAmount = bigDivide(item.freightAmount, divTimes)
      item.actualTotal = bigDivide(item.actualTotal, divTimes)
      item.reduceAmount = bigDivide(item.reduceAmount, divTimes)
    })
    pageVO.value = resPageVO
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
defineExpose({ onInit })
</script>
