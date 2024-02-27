<template>
  <!-- 商品效果 -->
  <div class="page-product-insights component-product-effect">
    <!-- 标题栏 -->
    <title-bar :title="title" />

    <!-- 选项 -->
    <checkbox-options-group
      class="checkbox"
      :permission="'platform:prodEffect:export'"
      @handle-table="handleTable"
      @get-time-list="getTimeList"
      @export-from="exportFrom"
      @get-status-list="getStatusList"
      @get-group-list="getGroupList"
    />

    <!-- 文字说明 -->
    <div class="tips-text-part">
      <p class="tips">
        1.订单相关指标（如下单人数）以下单时间统计，支付相关指标（如支付人数）以支付成功时间统计（拼团订单成团算支付）。订单查询页面根据下单时间查询对应订单，若顾客当日下单，次日支付，则下单与支付数据会有一天时间差，请注意区分！
      </p>
      <p class="tips">
        2.选择自然周、自然月、近7天、近30天时，人数在所选时间内去重。
      </p>
    </div>

    <!-- 表格 -->
    <div class="table-box">
      <div class="tips">
        已隐藏无数据的商品
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="sourceType"
            class="table-item"
            label="商品信息"
            min-width="200px"
          >
            <template #default="scope">
              <div
                class="prod-box"
                @click="handleShowProdDetailPop(scope.row.spuId)"
              >
                <img-show
                  :src="scope.row.spuUrl"
                  :width="60"
                  :height="60"
                  :class-list="['prod-img']"
                />
                <div class="prod-info">
                  <p class="prod-name">
                    {{ scope.row.spuName }}
                  </p>
                  <p class="prod-pri">
                    ￥{{ onToPrice(scope.row.price) }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(0)"
            prop="expose"
            class="table-item"
            label="曝光次数"
            align="center"
            sortable
            :index="0"
          >
            <template #default="scope">
              <span>{{ scope.row.expose !== null ? scope.row.expose : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(1)"
            prop="exposePersonNum"
            class="table-item"
            label="曝光人数"
            align="center"
            :index="1"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.exposePersonNum !== null ? scope.row.exposePersonNum : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(2)"
            prop="addCartPerson"
            class="table-item"
            label="加购人数"
            align="center"
            :index="2"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.addCartPerson !== null ? scope.row.addCartPerson : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(3)"
            prop="addCart"
            class="table-item"
            label="加购件数"
            align="center"
            :index="3"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.addCart !== null ? scope.row.addCart : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(4)"
            prop="placeOrderPerson"
            class="table-item"
            align="center"
            label="下单人数"
            :index="4"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.placeOrderPerson !== null ? scope.row.placeOrderPerson : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(5)"
            prop="payPerson"
            class="table-item"
            align="center"
            label="支付人数"
            :index="5"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.payPerson !== null ? scope.row.payPerson : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(6)"
            prop="placeOrderNum"
            class="table-item"
            align="center"
            label="下单件数"
            :index="6"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.placeOrderNum !== null ? scope.row.placeOrderNum : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(7)"
            prop="payNum"
            class="table-item"
            align="center"
            label="支付件数"
            :index="7"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.payNum !== null ? scope.row.payNum : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(8)"
            prop="placeOrderAmount"
            class="table-item"
            align="center"
            label="下单金额"
            :index="8"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.placeOrderAmount !== null ? scope.row.placeOrderAmount : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(9)"
            prop="payAmount"
            class="table-item"
            align="center"
            label="支付金额"
            :index="9"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.payAmount !== null ? scope.row.payAmount : 0 }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="showTableColumn(10)"
            prop="refundNum"
            class="table-item"
            label="申请退款订单数"
            align="center"
            sortable
            :index="10"
            min-width="120"
          >
            <template #default="scope">
              <span>{{ scope.row.refundNum !== null ? scope.row.refundNum : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(11)"
            prop="refundPerson"
            class="table-item"
            label="申请退款人数"
            align="center"
            :index="11"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.refundPerson !== null ? scope.row.refundPerson : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(12)"
            prop="refundSuccessNum"
            class="table-item"
            label="成功退款订单数"
            align="center"
            sortable
            :index="12"
            min-width="120"
          >
            <template #default="scope">
              <span>{{ scope.row.refundSuccessNum !== null ? scope.row.refundSuccessNum : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(13)"
            prop="refundSuccessPerson"
            class="table-item"
            label="成功退款人数"
            align="center"
            :index="13"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.refundSuccessPerson !== null ? scope.row.refundSuccessPerson : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(14)"
            prop="refundSuccessAmount"
            class="table-item"
            label="成功退款金额"
            align="center"
            :index="14"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.refundSuccessAmount !== null ? scope.row.refundSuccessAmount : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn(15)"
            prop="refundSuccessRate"
            class="table-item"
            label="退款率"
            align="center"
            :index="15"
            sortable
          >
            <template #default="scope">
              <span>{{ scope.row.refundSuccessRate !== null ? scope.row.refundSuccessRate : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            class="table-item"
            label="操作"
          >
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="onHandleClick(scope.row)"
              >
                趋势图分析
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页条 -->
      <pagination
        :page="params.pageNum"
        :limit="params.pageSize"
        :total="total"
        @pagination="paginationChange"
      />
    </div>

    <prod-details
      v-if="prodDetailsVisible"
      ref="prodDetailsRef"
    />

    <!--  趋势图分析弹窗  -->
    <el-dialog
      v-model="trendVisible"
      title="商品趋势分析"
      width="40%"
    >
      <el-main v-loading="showLoading">
        <common-chart
          :options="prodSurveyChart"
          style="width: 100%; height: 300px;"
        />
      </el-main>
    </el-dialog>
  </div>
</template>

<script setup>
import titleBar from '../../public-components/title-bar.vue'
import checkboxOptionsGroup from './checkbox-options-group.vue'
import prodDetails from '@/views/modules/product/list/components/prod-details/index.vue'
import { list, soldExcel, getSingleProdTrend } from '@/api/data-analysis/product-effect.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import Big from 'big.js'
import moment from 'moment'

const title = ref('商品洞察')

const params = reactive({
  pageNum: 1,
  pageSize: 10,
  dateType: 5,
  status: 0,
  group: 0,
  startTime: '',
  endTime: ''
})

onMounted(() => {
  initTime()
})
const initTime = () => {
  params.startTime = moment().add(-7, 'd').format('YYYY-MM-DD HH:mm:ss')
  params.endTime = moment().format('YYYY-MM-DD HH:mm:ss')
}

let tabelList = []
const showTableColumn = computed(() => {
  return function (index) {
    return tabelList.indexOf(index) !== -1
  }
})

const sortChange = (data) => {
  if (data.order) {
    // 排序参数
    params.sortParam = data.column.index
  } else {
    params.sortParam = ''
  }

  // 排序类型  1正序  0倒序
  switch (data.order) {
    case 'descending': params.sortType = 0
      break
    case 'ascending': params.sortType = 1
      break
    default: params.sortType = ''
      break
  }
  getData()
}

const paginationChange = (page) => {
  params.pageNum = page.pageNum
  params.pageSize = page.pageSize
  getData()
}

const tableData = ref([])
// 查询的参数
const total = ref(0)
// 请求数据
const getData = () => {
  list(params).then(data => {
    tableData.value = data.list
    total.value = data.total
  })
}

// 导出
const exportFrom = () => {
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    soldExcel(params).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '商品洞察.xlsx'

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
    }).catch((e) => {
      ElMessage.error(e)
    })
  })
}
// 根据checkList 显示某一列
const handleTable = (checkList) => {
  tabelList = checkList
}
// 根据时间获取
const getTimeList = (param) => {
  params.dateType = param.value
  params.startTime = param.startTime
  params.endTime = param.endTime
  getData()
}
// 根据状态获取
const getStatusList = (status) => {
  params.status = status
  getData()
}
// 根据状态获取
const getGroupList = (group) => {
  params.group = group
  getData()
}

const prodDetailsVisible = ref(false) // 商品详情
const prodDetailsRef = ref(null) // 商品详情
/**
 * 展示商品详情
 */
// 跳转发布商品页
const handleShowProdDetailPop = (spuId) => {
  prodDetailsVisible.value = true
  setTimeout(() => {
    prodDetailsRef.value.init(spuId)
  }, 500)
}

// 处理价格显示
const onToPrice = (price) => {
  Big.DP = 2
  return new Big(price).div(100).toFixed(2)
}

// 单个商品趋势弹窗
const trendVisible = ref(false)
const showLoading = ref(false)
const onHandleClick = (row) => {
  trendVisible.value = true
  showLoading.value = true
  onSingleProdTrendData(row.spuId)
}

const prodSurveyChart = ref({})
/**
 * 单个商品的趋势图
 */
let dateArr = [564, 324, 234, 123] // 趋势图时间数组
let seriesDataArr = [] // 趋势图数据
const onGetRealTimechartData = () => {
  prodSurveyChart.value = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['浏览量', '访客数', '付款人数', '付款商品件数']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateArr,
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: seriesDataArr
  }
  showLoading.value = false
}
/**
 * 获取单个商品的趋势图数据
 */
const onSingleProdTrendData = (spuId) => {
  showLoading.value = true
  getSingleProdTrend({
    spuId,
    startTime: params.startTime,
    endTime: params.endTime
  }).then(data => {
    dateArr = []
    seriesDataArr = []
    const obj1 = onInitObj('浏览量')
    const obj2 = onInitObj('访客数')
    const obj3 = onInitObj('付款人数')
    const obj4 = onInitObj('付款商品件数')
    data.forEach(i => {
      dateArr.push(i.currentDay)
      obj1.data.push(i.browse)
      obj2.data.push(i.visitor)
      obj3.data.push(i.payPerson)
      obj4.data.push(i.payNum)
    })
    seriesDataArr.push(obj1)
    seriesDataArr.push(obj2)
    seriesDataArr.push(obj3)
    seriesDataArr.push(obj4)
    onGetRealTimechartData()
  })
}
/**
 * 初始化一个obj
 */
const onInitObj = (name) => {
  const obj = {}
  obj.name = name
  obj.type = 'line'
  obj.smooth = true
  obj.data = []
  return obj
}

</script>

<style lang="scss" scoped>
.page-product-insights.component-product-effect {
  .checkbox {
    margin-top: 20px;
  }

  // 相关说明文字提示
  .tips-text-part {
    display: block;
    width: 100%;
    background: #fffcf2;
    border: 1px solid #F6C023;
    padding: 15px;
    font-size: 12px;
    color: #666;
    line-height: 1.5em;
    margin-top: 15px;
    margin-bottom: 20px;
    p {
      margin: 0;
      line-height: 1.5em;
    }
    p:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  // 表格
  .table-box {
    margin-bottom: 20px;
    .tips {
      font-size: 12px;
      color: #666;
    }
    .table {
      margin-top: 15px;
      font-size: 14px;
      :deep(.prod-box) {
        .prod-img {
          flex-shrink: 0;
          display: block;
          margin-right: 10px;
        }
      }
      // 商品信息
      .prod-box {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        cursor: pointer;
        width: 100%;
        .prod-info {
          p {
            margin: 0;
          }
          .prod-name {
            display: block;
            width: 100%;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.5em;
          }
          .prod-pri {
            font-size: 12px;
            color: #FF4141;
          }
        }
      }
    }
  }
}
</style>
