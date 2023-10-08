<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t("user.score.pointsSet") }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
    >
      <el-form-item
        :label="$t('user.score.pointsEarnOne')"
        style="width: 440px"
        prop="signInScoreOne"
      >
        <el-input-number
          v-model="signInScoreOne"
          :placeholder="$t('user.score.score')"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="10000"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.score.pointsEarnTwo')"
        style="width: 440px"
        prop="signInScoreTwo"
      >
        <el-input-number
          v-model="signInScoreTwo"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="10000"
          :placeholder="$t('user.score.score')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.score.pointsEarnThree')"
        style="width: 440px"
        prop="signInScoreThree"
      >
        <el-input-number
          v-model="signInScoreThree"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="10000"
          :placeholder="$t('user.score.score')"
          type="number"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.score.pointsEarnFour')"
        style="width: 440px"
        prop="signInScoreFour"
      >
        <el-input-number
          v-model="signInScoreFour"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="10000"
          :placeholder="$t('user.score.score')"
          type="number"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.score.pointsEarnFive')"
        style="width: 440px"
        prop="signInScoreFive"
      >
        <el-input-number
          v-model="signInScoreFive"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="10000"
          :placeholder="$t('user.score.score')"
          type="number"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.score.pointsEarnSix')"
        style="width: 440px"
        prop="signInScoreSix"
      >
        <el-input-number
          v-model="signInScoreSix"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="10000"
          :placeholder="$t('user.score.score')"
          type="number"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.score.pointsEarnSeven')"
        style="width: 440px"
        prop="signInScoreSeven"
      >
        <el-input-number
          v-model="signInScoreSeven"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="10000"
          :placeholder="$t('user.score.score')"
          type="number"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.score.pointsForRegistration')"
        style="width: 440px"
        prop="registerScore"
      >
        <el-input-number
          v-model="dataForm.registerScore"
          :placeholder="$t('user.score.score')"
          :precision="0"
          :min="0"
          :max="10000"
          controls-position="right"
          type="number"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.score.perPurchase')"
        style="width: 440px"
        prop="shoppingGetScore"
      >
        <el-input
          v-model="dataForm.shoppingGetScore"
          min="1"
          :step="0.1"
          :max="10000"
          style="width:350px"
          @change="setshoppingGetScore"
        >
          <template
            #append
          >
            {{ $t("unit.dollar") }}{{ $t("user.score.earnOnePoint") }}
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('user.score.getPercentLimit')"
      >
        <el-input-number
          v-model="dataForm.getRatioLimit"
          controls-position="right"
          :step="0.1"
          :precision="1"
          :min="0"
          :max="100"
          :placeholder="$t('user.score.percent')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.score.pointsSwitch')"
        style="width: 440px"
        prop="shoppingScoreSwitch"
      >
        <el-switch v-model="dataForm.shoppingScoreSwitch" />
      </el-form-item>
      <el-form-item
        v-if="dataForm.shoppingScoreSwitch"
        :label="$t('user.score.pointsPurchase') + '：'"
        style="width: 440px"
        :placeholder="$t('user.score.score')"
        prop="shoppingUseScoreRatio"
      >
        <el-input
          v-model="dataForm.shoppingUseScoreRatio"
          min="1"
          max="1000"
          style="width:350px"
          @change="setshoppingUseScoreRatio"
        >
          <template #append>
            {{ $t("user.score.pointsDeducted") }}
          </template>
        </el-input>
      </el-form-item>

      <el-form-item
        v-if="dataForm.shoppingScoreSwitch"
        :label="$t('user.score.usePercentLimit')"
      >
        <el-input-number
          v-model="dataForm.useRatioLimit"
          controls-position="right"
          :step="0.1"
          :min="0"
          :precision="1"
          :max="100"
          :placeholder="$t('user.score.percent')"
        />
      </el-form-item>
    </el-form>
    <el-button
      @click="onSubmit()"
    >
      {{ $t("table.save") }}
    </el-button>

    <span class="dialog-footer" />
  </div>
</template>

<script setup>
import * as api from '@/api/user/score-config.js'
import Big from 'big.js'
import { ElMessage } from 'element-plus'

