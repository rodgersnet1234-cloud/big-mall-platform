<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? $t('admin.add') : '编辑'"
    :close-on-click-modal="false"
    top="5vh"
    width="780px"
    @close="dialogClose"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      class="dialog-form"
      :model="dataForm"
      :rules="dataRule"
      :label-width="$t('language') === 'language' ? '150px' : '80px'"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="关键字"
        prop="keywords"
      >
        <el-input
          v-model="dataForm.keywords"
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

let visible = ref(false)
let dataForm = reactive({
  id: null,
  keywords: '',
  content: '',
  remark: null
})
let isSubmit = ref(false)
const dataRule = {
  keywords: [
    { required: true, message: '关键字不能为空', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '回复内容不能为空', trigger: 'blur' }
  ]
}

const init = (id = null) => {
  dataForm.id = id || ''
  visible = true
  dialogClose()
  isSubmit = false
  if (dataForm.id) {
    http.getSkills(id)
      .then((data) => {
        console.log(data)
        dataForm = data
      })
  }
}
const dataFormRef = ref(null)
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (isSubmit) {
        return false
      }
      const obj = JSON.parse(JSON.stringify(dataForm))
      if (!obj.id) {
        delete obj.id
      }
      isSubmit = true
      http[dataForm.id ? 'putSkills' : 'postSkills'](obj)
        .then((data) => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              visible = false
              emit('refreshDataList')
              dataForm.content = ''
            }
          })
        }).catch((e) => {
          isSubmit = false
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

</script>

<style lang="scss" scoped>
.dialog-form {
  ::v-deep(.el-form-item) {
    margin-bottom: 4px;
  }
}
</style>

<style lang="scss" scoped>
.dialog-form {
  ::v-deep(.el-form-item) {
    margin-bottom: 4px;
  }
  ::v-deep(.el-form-item.is-error) {
    margin-bottom: 22px;
  }
  .content{
    padding-top:5px;
    padding-bottom: 5px;
  }
}
.question-icon {
  position: relative;
  right: 30px;
  // top: -13px;
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
}.notice-content {
  ::v-deep(.el-form-item__label:before){
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
}
</style>
