<template>
  <!-- 会员贡献价值分析 -->
  <div class="page-member-analysis component-member-contribution-value-analysis">
    <div class="board-title">
      会员贡献价值分析
    </div>

    <!-- 选项 -->
    <!-- 复选框选项组 -->
    <div class="checkbox-options-group">
      <!-- 选项 -->
      <div class="data-radio">
        <el-form>
          <el-form-item label="基础指标：">
            <el-checkbox-group v-model="form.saleIndex">
              <!-- 浏览访问 -->
              <el-checkbox
                label="累计会员数"
                name="saleIndex"
                checked
              >
                累计会员数
              </el-checkbox>
              <el-checkbox
                label="累计会员占比"
                name="saleIndex"
                checked
              >
                累计会员占比
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="成交指标：">
            <el-checkbox-group v-model="form.serviceIndex">
              <!-- 引导转化 -->
              <el-checkbox
                label="成交会员数"
                name="saleIndex"
                checked
              >
                成交会员数
              </el-checkbox>
              <el-checkbox
                label="成交会员占比"
                name="saleIndex"
                checked
              >
                成交会员占比
              </el-checkbox>
              <el-checkbox
                label="支付订单数"
                name="saleIndex"
                checked
              >
                支付订单数
              </el-checkbox>
              <el-checkbox
                label="客单价"
                name="saleIndex"
              >
                客单价
              </el-checkbox>
              <el-checkbox
                label="支付金额"
                name="saleIndex"
              >
                支付金额
              </el-checkbox>
              <el-checkbox
                label="支付金额占比"
                name="saleIndex"
              >
                支付金额占比
              </el-checkbox>
              <el-checkbox
                label="人均消费频次"
                name="saleIndex"
              >
                人均消费频次
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div class="check-list">
          <span id="maxSelectSpan">最多选择8项</span>&nbsp;已选择<span class="mark">&nbsp;{{ selectNum }}&nbsp;</span>/8&nbsp;个指标
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-box">
      <el-table
        :data="tableData5"
        header-cell-class-name="table-header"
        row-class-name="table-row"
      >
        <el-table-column
          highlight-current-row="true"
          fixed
          prop="custType"
          label="客户类型"
        />
        <el-table-column
          v-if="isVisible1"
          prop="totalMember"
          label="累计会员数"
        />
        <el-table-column
          v-if="isVisible2"
          prop="totalMemberRate"
          label="累计会员占比"
        />
        <el-table-column
          v-if="isVisible3"
          prop="payMemberNum"
          label="成交会员数"
        />
        <el-table-column
          v-if="isVisible4"
          prop="payMemberNumRate"
          label="成交会员占比"
        />
        <el-table-column
          v-if="isVisible5"
          prop="payOrderNum"
          label="支付订单数"
        />
        <el-table-column
          v-if="isVisible6"
          prop="pricePerMember"
          label="客单价"
        />
        <el-table-column
          v-if="isVisible7"
          prop="payAmount"
          label="支付金额"
        />
        <el-table-column
          v-if="isVisible8"
          prop="payAmountRate"
          label="支付金额占比"
        />
        <el-table-column
          v-if="isVisible9"
          prop="frequencyOfConsume"
          label="人均消费频次"
        />
      </el-table>
    </div>

    <!-- 数据分析思路 -->
    <div class="data-analysis-ideas">
      <img
        src="@/assets/icon/data-nalysis-ideas@2x.png"
        class="left-icon"
        alt
      >
      <div class="txt">
        <p>数据分析思路</p>
        <p>
          会员等级数据分析，可以观察一段时间内各个会员等级的客户数成交数据情况，会员数量越多，并且支付金额越高，说明店铺会员贡献度越高，可以采取给会员发放 <el-link
            type="primary"
            href="javascript: void();"
          >
            优惠券
          </el-link> 或者 <el-link
            type="primary"
            href="javascript: void();"
          >
            会员成交任务
          </el-link> ，从而提升会员的贡献价值。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/data-analysis/member-analysis.js'

const props = defineProps({
  boardType: {
    type: String,
    default: ''
  },
  timeType: {
    type: [Number, String],
    default: ''
  },
  dateRange: {
    type: Array,
    default: () => {
      return []
    }
  },
  startTimePar: {
    type: String,
    default: ''
  },
  endTimePar: {
    type: String,
    default: ''
  }
})

let dateType = 1
watch(() => props.dateRange, () => {
  dateType = props.timeType
  // 会员概览后台数据
  getMemberContributeData()
})

