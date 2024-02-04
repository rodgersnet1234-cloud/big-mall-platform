<template>
  <div class="page-live-room app-container">
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
            label="直播间名称:"
          >
            <el-input
              v-model="searchForm.name"
              style="width: 200px;"
              type="text"
              clearable
              :placeholder="$t('liveRoom.roomName')"
            />
          </el-form-item>
          <el-form-item
            prop="nickName"
            :label="$t('liveRoom.anchorNickname')+':'"
          >
            <el-input
              v-model="searchForm.nickName"
              style="width: 200px;"
              type="text"
              clearable
              :placeholder="$t('liveRoom.anchorNickname')"
            />
          </el-form-item>
          <el-form-item
            prop="liveStatus"
            :label="$t('liveRoom.liveRoomStatus')+':'"
          >
            <el-select
              v-model="searchForm.liveStatus"
              clearable
              :placeholder="$t('liveRoom.liveRoomStatus')"
            >
              <el-option
                v-for="item in liveStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('liveRoom.liveBroadcastTime')+':'">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
              :default-time="defaultTime"
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
    <!-- 搜索栏end -->
    <div class="main main-content">
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
            width="80"
          />
          <el-table-column
            prop="name"
            :label="$t('liveRoom.roomName')"
          >
            <template #default="scope">
              <span class="table-cell-text">
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="nickName"
            :label="$t('liveRoom.anchorNickname')"
            width="240"
          >
            <template #default="scope">
              <span class="table-cell-text">
                {{ scope.row.nickName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userMobile"
            :label="$t('liveRoom.anchorMobile')"
            width="160"
          />
          <el-table-column
            prop="liveStatus"
            :label="$t('liveRoom.liveRoomStatus')"
            width="160"
          >
            <template #default="scope">
              <span v-if="scope.row.liveStatus === 1">{{ $t('liveRoom.live') }}</span>
              <span v-if="scope.row.liveStatus === 0">未开始</span>
              <span v-if="scope.row.liveStatus === 2">已结束</span>
              <span v-if="scope.row.liveStatus === 3">已暂停</span>
              <span v-if="scope.row.liveStatus === -1">违规下架</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="startTime"
            :label="$t('liveRoom.LiveStartTime')"
            width="160"
          />
          <el-table-column
            prop="endTime"
            :label="$t('liveRoom.LiveOverTime')"
            width="160"
          />
          <el-table-column
            label="操作"
            fixed="right"
            width="240"
            align="center"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  link
                  type="primary"
                  @click="onAddOrUpdate(scope.row)"
                >
                  {{ $t("liveRoom.view") }}
                </el-button>
                <el-button
                  v-if="scope.row.liveStatus !== -1 && scope.row.liveStatus !== 2"
                  v-permission="['platform:liveRoom:offline']"
                  link
                  type="primary"
                  @click="onOfflineHandle(scope.row)"
                >
                  {{ $t('liveRoom.violationOffShelf') }}
                </el-button>
                <el-button
                  v-if="scope.row.liveStatus === -1"
                  link
                  type="primary"
                  @click="getOfflineRemark(scope.row.remark)"
                >
                  {{ $t('liveRoom.reasonForOffline') }}
                </el-button>
                <el-button
                  v-if="scope.row.liveStatus !== 1"
                  v-permission="['platform:liveRoom:delete']"
                  link
                  type="primary"
                  @click="onDelete(scope.row.roomId)"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条 -->
      <pagination
        v-show="pageData.total>0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        :total="pageData.total"
        @pagination="getPageData()"
      />
    </div>
  </div>
  <add-or-update
    v-if="addOrUpdateVisible"
    ref="addOrUpdateRef"
    @refresh-data-list="refreshChange"
  />
</template>

<script setup>
import * as http from '@/api/live/index.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import AddOrUpdate from './add-or-update.vue'
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]

let tempSearchForm = null // 保存上次点击查询的请求条件
// 返回参数
const pageLoading = ref(false)
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const searchFormRef = ref(null)
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  name: '',
  nickName: '',
  liveStatus: '',
  roomTop: ''
}) // 搜索
const onResetSearch = (formEl) => {
  formEl.resetFields()
  dateRange.value = []
}
// 时间区间
const dateRange = ref([])
const liveStatus = [
  {
    value: 1,
    label: $t('liveRoom.live')
  }, {
    value: 0,
    label: '未开始'
  }, {
    value: 2,
    label: '已结束'
  }, {
    value: 3,
    label: '已暂停'
  }, {
    value: -1,
    label: '违规下架'
  }
]

onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    searchForm.startTime = dateRange.value === null ? null : dateRange.value[0] // 开始时间
    searchForm.endTime = dateRange.value === null ? null : dateRange.value[1] // 结束时间
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  http.getLiveRoomPage(tempSearchForm).then((data) => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const onDelete = (id) => {
  ElMessageBox.confirm('确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http.delLiveRoom(id).then(() => {
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
const refreshChange = () => {
  getPageData()
}
// 下线活动
const onOfflineHandle = (row) => {
  let tips = $t('liveRoom.offlineTip')
  tips = tips.replace('ACTIVITYNAME', row.name)
  ElMessageBox.prompt(tips, $t('liveRoom.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    inputPattern: /\s\S+|S+\s|\S/, // 不能全为空格 空字符串
    inputErrorMessage: $t('liveRoom.offlineReasonTip'),
    inputValidator: (value) => {
      if (value.length > 100) {
        return $t('liveRoom.offlineReasonTip1')
      }
    }
  }).then((obj) => {
    http.offlineLiveRoom({ roomId: row.roomId, remark: obj.value }).then(() => {
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

// 查看下线原因
const getOfflineRemark = (remark) => {
  ElMessageBox.confirm(remark, $t('liveRoom.reasonForOffline'), {
    confirmButtonText: $t('table.confirm')
  })
}
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
/**
 * 新增 / 修改
 * @param data
 */
const onAddOrUpdate = (data) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(data)
  })
}
</script>
