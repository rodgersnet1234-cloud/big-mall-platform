<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? $t('admin.add') : '编辑'"
    :close-on-click-modal="false"
    top="5vh"
    width="780px"
    @close="dialogClose"
  >
    <el-form
      ref="dataFormRef"
      class="dialog-form"
      :model="dataForm"
      :rules="dataRule"
      label-width="auto"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="关键字"
        prop="keywords"
      >
        <el-input
          v-model.trim="dataForm.keywords"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item
        label="回复内容"
        prop="content"
      >
        <el-input
          v-model="dataForm.content"
          class="content"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          maxlength="1000"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          maxlength="100"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="visible = false"
        >{{
          $t("chat.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >{{
          $t("chat.confirm")
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as http from '@/api/im-msg-biz-skills'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref(null)
const dataForm = reactive({
  id: null,
  keywords: '',
  content: '',
  remark: null
})
const isSubmit = ref(false)
const dataRule = {
  keywords: [
    { required: true, message: '关键字不能为空', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '回复内容不能为空', trigger: 'blur' }
  ]
}

const init = (id) => {
  dataForm.id = id || ''
  visible.value = true
  dialogClose()
  isSubmit.value = false
  if (dataForm.id) {
    http.getSkills(id)
      .then((data) => {
        dataForm.id = data.id
        dataForm.keywords = data.keywords
        dataForm.content = data.content
        dataForm.remark = data.remark
        dataForm.id = data.id
      })
  }
}

// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (isSubmit.value) {
        return false
      }
      const obj = JSON.parse(JSON.stringify(dataForm))
      if (!obj.id) {
        delete obj.id
      }
      isSubmit.value = true
      http[dataForm.id ? 'putSkills' : 'postSkills'](obj)
        .then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              visible.value = false
              emit('refreshDataList')
              dataForm.content = ''
            }
          })
        }).catch(() => {
          isSubmit.value = false
        })
    }
  })
}
// 重置表单
const dialogClose = () => {
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
}
defineExpose({ init })
</script>

<style lang="scss" scoped>
.dialog-form {
  .content {
    padding-top: 5px;
    padding-bottom: 5px;
  }
}
</style>
