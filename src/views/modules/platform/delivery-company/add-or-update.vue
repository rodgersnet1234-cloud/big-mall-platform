<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.deliveryCompanyId? $t('table.edit'): $t('table.create')"
    width="800px"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="200px"
      style="width: 600px; margin-left:50px;"
      @submit.prevent
    >
      <!-- 物流公司名称 -->
      <el-form-item
        :label="$t('delivery.deliveryCompany.name')"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          maxlength="50"
          placeholder="输入物流公司名称"
        />
      </el-form-item>
      <!-- 公司主页 -->
      <el-form-item
        :label="$t('delivery.deliveryCompany.homeUrl')"
        prop="homeUrl"
      >
        <el-input
          v-model="dataForm.homeUrl"
          maxlength="250"
          placeholder="输入公司主页"
        />
      </el-form-item>
      <!-- 物流公司编号(阿里) -->
      <el-form-item
        :label="$t('delivery.deliveryCompany.aliNo')"
        prop="aliNo"
      >
        <el-input
          v-model="dataForm.aliNo"
          maxlength="20"
          placeholder="输入物流公司编号(阿里)"
        />
      </el-form-item>
      <!-- 物流公司编号(快递鸟) -->
      <el-form-item
        :label="$t('delivery.deliveryCompany.birdNo')"
        prop="birdNo"
      >
        <el-input
          v-model="dataForm.birdNo"
          maxlength="20"
          placeholder="输入物流公司编号(快递鸟)"
        />
      </el-form-item>
      <!-- 物流公司编号(快递100) -->
      <el-form-item
        :label="$t('delivery.deliveryCompany.hundredNo')"
        prop="hundredNo"
      >
        <el-input
          v-model="dataForm.hundredNo"
          maxlength="20"
          placeholder="输入物流公司编号(快递100)"
        />
      </el-form-item>
      <!-- 物流公司编号(其他不知名公司) -->
      <!-- <el-form-item :label="$t('delivery.deliveryCompany.otherNo')" prop="otherNo">
        <el-input v-model="dataForm.otherNo" />
      </el-form-item> -->
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
import * as api from '@/api/delivery/delivery-company'
import { validNoEmptySpace } from '@/utils/validate'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = reactive({
  deliveryCompanyId: 0,
  name: null,
  homeUrl: null,
  aliNo: null,
  birdNo: null,
  hundredNo: null,
  otherNo: null
})
const rules = {
  name: [
    { required: true, message: '请输入快递公司名称', trigger: 'blur' }
  ]
}

const init = (deliveryCompanyId) => {
  dataForm.deliveryCompanyId = deliveryCompanyId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.deliveryCompanyId) {
      return
    }
    api.get(deliveryCompanyId).then(data => {
      Object.assign(dataForm, data)
    })
  })
}
defineExpose({
  init
})
/**
 * 输入框空格判断
 */
const handleInputSpace = () => {
  const nameEmp = validNoEmptySpace(dataForm.name)
  const homeUrlEmp = validNoEmptySpace(dataForm.homeUrl)
  const aliNoEmp = validNoEmptySpace(dataForm.aliNo)
  const birdNoEmp = validNoEmptySpace(dataForm.birdNo)
  const hundredNoEmp = validNoEmptySpace(dataForm.hundredNo)
  if (nameEmp || homeUrlEmp || aliNoEmp || birdNoEmp || hundredNoEmp) {
    if (nameEmp) dataForm.name = ''
    if (homeUrlEmp)dataForm.homeUrl = ''
    if (aliNoEmp) dataForm.aliNo = ''
    if (birdNoEmp) dataForm.birdNo = ''
    if (hundredNoEmp) dataForm.hundredNo = ''
    ElMessage({
      message: '输入框不能为全空格',
      type: 'error',
      duration: 1000
    })
  }
}

// 表单提交
const dataFormRef = ref('')
const onSubmit = () => {
  if (!dataForm.aliNo && !dataForm.birdNo && !dataForm.hundredNo) {
    ElMessage.error('必须填写一个或多个物流公司编号')
    return
  }
  handleInputSpace()
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const request = dataForm.deliveryCompanyId ? api.update(dataForm) : api.save(dataForm)
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
}

</script>
