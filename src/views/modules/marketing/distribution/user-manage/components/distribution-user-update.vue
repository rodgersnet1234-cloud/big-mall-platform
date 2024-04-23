<template>
  <div class="mod-hotSearch-add-or-update">
    <el-dialog
      v-model="visible"
      title="修改状态"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        label-width="80px"
        @submit.prevent
        @keyup.enter="onSubmit()"
      >
        <el-form-item
          label="状态"
          prop="state"
        >
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="1">
              正常
            </el-radio>
            <el-radio :label="2">
              暂时封禁
            </el-radio>
            <el-radio :label="-1">
              永久封禁
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="dataForm.state !== 0 && dataForm.state !== 1"
          label="原因"
          prop="banReason"
        >
          <el-select
            v-model="dataForm.banReason"
          >
            <el-option
              label="失去联系"
              :value="0"
            />
            <el-option
              label="恶意刷单"
              :value="1"
            />
            <el-option
              label="其他"
              :value="2"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="备注"
          prop="remarks"
        >
          <el-input
            v-model="dataForm.remarks"
            type="textarea"
            placeholder="备注"
            maxlength="250"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="visible = false"
          >取消</el-button>
          <el-button
            type="primary"
            @click="onOpenCheck()"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/distribution/user/distribution-user-basic.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const dataForm = reactive({
  distributionUserId: null,
  state: 0,
  banReason: 0,
  remarks: ''
})
const visible = ref(false)

const init = (data) => {
  visible.value = true
  dataForm.distributionUserId = data.distributionUserId
  dataForm.state = data.state
  dataForm.banReason = data.banReason
  dataForm.remarks = data.remarks
  getDistributionBanInfo()
}

// 获取分销员清退记录
const getDistributionBanInfo = () => {
  api.getBanInfoByDistributionUserId(dataForm.distributionUserId).then((data) => {
    if (data) {
      dataForm.state = data.state
      dataForm.banReason = data.banReason
      dataForm.remarks = data.remarks
    }
  })
}

// 表单提交
// eslint-disable-next-line no-unused-vars
const onSubmit = (row, index, done, loading) => {
  api.updateState({
    distributionUserId: dataForm.distributionUserId,
    state: dataForm.state,
    banReason: dataForm.state !== 1 ? dataForm.banReason : '',
    remarks: dataForm.remarks
  }).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        visible.value = false
        emit('refreshDataList')
      }
    })
  })
}

const onOpenCheck = () => {
  if (dataForm.state === -1) {
    ElMessageBox.confirm('将用户永久封禁后，清空一切分销数据，平台不可再次更改状态，用户不可申请成为分销员，确定继续操作？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      onSubmit()
    }).catch(() => {

    })
  } else if (dataForm.state === 2) {
    ElMessageBox.confirm('将用户暂时封禁后，保留分销数据，用户不可申请成为分销员，确定继续操作？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      onSubmit()
    })
  } else if (dataForm.state === 1) {
    onSubmit()
  }
}

defineExpose({ init })
</script>
