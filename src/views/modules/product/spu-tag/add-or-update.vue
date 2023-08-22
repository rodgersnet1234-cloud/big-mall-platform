<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.id? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('product.spuTag.tagName')"
        prop="title"
      >
        <el-input
          v-model="dataForm.title"
          maxlength="36"
          show-word-limit
        />
      </el-form-item>
      <!-- <el-form-item :label="$t('product.spuTag.type')" prop="type">
       <el-radio-group v-model="dataForm.isDefault">
         <el-radio :label="0">{{ $t("product.spuTag.customType") }}</el-radio>
         <el-radio :label="1">{{ $t("product.spuTag.defaultType") }}</el-radio>
       </el-radio-group>
     </el-form-item>
     <el-form-item :label="$t('product.spuTag.list')" prop="style">
       <el-radio-group v-model="dataForm.style">
         <el-radio :label="0">{{ $t("product.spuTag.oneInARow") }}</el-radio>
         <el-radio :label="1">{{ $t("product.spuTag.twoInARow") }}</el-radio>
         <el-radio :label="2">{{ $t("product.spuTag.threeInARow") }}</el-radio>
       </el-radio-group>
     </el-form-item> -->

      <el-form-item
        :label="$t('product.spuTag.seq')"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          :min="0"
          :max="99999"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="visible = false"
        >{{
          $t('table.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >{{
          $t('table.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/spu-tag'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const isConfirm = ref(false)
const dataForm = ref({
  id: null,
  title: null,
  shopId: null,
  status: 1,
  type: 1,
  isDefault: 0,
  prodCount: null,
  seq: 0,
  style: 0
})
const validateTitle = (rule, value, callback) => {
  if (String(value).trim() === '') {
    callback(new Error($t('product.spuTag.inputNotEmpty')))
  } else {
    callback()
  }
}
const validateNumber = (rule, value, callback) => {
  if (parseInt(value) === value) {
    callback()
  } else {
    callback(new Error('请输入整数'))
  }
}
const dataRule = {
  title: [
    { required: true, message: $t('product.spuTag.pleaseEnterALabelName'), trigger: 'blur' },
    { validator: validateTitle, trigger: 'blur' }
  ],
  seq: [
    { required: true, message: $t('product.spuTag.serialNoEnter'), trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ]
}

const dataFormRef = ref(null)
const init = (id) => {
  isConfirm.value = false
  dataForm.value.id = id || 0
  dataForm.value.isDefault = 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.value.id) {
      api.get(id).then(data => {
        dataForm.value = data
      })
    }
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    if (isConfirm.value) {
      return
    }
    isConfirm.value = true
    const request = dataForm.value.id ? api.update(dataForm.value) : api.save(dataForm.value)
    request.then(data => {
      isConfirm.value = true
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
defineExpose({ init })
</script>
