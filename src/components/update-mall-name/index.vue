<template>
  <el-dialog
    v-model="visible"
    title="平台名称"
    width="35%"
  >
    <el-form
      ref="dataFormRef"
      label-width="120px"
      :model="dataForm"
      :rules="dataRules"
      style="max-width: 460px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item label="原平台名称">
        <el-input
          v-model="dataForm.oldName"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="修改平台名称"
        prop="newName"
      >
        <el-input
          v-model="dataForm.newName"
          maxlength="16"
        />
      </el-form-item>
      <el-form-item
        label="验证码"
        prop="validCode"
      >
        <el-input v-model="dataForm.validCode">
          <template
            #append
          >
            <el-button
              style="width: 102px;"
              :disabled="!!countdown"
              @click="getCode"
            >
              {{ countdown? countdown + 's':'获取验证码' }}
            </el-button>
          </template>
        </el-input>
        <span>短信验证码将发送给超级管理员{{ onHidePhone(phone) }}手机上</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit"
        >
          确认
        </el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script  setup>
import { sendCode, updateMallName } from '@/api/multishop/shop-event'
import { ElMessage } from 'element-plus'
import { mallUserStore } from '@/stores/modules/mall-user.js'
import { validNoEmptySpace } from '@/utils/validate'

const emit = defineEmits(['updateName'])
const visible = ref(false)
const countdown = ref(0)
const dataForm = reactive({
  oldName: '',
  newName: '',
  validCode: ''
})
// eslint-disable-next-line no-unused-vars
const validEmptyTab = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}
const dataRules = reactive({
  newName: [
    { required: true, message: '请输入商城名称', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  validCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
})
const dataFormRef = ref()
const mallStore = mallUserStore()
const phone = ref('')

const init = async () => {
  visible.value = true
  await mallStore.onGetMallUserInfo()
  dataForm.oldName = mallStore.mallName
  phone.value = mallStore.phone
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
}

const onHidePhone = (phone) => {
  const reg = /^(\d{3})\d{4}(\d{4})$/
  return phone.replace(reg, '$1****$2')
}

const onSubmit = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      const data = {
        validCode: dataForm.validCode,
        mallName: dataForm.newName
      }
      updateMallName(data).then(() => {
        emit('updateName')
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 500,
          onClose: () => {
            visible.value = false
          }
        })
      })
    }
  })
}
const getCode = () => {
  sendCode().then(() => {
    countdown.value = 60
    getCountdown()
  })
}
// 倒计时1分钟
const getCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}
defineExpose({
  init
})

</script>
