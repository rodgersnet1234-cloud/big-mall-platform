<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="权益名称：">
            <el-input
              v-model="pageQuery.rightsName"
              placeholder="权益名称"
            />
          </el-form-item>
          <el-form-item label="权益类型：">
            <el-select
              v-model="pageQuery.rightsType"
              placeholder="权益类型"
            >
              <el-option
                :label="rightsTpyes[0]"
                value="0"
              />
              <el-option
                :label="rightsTpyes[1]"
                value="1"
              />
              <el-option
                :label="rightsTpyes[2]"
                value="2"
              />
              <el-option
                :label="rightsTpyes[3]"
                value="3"
              />
              <el-option
                :label="rightsTpyes[4]"
                value="4"
              />
              <el-option
                :label="rightsTpyes[5]"
                value="5"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onGetPage(true)"
            >
              查询
            </el-button>
            <el-button
              @click="onClearSearchInfo()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['user:rights:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('user.rights.customBenefits') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 权益名称 -->
          <el-table-column
            :label="$t('user.rights.rightsName')"
            prop="rightsName"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.rightsName }}</span>
            </template>
          </el-table-column>
          <!-- 权益图标 -->
          <el-table-column
            :label="$t('user.rights.rightsIcon')"
            prop="imgUrl"
            align="center"
            width="120px"
          >
            <template #default="{row}">
              <div
                class="table-cell-image"
                style="background: #f0f0f0;"
              >
                <ImgShow
                  :src="row.icon"
                  :class-list="['img']"
                />
              </div>
            </template>
          </el-table-column>
          <!-- 权益简介 -->
          <el-table-column
            :label="$t('user.rights.rightsIntroduce')"
            prop="description"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.description }}</span>
            </template>
          </el-table-column>
          <!-- 权益类型 -->
          <el-table-column
            :label="$t('user.rights.rightsType')"
            prop="rightsType"
            align="center"
          >
            <template #default="{row}">
              <span>{{ rightsTpyes[row.rightsType] }}</span>
            </template>
          </el-table-column>

          <!-- 顺序 -->
          <el-table-column
            :label="$t('user.rights.sequence')"
            prop="seq"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.seq }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['user:rights:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.rightsId)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-permission="['user:rights:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.rightsId)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <Pagination
      v-show="pageVO.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="onGetPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="onGetPage()"
    />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import * as api from '@/api/user/user-rights.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import AddOrUpdate from './add-or-update.vue'
let theData = null // 保存上次点击查询的请求条件
// 查询的参数
const pageQuery = ref({
  pageSize: 10,
  pageNum: 1,
  rightsName: ''
})

const pageVO = ref({ // 返回参数
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const pageLoading = ref(true) // loading
const searchParam = ref({}) // 查询参数
const addOrUpdateVisible = ref(false)
let isSubmit = false
const rightsTpyes = ref([
  $t('user.rights.customization'), $t('user.rights.rointsRebateMultiplier'),
  $t('user.rights.coupons'), $t('user.rights.bonusPoints'),
  $t('user.rights.memberDiscount'), $t('user.rights.packageType')
])
onMounted(() => {
  isSubmit = false
  onGetPage()
})
const onGetPage = (newData = false) => {
  if (newData || !theData) {
    theData = { ...pageQuery.value, ...searchParam }
  } else {
    theData.pageSize = pageQuery.value.pageSize
    theData.pageNum = pageQuery.value.pageNum
  }
  pageLoading.value = true
  api.page(theData).then(resPgeVO => {
    pageVO.value = resPgeVO
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (rightsId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.onInit(rightsId)
  })
}
const onDelete = (rightsId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => onDeleteById(rightsId))
}
const onDeleteById = (rightsId) => {
  if (isSubmit) {
    return
  }
  isSubmit = true
  api.remove(rightsId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => onGetPage()
    })
    isSubmit = false
  }).catch(() => {
    isSubmit = false
  })
}
// 清空搜索内容
const onClearSearchInfo = () => {
  pageQuery.value.rightsName = ''
  pageQuery.value.rightsType = null
}
</script>