const dataRule = {
  registerScore: [
    { required: true, message: $t('user.score.pointsOfRegistrationCannotEmpty'), trigger: 'blur' }
  ],
  shoppingGetScore: [
    { required: true, message: $t('user.score.pointsOfShoppingCannotEmpty'), trigger: 'blur' }
  ],
  shoppingUseScoreRatio: [
    { required: true, message: $t('user.score.shoppingPointsDeductedCannotEmpty'), trigger: 'blur' }
  ]
}
onMounted(() => {
  init()
})

const dataForm = ref({
  id: null,
  registerScore: 0,
  useRatioLimitRange: 1,
  getRatioLimitRange: 1,
  signInScore: [],
  shoppingGetScore: 0,
  useRatioLimit: 0,
  shoppingScoreSwitch: false,
  getRatioLimit: 0,
  shoppingUseScoreRatio: 0,
  categoryConfigs: []
})
const signInScoreOne = ref(0)
const signInScoreTwo = ref(0)
const signInScoreThree = ref(0)
const signInScoreFour = ref(0)
const signInScoreFive = ref(0)
const signInScoreSix = ref(0)
const signInScoreSeven = ref(0)
const init = () => {
  nextTick(() => {
    api.get('SCORE_CONFIG').then(data => {
      if (data.signInScoreString) {
        dataForm.value = data
        signInScoreOne.value = data.signInScore[0]
        signInScoreTwo.value = data.signInScore[1]
        signInScoreThree.value = data.signInScore[2]
        signInScoreFour.value = data.signInScore[3]
        signInScoreFive.value = data.signInScore[4]
        signInScoreSix.value = data.signInScore[5]
        signInScoreSeven.value = data.signInScore[6]
      }
      dataForm.value.categoryConfigs = data.categoryConfigs
      dataForm.value.shoppingGetScore = new Big(dataForm.value.shoppingGetScore).div(100).toFixed(2)
    })
  })
}

const setshoppingGetScore = () => {
  const num = Number(dataForm.value.shoppingGetScore).toFixed(2)
  dataForm.value.shoppingGetScore = num < 1 ? 1 : num
  if (num < 1) return
  dataForm.value.shoppingGetScore = num > 10000 ? Number(10000).toFixed(2) : num
}

const setshoppingUseScoreRatio = () => {
  let num = Math.round(dataForm.value.shoppingUseScoreRatio)
  num = num < 1 ? 1 : num
  num = num > 1000 ? 1000 : num
  dataForm.value.shoppingUseScoreRatio = num
}

let isConfig = false
const comparaConfig = () => {
  isConfig = false
}

const dataFormRef = ref(null)
// 表单提交
const onSubmit = () => {
  const param = JSON.parse(JSON.stringify(dataForm.value))
  if (!signInScoreOne.value ||
    !signInScoreTwo.value ||
    !signInScoreThree.value ||
    !signInScoreFour.value ||
    !signInScoreFive.value ||
    !signInScoreSix.value ||
    !signInScoreSeven.value
  ) {
    ElMessage({
      message: '连续签到可获得积分不能为空',
      type: 'error',
      duration: 1000
    })
    return
  }
  param.signInScore = []
  param.shoppingGetScore = !dataForm.value.shoppingGetScore ? 0 : dataForm.value.shoppingGetScore
  param.shoppingUseScoreRatio = !dataForm.value.shoppingUseScoreRatio ? 0 : dataForm.value.shoppingUseScoreRatio
  param.getDiscount = dataForm.value.useRatioLimit || 0
  param.useRatioLimit = dataForm.value.useRatioLimit || 0
  param.getRatioLimit = dataForm.value.getRatioLimit || 0
  param.useDiscount = !dataForm.value.getRatioLimitRange ? 0 : dataForm.value.getRatioLimitRange
  param.signInScore.push(signInScoreOne.value || 0)
  param.signInScore.push(signInScoreTwo.value || 0)
  param.signInScore.push(signInScoreThree.value || 0)
  param.signInScore.push(signInScoreFour.value || 0)
  param.signInScore.push(signInScoreFive.value || 0)
  param.signInScore.push(signInScoreSix.value || 0)
  param.signInScore.push(signInScoreSeven.value || 0)
  comparaConfig()
  if (isConfig) {
    errorMsg('')
    return
  }
  param.shoppingGetScore = new Big(param.shoppingGetScore).times(100).toFixed()
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save(param).then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            init()
          }
        })
      })
    }
  })
}

const errorMsg = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500
  })
}

</script>
