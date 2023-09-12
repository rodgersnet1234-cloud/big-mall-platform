<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.couponId? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
    top="4vh"
    class="coupon-dialog"
    width="700px"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="100px"
      @submit.prevent
    >
      <!-- 优惠券名称 -->
      <el-form-item
        :label="$t('coupon.coupon.couponName')"
        prop="couponName"
      >
        <el-input
          v-model="dataForm.couponName"
          maxlength="20"
          show-word-limit
          :placeholder="$t('coupon.coupon.couponName')"
          :disabled="dataForm.couponId !== 0"
        />
      </el-form-item>
      <!-- 优惠券副标题 -->
      <el-form-item
        :label="$t('coupon.coupon.subTitle')"
        prop="subTitle"
      >
        <el-input
          v-model="dataForm.subTitle"
          :placeholder="$t('coupon.coupon.subTitle')"
          :disabled="dataForm.couponId !== 0"
          maxlength="32"
          show-word-limit
        />
      </el-form-item>
      <!-- 优惠券投放状态(-1:取消投放 0:等待投放 1:投放 2:违规下架 3:等待审核) -->
      <el-form-item
        :label="$t('coupon.coupon.putonStatus')"
        prop="putonStatus"
      >
        <el-radio-group
          v-model="dataForm.putonStatus"
          :disabled="dataForm.couponId !== 0 && dataForm.status === 0 && (dataForm.putonStatus > 1 || dataForm.putonStatus === -1)"
        >
          <el-radio :label="0">
            自动投放
            <el-tooltip
              class="item"
              effect="light"
              placement="top"
            >
              <template #content>
                <div>系统会根据优惠券投放时间进行自动投放，投放后状态为投放</div>
              </template>
              <span>
                <i class="el-icon-question" />
              </span>
            </el-tooltip>
          </el-radio>
          <el-radio :label="1">
            投放
          </el-radio>
          <el-radio :label="4">
            暂不投放
          </el-radio>
          <el-radio
            disabled
            :label="-1"
          >
            取消投放
            <el-tooltip
              class="item"
              effect="light"
              placement="top"
            >
              <template #content>
                <div>当优惠券过期，优惠券状态为取消投放</div>
              </template>
              <span>
                <i class="el-icon-question" />
              </span>
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.putonStatus === 0"
        label="投放时间"
        prop="launchTime"
      >
        <el-date-picker
          v-model="dataForm.launchTime"
          value-format="YYYY-MM-DD"
          type="date"
          style="width:170px"
          placeholder="选择投放时间"
        />
        <el-time-select
          v-model="launchTimeValue"
          start="00:00"
          step="00:30"
          end="23:30"
          style="width:130px"
          placeholder="开始时间"
        />
      </el-form-item>
      <!-- 获取方式 0:直接领取 1:店铺发放 -->
      <el-form-item
        :label="$t('coupon.coupon.getWay')"
        prop="getWay"
      >
        <el-radio-group v-model="dataForm.getWay">
          <el-radio :label="0">
            {{ $t("coupon.coupon.receiveDirectly") }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("coupon.coupon.systemIssue") }}
            <el-tooltip
              class="item"
              effect="light"
              placement="top"
            >
              <template #content>
                <div>该优惠券不能在用户端被直接领取，系统需通过【会员-会员列表】处勾选指定会员发放此优惠券</div>
              </template>
              <span>
                <i class="el-icon-question" />
              </span>
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 优惠券类型 1:代金券 2:折扣券 3:兑换券 -->
      <el-form-item
        :label="$t('coupon.coupon.couponType')"
        prop="couponType"
      >
        <el-radio-group
          v-model="dataForm.couponType"
          :disabled="dataForm.couponId !== 0"
        >
          <el-radio :label="1">
            代金券
          </el-radio>
          <el-radio :label="2">
            折扣券
          </el-radio>
          <!-- <el-radio :label="3">兑换券</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <!-- 使用条件 -->
      <el-form-item
        :label="$t('coupon.coupon.cashCondition')"
        prop="cashCondition"
        class="amount"
      >
        <span class="strong-word">消费金额满</span>
        <el-input
          v-model="dataForm.cashCondition"
          :placeholder="$t('coupon.coupon.cashCondition')"
          type="number"
          max="9999999"
          :disabled="dataForm.couponId !== 0"
          style="width:300px; margin-left:8px"
          @change="cashConditionHand()"
        >
          <template #append>
            元
          </template>
        </el-input>
      </el-form-item>
      <!-- 减免金额 -->
      <el-form-item
        v-if="dataForm.couponType === 1"
        :label="$t('coupon.coupon.reduceAmount')"
        prop="reduceAmount"
      >
        <el-input
          v-model="dataForm.reduceAmount"
          :placeholder="$t('coupon.coupon.reduceAmount')"
          type="number"
          :max="99999"
          :min="0.01"
          :disabled="dataForm.couponId !== 0"
          style="width:300px"
          @blur="reduceAmountHand()"
        >
          <template #append>
            元
          </template>
        </el-input>
      </el-form-item>
      <!-- 折扣额度 -->
      <el-form-item
        v-if="dataForm.couponType === 2"
        :label="$t('coupon.coupon.couponDiscount')"
        prop="couponDiscount"
      >
        <el-input
          v-model="dataForm.couponDiscount"
          :placeholder="$t('coupon.coupon.couponDiscount')"
          type="number"
          :disabled="dataForm.couponId !== 0"
          style="width:300px"
          @change="couponDiscountHand()"
        >
          <template #append>
            折
          </template>
        </el-input>
      </el-form-item>
      <!-- 生效时间 1:固定时间 2:领取后生效 -->
      <el-form-item
        :label="$t('coupon.coupon.validTimeType')"
        prop="validTimeType"
      >
        <el-radio-group
          v-model="dataForm.validTimeType"
          :disabled="dataForm.couponId !== 0"
        >
          <el-radio :label="1">
            固定时间
          </el-radio>
          <el-radio :label="2">
            领取后生效
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 固定时间数据 START -->
      <div v-if="dataForm.validTimeType === 1">
        <el-form-item
          v-if="dataForm.validTimeType === 1"
          :label="$t('coupon.coupon.startTime')"
          prop="startTime"
        >
          <el-date-picker
            v-model="dataForm.startTime"
            :disabled="dataForm.couponId !== 0"
            value-format="YYYY-MM-DD"
            type="date"
            style="width:170px"
            placeholder="选择开始时间"
          />
          <el-time-select
            v-model="startTimeValue"
            start="00:00"
            step="00:30"
            end="23:30"
            style="width:130px"
            :disabled="dataForm.couponId !== 0"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item
          v-if="dataForm.validTimeType === 1"
          :label="$t('coupon.coupon.endTime')"
          prop="endTime"
        >
          <el-date-picker
            v-model="dataForm.endTime"
            value-format="YYYY-MM-DD"
            :disabled="dataForm.status === 0"
            type="date"
            style="width:170px"
            placeholder="选择结束时间"
          />
          <el-time-select
            v-model="endTimeValue"
            start="00:00"
            step="00:30"
            end="23:30"
            style="width:130px"
            placeholder="结束时间"
            :disabled="dataForm.status === 0"
          />
        </el-form-item>
      </div>
      <!-- 固定时间数据 END -->
      <!-- 领取后生效数据 START -->
      <el-form-item
        v-if="dataForm.validTimeType === 2"
        label="领券后"
        prop="afterReceiveDays"
      >
        <el-input
          v-model="dataForm.afterReceiveDays"
          type="number"
          :mix="0"
          :max="3652"
          oninput="if(value>3652)value=1"
          :disabled="dataForm.couponId !== 0"
          style="width:300px"
        >
          <template #append>
            天生效
          </template>
        </el-input>
        <el-tooltip
          class="item"
          effect="dark"
          content="最大不得超过10年，即3652天"
          placement="top"
        >
          <i class="el-icon-info" />
        </el-tooltip>
      </el-form-item>
      <el-form-item
        v-if="dataForm.validTimeType === 2"
        label="有效天数"
        prop="validDays"
      >
        <el-input
          v-model="dataForm.validDays"
          type="number"
          :mix="0"
          :max="3652"
          oninput="if(value>3652)value=1"
          :disabled="dataForm.couponId !== 0"
          style="width:300px"
        >
          <template #append>
            天
          </template>
        </el-input>
        <el-tooltip
          class="item"
          effect="dark"
          content="最大不得超过10年，即3652天"
          placement="top"
        >
          <i class="el-icon-info" />
        </el-tooltip>
      </el-form-item>
      <!-- 领取后生效数据 END -->
      <!-- 每个用户领券上限，如不填则默认为1 -->
      <el-form-item
        :label="$t('coupon.coupon.limitNum')"
        prop="limitNum"
      >
        <el-input
          v-model="dataForm.limitNum"
          type="number"
          :max="999999"
          style="width:300px"
          :disabled="dataForm.couponId !== 0 && dataForm.status === 0"
        >
          <template #append>
            张
          </template>
        </el-input>
      </el-form-item>
      <!-- 库存 -->
      <el-form-item
        :label="$t('coupon.coupon.stocks')"
        prop="stocks"
      >
        <el-input
          v-model="dataForm.stocks"
          type="number"
          :disabled="dataForm.couponId !== 0"
          :max="999999999"
          style="width:300px"
        >
          <template #append>
            张
          </template>
        </el-input>
      </el-form-item>
      <!-- 适用商品类型 0全部商品参与 1指定商品参与 -->
      <el-form-item
        :label="$t('coupon.coupon.suitableProdType')"
        prop="suitableProdType"
      >
        <el-radio-group v-model="dataForm.suitableProdType">
          <el-radio :label="0">
            全部商品参与
          </el-radio>
          <el-radio :label="1">
            指定商品参与
          </el-radio>
          <!-- <el-radio :label="2">指定商品不参与</el-radio> -->
        </el-radio-group>
        <div
          v-if="dataForm.suitableProdType === 1"
          class="select-pro"
        >
          <el-button @click="selectProds">
            选择商品
          </el-button>
        </div>
        <div v-if="dataForm.suitableProdType === 1 && dataForm.spuIds.length > 0">
          <el-card
            v-for="(item,index) in dataForm.spus"
            :key="index"
            :body-style="{ padding: '0px' }"
            style="height: 160px;width: 120px"
          >
            <!-- <img v-if="item.mainImgUrl" :src="(item.mainImgUrl).indexOf('http')===-1 ? resourcesUrl + item.mainImgUrl : item.mainImgUrl" style="height:104px;width:100%">
            <img v-if="!item.mainImgUrl" class="prod-img" src="~@/assets/images/def.png" style="height:104px;width:100%"> -->
            <ImgShow
              :src="item.mainImgUrl"
              :img-style="{height: '104px', width: '100%'}"
            />
            <div class="card-prod-bottom">
              <span class="card-prod-name">{{ item.spuName }}</span>
              <el-button
                link
                type="primary"
                class="card-prod-name-button"
                @click="deleteCurrentProd(index)"
              >
                删除
              </el-button>
            </div>
          </el-card>
        </div>
        <prods-select
          v-if="prodSelectVisible"
          ref="prodSelectRef"
          :is-single="false"
          @refresh-select-prods="getSelectedProd"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="visible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/coupon/coupon'
