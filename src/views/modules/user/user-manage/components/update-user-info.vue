<template>
  <div>
    <el-dialog
      v-model="visible"
      :title="$t('table.edit')"
      width="450px"
      class="update-user-info"
    >
      <div class="box">
        <el-form
          ref="dataFormRef"
          :model="dataForm"
          label-width="100px"
          :rules="dataRule"
          @submit.prevent
        >
          <el-form-item
            :label="$t('user.userManager.nickName')"
            prop="nickName"
            class="form-item"
          >
            <el-input
              v-model="dataForm.nickName"
              maxlength="30"
              :disabled="false"
              :placeholder="$t('user.userManager.nickName')"
              style="width:200px;"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.status')"
            prop="status"
            class="form-item"
          >
            <el-radio-group v-model="dataForm.status">
              <el-radio :label="0">
                {{ $t('table.disable') }}
              </el-radio>
              <el-radio :label="1">
                {{ $t('table.enable') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="btn-box">
          <el-button
            @click="onCancel"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            :loading="confirmLoad"
            @click="onConfirm"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/user/user-manager'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshUserInfo'])

const visible = ref(false)
const confirmLoad = ref(false)
const dataForm = ref({})
// eslint-disable-next-line no-unused-vars
const validateNickName = (rule, value, callback) => {
  if (isHtmlNull(value)) {
    callback(new Error('昵称不能全为空格'))
  } else {
    callback()
  }
}
const dataRule = {
  nickName: [
    { required: true, message: '昵称不能为空', trigger: ['change', 'brue'] },
    { validator: validateNickName, trigger: ['change', 'brue'] }
  ]
}

const onInit = (data) => {
  visible.value = true
  dataForm.value = Object.assign({}, data)
}
const dataFormRef = ref(null)
const onConfirm = () => {
  dataFormRef.value?.validate(valid => {
    if (valid) {
      confirmLoad.value = true
      api.update(dataForm.value).then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            confirmLoad.value = false
            emit('refreshUserInfo')
          }
        })
      }).catch(() => {
        confirmLoad.value = false
      })
    }
  })
}
const onCancel = () => {
  dataFormRef.value?.clearValidate('nickName')
  visible.value = false
}
defineExpose({ onInit })
</script>
<style scoped>
.form-item {
  margin-bottom: 15px;
}
.btn-box {
  text-align: right;
  padding-right: 20px;
}
</style>
