<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.templateId? $t('table.edit'): $t('table.create')"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :rules="dataRule"
      :model="dataForm"
      label-position="right"
      :label-width="isEn() ? '220px' : '100px'"
      class="notify-form"
      @submit.prevent
    >
      <!-- 消息类型 -->
      <el-form-item
        :label="$t('biz.notify.msgType')"
        prop="sendType"
      >
        <span>自定义消息</span>
      </el-form-item>
      <!-- 消息内容 -->
      <el-form-item
        :label="$t('biz.notify.notifyContent')"
        prop="message"
      >
        <el-input
          v-model="dataForm.message"
          maxlength="70"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.userManager.selectTag')"
        prop="sendType"
      >
        <el-select
          v-model="dataForm.tagIds"
          multiple
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in tagList"
            :key="item.value"
            :label="item.tagName"
            :value="item.userTagId"
          />
        </el-select>
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
import * as api from '@/api/biz/notify-template-tag'
import { getTagList } from '@/api/user/user-tag'
import { getLanguage } from '@/lang/index'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

let visible = ref(false)
let isCheck = ref(false)
let isConfirm = ref(false)
let dataForm = reactive({
  templateId: null,
  sendType: null,
  templateTypeList: [],
  message: null,
  templateCode: null,
  mpCode: null,
  createTime: null,
  tagIds: []
})
const tagIds = ref([])
let tagList = ref([])
const dataRule = {
  message: [
    { required: true, message: $t('biz.notify.notifyContenNoNull'), trigger: 'blur' }
  ]
}
const dataFormRef = ref()
const init = (templateId) => {
  isConfirm = false
  isCheck = false
  dataForm.templateTypeList = []
  dataForm.templateId = templateId || 0
  dataForm.tagIds = []
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.templateId) {
      return
    }
    api.get(templateId).then(data => {
      dataForm = data
    })
  })
  getTags()
}
// 获取标签列表
const getTags = () => {
  getTagList().then(data => {
    tagList = data
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    isCheck = false
    if (isCheck || isConfirm) {
      return
    }
    const checkData = dataForm.tagIds === null || dataForm.tagIds === undefined || dataForm.tagIds.length < 1
    if (checkData) {
      ElMessage({ message: '请至少选择一个标签', type: 'error', duration: 1500 })
      return
    }
    isConfirm = true
    const request = dataForm.templateId ? api.update(dataForm) : api.save(dataForm)
    request.then(data => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    }).catch(() => {
      isConfirm = false
    })
  })
}
// 是否是英文
const isEn = () => {
  if (getLanguage === 'en') {
    return true
  } else {
    return false
  }
}

</script>

<style lang="scss" scoped>
.notify-form {
  // & .el-input.el-input--small,
  & .el-select.el-select--small {
    width: 100%;
  }
}
</style>
