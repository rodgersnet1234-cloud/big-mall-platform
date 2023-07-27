<template>
  <el-dialog
    v-model="visible"
    width="608px"
    custom-class="distribution-auditing-update"
    :title="isEdit?'分销员审核':'分销员状态'"
    :close-on-click-modal="false"
    :before-close="closeBefore"
  >
    <el-form
      ref="dataFormRef"
      :rules="dataRule"
      :model="dataForm"
      label-position="right"
      label-width="auto"
      @submit.prevent
    >
      <!-- 审核 -->
      <el-form-item
        label="审核"
        prop="state"
      >
        <el-radio-group
          v-model="dataForm.state"
          :disabled="!isEdit"
        >
          <el-radio :label="1">
            审核通过
          </el-radio>
          <el-radio :label="-1">
            审核不通过
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 原因0 资料不足 1条件不足 2不招人 -1其他 -->
      <el-form-item
        v-if="dataForm.state === -1"
        label="原因"
        prop="reason"
      >
        <el-select
          v-model="dataForm.reason"
          :disabled="!isEdit"
          :readonly="!isEdit"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item
        label="备注"
        prop="remarks"
      >
        <el-input
          v-model="dataForm.remarks"
          type="textarea"
          :rows="4"
          :readonly="!isEdit"
          maxlength="30"
          show-word-limit
          placeholder="备注"
        />
      </el-form-item>
      <el-form-item
        v-if="!isEdit"
        label="操作人"
        prop="sysUsername"
      >
        <el-input
          v-if="dataForm.modifierName"
          v-model="dataForm.modifierName"
          :readonly="!isEdit"
        />
      </el-form-item>

      <el-form-item
        v-if="!isEdit"
        label="操作时间"
        prop="updateTime"
      >
        <el-input
          v-model="dataForm.updateTime"
          :readonly="!isEdit"
        />
      </el-form-item>
      <!-- 查看用户申请资料 -->
      <el-form-item
        label="用户申请资料"
        class="user-application-data"
      >
        <el-button
          v-permission="['distribution:distributionUser:update']"
          type="text"
          @click="info()"
        >
          点击查看
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="cancelBtn"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!isEdit"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
    <user-info
      v-if="infoVisible"
      ref="infoRef"
    />
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/distribution/user/distribution-auditing.js'
import userInfo from './distribution-user-info.vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList', 'closeAddOrUpdate'])

const isEdit = ref(true)
const visible = ref(false)
const options = [
  {
    value: 0,
    label: '资料不足'
  },
  {
    value: 1,
    label: '条件不足'
  },
  {
    value: 2,
    label: '不招人'
  },
  {
    value: -1,
    label: '其他'
  }
]
const dataForm = reactive({
  auditingId: 0,
  shopId: null,
  parentDistributionUserId: null,
  distributionUserId: null,
  auditingTime: null,
  remarks: null,
  reason: null,
  state: null,
  modifier: null,
  modifierName: null,
  realName: '',
  identityCardNumber: '',
  userMobile: '',
  identityCardPicFront: '',
  identityCardPicBack: '',
  identityCardPicHold: ''
})
const infoVisible = ref(false)
// eslint-disable-next-line no-unused-vars
const valiState = (rule, value, callback) => {
  if (value === 0) {
    callback(new Error('请选择审核状态'))
  } else {
    callback()
  }
}
const dataRule = {
  state: [
    { required: true, message: '请选择审核状态', trigger: 'blur' },
    { validator: valiState, trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请选择原因', trigger: 'change' }
  ]
}
const dataFormRef = ref(null)
const init = (data, initIsEdit) => {
  isEdit.value = initIsEdit
  visible.value = true
  if (initIsEdit) {
    data.remarks = ''
  }
  onResetSearch()
  dataForm.auditingId = data.auditingId
  dataForm.shopId = data.shopId
  dataForm.parentDistributionUserId = data.parentDistributionUserId
  dataForm.distributionUserId = data.distributionUserId
  dataForm.auditingTime = data.auditingTime
  dataForm.remarks = data.remarks
  dataForm.reason = data.reason
  dataForm.state = data.state
  dataForm.modifier = data.modifier
  dataForm.modifierName = data.modifierName
  dataForm.realName = data.realName
  dataForm.identityCardNumber = data.identityCardNumber
  dataForm.userMobile = data.userMobile
  dataForm.identityCardPicFront = data.identityCardPicFront
  dataForm.identityCardPicBack = data.identityCardPicBack
  dataForm.identityCardPicHold = data.identityCardPicHold
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const request = api.update(dataForm)
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
const infoRef = ref(null)
// 查看
const info = () => {
  infoVisible.value = true
  nextTick(() => {
    infoRef.value?.init(dataForm)
  })
}
const onResetSearch = () => {
  dataFormRef.value?.resetFields()
}
const cancelBtn = () => {
  emit('closeAddOrUpdate')
  visible.value = false
}
const closeBefore = (done) => {
  emit('closeAddOrUpdate')
  done()
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
div :deep(.el-dialog__wrapper) {
  z-index: 2010 !important;
}
:deep(.distribution-auditing-update .el-dialog__body){
  border-top: 1px solid  rgba(0,0,0,0.06);
  border-bottom: 1px solid  rgba(0,0,0,0.06);
}
:deep(.distribution-auditing-update .el-dialog__body .user-application-data){
    margin-bottom: 0;
  }
:deep(.distribution-auditing-update .el-dialog__footer){
  padding-top:20px
}
</style>
