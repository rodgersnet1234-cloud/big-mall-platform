<template>
  <el-dialog
    v-model="visible"
    :title="'等级配置'"
    :close-on-click-modal="false"
  >
    <div class="prods-select-body">
      <el-form
        label-width="120px"
        @submit.prevent
      >
        <el-form-item
          :label="$t('user.level.levelName')"
          prop="levelName"
        >
          <el-input
            v-model="dataForm.levelName"
            :placeholder="$t('user.level.enterGradeName')"
            maxlength="6"
            show-word-limit
            type="texe"
          />
        </el-form-item>
        <el-form-item
          label="会员权益"
          prop="userRightsIds"
        >
          <template #label>
            <el-popover
              placement="top"
              width="300"
              trigger="hover"
              content="若选择多个相同名称的自定义权益，用户端只展示最先创建的自定义权益"
            >
              <template #reference>
                <div class="que-mark">
                  ?
                </div>
              </template>
            </el-popover>

            <span>会员权益</span>
          </template>
          <el-select
            v-model="dataForm.userRightsIds"
            multiple
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in rightsDataList"
              :key="item.rightsId"
              :label="item.rightsName"
              :value="item.rightsId"
              :disabled="isDisabled(item) && item.rightsType !== 0"
            >
              <span style="float: left">{{ item.rightsName }}  ({{ item.description }})</span>
              <span style="float: right; color: #8492a6; font-size: 13px;margin-right:20px">{{ rightsTpyes[item.rightsType] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dataForm.levelType === 1"
          label="付费会员类型"
          prop="userLevelTerms"
        >
          <div class="user-level">
            <!-- <el-checkbox-group v-model="dataForm.userLevelTermIds"> -->
            <div
              v-for="(levelTypeItem, index) in levelTypeList"
              :key="index"
            >
              <el-checkbox
                v-model="levelTypeItem.status"
                :disabled="!levelTypeItem.termType"
              >
                <!-- native modifier has been removed, please confirm whether the function has been affected  -->
                <el-input
                  v-model="levelTypeItem.needAmount"
                  placeholder="请输入价格"
                  type="number"
                  :min="1"
                  style="margin-top:-6px"
                  @change="onChangeNeedPrice()"
                  @keydown="onChannelInputLimit"
                >
                  <template #append>
                    {{ levelTypeItem.levelTypeName }}
                  </template>
                </el-input>
              </el-checkbox>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          v-if="dataForm.levelType === 3"
          :label="$t('user.level.paidMemberPrice')"
          prop="needAmount"
        >
          <el-input
            v-model="dataForm.needAmount"
            :placeholder="$t('user.level.enterInteger')"
            type="number"
            :min="1"
            oninput="if(value.length>10)value=value.slice(0,10)"
            precision="0"
            @change="onChangeNeedAmount()"
          >
            <template #append>
              {{ $t("unit.dollar") }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="dataForm.levelType === 3"
          :label="$t('user.level.timeType')"
          prop="termType"
        >
          <el-radio-group v-model="dataForm.termType">
            <el-radio :label="1">
              {{ $t("unit.day") }}
            </el-radio>
            <el-radio :label="2">
              {{ $t("user.level.week") }}
            </el-radio>
            <el-radio :label="3">
              {{ $t("user.level.month") }}
            </el-radio>
            <el-radio :label="4">
              {{ $t("user.level.season") }}
            </el-radio>
            <el-radio :label="5">
              {{ $t("unit.year") }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataForm.levelType === 3"
          :label="$t('user.level.time')"
          prop="term"
        >
          <el-input
            v-model="dataForm.term"
            :placeholder="$t('user.level.enterInteger')"
            min="1"
            precision="0"
            type="number"
            oninput="if(value.length>10)value=value.slice(0,10)"
            @change="onChangeTerm()"
          >
            <template #append>
              {{
                dataForm.termType === 1
                  ? $t("coupon.day")
                  : dataForm.termType === 2
                    ? $t("user.level.week")
                    : dataForm.termType === 3
                      ? $t("user.level.month")
                      : dataForm.termType === 4
                        ? $t("user.level.season")
                        : $t("user.level.year")
              }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="dataForm.levelType === 0"
          :label="$t('user.level.requiredGrowthValue')"
          prop="needGrowth"
        >
          <el-input
            v-model="dataForm.needGrowth"
            :placeholder="$t('user.level.enterInteger')"
            type="number"
            :min="minNeedGrowth"
            :max="1000000000"
            :precision="2"
            :disabled="dataForm.level === 1 && dataForm.levelType === 0"
            @change="onChangeNeedGrowth()"
          >
            <template #append>
              {{ $t("user.level.growth") }}
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span>
        <el-button
          @click="visible = false"
        >{{
          $t("table.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="onSubmitProds()"
        >{{
          $t("table.confirm")
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/user/level'
import * as rightApi from '@/api/user/user-rights'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList', 'getData'])

const visible = ref(false)
const rightsTpyes = [$t('user.rights.customization'), $t('user.rights.rointsRebateMultiplier'), $t('user.rights.coupons'), $t('user.rights.bonusPoints'), $t('user.rights.memberDiscount'), $t('user.rights.packageType')]
const dataForm = ref({
  id: null,
  level: 0,
  levelName: '',
  levelType: 0,
  needGrowth: 0,
  needAmount: 1,
  term: 1,
  termType: 1,
  discount: 10,
  discountRange: 0,
  discountType: 0,
  presScore: 0,
  rateScore: 1,
  isFreeFee: 0,
  couponIds: [],
  userRightsIds: [],
  userLevelTerms: [],
  userLevelTermIds: [],
  userRightsList: [],
  categoryList: [],
  categoryIds: []
})
let couponList = []
let isRateScore = false
let isFreeFee = false
let isCoupon = false
let isPresScore = false
let isDiscount = false
let isConfirm = false
const minNeedGrowth = ref(null)
let maxNeedGrowth = 1000000000
const levelTypeList = ref([{
  createTime: null,
  levelTermId: null,
  needAmount: '',
  termType: 0,
  status: true,
  updateTime: null,
  userLevelId: null,
  levelTypeName: '元/月'
}, {
  createTime: null,
  levelTermId: null,
  needAmount: '',
  termType: 1,
  status: 0,
  updateTime: null,
  userLevelId: null,
  levelTypeName: '元/季'
}, {
  createTime: null,
  levelTermId: null,
  needAmount: '',
  termType: 2,
  status: 0,
  updateTime: null,
  userLevelId: null,
  levelTypeName: '元/年'
}])
const rightsDataList = ref([])

let checkList = []
const onSetDisable = (rightsIds) => {
  checkList = []
  if (dataForm.value.userRightsIds !== undefined) {
    for (let i = 0; i < rightsIds.length; i++) {
      for (let j = 0; j < rightsDataList.value.length; j++) {
        if (rightsIds[i] === rightsDataList.value[j].rightsId) {
          checkList[i] = rightsDataList.value[j].rightsType
        }
      }
    }
  }
}
watch(() => dataForm.value.userRightsIds, (rightsIds) => {
  onSetDisable(rightsIds)
}, {
  immediate: true,
  deep: true
})
onActivated(() => {
  onGetDataList()
})

// 获取数据列表
const onInit = (userLevels, index, levelType) => {
  // 初始化
  visible.value = true
  isRateScore = false
  isFreeFee = false
  isCoupon = false
  isPresScore = false
  isDiscount = false
  isConfirm = false
  dataForm.value.levelType = levelType
  couponList = []
  if (index !== undefined) {
    if (!userLevels[index].userLevelId) {
      onGetDataList(userLevels, index)
    } else {
      onGetDataList(userLevels, index)
      dataFormInit()

      dataForm.value.levelName = userLevels[index].levelName
      dataForm.value.levelType = userLevels[index].levelType
      dataForm.value.needGrowth = userLevels[index].needGrowth
      let list = JSON.parse(JSON.stringify(userLevels[index].userLevelTerms))
      if (list == null) {
        list = []
      }
      for (let j = 0; j < list.length; j++) {
        if (list[j].termType === 0) {
          levelTypeList.value.splice(0, 1, list[j])
        }
        if (list[j].termType === 1) {
          levelTypeList.value.splice(1, 1, list[j])
        }
        if (list[j].termType === 2) {
          levelTypeList.value.splice(2, 1, list[j])
        }
      }
      levelTypeList.value.forEach(item => {
        item.status = !!item.status
        item.needAmount = formatPrice(item.needAmount, 1).toFixed(2)
      })
      levelTypeList.value.forEach(item => {
        if (item.termType === 0) {
          item.levelTypeName = '元/月'
        } else if (item.termType === 1) {
          item.levelTypeName = '元/季'
        } else {
          item.levelTypeName = '元/年'
        }
      })
      dataForm.value.couponIds = []
      dataForm.value.categoryIds = []

      dataForm.value.userRightsIds = userLevels[index].userRightsIds
      // 设置所需积分最大最小值
      onSetMinOrMaxNeedGrowth(userLevels, index)
    }
  } else {
    dataFormInit()
    onGetRightsDataList()
  }
}

/**
 * dataForm 初始化
 */
const dataFormInit = () => {
  dataForm.value.level = 0
  dataForm.value.levelName = null
  dataForm.value.needGrowth = 0
  dataForm.value.userLevelId = null
  dataForm.value.userRightsIds = []
  dataForm.value.userLevelTermIds = []
  checkList = []
  maxNeedGrowth = 1000000000
  levelTypeList.value = [{
    createTime: null,
    levelTermId: null,
    needAmount: '',
    termType: 0,
    status: true,
    updateTime: null,
    userLevelId: null,
    levelTypeName: '元/月'
  }, {
    createTime: null,
    levelTermId: null,
    needAmount: '',
    termType: 1,
    status: 0,
    updateTime: null,
    userLevelId: null,
    levelTypeName: '元/季'
  }, {
    createTime: null,
    levelTermId: null,
    needAmount: '',
    termType: 2,
    status: 0,
    updateTime: null,
    userLevelId: null,
    levelTypeName: '元/年'
  }]
}
const isDisabled = (item) => {
  const rightsType = item.rightsType
  let a = false
  if (dataForm.value.userRightsIds.length > 0) {
    a = dataForm.value.userRightsIds.includes(item.rightsId)
  }
  // 该选项所在类型，被禁止选中，但是已选中的选项不能被禁用
  return !(checkList.indexOf(rightsType) === -1) && !a
}
/**
 * 获取初始话数据
 */
const onGetDataList = (userLevels, index) => {
  api.get(userLevels[index].userLevelId).then(data => {
    dataForm.value = data
    if (!dataForm.value.couponIds) {
      dataForm.value.couponIds = []
    }
    if (!dataForm.value.categoryIds) {
      dataForm.value.categoryIds = []
    }
    if (!dataForm.value.userRightsIds) {
      dataForm.value.userRightsIds = []
    }

    couponList = data.couponList
    onSetRightsStatus(data)
    onSetMinOrMaxNeedGrowth(userLevels, index)
    // getCategoryDataList()
    onGetRightsDataList()
  })
}

/**
 * 获取用户权益列表
 */
const onGetRightsDataList = () => {
  rightApi.list().then(data => {
    rightsDataList.value = data
    onSetDisable(dataForm.value.userRightsIds)
  })
}
/**
 * 设置所需积分最大最小值
 */
const onSetMinOrMaxNeedGrowth = (userLevels, index) => {
  if (userLevels[index].level > 1 && userLevels[index - 1].needGrowth !== 0) {
    minNeedGrowth.value = userLevels[index - 1].needGrowth + 1
  } else {
    minNeedGrowth.value = 0
  }
  if (index < userLevels.length - 1 && userLevels[index + 1].needGrowth !== 0) {
    maxNeedGrowth = userLevels[index + 1].needGrowth - 1
  } else {
    maxNeedGrowth = 1000000000
  }
}

/**
 * 权益选项数据校验
 */
const onSetRights = () => {
  // 邮费
  if (isFreeFee) {
    dataForm.value.isFreeFee = 1
  } else {
    dataForm.value.isFreeFee = 0
  }
  // 折扣
  if (!isDiscount) {
    dataForm.value.discount = 10
    dataForm.value.discountRange = 0
    dataForm.value.discountType = 0
  }
  // 优惠券
  if (!isCoupon) {
    couponList = []
    dataForm.value.couponIds = []
  }
  // 积分倍率
  if (!isRateScore) {
    dataForm.value.rateScore = 1
  }
  // 赠送积分
  if (!isPresScore) {
    dataForm.value.presScore = 0
  }
}
let msg = ''
let isCheckSccuss = false
const onCheckData = () => {
  if (!dataForm.value.levelName || !dataForm.value.levelName.trim()) {
    msg = $t('user.level.gradeNmaeCannotEmpty')
    isCheckSccuss = false
    return false
  }

  // 成长值校验
  if (dataForm.value.needGrowth < 0 && dataForm.value.levelType === 0) {
    msg = $t('user.level.tips2')
    isCheckSccuss = false
    return false
  }
}
const onChangeNeedPrice = () => {
  levelTypeList.value.forEach(item => {
    if (item.needAmount > 100000) {
      item.needAmount = (100000).toFixed(2)
    }
    if (item.needAmount < 0) {
      item.needAmount = (0.01).toFixed(2)
    }
    if (item.status) {
      item.needAmount = Number(item.needAmount).toFixed(2)
    }
  })
}
/**
 * 确定事件
 */
const onSubmitProds = () => {
  // 校验数据
  isCheckSccuss = true
  onCheckData()
  if (!isCheckSccuss) {
    onErrorMsg(msg)
    return
  }

  const levneedAmountel = levelTypeList.value.every(item => item.needAmount > 0 || !item.status)
  if (!levneedAmountel && dataForm.value.levelType) {
    onErrorMsg('输入框的值不能为0或空')
    return
  }
  // 根据数据设置权限
  onSetRights()
  if (isConfirm) {
    onErrorMsg(msg)
    return
  }
  isConfirm = true
  couponList.forEach(item => {
    dataForm.value.couponIds.push(item.couponId)
  })

  levelTypeList.value.forEach(item => {
    if (item.status) {
      item.needAmount = Number(item.needAmount).toFixed(2)
    }
  })
  // 深拷贝
  const temp = levelTypeList.value.map(o => Object.assign({}, o))
  const param = {
    level: dataForm.value.level,
    levelName: dataForm.value.levelName,
    levelType: dataForm.value.levelType,
    updateStatus: dataForm.value.updateStatus,
    userLevelId: dataForm.value.userLevelId,
    userLevelTerms: temp,
    userRightsIds: dataForm.value.userRightsIds
  }
  if (dataForm.value.levelType === 0) {
    param.needGrowth = dataForm.value.needGrowth
  }
  param.userLevelTerms.forEach(item => {
    item.status = item.status ? 1 : 0
    item.needAmount = formatPrice(item.needAmount)
  })
  api.update(param).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500
    })
    visible.value = false
    const dataInit = dataFormInit
    async function fun () {
      await new Promise(() => {
        setTimeout(() => {
          dataInit()
        }, 200)
      })
    }
    fun()
    isConfirm = false
    emit('refreshDataList')
    emit('getData')
  }).catch(() => {
    isConfirm = false
  })
}
const onSetRightsStatus = (data) => {
  data.isFreeFee === 0 ? isFreeFee = false : isFreeFee = true
  data.discount === 10 ? isDiscount = false : isDiscount = true
  data.rateScore === 1 ? isRateScore = false : isRateScore = true
  data.presScore === 0 ? isPresScore = false : isPresScore = true
}
/**
 * 所需成长值数据变化校验
 */
const onChangeNeedGrowth = () => {
  let num = onSetNumber(dataForm.value.needGrowth)
  if (maxNeedGrowth) {
    num = num > maxNeedGrowth ? maxNeedGrowth : num
  }
  dataForm.value.needGrowth = num < minNeedGrowth.value ? minNeedGrowth.value : num
}
// bug fix：指定输入类型为number时仍然可以输入字母'e'（因为也属于数字类型的范围），这里做一下输入限制
const onChannelInputLimit = (e) => {
  const key = e.key
  // 不允许输入'e'
  if (key === 'e') {
    e.returnValue = false
    return false
  }
  return true
}
/**
 * 所需金额数据变化校验
 */
const onChangeNeedAmount = () => {
  const needAmount = onSetNumber(dataForm.value.needAmount)
  dataForm.value.needAmount = needAmount === 0 ? 1 : needAmount
}
/**
 * 会员时间数据变化校验
 */
const onChangeTerm = () => {
  const term = onSetNumber(dataForm.value.term)
  dataForm.value.term = term === 0 ? 1 : term
}

/**
 * 判断数据
 */
const onSetNumber = (value) => {
  const num = Math.round(value)
  if (num < 0) {
    return 0
  } else {
    return num
  }
}
/**
 * 错误提示框
 */
const onErrorMsg = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500
  })
}
defineExpose({ onInit })
</script>
<style lang="scss" scoped>
.prods-select-body {
  height: auto;
  overflow: auto;
  padding-right: 10px;
}

.has-tooltip  span {
      line-height: 18px;
      font-size: 18px;
      color: #333;
      font-weight: bold;
}

.que-mark {
      position: relative;
      top: 8px;
      display: inline-block;
      width: 14px;
      height: 14px;
      line-height: 14px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      background: #C8C9CC;
      border-radius: 50%;
      margin-left: 5px;
      cursor: default;
      margin-right: 6px;
    }

</style>
