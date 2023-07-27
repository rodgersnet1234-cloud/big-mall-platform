<template>
  <div class="page-live-prod app-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            prop="name"
            label="商品名称:"
          >
            <el-input
              v-model="searchForm.name"
              type="text"
              clearable
              placeholder="商品名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch(true)"
            >
              搜索
            </el-button>
            <el-button
              @click="onResetSearch(searchFormRef)"
            >
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main main-content">
      <!-- 搜索栏end -->
      <div class="table-con">
        <div class="tips">
          <span class="text">提交审核直播商品次数：平台剩余限额{{ totalNum }}次</span>
        </div>
        <el-table
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
        >
          <el-table-column
            label="序号"
            type="index"
            width="80"
          />
          <el-table-column
            align="left"
            prop="coverPic"
            label="商品信息"
            width="400"
          >
            <template #default="scope">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow :src="scope.row.coverPic" />
                </div>
                <span class="table-cell-text">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="商品现价"
          />
          <el-table-column
            prop="status"
            label="状态"
          >
            <template #default="scope">
              <span v-if="scope.row.status === -1">商品已删除</span>
              <span v-if="scope.row.status === 0">未审核</span>
              <span v-if="scope.row.status === 1">审核中</span>
              <span v-if="scope.row.status === 2">审核通过</span>
              <span v-if="scope.row.status === 3">审核未通过</span>
              <span v-if="scope.row.status === 4">违规商品</span>
              <span v-if="scope.row.status === 5">下架</span>
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            prop="createTime"
            label="商家添加商品时间"
          >
            <template #default="{row}">
              <span>{{ row.createTime || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            prop="verifyTime"
            label="商家提交审核时间"
          >
            <template #default="{row}">
              <span>{{ row.verifyTime || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            prop="successTime"
            label="商品审核通过时间"
          >
            <template #default="{row}">
              <span>{{ row.successTime || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100"
            fixed="right"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  type="text"
                  :disabled="scope.row.status === 1"
                  @click="onDelete(scope.row.liveProdStoreId,scope.row.status)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="pageData.total>0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        :total="pageData.total"
        @pagination="getPageData()"
      />
    </div>
  </div>
</template>

<script setup>
import * as http from '@/api/live/index.js'
import { ElMessageBox, ElMessage } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件

const shopNum = ref(0)
const totalNum = ref(0)
const deleteShopNum = ref(0)
const deleteTotalNum = ref(0)
// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const searchFormRef = ref(null)
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  name: ''
})
const pageLoading = ref(false)
// 重置表单
const onResetSearch = (formEl) => {
  // if (!formEl) return
  formEl.resetFields()
}

onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  getAddProdNum()
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  http.getProdStorePage(tempSearchForm).then((data) => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 获取剩余可新增得数量
const getAddProdNum = () => {
  http.getAddProdNum()
    .then((data) => {
      shopNum.value = data.shopNum
      totalNum.value = data.totalNum
      deleteShopNum.value = data.deleteShopNum
      deleteTotalNum.value = data.deleteTotalNum
    })
}

// 删除
const onDelete = (id, status) => {
  if (status === 1) {
    return
  }
  ElMessageBox.confirm('审核通过的商品删除将消耗次数，平台剩余删除直播商品的次数为 ' + deleteTotalNum.value + '次' + ',' + '确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http.delLiveProdStoreId(id)
      .then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            getPageData()
          }
        })
      })
  })
}
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  getPageData(newData)
}
</script>
<style lang="scss" scoped>
.page-live-prod {
  .tips {
    margin-bottom: 20px;
    .text {
      color: #FF0000;
      font-size: 14px;
    }
  }
}
</style>
