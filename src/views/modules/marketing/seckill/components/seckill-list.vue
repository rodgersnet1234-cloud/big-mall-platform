<template>
  <div class="components-seckill-list app-container">
    <!-- 新的秒杀页 -->
    <div class="seckill-container">
      <div class="headline">
        <h3>整点秒杀</h3>
      </div>
      <div class="content-box">
        <div class="content">
          <div class="message">
            操作提示:
          </div>
          <div class="description">
            <p>1、点击参与即可编辑参与整点秒杀的商品</p>
            <p>2、秒杀活动结束时间默认持续两小时</p>
            <p>3、各个场次活动商品不可重叠</p>
            <p>
              4、抢购商品金额不可设置为0元
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="searchForm.type !== '1'"
        class="search"
      >
        <el-date-picker
          v-model="searchForm.specTime"
          class="search-frame"
          type="date"
          width="140px"
          placeholder="请选择日期"
        />
        <el-button
          type="primary"
          @click="onSearch(true)"
        >
          搜索
        </el-button>
      </div>
      <div class="tabs">
        <el-tabs
          v-model="searchForm.type"
          @tab-change="onTabsClick"
        >
          <el-tab-pane
            v-for="item in tabsType"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          />
        </el-tabs>
      </div>

      <el-table
        v-loading="pageLoading"
        :data="pageData.dataList"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        style="width: 100%;"
      >
        <el-table-column
          prop="startTime"
          label="开始时间"
          style="width: 25%; color: rgba(0, 0, 0, 0.85)"
        />
        <el-table-column
          prop="selectedLot"
          label="场次"
          style="width: 50%;color: rgba(0, 0, 0, 0.85);"
        >
          <template #default="{row}">
            {{ timeTable[row.selectedLot].label }}
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          style="width: 25%; color: rgba(0, 0, 0, 0.85)"
        />
        <el-table-column
          prop="joinShopNum"
          label="参与商家数"
          style="width: 25%; color: rgba(0, 0, 0, 0.85)"
        />
        <el-table-column
          prop="prodNum"
          label="参与商品数"
          style="width: 25%; color: rgba(0, 0, 0, 0.85)"
        />
        <el-table-column
          label="操作"
          align="center"
          style="width: 25%; color: rgba(0, 0, 0, 0.85)"
        >
          <template #default="{row}">
            <div>
              <el-link
                v-permission="['seckill:seckill:info']"
                type="primary"
                :underline="false"
                @click="seckillDetail(row)"
              >
                详情
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--  秒杀设置 -->
      <!-- 分页条 -->
      <pagination
        v-show="pageData.total > 0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        :total="pageData.total"
        @pagination="getPageData"
      />
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/seckill/seckill.js'

const tabsType = ref([{
  value: 0,
  label: '即将开场'
}, {
  value: 1,
  label: '进行中'
}, {
  value: 2,
  label: '已结束'
}])
const timeTable = ref([{
  value: 0,
  label: '00:00',
  active: false
}, {
  value: 1,
  label: '01:00',
  active: false
}, {
  value: 2,
  label: '02:00',
  active: false
}, {
  value: 3,
  label: '03:00',
  active: false
}, {
  value: 4,
  label: '04:00',
  active: false
}, {
  value: 5,
  label: '05:00',
  active: false
}, {
  value: 6,
  label: '06:00',
  active: false
}, {
  value: 7,
  label: '07:00',
  active: false
}, {
  value: 8,
  label: '08:00',
  active: true
}, {
  value: 9,
  label: '09:00',
  active: true
}, {
  value: 10,
  label: '10:00',
  active: true
}, {
  value: 11,
  label: '11:00',
  active: true
}, {
  value: 12,
  label: '12:00',
  active: true
}, {
  value: 13,
  label: '13:00',
  active: true
}, {
  value: 14,
  label: '14:00',
  active: true
}, {
  value: 15,
  label: '15:00',
  active: true
}, {
  value: 16,
  label: '16:00',
  active: true
}, {
  value: 17,
  label: '17:00',
  active: true
}, {
  value: 18,
  label: '18:00',
  active: false
}, {
  value: 19,
  label: '19:00',
  active: false
}, {
  value: 20,
  label: '20:00',
  active: false
}, {
  value: 21,
  label: '21:00',
  active: false
}, {
  value: 22,
  label: '22:00',
  active: false
}, {
  value: 23,
  label: '23:00',
  active: false
}])

let tempSearchForm = null // 保存上次点击查询的请求条件
// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  type: 0,
  specTime: ''
})
const pageLoading = ref(true)
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})

onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData) {
    searchForm.specTime = new Date(searchForm.specTime).getTime()
  }
  tempSearchForm = { ...searchForm }
  pageLoading.value = true
  if (searchForm.type !== '2') {
    api.listSeckill(tempSearchForm).then(data => {
      pageData.value.dataList = data.list
      pageData.value.pages = data.pages
      pageData.value.total = data.total
      pageLoading.value = false
    })
  } else {
    api.listEndSeckill(tempSearchForm).then(data => {
      pageData.value.dataList = data.list
      pageData.value.pages = data.pages
      pageData.value.total = data.total
      pageLoading.value = false
    })
  }
}

const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  getPageData(newData)
}

// 点击导航栏切换
// eslint-disable-next-line no-unused-vars
const onTabsClick = (tab, event) => {
  searchForm.pageNum = 1
  getPageData()
}

// 详情按钮
const router = useRouter()
const seckillDetail = (row) => {
  router.push({
    path: '/marketing/seckill/components/seckill-detail',
    query: {
      startTime: new Date(row.startTime).getTime(),
      endTime: new Date(row.endTime).getTime()
    }
  })
}
</script>
<style lang="scss" scoped>
.seckill-container {
  .headline {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    line-height: 1;
    position: relative;
    // margin-bottom: 16px;
    h3 {
      font-size: 18px;
      color: #333;
      font-weight: 400;
    }
  }
  .content-box {
    margin-bottom: 16px;
    background-color: #cde3f8;
    border: 1px solid #7cbdfa;
    .content {
      padding: 15px;
      .description {
        font-size: 14px;
        line-height: 7px;
      }
    }
  }
  .search {
    margin: 20px 0;
    .search-frame {
      width: 160px;
      margin-right: 12px;
    }
  }
}
</style>
