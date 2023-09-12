<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        class="demo-form-inline"
        @submit.prevent
      >
        <el-form-item :label="$t('delivery.transport.name') + '：'">
          <el-input
            v-model="pageQuery.transName"
            :placeholder="$t('delivery.transport.name')"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getPage(true)"
          >
            {{ $t('delivery.transport.query') }}
          </el-button>
          <el-button
            @click="clearSearchInfo()"
          >
            {{ $t('table.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t("table.create") }}
        </el-button>
      </div>
    </div>
    <div class="table-con">
      <!-- 列表相关区域 -->
      <el-table
        v-loading="pageLoading"
        :data="pageVO.list"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        row-key="imgId"
        style="width: 100%"
      >
        <!-- 名称 -->
        <el-table-column
          :label="$t('delivery.transport.name')"
          prop="transName"
          align="center"
          width="300px"
        >
          <template #default="{ row }">
            <span>{{ row.transName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('delivery.transport.type')"
          prop="type"
        >
          <template #default="scope">
            <span>{{
              [$t('delivery.transport.buyerPrice'), $t('delivery.transport.shopPrice')][scope.row.isFreeFee]
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          prop="imgType"
          :label="$t('delivery.transport.chargePrice')"
        >
          <template #default="scope">
            <span>{{
              [$t('delivery.transport.byCount'), $t('delivery.transport.byWeight'), $t('delivery.transport.byVolume')][scope.row.chargeType]
            }}</span>
          </template>
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column
          :label="$t('table.createTime')"
          prop="createTime"
          align="center"
          min-width="180"
        >
          <template #default="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <!-- 更新时间 -->
        <el-table-column
          :label="$t('table.updateTime')"
          prop="updateTime"
          align="center"
          min-width="180"
        >
          <template #default="{ row }">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="onAddOrUpdate(row.transportId)"
            >
              {{ $t("table.edit") }}
            </el-button>
            <el-button
              link
              type="primary"
              @click="onDelete(row.transportId)"
            >
              {{ $t("table.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total > 0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="getPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './components/add-or-update/index.vue'
import * as api from '@/api/delivery/transport.js'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(() => {
  getPage()
})

// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  name: null,
  transName: ''
})
const clearSearchInfo = () => {
  pageQuery.transName = ''
}

let theData = null // 保存上次点击查询的请求条件
// loading
const pageLoading = ref(true)
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// 获取数据列表
const getPage = (newData = false) => {
  if (newData || !theData) {
    theData = { ...pageQuery }
  } else {
    theData.pageNum = pageQuery.pageNum
    theData.pageSize = pageQuery.pageSize
  }
  pageLoading.value = true
  api.page(theData).then(pageVOPar => {
    pageVO.value = pageVOPar
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
// 新增 / 修改
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(id)
  })
}

// 删除
const onDelete = (id) => {
  ElMessageBox.confirm(
    $t('table.sureToDelete'),
    $t('table.tips'),
    {
      confirmButtonText: $t('table.confirm'),
      cancelButtonText: $t('table.cancel'),
      type: 'warning'
    }
  ).then(() => {
    api.deleteById(id).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => getPage()
      })
    })
  })
}

</script>

<style lang="scss" scoped>
.operation-bar {
  margin-bottom: 20px;
}
</style>
