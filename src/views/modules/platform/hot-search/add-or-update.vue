<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.hotSearchId? $t('table.edit'): $t('table.create')"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="80px"
      @submit.prevent
    >
      <!-- 热搜标题 -->
      <el-form-item
        :label="$t('platform.hotSearch.title')"
        prop="title"
      >
        <el-input
          v-model="dataForm.title"
          maxlength="36"
          show-word-limit
        />
      </el-form-item>
      <!-- 内容 -->
      <el-form-item
        :label="$t('platform.hotSearch.content')"
        prop="content"
      >
        <el-input
          v-model="dataForm.content"
          maxlength="35"
          show-word-limit
        />
      </el-form-item>
      <!-- 顺序 -->
      <el-form-item
        :label="$t('platform.hotSearch.seq')"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          :min="0"
          controls-position="right"
          :precision="0"
          @blur="seqChange"
        />
      </el-form-item>
      <!-- 状态 0未启用 1启用 -->
      <el-form-item
        :label="$t('platform.hotSearch.status')"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">
            {{ '未启用' }}
          </el-radio>
          <el-radio :label="1">
            {{ '启用' }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 热搜类型 1商品 2店铺 -->
      <el-form-item
        label="热搜类型"
        prop="type"
      >
        <el-radio-group v-model="dataForm.type">
          <el-radio
            :disabled="dataForm.hotSearchId !== 0"
            :label="1"
          >
            {{ '商品' }}
          </el-radio>
          <el-radio
            :disabled="dataForm.hotSearchId !== 0"
            :label="2"
          >
            {{ '店铺' }}
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
import * as api from '@/api/platform/hot-search'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = reactive({
  hotSearchId: 0,
  content: null,
  seq: 0,
  title: null,
  status: 1,
  type: 1
})

const setDataForm = (val) => {
  dataForm.hotSearchId = val.hotSearchId
  dataForm.content = val.content
  dataForm.seq = val.seq
  dataForm.title = val.title
  dataForm.status = val.status
  dataForm.type = val.type
}

// eslint-disable-next-line no-unused-vars
const validNoEmpty = (rule, value, callback) => {
  if (String(value).trim() === '') {
    callback(new Error('输入不能为空字符串'))
  } else {
    callback()
  }
}
const rules = {
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { validator: validNoEmpty, trigger: 'blur' }
  ],
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
    { validator: validNoEmpty, trigger: 'blur' }
  ]
}

const seqChange = () => {
  if (!dataForm.seq) {
    dataForm.seq = 0
  }
}
const init = (hotSearchId) => {
  dataForm.hotSearchId = hotSearchId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.hotSearchId) {
      return
    }
    api.get(hotSearchId).then(data => {
      setDataForm(data)
    })
  })
}
defineExpose({
  init
})
// 表单提交
const dataFormRef = ref('')
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const request = dataForm.hotSearchId ? api.update(dataForm) : api.save(dataForm)
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

</script>
