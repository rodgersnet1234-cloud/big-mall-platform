<template>
  <div class="components-distribution-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ '分销设置' }}
    </div>
    <el-form
      ref="dataFormRef"
      :label-width="language === 'en' ? '240px' : '110px'"
      class="set-form"
      label-position="right"
      :model="dataForm"
      @submit.prevent
    >
      <!-- 分销开关 -->
      <el-form-item label="分销开关">
        <el-radio-group v-model="dataForm.distributionSwitch">
          <el-radio :label="0">
            {{ '关闭' }}
          </el-radio>
          <el-radio :label="1">
            {{ '开启' }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 业绩归属 -->
      <el-form-item label="业绩归属">
        <el-radio-group v-model="dataForm.attribution">
          <el-radio :label="0">
            {{ '允许绑定,关系优先' }}
          </el-radio>
          <el-radio :label="1">
            {{ '不绑定 分享人优先' }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 申请条件-条件审核判定 -->
      <el-form-item label="条件审核判定">
        <el-radio-group
          v-model="dataForm.autoCheck"
          @change="changeRadio(dataForm.autoCheck)"
        >
          <el-radio :label="0">
            {{ '人工判定' }}
          </el-radio>
          <el-radio :label="1">
            {{ '系统判定' }}
          </el-radio>
          <el-radio :label="2">
            {{ '无需审核' }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 申请条件 -->
      <el-form-item
        v-if="dataForm.autoCheck === 1"
        label="申请条件"
      >
        <div class="condition-item">
          <el-checkbox
            v-model="isProd"
            class="input-checked"
          >
            {{ '购买指定商品' }}
          </el-checkbox>
          <el-button
            v-if="isProd"
            plain
            class="input-checked"
            @click="prodsSelectHandle"
          >
            {{ '选择商品' }}
          </el-button>
          <span class="tips">{{ '确认收货后任意一件商品计入' }}</span>
          <el-row v-if="isProd">
            <div
              v-for="(prod, index) in dataForm.spuVOList"
              :key="index"
              style="margin: 5px 10px 0 0;float:left"
            >
              <el-card
                :body-style="{ padding: '0' }"
                style="height: 160px;width: 120px"
              >
                <ImgShow
                  :src="prod.mainImgUrl"
                  :img-style="{height: '104px', width: '100%'}"
                />
                <div class="card-prod-bottom">
                  <span class="card-prod-name">{{ prod.spuName }}</span>
                  <el-button
                    link
                    type="primary"
                    class="card-prod-name-button"
                    @click="deleteProd(index)"
                  >
                    {{ $t('table.delete') }}
                  </el-button>
                </div>
              </el-card>
            </div>
          </el-row>
        </div>

        <div class="condition-item input-group">
          <el-checkbox
            v-model="isExpenseNumber"
            class="input-checked"
            @change="removeExpenseNumber"
          >
            {{ '消费笔数大于等于' }}
          </el-checkbox>
          <el-form-item prop="expenseNumber">
            <el-input
              v-model.number="dataForm.expenseNumber"
              class="input-checked"
              min="1"
              :disabled="!isExpenseNumber"
              style="width:240px"
              @change="checkNumber"
            >
              <template #append>
                {{ '次' }}
              </template>
            </el-input>
          </el-form-item>
          <span class="tips">  {{ '下单次数，收货后计入' }}</span>
        </div>

        <div class="condition-item input-group">
          <el-checkbox
            v-model="isExpenseAmount"
            class="input-checked"
            @change="removeExpenseAmount"
          >
            {{ '消费金额大于等于' }}
          </el-checkbox>
          <el-form-item prop="expenseAmount">
            <el-input
              v-model.number="dataForm.expenseAmount"
              class="input-checked"
              min="0"
              style="width:240px"
              :disabled="!isExpenseAmount"
              @change="checkAmount"
            >
              <template #append>
                {{ '元' }}
              </template>
            </el-input>
          </el-form-item>
          <span class="tips">{{ '实付金额+积分抵扣，收货后计入' }}</span>
        </div>
      </el-form-item>
      <!-- 申请所需信息 -->
      <el-form-item
        v-if="paySettlementType!==1"
        label="申请所需信息"
      >
        <el-checkbox v-model="dataForm.realName">
          {{ '真实姓名' }}
        </el-checkbox>
        <el-checkbox v-model="dataForm.identityCardNumber">
          {{ '身份证号码' }}
        </el-checkbox>
        <el-checkbox v-model="dataForm.identityCardPic">
          {{ '身份证照片' }}
        </el-checkbox>
      </el-form-item>
      <!-- 提现发放方式 -->
      <el-form-item
        v-if="paySettlementType!==1"
        label="提现发放方式"
      >
        <el-radio-group v-model="dataForm.withdrawal">
          <!-- 提现发放方式：0.无需审核直接发放，1.审核后系统发放，2.审核后人工发放 -->
          <el-radio :label="1">
            审核后系统发放
            <el-tooltip
              class="item"
              effect="light"
              content="使用该设置必须要经过测试之后才能上线，否则自行承担后果"
              placement="right"
              style="color: #155BD4;"
            >
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </el-radio>
          <el-radio :label="2">
            审核后人工发放
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="paySettlementType!==1">
        <!-- 提现设置start -->
        <el-divider content-position="left" />
        <!-- 单笔提现 -->
        <el-form-item label="单笔提现">
          <el-input
            v-model.number="dataForm.amountMin"
            style="width: 180px"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="10"
          >
            <template #append>
              {{ '元' }}
            </template>
          </el-input>
          <span class="input-tips"> {{ '不高于' }} </span>
          <el-input
            v-model.number="dataForm.amountMax"
            style="width: 180px"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="10"
          >
            <template #append>
              {{ '元' }}
            </template>
          </el-input>
          <span class="tips">{{ '微信企业付款单笔最低1元,单笔单日最高2W元' }}</span>
        </el-form-item>
        <!-- 提现频次 -->
        <el-form-item label="提现频次">
          <el-row>
            <el-col :span="10">
              <el-select
                v-model="dataForm.frequency"
                placeholder="请选择"
              >
                <el-option
                  label="每天"
                  :value="1"
                />
                <el-option
                  label="每周"
                  :value="7"
                />
                <el-option
                  label="每月"
                  :value="30"
                />
                <el-option
                  label="无限制"
                  :value="-1"
                />
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-input
                v-if="dataForm.frequency !== -1"
                v-model.number="dataForm.number"
                oninput="value=value.replace(/[^\d]/g,'')"
                maxlength="10"
                @change="dataForm.number < 1 ? dataForm.number = 1 : ''"
              >
                <template #append>
                  {{ '次' }}
                </template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 提现说明 -->
        <el-form-item label="提现说明">
          <el-input
            v-model="dataForm.paymentExplain"
            type="textarea"
            style="width: 300px"
            witdt="230"
            maxlength="50"
            show-word-limit
          />
          <div
            class="tips"
            style="width: 100%;margin-left: 0"
          >
            {{ '提现说明填写后将于提现申请页面显示' }}
          </div>
        </el-form-item>
        <!-- 提现设置end -->
      </template>
    </el-form>
    <el-button
      @click="onSubmit()"
    >
      {{ $t('table.save') }}
    </el-button>
    <!-- 商品选择弹窗 -->
    <!-- 如果要更改dataUrl，在商品选择组件选择商品后的判断处也要更改一下 -->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelectRef"
      @refresh-select-prods="selectDistributionProds"
    />
  </div>
</template>

<script setup>
import ProdsSelect from '@/components/prods-select/index.vue'
import * as api from '@/api/distribution/set/distribution-config.js'
import { ElMessage } from 'element-plus'

const language = localStorage.getItem('cloudLanguage') || 'zh'
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
const prodsSelectVisible = ref(false)
// 是否指定商品
const isProd = ref(false)
// 是否指定单数
const isExpenseNumber = ref(false)
// 是否指定消费
const isExpenseAmount = ref(false)
const dataFormRef = ref(null)
const dataForm = reactive({
  distributionSwitch: 0,
  attribution: 1,
  autoCheck: 0,
  expenseNumber: null,
  spuIdList: [],
  spuVOList: [],
  expenseAmount: null,
  realName: false,
  identityCardPic: false,
  identityCardNumber: false,
  frequency: null, // 提现频次
  amountMax: null, // 单笔最高提现金额
  amountMin: null, // 单笔最低提现金额
  paymentExplain: null, // 提现说明
  number: null, // 提现次数
  withdrawal: 2
})

onMounted(() => {
  getData()
})

// 获取数据
const getData = () => {
  api.get().then(data => {
    if (data !== null) {
      if (paySettlementType === 1) {
        data = {
          ...data,
          realName: false,
          identityCardPic: false,
          identityCardNumber: false,
          withdrawal: null
        }
      }
      setDate(data)
    }
  })
}
// 设置数据
const setDate = (data) => {
  dataForm.distributionSwitch = data.distributionSwitch
  dataForm.attribution = data.attribution
  dataForm.autoCheck = data.autoCheck
  dataForm.expenseNumber = data.expenseNumber
  dataForm.spuIdList = data.spuIdList
  dataForm.spuVOList = data.spuVOList
  dataForm.expenseAmount = data.expenseAmount
  dataForm.realName = data.realName
  dataForm.identityCardPic = data.identityCardPic
  dataForm.identityCardNumber = data.identityCardNumber
  dataForm.frequency = data.frequency
  dataForm.amountMax = data.amountMax
  dataForm.amountMin = data.amountMin
  dataForm.paymentExplain = data.paymentExplain
  dataForm.number = data.number
  dataForm.withdrawal = data.withdrawal || 2
  if (dataForm.spuVOList == null) {
    dataForm.spuVOList = []
  }
  if (dataForm.expenseNumber > 0) {
    isExpenseNumber.value = true
  }
  if (dataForm.expenseAmount > 0) {
    isExpenseAmount.value = true
  }
  if (dataForm.spuIdList != null && dataForm.spuIdList.length > 0) {
    isProd.value = true
  }
}
// 提交表单
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    if (dataForm.amountMin <= 0 && paySettlementType !== 1) {
      ElMessage.error('提现最小金额不能为空且必须大于0')
      return
    }
    if (dataForm.amountMin >= dataForm.amountMax && paySettlementType !== 1) {
      ElMessage.error('提现最大金额不能为空且必须大于最小金额')
      return
    }
    if (dataForm.amountMax > 20000 && paySettlementType !== 1) {
      ElMessage.error('提现金额最大不能超过2W')
      return
    }
    const spuIdList = []
    if (dataForm.spuVOList && isProd.value) {
      dataForm.spuVOList.forEach(element => {
        spuIdList.push(element.spuId)
      })
    }
    dataForm.spuIdList = spuIdList
    if (dataForm.autoCheck === 1 && isProd.value && dataForm.spuIdList.length <= 0) {
      ElMessage({
        message: '请选择商品',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (!isProd.value) {
      dataForm.spuIdList = []
    }
    if (dataForm.expenseNumber === '.' || dataForm.expenseNumber === '-' || dataForm.expenseAmount === '.' || dataForm.expenseAmount === '-') {
      return
    }
    if (isExpenseNumber.value && !dataForm.expenseNumber) {
      ElMessage({
        message: '请输入整数',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (isExpenseAmount.value && !dataForm.expenseAmount) {
      ElMessage({
        message: '请输入整数或保留2位小数点的整数',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (dataForm.autoCheck === 1) {
      if (!isExpenseNumber.value && !isProd.value && !isExpenseAmount.value) {
        ElMessage({
          message: '系统判定至少选择一项申请条件',
          type: 'error',
          duration: 1500
        })
        return
      }
    }
    api.save(dataForm).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500
      })
    })
  })
}
/**
 * 切换选项数据初始化
 */
const changeRadio = (autoCheck) => {
  if (autoCheck === 0) {
    isProd.value = false
    dataForm.spuVOList = []
    isExpenseNumber.value = false
    dataForm.expenseNumber = null
    isExpenseAmount.value = false
    dataForm.expenseAmount = null
  }
}
const prodsSelectRef = ref(null)
// 显示添加指定商品弹框
const prodsSelectHandle = () => {
  prodsSelectVisible.value = true
  nextTick(() => {
    prodsSelectRef.value?.init(dataFormRef.value?.spuVOList, { filterSupDelivery: true })
  })
}
// 商品选择回调
const selectDistributionProds = (prods) => {
  if (prods) {
    dataForm.spuVOList = []
    for (const i in prods) {
      dataForm.spuVOList.push(prods[i])
    }
  }
}
// 删除指定商品
const deleteProd = (index) => {
  dataForm.spuVOList.splice(index, 1)
}
// 清除消费次数数据
const removeExpenseAmount = () => {
  dataForm.expenseAmount = null
}
// 清除消费金额数据
const removeExpenseNumber = () => {
  dataForm.expenseNumber = null
}
// 消费次数上限校验
const checkNumber = () => {
  const inNumber = Math.round(parseInt(dataForm.expenseNumber))
  if (inNumber < 1) {
    dataForm.expenseNumber = 1
  } else {
    dataForm.expenseNumber = inNumber > 1000 ? 1000 : inNumber
  }
}
// 消费金额校验
const checkAmount = () => {
  if (!dataForm.expenseAmount) {
    return
  }
  const inAmount = parseFloat(dataForm.expenseAmount).toFixed(2)
  if (inAmount < 0) {
    dataForm.expenseAmount = 0
  } else {
    dataForm.expenseAmount = inAmount > 10000 ? 10000 : inAmount
  }
}

</script>
<style lang="scss" scoped>
.components-distribution-set {
  .condition-item {
    margin-bottom: 10px;
    width: 100%;
  }
  .input-group{
    display: flex;
  }
  .input-checked {
    margin-right: 10px;
  }
  .card-prod-bottom {
    position: relative;
    text-align: left;
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
  }
  .tips {
    color: #9797a1;
    font-size: 12px;
  }
  .title {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
  }

  .set-form {
    margin: 20px;
  }

  :deep(el-checkbox__label,
  .el-radio__label){
    padding-left: 5px;
    font-size: 13px;
  }
  :deep(.el-input__inner) {
    border-radius: 0;
  }

  .input-tips {
    margin: 0 14px;
  }
  .tips {
    margin-left: 14px;
  }
}
.gray-box {
  background: #f2f2f6;
  padding: 20px 35px;
  height: 100%;
}
.border-bottom-gray {
  border-bottom: 1px solid #dddce2;
}
.top-redius {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
</style>
