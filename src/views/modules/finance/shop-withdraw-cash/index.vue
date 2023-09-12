<template>
  <div class="box">
    <div class="shop-withdraw-cash">
      <div class="search-bar">
        <el-form
          clearable
          :inline="true"
          :model="dataFrom"
          class="demo-form-inline from"
          @submit.prevent
        >
          <div class="input-row">
            <el-form-item label="店铺名称：">
              <el-input
                v-model="dataFrom.shopName"
                maxlength="20"
                style="width: 160px"
                clearable
                placeholder="请输入店铺名称"
              />
            </el-form-item>
            <el-form-item
              v-if="paySettlementType!==1"
              label="审核状态："
            >
              <el-select
                v-model="dataFrom.status"
                clearable
                placeholder="审核状态"
              >
                <el-option
                  v-for="item in status"
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
                <i class="el-icon-search" />搜索
              </el-button>
              <el-button
                @click="onClear"
              >
                {{ $t('table.reset') }}
              </el-button>
              <el-button
                v-if="paySettlementType!==1"
                type="primary"
                @click="onSetUpHandle()"
              >
                <i class="el-icon-search" />提现设置
              </el-button>
            </el-form-item>
            <set-up
              v-if="dialogFormVisible"
              ref="setUpRef"
            />
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
              align="center"
              width="90"
            />
            <el-table-column
              prop="shopName"
              label="店铺名称"
              align="center"
            />
            <el-table-column
              prop="shopLogo"
              label="店铺logo"
              align="center"
            >
              <template #default="scope">
                <div class="table-cell-image">
                  <ImgShow :src="scope.row.shopLogo" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              label="提现金额"
              align="center"
            >
              <template #default="scope">
                <span>￥ {{ amount(scope.row.amount) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="paySettlementType!==1"
              prop="createTime"
              label="创建时间"
              align="center"
              min-width="180"
            />
            <el-table-column
              v-if="paySettlementType===1"
              prop="createTime"
              label="提现时间"
              align="center"
              min-width="180"
            />
            <el-table-column
              v-if="paySettlementType!==1"
              prop="auditingTime"
              label="审核时间"
              align="center"
              min-width="180"
            >
              <template #default="scope">
                <span>{{ scope.row.auditingTime || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="paySettlementType!==1"
              prop="platformAmount"
              label="审核状态"
              align="center"
            >
              <template #default="scope">
                <span>{{ [ '未通过','未审核','已通过'][scope.row.status+1] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="paySettlementType!==1"
              prop="operation"
              label="操作"
              align="center"
              fixed="right"
              min-width="110"
            >
              <template #default="scope">
                <el-button
                  v-if="scope.row.status === 0"
                  v-permission="['finance:shopWithdrawCash:audit']"
                  type="primary"
                  link
                  @click="onHandleAudit(scope.row.cashId)"
                >
                  审核
                </el-button>
                <el-button
                  v-else
                  type="primary"
                  link
                  @click="onHandleDetail(scope.row.cashId)"
                >
                  查看审核信息
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
    <add-or-update
      v-if="visible"
      ref="addOrUpdateRef"
      class="add-or-update"
      @refresh-data-list="onGetData"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import SetUp from './components/setUp.vue'
import { page } from '@/api/shop-withdraw-cash'
import Big from 'big.js'
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
const status = [{
  value: 0,
  label: '未审核'
}, {
  value: 1,
  label: '已通过'
}, {
  value: -1,
  label: '未通过'
}]
const amount = (value) => {
  if (value) {
    return new Big(value).div(100).toFixed(2)
  }
  return 0
}
onMounted(() => {
  onGetData()
})

// 获取列表数据
const dataFrom = ref({})
let tempSearchForm = null
const params = ref({
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)
const tableData = ref([])
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
// 查询
const onSubmit = (newData = false) => {
  onGetData(newData)
}
// 跳转到详情页
const addOrUpdateRef = ref(null)
const visible = ref(false)
const onHandleDetail = (cashId) => {
  visible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.onInit(cashId)
  })
}
const dialogFormVisible = ref(false)
const setUpRef = ref(null)
const onSetUpHandle = () => {
  dialogFormVisible.value = true
  nextTick(() => {
    setUpRef.value?.onOpen()
  })
}
// 清空查询 的表单
const onClear = () => {
  dataFrom.value = {
    status: '',
    shopName: ''
  }
}
const onHandleAudit = (cashId) => {
  visible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.onInit(cashId)
  })
}

</script>

<style lang="scss" scoped>
  .box {
    background: #F5F5F5;
    width: 100%;
    min-height: 100vh;
    .shop-withdraw-cash {
      background: #FFFFFF;
      width: 100%;
      padding: 24px;
    }
  }

</style>
