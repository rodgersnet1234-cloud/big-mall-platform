<template>
  <el-dialog
    v-model="visible"
    :title="$t('user.userManager.updateGrowth')"
    width="30%"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item
        :label="$t('user.userManager.growthTip2')"
        prop="growth"
      >
        <el-input
          v-model="dataForm.growth"
          type="number"
          oninput="if(value.length>11)value=value.slice(0,11)"
        />
        <span>{{ $t('user.userManager.growthTip1') }}</span>
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
import * as api from '@/api/user/user-manager.js'
import { ElMessage } from 'element-plus'
import Big from 'big.js'
const emit = defineEmits(['refreshDataList'])
// eslint-disable-next-line no-unused-vars
const validateNumber = (rule, value, callback) => {
  const max = new Big('2147483647')
  const min = new Big('-2147483648')
  const growthValue = new Big(value)
  if (!/^(-)?[1-9]+[0-9]*$/.test(value)) {
    callback(new Error($t('user.userManager.growthTip3')))
  } else if (growthValue.minus(max) > 0) {
    // 不能大于最大值 2147483647
    callback(new Error($t('user.userManager.balanceMaxTip') + max))
  } else if (growthValue.minus(min) < 0) {
    // 不能小于最小值 -2147483648
    callback(new Error($t('user.userManager.balanceMinTip') + min))
  } else {
    callback()
  }
}
const dataRule = {
  growth: [
    { required: true, message: $t('user.userManager.growthTip4'), trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ]
}
const visible = ref(false)
const dataForm = reactive({
  growth: null,
  userIds: []
})
const onInit = (ids) => {
  visible.value = true
  dataForm.userIds = ids
  dataForm.growth = null
}
const dataFormRef = ref(null)
const confirmLoad = ref(false)
const onConfirm = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    if (!dataForm.userIds) {
      return
    }
    confirmLoad.value = true
    api.updateGrowth(dataForm).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          confirmLoad.value = false
          emit('refreshDataList')
          dataForm.growth = null
        }
      })
    }).catch(() => {
      confirmLoad.value = false
    })
  })
}
defineExpose({ onInit })
</script>
