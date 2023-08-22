<template>
  <div class="app-container mod-api-recharge">
    <!-- 搜索/按钮相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-if="pageVO.list.length < 10"
          v-permission="['user:recharge:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          row-key="rechargeId"
          style="width: 100%;"
        >
          <!-- 标题 -->
          <el-table-column
            :label="$t('user.recharge.title')"
            align="left"
            width="500"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.rechargeTitle }}</span>
            </template>
          </el-table-column>
          <!-- 充值金额 -->
          <el-table-column
            :label="$t('user.recharge.rechargeAmount')"
            align="center"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.rechargeAmount) }}</span>
            </template>
          </el-table-column>

          <!-- 顺序 -->
          <el-table-column
            :label="$t('user.recharge.sequence')"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.seq }}</span>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column
            fixed="right"
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['user:recharge:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.rechargeId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['user:recharge:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.rechargeId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/user/user-recharge.js'
import Big from 'big.js'
import { ElMessageBox, ElMessage } from 'element-plus'
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
let pageLoading = ref(true)
const addOrUpdateVisible = ref(false)

onMounted(() => {
  onGetDataList()
})

const onGetDataList = () => {
  pageLoading = true
  api.list().then(data => {
    pageVO.value.list = data
    pageLoading = false
  }).catch(() => {
    pageLoading = false
  })
}
// 新增 / 修改
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.onInit(id)
  })
}
const onDelete = (id) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.remove(id).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => onGetDataList()
      })
    })
  }).catch(() => { })
}
/**
 * 刷新回调
 */
const refreshChange = () => {
  onGetDataList()
}

</script>
<style lang="scss" scoped>
.mod-api-recharge {
  .main-content {
    padding-top: 0;
  }
}
</style>
