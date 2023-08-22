<template>
  <div>
    <el-table
      v-loading="pageLoading"
      :data="pageVO.list"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      style="width: 100%"
    >
      <el-table-column
        prop="createTime"
        :label="$t('user.userManager.changeTime')"
      />
      <el-table-column
        prop="type"
        :label="$t('user.userManager.changeType')"
      >
        <template #default="{row}">
          <!-- 1:充值 2:赠送 3:支付 4:退款 5:平台手动修改 6:购买会员 -->
          <span>{{
            ['',$t('user.userManager.recharge'),
             $t('user.userManager.reward'),
             $t('user.userManager.payment'),
             $t('user.userManager.refund'),
             $t('user.userManager.platformChange'),
             $t('user.userManager.purchaseMembership')][row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="changeBalance"
        :label="$t('user.userManager.changeBalance')"
      >
        <template #default="{row}">
          <div>{{ conversionActual(row.changeBalance) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ioType"
        :label="$t('user.userManager.ioType')"
      >
        <template #default="{row}">
          <span>{{ [$t('user.userManager.pay'),$t('user.userManager.income')][row.ioType] }}</span>
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
import * as api from '@/api/user/user-recharge.js'
import Pagination from '@/components/pagination/index.vue'
import Big from 'big.js'

const conversionActual = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf()
}
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const defaultPageVO = {
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
}
let userId = null
const onInit = (id) => {
  userId = id
  Object.assign(pageVO.value, defaultPageVO)
  onGetData()
}
// 获取数据
const pageQuery = ref({ // 查询的参数
  pageSize: 10,
  pageNum: 1
})
const pageLoading = ref(true)
const onGetData = () => {
  if (!userId) {
    return
  }
  pageLoading.value = true
  api.pageRechargeUserLog({ ...pageQuery.value, userId }).then(resPageVO => {
    pageVO.value = resPageVO
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
defineExpose({ onInit })
</script>
