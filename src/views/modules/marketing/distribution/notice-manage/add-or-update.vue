<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.msgId? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
    top="5vh"
    class="natice-dialog"
  >
    <el-form
      ref="dataFormRef"
      :rules="dataRule"
      :model="dataForm"
      label-position="right"
      label-width="90px"
      style="margin: 0 20px;"
      @submit.prevent
    >
      <!-- 公告标题 -->
      <el-form-item
        label="通知标题"
        prop="msgTitle"
      >
        <el-input
          v-model="dataForm.msgTitle"
          maxlength="36"
          show-word-limit
        />
      </el-form-item>
      <!-- 指定上线时间 -->
      <el-form-item
        label="开始时间"
        prop="startTime"
      >
        <el-date-picker
          v-model="dataForm.startTime"
          type="datetime"
          placeholder="选择日期"
        />
      </el-form-item>
      <!-- 指定下线时间 -->
      <el-form-item
        label="结束时间"
        prop="endTime"
      >
        <el-date-picker
          v-model="dataForm.endTime"
          type="datetime"
          :picker-options="pickerOptions"
          placeholder="选择日期"
        />
      </el-form-item>
      <!-- 是否置顶(0 不置顶 1 置顶) -->
      <el-form-item
        label="是否置顶"
        prop="isTop"
      >
        <el-radio
          v-model="dataForm.isTop"
          :label="1"
        >
          置顶
        </el-radio>
        <el-radio
          v-model="dataForm.isTop"
          :label="0"
        >
          不置顶
        </el-radio>
      </el-form-item>
      <!-- 公告内容 -->
      <el-form-item
        label="通知内容"
        prop="content"
      >
        <tiny-mce
          v-if="visible"
          ref="contentRef"
          v-model="dataForm.content"
        />
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
import * as api from '@/api/distribution/notice/distribution-msg'
import TinyMce from '@/components/tiny-mce/index.vue'
import { validNoEmptySpace } from '@/utils/validate'
import { Debounce } from '@/utils/debounce'
import { isHtmlNull } from '@/utils/index'
import { ElMessage } from 'element-plus'
import moment from 'moment'

const emit = defineEmits(['refreshDataList'])

const pickerOptions = reactive({
  disabledDate: (time) => {
    return time.getTime() < Date.now() - 8.64e7
  }
})
// eslint-disable-next-line no-unused-vars
const validNoEmpty = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能只有空格'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validContent = (rule, value, callback) => {
  if (isHtmlNull(value)) {
    callback(new Error('内容不能为空'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validTime = (rule, value, callback) => {
  const startTime = new Date(dataForm.startTime).getTime()
  const endTime = new Date(value).getTime()
  if (endTime < startTime) {
    callback(new Error('结束时间不能小于开始时间'))
  } else {
    callback()
  }
}
const dataRule = {
  msgTitle: [
    { required: true, message: '通知标题不能为空', trigger: 'blur' },
    { validator: validNoEmpty, trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始时间不能为空', trigger: 'blur' },
    { validator: validNoEmpty, trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' },
    { validator: validNoEmpty, trigger: 'blur' },
    { validator: validTime, trigger: 'blur' }
  ],
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
    { validator: validContent, trigger: 'blur' }
  ]
}
const dataFormRef = ref(null)
const visible = ref(false)
const dataForm = reactive({
  msgId: 0,
  msgTitle: null,
  startTime: '',
  endTime: '',
  isTop: 0,
  content: null
})
const init = (msgId) => {
  dataForm.msgId = msgId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.msgId) {
      return
    }
    api.get(msgId).then(data => {
      dataForm.startTime = data.startTime
      dataForm.endTime = data.endTime
      dataForm.isTop = data.isTop
      dataForm.msgId = data.msgId
      dataForm.msgTitle = data.msgTitle
      dataForm.content = data.content || ''
    })
  })
}
// 表单提交
const onSubmit = Debounce(function () {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    dataForm.startTime = moment(dataForm.startTime).format('YYYY-MM-DD HH:mm:ss')
    dataForm.endTime = moment(dataForm.endTime).format('YYYY-MM-DD HH:mm:ss')
    if ((moment(dataForm.startTime).valueOf() - moment(dataForm.endTime).valueOf()) > 0) {
      return ElMessage.error(('开始时间不能大于结束时间'))
    }
    const request = dataForm.msgId ? api.update(dataForm) : api.save(dataForm)
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
}, 1500)
defineExpose({ init })
</script>
