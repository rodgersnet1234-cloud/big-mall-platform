<template>
  <div class="mod--station">
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="demo-form-inline"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            prop="shopName"
            label="店铺名称:"
            class="search-form-item"
          >
            <el-input
              v-model="searchForm.shopName"
              type="text"
              placeholder="店铺名称"
            />
          </el-form-item>
          <el-form-item
            prop="stationName"
            label="门店:"
            class="search-form-item"
          >
            <el-input
              v-model="searchForm.stationName"
              type="text"
              placeholder="门店"
            />
          </el-form-item>
          <el-form-item
            prop="addr"
            label="地址:"
            class="search-form-item"
          >
            <el-input
              v-model="searchForm.addr"
              type="text"
              placeholder="地址"
            />
          </el-form-item>
          <el-form-item
            prop="account"
            label="账号:"
            class="search-form-item"
          >
            <el-input
              v-model="searchForm.account"
              type="text"
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item
            prop="status"
            label="状态:"
            class="search-form-item"
          >
            <el-select
              v-model="searchForm.status"
              placeholder="状态"
            >
              <el-option
                label="关闭"
                :value="0"
              />
              <el-option
                label="营业"
                :value="1"
              />
              <el-option
                label="平台下线"
                :value="2"
              />
              <el-option
                label="审核中"
                :value="3"
              />
              <el-option
                label="审核不通过"
                :value="4"
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
              @click="onResetSearch('searchForm')"
            >
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="table-con">
        <el-table
          ref="stationListTableRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            fixed
            type="index"
            label="序号"
            width="80"
          />

          <el-table-column
            fixed
            prop="shopName"
            label="店铺名称"
            width="260"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.shopName || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="stationName"
            label="门店"
            width="260"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.stationName || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="addr"
            label="地址"
            width="260"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.addr }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="mobile"
            label="电话号码"
            width="180"
          >
            <template #default="scope">
              <span
                v-if="scope.row.mobilePrefix && scope.row.mobilePrefix !== null"
              >{{ scope.row.mobilePrefix }}-</span>
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="account"
            label="账号"
            width="auto"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.account || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="status"
            label="状态"
            width="auto"
          >
            <template #default="scope">
              <span
                v-if="scope.row.status === 4"
                class="tag-text"
              >审核不通过</span>
              <span
                v-else-if="scope.row.status === 3"
                class="tag-text"
              >审核中</span>
              <span
                v-else-if="scope.row.status === 2"
                class="tag-text"
              >平台下线</span>
              <span
                v-else-if="scope.row.status === 1"
                class="tag-text"
              >营业</span>
              <span
                v-else
                class="tag-text"
              >关闭</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="230"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  link
                  type="primary"
                  @click="onAddOrUpdate(scope.row.stationId)"
                >
                  查看详情
                </el-button>
                <el-button
                  v-if="scope.row.status<2"
                  v-permission="['delivery:station:offline']"
                  link
                  type="primary"
                  @click="offlineSeckillHandle(scope.row)"
                >
                  违规下架
                </el-button>
                <el-button
                  v-if="scope.row.status > 1"
                  v-permission="['delivery:station:offline']"
                  link
                  type="primary"
                  @click="stationAuditHandle(scope.row.stationId)"
                >
                  {{ scope.row.status === 2?'下架管理':scope.row.status === 3?'待审核':'审核不通过' }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条 -->
      <pagination
        v-show="page.total>0"
        v-model:page="page.pageNum"
        v-model:limit="page.pageSize"
        :total="page.total"
        @pagination="getDataList()"
      />
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
    <!-- 商品审核弹窗 -->
    <OfflineAudit
      v-if="stationAuditVisible"
      ref="offlineAuditRef"
      select-url="/platform/station/get_offline_handle_event_by_station_id"
      update-url="/platform/station/audit_station"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './station-add-or-update.vue'
import OfflineAudit from '@/components/offline-audit/index.vue'
import * as api from '@/api/station/index'
import { ElMessage, ElMessageBox } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件
const dataList = ref([])
const page = reactive({
  total: 0, // 总页数
  pageNum: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const searchForm = reactive({
  shopName: '',
  stationName: '',
  addr: '',
  account: '',
  status: ''
}) // 搜索
const dataListLoading = ref(false)
const addOrUpdateVisible = ref(false)
const stationAuditVisible = ref(false)

onMounted(() => {
  getDataList()
})

const getDataList = (pageParam, newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  }
  dataListLoading.value = true
  api.page(Object.assign({
    pageNum: pageParam == null ? page.pageNum : pageParam.pageNum,
    pageSize: pageParam == null ? page.pageSize : pageParam.pageSize
  },
  tempSearchForm
  )).then((data) => {
    dataList.value = data.list
    page.total = data.total
    dataListLoading.value = false

    // 末尾页数据为空重新请求
    if (!dataList.length && data.current > 1) {
      page.currentPage = 1
      getDataList()
    }
  })
}
// 新增 / 修改
const addOrUpdateRef = ref('')
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}
// 下线活动
const offlineSeckillHandle = (row) => {
  // '确定对活动[' + row.stationName + ']进行下线操作？如是，请填写下线理由'
  ElMessageBox.prompt('确定对门店[' + row.stationName + ']进行下线操作？如是，请填写下线理由', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /\s\S+|S+\s|\S/, // 不能全为空格 空字符串
    inputErrorMessage: '下线原因不能为空',
    inputValidator: (value) => {
      if (value.length > 100) {
        return '下线原因不能超过100字'
      }
    }
  }).then((obj) => {
    api.offlineStation({
      handleId: row.stationId,
      offlineReason: obj.value || null
    }).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          getDataList(page)
        }
      })
    })
  }).catch(() => {})
}
// 弹窗处理
const offlineAuditRef = ref(null)
const stationAuditHandle = (id) => {
  stationAuditVisible.value = true
  nextTick(() => {
    offlineAuditRef.value?.init(id)
  })
}
/**
 * 刷新回调
 */
const refreshChange = () => {
  getDataList(page)
}
const onSearch = (newData = false) => {
  page.currentPage = 1
  getDataList(page, newData)
}
/**
 * 重置表单
 * @param {String} formName 表单名称
 */
const prodName = ref('')
const isTop = ref('')
const categoryId = ref('')
const searchFormRef = ref()
const onResetSearch = () => {
  searchFormRef.value.resetFields()
  prodName.value = ''
  isTop.value = ''
  categoryId.value = null
}

</script>
<style lang="scss" scoped>
.mod--station{
  background-color: #fff !important;
  padding: 20px;
}
</style>
