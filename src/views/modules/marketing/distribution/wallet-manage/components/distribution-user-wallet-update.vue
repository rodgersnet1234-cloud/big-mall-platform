<template>
  <el-dialog
    v-model="visible"
    :title="$t('table.edit')"
  >
    <el-form
      ref="dataFormRef"
      :rules="dataRule"
      :model="dataForm"
      label-position="right"
      label-width="90px"
      style="width: 400px; margin-left:50px;"
      @submit.prevent
    >
      <!-- 可提现金额 -->
      <el-form-item
        label="可提现金额"
        prop="settledAmount"
      >
        <el-input-number
          v-model="dataForm.settledAmount"
          controls-position="right"
          :precision="2"
          :step="0.01"
          :min="0"
          :controls="false"
          :max="9999999999.99"
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
import * as api from '@/api/distribution/user/distribution-user-wallet.js'
import Big from 'big.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = reactive({
  walletId: 0,
  distributionUserId: null,
  unsettledAmount: null,
  settledAmount: null,
  invalidAmount: null,
  accumulateAmount: null,
  changeAmount: null
})
const dataFormRef = ref(null)
const oldSettledAmount = ref(0)

// eslint-disable-next-line no-unused-vars
const validateNumber = (rule, value, callback) => {
  if (!/^[0-9]\d*$|^[0-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
    callback(new Error('必须是大于等于0且最多两位小数的数值'))
    return
  }
  const max = new Big('92233720368547758')
  const min = new Big('-92233720368547758')
  const amountValue = new Big(value)
  if (!/^[0-9]\d*$|^[0-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
    callback(new Error('必须是大于等于0且最多两位小数的数值'))
  } else if (amountValue.minus(max) > 0) {
    // 不能大于最大值 92233720368547758
    callback(new Error('不能大于最大值' + max))
  } else if (amountValue.minus(min) < 0) {
    // 不能小于最小值 -92233720368547758
    callback(new Error('不能小于最小值' + min))
  } else {
    callback()
  }
}
const dataRule = {
  unsettledAmount: [
    { validator: validateNumber, trigger: 'blur' }
  ],
  settledAmount: [
    { validator: validateNumber, trigger: 'blur' }
  ],
  invalidAmount: [
    { validator: validateNumber, trigger: 'blur' }
  ],
  accumulateAmount: [
    { validator: validateNumber, trigger: 'blur' }
  ]
}

const init = (row) => {
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    dataForm.walletId = row.walletId
    dataForm.settledAmount = conversionActual(row.settledAmount)
    dataForm.unsettledAmount = conversionActual(row.unsettledAmount)
    dataForm.invalidAmount = conversionActual(row.invalidAmount)
    dataForm.accumulateAmount = conversionActual(row.accumulateAmount)
    // 保存原先的可提现金额
    oldSettledAmount.value = dataForm.settledAmount
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const changeAmount = parseFloat(new Big(dataForm.settledAmount).minus(oldSettledAmount.value).times(100))
    dataForm.changeAmount = changeAmount
    api.update(dataForm).then(() => {
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
    })
  })
}
const conversionActual = (val) => {
  // 精度运算-除法
  if (val == null) {
    return 0
  }
  return new Big(val).div(100).toFixed(2).valueOf()
}
defineExpose({ init })
</script>
