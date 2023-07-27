<template>
  <div class="shortmsg-商品配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      商品配置
    </div>
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      label-width="180px"
      size="mini"
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
          content="开启之后商家新发布的或是要上架的商品将默认处于待审核状态，由平台审核后正常上架。"
          placement="top"
        >
          <i class="el-icon-info" />
        </el-tooltip>
      </el-form-item>
    </el-form>

    <template>
      <span class="dialog-footer">
        <el-button
          @click="onSubmit()"
        >保存</el-button>
      </span>
    </template>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

let visible = ref(false)
let dataForm = reactive({
  spuAudit: false
})
const searchForm = reactive({})
const dataRule = {
}

onMounted(() => {
  init()
})

const init = () => {
  nextTick(() => {
    api.get('SPU_SWITCH_CONFIG').then(data => {
      if (data) {
        dataForm = JSON.parse(data)
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
        paramValue: JSON.stringify(dataForm),
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
            visible = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
}

</script>
