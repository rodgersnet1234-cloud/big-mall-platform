<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? $t('admin.add') : '编辑'"
    :close-on-click-modal="false"
    top="5vh"
    width="780px"
    class="component-add-or-update"
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
        label="问题:"
        prop="issues"
      >
        <el-input
          v-model="dataForm.issues"
          maxlength="20"
          placeholder="问题不超过15个字"
        />
      </el-form-item>
      <el-form-item
        label="答案:"
        prop="content"
      >
        <el-input
          v-model="dataForm.content"
          class="content textarea-content"
          type="textarea"
          maxlength="500"
          placeholder="这里是问题答案不超过500个字"
          :autosize="{ minRows: 2, maxRows: 6 }"
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
const emit = defineEmits(['refreshDataList'])

const validateKeywords = (rule, value, callback) => {
  if (String(value).trim() === '') {
    callback(new Error('问题不能为空'))
  } else {
    callback()
  }
}

const validateContent = (rule, value, callback) => {
  if (String(value).trim() === '') {
    callback(new Error('回复内容不能为空'))
  } else {
    callback()
  }
}
const dataRule = {
  issues: [
    { required: true, message: '问题不能为空', trigger: 'blur' },
    { validator: validateKeywords, trigger: 'blur' }
  ],
  content: [
    { required: true, message: '回复内容不能为空', trigger: 'blur' },
    { validator: validateContent, trigger: 'blur' }
  ]
}

const visible = ref(false)
const dataForm = ref({
  id: null,
  issues: '',
  content: ''
})
let itemId = ''
const init = (id = null, issuesList) => {
  dataForm.value.id = id || ''
  itemId = id || Date.now().toString()
  visible.value = true
  dialogClose()
  if (id) {
    nextTick(() => {
      const item = issuesList.filter((item) => item.id === itemId)[0]
      dataForm.value.content = item.content
      dataForm.value.issues = item.issues
    })
  }
}

const dataFormRef = ref(null)
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      dataForm.value.id = itemId
      const obj = JSON.parse(JSON.stringify(dataForm.value))
      emit('refreshDataList', obj)
      visible.value = false
      dataForm.value.content = ''
    }
  })
}

// 重置表单
const dialogClose = () => {
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-add-or-update {
  &:deep(.dialog-form) {
    .el-form-item {
      margin-bottom: 4px;
    }
    .el-form-item.is-error {
      margin-bottom: 22px;
    }
    .content{
      padding-top:5px;
      padding-bottom: 5px;
    }
    .question-icon {
      position: relative;
      right: 30px;
      display: inline-block;
      width: 14px;
      height: 14px;
      line-height: 14px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      background: #C8C9CC;
      border-radius: 50%;
      margin-left: 5px;
      cursor: default;
    }
    .notice-content {
      &:deep(.el-form-item__label:before){
        content: '*';
        color: #F56C6C;
        margin-right: 4px;
      }
    }
  }
}
:deep(.el-textarea__inner){
  height:150px !important;
  min-height: 150px !important;
}
:deep(textarea) {
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  font-family: 'Micrsofot Yahei';
  resize: none;
}
</style>
