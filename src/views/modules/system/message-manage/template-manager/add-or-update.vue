<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.templateId ? $t('table.add') : $t('table.edit')"
    :close-on-click-modal="false"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      :label-width="language == 'en' ? '220px' : '130px'"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('biz.notify.notifyContent')"
        prop="message"
      >
        <el-input v-model="dataForm.message" />
      </el-form-item>
      <el-form-item
        :label="$t('biz.notify.notifyType')"
        prop="templateTypeList"
      >
        <el-checkbox-group
          v-model="dataForm.templateTypeList"
          @change="checkboxChange"
        >
          <el-checkbox :label="1">
            {{
              $t('biz.notify.msgNotifyFree')
            }}
          </el-checkbox>
          <el-checkbox
            v-if="type === 1"
            :label="2"
          >
            {{
              $t('biz.notify.publicNotify')
            }}
          </el-checkbox>
          <el-checkbox :label="3">
            {{
              $t('biz.notify.appletMessage')
            }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        v-if="boxcheckedOne === 1"
        :label="$t('biz.notify.smsTemplateCode')"
        prop="templateCode"
      >
        <el-input v-model="dataForm.templateCode" />
      </el-form-item>
      <el-form-item
        v-if="type === 1 && boxcheckedTwo === 1"
        :label="$t('biz.notify.publicTemplateCode') + '：'"
        prop="mpCode"
      >
        <el-input v-model="dataForm.mpCode" />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
      >
        <el-radio
          v-model="dataForm.status"
          :label="1"
        >
          启用
        </el-radio>
        <el-radio
          v-model="dataForm.status"
          :label="0"
        >
          禁用
        </el-radio>
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
import * as api from '@/api/biz/notify.js'
import useStore from 'element-plus/es/components/table/src/store/index'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const isCheck = ref(false)
const isConfirm = ref(false)
const type = ref(1) // 0:供应商  1:用户消息  2：商家消息
const boxcheckedOne = ref(0) // 1:显示短信  0:不显示
const boxcheckedTwo = ref(0) // 1:显示公众号 0:不显示
const dataForm = reactive({
  templateId: null,
  sendType: null,
  msgType: 1,
  templateTypeList: [],
  message: null,
  status: 1,
  templateCode: null,
  mpCode: null,
  createTime: null,
  notifyTypes: ''
})
const validateMessage = (rule, value, callback) => {
  if (!value) {
    callback(new Error($t('biz.notify.notifyContenNoNull')))
  } else {
    callback()
  }
}
const dataRule = reactive({
  sendType: [
    { required: true, message: $t('biz.notify.seleMsgType'), trigger: 'blur' }
  ],
  message: [
    { required: true, message: $t('biz.notify.notifyContenNoNull'), trigger: 'blur' },
    { validator: validateMessage, trigger: 'blur' }
  ],
  templateTypeList: [
    // { required: true, message: $t('biz.notify.seleNotifyType'), trigger: 'blur' }
  ]
  // templateCode: [
  //   { required: true, message: '短信模板code不能为空', trigger: 'blur' }
  // ],
  // mpCode: [
  //   { required: true, message: '短信模板code不能为空', trigger: 'blur' }
  // ]
})

const options = ref([])
// 用户选项
const userOptions = [{
  value: 0,
  label: $t('biz.notify.sendToCustom')
}, {
  value: 1,
  label: $t('biz.notify.orderPay')
}, {
  value: 2,
  label: $t('biz.notify.paySuccNotify')
}, {
  value: 3,
  label: $t('biz.notify.merAgreeRefund')
}, {
  value: 4,
  label: $t('biz.notify.refusedRefund')
}, {
  value: 5,
  label: $t('biz.notify.wriOffRem')
}, {
  value: 6,
  label: $t('biz.notify.shipRem')
}, {
  value: 7,
  label: $t('biz.notify.groupFailRem')
}, {
  value: 8,
  label: $t('biz.notify.groupSuccRem')
}, {
  value: 9,
  label: $t('biz.notify.startGroupRem')
}, {
  value: 10,
  label: $t('biz.notify.memUpRem')
}, {
  value: 11,
  label: $t('biz.notify.timeoutRem')
}, {
  value: 12,
  label: $t('biz.notify.register')
}, {
  value: 13,
  label: $t('biz.notify.login')
}, {
  value: 14,
  label: $t('biz.notify.updatePassword')
}, {
  value: 15,
  label: $t('biz.notify.vaild')
}, {
  value: 16,
  label: $t('biz.notify.distributionApplySuccess')
}]
// 商家选项
const merchantOptions = [{
  value: 104,
  label: '买家已退货提醒'
}, {
  value: 106,
  label: $t('biz.notify.productRemovalReminder')
}, {
  value: 107,
  label: $t('biz.notify.commodityAuditResultReminder')
}, {
  value: 108,
  label: $t('biz.notify.commissionCommodityChangeReminder')
}, {
  value: 102,
  label: $t('biz.notify.userConfirmsReceiptNotification')
}, {
  value: 105,
  label: $t('biz.notify.reminderOfPendingShipment')
}, {
  value: 110,
  label: $t('biz.notify.reminderToBePurchased')
}, {
  value: 103,
  label: $t('biz.notify.reminderOfPendingRefund')
}, {
  value: 111,
  label: $t('biz.notify.reminderToNeReceived')
}, {
  value: 112,
  label: $t('biz.notify.marketingCampaignRemovalReminder')
}, {
  value: 113,
  label: $t('biz.notify.activityAuditResultReminder')
}]
// 供应商选项
const supplierOptions = [{
  value: 1006,
  label: $t('biz.notify.productRemovalReminder')
}, {
  value: 1007,
  label: $t('biz.notify.commodityAuditResultReminder')
}, {
  value: 1002,
  label: $t('biz.notify.userConfirmsReceiptNotification')
}, {
  value: 1005,
  label: $t('biz.notify.reminderOfPendingShipment')
}, {
  value: 1003,
  label: $t('biz.notify.reminderOfPendingRefund')
}, {
  value: 1111,
  label: $t('biz.notify.reminderToNeReceived')
}]

const appStore = useAppStore()
const language = computed(() => {
  return appStore.language === 'zh' ? 1 : 2
})
const dataFormRef = ref()
const init = (templateId) => {
  isConfirm.value = false
  isCheck.value = false
  dataForm.templateTypeList = []
  dataForm.templateId = templateId || 0
  boxcheckedOne.value = 0
  boxcheckedTwo.value = 0
  dataForm.templateCode = ''
  dataForm.mpCode = ''
  visible.value = true
  updateOptions()
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.templateId) {
      api.get(dataForm.templateId).then(data => {
        dataForm.templateId = data.templateId
        dataForm.sendType = data.sendType
        dataForm.msgType = data.msgType
        dataForm.templateTypeList = data.templateTypeList
        dataForm.message = data.message
        dataForm.status = data.status
        dataForm.templateCode = data.templateCode
        dataForm.mpCode = data.mpCode
        dataForm.createTime = data.createTime
        dataForm.notifyTypes = data.mpCode

        // updateType()
        type.value = data.msgType
        updateOptions()
        checkboxChange()
        dataForm.templateTypeList = data.templateTypeList
      })
    }
  })
}
const msg = (text) => {
  ElMessage({
    message: text,
    type: 'error',
    duration: 1500
  })
  isCheck.value = true
}
const checkboxChange = (val) => {
  if (val) dataForm.notifyTypes = val.join(',')
  boxcheckedOne.value = 0
  boxcheckedTwo.value = 0
  dataForm.templateTypeList.forEach(item => {
    if (item === 1) {
      boxcheckedOne.value = 1
    } else if (item === 2) {
      boxcheckedTwo.value = 1
    }
  })
}
/**
 * 根据消息的推送对象，更改数据
 */
