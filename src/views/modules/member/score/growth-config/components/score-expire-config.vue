<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('user.score.pointsExpirationSetting') }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="120px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
    >
      <el-form-item
        :label="$t('user.score.expirationSwitch')"
        style="width:440px"
        prop="scoreExpireSwitch"
      >
        <el-switch v-model="dataForm.scoreExpireSwitch" />
      </el-form-item>
      <el-form-item
        v-if="dataForm.scoreExpireSwitch"
        :label="$t('user.score.expiration')"
        prop="expireYear"
      >
        <el-input-number
          v-model="dataForm.expireYear"
          autosize
          witdt="330"
          :max="1000"
          :min="1"
          @keydown="channelInputExpireYear"
        />
        <span style="margin-left:10px">{{ $t('user.score.year') }}</span>
        <br>
        <span style="color:gray;">{{ $t('user.score.expirationDes') }}</span>
      </el-form-item>
    </el-form>
    <el-button
      @click="onSubmit()"
    >
      {{ $t('table.save') }}
    </el-button>
  </div>
</template>

<script setup>
import * as api from '@/api/user/score-other-related.js'
import { ElMessage } from 'element-plus'

const dataRule = {
  expireYear: [
    { required: true, message: $t('user.score.enterExpiration'), trigger: 'brue' }
  ]
}

onMounted(() => {
  getData()
})

const dataForm = ref({
  expireYear: 1,
  scoreExpireSwitch: false
})
const dataFormRef = ref(null)
// 获取数据
const getData = () => {
  api.get('SCORE_EXPIRE').then(data => {
    if (data != null && data !== '') {
      dataForm.value = JSON.parse(data.paramValue)
    }
    dataFormRef.value?.resetFields()
  })
}
// 提交表单
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (dataForm.value.expireYear > 1000) {
        dataForm.value.expireYear = 1000
      }
      dataForm.value.expireYear = parseInt(dataForm.value.expireYear)
      const value = {
        scoreExpireSwitch: dataForm.value.scoreExpireSwitch,
        expireYear: dataForm.value.expireYear
      }
      dataForm.value.paramValue = JSON.stringify(value)
      dataForm.value.remark = $t('user.score.pointsQuestionSetting')
      dataForm.value.paramKey = 'SCORE_EXPIRE'
      api.saveOrUpdate(dataForm.value).then(() => {
        getData()
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500
        })
      })
    }
  })
}
const channelInputExpireYear = (e) => {
  const key = e.key
  // 不允许输入'e'
  if (key === '.') {
    e.returnValue = false
    return false
  }
  return true
}

</script>

<style lang="scss" scoped>
div :deep(.el-input-number--mini .el-input-number__increase){
    height: 29px !important;
    line-height: 29px !important;
}
div :deep(.el-input-number--mini .el-input-number__decrease){
    height: 29px !important;
    line-height: 29px !important;
}
</style>
