<template>
  <div class="app-container components-seckill-detail">
    <!-- 新的秒杀页 -->
    <div class="top-container">
      <div class="title">
        {{ startTime }}场次 结束时间:{{ endTime }}
      </div>
    </div>
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="商品名称"
            prop="keyword"
          >
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入商品名称"
              class="search-input"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPageData(true)"
            >
              查询
            </el-button>
            <el-button
              @click="onResetSearch"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column
            class="table-item"
            :label="$t('group.prodInfo')"
            min-width="200px"
          >
            <template #default="{row}">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow :src="row.mainImgUrl" />
                </div>
                <div class="table-cell-text">
                  {{ row.name }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopName"
            label="店铺名称"
            style="width: 300px;"
          />
          <el-table-column
            prop="seckillOriginStocks"
            label="秒杀总库存"
            min-width="90"
          />
          <el-table-column
            prop="priceFee"
            label="市场价"
          />
          <el-table-column
            prop="categoryName"
            label="分类"
          />
          <el-table-column
            prop="seckillTotalStocks"
            label="现有库存"
          />
          <el-table-column
            prop="maxNum"
            label="限购数量"
          >
            <template #default="{row}">
              <span v-if="row.maxNum !== -1">{{ row.maxNum }}</span>
              <span v-else-if="!row.maxNum || row.maxNum === -1">不限</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="seckillPrice"
            label="抢购价"
          />
          <el-table-column
            :label="$t('seckill.status')"
            prop="status"
            align="center"
          >
            <!-- 秒杀状态(0:未启用、1:启用、2:违规下架、3:等待审核) -->
            <template #default="{row}">
              <el-tag
                v-if="row.status === 0"
                type="warning"
              >
                {{
                  $t("seckill.invalidated")
                }}
              </el-tag>
              <el-tag
                v-else-if="row.status === 1"
              >
                {{
                  $t("seckill.open")
                }}
              </el-tag>
              <el-tag
                v-else-if="row.status === 2"
                type="danger"
              >
                {{
                  $t("table.platformDown")
                }}
              </el-tag>
              <el-tag
                v-else-if="row.status === 3"
              >
                {{
                  $t("table.waitReview")
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
          >
            <template #default="{row}">
              <el-button
                link
                type="primary"
                @click="onAddOrUpdate(row.seckillId)"
              >
                {{ $t("table.view") }}
              </el-button>
              <el-button
                v-if="row.status > 0 && row.status < 2"
                v-permission="['seckill:seckill:offline']"
                link
                type="primary"
                class="el-icon-bottom"
                style="color:red"
                @click="onOfflineManage(row, 'offline')"
              >
                下线活动
              </el-button>
              <el-button
                v-if="row.status === 2 || row.status === 3"
                v-permission="['seckill:seckill:audit']"
                link
                type="primary"
                class="el-icon-document-checked"
                @click="onOfflineManage(row, 'offlineManage')"
              >
                {{ row.status === 2 ? '下线管理' : '审核申请' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  秒杀设置 -->
    <!-- 分页条 -->
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPageData()"
    />
    <!-- 下架管理 -->
    <offline-manage
      v-if="operateDialogVisible"
      ref="offlineDataRef"
      @on-or-off-the-shelf="onOrOffTheShelf"
      @offline-data-submit="offlineDataSubmit"
    />
  </div>
</template>

<script setup>
import OfflineManage from '@/components/offline-manage/index.vue'
import AddOrUpdate from '../add-or-update.vue'
import Big from 'big.js'
import * as api from '@/api/seckill/seckill.js'
import { ElMessage } from 'element-plus'

const seckillId = ref(true)
const addOrUpdateVisible = ref(false)
const operateDialogVisible = ref(false)
// 查询的参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  keyword: ''
})
// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const startTime = ref(null)
const endTime = ref(null)
const startTimestamp = ref(null)
const isSubmit = ref(false)

onMounted(() => {
  startTimestamp.value = useRoute().query.startTime
  const startDate = new Date(Number(useRoute().query.startTime))
  const endDate = new Date(Number(useRoute().query.endTime))
  startTime.value = dateFormat('YYYY-mm-dd HH:MM', startDate)
  endTime.value = dateFormat('YYYY-mm-dd HH:MM', endDate)
  getPageData()
})

const getPageData = () => {
  isSubmit.value = false
  pageLoading.value = true
  searchForm.startTimestamp = startTimestamp
  api.listSeckillSpuByTime({ ...searchForm }).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
    if (pageData.value.dataList) {
      pageData.value.dataList.forEach(data => {
        data.priceFee = new Big(data.priceFee).div(100).toFixed(2)
        data.seckillPrice = new Big(data.seckillPrice).div(100).toFixed(2)
      })
    }
  }).catch(() => {
    pageLoading.value = false
  })
}
// 新增 / 修改
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id, startTime, endTime)
  })
}

const offlineDataRef = ref(null)
/**
 * 商品违规下架操作
 */
const onOfflineManage = (row, key) => {
  operateDialogVisible.value = true
  seckillId.value = row.seckillId
  if (key === 'offline') {
    nextTick(() => {
      offlineDataRef.value?.init('offline')
    })
  } else if (key === 'offlineManage') {
    getOfflineHandleEvent(row.seckillId)
  }
}

const searchFormRef = ref(null)
const onResetSearch = () => {
  searchFormRef.value.resetFields()
  getPageData()
}

const dateFormat = (fmt, date) => {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

// 获取最新下线商品的事件
const getOfflineHandleEvent = (rowSeckillId) => {
  api.getOfflineHandleEvent(rowSeckillId).then((data) => {
    nextTick(() => {
      offlineDataRef.value?.init('offlineManage', data)
    })
  })
}

// 下线
const onOrOffTheShelf = (data) => {
  const param = {
    handleId: seckillId.value,
    offlineReason: data
  }
  api.offline(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '秒杀已下架',
      type: 'success',
      duration: 1000,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
/**
 * 上架申请审核
 */
const offlineDataSubmit = (data) => {
  const param = {
    handleId: seckillId.value,
    eventId: data.eventId,
    status: data.status, // 审核状态
    refuseReason: data.refuseReason // 拒绝理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.apply(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}

</script>
<style lang="scss" scoped>
.components-seckill-detail {
  .top-container {
    .title {
      margin-bottom: 15px;
    }
  }
}
</style>
