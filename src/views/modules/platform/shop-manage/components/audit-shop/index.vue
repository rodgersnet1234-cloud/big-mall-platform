<template>
  <div class="container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        :inline="true"
        :model="searchParam"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="店铺名称">
            <el-input
              v-model="searchParam.shopName"
              placeholder="店铺名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              {{ $t('table.search') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          :key="activeName"
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          row-key="imgId"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 店铺名称 -->
          <el-table-column
            label="店铺名称"
            prop="shopName"
            align="left"
          >
            <template #default="{row}">
              <span>{{ row.shopName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 店铺logo -->
          <el-table-column
            label="店铺logo"
            prop="imgUrl"
            align="center"
            width="200"
          >
            <template
              #default="{row}"
            >
              <div
                v-if="row.shopLogo"
                class="table-cell-image"
              >
                <img-show
                  :src="row.shopLogo"
                  :class-list="['img']"
                />
              </div>
            </template>
          </el-table-column>
          <!-- 店铺简介 -->
          <el-table-column
            label="店铺简介"
            prop="intro"
            align="center"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.intro || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 申请时间 -->
          <el-table-column
            label="申请时间"
            prop="createTime"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.createTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 店铺状态 shopStatus (-1:已删除 0: 停业中 1:营业中 2:平台下线 3:开店待审核 4:店铺申请中 6.上线待审核 7.系统下线 -->
          <el-table-column
            label="店铺状态"
            prop="shopStatus"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.shopStatus === -1"
                type="danger"
              >未开通</span>
              <span
                v-if="row.shopStatus === 0"
                type="danger"
              >停业中</span>
              <span
                v-if="row.shopStatus === 1"
                type="success"
              >营业中</span>
              <span
                v-if="row.shopStatus === 2"
                type="danger"
              >平台下线</span>
              <span
                v-if="row.shopStatus === 3"
                type="warning"
              >开店待审核</span>
              <span
                v-if="row.shopStatus === 4"
                type="warning"
              >店铺申请中</span>
              <span
                v-if="row.shopStatus === 5"
                type="danger"
              >上线待审核</span>
              <span
                v-if="row.shopStatus === 7"
                type="danger"
              >系统下线</span>
            </template>
          </el-table-column>
          <!-- 审核状态 status (0 未审核 1已通过 -1未通过) -->
          <el-table-column
            label="审核状态"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.status === 0"
                type="warning"
              >未审核</span>
              <span
                v-else
                type="success"
              >已审核</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                v-permission="['platform:auditShop:audit']"
                type="primary"
                link
                @click="onAddOrUpdate(row.shopId)"
              >
                审核
              </el-button>
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
  </div>
</template>

<script setup>
import { checkPermission } from '@/directive/permission/index.js'
import * as api from '@/api/platform/audit-shop.js'

defineProps({
  activeName: {
    type: String,
    default: '1'
  }
})

const vPermission = checkPermission

let tempSearchForm = null // 保存上次点击查询的请求条件

// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
const searchParam = reactive({
  shopName: '', // 店铺名称
  noticeMobile: '', // 接收短信号码
  shopStatus: 3
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
onMounted(() => {
  getPage()
})

const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchParam }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(res => {
    pageVO.value = res
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const router = useRouter()
const onAddOrUpdate = (shopId) => {
  router.push('/platform/shop-detail?shopId=' + shopId + '&pageType=' + 'toAudit')
}

</script>

<style lang="scss" scoped>
::v-deep(.el-table--enable-row-transition .el-table__body td) {
  height: 100px;
  line-height: 100px;
}
::v-deep(.el-table__empty-block) {
  border-bottom: 1px solid #dfe6ec !important;
}
</style>
