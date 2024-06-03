<template>
  <div class="page-manage-check">
    <div class="manage-check">
      <div class="title">
        财务对账
      </div>
      <div class="search search-bar ">
        <el-form
          clearable
          :inline="true"
          :model="searchForm"
          class="demo-form-inline from"
          @submit.prevent
        >
          <div class="form-item">
            <el-form-item
              label="店铺名称："
              label-width="120px"
            >
              <el-input
                v-model="searchForm.shopName"
                clearable
                style="width: 240px;"
                placeholder="请输入店铺名称"
              />
            </el-form-item>
            <el-form-item
              label="时间范围："
              label-width="120px"
              class="date-range-param"
            >
              <cm-date-picker
                v-model="dateRangeParam"
                @date-change="dealDatetime"
              />
            </el-form-item>
            <el-form-item label-width="120px">
              <el-button
                class="search-btn"
                type="primary"
                @click="search"
              >
                <el-icon class="icon-search">
                  <Search />
                </el-icon>
                搜索
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="table">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="收入对账"
            name="revenue"
          >
            <Revenue
              ref="revenueRef"
              :search-form="searchForm"
              :date-range-param="dateRangeParam"
            />
          </el-tab-pane>
          <el-tab-pane
            label="退款对账"
            name="refunds"
          >
            <Refunds
              ref="refundsRef"
              :search-form="searchForm"
              :date-range-param="dateRangeParam"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import Revenue from './components/revenue.vue'
import Refunds from './components/refunds.vue'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import CmDatePicker from '../components/cm-date-picker/index.vue'

const activeName = ref('revenue') // 对账类型 0支出 1 收入
const searchForm = ref({
  startTime: '',
  endTime: '',
  shopName: ''
})
const dateRangeParam = ref([moment().add(-6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')])

onMounted(() => {
  dealDatetime()
  search()
})

const handleClick = (tab) => {
  activeName.value = tab.props.name
  getData()
}

const revenueRef = ref(null)
const refundsRef = ref(null)
const getData = () => {
  if (activeName.value === 'revenue') {
    revenueRef.value?.onGetDataDetail(JSON.parse(JSON.stringify(searchForm.value)))
  } else if (activeName.value === 'refunds') {
    refundsRef.value?.onGetDataDetail(JSON.parse(JSON.stringify(searchForm.value)))
  }
}
const search = () => {
  if (!dateRangeParam.value) {
    return ElMessage.error('请选择时间范围')
  }
  getData()
}
const dealDatetime = () => {
  searchForm.value.startTime = dateRangeParam.value ? dateRangeParam.value[0] : ''
  searchForm.value.endTime = dateRangeParam.value ? dateRangeParam.value[1] : ''
}

</script>

<style lang="scss" scoped>
.page-manage-check {
  background: #F5F5F5;
  width: 100%;

  :deep(.el-select .el-input) {
    width: 120px;
  }

  .manage-check {
    background: #FFFFFF;
    width: 100%;
    padding: 24px;

    .title {
      font-size: 18px;
      margin-bottom: 16px;
    }

    :deep(.date-range-param .el-form-item__label:before) {
      color: #F56C6C;
      margin-right: 4px;
      content: '*';
    }

    .table {
      position: relative;
    }

    .search {
      background: #F5F5F5;
      padding: 20px;
      margin-bottom: 30px;

      .search-btn {
        margin-left: 10px;
      }
    }

    .icon-search {
      bottom: 1px;
      right: 5px;
    }
  }
}

</style>
