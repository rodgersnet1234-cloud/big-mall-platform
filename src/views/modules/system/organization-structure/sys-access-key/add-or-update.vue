<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.sysAccessKeyId? $t('table.edit'): $t('table.create')"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-position="right"
      label-width="80px"
      style="width: 400px; margin-left:50px;"
      @submit.prevent
    >
      <!-- 名称 -->
      <el-form-item
        label="密钥名称"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <!-- 备注 -->
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          maxlength="100"
          show-word-limit
          :autosize="{ minRows: 3, maxRows: 6}"
        />
      </el-form-item>
      <!-- 账号id -->
      <el-form-item
        v-if="dataForm.sysAccessKeyId"
        label="账号ID"
        prop="accessId"
      >
        <span> {{ dataForm.accessId }} </span>
      </el-form-item>
      <!-- 密钥 -->
      <el-form-item
        v-if="dataForm.sysAccessKeyId"
        label="密钥"
        prop="accessKey"
      >
        <span> {{ dataForm.accessKey }} </span>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">
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
import * as api from '@/api/rbac/sys-access-key'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = reactive({
  sysAccessKeyId: 0,
  name: null,
  remark: null,
  accessId: null,
  accessKey: null
})

const validName = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能只有空格'))
  }
  callback()
}

const dataRule = {
  name: [
    { required: true, message: '请输入密钥名称', trigger: 'blur' },
    { validator: validName, trigger: 'blur' }
  ]
}

const dataFormRef = ref(null)
const init = (sysAccessKeyId) => {
  dataForm.sysAccessKeyId = sysAccessKeyId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.sysAccessKeyId) {
      return
    }
    api.get(sysAccessKeyId).then(data => {
      dataForm.name = data.name
      dataForm.remark = data.remark
      dataForm.accessId = data.accessId
      dataForm.accessKey = data.accessKey
    })
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const request = dataForm.sysAccessKeyId ? api.update(dataForm) : api.save(dataForm)
    request.then(() => {
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
