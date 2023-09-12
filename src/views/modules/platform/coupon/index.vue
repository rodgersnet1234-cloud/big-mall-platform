<template>
  <div class="app-container mod-platform-coupon">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="优惠券名称：">
            <el-input
              v-model="pageQuery.couponName"
              placeholder="优惠券名称"
              maxlength="20"
              clearable
            />
          </el-form-item>
          <el-form-item label="优惠券类型：">
            <el-select
              v-model="pageQuery.couponType"
              placeholder="请选择优惠券类型"
              clearable
            >
              <el-option
                label="代金券"
                value="1"
              />
              <el-option
                label="折扣券"
                value="2"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="过期状态：">
            <el-select
              v-model="pageQuery.status"
              placeholder="请选择优惠券过期状态"
              clearable
            >
              <el-option
                label="过期"
                value="0"
              />
              <el-option
                label="未过期"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="pageQuery.putonStatus"
              placeholder="请选择优惠券状态"
              clearable
            >
              <el-option
                label="取消投放"
                value="-1"
              />
              <el-option
                label="自动投放"
                value="0"
              />
              <el-option
                label="投放"
                value="1"
              />
              <el-option
                label="暂不投放"
                value="4"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="获取方式：">
            <el-select
              v-model="pageQuery.getWay"
              placeholder="请选择优惠券获取方式"
              clearable
            >
              <el-option
                label="用户领取"
                value="0"
              />
              <el-option
                label="系统发放"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="clearSearchInfo()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['platform:coupon:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 优惠券名称 -->
          <el-table-column
            :label="$t('coupon.coupon.couponName')"
            prop="couponName"
            align="left"
            min-width="100"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.couponName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 优惠类型 1:代金券 2:折扣券 3:兑换券 -->
          <el-table-column
            :label="$t('coupon.coupon.couponType')"
            prop="couponType"
            align="center"
            min-width="100"
          >
            <template #default="{row}">
              <span>{{ ['', '代金券', '折扣券', '兑换券'][row.couponType] }}</span>
            </template>
          </el-table-column>
          <!-- 开始时间 -->
          <el-table-column
            :label="$t('coupon.coupon.startTime')"
            prop="startTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.startTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 结束时间 -->
          <el-table-column
            :label="$t('coupon.coupon.endTime')"
            prop="endTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.endTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 优惠券状态 0:过期 1:未过期 -1:删除 -->
          <el-table-column
            :label="$t('coupon.coupon.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['过期','未过期'][row.status] }}</span>
              <span v-if="row.status === -1">删除</span>
            </template>
          </el-table-column>
          <!-- putonStatus  优惠券投放状态(-1:取消投放 0:等待投放 1:投放 2:违规下架 3:等待审核) -->
          <el-table-column
            :label="$t('coupon.coupon.putonStatus')"
            prop="putonStatus"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.putonStatus === -1">取消投放</span>
              <span v-if="row.putonStatus === 0">自动投放</span>
              <span v-if="row.putonStatus === 1">投放</span>
              <span v-if="row.putonStatus === 2">违规下架</span>
              <span v-if="row.putonStatus === 3">等待审核</span>
              <span v-if="row.putonStatus === 4">暂不投放</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('coupon.coupon.deliveryTime')"
            prop="launchTime"
            align="center"
            min-width="180"
          >
            <template #default="{ row }">
              {{ row.launchTime || '-' }}
            </template>
          </el-table-column>
          <!-- 库存 -->
          <el-table-column
            :label="$t('coupon.coupon.stocks')"
            prop="stocks"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.stocks }}</span>
            </template>
          </el-table-column>
          <!--          获取方式-->
          <el-table-column
            :label="$t('coupon.coupon.getWay')"
            prop="getway"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.getWay == 0 ? $t('coupon.coupon.ways1') : $t('coupon.coupon.ways2') }}</span>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            fixed="right"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['platform:coupon:update']"
                  link
                  type="primary"
                  @click="onAddOrUpdate(row.couponId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-if="row.putonStatus === 2"
                  link
                  type="primary"
                  class="el-icon-document-checked"
                  @click="offlineManageHandle(row)"
                >
                  申请上线
                </el-button>
                <el-button
                  v-if="row.putonStatus === 3"
                  link
                  type="primary"
                  class="el-icon-document-checked"
                  @click="offlineManageHandle(row)"
                >
                  等待审核
                </el-button>
                <el-button
                  v-permission="['platform:coupon:delete']"
                  link
                  type="primary"
                  @click="onDelete(row.couponId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total>0"
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

    <!-- 下架管理 -->
    <offline-manage
      v-if="operateDialogVisible"
      ref="offlineDataRef"
      @rereapply-data-submit="rereapplyDataSubmit"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/coupon/coupon'
import AddOrUpdate from './add-or-update.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

let tempSearchForm = reactive(null) // 保存上次点击查询的请求条件
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  couponName: '',
  couponType: '',
  getWay: ''
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
// 查询参数
const searchParam = reactive({
})
const addOrUpdateVisible = ref(false)

const couponId = ref(null) // 优惠券id
const operateDialogVisible = ref(false) // 下线管理弹窗

onMounted(() => {
  couponId.value = null
  getPage()
})

const getPage = (newData) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchParam }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  pageLoading.value = true
  api.couponPage(tempSearchForm).then(data => {
    Object.assign(pageVO, data)
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref('')
const onAddOrUpdate = (couponId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(couponId)
  })
}

const onDelete = (couponId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(couponId))
}

const deleteById = (couponId) => {
  api.deleteById(couponId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

// 下线管理
const offlineManageHandle = (row) => {
  operateDialogVisible.value = true
  couponId.value = row.couponId
  // getOfflineDetailByCouponId(row.couponId)
}

/**
 * 获取最新下线商品的事件
 */
// const offlineDataRef = ref('')
// const getOfflineDetailByCouponId = (couponId) => {
//   api.getOfflineDetailById(couponId).then((data) => {
//     offlineDetail = data
//     nextTick(() => {
//       offlineDataRef.init(data)
//     })
//   })
// }

/**
 * 提交上架申请
 */
// rereapplyDataSubmit(data) {
//   const param = {
//     handleId: couponId,
//     eventId: data.eventId,
//     reapplyReason: data.reapplyReason // 申请理由
//   }
//   api.reapplyOnlineById(param).then(() => {
//     operateDialogVisible = false
//     $message({
//       message: '提交成功',
//       type: 'success',
//       duration: 1000,
//       onClose: () => getPage()
//     })
//   })
// },

// 清空搜索内容
const clearSearchInfo = () => {
  pageQuery.couponName = ''
  pageQuery.couponType = null
  pageQuery.status = null
  pageQuery.putonStatus = null
  pageQuery.getWay = null
}

</script>
