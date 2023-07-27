<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.liveUserId ? '新增' : '修改'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="130px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="微信号"
        prop="anchorWechat"
      >
        <el-input
          v-model="dataForm.anchorWechat"
          :disabled="dataForm.liveUserId !== 0"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        :label="$t('liveRoom.selectRole')"
        prop="roleList"
      >
        <el-radio
          v-model="roleList"
          :label="1"
        >
          {{
            $t("liveRoom.liveUser")
          }}
        </el-radio>
        <el-radio
          v-model="roleList"
          :label="3"
        >
          {{
            $t("liveRoom.liveOperators")
          }}
        </el-radio>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="visible = false"
        >取消</el-button>
        <el-button
          v-if="!dataForm.id"
          type="primary"
          @click="onSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as http from '@/api/live/index.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const isSubmit = ref(false)
const dataFormRef = ref(null)
const dataForm = reactive({
  liveUserId: null,
  id: null,
  anchorWechat: null,
  roleList: []
})
const roleList = ref(1)
const dataRule = {
  anchorWechat: [
    { required: true, message: $t('live.anchorWechatNotNull'), trigger: 'blur' }
  ]
}

const init = (liveUserId) => {
  dataForm.liveUserId = liveUserId || 0
  dataForm.roleList = []
  roleList.value = 1
  isSubmit.value = false
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.liveUserId) {
      http.getliveUserInfo(
        dataForm.liveUserId
      ).then((data) => {
        dataForm.liveUserId = data.liveUserId
        dataForm.id = data.id
        dataForm.anchorWechat = data.anchorWechat
        dataForm.roleList = data.roleList
        roleList.value = dataForm.roleList
      })
    }
  })
}

// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (isSubmit.value) {
        return
      }
      isSubmit.value = true
      dataForm.roleList.push(roleList.value)
      http.postOrPutLiveUser({
        method: dataForm.liveUserId ? 'put' : 'post',
        data: dataForm
      }).then(() => {
        isSubmit.value = true
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
          }
        })
      }).catch(() => {
        isSubmit.value = false
        dataForm.roleList = []
      })
    }
  })
}
defineExpose({ init })
</script>