const form = reactive({
  saleIndex: [], // 基础指标
  serviceIndex: [] // 成交指标
})
const selectNum = ref(0) // 选择指标的数量
const sumData = ref([]) // 所有指标
watch(() => form, () => {
  selectNum.value = form.saleIndex.length + form.serviceIndex.length
  // sumData是用来存放点击选中的文本框信息
  sumData.value = []
  sumData.value = sumData.value.concat(form.saleIndex).concat(form.serviceIndex)
  const checks = document.getElementsByName('saleIndex')
  const span = document.getElementById('maxSelectSpan')
  if (selectNum.value >= 8) {
    textShare(span, 'red')
    checks.forEach(i => {
      if (!i.checked) {
        i.setAttribute('disabled', 'true')
      }
    })
  }
  if (selectNum.value < 8) {
    textShare(span, 'grey')
    checks.forEach(i => {
      i.removeAttribute('disabled')
    })
  }
}, { deep: true })

watch(() => sumData.value, () => {
  // 会员概览后台数据
  changVisibles()
}, { deep: true })

onMounted(() => {
  dateType = props.timeType
  changVisibles()
})

const tableData5 = ref([])
const tableLabel = [
  {
    custType: '全部免费等级会员'
  },
  {
    custType: '全部付费会员'
  }
]
const getMemberContributeData = () => {
  let startTime
  let endTime
  if (props.dateRange && props.dateRange.length > 0) {
    startTime = props.dateRange[0]
    endTime = props.dateRange[1]
  } else {
    startTime = props.startTimePar
    endTime = props.endTimePar
  }
  const param = {
    dateType,
    startTime,
    endTime
  }
  api.getMemberContributeValue(param).then(data => {
    if (data) {
      data.publicMember.custType = tableLabel[0].custType
      data.paidMember.custType = tableLabel[1].custType
      tableData5.value = []
      tableData5.value.push(data.publicMember)
      tableData5.value.push(data.paidMember)
      tableData5.value.forEach(i => {
        i.payMemberNumRate = (i.payMemberNumRate * 100).toFixed(2) + '%'
        i.totalMemberRate = (i.totalMemberRate * 100).toFixed(2) + '%'
      })
    }
  })
}

const isVisible1 = ref(true)
const isVisible2 = ref(true)
const isVisible3 = ref(true)
const isVisible4 = ref(true)
const isVisible5 = ref(true)
const isVisible6 = ref(false)
const isVisible7 = ref(false)
const isVisible8 = ref(false)
const isVisible9 = ref(false)
/**
 * 控制表格列显隐
 */
const changVisibles = () => {
  isVisible1.value = judgeStrArrIncludeOtherString('累计会员数')
  isVisible2.value = judgeStrArrIncludeOtherString('累计会员占比')
  isVisible3.value = judgeStrArrIncludeOtherString('成交会员数')
  isVisible4.value = judgeStrArrIncludeOtherString('成交会员占比')
  isVisible5.value = judgeStrArrIncludeOtherString('支付订单数')
  isVisible6.value = judgeStrArrIncludeOtherString('客单价')
  isVisible7.value = judgeStrArrIncludeOtherString('支付金额')
  isVisible8.value = judgeStrArrIncludeOtherString('支付金额占比')
  isVisible9.value = judgeStrArrIncludeOtherString('人均消费频次')
}

const judgeStrArrIncludeOtherString = (str) => {
  return sumData.value.includes(str)
}

/**
 * 文字效果
 */
const textShare = (div, color) => {
  div.style.color = color
}

</script>

<style lang="scss" scoped>
.page-member-analysis.component-member-contribution-value-analysis {
  // 表格
  :deep(.table-box) {
    margin: 20px 0;
    .table-header {
      height: 60px;
    }
    .table-row {
      height: 56px;
    }
  }
  .checkbox-options-group{
    // 选项
    .data-radio {
      display: block;
      padding: 30px 25px;
      font-size: 14px;
      background: #f7f8fa;
      .check-list {
        display: block;
        margin-top: 30px;
        margin-left: 70px;
        font-size: 12px;
        color: #999;
        .mark {
          color: #155bd4;
          font-weight: bold;
        }
      }
    }
  }
  // 数据分析思路
  .data-analysis-ideas {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #f7f8fa;
    padding: 20px;
    .left-icon {
      display: block;
      width: 52px;
      height: 52px;
      margin-right: 20px;
    }
    :deep(.txt) {
      font-size: 14px;
      color: #333;
      line-height: 1.5em;
      p {
        margin: 0;
      }
      p:first-child {
        font-size: 16px;
        margin-bottom: 8px;
      }
      p:last-child {
        color: #666;
      }
      .el-link.el-link--primary {
        color: #155bd4;
      }
    }
  }
}
</style>
