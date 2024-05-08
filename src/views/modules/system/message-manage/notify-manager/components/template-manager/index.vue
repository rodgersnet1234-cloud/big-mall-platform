<template>
  <div class="mod-notify">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchParam"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="消息类型："
            prop="sendType"
          >
            <el-select
              v-model="searchParam.sendType"
              clearable
              placeholder="选择消息类型"
            >
              <el-option
                v-for="item in sendTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="发送类型："
            prop="msgType"
          >
            <el-select
              v-model="searchParam.msgType"
              clearable
              placeholder="选择发送类型"
            >
              <el-option
                v-for="item in searchTypesMessage"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="消息状态："
            prop="status"
          >
            <el-select
              v-model="searchParam.status"
              clearable
              placeholder="消息状态"
            >
              <el-option
                label="启用"
                value="1"
              />
              <el-option
                label="禁用"
                value="0"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageData.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
        >
          <!-- 创建时间 -->
          <!-- <el-table-column :label="$t('table.createTime')" prop="createTime" align="center">
            <template slot-scope="{row}">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column> -->
          <!-- 更新时间 -->
          <!-- <el-table-column :label="$t('table.updateTime')" prop="updateTime" align="center">
            <template slot-scope="{row}">
              <span>{{ row.updateTime }}</span>
            </template>
          </el-table-column> -->
          <!-- 通知内容 -->
          <el-table-column
            :label="$t('biz.notify.notifyContent')"
            prop="message"
            fixed="left"
            align="left"
            width="300"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.message }}</span>
            </template>
          </el-table-column>
          <!-- 发送类型 -->
          <el-table-column
            :label="$t('biz.notify.msgType')"
            prop="sendType"
            align="center"
            min-width="130"
          >
            <template #default="{row}">
              {{ row.sendType }}
              <!-- <span>{{ row.sendType }}</span> -->
            </template>
          </el-table-column>
          <!-- 通知方式集合用逗号分隔 1.短信 2.公众号 3.站内消息 -->
          <el-table-column
            :label="$t('biz.notify.canUseNotice')"
            prop="notifyTypes"
            align="center"
            min-width="150"
          >
            <template #default="{row}">
              <span class="table-cell-text">
                {{ row.notificationMethodList.join('/') }}
              </span>
            </template>
          </el-table-column>
          <!-- 短信模板code -->
          <el-table-column
            :label="$t('biz.notify.smsTemplateCode')"
            prop="templateCode"
            align="center"
            min-width="200"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.templateCode || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 公众号消息模板code -->
          <el-table-column
            :label="$t('biz.notify.publicTemplateCode')"
            prop="mpCode"
            align="center"
            min-width="200"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.mpCode || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 消息发送类型 0.自定义消息 1.为全部发送给用户消息，2.为发送给商家的 -->
          <el-table-column
            :label="$t('biz.notify.sendType')"
            prop="msgType"
            align="center"
            min-width="150"
          >
            <template #default="{row}">
              <span v-if="row.msgType === 1">{{ $t('biz.notify.sendToUser') }}</span>
              <span v-if="row.msgType === 2">{{ $t('biz.notify.sendToShop') }}</span>
              <span v-if="row.msgType === 3">{{ $t('biz.notify.sendToSupplier') }}</span>
            </template>
          </el-table-column>
          <!-- 1启用 0禁用 -->
          <el-table-column
            :label="$t('biz.notify.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.status === 0">禁用</span>
              <span v-else-if="row.status === 1">启用</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            fixed="right"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                v-permission="['notify:notify:update']"
                link
                type="primary"
                @click="onAddOrUpdate(row.templateId)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <el-button
                v-permission="['notify:notify:delete']"
                link
                type="primary"
                @click="onDelete(row.templateId)"
              >
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageData.total>0"
      v-model:page="searchParam.pageNum"
      v-model:limit="searchParam.pageSize"
      :total="pageData.total"
      @pagination="getPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>
<script setup>
import AddOrUpdate from './add-or-update.vue'
import Pagination from '@/components/pagination/index.vue'
import * as api from '@/api/biz/notify.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchTypesMessage = [
  { key: 1, name: '用户' },
  { key: 2, name: '商家' },
  { key: 3, name: '供应商' }
]

// loading
const pageLoading = ref(true)
// 查询参数
const searchParam = reactive({
  pageSize: 10,
  pageNum: 1,
  sendType: null,
  msgType: null,
  status: null
})