const changeSendType = () => {
  dataForm.templateTypeList = []
  boxcheckedOne.value = 0
  boxcheckedTwo.value = 0
  dataForm.templateCode = ''
  dataForm.mpCode = ''
  dataForm.sendType = ''
  // updateType()
  updateOptions()
}
const updateOptions = () => {
  if (type.value === 1) {
    options.value = userOptions
  }
  if (type.value === 2) {
    options.value = merchantOptions
  }
  if (type.value === 3) {
    options.value = supplierOptions
  }
}
const updateType = () => {
  const sendType = dataForm.sendType
  options.value.forEach(item => {
    if (sendType === item.value) {
      type.value = sendType > 100 ? 2 : 1
      console.log('type', type)
      if (sendType === 12 || sendType === 13 || sendType === 14 || sendType === 15) {
        type.value = 3
      }
      if (type.value === 2 || type.value === 3) {
        dataForm.templateTypeList.forEach(temp => {
          if (temp === 1) {
            dataForm.templateTypeList = [1]
          }
        })
      }
    }
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      isCheck.value = false
      // if (dataForm.templateTypeList === undefined || dataForm.templateTypeList.length <= 0) {
      //   msg($t('biz.notify.errorTip1'))
      // }
      dataForm.templateTypeList.forEach(type => {
        if (type === 1 && dataForm.templateCode == null) {
          msg($t('biz.notify.notifyTempNoNull'))
        }
        if (type === 2 && dataForm.mpCode == null) {
          msg($t('biz.notify.errorTip2'))
        }
      })
      if (isCheck.value || isConfirm.value) {
        return
      }
      isConfirm.value = true
      dataForm.msgType = type.value
      const request = dataForm.templateId ? api.update(dataForm) : api.save(dataForm)
      request.then(data => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
          }
        })
      }).catch(() => {
        console.log('boom')
        isConfirm.value = false
      })
      // http({
      //   url: http.adornUrl('/platform/notifyTemplate'),
      //   method: dataForm.templateId ? 'put' : 'post',
      //   data: http.adornData(dataForm)
      // }).then(({ data }) => {
      //   ElMessage({
      //     message: $t('remindPop.success'),
      //     type: 'success',
      //     duration: 1500,
      //     onClose: () => {
      //       visible = false
      //       emit('refreshDataList')
      //     }
      //   })
      // }).catch(() => {
      //   console.log('boom')
      //   isConfirm = false
      // })
    }
  })
}
defineExpose({ init })
</script>

<style lang="scss" scoped>
.send-tips {
  margin-left: 15px;
}
</style>
