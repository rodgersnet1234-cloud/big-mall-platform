<template>
  <div class="page-live-user app-container">
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
            prop="nickName"
            label="用户昵称:"
          >
            <el-input
              v-model="searchForm.nickName"
              type="text"
              clearable
              placeholder="用户昵称"
            />
          </el-form-item>
          <el-form-item
            prop="anchorWechat"
            label="微信号:"
          >
            <el-input
              v-model="searchForm.anchorWechat"
              type="text"
              clearable
              placeholder="微信号"
            />
          </el-form-item>
          <el-form-item
            prop="roles"
            label="角色:"
          >
            <el-select
              v-model="searchForm.roles"
              clearable
              placeholder="角色"
            >
              <el-option
                v-for="item in roles"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
    <!-- 搜索栏end -->
    <div class="main main-content">
      <div class="operation-bar">
        <el-button
          type="primary"
          @click="onAddOrUpdate(0)"
        >
          新增
        </el-button>
        <span class="tips">（{{ $t("liveRoom.platformRemainLimit") }}{{ totalNum }} 次）</span>
      </div>
      <div class="table-con">
        <el-table
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            label="序号"
            type="index"
            fixed
            :width="$t('language')=='语言'?80:180"
          />
          <el-table-column
            prop="nickName"
            label="用户昵称"
            fixed
            min-width="280"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="anchorWechat"
            label="微信号"
            min-width="270"
          />
          <el-table-column
            prop="anchorWechat"
            :label="$t('liveRoom.anchorWechat')"
            min-width="270"
          />
          <el-table-column
            prop="roles"
            label="角色"
            min-width="160"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="200"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            min-width="200"
          />
          <el-table-column
            align="center"
            label="操作"
            width="120"
            fixed="right"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  type="text"
                  @click="onDelete(scope.row.liveUserId)"
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

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPageData"
    />
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import * as http from '@/api/live/index.js'
import AddOrUpdate from './add-or-update.vue'

let tempSearchForm = null // 保存上次点击查询的请求条件
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  nickName: '',
  anchorWechat: '',
  roles: null
}) // 搜索
const pageLoading = ref(false)
const totalNum = ref(0)
const deleteTotalNum = ref(0)
const addOrUpdateVisible = ref(false)
const roles = [
  {
    label: $t('liveRoom.liveUser'),
    value: 1
  }, {
    label: $t('liveRoom.liveOperators'),
    value: 3
  }, {
    label: $t('liveRoom.anchor'),
    value: 2
  }
]
const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
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
  http.getLiveUserPage(tempSearchForm).then((data) => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref(null)
// 新增 / 修改
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}

// 获取剩余可新增得数量
const getAddProdNum = () => {
  http.getLiveUserAddProdNum()
    .then((data) => {
      totalNum.value = data.totalNum
      deleteTotalNum.value = data.deleteTotalNum
    })
}
const onDelete = (id) => {
  ElMessageBox.confirm($t('liveRoom.delUserTips') + ' ' + deleteTotalNum.value + '次' + ',' + '确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http.delLiveUser(id).then(() => {
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
.page-live-user {
  .tips {
    color: #FF0000;
    font-size: 14px;
  }
}
</style>
