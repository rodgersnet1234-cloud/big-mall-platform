<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    :title="isBatchRecharge ? $t('user.userManager.balanceRecharge') : $t('user.userManager.balanceUpdate')"
    append-to-body
    width="30%"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="isBatchRecharge ? batchDataRule : dataRule"
      label-width="90px"
      @submit.prevent
    >
      <el-form-item
        :label="$t('user.userManager.changeQuantity')"
        prop="balanceValue"
      >
        <el-input
          v-model="dataForm.balanceValue"
          maxlength="18"
          :controls="false"
          @input="onChangeNum"
          @change="onInputNumber"
        />
        <br>
        <!-- 批量更改余额 - 批量给用户充值余额，只能批量给用户增加余额，请输入大于零的数 -->
        <span v-if="isBatchRecharge === 1">{{ $t("user.userManager.balanceTip4") }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('user.userManager.balanceTip8')"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <!-- 修改指定会员余额 - 正数代表增加，负数代表减少，只能输入数字，最多两位小数 -->
        <span v-if="isBatchRecharge !== 1">{{ $t("user.userManager.balanceTip1") }}</span>
        <!-- 修改指定会员余额 - 用户当前余额为X -->
        <span v-if="isBatchRecharge !== 1">
          {{ $t("user.userManager.balanceTip6") + dataForm.balance }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('user.userManager.balanceTip7')"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <!-- <span v-else>{{ $t("user.userManager.balanceTip1") }}</span> -->
      </el-form-item>

      <el-form-item>
        <el-button
          @click="visible = false"
        >
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :loading="confirmLoad"
          @click="onConfirm"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/user/user-recharge'
import Big from 'big.js'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const confirmLoad = ref(false)
// 如果是批量充值，就展示批量充值部分内容 1是 0否
const isBatchRecharge = ref(0)
const dataForm = ref({
  balanceValue: null,
  userIds: [],
  remark: null
})
// eslint-disable-next-line no-unused-vars
const validate = (rule, value, callback) => {
  const max = new Big('92233720368547758')
  const min = new Big('-92233720368547758')
  const balance = new Big(dataForm.value.balanceValue)
  const flag = dataForm.value.balanceValue === 0 || dataForm.value.balanceValue === '0.0' || dataForm.value.balanceValue === '0.00'
  if (!/^(-)?[1-9]\d*$|^(-)?[1-9]\d*\.\d\d?$|^(-)?0\.\d\d?$/.test(value) || flag) {
    callback(new Error($t('user.userManager.balanceTip3')))
  } else if (balance.minus(max) > 0) {
    // 不能大于最大值 92233720368547758
    callback(new Error($t('user.userManager.balanceMaxTip') + '92233720368547758'))
  } else if (balance.minus(min) < 0) {
    callback(new Error($t('user.userManager.balanceMinTip') + '-92233720368547758'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateNumber = (rule, value, callback) => {
  const max = new Big('92233720368547758')
  const min = new Big('-92233720368547758')
  const balance = new Big(dataForm.value.balanceValue)
  const flag = dataForm.value.balanceValue === 0 || dataForm.value.balanceValue === '0.0' || dataForm.value.balanceValue === '0.00'
  if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value) || flag) {
    callback(new Error($t('user.userManager.balanceTip5')))
  } else if (balance.minus(max) > 0) {
    // 不能大于最大值 92233720368547758
    callback(new Error($t('user.userManager.balanceMaxTip') + max))
  } else if (balance.minus(min) < 0) {
    // 不能小于最小值 -92233720368547758
    callback(new Error($t('user.userManager.balanceMinTip') + min))
  } else {
    callback()
  }
}
const dataRule = {
  balanceValue: [
    { required: true, message: $t('user.userManager.balanceTip2'), trigger: 'blur' },
    { validator: validate, trigger: 'blur' }
  ]
}
const batchDataRule = {
  balanceValue: [
    { required: true, message: $t('user.userManager.balanceTip5'), trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ]
}

const onInit = (ids, type, balance) => {
  visible.value = true
  dataForm.value.userIds = ids
  dataForm.value.balanceValue = null
  if (!balance || balance < 0) {
    balance = 0
  }
  dataForm.value.balance = balance
  isBatchRecharge.value = type === 1 ? 1 : 0
}
const onInputNumber = () => {
  const maxBalance = new Big(999999999.99).minus(dataForm.value.balance)
  const balanceValue = parseFloat(dataForm.value.balanceValue)
  if (balanceValue > maxBalance) {
    dataForm.value.balanceValue = maxBalance
  } else if (balanceValue <= -dataForm.value.balance) {
    dataForm.value.balanceValue = -dataForm.value.balance
  }
}
const onChangeNum = () => {
  const customAmounts = dataForm.value.balanceValue
  dataForm.value.balanceValue = onCheckInput(customAmounts)
}
/**
 * input输入框只允许输入正数和小数(保留小数点后两位)
 */
const onCheckInput = (num) => {
  if (num) {
    let tmpVal = num.replace(/[^-?\d^\\.]/g, '')
    const reg = /^(-)?(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
    if (!reg.test(tmpVal)) {
      tmpVal = tmpVal + ''
      tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
      const n = (tmpVal.split('.')).length - 1
      if (n > 1) {
        tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
      }
    }
    return tmpVal
  } else {
    return ''
  }
}
const dataFormRef = ref(null)
const onConfirm = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    if (!dataForm.value.userIds) {
      return
    }
    confirmLoad.value = true
    api.updateBalance(dataForm.value).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          confirmLoad.value = false
          emit('refreshDataList')
          dataForm.value.balanceValue = null
        }
      })
    }).catch(() => {
      confirmLoad.value = false
    })
  })
}
defineExpose({ onInit })
</script>
