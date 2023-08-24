<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="1000"
    @close="onCloseClear()"
  >
    <div class="edit-label-content">
      <div class="label-name-line currency-line">
        <div class="title">
          <span class="must-term">*</span>{{ $t('user.tag.labelName') }}
        </div>
        <div>
          <el-input
            v-model="labelName"
            type="text"
            maxlength="10"
            show-word-limit
          />
        </div>
      </div>
      <div class="label-type-line currency-line">
        <div class="title">
          <span class="must-term">*</span>{{ $t('user.tag.labelType') }}
        </div>
        <el-radio
          v-model="labelType"
          label="1"
          :disabled="isDisaCondiLabel"
        >
          {{ $t('user.tag.conditionLabel') }}
        </el-radio>
        <el-radio
          v-model="labelType"
          label="0"
          :disabled="isDisaCustLabel"
        >
          {{ $t('user.tag.manualLabel') }}
        </el-radio>
      </div>
      <div v-if="labelType==='1'">
        <div class="label-condition-title-line">
          {{ $t('user.tag.conditionSetting') }}<span class="tips">{{ $t('user.tag.conditionSettingTips') }}</span>
        </div>
        <div class="basic-condition-line currency-line">
          <div class="title">
            {{ $t('user.tag.basicCondition') }}
          </div>
          <div class="basic-set-content module-content">
            <div class="option-line">
              <el-checkbox
                v-model="isBeCustTimeChecked"
                @change="testingActivation(isBeCustTimeChecked, 0)"
              >
                {{ $t('user.tag.becomeCustomerTime') }}
              </el-checkbox>
              <el-select
                v-model="beCustTimeValue"
                :disabled="!isBeCustTimeChecked"
                :placeholder="$t('user.tag.pleaseSelect')"
              >
                <el-option
                  v-for="item in basicConOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click="onSelectToday(item.value, 0)"
                />
              </el-select>
              <div
                v-if="isBeCustTimeChecked"
                class="block"
              >
                <el-date-picker
                  v-model="beCustTimeRange"
                  type="daterange"
                  range-separator="-"
                  :start-placeholder="$t('user.tag.startDate')"
                  :end-placeholder="$t('user.tag.endDate')"
                  @change="onChagCustTimeRange(0)"
                />
              </div>
            </div>
            <div class="option-line">
              <el-checkbox
                v-model="isBeMemTimeChecked"
                @change="testingActivation(isBeMemTimeChecked, 2)"
              >
                {{ $t('user.tag.becomeMemberTime') }}
              </el-checkbox>
              <el-select
                v-model="beMemTimeValue"
                :disabled="!isBeMemTimeChecked"
                :placeholder="$t('user.tag.pleaseSelect')"
              >
                <el-option
                  v-for="item in basicConOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click="onSelectToday(item.value, 2)"
                />
              </el-select>
              <div
                v-if="isBeMemTimeChecked"
                class="block"
              >
                <el-date-picker
                  v-model="beMemTimeRange"
                  type="daterange"
                  range-separator="-"
                  :start-placeholder="$t('user.tag.startDate')"
                  :end-placeholder="$t('user.tag.endDate')"
                  @change="onChagCustTimeRange(2)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="transaction-condition-line currency-line">
          <div class="title">
            {{ $t('user.tag.tradingConditions') }}
          </div>
          <div class="deal-condition-content module-content">
            <div class="option-line">
              <el-checkbox v-model="isNearConTime">
                {{ $t('user.tag.nearConsuTime') }}
              </el-checkbox>
              <el-select
                v-model="nearConTimeValue"
                :disabled="!isNearConTime"
                :placeholder="$t('user.tag.pleaseSelect')"
              >
                <!-- nearConTimeOpts -->
                <el-option
                  v-for="item in dealConditionOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="option-line">
              <el-checkbox v-model="isConNum">
                {{ $t('user.tag.consuNum') }}
              </el-checkbox>
              <el-select
                v-model="conNumValue"
                :disabled="!isConNum"
                :placeholder="$t('user.tag.pleaseSelect')"
              >
                <!-- conNumOpts -->
                <el-option
                  v-for="item in dealConditionOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div class="unit-wrapper first-iterm">
                <el-input
                  v-model="conNumBegInp"
                  type="number"
                  min="0"
                  max="100000"
                  :disabled="!isConNum"
                  class="cur-inp"
                  @change="onCheckNumber (1)"
                />
                <span class="unit">{{ $t('user.tag.bout') }}</span>
              </div>
              <span class="interval-line">-</span>
              <div class="unit-wrapper">
                <el-input
                  v-model="conNumEndInp"
                  type="number"
                  min="0"
                  max="100000"
                  :disabled="!isConNum"
                  class="cur-inp"
                  @change="onCheckNumber (2)"
                />
                <span class="unit">{{ $t('user.tag.bout') }}</span>
              </div>
            </div>
            <div class="option-line">
              <el-checkbox v-model="isConAmount">
                {{ $t('user.tag.consuAmount') }}
              </el-checkbox>
              <el-select
                v-model="conAmountValue"
                :disabled="!isConAmount"
                :placeholder="$t('user.tag.pleaseSelect')"
              >
                <!-- conAmountOpts -->
                <el-option
                  v-for="item in dealConditionOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div class="unit-wrapper first-iterm">
                <el-input
                  v-model="conAmountBegInp"
                  type="number"
                  min="0"
                  :disabled="!isConAmount"
                  class="cur-inp"
                  @change="onCheckNumber (3)"
                />
                <span class="unit">{{ $t('user.tag.yuan') }}</span>
              </div>
              <span class="interval-line">-</span>
              <div class="unit-wrapper">
                <el-input
                  v-model="conAmountEndInp"
                  type="number"
                  min="0"
                  :disabled="!isConAmount"
                  class="cur-inp"
                  @change="onCheckNumber (4)"
                />
                <span class="unit">{{ $t('user.tag.yuan') }}</span>
              </div>
            </div>
            <div class="option-line">
              <el-checkbox v-model="isOrderAverPrice">
                {{ $t('user.tag.averPri') }}
              </el-checkbox>
              <el-select
                v-model="orderAverPriceValue"
                :disabled="!isOrderAverPrice"
                :placeholder="$t('user.tag.pleaseSelect')"
              >
                <!-- orderAverPriceOpts -->
                <el-option
                  v-for="item in dealConditionOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div class="unit-wrapper first-iterm">
                <el-input
                  v-model="orderAverPriceBegInp"
                  type="number"
                  min="0"
                  :disabled="!isOrderAverPrice"
                  class="cur-inp"
                  @change="onCheckNumber (5)"
                />
                <span class="unit">{{ $t('user.tag.yuan') }}</span>
              </div>
              <span class="interval-line">-</span>
              <div class="unit-wrapper">
                <el-input
                  v-model="orderAverPriceEndInp"
                  type="number"
                  min="0"
                  :disabled="!isOrderAverPrice"
                  class="cur-inp"
                  @change="onCheckNumber (6)"
                />
                <span class="unit">{{ $t('user.tag.yuan') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="transaction-condition-line currency-line">
          <div class="title">
            {{ $t('user.tag.rechargeConditions') }}
          </div>
          <div class="deal-condition-content module-content">
            <div class="option-line">
              <el-checkbox v-model="isRecharNum">
                {{ $t('user.tag.rechargeNumber') }}
              </el-checkbox>
              <el-select
                v-model="recharNumValue"
                :disabled="!isRecharNum"
                :placeholder="$t('user.tag.pleaseSelect')"
              >
                <!-- recharNumOpts -->
                <el-option
                  v-for="item in dealConditionOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div class="unit-wrapper first-iterm">
                <el-input
                  v-model="recharNumBegInp"
                  type="number"
                  min="0"
                  :disabled="!isRecharNum"
                  class="cur-inp"
                  @change="onCheckNumber (9)"
                />
                <span class="unit">{{ $t('user.tag.bout') }}</span>
              </div>
              <span class="interval-line">-</span>
              <div class="unit-wrapper">
                <el-input
                  v-model="recharNumEndInp"
                  type="number"
                  min="0"
                  :disabled="!isRecharNum"
                  class="cur-inp"
                  @change="onCheckNumber (10)"
                />
                <span class="unit">{{ $t('user.tag.bout') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 按键 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
        >{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="preserveLabel"
        >{{ $t('table.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/user/user-tag.js'
import Big from 'big.js'
import { Debounce } from '@/utils/debounce.js'
import moment from 'moment'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshLabelList'])

const basicConOpts = [{ // 基础条件
  value: 0,
  label: $t('user.tag.today')
}, {
  value: 1,
  label: $t('user.tag.yesterday')
}, {
  value: 2,
  label: $t('user.tag.lastSevenDay')
}, {
  value: 3,
  label: $t('user.tag.lastThirtyDay')
}, {
  value: 4,
  label: $t('user.tag.thisMonth')
}, {
  value: 5,
  label: $t('user.tag.lastMonth')
}, {
  value: 6,
  label: $t('user.tag.customRange')
}]

const dealConditionOpts = [{ // 交易条件
  value: 1,
  label: $t('user.tag.today')
}, {
  value: 2,
  label: $t('user.tag.lastSevenDay')
}, {
  value: 3,
  label: $t('user.tag.lastFifteenDay')
}, {
  value: 4,
  label: $t('user.tag.lastThirtyDay')
}, {
  value: 5,
  label: $t('user.tag.lastFortyFiveDay')
}, {
  value: 6,
  label: $t('user.tag.lastSixtyDay')
}, {
  value: 7,
  label: $t('user.tag.lastNinetyDay')
}, {
  value: 8,
  label: $t('user.tag.lastOneHundredEightyDay')
}, {
  value: 0,
  label: $t('user.tag.unlimited')
}]

const beCustTimeValue = ref(0) // 成为客户时间
watch(beCustTimeValue, () => {
  onChangeTimeRan(0)
})
const followTimeValue = ref(0)
watch(followTimeValue, () => {
  onChangeTimeRan(1)
})
const beMemTimeValue = ref(0)
watch(beMemTimeValue, () => {
  onChangeTimeRan(2)
})
onMounted(() => {
  initPullSelOpts()
  onChangeTimeRan(0)
  onChangeTimeRan(1)
  onChangeTimeRan(2)
})
let userTagId = 0
// 弹出弹框
const title = ref($t('user.tag.addLabel'))
const dialogVisible = ref(false)
const isDisaCondiLabel = ref(false)
const isDisaCustLabel = ref(false)
const labelType = ref('1')

const onInit = (isUserTagId, tagType) => {
  // 重置数据
  onResetData()
  dialogVisible.value = true
  userTagId = isUserTagId
  if (tagType === 0) {
    isDisaCondiLabel.value = true
    labelType.value = '0'
    if (isUserTagId !== '') {
      title.value = $t('user.tag.editLabel')
      userTagId = isUserTagId
      onGetEditLabelDetail()
    } else {
      title.value = $t('user.tag.addLabel')
    }
  } else if (tagType === 1) {
    isDisaCustLabel.value = true
    labelType.value = '1'
    if (isUserTagId !== '') {
      title.value = $t('user.tag.editLabel')
      userTagId = isUserTagId
      onGetEditLabelDetail()
    } else {
      title.value = $t('user.tag.addLabel')
    }
  }
}
/**
 * 输入框的数据改变时，对值进行校验
 */
const conNumBegInp = ref('')
const conNumEndInp = ref('')
const conAmountBegInp = ref('')
const conAmountEndInp = ref('')
const orderAverPriceBegInp = ref('')
const orderAverPriceEndInp = ref('')
const recharNumBegInp = ref('')
const recharNumEndInp = ref('')
let recharAmountBegInp = ''
let recharAmountEndInp = ''

const onCheckNumber = (type) => {
  // 消费次数
  if (type === 1) {
    let BegNum = Math.round(parseInt(conNumBegInp.value))
    if (!BegNum) {
      BegNum = 0
    } else if (BegNum < 0) {
      BegNum = 0
    } else if (BegNum > 100000) {
      BegNum = 100000
    }
    conNumBegInp.value = BegNum
  }
  if (type === 2) {
    let endNum = Math.round(parseInt(conNumEndInp.value))
    if (!endNum) {
      endNum = 0
    } else if (endNum < 0) {
      endNum = 0
    } else if (endNum > 100000) {
      endNum = 100000
    }
    conNumEndInp.value = endNum
  }
  // 消费金额
  if (type === 3) {
    let conBegAmountNum = Math.round(parseFloat(conAmountBegInp.value).toFixed(2))
    if (!conBegAmountNum) {
      conBegAmountNum = 0
    } else if (conBegAmountNum < 0) {
      conBegAmountNum = 0
    } else if (conBegAmountNum >= 100000000) {
      conBegAmountNum = 100000000
    }
    conAmountBegInp.value = conBegAmountNum
  }
  if (type === 4) {
    let conEndAmountNum = Math.round(parseFloat(conAmountEndInp.value).toFixed(2))
    if (!conEndAmountNum) {
      conEndAmountNum = 0
    } else if (conEndAmountNum < 0) {
      conEndAmountNum = 0
    } else if (conEndAmountNum >= 100000000) {
      conEndAmountNum = 100000000
    }
    conAmountEndInp.value = conEndAmountNum
  }
  // 订单均价
  if (type === 5) {
    let ordAverPriceBegNum = Math.round(parseFloat(orderAverPriceBegInp.value).toFixed(2))
    if (!ordAverPriceBegNum) {
      ordAverPriceBegNum = 0
    } else if (ordAverPriceBegNum < 0) {
      ordAverPriceBegNum = 0
    } else if (ordAverPriceBegNum >= 100000000) {
      ordAverPriceBegNum = 100000000
    }
    orderAverPriceBegInp.value = ordAverPriceBegNum
  }
  if (type === 6) {
    let ordAverPriceEndNum = Math.round(parseFloat(orderAverPriceEndInp.value).toFixed(2))
    if (!ordAverPriceEndNum) {
      ordAverPriceEndNum = 0
    } else if (ordAverPriceEndNum < 0) {
      ordAverPriceEndNum = 0
    } else if (ordAverPriceEndNum >= 100000000) {
      ordAverPriceEndNum = 100000000
    }
    orderAverPriceEndInp.value = ordAverPriceEndNum
  }
  // 充值金额
  if (type === 7) {
    let reAmountBegNum = Math.round(parseFloat(recharAmountBegInp).toFixed(2))
    if (!reAmountBegNum) {
      reAmountBegNum = 0
    } else if (reAmountBegNum < 0) {
      reAmountBegNum = 0
    } else if (reAmountBegNum >= 100000000) {
      reAmountBegNum = 100000000
    }
    recharAmountBegInp = reAmountBegNum
  }
  if (type === 8) {
    let reAmountEndNum = Math.round(parseFloat(recharAmountEndInp).toFixed(2))
    if (!reAmountEndNum) {
      reAmountEndNum = 0
    } else if (reAmountEndNum < 0) {
      reAmountEndNum = 0
    } else if (reAmountEndNum >= 100000000) {
      reAmountEndNum = 100000000
    }
    recharAmountEndInp = reAmountEndNum
  }
  // 充值次数
  if (type === 9) {
    let recharBegNum = Math.round(parseInt(recharNumBegInp.value))
    if (!recharBegNum) {
      recharBegNum = 0
    } else if (recharBegNum < 0) {
      recharBegNum = 0
    } else if (recharBegNum > 100000) {
      recharBegNum = 100000
    }
    recharNumBegInp.value = recharBegNum
  }
  if (type === 10) {
    let recharEndNum = Math.round(parseInt(recharNumEndInp.value))
    if (!recharEndNum) {
      recharEndNum = 0
    } else if (recharEndNum < 0) {
      recharEndNum = 0
    } else if (recharEndNum > 100000) {
      recharEndNum = 100000
    }
    recharNumEndInp.value = recharEndNum
  }
}

const initPullSelOpts = () => {
}
// 获取单个标签的详情
let isRecharAmount = false
const labelName = ref('')
const isBeCustTimeChecked = ref(false)
const beCustTimeRange = ref('')
const isBeMemTimeChecked = ref(false) // 成为会员时间
const beMemTimeRange = ref('')
const isNearConTime = ref(false) // 最近消费时间
const nearConTimeValue = ref(1)
const isConNum = ref(false) // 消费次数
const conNumValue = ref(1)
const isConAmount = ref(false) // 消费金额
const conAmountValue = ref(1)
const isOrderAverPrice = ref(false)
const orderAverPriceValue = ref(1)
const isRecharNum = ref(false)
const recharNumValue = ref(1)
let isfollowTimeChecked = false
let followTimeRange = ''

const onGetEditLabelDetail = () => {
  api.get(userTagId).then(data => {
    if (labelType.value === '0') {
      labelName.value = data.tagName
    } else if (labelType.value === '1') {
      labelName.value = data.tagName
      // 成为客户时间
      if (data.registerMinTime !== null && data.registerMaxTime !== null) {
        const isBeCustTimeRange = []
        isBeCustTimeChecked.value = true
        beCustTimeValue.value = 6
        isBeCustTimeRange.push(data.registerMinTime)
        isBeCustTimeRange.push(data.registerMaxTime)
        beCustTimeRange.value = isBeCustTimeRange
      }
      // 关注时间
      if (data.subscribeMinTime !== null && data.subscribeMaxTime !== null) {
        const isFollowTimeRange = []
        isfollowTimeChecked = true
        followTimeValue.value = 6
        isFollowTimeRange.push(data.subscribeMinTime)
        isFollowTimeRange.push(data.subscribeMaxTime)
        followTimeRange = isFollowTimeRange
      }
      // 成为会员时间
      if (data.toBeMemberMinTime !== null && data.toBeMemberMaxTime !== null) {
        const isBeMemTimeRange = []
        isBeMemTimeChecked.value = true
        beMemTimeValue.value = 6
        isBeMemTimeRange.push(data.toBeMemberMinTime)
        isBeMemTimeRange.push(data.toBeMemberMaxTime)
        beMemTimeRange.value = isBeMemTimeRange
      }
      // 最近消费时间
      if (data.recentPurchaseTime !== null) {
        isNearConTime.value = true
        nearConTimeValue.value = data.recentPurchaseTime
      }
      // 消费次数
      if (data.purchaseNumTime !== null && data.purchaseNumMinNum !== null && data.purchaseNumMaxNum !== null) {
        isConNum.value = true
        conNumValue.value = data.purchaseNumTime
        conNumBegInp.value = data.purchaseNumMinNum
        conNumEndInp.value = data.purchaseNumMaxNum
      }
      // 消费金额
      if (data.purchaseAmountTime !== null && data.purchaseAmountMinAmount !== null && data.purchaseAmountMaxAmount !== null) {
        isConAmount.value = true
        conAmountValue.value = data.purchaseAmountTime
        conAmountBegInp.value = new Big(data.purchaseAmountMinAmount).div(100).toFixed()
        conAmountEndInp.value = new Big(data.purchaseAmountMaxAmount).div(100).toFixed()
      }
      // 订单均价
      if (data.orderAveragePriceTime !== null && data.orderAveragePriceMinAmount !== null && data.orderAveragePriceMaxAmount !== null) {
        isOrderAverPrice.value = true
        orderAverPriceValue.value = data.orderAveragePriceTime
        orderAverPriceBegInp.value = new Big(data.orderAveragePriceMinAmount).div(100).toFixed()
        orderAverPriceEndInp.value = new Big(data.orderAveragePriceMaxAmount).div(100).toFixed()
      }
      // 充值金额
      if (data.rechargeAmountTime !== null && data.rechargeAmountMinAmount !== null && data.rechargeAmountMaxAmount !== null) {
        isRecharAmount = true
        recharAmountVlaue = data.rechargeAmountTime
        recharAmountBegInp = data.rechargeAmountMinAmount
        recharAmountEndInp = data.rechargeAmountMaxAmount
      }
      // 充值次数
      if (data.rechargeNumTime !== null && data.rechargeNumMinNum !== null && data.rechargeNumMaxNum !== null) {
        isRecharNum.value = true
        recharNumValue.value = data.rechargeNumTime
        recharNumBegInp.value = data.rechargeNumMinNum
        recharNumEndInp.value = data.rechargeNumMaxNum
      }
    }
  })
}
// 修改为自定义范围
const onChagCustTimeRange = (val) => {
  // val：0-成为客户时间 1-关注时间 2-成为会员时间
  if (val === 0) {
    beCustTimeValue.value = 6
  } else if (val === 1) {
    followTimeValue.value = 6
  } else if (val === 2) {
    beMemTimeValue.value = 6
  }
}
// 改变时间范围
const onChangeTimeRan = (value) => {
  // value: 0-成为客户时间 1-关注时间 2-成为会员时间
  let seleItem = ''
  const timeRange = []
  const time = new Date()
  let beginTime = ''
  let endTime = ''
  if (value === 0) {
    seleItem = beCustTimeValue.value
  } else if (value === 1) {
    seleItem = followTimeValue.value
  } else if (value === 2) {
    seleItem = beMemTimeValue.value
  }

  if (seleItem === 0) {
    beginTime = moment(time).format('YYYY-MM-DD')
    endTime = beginTime
  } else if (seleItem === 1) {
    beginTime = moment(time).add(-1, 'days').format('YYYY-MM-DD')
    endTime = beginTime
  } else if (seleItem === 2) {
    beginTime = moment(time).add(-7, 'days').format('YYYY-MM-DD')
    endTime = moment(time).add(-1, 'days').format('YYYY-MM-DD')
  } else if (seleItem === 3) {
    beginTime = moment(time).add(-30, 'days').format('YYYY-MM-DD')
    endTime = moment(time).add(-1, 'days').format('YYYY-MM-DD')
  } else if (seleItem === 4) {
    // 本月的开始结束时间
    beginTime = moment(time).startOf('month').format('YYYY-MM-DD')
    endTime = moment(time).endOf('month').format('YYYY-MM-DD')
  } else if (seleItem === 5) {
    // 上个月的开始结束时间
    beginTime = moment(time).add(-1, 'month').startOf('month').format('YYYY-MM-DD')
    endTime = moment(time).add(-1, 'month').endOf('month').format('YYYY-MM-DD')
  }
  if (seleItem !== 6) {
    timeRange.push(beginTime)
    timeRange.push(endTime)
    if (value === 0) {
      beCustTimeRange.value = timeRange
    } else if (value === 1) {
      followTimeRange = timeRange
    } else if (value === 2) {
      beMemTimeRange.value = timeRange
    }
  }
}
// 增加/编辑标签
const preserveLabel = Debounce(() => {
  // 判断是否为整数/零的正则
  const tagType = labelType.value
  const tagName = labelName.value
  // 新增条件标签
  if (tagType === '0') {
    // 判断是新增/编辑
    onAddTag(userTagId, tagType, tagName)
  } else if (tagType === '1') {
    // 清空条件的参数标记
    const conditionTab = {
      clearRegisterTime: false,
      clearSubscribeTime: false,
      clearToBeMemberTime: false,
      clearRecentPurchaseTime: false,
      clearPurchaseNum: false,
      clearPurchaseAmount: false,
      clearOrderAveragePrice: false,
      clearRechargeAmount: false,
      clearRechargeNum: false
    }
    // 判断是否选中某个条件，选中就就不能为空
    const conditionParam = conditionHandle(conditionTab)

    if (tagName.trim() === '') {
      ElMessage.warning($t('user.tag.labelNameNullTips'))
    } else if (!isBeCustTimeChecked.value && !isBeMemTimeChecked.value && !isNearConTime.value && !isConNum.value &&
    !isConAmount.value && !isOrderAverPrice.value && !isRecharNum.value) {
      ElMessage.error('请勾选至少一个条件')
    } else if (isBeCustTimeChecked.value === false && isfollowTimeChecked === false && isBeMemTimeChecked.value === false &&
                isConNum.value === false && isConAmount.value === false && isOrderAverPrice.value === false &&
                isRecharAmount === false && isRecharNum.value === false && isNearConTime.value === false) {
      ElMessage.warning($t('user.tag.requireOne'))
    } else if (isBeCustTimeChecked.value === true && (beCustTimeRange.value === null || beCustTimeRange.value[0] === '' || beCustTimeRange.value[1] === '')) {
      ElMessage.warning($t('user.tag.becomeCustomerTimeNullTips'))
    } else if (isfollowTimeChecked === true && (followTimeRange === null || followTimeRange[0] === '' || followTimeRange[1] === '')) {
      ElMessage.warning($t('user.tag.followTimeNullTips'))
    } else if (isBeMemTimeChecked.value === true && (beMemTimeRange.value === null || beMemTimeRange.value[0] === '' || beMemTimeRange.value[1] === '')) {
      ElMessage.warning($t('user.tag.becomeMemberTimeNullTips'))
    } else if (isConNum.value === true && (conditionParam.purchaseNumMinNum === '' || conditionParam.purchaseNumMaxNum === '')) {
      ElMessage.warning($t('user.tag.consuNumNullTips'))
    } else if (isConAmount.value === true && (conditionParam.purchaseAmountMinAmount === '' || conditionParam.purchaseAmountMaxAmount === '')) {
      ElMessage.warning($t('user.tag.consuAmountNullTips'))
    } else if (isOrderAverPrice.value === true && (conditionParam.orderAveragePriceMinAmount === '' || conditionParam.orderAveragePriceMaxAmount === '')) {
      ElMessage.warning($t('user.tag.averPriNullTips'))
    } else if (isRecharAmount === true && (conditionParam.rechargeAmountMinAmount === '' || conditionParam.rechargeAmountMaxAmount === '')) {
      ElMessage.warning($t('user.tag.rechargeAmountNullTips'))
    } else if (isRecharNum.value === true && (conditionParam.rechargeNumMinNum === '' || conditionParam.rechargeNumMaxNum === '')) {
      ElMessage.warning($t('user.tag.rechargeNumberNullTips'))
    } else {
      const params = {
        userTagId,
        tagType,
        tagName
      }
      const request = userTagId !== '' ? api.update({ ...params, ...conditionParam }) : api.save({ ...params, ...conditionParam })
      request.then(() => {
        dialogVisible.value = false
        emit('refreshLabelList', true)
      })
    }
  }
}, 1500)
// 新增
const onAddTag = Debounce((userTagId, tagType, tagName) => {
  if (tagName.trim() === '') {
    return ElMessage.error('标签名称不能为空')
  }
  const params = { userTagId, tagType, tagName }
  const request = userTagId !== '' ? api.update(params) : api.save(params)
  request.then(() => {
    dialogVisible.value = false
    emit('refreshLabelList', true)
  })
}, 1000)
let recharAmountVlaue = 1
const posIntReg = /^([0]|[1-9][0-9]*)$/

const conditionHandle = (conditionTab) => {
  // 成为客户时间
  let registerMinTime = ''
  let registerMaxTime = ''
  if (isBeCustTimeChecked.value === true && beCustTimeRange.value !== null && beCustTimeRange.value[0] !== '' && beCustTimeRange.value[1] !== '') {
    registerMinTime = moment(beCustTimeRange.value[0]).startOf('days').format('YYYY-MM-DD HH:mm:ss')
    registerMaxTime = moment(beCustTimeRange.value[1]).endOf('days').format('YYYY-MM-DD HH:mm:ss')
  }
  if (isBeCustTimeChecked.value === false) {
    conditionTab.clearRegisterTime = true
    registerMinTime = ''
    registerMaxTime = ''
  }
  // 关注时间
  let subscribeMinTime = ''
  let subscribeMaxTime = ''
  if (isfollowTimeChecked === true && followTimeRange !== null && followTimeRange[0] !== '' && followTimeRange[1] !== '') {
    subscribeMinTime = moment(followTimeRange[0]).startOf('days').format('YYYY-MM-DD HH:mm:ss')
    subscribeMaxTime = moment(followTimeRange[1]).endOf('days').format('YYYY-MM-DD HH:mm:ss')
  }
  if (isfollowTimeChecked === false) {
    conditionTab.clearSubscribeTime = true
  }
  // 成为会员时间
  let toBeMemberMinTime = ''
  let toBeMemberMaxTime = ''
  if (isBeMemTimeChecked.value === true && beMemTimeRange.value !== null && beMemTimeRange.value[0] !== '' && beMemTimeRange.value[1] !== '') {
    toBeMemberMinTime = moment(beMemTimeRange.value[0]).startOf('days').format('YYYY-MM-DD HH:mm:ss')
    toBeMemberMaxTime = moment(beMemTimeRange.value[1]).endOf('days').format('YYYY-MM-DD HH:mm:ss')
  }
  if (isBeMemTimeChecked.value === false) {
    conditionTab.clearToBeMemberTime = true
  }
  // 最近消费时间
  let recentPurchaseTime = ''
  if (isNearConTime.value === true) {
    recentPurchaseTime = nearConTimeValue.value
  } else {
    conditionTab.clearRecentPurchaseTime = true
  }
  // 消费次数
  let purchaseNumTime = ''
  let purchaseNumMinNum = ''
  let purchaseNumMaxNum = ''
  if (isConNum.value === true) {
    purchaseNumTime = conNumValue.value
    if (posIntReg.test(conNumBegInp.value) && posIntReg.test(conNumEndInp.value)) {
      purchaseNumMinNum = conNumBegInp.value
      purchaseNumMaxNum = conNumEndInp.value
    }
  } else {
    conditionTab.clearPurchaseNum = true
  }
  // 消费金额
  let purchaseAmountTime = ''
  let purchaseAmountMinAmount = ''
  let purchaseAmountMaxAmount = ''
  if (isConAmount.value === true) {
    purchaseAmountTime = conAmountValue.value
    if (posIntReg.test(conAmountBegInp.value) && posIntReg.test(conAmountEndInp.value)) {
      purchaseAmountMinAmount = conAmountBegInp.value
      purchaseAmountMaxAmount = conAmountEndInp.value
    }
  } else {
    conditionTab.clearPurchaseAmount = true
  }
  // 订单均价
  let orderAveragePriceTime = ''
  let orderAveragePriceMinAmount = ''
  let orderAveragePriceMaxAmount = ''
  if (isOrderAverPrice.value === true) {
    orderAveragePriceTime = orderAverPriceValue.value
    if (posIntReg.test(orderAverPriceBegInp.value) && posIntReg.test(orderAverPriceEndInp.value)) {
      orderAveragePriceMinAmount = orderAverPriceBegInp.value
      orderAveragePriceMaxAmount = orderAverPriceEndInp.value
    }
  } else {
    conditionTab.clearOrderAveragePrice = true
  }
  // 充值金额
  let rechargeAmountTime = ''
  let rechargeAmountMinAmount = ''
  let rechargeAmountMaxAmount = ''
  if (isRecharAmount === true) {
    rechargeAmountTime = recharAmountVlaue
    if (posIntReg.test(recharAmountBegInp) && posIntReg.test(recharAmountEndInp)) {
      rechargeAmountMinAmount = recharAmountBegInp
      rechargeAmountMaxAmount = recharAmountEndInp
    }
  } else {
    conditionTab.clearRechargeAmount = true
  }
  // 充值次数
  let rechargeNumTime = ''
  let rechargeNumMinNum = ''
  let rechargeNumMaxNum = ''
  if (isRecharNum.value === true) {
    rechargeNumTime = recharNumValue.value
    if (posIntReg.test(recharNumBegInp.value) && posIntReg.test(recharNumEndInp.value)) {
      rechargeNumMinNum = recharNumBegInp.value
      rechargeNumMaxNum = recharNumEndInp.value
    }
  } else {
    conditionTab.clearRechargeNum = true
  }
  const param = {
    registerMinTime,
    registerMaxTime,
    subscribeMinTime,
    subscribeMaxTime,
    toBeMemberMinTime,
    toBeMemberMaxTime,
    recentPurchaseTime,
    purchaseNumTime,
    purchaseNumMinNum,
    purchaseNumMaxNum,
    purchaseAmountTime,
    purchaseAmountMinAmount,
    purchaseAmountMaxAmount,
    orderAveragePriceTime,
    orderAveragePriceMinAmount,
    orderAveragePriceMaxAmount,
    rechargeAmountTime,
    rechargeAmountMinAmount,
    rechargeAmountMaxAmount,
    rechargeNumTime,
    rechargeNumMinNum,
    rechargeNumMaxNum
  }
  return { ...param, ...conditionTab }
}
// 重置数据
const onResetData = () => {
  isDisaCondiLabel.value = false
  isDisaCustLabel.value = false
  labelName.value = ''
  labelType.value = '1'
  // 成为客户时间
  isBeCustTimeChecked.value = false
  beCustTimeValue.value = 0
  beCustTimeRange.value = ''
  // 成为会员时间
  isBeMemTimeChecked.value = false
  beMemTimeValue.value = 0
  beMemTimeRange.value = ''
  // 交易条件
  // 最近消费时间
  isNearConTime.value = false
  nearConTimeValue.value = 1
  // 消费次数
  isConNum.value = false
  conNumValue.value = 1
  conNumBegInp.value = ''
  conNumEndInp.value = ''
  // 消费金额
  isConAmount.value = false
  conAmountValue.value = 1
  conAmountBegInp.value = ''
  conAmountEndInp.value = ''
  // 订单均价
  isOrderAverPrice.value = false
  orderAverPriceValue.value = 1
  orderAverPriceBegInp.value = ''
  orderAverPriceEndInp.value = ''
  // 充值次数
  isRecharNum.value = false
  recharNumValue.value = 1
  recharNumBegInp.value = ''
  recharNumEndInp.value = ''
}
const onCloseClear = () => {
  emit('refreshLabelList', false)
}
/**
 *  选择基础条件时，防止首次选择默认值（今天），日期没回显
 * @param {*} val 选择的时间段
 * @param {*} type 勾选条件的类型
 */
const onSelectToday = (val, type) => {
  if (val === 0) onChangeTimeRan(type)
}
/**
 *  初次激活选框时，触发默认值（今天）的回显
 * @param {*} flag 检测选择框的变化
 * @param {*} type 勾选条件的类型
 */
// eslint-disable-next-line no-unused-vars
const testingActivation = (flag, type) => {
  if (type === 0) {
    // 用户注册时间
    if (beCustTimeValue.value === 0) onSelectToday(0, type)
  } else if (type === 2) {
    //  成为付费会员时间
    if (beMemTimeValue.value === 0) onSelectToday(0, type)
  }
}
defineExpose({ onInit })
</script>
<style lang="scss" scoped>
@use 'add-or-update';
</style>
