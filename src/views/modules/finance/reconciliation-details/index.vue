<template>
  <div class="box">
    <div class="manage-check">
      <div class="title">
        {{ ['退款','收入'][ioType] }}对账明细
      </div>
      <!-- 收入对账明细 -->

      <el-tabs
        v-if="params.shopId === '0' && ioType"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="订单"
          name="1"
        />
        <el-tab-pane
          v-if="paySettlementType!==1"
          label="余额充值"
          name="2"
        />
        <el-tab-pane
          label="会员购买"
          name="3"
        />
      </el-tabs>

      <div
        v-if="ioType"
        class="table"
      >
        <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            v-if="params.shopId !== '0'"
            prop="shopName"
            label="店铺名称"
            width="100"
          />
          <el-table-column
            width="160"
            prop="payTime"
            label="支付时间"
            align="center"
          />
          <el-table-column
            prop="orderIds"
            label="订单号"
            align="center"
            width="150"
          />
          <el-table-column
            prop="payType"
            label="支付方式"
            align="center"
          >
            <template #default="scope">
              <span>{{ ['积分支付','微信小程序支付','支付宝支付','微信扫码支付','微信H5支付','微信公众号支付','支付宝H5支付','支付宝APP支付','微信APP支付','余额支付'][scope.row.payType] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payId"
            label="支付交易单号"
            width="150"
          >
            <template #default="scope">
              <span>{{ scope.row.payId || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payEntry"
            label="支付入口"
            align="center"
          >
            <template #default="scope">
              <span>{{ ['订单','充值','开通会员'][scope.row.payEntry] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="alipayAmount"
            label="支付宝"
            align="center"
          >
            <template #default="scope">
              <span>￥{{ amount((scope.row.alipayAmount || 0)) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="wechatAmount"
            label="微信支付"
            align="center"
          >
            <template #default="scope">
              <span>￥{{ amount((scope.row.wechatAmount || 0)) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName !== '2'"
            prop="balanceAmount"
            label="余额支付"
            align="center"
          >
            <template #default="scope">
              <span>￥{{ amount((scope.row.balanceAmount || 0)) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName === '1'"
            prop="scoreCount"
            label="积分支付"
            align="center"
          >
            <template #default="scope">
              <span>{{ (scope.row.scoreCount || 0) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payAmount"
            label="合计"
            align="center"
          >
            <template #default="scope">
              <span>￥{{ amount(scope.row.payAmount) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 收入对账明细end -->

      <!-- 退款对账明细 -->
      <div
        v-else
        class="table"
      >
        <el-table
          :data="tableData1"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            v-if="params.shopId !== '0'"
            prop="shopName"
            label="店铺名称"
            width="100"
          />
          <el-table-column
            width="150"
            prop="refundTime"
            label="退款时间"
            align="center"
          />
          <el-table-column
            width="160"
            prop="refundId"
            label="退款单号"
            align="center"
          />
          <el-table-column
            prop="orderId"
            label="订单号"
            align="center"
            width="150"
          />
          <el-table-column
            prop="payType"
            label="支付方式"
            align="center"
          >
            <template #default="scope">
              <span>{{ ['积分支付','微信小程序支付','支付宝支付','微信扫码支付','微信H5支付','微信公众号支付','支付宝H5支付','支付宝APP支付','微信APP支付','余额支付'][scope.row.payType] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payId"
            label="支付单号"
          >
            <template #default="scope">
              <span>{{ scope.row.payId || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="alipayAmount"
            label="支付宝"
            align="center"
          >
            <template #default="scope">
              <span>￥{{ amount((scope.row.alipayAmount || 0)) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="wechatAmount"
            label="微信支付"
            align="center"
          >
            <template #default="scope">
              <span>￥{{ amount((scope.row.wechatAmount || 0)) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="balanceAmount"
            label="余额支付"
            align="center"
          >
            <template #default="scope">
              <span>￥{{ amount((scope.row.balanceAmount || 0)) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="scoreCount"
            label="积分支付"
            align="center"
          >
            <template #default="scope">
              <span>{{ (scope.row.scoreCount || 0) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="refundAmount"
            label="合计"
            align="center"
          >
            <template #default="scope">
              <span>￥{{ amount(scope.row.refundAmount) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 退款对账明细end -->
      <div class="back">
        <el-button
          type="primary"
          @click="back"
        >
          返回
        </el-button>
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
import { getPayInfo, getRefundInfo } from '@/api/funds-management/index'
import Big from 'big.js'

const amount = (value) => {
  if (!value) {
    return 0
  }
  return new Big(value).div(100).toFixed(2)
}
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
const activeName = ref('1')
const total = ref(0)
const ioType = ref('')
const params = ref({
  pageNum: 1,
  pageSize: 10,
  startTime: '',
  endTime: '',
  shopId: '',
  financeType: 1
})

const tableData = ref([])
const tableData1 = ref([])
const route = useRoute()
onMounted(() => {
  ioType.value = Number(route.query.type)
  params.value.shopId = route.query.shopId
  params.value.startTime = route.query.startTime
  params.value.endTime = route.query.endTime
  getData()
})

// tab切换
const handleClick = (tab) => {
  params.value.financeType = tab.props.name
  getData()
}
const pagination = (page) => {
  params.value.pageNum = page.pageNum
  params.value.pageSize = page.pageSize
  getData()
}
const getData = () => {
  if (ioType.value) {
    getPayInfo(params.value).then(data => {
      tableData.value = data.list
      total.value = data.total
    })
  } else {
    getRefundInfo(params.value).then(data => {
      tableData1.value = data.list
      total.value = data.total
    })
  }
}
const router = useRouter()
const back = () => {
  router.push('/finance/finance-manage-check')
}

</script>

<style lang="scss" scoped>
  .box {
    background: #F5F5F5;
    padding: 24px;
    width: 100%;
    min-height: 100vh;
  }
 .manage-check {
   background: #FFFFFF;
   width: 100%;
   padding: 24px;
   .title {
     font-size: 18px;
     margin-bottom: 16px;
   }

 }

</style>
