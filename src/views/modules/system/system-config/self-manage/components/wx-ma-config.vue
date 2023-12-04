<template>
  <div class="gray-box">
    <div class="title">
      {{ $t('platform.config.miniProgramsConfig') }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="200"
      class="set-form"
      :rules="dataRule"
      label-position="right"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        prop="appId"
        :label="`${$t('platform.config.miniPrograms')} AppId：`"
      >
        <el-input
          v-model.trim="dataForm.appId"

          style="width:270px"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        prop="secret"
        :label="`${$t('platform.config.miniPrograms')} secret：`"
      >
        <el-input
          v-model.trim="dataForm.secret"
          style="width:270px"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        class="el-form-item-lable-no-padding"
        label="是否启用微信小程序发货对接"
        prop="wechatShippingAudit"
      >
        <el-tooltip
          effect="dark"
          placement="right"
        >
          <template #content>
            <div style="max-width:500px">
              此功能是微信限制需要对接小程序发货的时候才启用，非必要请不要启用
            </div>
          </template>
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
        <el-switch
          v-model="dataForm.wechatShippingAudit"
          style="padding-left: 20px"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['platform:sysConfig:save']"
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('platform.config.save') }}
        </el-button>
        <el-button @click="onBack()">
          {{ $t('platform.config.back') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['miniAppShowState'])
const dataForm = ref({
  appId: null,
  secret: null,
  wechatShippingAudit: false
})
const dataRule = {
  appId: [
    { required: true, message: `${$t('platform.config.miniPrograms')} appId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  secret: [
    { required: true, message: `${$t('platform.config.miniPrograms')} secret ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ]
}
onMounted(() => {
  init()
})
const dataFormRef = ref()
const init = () => {
  api.get('MA_CONFIG').then(data => {
    if (data) {
      dataForm.value = JSON.parse(data)
    }
    dataFormRef.value?.resetFields()
  })
}
// 表单提交
const router = useRouter()

const onSubmit = () => {
  const obj = {}
  obj.appId = dataForm.value.appId
  obj.secret = dataForm.value.secret
  dataFormRef.value?.validate(async (valid) => {
    if (valid) {
      await api.save({
        paramKey: 'MA_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: $t('platform.config.miniProgramsConfig')
      }).then((data) => {
        if (data) {
          init()
        }
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500
        })
      })
      emit('miniAppShowState', false)
    }
  })
}
const onBack = () => {
  router.go(-1)
}
</script>
