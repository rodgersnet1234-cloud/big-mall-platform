<template>
  <div class="app-container index-img">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="状态：">
            <el-select
              v-model="pageQuery.status"
              placeholder="状态"
              clearable
            >
              <el-option
                label="正常"
                value="1"
              />
              <el-option
                label="禁用"
                value="0"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="平台：">
            <el-select
              v-model="pageQuery.imgType"
              placeholder="平台"
              clearable
            >
              <el-option
                label="移动端"
                value="0"
              />
              <el-option
                label="PC端"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="search()"
            >
              查询
            </el-button>
            <el-button
              @click="clearSearchInfo()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['platform:indexImg:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
          <el-tooltip
            class="item"
            effect="dark"
            content="每个用户端的最大轮播图数量为10"
            placement="top"
          >
            <el-icon><Warning /></el-icon>
          </el-tooltip>
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          row-key="imgId"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%;"
        >
          <!-- 图片 -->
          <el-table-column
            label="图片"
            prop="imgUrl"
            align="center"
            width="300"
          >
            <template #default="{row}">
              <!-- <img :src="(row.imgUrl).indexOf('http')===-1 ? resourcesUrl + row.imgUrl : row.imgUrl" class="img"> -->
              <ImgShow
                :src="row.imgUrl"
                :class-list="['img']"
              />
            </template>
          </el-table-column>
          <!-- 顺序 -->
          <el-table-column
            label="顺序"
            prop=""
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.seq }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            label="状态"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.status === 0"
                type="danger"
              >{{ $t("product.category.disable") }}</span>
              <span
                v-else
              >{{ $t("product.category.normal") }}</span>
            </template>
          </el-table-column>
          <!-- 平台 -->
          <el-table-column
            label="平台"
            prop="icon"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['移动端', 'PC端'][row.imgType] }}</span>
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
                v-permission="['platform:indexImg:update']"
                link
                type="primary"
                @click="onAddOrUpdate(row.imgId)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <el-button
                v-permission="['platform:indexImg:delete']"
                link
                type="primary"
                @click="onDelete(row.imgId)"
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
import Pagination from '@/components/Pagination/index.vue'
import AddOrUpdate from './components/add-or-update.vue'
import * as api from '@/api/platform/index-img.js'
import { ElMessageBox, ElMessage } from 'element-plus'

// const resourcesUrl = process.env.VUE_APP_RESOURCES_URL
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  name: null,
  attrType: null,
  status: null,
  imgType: null
})

// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const addOrUpdateVisible = ref(false)
const searchParam = reactive({})
onMounted(() => {
  getPage()
})

const getPage = () => {
  pageLoading.value = true
  api.page({ ...pageQuery, ...searchParam }).then(data => {
    Object.assign(pageVO, data)
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref('')
const onAddOrUpdate = (imgId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(imgId)
  })
}

const onDelete = (imgId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(imgId))
}

const deleteById = (imgId) => {
  api.deleteById(imgId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

/**
 * 搜索
 */
const search = () => {
  pageQuery.pageNum = 1
  pageQuery.status = pageQuery.status || null
  pageQuery.imgType = pageQuery.imgType || null
  getPage()
}

const clearSearchInfo = () => {
  pageQuery.status = null
  pageQuery.imgType = null
}
</script>

<style lang="scss">
.app-container.index-img {
  // .el-table .cell {
  //   line-height: 13px!important;
  // }
  .el-table--enable-row-transition .el-table__body td {
    height: 100px;
    line-height: 100px;
  }
  .img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 80px;
    object-fit: contain;
  }
}
</style>

<style scoped>
</style>
