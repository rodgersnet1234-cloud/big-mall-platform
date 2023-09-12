<template>
  <div class="mod-notify-log">
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="dataForm"
        @submit.prevent
        @keyup.enter="getPage(true)"
      >
        <div class="input-row">
          <el-form-item :label="$t('biz.notify.sendTime') + '：'">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
            />
          </el-form-item>
          <el-button
            @click="onSetDateRange(1)"
          >
            {{ $t('date.t') }}
          </el-button>
          <el-button
            @click="onSetDateRange(2)"
          >
            {{ $t('date.y') }}
          </el-button>
          <el-button
            @click="onSetDateRange(3)"
          >
            {{ $t('date.n') }}
          </el-button>
          <el-button
            @click="onSetDateRange(4)"
          >
            {{ $t('date.m') }}
          </el-button>
          <el-button
            class="operation-btn"
            type="primary"
            @click="onSearch(true)"
          >
            {{ $t('table.search') }}
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageData.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('table.id')"
            type="index"
            :index="1"
            width="60"
          />
          <el-table-column
            prop="message"
            :label="$t('biz.notify.notifyContent')"
            width="400"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.message }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopName"
            :label="$t('biz.notify.shopName')"
            width="240"
            align="left"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.shopName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="nickName"
            :label="$t('biz.notify.receiveName')"
            width="240"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.nickName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userMobile"
            :label="$t('biz.notify.receivePhone')"
            width="240"
            align="center"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.userMobile || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remindType"
            :label="$t('biz.notify.notifyType')"
            align="center"
          >
            <template #default="scope">
              <span
                v-if="scope.row.remindType === 1"
                class="tag-text"
              >{{ $t("biz.notify.msgNotifyFree") }}</span>
              <span
                v-if="scope.row.remindType === 2"
                class="tag-text"
              >{{ $t("biz.notify.publicNotify") }}</span>
              <span
                v-if="scope.row.remindType === 3"
                class="tag-text"
              >{{ $t("biz.notify.appletMessage") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('biz.notify.sendStatus')"
            width="100"
            align="center"
          >
            <template #default="scope">
              <span
                v-if="scope.row.status === 1 || scope.row.remindType === 3"
                class="tag-text"
              >{{ $t("biz.notify.success") }}</span>
              <span
                v-if="scope.row.status === 0 && scope.row.remindType !== 3"
                class="tag-text"
              >{{ $t("biz.notify.fail") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            :label="$t('biz.notify.sendTime')"
            align="center"
            width="200"
          />
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="pageData.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageData.total"
      @pagination="getPage()"
    />
  </div>
</template>
<script setup>
import moment from 'moment'
import * as api from '@/api/biz/notify-log.js'
import Pagination from '@/components/Pagination/index.vue'

let tempSearchForm = null
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})

// loading
const pageLoading = ref(true)
const typeMap = new Map([
  [1, '订单催付'],
  [2, '付款成功通知'],
  [3, '商家同意退款'],
  [4, '商家拒绝退款'],
  [5, '核销提醒'],
  [6, '发货提醒'],
  [7, '拼团失败提醒'],
  [8, '拼团成功提醒'],
  [9, '拼团开团提醒'],
  [10, '会员升级提醒'],
  [101, '退款临近超时提醒'],
  [102, '确认收货提醒'],
  [103, '买家发起退款提醒'],
  [104, '买家已退货提醒']
])
const dataForm = reactive({})
// 查询参数
const searchParam = reactive({
  startTime: null,
  endTime: null
})
const searchForm = reactive({}) // 搜索
const dataListLoading = ref(false)
const dateRange = ref([])
let nowDate = null
const addOrUpdateVisible = ref(false)

// 返回参数
const pageData = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

onMounted(() => {
  getPage()
})

const getPage = (newData = false) => {
  nowDate = moment().format('LL')
  dataListLoading.value = true
  searchParam.startTime = dateRange.value === null ? null : dateRange.value[0]
  searchParam.endTime = dateRange.value === null ? null : dateRange.value[1]
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchParam }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  api.page(tempSearchForm).then(pageVO => {
    pageData.list = pageVO.list
    pageData.total = pageVO.total
    pageData.pages = pageVO.pages
    pageLoading.value = false
  })
}
//   http({
//     url: http.adornUrl('/platform/notifyLog/page'),
//     method: 'get',
//     params: http.adornParams(
//       Object.assign(
//         {
//           current: pageParam == null ? page.currentPage : pageParam.currentPage,
//           size: pageParam == null ? page.pageSize : pageParam.pageSize,
//           'startTime': dateRange === null ? null : dateRange[0], // 开始时间
//           'endTime': dateRange === null ? null : dateRange[1] // 结束时间
//         },
//         searchForm
//       )
//     )
//   }).then(({ data }) => {
//     dataList = data.records
//     page.total = data.total
//     dataListLoading = false
//   })
// },
const addOrUpdateRef = ref()
// 新增 / 修改
const onAddOrUpdate = () => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init()
  })
}
/**
 * 根据选项设置时间
 * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
 */
const onSetDateRange = (val) => {
  let startDay = null
  let endDay = null
  if (val === 1) {
    startDay = 0
    endDay = 0
  } else if (val === 2) {
    startDay = -1
    endDay = -1
  } else if (val === 3) {
    startDay = -7
    endDay = -1
  } else if (val === 4) {
    startDay = -30
    endDay = -1
  } else {
    return
  }
  // 开始时间
  const startTime = moment().add(startDay, 'days').startOf('days').format('LL')
  // 结束时间
  const endTime = moment().add(endDay, 'days').endOf('days').format('LL')
  dateRange.value = [startTime, endTime]
}

// 搜索查询
const onSearch = (newData = false) => {
  pageQuery.pageNum = 1
  getPage(newData)
}

</script>
<style lang="scss" scoped>
.mod-service-notifyTemplate{
  .recharge {
    display: inline-block;
    color: #333;
    font-size: 12px;
    padding: 25px 36px;
    background: rgba(0, 0, 0, 0.04);
  }
  .screening-conditions {
    display: block;
    padding: 8px;
    font-size: 20px;
    background: #f8f8f9;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .divider {
    font-size: 18px;
  }
  .lines {
    width: 3px;
    background: #155bd4;
    margin: 3px;
    height: 18px;
  }
  .title-time {
    display: inline-block;
    color: gray;
    font-size: 15px;
  }
  .search {
    width: 900px;
  }
  .operation-box {
    display: inline-block;
    margin-left: 30px;
  }
  .tit1 {
    margin-bottom: 15px;
    background: #f8f8f9;
    z-index: 11;
  }
  .tit1 .item {
    padding: 0 10px;
    width: 10%;
    text-align: center;
  }
  .tit1 .product {
    width: 25%;
  }
}
</style>
