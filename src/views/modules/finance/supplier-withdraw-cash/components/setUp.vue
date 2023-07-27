<template>
  <div>
    <el-dialog v-model="dialogFormVisible">
      <template #header>
        <div class="top-title">
          提现设置
          <el-tooltip
            v-if="paySettlementType===1"
            class="item"
            effect="dark"
            content="建议单笔提现最低设置1元，避免平台亏损"
            placement="right"
          >
            <span>
              <el-icon class="question">
                <QuestionFilled />
              </el-icon>
            </span>
          </el-tooltip>
        </div>
      </template>
      <el-form
        ref="dataFormRef"
        :inline="true"
        class="demo-form-inline"
        :model="dataForm"
        @submit.prevent
      >
        <el-form-item label="单笔提现">
          <el-input v-model.trim="dataForm.withdrawCashLeast">
            <template #suffix>
              <i style="font-style:normal;margin-right: 10px;">元</i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="不高于">
          <el-input
            v-model.trim="dataForm.withdrawCashMax"
            @blur="
              onHandleMaxValue(
                dataForm.withdrawCashMax,
                999999
              )"
          >
            <template #suffix>
              <i style="font-style:normal;margin-right: 10px;">元</i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="提现频次">
          <el-select v-model="dataForm.frequency">
            <el-option
              label="每周"
              :value="1"
            />
            <el-option
              label="每月"
              :value="2"
            />
            <el-option
              label="每年"
              :value="3"
            />
          </el-select>
          <el-input
            v-model.trim="dataForm.number"
            style="width: 140px;margin-left: 10px"
            @blur="onHandleEdit(dataForm.number)"
          >
            <template #suffix>
              <i style="font-style:normal;margin-right: 10px;">次</i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="dialogFormVisible = false"
          >取消</el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { save, getConfig } from '@/api/supplier-withdraw-cash'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
const dialogFormVisible = ref(false)
const dataForm = ref({
  withdrawCashLeast: 0,
  withdrawCashMax: '',
  frequency: '',
  number: ''
})
const dataFormRef = ref(null)
const onOpen = () => {
  dialogFormVisible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    getConfig().then(data => {
      dataForm.value = data
      dataForm.value.withdrawCashLeast = formatPrice(data.withdrawCashLeast, 1)
      dataForm.value.withdrawCashMax = (data.withdrawCashMax == null ? null : formatPrice(data.withdrawCashMax, 1))
    })
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      const params = {
        withdrawCashLeast: formatPrice(dataForm.value.withdrawCashLeast),
        withdrawCashMax: dataForm.value.withdrawCashMax == null ? null : formatPrice(dataForm.value.withdrawCashMax),
        frequency: dataForm.value.frequency,
        number: dataForm.value.number
      }
      save(params).then(() => {
        ElMessage({
          message: '设置成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            dialogFormVisible.value = false
          }
        })
      })
    }
  })
}
const onHandleMaxValue = (data, max) => {
  const patrn = /^(-)?\d+(\.\d+)?$/
  if (!data.match(patrn)) {
    dataForm.value.withdrawCashMax = ''
    return
  }
  if (data) {
    // 表格
    if (data > max) {
      dataForm.value.withdrawCashMax = max
    }
  }
}
const onHandleEdit = (e) => {
  let val = parseInt(e || 1)
  if (e > 1000000) val = 999999
  if (e < 1) val = 1
  dataForm.value.number = val
}
defineExpose({ onOpen })
</script>

<style scoped>
  .top-title {
    line-height: 24px;
    font-size: 18px;
    color: #303133;
  }
</style>