const sendTypes = [{
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
  value: 15,
  label: '验证码提醒'
}, {
  value: 16,
  label: $t('biz.notify.distributionApplySuccess')
}, {
  value: 106,
  label: '商家端的' + $t('biz.notify.productRemovalReminder')
}, {
  value: 107,
  label: '商家端的' + $t('biz.notify.commodityAuditResultReminder')
}, {
  value: 108,
  label: '商家端的' + $t('biz.notify.commissionCommodityChangeReminder')
}, {
  value: 102,
  label: '商家端的' + $t('biz.notify.userConfirmsReceiptNotification')
}, {
  value: 105,
  label: '商家端的' + $t('biz.notify.reminderOfPendingShipment')
}, {
  value: 110,
  label: '商家端的' + $t('biz.notify.reminderToBePurchased')
}, {
  value: 103,
  label: '商家端的' + $t('biz.notify.reminderOfPendingRefund')
}, {
  value: 104,
  label: '商家端的' + $t('biz.notify.reminderToNeReceived')
}, {
  value: 112,
  label: '商家端的' + $t('biz.notify.marketingCampaignRemovalReminder')
}, {
  value: 113,
  label: '商家端的' + $t('biz.notify.activityAuditResultReminder')
}, {
  value: 1006,
  label: '供应商端的' + $t('biz.notify.productRemovalReminder')
}, {
  value: 1007,
  label: '供应商端的' + $t('biz.notify.commodityAuditResultReminder')
}, {
  value: 1002,
  label: '供应商端的' + $t('biz.notify.userConfirmsReceiptNotification')
}, {
  value: 1005,
  label: '供应商端的' + $t('biz.notify.reminderOfPendingShipment')
}, {
  value: 1003,
  label: '供应商端的' + $t('biz.notify.reminderOfPendingRefund')
}, {
  value: 1004,
  label: '供应商端的' + $t('biz.notify.reminderToNeReceived')
}]
const tableSendTypes = [{
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
  value: 15,
  label: '验证码提醒'
}, {
  value: 16,
  label: $t('biz.notify.distributionApplySuccess')
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
  value: 104,
  label: $t('biz.notify.reminderToNeReceived')
}, {
  value: 112,
  label: $t('biz.notify.marketingCampaignRemovalReminder')
}, {
  value: 113,
  label: $t('biz.notify.activityAuditResultReminder')
}, {
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
  value: 1004,
  label: $t('biz.notify.reminderToNeReceived')
}]
const addOrUpdateVisible = ref(false)

// 返回参数
let pageData = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
onMounted(() => {
  getPage()
})

const searchFormRef = ref(null)
// 清除过滤
const onResetSearch = (formEl) => {
  formEl.resetFields()
  getPage()
}
let tempSearchForm = null
const getPage = (newData = false) => {
  pageLoading.value = true
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchParam }
  } else {
    tempSearchForm.pageSize = searchParam.pageSize
    tempSearchForm.pageNum = searchParam.pageNum
  }
  api.page(tempSearchForm).then(pageVO => {
    pageLoading.value = false
    if (pageVO != null) {
      pageData.list = pageVO.list
      pageData.total = pageVO.total
      pageData.pages = pageVO.pages
    } else {
      pageData = {
        list: [],
        total: 0,
        pages: 0
      }
    }
    if (pageData.list && pageData.list.length > 0) {
      pageData.list.forEach(item => {
        item.notificationMethodList = []
        if (item.app) {
          item.notificationMethodList.push($t('biz.notify.applet'))
        }
        if (item.sms) {
          item.notificationMethodList.push($t('biz.notify.shortMessage'))
        }
        if (item.sub) {
          item.notificationMethodList.push($t('biz.notify.officialAccount'))
        }
        tableSendTypes.forEach(obj => {
          if (obj.value === item.sendType) {
            item.sendType = obj.label
          }
        })
      })
    }
  }).catch(() => {
    pageLoading.value = false
  })
}
const addOrUpdateRef = ref()
// 新增 / 修改
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}

const onDelete = (templateId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(templateId))
}
const deleteById = (templateId) => {
  api.deleteById(templateId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

</script>
<style lang="scss" scoped>
.mod-notify {
  .main-content {
    margin-top: 20px;
  }
}
</style>
