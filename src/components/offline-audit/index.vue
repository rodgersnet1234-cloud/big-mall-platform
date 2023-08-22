<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.status === 1 ? '下架管理' : '待审核'"
    :close-on-click-modal="false"
    width="600px"
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
        label="处理人"
        prop="handler"
      >
        <el-input
          v-model="dataForm.handler"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        label="下线原因"
        prop="offlineReason"
      >
        <el-input
          v-model="dataForm.offlineReason"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        label="下线时间"
        prop="createTime"
      >
        <el-input
          v-model="dataForm.createTime"
          :disabled="true"
        />
      </el-form-item>

      <el-form-item
        v-if="isAudit"
        label="申请理由"
        prop="applyReason"
      >
        <el-input
          v-model="dataForm.applyReason"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          :disabled="true"
        />
      </el-form-item>

      <el-form-item
        v-if="dataForm.status>1"
        label="处理状态"
        prop="status"
      >
        <!-- 1平台进行下线 2 重新申请，等待审核 3.审核通过 4 审核未通过 -->
        <el-radio-group
          v-model="dataForm.status"
          :disabled="!isAudit"
        >
          <el-radio
            :label="2"
            disabled
          >
            待审核
          </el-radio>
          <el-radio :label="3">
            审核通过
          </el-radio>
          <el-radio :label="4">
            审核不通过
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status === 4"
        label="拒绝原因"
        prop="refuseReason"
        :required="true"
        :show-message="false"
      >
        <el-input
          v-model="refuseReason"
          :disabled="!isAudit"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          maxlength="200"
        />
      </el-form-item>
    </el-form>
    <el-divider v-if="dataForm.offlineHandleEventItemList && dataForm.offlineHandleEventItemList.length>0" />
    <el-form
      v-if="dataForm && dataForm.offlineHandleEventItemList && dataForm.offlineHandleEventItemList.length && dataForm.offlineHandleEventItemList[0].createTime"
      style="margin-left:10px"
      @submit.prevent
    >
      <div>
        <div style="margin-bottom:10px">
          <strong>历史申请</strong>
        </div>
        <div
          v-for="item in dataForm.offlineHandleEventItemList"
          :key="item.eventItemId"
          style="line-height: 1.5em"
        >
          <el-row justify="space-around">
            <el-col :span="4">
              <strong>申请时间：</strong>
            </el-col>
            <el-col :span="20">
              <span class="content-color">{{ item.createTime }}</span>
            </el-col>
          </el-row>
          <el-row justify="space-around">
            <el-col :span="4">
              <strong>申请理由：</strong>
            </el-col>
            <el-col :span="20">
              <span class="content-color">{{ item.reapplyReason }}</span>
            </el-col>
          </el-row>
          <el-row
            v-if="item.auditTime"
            justify="space-around"
          >
            <el-col :span="4">
              <strong>审核时间：</strong>
            </el-col>
            <el-col :span="20">
              <span class="content-color">{{ item.auditTime }}</span>
            </el-col>
          </el-row>
          <el-row
            v-if="item.refuseReason"
            justify="space-around"
          >
            <el-col :span="4">
              <div>
                <strong>拒绝原因：</strong>
              </div>
            </el-col>
            <el-col :span="20">
              <div>
                <span class="content-color">{{ item.refuseReason }}</span>
              </div>
            </el-col>
          </el-row>
          <div>
            <el-divider />
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="default-btn"
          @click="visible = false"
        >取消</el-button>
        <el-button
          :disabled="!isAudit"
          type="primary"
          @click="onSubmit"
        >确认审核</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/station/index'
import { ElMessage, ElMessageBox } from 'element-plus'
const emit = defineEmits(['refreshDataList', 'refreshDataList'])

const visible = ref(false)
const dataForm = ref({
  eventId: null,
  handleType: null,
  handleId: null,
  shopId: null,
  handlerId: null,
  status: null,
  applyReason: null,
  eventItemId: null,
  offlineReason: null,
  offlineHandleEventItemList: null
})
const isAudit = ref(false)
const refuseReason = ref('')
const stationId = ref(0)
const dataRule = {
}
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  selectUrl: {
    default: '',
    type: String
  },
  updateUrl: {
    default: '',
    type: String
  }
})

const init = (id) => {
  stationId.value = id || 0
  isAudit.value = false
  visible.value = true
  nextTick(() => {
    if (stationId.value) {
      api.getStationOfflineInfo(stationId.value).then((data) => {
        if (!data) {
          ElMessage({
            message: '未找到该违规信息,请稍后重试',
            type: 'error',
            duration: 1500,
            onClose: () => {
              visible.value = false
              emit('refreshDataList')
            }
          })
          return
        }
        dataForm.value = data
        const offlineHandleEventItemList = data.offlineHandleEventItemList || []
        if (offlineHandleEventItemList.length) {
          dataForm.value.applyReason = offlineHandleEventItemList[0].reapplyReason
          dataForm.value.eventItemId = offlineHandleEventItemList[0].eventItemId
          refuseReason.value = offlineHandleEventItemList[0].refuseReason
        }
        if (data.status === 2) {
          refuseReason.value = ''
          isAudit.value = true
        }
      })
    }
  })
}
// 表单提交
const onSubmit = () => {
  if (!isAudit) {
    return
  }
  if (dataForm.value.status === 2) {
    ElMessage.warning('请修改审核状态后提交')
    return
  }
  if (dataForm.value.status === 4) {
    if (!refuseReason.value) {
      ElMessage.warning('请填写拒绝理由')
      return
    }
    const reg = /^\s+$/g
    if (reg.test(refuseReason.value)) {
      ElMessage.warning('内容不能全为空格')
      return
    }
  }
  ElMessageBox.confirm('确认对活动/商品/门店进行审核吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    visible.value = false
    api.auditStation({
      eventId: dataForm.value.eventId,
      eventItemId: dataForm.value.eventItemId,
      handleId: stationId.value,
      status: dataForm.value.status,
      refuseReason: refuseReason.value || null
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
  })
}

defineExpose({
  init
})

</script>

<style lang="scss" scoped>
.content-color {
  color: #155bd4;
  word-break: break-word;
}
</style>
