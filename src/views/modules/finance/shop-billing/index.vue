<template>
  <div class="box">
    <div class="shop-billing">
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
            <el-form-item label="退款编号：">
              <el-input
                v-model="dataFrom.refundId"
                maxlength="20"
                style="width: 160px"
                clearable
                placeholder="退款编号"
              />
            </el-form-item>
            <el-form-item label="收支类型：">
              <el-select
                v-model="dataFrom.shopIoType"
                clearable
                placeholder="收支类型"
              >
                <el-option
                  v-for="item in shopIoType"
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
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit(true)"
              >
                搜索
              </el-button>
              <el-button
                @click="clear"
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
            header-cell-class-name="table-header"
            row-class-name="table-row"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              align="left"
              width="85"
            />
            <el-table-column
              prop="amountType"
              label="金额类型"
              width="120"
            >
              <template #default="scope">
                <span>{{ ['待结算金额','店铺余额','冻结金额','总结算金额'][scope.row.amountType] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="shopChangeAmount"
              label="改变金额"
              width="120"
            >
              <template #default="scope">
                <span>{{ ['-','+'][scope.row.shopIoType] }} ￥{{ amount(Math.abs(scope.row.shopChangeAmount)) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderId"
              label="订单编号"
              align="left"
              width="220"
            >
              <template #default="scope">
                <span>{{ scope.row.orderId ? scope.row.orderId : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="refundId"
              label="退款编号"
              width="220"
            >
              <template #default="scope">
                <span>{{ scope.row.refundId ? scope.row.refundId : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="userAmount"
              label="操作金额"
              width="140"
            >
              <template #default="scope">
                <span>{{ ['-','+'][scope.row.shopIoType] }}{{ amount((scope.row.userAmount ? scope.row.userAmount : scope.row.shopChangeAmount)) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="platformAmount"
              label="平台优惠金额"
              width="150"
            >
              <template #default="scope">
                <span>￥ {{ amount((scope.row.platformAmount || 0)) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="shopReduceAmount"
              label="商家优惠金额"
              width="150"
            >
              <template #default="scope">
                <span>￥ {{ amount((scope.row.shopReduceAmount || 0)) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="distributionAmount"
              label="分销金额"
              width="130"
            >
              <template #default="scope">
                <span>￥ {{ amount((scope.row.distributionAmount || 0)) }}</span>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="shopPlatformCommission"
              label="平台佣金"
              width="130"
            >
              <template #default="scope">
                <span>￥ {{ amount((scope.row.shopPlatformCommission || 0)) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="reason"
              width="150"
              align="left"
              label="资金变化原因"
            >
              <template #default="scope">
                <span>{{ ['用户支付','订单结算','用户申请退款','拒绝用户退款申请','提现申请',
                          '提现申请被拒绝','提现申请通过','','','扣除订单分销金额','','充值成功','订单采购价差','商家自行处理采购价差','超时未支付尾款'][scope.row.reason] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              width="150"
              label="创建时间"
            />
            <el-table-column
              prop="operation"
              label="操作"
              align="center"
              fixed="right"
              min-width="110"
            >
              <template #default="scope">
                <span v-if="(scope.row.orderId!=null||scope.row.refundId!=null)&&scope.row.reason!==11">
                  <el-button
                    type="primary"
                    link
                    @click="handleDetail(scope.row.orderId,scope.row.refundId)"
                  >详情</el-button>
                </span>
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
import { page as pageApi } from '@/api/merchant-balance'
import Big from 'big.js'

const amount = (value) => {
  if (value) {
    return new Big(value).div(100).toFixed(2)
  }
  return 0
}

let tempSearchForm = null // 保存上次点击查询的请求条件
const total = ref(0)
const params = ref({
  pageNum: 1,
  pageSize: 10
})
const shopIoType = [{
  value: 0,
  label: '支出'
}, {
  value: 1,
  label: '收入'
}]
const amountType = [{
  value: 0,
  label: '待结算金额'
}, {
  value: 1,
  label: '店铺余额'
}, {
  value: 2,
  label: '冻结金额'
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
    label: '用户申请退款'
  },
  {
    value: 4,
    label: '提现申请'
  },
  {
    value: 5,
    label: '提现申请被拒绝'
  },
  {
    value: 6,
    label: '提现申请通过'
  },
  {
    value: 9,
    label: '扣除订单分销金额'
  },
  {
    value: 11,
    label: '充值成功'
  },
  {
    value: 12,
    label: '扣除订单采购价差'
  },
  {
    value: 13,
    label: '商家自行处理采购价差'
  },
  {
    value: 14,
    label: '超时未支付尾款'
  }
]
const dataFrom = reactive({
  shopIoType: '',
  amountType: '',
  orderId: '',
  refundId: '',
  reason: ''
})
const tableData = ref([{
  balance: 111
}])
const route = useRoute()
onMounted(() => {
  params.value = {
    ...params.value,
    shopId: route.query.shopId,
    endTime: route.query.endTime,
    startTime: route.query.startTime
  }
  getData()
})

// 获取列表数据
const getData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...dataFrom, ...params.value }
  } else {
    tempSearchForm = { ...tempSearchForm, ...params.value }
  }
  pageApi(tempSearchForm).then(res => {
    tableData.value = res.list
    total.value = res.total
  })
}
const pagination = (page) => {
  params.value.pageNum = page.pageNum
  params.value.pageSize = page.pageSize
  getData()
}
// 查询
const onSubmit = (newData = false) => {
  getData(newData)
}
// 跳转到详情页
const router = useRouter()
const handleDetail = (orderId, refundId) => {
  router.push({
    path: '/billing-details',
    query: {
      path: 1,
      orderId,
      refundId
    }
  })
}

// 清空查询 的表单
const clear = () => {
  dataFrom.shopIoType = ''
  dataFrom.amountType = ''
  dataFrom.orderId = ''
  dataFrom.refundId = ''
  dataFrom.reason = ''
  onSubmit(true)
}

</script>

<style lang="scss" scoped>
  .box {
    background: #F5F5F5;
    width: 100%;
    min-height: 100vh;
    .shop-billing {
      background: #FFFFFF;
      width: 100%;
      padding: 24px;
    }
  }

</style>
