<template>
  <el-dialog
    v-model="visible"
    :title="$t('user.userManager.updateUserScore')"
    width="30%"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="120px"
      @submit.prevent
    >
      <el-form-item
        :label="$t('user.userManager.scoresChange')"
        prop="score"
      >
        <el-input
          v-model="dataForm.score"
          type="number"
          oninput="if(value.length>20)value=value.slice(0,20)"
        />
        <span>{{ $t('user.userManager.scoreTip1') }}</span>
      </el-form-item>

      <el-form-item>
        <el-button
          @click="visible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :loading="confirmLoad"
          @click="onConfirm"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/user/user-manager.js'
import Big from 'big.js'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const confirmLoad = ref(false)
const dataForm = ref({
  score: null,
  userIds: [],
  remark: null
})
// eslint-disable-next-line no-unused-vars
const validateNumber = (rule, value, callback) => {
  const max = new Big('9223372036854775807')
  const min = new Big('-9223372036854775808')
  const scoreValue = new Big(value)
  if (!/^(-)?[1-9]+[0-9]*$/.test(value)) {
    callback(new Error($t('user.userManager.growthTip3')))
  } else if (scoreValue.minus(max) > 0) {
    // 不能大于最大值 9223372036854775807
    callback(new Error($t('user.userManager.balanceMaxTip') + max))
  } else if (scoreValue.minus(min) < 0) {
    // 不能小于最小值 -9223372036854775808
    callback(new Error($t('user.userManager.balanceMinTip') + min))
  } else {
    callback()
  }
}
const dataRule = {
  score: [
    { required: true, message: $t('user.userManager.scoreTip2'), trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ]
}

const onInit = (ids) => {
  visible.value = true
  dataForm.value.userIds = ids
  dataForm.value.score = null
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
    api.updateScore(dataForm.value).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          confirmLoad.value = false
          emit('refreshDataList')
          dataForm.value.score = null
        }
      })
    }).catch(() => {
      confirmLoad.value = false
    })
  })
}
defineExpose({ onInit })
</script>
