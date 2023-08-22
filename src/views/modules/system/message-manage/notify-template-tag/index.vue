<template>
  <div class="app-container mod-notify-template-tag">
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['notify:notifyTemplateTag:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
        >
          <!-- 通知内容 -->
          <el-table-column
            label="通知内容"
            prop="message"
            align="left"
            width="380"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.message }}</span>
            </template>
          </el-table-column>
          <!-- 标签列表 -->
          <el-table-column
            label="标签列表"
            prop="templateCode"
            align="left"
            width="380"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.templateCode || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 通知方式集合用逗号分隔 1.短信 2.公众号 3.站内消息 -->
          <el-table-column
            :label="$t('biz.notify.canUseNotice')"
            prop="notifyTypes"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.sub"
                class="tag-text"
              >{{ $t('biz.notify.officialAccount') }}</span>
              <span
                v-if="row.sms"
                class="tag-text"
              >{{ $t('biz.notify.shortMessage') }}</span>
              <span
                v-if="row.app"
                class="tag-text"
              >{{ $t('biz.notify.applet') }}</span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            :label="$t('table.createTime')"
            prop="createTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <!-- 更新时间 -->
          <el-table-column
            :label="$t('table.updateTime')"
            prop="updateTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['notify:notifyTemplateTag:update']"
                  link
                  type="primary"
                  @click="onAddOrUpdate(row.templateId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['notify:notifyTemplateTag:delete']"
                  link
                  type="primary"
                  @click="onDelete(row.templateId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
                <el-button
                  v-permission="['notify:notifyTemplateTag:sendMsg']"
                  link
                  type="primary"
                  @click="onSendTagMsg(row)"
                >
                  {{ '推送消息' }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
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
import Pagination from '@/components/pagination/index.vue'
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/biz/notify-template-tag'
import { ElMessage, ElMessageBox } from 'element-plus'
// loading
const pageLoading = ref(true)
const searchParam = {}
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const getPage = () => {
  pageLoading.value = true
  api.page({ ...pageQuery, ...searchParam }).then(res => {
    pageVO.list = res.list
    pageVO.total = res.total
    pageVO.pages = res.pages
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref()
const addOrUpdateVisible = ref(false)
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
const onSendTagMsg = (row) => {
  if (!row.templateCode) {
    ElMessage({
      message: $t('table.tagListIsEmpty'),
      type: 'error',
      duration: 1500
    })
    return
  }
  api.sendMsg(row.templateId).then(data => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  }).catch((e) => {
    console.log(e)
  })
}
onMounted(() => {
  getPage()
})
</script>

<style lang="scss" scoped>
.mod-notify-template-tag {
  .main-content {
    margin-top: 0;
  }
}
</style>
