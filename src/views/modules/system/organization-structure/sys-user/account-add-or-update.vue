<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.hasAccount === 0 ? '设置账号' : dataForm.hasAccount === 1 ? '修改账号': $t('table.create')"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;"
      @submit.prevent
    >
      <!-- 用户名 -->
      <el-form-item
        :label="$t('platform.shopUserAccount.username')"
        prop="username"
      >
        <el-input v-model="dataForm.username" />
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item
        :label="$t('platform.shopUserAccount.email')"
        prop="email"
      >
        <el-input v-model="dataForm.email" />
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item
        :label="$t('platform.shopUserAccount.mobileNumber')"
        prop="phone"
      >
        <el-input
          v-model="dataForm.phone"
          maxlength="11"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item
        :label="$t('platform.shopUserAccount.password')"
        prop="password"
        :class="{'is-required': !dataForm.hasAccount }"
      >
        <el-input
          v-model="dataForm.password"
          maxlength="16"
          type="password"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item
        v-if="dataForm.isAdmin !== 1"
        :label="$t('platform.shopUserAccount.status')"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">
            启用
          </el-radio>
          <el-radio :label="0">
            禁用
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="visible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/platform/sys-user-account'
import { MOBILE_REGEXP, USER_NAME_REGEXP, validNoEmptySpace, noSpacesBothSides } from '@/utils/validate'
import { encrypt } from '@/utils/crypto'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = reactive({
  hasAccount: 0,
  userId: 0,
  email: null,
  phone: null,
  username: null,
  password: null,
  status: 1
})
const validPassword = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('密码不能全为空格'))
  } else if (noSpacesBothSides(value)) {
    callback(new Error('不允许使用空格作为密码的开头或结尾'))
  } else {
    callback()
  }
}
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: USER_NAME_REGEXP, message: '用户名不能为纯数字且由数字字母下划线 4-16位组成', trigger: 'blur' }
  ],
  email: [
    { pattern: EMAIL_REGEXP, message: '邮箱格式有误', trigger: 'blur' }
  ],
  phone: [
    { pattern: MOBILE_REGEXP, message: '手机号格式有误', trigger: 'blur' }
  ],
  password: [
    // { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' },
    { validator: validPassword, trigger: 'blur' }
  ]
}

const init = (userId, hasAccount) => {
  console.log('init', hasAccount)
  dataForm.userId = userId
  dataForm.hasAccount = hasAccount
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.hasAccount) {
      return
    }
    api.get(userId).then(data => {
      if (data) {
        dataForm.userId = data.userId
        dataForm.email = data.email
        dataForm.phone = data.phone
        dataForm.username = data.username
        dataForm.password = data.password
        dataForm.hasAccount = hasAccount
      } else {
        dataForm.hasAccount = 0
      }
    })
  })
}
const dataFormRef = ref(null)
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const data = JSON.parse(JSON.stringify(dataForm))
    // 不填写密码默认是不更改
    if (data.password) {
      data.password = encrypt(data.password)
    }
    const request = data.hasAccount ? api.update(data) : api.save(data)
    request.then(data => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    })
  })
}
defineExpose({ init })
</script>
