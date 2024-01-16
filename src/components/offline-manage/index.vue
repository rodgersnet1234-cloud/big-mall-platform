<template>
  <div class="components-offline-manage">
    <!-- 下架理由/下架管理 -->
    <el-dialog
      v-model="operateDialogVisible"
      :close-on-click-modal="false"
      :title="showOfflineOperate?'提示':showOfflineManage?'下线管理':showProductReview?'商品审核':''"
      :lock-scroll="true"
      :append-to-body="true"
      :destroy-on-close="true"
      :align-center="alignCenter"
      width="750px"
      top="4vh"
      class="operate-dlg"
      @close="onClose"
    >
      <!-- 商品审核 -->
      <div
        v-if="showProductReview"
        class="product-review"
      >
        <div class="msg">
          <div class="msg-item">
            <div class="confirm-tips">
              处理状态：
            </div>
            <div class="int">
              <el-radio-group v-model="auditStatus">
                <el-radio :label="3">
                  审核通过
                </el-radio>
                <el-radio :label="4">
                  审核不通过
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div
            v-show="auditStatus === 4 "
            class="msg-item"
          >
            <div class="confirm-tips">
              拒绝原因:
            </div>
            <div class="int">
              <el-input
                v-model="auditReason"
                maxlength="200"
                type="textarea"
                placeholder="请填写拒绝理由"
              />
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button
            @click="operateDialogVisible = false"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="onConfirAudit"
          >
            确认审核
          </el-button>
        </div>
      </div>

      <!-- 下架 -->
      <div
        v-if="showOfflineOperate"
        class="offline"
      >
        <div class="confirm-tips">
          {{ $t('table.sureToOffline') }}
        </div>
        <el-input
          v-model="offlineReason"
          maxlength="200"
          type="textarea"
          placeholder="请填写下线理由"
          @blur="blurOfflineReason"
        />
        <div
          v-if="offlineReasonError"
          class="error"
        >
          请填写下线理由
        </div>
        <div class="foot">
          <el-button
            @click="operateDialogVisible = false"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="onOrOffTheShelf"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>

      <!-- 下架管理 -->
      <div
        v-if="showOfflineManage"
        class="off-shelf-mag"
      >
        <div class="msg">
          <div class="msg-item">
            <div class="tit">
              处理人：
            </div>
            <div class="int">
              {{ offlineDetail.handler }}
            </div>
          </div>
          <div class="msg-item">
            <div class="tit">
              下线时间：
            </div>
            <div class="int">
              {{ offlineDetail.createTime }}
            </div>
          </div>
          <div class="msg-item">
            <div class="tit">
              处理状态：
            </div>
            <span
              v-if="offlineDetail.status === 1"
              type="danger"
            >违规下架</span>
            <span
              v-if="offlineDetail.status === 2"
              type="warning"
            >等待审核</span>
            <span
              v-if="offlineDetail.status === 3"
              type="success"
            >审核通过</span>
            <span
              v-if="offlineDetail.status === 4"
              type="danger"
            >审核未通过</span>
          </div>
          <div class="msg-item">
            <div class="tit">
              下线原因：
            </div>
            <div class="int">
              {{ offlineDetail.offlineReason }}
            </div>
          </div>
          <div
            v-if="offlineDetail.status === 2 && !canDirectOnline"
            class="msg-item"
          >
            <div class="tit">
              处理状态：
            </div>
            <div class="int">
              <el-radio-group v-model="examineStatus">
                <el-radio :label="3">
                  审核通过
                </el-radio>
                <el-radio :label="4">
                  审核不通过
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div
            v-if="offlineDetail.status === 2 && examineStatus===4"
            class="msg-item"
          >
            <div class="tit">
              拒绝原因：
            </div>
            <div class="int">
              <el-input
                v-model="refuseReason"
                maxlength="200"
                type="textarea"
              />
            </div>
          </div>
        </div>
        <div
          v-if="offlineDetail.offlineHandleEventItemList&&offlineDetail.offlineHandleEventItemList.length > 0"
          class="log"
        >
          <div class="log-tit">
            申请历史
          </div>
          <div
            v-for="(item,index) in offlineDetail.offlineHandleEventItemList"
            :key="index"
            class="log-item"
          >
            <p>申请时间：{{ item.createTime }}</p>
            <div class="ints">
              <div class="ints-tit">
                申请理由：
              </div>
              <div class="ints-content">
                {{ item.reapplyReason }}
              </div>
            </div>
            <p v-if="item.auditTime">
              审核时间：{{ item.auditTime }}
            </p>
            <div
              v-if="item.refuseReason"
              class="ints"
            >
              <div class="ints-tit">
                拒绝原因：
              </div>
              <div class="ints-content">
                {{ item.refuseReason }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div
          class="dialog-footer"
        >
          <el-button
            v-if="offlineDetail.status === 2 && !canDirectOnline"
            @click="operateDialogVisible = false"
          >
            取消
          </el-button>
          <el-button
            v-if="offlineDetail.status === 2 && !canDirectOnline"
            type="primary"
            @click="offlineDataSubmit()"
          >
            确认审核
          </el-button>
          <el-button
            v-if="canDirectOnline"
            type="primary"
            @click="offlineDataSubmit()"
          >
            重新上线
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 下架理由/下架管理 end -->
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
const emit = defineEmits(['onOrOffTheShelf', 'directOnline', 'offlineDataSubmit', 'auditOnlineSubmit'])
const props = defineProps({
  alignCenter: {
    type: Boolean,
    default: false
  }
})

const operateDialogVisible = ref(false) // 操作对话框
const showOfflineOperate = ref(false) // 下架
const showOfflineManage = ref(false) // 下架管理
const showProductReview = ref(false) // 商品审核
const offlineReason = ref('') // 下架原因
const offlineDetail = ref({}) // 最新下线
const offlineReasonError = ref(false) // 理由出错
const refuseReason = ref('') // 拒绝理由
const examineStatus = ref(3) // 审核(下架后上架)
const auditStatus = ref(3) // 审核(初始上架待审核)
const auditReason = ref('') // 拒绝原因(初始上架待审核)
const batchOffile = ref(false) // 批量操作
const canDirectOnline = ref(false) // 是否可以直接上线

const init = (key, data, canDirectOnlineVal) => {
  operateDialogVisible.value = true
  if (key === 'offline') {
    showOfflineOperate.value = true
    showOfflineManage.value = false
    showProductReview.value = false
    // 批量下线的功能，true:批量下线  其他：单个商品下线
    batchOffile.value = data
  } else if (key === 'offlineManage') {
    showOfflineManage.value = true
    showOfflineOperate.value = false
    showProductReview.value = false
    offlineDetail.value = data
    if (canDirectOnlineVal === 'canDirectOnline') {
      canDirectOnline.value = true
    }
  } else if (key === 'showProductReview') {
    showProductReview.value = true
    showOfflineOperate.value = false
    showOfflineManage.value = false
  }
}
const blurOfflineReason = () => {
  if (offlineReason.value) {
    offlineReasonError.value = false
  }
}
// 下线
const onOrOffTheShelf = () => {
  if (!offlineReason.value || !offlineReason.value.trim()) {
    offlineReasonError.value = true
    return
  }

  emit('onOrOffTheShelf', offlineReason.value, batchOffile.value)
}
// 审核
const offlineDataSubmit = () => {
  if (canDirectOnline.value) {
    const data = {
      eventId: offlineDetail.value.eventId,
      status: examineStatus.value, // 审核状态
      refuseReason: refuseReason.value // 拒绝理由
    }
    emit('directOnline', data)
    return
  }
  if (examineStatus.value === 4 && (!refuseReason.value || !refuseReason.value.trim())) {
    ElMessage({
      message: '请填写拒绝理由',
      type: 'warning',
      duration: 1000
    })
    return
  }
  const data = {
    eventId: offlineDetail.value.eventId,
    status: examineStatus.value, // 审核状态
    refuseReason: refuseReason.value // 拒绝理由
  }
  emit('offlineDataSubmit', data)
}
// 当关闭时
const onClose = () => {
  operateDialogVisible.value = false // 操作对话框
  showOfflineOperate.value = false // 下架
  showOfflineManage.value = false // 下架管理
  offlineReason.value = '' // 下架原因
  offlineDetail.value = {} // 最新下线
  offlineReasonError.value = false // 理由出错
  refuseReason.value = '' // 拒绝理由
  examineStatus.value = 3 // 审核
  showProductReview.value = false
  auditStatus.value = 3
  auditReason.value = ''
  canDirectOnline.value = false
}
// 上线审核
const onConfirAudit = () => {
  if (auditStatus.value === 4 && (!auditReason.value || !auditReason.value.trim())) {
    ElMessage({
      message: '请填写拒绝理由',
      type: 'warning',
      duration: 1000
    })
    return
  }
  const data = {
    status: auditStatus.value // 审核状态
  }
  if (auditStatus.value === 4) {
    Object.assign(data, {
      refuseReason: auditReason.value // 拒绝理由
    })
  }
  emit('auditOnlineSubmit', data)
}
defineExpose({ init })
</script>

<style lang="scss" scoped>
.components-offline-manage {
  :deep(.el-dialog__body) {
    max-height: 100vh;
    overflow-y: auto;
    padding: 10px 20px;
  }
}
// 下架管理-操作弹窗
.operate-dlg :deep(.el-dialog__wrapper) {
  display: flex;
  align-items: center;
  justify-content: center;
}
.operate-dlg {
  .offline {
    margin-bottom: 10px;
    .confirm-tips {
      margin-bottom: 20px;
      line-height: 1.5em;
    }
    .error {
      margin-top: 10px;
      color: #e43130;
    }
    .foot {
      display: block;
      width: 100%;
      text-align: right;
      margin-top: 30px;
    }
  }
  .off-shelf-mag {
    max-height: 70vh;
    overflow: auto;
    .msg {
      margin-bottom: 10px;
      .msg-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 20px;
        .tit {
          width: 80px;
          padding-right: 10px;
          align-self: flex-start;
          text-align-last: justify;
        }
        .int {
          flex: 1;
          word-break: break-word;
        }
      }
    }
    .log {
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      padding: 10px 0;
      p {
        margin: 0;
        padding: 0;
        line-height: 1.5em;
      }
      .log-tit {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .log-item:not(:last-child) {
        margin-bottom: 8px;
      }
      .ints {
        word-break: break-word;
        display: flex;
        margin: 10px 0;
        &:last-child {
          margin-bottom: 0;
        }
        .ints-content {
          flex: 1;
        }
      }
    }
    .dialog-footer {
      text-align: right;
      margin-bottom: 10px;
      margin-top: 30px;
    }
  }
  .product-review {
    max-height: 70vh;
    overflow: auto;
    .msg {
      margin-bottom: 10px;
      .msg-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 20px;
        .tit {
          width: 80px;
          padding-right: 10px;
          align-self: flex-start;
          text-align-last: justify;
        }
        .int {
          flex: 1;
          word-break: break-word;
        }
      }
    }
    .dialog-footer {
      text-align: right;
      margin-bottom: 10px;
      margin-top: 30px;
    }
  }
}
</style>
