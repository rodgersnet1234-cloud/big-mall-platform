<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.templateId? $t('table.edit'): $t('table.create')"
  >
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

const visible = ref(false)
const isCheck = ref(false)
const isConfirm = ref(false)
const dataForm = reactive({
  templateId: null,
  sendType: null,
  templateTypeList: [],
  message: null,
  templateCode: null,
  mpCode: null,
  createTime: null,
  tagIds: []
})
const tagList = ref([])
const dataRule = {
  message: [
    { required: true, message: $t('biz.notify.notifyContenNoNull'), trigger: 'blur' }
  ]
}
const dataFormRef = ref()
const init = (templateId) => {
  isConfirm.value = false
  isCheck.value = false
  dataForm.templateTypeList = []
  dataForm.templateId = templateId || 0
  dataForm.tagIds = []
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.templateId) {
      return
    }
    api.get(templateId).then(data => {
      dataForm.templateId = data.templateId
      dataForm.sendType = data.sendType
      dataForm.templateTypeList = data.templateTypeList
      dataForm.mpCode = data.mpCode
      dataForm.createTime = data.createTime
      dataForm.tagIds = data.tagIds
      dataForm.message = data.message
    })
  })
  getTags()
}
// 获取标签列表
const getTags = () => {
  getTagList().then(data => {
    tagList.value = data
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    isCheck.value = false
    if (isCheck.value || isConfirm.value) {
      return
    }
    const checkData = dataForm.tagIds === null || dataForm.tagIds === undefined || dataForm.tagIds.length < 1
    if (checkData) {
      ElMessage({ message: '请至少选择一个标签', type: 'error', duration: 1500 })
      return
    }
    isConfirm.value = true
    const request = dataForm.templateId ? api.update(dataForm) : api.save(dataForm)
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
    }).catch(() => {
      isConfirm.value = false
    })
  })
}
// 是否是英文
const isEn = () => {
  return getLanguage === 'en'
}
defineExpose({ init })
</script>
