<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('user.score.pointsQuestionSetting') }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="100px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
    >
      <el-form-item
        :label="$t('user.score.pointsQuestionSetting')"
        prop="paramValue"
      >
        <tiny-mce
          ref="tinyMceRef"
          v-model="dataForm.paramValue"
          style="width:900px"
        />
      </el-form-item>
    </el-form>
    <el-button
      @click="onSubmit()"
    >
      {{ $t('table.save') }}
    </el-button>
  </div>
</template>

<script setup>
import TinyMce from '@/components/tiny-mce/index.vue'
import * as api from '@/api/user/score-other-related.js'
import { ElMessage } from 'element-plus'

const dataForm = ref({
  paramValue: ''
})
// eslint-disable-next-line no-unused-vars
const validate = (rule, value, callback) => {
  const reg = /<p>(&nbsp;|&nbsp;\s+)+<\/p>|<p>(<br>)+<\/p>/g
  if (reg.test(dataForm.value.paramValue)) {
    callback(new Error($t('user.score.content')))
  } else {
    callback()
  }
}
const dataRule = {
  paramValue: [
    { required: true, message: $t('user.score.content'), trigger: 'brue' },
    { validator: validate, trigger: 'blur' }
  ]
}
onMounted(() => {
  getData()
})

const tinyMceRef = ref(null)
// 获取数据
const getData = () => {
  nextTick(() => {
    api.get('SCORE_QUESTION').then(data => {
      if (data !== null) {
        dataForm.value = data
      }
    })
  })
}

const dataFormRef = ref(null)
// 提交表单
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      dataForm.value.paramKey = 'SCORE_QUESTION'
      dataForm.value.remark = $t('user.score.pointsQuestionSetting')
      api.saveOrUpdate(dataForm.value).then(() => {
        getData()
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500
        })
      })
    }
  })
}

</script>
