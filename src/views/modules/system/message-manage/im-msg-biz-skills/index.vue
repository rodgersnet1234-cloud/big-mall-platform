<template>
  <div class="mod-shop-notice">
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            prop="keywords"
            label="关键字:"
          >
            <el-input
              v-model="searchForm.keywords"
              type="text"
              placeholder="关键字"
            />
          </el-form-item>
          <el-form-item
            prop="content"
            label="回复内容:"
          >
            <el-input
              v-model="searchForm.content"
              type="text"
              placeholder="回复内容"
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
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['platform:imMsgBizSkills:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          新增
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            label="序号"
            type="index"
            align="left"
            width="80"
          />
          <el-table-column
            prop="keywords"
            width="210"
            label="关键字"
          >
            <template #defult="row">
              {{ row.keywords }}
            </template>
          </el-table-column>

          <el-table-column
            prop="content"
            min-width="380"
            label="回复内容"
          >
            <template #default="{row}">
              {{ row.content }}
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            width="300"
          >
            <template #default="{row}">
              {{ row.remark || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="230"
          >
            <template #default="{row}">
              <div class="text-btn-con">
                <el-button
                  v-permission="['platform:imMsgBizSkills:update']"
                  link
                  type="primary"
                  @click="onAddOrUpdate(row.id)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['platform:imMsgBizSkills:delete']"
                  link
                  type="primary"
                  @click="onDelete(row.id)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-if="dataList.length"
        class="pagination-container"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import addOrUpdate from './add-or-update.vue'
import * as http from '@/api/im-msg-biz-skills'
import { ElMessage, ElMessageBox } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件
let theParams = null // 保存上次点击查询的请求条件
const dataList = ref([])
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const searchForm = reactive({
  keywords: '',
  content: ''
})
const searchFormRef = ref(null)
const dateRange = ref([])
const dataListLoading = ref(false)

onMounted(() => {
  getDataList(page)
})

const getDataList = (pageParam, newData = false) => {
  if (newData || !tempSearchForm) {
    theParams = JSON.parse(JSON.stringify(searchForm))
    tempSearchForm = {
      pageNum: pageParam == null ? page.currentPage : pageParam.currentPage,
      pageSize: pageParam == null ? page.pageSize : pageParam.pageSize
    }
  } else {
    tempSearchForm.pageNum = pageParam == null ? page.currentPage : pageParam.currentPage
    tempSearchForm.pageSize = pageParam == null ? page.pageSize : pageParam.pageSize
  }
  http.getList(Object.assign(tempSearchForm, theParams)).then((data) => {
    dataList.value = data.list
    page.total = data.total
    dataListLoading.value = false
  })
}

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
// 新增 / 修改
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(id)
  })
}
const dataListSelections = ref([])
// 删除
const onDelete = (id) => {
  const ids = id ? [id] : dataListSelections.value.map(item => {
    return item.id
  })
  ElMessageBox.confirm('确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http.delSkills(id)
      .then(() => {
        if (dataList.length === 1 && page.currentPage > 1) {
          page.currentPage--
        }
        page.total = page.total - ids.length
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            refreshChange()
          }
        })
      })
  })
}

// 刷新回调用
const refreshChange = () => {
  getDataList(page)
}
const onSearch = (newData = false) => {
  page.currentPage = 1
  page.pageSize = 10
  getDataList(page, newData)
}
const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList()
}
const onPageChange = (val) => {
  page.currentPage = val
  getDataList()
}
const onResetSearch = (formName) => {
  formName.resetFields()
  dateRange.value = []
}

</script>

<style lang="scss" scoped>
.mod-shop-notice {
  background-color: #fff;
  padding: 20px;

  .pagination-container {
    background: #fff;
    padding: 32px 16px;
    text-align: right;
  }
}
</style>
