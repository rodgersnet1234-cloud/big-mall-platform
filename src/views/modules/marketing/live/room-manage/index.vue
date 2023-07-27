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
              type="text"
              clearable
              :placeholder="$t('liveRoom.roomName')"
            />
          </el-form-item>
          <el-form-item
            prop="anchorName"
            :label="$t('liveRoom.anchorNickname')+':'"
          >
            <el-input
              v-model="searchForm.anchorName"
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
          <el-form-item
            prop="roomTop"
            :label="$t('liveRoom.whetherToTop')+':'"
          >
            <el-select
              v-model="searchForm.roomTop"
              clearable
              :placeholder="$t('liveRoom.whetherToTop')"
            >
              <el-option
                v-for="item in roomTops"
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
              range-separator="—"
              format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
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
      <div class="tips">
        <span
          class="text"
        >{{
           $t("liveRoom.platformDeleteQuota")
         }}
          {{ totalNum }} 次</span>
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
            width="80"
          />
          <el-table-column
            prop="name"
            :label="$t('liveRoom.roomName')"
            width="200"
          >
            <template #default="scope">
              <span class="table-cell-text">
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="anchorName"
            :label="$t('liveRoom.anchorNickname')"
            width="200"
          >
            <template #default="scope">
              <span class="table-cell-text">
                {{ scope.row.anchorName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="anchorWechat"
            :label="$t('liveRoom.anchorWechat')"
            width="160"
          />
          <el-table-column
            prop="liveStatus"
            :label="$t('liveRoom.liveRoomStatus')"
            width="160"
          >
            <template #default="scope">
              <span
                v-if="scope.row.liveStatus === 101"
              >{{ $t('liveRoom.live') }}</span>
              <span v-if="scope.row.liveStatus === 102">未开始</span>
              <span v-if="scope.row.liveStatus === 103">已结束</span>
              <span v-if="scope.row.liveStatus === 104">{{ $t('liveRoom.prohibitPlay') }}</span>
              <span v-if="scope.row.liveStatus === 105">{{ $t('liveRoom.suspend') }}</span>
              <span v-if="scope.row.liveStatus === 106">{{ $t('liveRoom.abnormal') }}</span>
              <span v-if="scope.row.liveStatus === 107">{{ $t('liveRoom.expired') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="roomTop"
            :label="$t('liveRoom.whetherToTop')"
          >
            <template #default="scope">
              <span>{{ [$t('liveRoom.notPinned'),$t('liveRoom.pinned')][scope.row.roomTop] }}</span>
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
            prop="applyTime"
            label="申请时间"
            width="160"
          />
          <el-table-column
            label="操作"
            fixed="right"
            width="160"
            align="center"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  v-if="scope.row.roomTop === 0"
                  :disabled="scope.row.liveStatus !== 101 && scope.row.liveStatus !== 102"
                  @click="toTopHandle(scope.row)"
                >
                  {{ $t('liveRoom.top') }}
                </el-button>
                <el-button
                  v-if="scope.row.roomTop === 1"
                  @click="toTopHandle(scope.row)"
                >
                  {{ $t('liveRoom.cancelTopping') }}
                </el-button>
                <el-button
                  type="text"
                  @click="onDelete(scope.row.id)"
                >
                  删除
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
</template>

<script setup>
import * as http from '@/api/live/index.js'
import { ElMessageBox, ElMessage } from 'element-plus'

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
  anchorName: '',
  liveStatus: '',
  roomTop: ''
}) // 搜索
const onResetSearch = (formEl) => {
  formEl.resetFields()
  dateRange.value = []
}
const totalNum = ref(0)
// 时间区间
const dateRange = ref([])
const liveStatus = [
  {
    value: 101,
    label: $t('liveRoom.live')
  }, {
    value: 102,
    label: '未开始'
  }, {
    value: 103,
    label: '已结束'
  }, {
    value: 104,
    label: $t('liveRoom.prohibitPlay')
  }, {
    value: 105,
    label: $t('liveRoom.suspend')
  }, {
    value: 106,
    label: $t('liveRoom.abnormal')
  }, {
    value: 107,
    label: $t('liveRoom.expired')
  }
]
const roomTops = [
  {
    value: 1,
    label: $t('liveRoom.pinned')
  }, {
    value: 0,
    label: $t('liveRoom.notPinned')
  }
]

onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  getAddProdNum()
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

// 获取剩余可删除的数量
const getAddProdNum = () => {
  http.getRemoveRoomNum()
    .then((data) => {
      totalNum.value = data.totalNum
    })
}

const onDelete = (id) => {
  ElMessageBox.confirm($t('liveRoom.delUserTips') + ' ' + totalNum.value + '次' + ',' + '确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http.delLiveRoom(id
    ).then(() => {
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
const toTopHandle = (row) => {
  if (row.liveStatus !== 101 && row.liveStatus !== 102) {
    return
  }
  let str = $t('liveRoom.top')
  if (row.roomTop) {
    str = $t('liveRoom.cancelTopping')
  }
  ElMessageBox.confirm('确定进行' + ' ' + str + ' ' + '操作' + '?', '提示', {
    confirmButtonText: '提示',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http.putLiveRoomToTop(row.id).then(() => {
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
.page-live-room {
  .tips {
    margin-bottom: 20px;
    .text {
      color: #FF0000;
      font-size: 14px;
    }
  }
}
</style>
