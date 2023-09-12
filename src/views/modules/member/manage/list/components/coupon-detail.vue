<template>
  <div>
    <div>
      <el-select
        v-model="status"
        clearable
        style="margin-bottom:20px"
        @change="onChangeStatus()"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table
      v-loading="pageLoading"
      :data="pageVO.list"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      style="width: 100%;"
    >
      <el-table-column
        prop="receiveTime"
        :label="$t('user.userManager.getCouponTime')"
        align="center"
      />
      <el-table-column
        :label="$t('coupon.coupon.couponName')"
        align="center"
      >
        <template #default="{row}">
          <div>
            <span>{{ row.couponVO.couponName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.coupon.couponType')"
        align="center"
      >
        <template #default="{row}">
          <span>{{
            [
              $t("coupon.coupon.cashCoupon"),
              $t("coupon.coupon.discountVoucher"),
              $t("coupon.coupon.coinCertificate"),
            ][row.couponVO.couponType - 1]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="score"
        :label="$t('user.userManager.effectiveTime')"
        width="350"
        align="center"
      >
        <template #default="{row}">
          <div>
            <span>{{ row.userStartTime }} {{ $t("date.tip") }} {{ row.userEndTime }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('coupon.coupon.couponStatus')"
        align="center"
      >
        <template #default="{row}">
          <span>{{
            [$t("user.userManager.invalid"),
             $t("user.userManager.notUsed"),
             $t("user.userManager.used")][ row.status ]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('user.userManager.userRules')"
        align="center"
      >
        <template #default="{row}">
          <div v-if="row.couponVO.couponType === 1">
            <span>{{ $t("coupon.coupon.full") }}{{ conversionActual(row.couponVO.cashCondition) }}{{ $t("coupon.coupon.reduce") }}{{ conversionActual(row.couponVO.reduceAmount) }}</span>
          </div>
          <div v-if="row.couponVO.couponType === 2">
            <span>{{
              $t("user.userManager.discountMsg")
                .replace("PRICE", conversionPrice(row.couponVO.cashCondition))
                .replace("FOLD", row.couponVO.couponDiscount)
            }}</span>
          </div>
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
import * as api from '@/api/coupon/coupon.js'
import Pagination from '@/components/Pagination/index.vue'
import Big from 'big.js'

const conversionActual = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf() + '元'
}
const conversionPrice = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf()
}

// 查询参数
const options = [
  {
    value: 0,
    label: $t('user.userManager.invalid')
  }, {
    value: 1,
    label: $t('user.userManager.notUsed')
  }, {
    value: 2,
    label: $t('user.userManager.used')
  }]
const status = ref(null)
let userId = null
const onInit = (id) => {
  userId = id
  status.value = null
  onGetData()
}
// 获取数据
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const pageLoading = ref(true)
const pageQuery = ref({ // 查询的参数
  pageSize: 10,
  pageNum: 1
})
const onGetData = () => {
  if (!userId) {
    return
  }
  pageLoading.value = true
  api.platformCouponUserPage({ ...pageQuery.value, userId, status: status.value }).then(resPageVO => {
    pageVO.value = resPageVO
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const onChangeStatus = () => {
  pageQuery.value.pageNum = 1
  onGetData()
}

defineExpose({ onInit })
</script>
