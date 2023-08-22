<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('user.score.memberBenefitsPageDisplaySet') }}
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
        :label="$t('user.score.displayContent')"
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

const dataRule = {
  paramValue: [
    { required: true, message: $t('user.score.content'), trigger: 'brue' }
  ]
}
onMounted(() => {
  getData()
})

const dataForm = ref({
  paramValue: ''
})
const tinyMceRef = ref(null)
// 获取数据
const getData = () => {
  nextTick(() => {
    api.get('MEMBER_GROWTH_DESCRIPTION').then(data => {
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
      dataForm.value.paramKey = 'MEMBER_GROWTH_DESCRIPTION'
      dataForm.value.remark = $t('user.score.memberGrowthDescription')
      api.saveOrUpdate(dataForm.value).then(() => {
        getData()
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500
        })
      }).catch(() => {

      })
    }
  })
}

</script>
