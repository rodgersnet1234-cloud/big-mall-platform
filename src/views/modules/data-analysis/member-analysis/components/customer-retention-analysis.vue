<template>
  <!-- 客户留存分析 -->
  <div class="customer-profile component-customer-retention-analysis">
    <!-- 标题栏 -->
    <div class="data-analysis title-bar">
      <div class="module-title">
        <div class="tit-lf">
          {{ title }}
        </div>
        <div class="tit-rg">
          <div class="statistics-time">
            <span>统计时间：</span>
            <el-select
              v-model="rangeValue"
              placeholder="请选择"
              @change="setDateRange(rangeValue)"
            >
              <el-option
                v-for="item in rangeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="date-display">
            {{ dateRange[0] }}{{ $t('date.tip') }}{{ dateRange[1] }}
          </div>
        </div>
      </div>
    </div>
    <!-- 选项卡 -->
    <el-tabs
      v-model="retainType"
      class="tabs"
      type="card"
    >
      <el-tab-pane
        label="访问留存"
        name="1"
      />
      <el-tab-pane
        label="成交留存"
        name="2"
      />
    </el-tabs>

    <!-- 表格 -->
    <div class="table-box">
      <div class="table">
        <el-table
          :data="dataList"
          border
        >
          <el-table-column
            v-if="retainType==='2'"
            fixed
            prop="currentMonth"
            label="成交时间"
            width="180"
          />
          <el-table-column
            v-if="retainType==='2'"
            prop="newCustomers"
            label="新成交客户数"
            width="180"
          />
          <el-table-column
            v-if="retainType==='1'"
            fixed
            prop="currentMonth"
            label="访问时间"
            width="180"
          />
          <el-table-column
            v-if="retainType==='1'"
            prop="newCustomers"
            label="新访问客户数"
            width="180"
          />

          <el-table-column
            v-if="1<=colLength"
            label="第1月留存"
          >
            <template #default="scope">
              <div>
                <p>{{ scope.row.firstMonthRemain }}</p>
                <p v-if="scope.row.firstMonthRemainRate !== null">
                  {{ scope.row.firstMonthRemainRate }}%
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="2<=colLength"
            label="第2月留存"
          >
            <template #default="scope">
              <div>
                <p>{{ scope.row.secondMonthRemain }}</p>
                <p v-if="scope.row.secondMonthRemainRate !== null">
                  {{ scope.row.secondMonthRemainRate }}%
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="3<=colLength"
            label="第3月留存"
          >
            <template #default="scope">
              <div>
                <p>{{ scope.row.thirdMonthRemain }}</p>
                <p v-if="scope.row.thirdMonthRemain !== null">
                  {{ scope.row.thirdMonthRemainRate }}%
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="4<=colLength"
            label="第4月留存"
          >
            <template #default="scope">
              <div>
                <p>{{ scope.row.fourthMonthRemain }}</p>
                <p v-if="scope.row.fourthMonthRemain !== null">
                  {{ scope.row.fourthMonthRemainRate }}%
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="5<=colLength"
            label="第5月留存"
          >
            <template #default="scope">
              <div>
                <p>{{ scope.row.fifthMonthRemain }}</p>
                <p v-if="scope.row.fifthMonthRemain !== null">
                  {{ scope.row.fifthMonthRemainRate }}%
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="6<=colLength"
            label="第6月留存"
          >
            <template #default="scope">
              <div>
                <p>{{ scope.row.sixthMonthRemain }}</p>
                <p v-if="scope.row.sixthMonthRemainRate !== null">
                  {{ scope.row.sixthMonthRemainRate }}%
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/data-analysis/member-analysis.js'
import moment from 'moment'

const dateRange = ref([])

const title = ref('客户留存分析')
const rangeOptions = reactive([
  {
    label: '最近3个月',
    value: 1
  },
  {
    label: '最近6个月',
    value: 2
  },
  {
    label: '最近1年',
    value: 3
  }
])

const retainType = ref('1') // 1访问留存  2成交留
watch(() => retainType.value, () => {
  // 客户留存分析后台数据
  getMemberRetentionData()
})

// 时间范围
const rangeValue = ref(2) // 1最近1个月 2最近3个月 3最近6个月 4最近1年
onMounted(() => {
  setDateRange(rangeValue.value)
})

const colLength = ref(0)
const typeValue = ref(1) // 1月留存 2周留存 暂时不统计周留存
const dataList = ref([])
const getMemberRetentionData = () => {
  if (rangeValue.value === 1) {
    colLength.value = 2
  } else if (rangeValue.value === 2) {
    colLength.value = 5
  } else if (rangeValue.value === 3) {
    colLength.value = 6
  }
  const param = {
    dateType: rangeValue.value, // 1最近1个月 2最近3个月 3最近6个月 4最近1年
    retainType: retainType.value, // 1访问留存  2成交留存
    dateRetainType: typeValue.value, // 1月留存 2周留存 暂时不统计周留存
    startTime: dateRange.value[0], // yyyy-MM-dd HH:mm:ss
    endTime: dateRange.value[1] // yyyy-MM-dd HH:mm:ss
  }
  api.getCustomerRetained(param).then(data => {
    if (data) {
      dataList.value = data
    } else {
      dataList.value = []
    }
  })
}

const setDateRange = (val) => {
  let startDay = null
  if (val === 1) {
    startDay = -90
  }
  if (val === 2) {
    startDay = -180
  }
  if (val === 3) {
    startDay = -360
  }
  // 开始时间
  const startTime = moment().add(startDay, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
  // 结束时间
  const endTime = moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
  dateRange.value = [startTime, endTime]
  getMemberRetentionData()
}

</script>

<style lang="scss" scoped>
.component-customer-retention-analysis {
  // 数据分析板块标题栏
  .data-analysis.title-bar {
    // 板块标题栏
    .module-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f7f8fa;
      padding: 16px 10px;
      .tit-lf {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 17px;
        font-weight: bold;
        padding-left: 6px;
        color: #333;
      }
      .tit-lf::before {
        display: block;
        content: '';
        width: 3px;
        height: 16px;
        background: #155bd4;
        margin-right: 5px;
        border-radius: 8px;
      }
      .tit-rg {
        display: flex;
        align-items: center;
        font-size: 14px;
        :deep(.statistics-time) {
          margin-right: 10px;
          .select-mod {
            width: 120px;
          }
        }
        .date-display {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  .customer-profile.customer-retention-analysis {
    // 选项卡
    :deep(.tabs) {
      margin-top: 20px;
      .el-tabs__item.is-active {
        color: #155bd4;
      }
      .el-tabs__item:hover {
        color: #155bd4;
      }
    }
    // 表格
    :deep(.table-box) {
      margin-bottom: 20px;
      margin-top: 15px;
      font-size: 14px;
      .el-table {
        border: 1px solid #EAF0F4;
        border-bottom: none;
        th.is-leaf, td {
          border-color: #EAF0F4;
        }
        .has-gutter {
          tr, th {
            background: #f7f8fa;
          }
          .cell {
            color: #000;
            font-weight: bold;
          }
        }
        tr {
          height: 56px;
        }
      }
      .el-table .cell {
        color: #666;
      }
    }
  }
}
</style>
