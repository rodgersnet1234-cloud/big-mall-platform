<template>
  <div class="gray-box">
    <div class="title">
      {{ $t('platform.config.weChatOfficialAccountConfiguration') }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="188px"
      class="set-form"
      label-position="right"
      :model="dataForm"
      :rules="dataRule"
      @submit.prevent
      @keyup.enter="onSubmitOfficial()"
    >
      <el-form-item
        :label="`${$t('platform.config.weChatOfficialAccount')} AppId：`"
        prop="appId"
      >
        <el-input
          v-model.trim="dataForm.appId"
          style="width:200px"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('platform.config.weChatOfficialAccount')} secret：`"
        prop="secret"
      >
        <el-input
          v-model.trim="dataForm.secret"
          style="width:200px"
          controls-position="right"
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
        <el-button @click="onBack">
          {{ $t('platform.config.back') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['mpShow'])

const dataForm = ref({
  appId: null,
  secret: null
})
const dataRule = {
  appId: [
    { required: true, message: `${$t('platform.config.weChatOfficialAccount')} appId ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ],
  secret: [
    { required: true, message: `${$t('platform.config.weChatOfficialAccount')} secret ${$t('platform.config.nullTips')}`, trigger: 'blur' }
  ]
}
onMounted(() => {
  init()
})
const dataFormRef = ref()
const init = () => {
  nextTick(() => {
    api.get('MP_CONFIG').then(data => {
      if (data) {
        dataForm.value = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
// 表单提交
const onSubmit = () => {
  const obj = {}
  obj.appId = dataForm.value.appId
  obj.secret = dataForm.value.secret
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'MP_CONFIG',
        paramValue: JSON.stringify(obj),
        remark: $t('platform.config.weChatOfficialAccountConfiguration')
      }).then(data => {
        if (data) {
          init()
        }
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500
        })
      })
      emit('mpShow', false)
    }
  })
}
const router = useRouter()

const onBack = () => {
  router.go(-1)
}

</script>
