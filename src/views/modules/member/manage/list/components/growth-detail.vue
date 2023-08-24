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
        width="180"
      />
      <el-table-column
        prop="bizId"
        :label="$t('order.order.number')"
      >
        <template #default="{row}">
          <div>
            {{ row.bizId ? row.bizId : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="changeGrowth"
        :label="$t('user.userManager.changeGrowthValue')"
      />
      <el-table-column
        prop="remarks"
        :label="$t('user.userManager.remark')"
      />
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
import Pagination from '@/components/pagination/index.vue'

onMounted(() => {
  onGetData()
})
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
  api.growthDetail({ ...pageQuery.value, userId }).then(resPageVO => {
    pageVO.value = resPageVO
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
defineExpose({ onInit })
</script>
