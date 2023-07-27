<template>
  <div class="table">
    <div class="search-bar">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        clearable
        :inline="true"
        :model="dataFrom"
        class="demo-form-inline from"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="订单号：">
            <el-input
              v-model="dataFrom.orderId"
              maxlength="20"
              oninput="value=value.replace(/[^\d]/g,'')"
              style="width: 160px"
              clearable
              placeholder="请输入订单号"
            />
          </el-form-item>
          <el-form-item label="退款单号：">
            <el-input
              v-model="dataFrom.refundId"
              maxlength="19"
              oninput="value=value.replace(/[^\d]/g,'')"
              style="width: 160px"
              clearable
              placeholder="退款单号"
            />
          </el-form-item>
          <el-form-item label="收支类型：">
            <el-select
              v-model="dataFrom.platformIoType"
              clearable
              placeholder="收支类型"
            >
              <el-option
                v-for="item in ioType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="金额类型：">
            <el-select
              v-model="dataFrom.amountType"
              clearable
              placeholder="金额类型"
            >
              <el-option
                v-for="item in amountType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="资金变化原因：">
            <el-select
              v-model="dataFrom.reason"
              clearable
              placeholder="资金变化原因"
            >
              <el-option
                v-for="item in reason"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="时间范围："
            class="date-range-param"
          >
            <el-select
              v-model="datePickerType"
              class="date-picker-type"
              @change="onSetdatePickerType(datePickerType)"
            >
              <el-option
                v-for="item in datePickerTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-model="dateRangeParam"
              :type="datePickerType"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit(true)"
            >
              <i class="el-icon-search" />搜索
            </el-button>
            <el-button
              @click="onClear"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="table-con">
        <el-table
          :data="tableData"
          style="width: 100%"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="90"
          />
          <el-table-column
            prop="operation"
            label="金额类型"
            align="center"
            width="160"
          >
            <template #default="scope">
              <span>{{ ['未结算金额','平台收入金额','冻结金额'][scope.row.amountType] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformChangeAmount"
            label="改变金额"
            align="center"
            width="120"
          >
            <template #default="scope">
              <span> <span v-if="scope.row.platformChangeAmount">{{ ['-','+'][scope.row.platformIoType] }}</span>{{ price(scope.row.platformChangeAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderId"
            label="关联订单号"
            align="center"
            width="160"
          />
          <el-table-column
            prop="refundId"
            label="退款单号"
            align="center"
            width="160"
          >
            <template #default="scope">
              <span>{{ scope.row.refundId || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userAmount"
            label="操作金额"
            align="center"
            width="120"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.userAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformAmount"
            label="平台优惠金额"
            align="center"
            width="120"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.platformAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopReduceAmount"
            label="商家优惠金额"
            align="center"
            width="120"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.shopReduceAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="distributionAmount"
            label="分销占用金额"
            align="center"
            width="120"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.distributionAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformCommission"
            label="平台佣金"
            align="center"
            width="120"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.platformCommission) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            label="资金变化原因"
            align="center"
            width="150"
          >
            <template #default="scope">
              <span v-if="scope.row.reason === 0 ">用户支付</span>
              <span v-if="scope.row.reason === 1 || scope.row.reason === 14"> 订单结算</span>
              <span v-if="scope.row.reason === 2">用户退款申请成功</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            width="160"
          />
          <el-table-column
            prop="operation"
            label="操作"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="onHandleDetail(scope.row.orderId,scope.row.refundId)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <Pagination
      v-model:page="params.pageNum"
      v-model:limit="params.pageSize"
      style="text-align: right"
      :total="total"
      @pagination="pagination"
    />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import { page } from '@/api/wallet-log/index'
const price = (value) => {
  if (value) {
    return (value / 100).toFixed(2)
  }
  return 0
}
const datePickerTypeOptions = [
  {
    label: '日期范围',
    value: 'daterange'
  },
  {
    label: '月份范围',
    value: 'monthrange'
  }
]
const ioType = [{
  value: 0,
  label: '支出'
}, {
  value: 1,
  label: '收入'
}]
const amountType = [{
  value: 0,
  label: '未结算金额'
}, {
  value: 1,
  label: '平台收入金额'
}] // '未结算金额', '可提现金额', '冻结金额'
const reason = [
  {
    value: 0,
    label: '用户支付'
  },
  {
    value: 1,
    label: '订单结算'
  },
  {
    value: 2,
    label: '用户退款申请成功'
  }]

onMounted(() => {
  onGetData()
})

// 获取列表数据
let tempSearchForm = null // 保存上次点击查询的请求条件
const total = ref(0)
const dataFrom = ref({
  platformIoType: '',
  amountType: '',
  orderId: '',
  refundId: '',
  startTime: '',
  endTime: '',
  reason: ''
})
const tableData = ref([{
  balance: 111
}])
const params = ref({
  pageNum: 1,
  pageSize: 10
})
const onGetData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...dataFrom.value, ...params.value }
  } else {
    tempSearchForm = { ...tempSearchForm, ...params.value }
  }
  page(tempSearchForm).then(res => {
    tableData.value = res.list
    total.value = res.total
  })
}
const datePickerType = ref('daterange') // 日期筛选类型

const onSetdatePickerType = (val) => {
  datePickerType.value = val
}

const pagination = (page) => {
  params.value.pageNum = page.pageNum
  params.value.pageSize = page.pageSize
  onGetData()
}
// 查询
const dateRangeParam = ref([])

const onSubmit = (newData = false) => {
  dataFrom.value.startTime = dateRangeParam.value ? dateRangeParam.value[0] : ''
  dataFrom.value.endTime = dateRangeParam.value ? dateRangeParam.value[1] : ''
  params.value.pageNum = 1
  onGetData(newData)
}
// 跳转到详情页
const router = useRouter()
const onHandleDetail = (orderId, refundId) => {
  router.push({
    path: '/billing-details',
    query: {
      path: 0,
      orderId,
      refundId
    }
  })
}
// 清空查询 的表单
const onClear = () => {
  dataFrom.value = {
    platformIoType: '',
    amountType: '',
    orderId: '',
    refundId: '',
    startTime: '',
    endTime: '',
    reason: ''
  }
  dateRangeParam.value = []
}

</script>

<style lang="scss" scoped>
.table {
     margin-top: 30px;
      ::v-deep(.date-picker-type .el-input--suffix) {
        width: 120px !important;
      }
   }

</style>
