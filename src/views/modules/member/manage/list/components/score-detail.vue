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
        prop="source"
        :label="$t('user.userManager.changeReason')"
      >
        <template #default="{row}">
          <span>{{
            [$t('user.userManager.registerScore'),
             $t('user.userManager.shopping'),
             $t('user.userManager.levelUp'),
             $t('user.userManager.signIn'),
             $t('user.userManager.shoppingDeducteScore'),
             $t('user.userManager.scoreExpired'),
             $t('user.userManager.rechargeBalance'),
             $t('user.userManager.sysChangeScore'),
             $t('user.userManager.shoppingScoreRefund'),
             $t('user.userManager.completeOrderBack'),
             $t('user.userManager.scoreProductExchange'),
             $t('user.userManager.scoreProductExchangeBack'),
             $t('user.userManager.scoreValid')
            ][row.source] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="score"
        :label="$t('user.userManager.changeScoreNum')"
      />
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
import * as api from '@/api/user/user-manager.js'
let userId = null
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
const onInit = (id) => {
  userId = id
  Object.assign(pageVO.value, defaultPageVO)
  onGetData()
}
// 获取数据
const pageLoading = ref(true)
// 查询的参数
const pageQuery = ref({
  pageSize: 10,
  pageNum: 1
})
const onGetData = () => {
  if (!userId) {
    return
  }
  pageLoading.value = true
  api.scoreDetail({ ...pageQuery.value, userId }).then(resPageVO => {
    pageVO.value = resPageVO
    pageVO.value.list = pageVO.value.list.filter(item => {
      return item.score !== 0
    })
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
defineExpose({ onInit })
</script>