import ProdsSelect from '@/components/prods-select/index.vue'
import Big from 'big.js'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataForm = reactive({
  couponId: 0,
  shopId: null,
  couponName: '',
  subTitle: '',
  couponType: 1,
  suitableProdType: 0,
  getWay: 0,
  validTimeType: 1,
  cashCondition: 1,
  reduceAmount: 1,
  couponDiscount: 9.9,
  startTime: null,
  endTime: null,
  launchTime: null,
  afterReceiveDays: 0,
  validDays: 1,
  totalStock: 1,
  stocks: 1,
  limitNum: 1,
  status: null,
  putonStatus: 0,
  version: null,
  spus: [], // 商品列表
  spuIds: [] // 商品ids
})
let isSubmit = false
const prodSelectVisible = ref(false)
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const validateNumber = (rule, value, callback) => {
  if (!/^[1-9]\d*$/.test(Number(value))) {
    callback(new Error('请输入大于0的整数'))
  } else if (value >= 2147483600) {
    callback(new Error('请输入一个小于2147483600的数'))
  } else {
    callback()
  }
}
const validateStocks = (rule, value, callback) => {
  if (value === 0 && dataForm.couponId) {
    callback()
  } else if (!/^[1-9]\d*$/.test(Number(value))) {
    callback(new Error('请输入大于0的整数'))
  } else if (value >= 2147483600) {
    callback(new Error('请输入一个小于2147483600的数'))
  } else {
    callback()
  }
}
const validateeDays = (rule, value, callback) => {
  if (!/^[0-9]\d*$/.test(value)) {
    callback(new Error('请输入大于等于0的整数'))
  } else {
    callback()
  }
}
const validateeOneDays = (rule, value, callback) => {
  if (!/^[1-9]\d*$/.test(Number(value))) {
    callback(new Error('请输入大于等于1的整数'))
  } else {
    callback()
  }
}

