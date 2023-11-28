<template>
  <div class="shortmsg-商品配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      商品配置
    </div>
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="商品审核"
        style="width:640px"
        prop="spuAudit"
      >
        <el-switch
          v-model="dataForm.spuAudit"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
        <el-tooltip
          class="item"
          effect="dark"
          content="开启之后商家新发布、要上架以及二次编辑涉及到文字、图片、视频的商品将默认处于待审核状态，由平台审核后正常上架。"
          placement="top"
        >
          <el-icon><InfoFilled /></el-icon>
        </el-tooltip>
      </el-form-item>
    </el-form>

    <el-button
      v-permission="['platform:config:save']"
      @click="onSubmit()"
    >
      保存
    </el-button>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const dataForm = ref({
  spuAudit: false
})
const dataRule = {
}

onMounted(() => {
  init()
})

const init = () => {
  nextTick(() => {
    api.get('SPU_SWITCH_CONFIG').then(data => {
      if (data) {
        dataForm.value = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
const dataFormRef = ref()
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'SPU_SWITCH_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: '商品配置'
      }).then(data => {
        if (data) {
          init()
        }
        ElMessage({
          message: '操作成功',
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
defineExpose({ init })
</script>
<style lang="scss" scoped>
@use '../index.scss';
</style>
