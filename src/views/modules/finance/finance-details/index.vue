<template>
  <div class="page-finance-details">
    <div class="finance-details">
      <div class="search-bar">
        <el-form
          clearable
          :inline="true"
          :model="dataFrom"
          class="demo-form-inline from"
          @submit.prevent
        >
          <div class="input-row">
            <el-form-item label="订单编号：">
              <el-input
                v-model="dataFrom.orderId"
                maxlength="20"
                style="width: 160px"
                clearable
                placeholder="订单编号"
              />
            </el-form-item>
            <el-form-item label="支付方式：">
              <el-select
                v-model="dataFrom.payType"
                clearable
                placeholder="支付方式"
              >
                <el-option
                  v-for="item in paymentMethodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="交易时间："
              label-width="120px"
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
                :default-time="defaultTime"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="font-size: 13px;"
                @click="onSubmit(true)"
              >
                搜索
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

      <div class="export-btn">
        <el-button
          v-permission="['platform:finance:export']"
          type="primary"
          @click="onExportFrom()"
        >
          导出报表
          <el-tooltip
            effect="dark"
            placement="right"
          >
            <template #content>
              <div style="max-width:500px">
                导出包括订单支付、订单退款、余额充值、会员购买数据
              </div>
            </template>
            <el-icon class="question">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </el-button>
      </div>

      <div class="main-content">
        <el-tabs
          v-model="financeBizType"
          @tab-click="onHandleClick"
        >
          <el-tab-pane
            label="订单支付"
            name="1"
          />
          <el-tab-pane
            label="订单退款"
            name="2"
          />
          <el-tab-pane
            v-if="paySettlementType!==1"
            label="余额充值"
            name="3"
          />
          <el-tab-pane
            label="会员购买"
            name="4"
          />
        </el-tabs>

        <div class="table-con">
          <el-table
            :data="tableData"
            header-cell-class-name="table-header"
            row-class-name="table-row"
            style="width: 100%"
          >
            <el-table-column
              prop="transDate"
              width="160"
              label="交易时间"
            />
            <!-- :render-header="renderHeadeThree" -->
            <el-table-column
              prop="orderId"
              width="170"
              label="订单编号"
            />
            <el-table-column
              prop="placeTime"
              width="160"
              label="下单时间"
            >
              <template #default="scope">
                <span>{{ scope.row.placeTime ? scope.row.placeTime : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="prodName"
              label="交易摘要"
            />
            <el-table-column
              v-if="financeBizType === '1' || financeBizType === '2'"
              prop="shopName"
              label="发生渠道"
            />
            <el-table-column
              prop="userName"
              label="资金变更申请人"
            />
            <el-table-column
              prop="payIds"
              label="支付交易单号"
            >
              <template #default="scope">
                <span>{{ scope.row.payIds ? scope.row.payIds : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="bizType"
              label="业务类型"
            >
              <template #default="scope">
                <span>
                  {{
                    [
                      '',
                      '订单支付',
                      '订单退款',
                      '余额充值',
                      '购买会员'
                    ][scope.row.bizType]
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="payType"
              label="支付方式"
            >
              <template #default="scope">
                <span>
                  {{
                    [
                      $t("order.order.pointsPayment"),
                      $t("order.order.wecProPay"),
                      $t("order.order.alipayPCPayment"),
                      $t("order.order.wechatScanCodePayment"),
                      $t("order.order.wechatH5Payment"),
                      $t("order.order.weclAccountPay"),
                      $t("order.order.alipayH5Payment"),
                      $t("order.order.alipayAPPPayment"),
                      $t("order.order.wechatAPPPayment"),
                      $t("order.order.balancePayment"),
                    ][scope.row.payType] || '-'
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="transAmount"
              label="收支金额"
            >
              <template #default="scope">
                <span>{{ amount((scope.row.transAmount || 0)) }}</span>
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
  </div>
</template>

<script setup>
import moment from 'moment'
import { page, soldExcel } from '@/api/finance-details/index'
import Big from 'big.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
const amount = (value) => {
  if (value) {
    return new Big(value).div(100).toFixed(2)
  }
  return 0
}
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
let tempSearchForm = null // 保存上次点击查询的请求条件
const financeBizType = ref('1')
const total = ref(0)
let isSubmit = false
const datePickerType = ref('daterange') // 日期筛选类型
const dateRangeParam = ref([moment().add(-6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')])
const defaultTime = ref([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
])
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
const params = ref({
  pageNum: 1,
  pageSize: 10
})
const paymentMethodOptions = [
  {
    label: '积分支付',
    value: 0
  },
  {
    label: '微信小程序支付',
    value: 1
  },
  {
    label: '支付宝',
    value: 2
  },
  {
    label: '微信扫码支付',
    value: 3
  },
  {
    label: '微信H5支付',
    value: 4
  },
  {
    label: '微信公众号支付',
    value: 5
  },
  {
    label: '支付宝H5支付',
    value: 6
  },
  {
    label: '支付宝APP支付',
    value: 7
  },
  {
    label: '微信APP支付',
    value: 8
  },
  {
    label: '用户余额支付',
    value: 9
  }
]
const dataFrom = ref({
  orderId: '',
  startTime: '',
  endTime: '',
  payType: '',
  financeBizType: '1'
})
const tableData = ref([{
  balance: 111
}])

onMounted(() => {
  onSubmit()
})

// 获取列表数据
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
const pagination = (page) => {
  params.value.pageNum = page.pageNum
  params.value.pageSize = page.pageSize
  onGetData()
}
const onSetdatePickerType = (val) => {
  datePickerType.value = val
  if (val === 'monthrange') {
    dateRangeParam.value = [
      moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
      moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
    ]
  }
}
// 导出
const onExportFrom = () => {
  if (!(dateRangeParam.value && dateRangeParam.value[0] && dateRangeParam.value[1])) {
    ElMessage.warning('请选择时间范围')
    return
  }
  dataFrom.value.startTime = dateRangeParam.value ? dateRangeParam.value[0] : ''
  dataFrom.value.endTime = dateRangeParam.value ? dateRangeParam.value[1] : ''

  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit) {
      return
    }
    isSubmit = true
    soldExcel({ ...dataFrom.value }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      // var blob = data
      let fileName = '财务明细'
      if (dateRangeParam.value[0].split(' ')[0] !== dateRangeParam.value[1].split(' ')[0]) {
        fileName = fileName + '(' + dateRangeParam.value[0].split(' ')[0] +
        ' ' + $t('date.tip') + ' ' +
        dateRangeParam.value[1].split(' ')[0] + ')'
      } else {
        fileName = fileName + `(${dateRangeParam.value[0].split(' ')[0]})`
      }
      fileName = fileName + '.xlsx'
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
      isSubmit = false
    }).catch((e) => {
      ElMessage.error(e)
      isSubmit = false
    })
  })
}
// 查询
const onSubmit = (newData = false) => {
  if (dateRangeParam.value) {
    dataFrom.value.startTime = dateRangeParam.value ? dateRangeParam.value[0] : ''
    dataFrom.value.endTime = dateRangeParam.value ? dateRangeParam.value[1] : ''
  }
  onGetData(newData)
}

// tab切换
const onHandleClick = (tab) => {
  dataFrom.value.financeBizType = tab.props.name
  onSubmit(true)
}

// 清空查询 的表单
const onClear = () => {
  dataFrom.value = {
    ioType: '',
    amountType: '',
    orderNumber: '',
    refundSn: '',
    reason: '',
    financeBizType: dataFrom.value.financeBizType
  }
  dateRangeParam.value = []
}

</script>

<style lang="scss" scoped>
  .page-finance-details {
    background: #F5F5F5;
    width: 100%;
    min-height: 100vh;
    .finance-details {
      background: #FFFFFF;
      width: 100%;
      padding: 24px;
      .search-bar {
        margin-bottom: 20px;
        :deep(.el-form-item__content .el-input){
          width: 160px;
        }
      }
      .date-range-param{
        :deep(.el-form-item__label:before) {
          color: #F56C6C;
          margin-right: 4px;
          content: '*';
        }
      }
      :deep(.date-picker-type .el-input--suffix) {
        width: 120px !important;
      }
      .el-form-item .el-form-item__content .el-select{
        width: 130px !important;
      }
    }
    .question{
      margin-left: 5px;
    }
  }

</style>