const validateTime = (rule, value, callback) => {
  if (rule.field === 'startTime' && (!startTimeValue || !dataForm.startTime)) {
    callback(new Error('开始时间不能为空'))
  }
  if (rule.field === 'endTime' && (!endTimeValue || !dataForm.endTime)) {
    callback(new Error('结束时间不能为空'))
  }
  const endTime = dataForm.endTime + ' ' + endTimeValue + ':00'
  if (rule.field === 'endTime' && dataForm.couponId === 0 && new Date() > Date.parse(endTime)) {
    callback(new Error('结束时间不能小于当前时间'))
  } else {
    callback()
  }
}

const validateLaunchTime = (rule, value, callback) => {
  if (!launchTimeValue) {
    callback(new Error('投放时间不能为空'))
  }
  const launchTime = dataForm.launchTime + ' ' + launchTimeValue + ':00'
  if (dataForm.putonStatus === 0 && Date.parse(launchTime) <= Date.now()) {
    callback(new Error('投放时间不得小于当前时间'))
  } else {
    callback()
  }
}
const rules = reactive({
  couponName: [
    { required: true, message: '优惠券名称不能为空', trigger: 'blur' }
  ],
  couponType: [
    { required: true, message: '优惠券类型不能为空', trigger: 'blur' }
  ],
  reduceAmount: [
    { required: true, message: '减免金额不能为空', trigger: 'blur' }
  ],
  couponDiscount: [
    { required: true, message: '折扣额度不能为空', trigger: 'blur' }
  ],
  limitNum: [
    { required: true, message: '限领数量不能为空', trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ],
  afterReceiveDays: [
    { required: true, message: '领取后天数不能为空', trigger: 'blur' },
    { validator: validateeDays, trigger: 'blur' }
  ],
  validDays: [
    { required: true, message: '有效天数不能为空', trigger: 'blur' },
    { validator: validateeOneDays, trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始时间不能为空', trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ],
  cashCondition: [
    { required: true, message: '使用条件不能为空', trigger: 'blur' }
  ],
  validTimeType: [
    { required: true, message: '生效时间不能为空', trigger: 'blur' }
  ],
  stocks: [
    { required: true, message: '库存不能为空', trigger: 'blur' },
    { validator: validateStocks, trigger: 'blur' }
  ],
  suitableProdType: [
    { required: true, message: '适用商品类型不能为空', trigger: 'blur' }
  ],
  launchTime: [
    { required: true, message: '投放时间不能为空', trigger: 'blur' },
    { validator: validateLaunchTime, trigger: 'blur' }
  ]
})
const launchTimeValue = ref('')
const startTimeValue = ref('')
const endTimeValue = ref('')

watch(
  () => dataForm.validTimeType,
  (newValue) => {
    if (newValue === 2) {
      dataForm.startTime = null
      dataForm.endTime = null
    }
  },
  { deep: true }
)
const dataFormRef = ref(null)
const init = (couponId) => {
  dataForm.couponId = couponId || 0
  visible.value = true
  dataForm.afterReceiveDays = 0
  dataForm.validDays = 1
  isSubmit = false
  dataForm.spus = []
  dataForm.spuIds = []

  nextTick(() => {
    // dataFormRef.value?.resetFields()
    dataForm.validTimeType = 1
    const datetimeRange = getDateTimeRange()
    dataForm.launchTime = datetimeRange.startTime
    dataForm.startTime = datetimeRange.startTime
    dataForm.endTime = datetimeRange.endTime
    launchTimeValue.value = datetimeRange.currentTime
    startTimeValue.value = datetimeRange.currentTime
    endTimeValue.value = datetimeRange.currentTime
    if (!dataForm.couponId) {
      return
    }
    api.get(couponId).then(data => {
      Object.assign(dataForm, data)
      launchTimeValue.value = dataForm.launchTime ? dataForm.launchTime.substring(11, dataForm.launchTime.length - 3) : ''
      startTimeValue.value = dataForm.startTime ? dataForm.startTime.substring(11, dataForm.startTime.length - 3) : ''
      endTimeValue.value = dataForm.endTime ? dataForm.endTime.substring(11, dataForm.endTime.length - 3) : ''
      dataForm.launchTime = getParseTime(dataForm.launchTime, '{y}-{m}-{d}')
      dataForm.startTime = getParseTime(dataForm.startTime, '{y}-{m}-{d}')
      dataForm.endTime = getParseTime(dataForm.endTime, '{y}-{m}-{d}')
      dataForm.cashCondition = new Big(dataForm.cashCondition).div(100).toFixed()
      dataForm.reduceAmount = new Big(dataForm.reduceAmount).div(100).toFixed()
      dataForm.spus = data.spus || []
    })
  })
}

defineExpose({
  init
})
/**
 * 选择商品
 */
const prodSelectRef = ref('')
const selectProds = () => {
  prodSelectVisible.value = true
  // console.log(dataForm)
  if (dataForm.spus.length) {
    // console.log(true)
    const selectedProds = []
    for (const item of dataForm.spus) {
      selectedProds.push(item)
    }
    nextTick(() => {
      prodSelectRef.value?.init(selectedProds, { filterSup: true, indexImg: true })
    })
  } else {
    nextTick(() => {
      prodSelectRef.value?.init(null, { filterSup: true, indexImg: true })
    })
  }
}
/**
 * 优惠折扣
 */
const couponDiscountHand = () => {
  const couponDiscount = dataForm.couponDiscount
  dataForm.couponDiscount = !couponDiscount || couponDiscount < 0.01 ? 0.01 : couponDiscount >= 10 || parseFloat(couponDiscount).toFixed(2) >= 10 ? 9.99 : parseFloat(couponDiscount).toFixed(2)
}
/**
 * 减免金额
 */
const reduceAmountHand = () => {
  // const reduceAmount = dataForm.reduceAmount
  // dataForm.reduceAmount = !reduceAmount || reduceAmount < 0.01 ? 0.01 : (parseFloat(reduceAmount).toFixed(2) > 9999999 ? 9999999 : parseFloat(reduceAmount).toFixed(2))
  const reduceAmount = parseFloat(dataForm.reduceAmount)
  dataForm.reduceAmount = formatNumber(reduceAmount)
}
// 格式化输入的优惠券减免金额
const formatNumber = (number) => {
  number = parseFloat(number.toFixed(2))
  if (!number) {
    return
  }
  const maxNumber = 99999.99
  if (number >= maxNumber) {
    return maxNumber
  }
  if (number < 0.01) {
    return 0.01
  }
  return number
}
/**
 * 使用条件
 */
const cashConditionHand = () => {
  const cashCondition = dataForm.cashCondition
  dataForm.cashCondition = !cashCondition || cashCondition < 0.01 ? 0.01 : parseFloat(cashCondition).toFixed(2)
  if (!parseFloat(cashCondition).toFixed(2)) {
    dataForm.cashCondition = 1
  }
}
/**
 * 开始时间
 */
const startTimeHand = () => {
  dataForm.startTime = timeHand(dataForm.startTime)
}
/**
 * 结束时间
 */
const endTimeHand = () => {
  dataForm.endTime = timeHand(dataForm.endTime)
}
/**
 * 时间处理
 */
const timeHand = (time) => {
  if (!time) {
    return null
  }
  const timeArray = time.split(':')
  return timeArray[0] + ':00:00'
}
/**
 * 选择商品组件返回
 */
const getSelectedProd = (prods) => {
  dataForm.spus = []
  dataForm.spuIds = []
  prods.forEach(prod => {
    dataForm.spus.push(prod)
    dataForm.spuIds.push(prod.spuId)
  })
  // 去重
  // dataForm.spus = removeDuplication(dataForm.spus, 'spuId')
  // dataForm.spuIds = Array.from(new Set(dataForm.spuIds))
}
/**
 * 删除商品
 */
const deleteCurrentProd = (index) => {
  dataForm.spus.splice(index, 1)
  dataForm.spuIds.splice(index, 1)
}

/**
 * 去重
 */
const removeDuplication = (items, validKey) => {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i][validKey] === items[j][validKey]) {
        items.splice(i, 1)
        j--
      }
    }
  }
  return items
}

