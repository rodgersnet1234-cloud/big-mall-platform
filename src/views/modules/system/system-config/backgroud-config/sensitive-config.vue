<template>
  <div class="alipay-config gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.sensitiveConfiguration') }}
    </div>
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      label-width="5px"
      class="set-form"
      label-position="left"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        style="width:540px"
        prop="sensitiveWords"
      >
        <el-alert
          :title="$t('platform.config.sensitiveAlert')"
          type="warning"
          :closable="false"
          show-icon
        />
        <el-input
          v-model="dataForm.sensitiveWords"
          type="textarea"
          rows="28"
          :placeholder="$t('platform.config.sensitiveWord')"
          controls-position="right"
          @input="inputLimit"
        />
      </el-form-item>

      <el-button
        @click="onSubmit()"
      >
        {{ $t('platform.config.save') }}
      </el-button>
    </el-form>
    <template>
      <span class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      </span>
    </template>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

let dataForm = {
  sensitiveWords: null
}

onMounted(() => {
  init()
})
const dataFormRef = ref()
const init = () => {
  nextTick(() => {
    api.get('SENSITIVE_WORDS').then(data => {
      if (data) {
        dataForm = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
const { proxy } = getCurrentInstance()
const inputLimit = (val) => {
  // 正则匹配非中文及数字的字符
  const reg = /[^\u4e00-\u9fa5\uff0c]/
  // 查找是否有非中英文及数字的字符
  // 没有则返回-1，有则返回对应位置
  const n = val.search(reg)
  if (n !== -1 || (val[val.length - 2] === '，' && val[val.length - 1] === '，')) {
    dataForm.sensitiveWords = val.slice(0, n)
    proxy.$forceUpdate()
  }
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'SENSITIVE_WORDS',
        paramValue: JSON.stringify(dataForm),
        remark: $t('platform.config.sensitiveConfiguration')
      }).then(data => {
        init()
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            emit('refreshDataList')
          }
        })
      })
    }
  })
}

</script>
