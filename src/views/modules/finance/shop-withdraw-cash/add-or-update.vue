<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="'商家提现申请'"
    class="dialog-add-or-update"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="140px"
      @submit.prevent
    >
      <el-form-item
        :label="'店铺名称：'"
        prop="shopName"
      >
        <span class="shop-name">{{ dataForm.shopName }}</span>
      </el-form-item>
      <el-form-item
        :label="'账户名称：'"
        prop="recipientName"
      >
        <span class="recipient-name">{{ dataForm.shopBankCardVO.recipientName }}</span>
      </el-form-item>
      <el-form-item
        :label=" '提现金额：'"
        prop="rechargeAmount"
      >
        <span class="recharge-amount">
          <span class="bold">{{ amount(dataForm.amount) }}</span>
          元
        </span>
      </el-form-item>
      <el-form-item
        :label="'收款方信息：'"
        prop="payeeInformation"
      >
        <div
          v-if="dataForm.shopBankCardVO"
          class="payee-Info"
        >
          <p class="tips">
            你需要汇款
            <span class="bold">{{ amount(dataForm.amount) }}</span>
            元至以下账户，汇款成功后填写付款凭证信息，审核通过后会直接扣除提现金额需要确定已经线下结算给商家
          </p>
          <div class="payee-con">
            <div class="payee-con-item">
              <p class="tit">
                {{ '收款方户名：' }}
              </p>
              <p class="txt">
                {{ dataForm.shopBankCardVO.recipientName }}
              </p>
            </div>
            <div class="payee-con-item">
              <p class="tit">
                {{ '银行名称：' }}
              </p>
              <p class="txt">
                {{ dataForm.shopBankCardVO.bankName }}
              </p>
            </div>
            <div class="payee-con-item">
              <p class="tit">
                {{ '收款方开户行：' }}
              </p>
              <p class="txt">
                {{ dataForm.shopBankCardVO.branchName }}
              </p>
            </div>
            <div class="payee-con-item">
              <p class="tit">
                {{ '收款方账户：' }}
              </p>
              <p class="txt">
                <span ref="copyValRef">{{ dataForm.shopBankCardVO.cardNo }}</span>&nbsp;&nbsp;
                <textarea
                  ref="inputRef"
                  class="copy-content"
                  maxlength="100"
                />
                <span
                  class="copy-txt"
                  data-clipboard-text
                  @click="onCopyAccountNum"
                >{{ '复制' }}</span>
              </p>
            </div>
            <div class="payee-con-item">
              <p class="tit">
                {{ '备注' }}：
              </p>
              <p class="txt">
                {{ dataForm.shopRemarks || '无' }}
              </p>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        :label="'审核状态：'"
        prop="status"
      >
        <el-radio-group
          v-if="dataForm.status <2"
          v-model="dataForm.status"
          :disabled="oldStatus !== 0"
        >
          <el-radio
            :label="0"
            :disabled="true"
          >
            {{ '审核中' }}
          </el-radio>
          <el-radio :label="1">
            {{ '审核成功' }}
          </el-radio>
          <el-radio :label="-1">
            {{ '未通过' }}
          </el-radio>
        </el-radio-group>
        <div v-if="dataForm.status >1">
          <el-tag
            v-if="dataForm.status === 2"
            type="success"
          >
            {{ 'succIss' }}
          </el-tag>
          <el-tag
            v-if="dataForm.status === 3"
            type="danger"
          >
            {{ 'failIss' }}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status > 0"
        :label="'付款凭证信息'"
        prop="payerInformation"
      >
        <div class="payer-info">
          <el-form-item
            :label="'付款户名：'"
            prop="payingAccount"
            class="payer-item"
          >
            <el-input
              v-model="dataForm.payingAccount"
              type="text"
              :placeholder="'请输入付款户名'"
              :disabled="oldStatus !== 0"
            />
          </el-form-item>
          <el-form-item
            :label="'付款账号：'"
            prop="payingCardNo"
            class="payer-item"
          >
            <el-input
              v-model="dataForm.payingCardNo"
              type="text"
              :placeholder="'请输入付款账号'"
              maxlength="23"
              show-word-limit
              :disabled="oldStatus !== 0"
            />
          </el-form-item>
          <el-form-item
            :label="'付款日期：'"
            prop="payingTime"
          >
            <el-date-picker
              v-model="dataForm.payingTime"
              type="date"
              :placeholder="'选择日期'"
              value-format="YYYY-MM-DD"
              :disabled="oldStatus !== 0"
              :disabled-date="pickerOptions0.disabledDate"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        :label="'备注：'"
        prop="remarks"
      >
        <el-input
          v-model="dataForm.remarks"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          maxlength="100"
          show-word-limit
          :placeholder="oldStatus !== 0?'无':'请输入备注信息'"
          :disabled="oldStatus !== 0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="visible = false"
        >{{ '取消' }}</el-button>
        <el-button
          v-if="oldStatus === 0"
          type="primary"
          @click="onSubmit()"
        >{{ '提交' }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { detail, submit } from '@/api/shop-withdraw-cash/index'
// import { validNoEmptySpace } from '@/utils/validate'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import Big from 'big.js'

const amount = (value) => {
  if (!value) {
    return 0
  }
  return new Big(value).div(100).toFixed(2)
}
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = ref({
  amount: 0,
  payingAccount: '', // 付款户名
  payingCardNo: '', // 付款账号
  payingTime: '', // 付款日期
  remarks: '',
  shopBankCardVO: {
    bankName: '',
    branchName: '',
    cardNo: '',
    recipientName: '',
    shopBankCardId: 0
  },
  shopName: '',
  shopRemarks: '',
  status: 0
})
const oldStatus = ref(0)
// eslint-disable-next-line no-unused-vars
const validateCardNo = (rule, value, callback) => {
  if (!(/^([0-9]{1})(\d{12,23})$/).test(value)) {
    callback(new Error('请输入正确的银行卡号'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validatePayingAccount = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能只有空格'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateRemarks = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能只有空格'))
  } else {
    callback()
  }
}
const dataRule = {
  payingAccount: [
    { required: true, message: '请填写付款人户名', trigger: 'blur' },
    { validator: validatePayingAccount, trigger: 'blur' }
  ],
  payingCardNo: [
    { required: true, message: '请填写付款人账号', trigger: 'blur' },
    { validator: validateCardNo, trigger: 'blur' }
  ],
  payingTime: [
    { required: true, message: '请选择付款日期', trigger: 'blur' }
  ],
  remarks: [
    { validator: validateRemarks, trigger: 'blur' }
  ]
}

const pickerOptions0 = {
  disabledDate (time) {
    return time.getTime() > Date.now() - 8.64e6
  }
}

const onInit = (cashId) => {
  visible.value = true
  onGetData(cashId)
}
/**
 * 复制
 */
const inputRef = ref(null)
const copyValRef = ref(null)
const onCopyAccountNum = () => {
  inputRef.value = copyValRef.value?.innerText // 替换文本框内容
  navigator.clipboard.writeText(inputRef.value).then(() => {
    ElMessage({
      message: '复制成功',
      type: 'success',
      duration: 1000
    })
  }).catch(() => {
    ElMessage({
      message: '复制失败',
      type: 'error',
      duration: 1000
    })
  })
}
// 获取详情
const dataFormRef = ref(null)
const onGetData = (cashId) => {
  detail(cashId).then(data => {
    if (data !== null) {
      dataForm.value = data
      oldStatus.value = data.status
      // 默认勾选审核成功按钮
      if (dataForm.value.status === 0) {
        dataForm.value.status = 1
      }
      dataFormRef.value?.clearValidate()
    }
  })
}
// 表单提交
const onSubmit = () => {
  if (dataForm.value.status === 0) {
    visible.value = false
    return
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      const params = {
        cashId: dataForm.value.cashId,
        remarks: dataForm.value.remarks,
        shopId: dataForm.value.shopId,
        status: dataForm.value.status,
        shopBankCardId: dataForm.value.shopBankCardVO.shopBankCardId
      }
      if (dataForm.value.status === 1) {
        params.payingAccount = dataForm.value.payingAccount
        params.payingCardNo = dataForm.value.payingCardNo
        moment.suppressDeprecationWarnings = true
        params.payingTime = moment(dataForm.value.payingTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      }

      submit(params).then(() => {
        ElMessage({
          message: '审核操作完成',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
}
defineExpose({ onInit })
</script>

<style lang="scss" scoped>
.dialog-add-or-update {
  .bold { font-weight: bold;
  font-size: 16px;
  padding: 0 2px;
}
  .payee-Info {
    border: 1px solid #eee;
    border-radius: 3px;
    padding: 15px;
    margin-bottom: 15px;
    width: 98%;
}
  .payee-con-item {
    padding: 10px;
    line-height: 1em;
  .tit {
    display: inline-block;
    min-width: 100px;
    width: auto;
    text-align: left;
  }
  .txt {
    display: inline-block;
    text-align: left;
    position: relative;
    word-break: break-word;
  }
}
  .tips {
    line-height: 1.5em;
    padding-bottom: 10px;
}
  .copy-txt {
    color: #1c60d4;
    cursor: pointer;
}
  .copy-content {
    width: 1em;
    height: 1em;
    border: 0;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: -11;
}
  .payer-info {
    border: 1px solid #eee;
    padding: 20px;
    border-radius: 3px;
    width: 98%;
}
  .payer-item {
    margin-bottom: 20px !important;
}
:deep(.el-input__count) {
  background: none !important;
}
:deep(.el-textarea__inner) {
  padding-right: 40px;
}
}
</style>