/**
 * 表单提交
 */
const onSubmit = () => {
  const startDate = dataForm.startTime && startTimeValue.value ? dataForm.startTime + ' ' + startTimeValue.value + ':00' : ''
  const endDate = dataForm.endTime && endTimeValue.value ? dataForm.endTime + ' ' + endTimeValue.value + ':00' : ''
  if (Date.parse(startDate) >= Date.parse(endDate)) {
    ElMessage.error('开始时间不能小于或等于结束时间')
    return
  }
  dataFormRef.value?.validate(valid => {
    if (!valid || isSubmit) {
      return
    }
    const launchTime = dataForm.launchTime
    const startTime = dataForm.startTime
    const endTime = dataForm.endTime
    dataForm.launchTime = dataForm.launchTime && launchTimeValue.value ? dataForm.launchTime + ' ' + launchTimeValue.value + ':00' : ''
    dataForm.startTime = startDate
    dataForm.endTime = endDate
    isSubmit = true
    const data = JSON.parse(JSON.stringify(dataForm))
    data.cashCondition = new Big(data.cashCondition).times(100).toFixed()
    data.reduceAmount = new Big(data.reduceAmount).times(100).toFixed()
    const request = dataForm.couponId ? api.update(data) : api.save(data)
    request.then(data => {
      isSubmit = false
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    }).catch(e => {
      console.log(e)
      isSubmit = false
    })
    dataForm.launchTime = launchTime
    dataForm.startTime = startTime
    dataForm.endTime = endTime
  })
}

</script>

<style lang="scss" scope>
.coupon-dialog {
  .el-dialog {
    margin-bottom: 25px;
  }
  .el-dialog__body {
    padding: 30px !important;
  }
  .el-form-item--medium .el-form-item__label {
    text-align: right;
  }
  .strong-word {
    font-weight: bold;
  }
  .el-input-group > .el-input__inner {
    padding-right: 0;
  }
  // 错误提示
  .amount {
    .el-form-item__error {
      margin-left: 80px;
    }
  }
  // 商品
  .el-card {
    display: inline-block;
    margin-top: 10px;
    margin-right: 10px;
  }
  .card-prod-bottom {
    position: relative;
    text-align: left;
    top: -15px;
    .card-prod-name {
      margin: auto;
      padding: 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 118px;
      display: inline-block;
    }
    .card-prod-name-button {
      position: absolute;
      top: 30px;
      right: 0;
    }
    .el-button--medium {
      padding: 2px 6px !important;
    }
  }
}
.el-date-editor >>>.el-input__suffix>.el-icon-circle-close {
  display: none
}
.el-date-editor >>>.el-input__suffix>.el-icon-circle-check {
  display: none
}
</style>
