<template>
  <div class="app-container mod-user-manage">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="searchParam"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="用户昵称：">
            <el-input
              v-model="searchParam.nickName"
              placeholder="用户昵称"
              maxlength="30"
              clearable
            />
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input
              v-model="searchParam.phone"
              placeholder="手机号"
              maxlength="11"
              clearable
            />
          </el-form-item>
          <!-- 会员类型 -->
          <el-form-item :label="$t('user.userManager.memberType') + '：'">
            <el-cascader
              ref="memberCascaderRef"
              v-model="memberLevelVal"
              :options="typeOptions"
              :props="{ checkStrictly: true }"
              clearable
              @change="onHandleMemberTypeChange"
            />
          </el-form-item>
          <!-- 状态 -->
          <el-form-item :label="$t('user.userManager.status') + '：'">
            <el-select
              v-model="searchParam.status"

              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- 注册时间区间筛选 -->
          <el-form-item label="注册时间: ">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"

              :range-separator="$t('date.tip')"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
            />&nbsp;&nbsp;&nbsp;
            <el-button
              @click="onSetDateRange(1)"
            >
              {{ $t('date.t') }}
            </el-button>
            <el-button
              @click="onSetDateRange(2)"
            >
              {{ $t('date.y') }}
            </el-button>
            <el-button
              @click="onSetDateRange(3)"
            >
              {{ $t('date.n') }}
            </el-button>
            <el-button
              @click="onSetDateRange(4)"
            >
              {{ $t('date.m') }}
            </el-button>
          </el-form-item>
          <!-- 会员标签 -->
          <el-form-item
            label="会员标签："
            prop="userTag"
            label-width="120"
          >
            <el-select
              v-model="userTag"
              v-el-select-loadmore="onLoadMore"
              value-key="userTagId"
              multiple
              clearable
              collapse-tags
              placeholder="请选择会员标签"
            >
              <el-option
                v-for="item in tagList"
                :key="item.userTagId"
                :label="item.tagName"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="onSearchParamChange(true)"
            >
              查询
            </el-button>
            <el-button
              icon="el-icon-delete"
              @click="onClearSearchInfo()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <!-- 修改用户成长值 -->
        <el-button
          v-permission="['user:user:updateGrowth']"
          type="primary"
          :disabled="dataListSelections.length <= 0"
          @click="onUpdateGrowth()"
        >
          {{ $t('user.userManager.updateGrowth') }}
        </el-button>
        <!-- 修改用户积分 -->
        <el-button
          v-permission="['user:user:updateScore']"
          type="primary"
          :disabled="dataListSelections.length <= 0"
          @click="onUpdateScore()"
        >
          {{ $t('user.userManager.updateScore') }}
        </el-button>
        <!-- 修改用户余额 1批量 -->
        <el-button
          v-if="paySettlementType !== 1"
          v-permission="['user:user:modifyBalance']"
          type="primary"
          :disabled="dataListSelections.length <= 0"
          @click="onUpdateBalance(null,1)"
        >
          {{ $t('user.userManager.modifyBalance') }}
        </el-button>
        <!-- 送优惠券 -->
        <el-button
          v-permission="['user:user:sendCoupons']"
          type="primary"
          :disabled="dataListSelections.length <= 0"
          @click="onUpdateCoupon()"
        >
          {{ $t('user.userManager.sendCoupons') }}
        </el-button>
        <!-- 打标签 -->
        <el-button
          v-permission="['user:user:tagging']"
          type="primary"
          :disabled="dataListSelections.length <= 0"
          @click="onUpdateTags()"
        >
          {{ $t('user.userManager.tagging') }}
        </el-button>
        <!-- 导入会员 -->
        <el-button
          v-permission="['user:user:import']"
          type="primary"
          :disabled="importDisabled"
          @click="importUser()"
        >
          {{ $t('user.userManager.userImport') }}
        </el-button>
        <!-- 导出会员信息 -->
        <el-button
          v-permission="['user:user:export']"
          type="primary"
          :disabled="exportDisabled"
          @click="onExportUser()"
        >
          {{ $t('user.userManager.export') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          row-key="userId"
          highlight-current-row
          style="width: 100%;"
          @selection-change="onSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <!-- 用户昵称 -->
          <el-table-column
            label="用户昵称"
            align="center"
            fixed
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.nickName }}</span>
            </template>
          </el-table-column>
          <!-- 用户头像 -->
          <el-table-column
            label="用户头像"
            prop="pic"
            align="center"
            width="80px;"
            fixed
          >
            <template #default="{row}">
              <img
                v-if="!row.pic"
                src="@/assets/images/user_img.jpg"
                class="img"
                alt="暂无图片"
              >
              <img
                v-else
                :src="(row.pic).indexOf('http')===-1 ? resourcesUrl + row.pic : row.pic"
                class="img"
                style="width:60px;height:60px"
                alt=""
              >
            </template>
          </el-table-column>
          <!-- 手机号 -->
          <el-table-column
            label="手机号"
            align="center"
            width="100"
          >
            <template #default="{row}">
              <span class="phone-number">{{ formatPhoneNumber(row.phone) }}</span>
            </template>
          </el-table-column>
          <!-- 会员等级 -->
          <el-table-column
            label="普通会员等级"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.levelName }}</span>
            </template>
          </el-table-column>
          <!-- 会员类型 -->
          <el-table-column
            label="付费会员等级"
            prop="vipLevelName"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.vipLevelName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 成长值 -->
          <el-table-column
            label="成长值"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.growth }}</span>
            </template>
          </el-table-column>
          <!-- 用户积分 -->
          <el-table-column
            label="用户积分"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.score }}</span>
            </template>
          </el-table-column>
          <!-- 累计积分 -->
          <el-table-column
            label="累计积分"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.sumScore }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            label="状态"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.status === 0"
                type="danger"
              >{{ $t("user.userManager.disable") }}</span>
              <span
                v-if="row.status === 1"
              >{{ $t("user.userManager.normal") }}</span>
            </template>
          </el-table-column>

          <!-- 消费金额 -->
          <el-table-column
            label="消费金额"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.consAmount }}</span>
            </template>
          </el-table-column>
          <!-- 实付金额 -->
          <el-table-column
            label="实付金额"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.actualAmount }}</span>
            </template>
          </el-table-column>
          <!-- 消费次数 -->
          <el-table-column
            label="消费次数"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.consTimes }}</span>
            </template>
          </el-table-column>
          <!-- 平均折扣 -->
          <el-table-column
            label="平均折扣"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.averDiscount }}</span>
            </template>
          </el-table-column>
          <!-- 充值金额 -->
          <el-table-column
            label="充值金额"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.rechargeAmount }}</span>
            </template>
          </el-table-column>
          <!-- 充值次数 -->
          <el-table-column
            label="充值次数"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.rechargeTimes }}</span>
            </template>
          </el-table-column>
          <!-- 退款金额 -->
          <el-table-column
            label="退款金额"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.afterSaleAmount }}</span>
            </template>
          </el-table-column>
          <!-- 退款次数 -->
          <el-table-column
            label="退款次数"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.afterSaleTimes }}</span>
            </template>
          </el-table-column>
          <!-- 当前余额 -->
          <el-table-column
            label="当前余额"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.currentBalance }}</span>
            </template>
          </el-table-column>
          <!-- 累计余额 -->
          <el-table-column
            label="累计余额"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.sumBalance }}</span>
            </template>
          </el-table-column>
          <!-- 注册时间 -->
          <el-table-column
            label="注册时间"
            align="center"
            width="180"
          >
            <template #default="{row}">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            fixed="right"
            :label="$t('table.actions')"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <!-- 会员详情 -->
              <el-button
                v-permission="['user:user:info']"
                type="primary"
                link
                @click="onAddOrUpdate(row.userId)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <!-- 修改余额 -->
              <el-button
                v-if="paySettlementType !== 1"
                v-permission="['user:user:modifyBalance']"
                type="primary"
                link
                @click.stop="onUpdateBalance(row.userId, 0, row.currentBalance)"
              >
                {{ $t('user.userManager.modifyBalance') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <Pagination
      v-show="pageVO.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="pagination"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="onGetPage()"
    />
    <!-- 弹窗, 修改用户成长值 -->
    <UpdateGrowth
      v-if="updateGrowthVisible"
      ref="updateGrowthRef"
      @refresh-data-list="onGetPage()"
    />
    <!-- 弹窗，修改用户积分 -->
    <UpdateScore
      v-if="updateScoreVisible"
      ref="updateScoreRef"
      @refresh-data-list="onGetPage()"
    />
    <!-- 弹窗，修改用户余额 -->
    <UpdateBalance
      v-if="updateBalanceVisible"
      ref="updateBalanceRef"
      @refresh-data-list="onGetPage()"
    />
    <!-- 弹窗，给用户发平台优惠券 -->
    <SendCoupon
      v-if="updateCouponVisible"
      ref="updateCouponRef"
      :get-way="1"
      @refresh-data-list="onGetPage()"
    />
    <!-- 弹窗，批量给用户打标签 -->
    <UpdateTag
      v-if="updateTagsVisible"
      ref="updateTagsRef"
      @refresh-data-list="onGetPage()"
    />
    <!-- 导入用户信息 -->
    <ImportUser
      v-if="importUserVisible"
      ref="importUserRef"
      @refresh-data-list="onGetPage()"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import * as api from '@/api/user/user-manager'
import * as levelApi from '@/api/user/level'
import * as tagApi from '@/api/user/user-tag'
import AddOrUpdate from './add-or-update.vue'
import UpdateGrowth from './components/update-user-growth.vue'
import UpdateScore from './components/update-user-score.vue'
import UpdateBalance from './components/update-user-balance.vue'
import SendCoupon from './components/update-user-copon.vue'
import UpdateTag from './components/update-user-tags.vue'
import ImportUser from './components/excel-user-import.vue'
import moment from 'moment'

const vElSelectLoadmore = {
  mounted: (el, binding) => {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    SELECTWRAP_DOM?.addEventListener('scroll', function () {
      /**
       * scrollHeight 获取元素内容高度(只读)
       * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
       * clientHeight 读取元素的可见高度(只读)
       * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
       * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
       */
      const condition =
        document.documentElement.scrollHeight - document.documentElement.scrollTop <=
        document.documentElement.clientHeight + 0.5
      if (condition) {
        binding.value()
      }
    })
  }
}
const pagination = (page) => {
  pageQuery.value.pageNum = page.pageNum
  pageQuery.value.pageSize = page.pageSize
  onGetPage()
}

/**
 * 格式化手机号码
 */
const formatPhoneNumber = (value) => {
  if (!value) return ''
  value = value.toString()
  return value.slice(0, 3) + '****' + value.slice(7)
}
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
let tempSearchForm = null // 保存上次点击查询的请求条件
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
// 查询的参数
const pageQuery = ref({
  pageSize: 10,
  pageNum: 1
})
const searchParam = ref({
  // 用户昵称
  nickName: null,
  // 接收短信号码
  phone: null,
  // 会员类型
  levelType: null,
  // 会员等级
  level: '',
  // 状态
  status: null,
  // 用户标签
  tagIds: null,
  // 注册开始时间
  createStartTime: null,
  // 注册结束时间
  createEndTime: null
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const addOrUpdateVisible = ref(false)
const dateRange = ref([])
const typeOptions = ref([{
  value: 0,
  label: $t('user.userManager.ordinaryMember'),
  children: []
}, {
  value: 1,
  label: $t('user.userManager.paidMembership'),
  children: []
}])
const memberLevelVal = ref('')
const statusOptions = [{
  value: 0,
  label: $t('user.userManager.disable')
}, {
  value: 1,
  label: $t('user.userManager.normal')
}]
const exportDisabled = ref(false)
const updateBalanceVisible = ref(false)
const updateCouponVisible = ref(false)
const dataListSelections = ref([])
const updateGrowthVisible = ref(false)
const updateScoreVisible = ref(false)
const updateTagsVisible = ref(false)
const importUserVisible = ref(false)
const importDisabled = false

const userTag = ref([])
const tagList = ref([]) // 会员标签列表
let tagTotal = 0
const tagSearchParam = {
  pageSize: 10,
  pageNum: 1
}

onMounted(() => {
  onGetMemberLevelList()
  onGetPage()
  onGetMemberTags()
})

/**
 * 切换付费会员等级
 */
const memberCascaderRef = ref(null)
const onHandleMemberTypeChange = (val) => {
  searchParam.value.levelType = val[0]
  searchParam.value.level = val[1] || ''
  memberCascaderRef.value.dropDownVisible = false
}

/**
 * 获取付费会员等级
 */
const onGetMemberLevelList = () => {
  for (let index = 0; index < 2; index++) {
    levelApi.list(index).then(data => {
      const children = []
      data.forEach(el => {
        children.push({
          value: el.level,
          label: el.levelName
        })
      })
      typeOptions.value[index].children = children
    })
  }
}
const onGetPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery.value, ...searchParam.value }
  } else {
    tempSearchForm.pageSize = pageQuery.value.pageSize
    tempSearchForm.pageNum = pageQuery.value.pageNum
  }
  pageLoading.value = true
  api.managePage(tempSearchForm).then(resPageVO => {
    pageVO.value = resPageVO
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 查看
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (userId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.onInit(userId)
  })
}
const onSearchParamChange = (newData = false) => {
  pageQuery.value.pageNum = 1
  // 时间范围
  if (dateRange.value) {
    searchParam.value.createStartTime = dateRange.value[0]
    searchParam.value.createEndTime = dateRange.value[1]
  } else {
    searchParam.value.createStartTime = null
    searchParam.value.createEndTime = null
  }
  // 标签
  let arr = ''
  if (userTag.value.length !== 0) {
    userTag.value.forEach(item => {
      arr = arr + item.userTagId + ','
    })
  }
  searchParam.value.tagIds = arr
  onGetPage(newData)
}
// 清空搜索条件
const onClearSearchInfo = () => {
  userTag.value = []
  searchParam.value.nickName = null
  searchParam.value.phone = null
  searchParam.value.levelType = null
  searchParam.value.status = null
  searchParam.value.tagIds = null
  searchParam.value.createStartTime = null
  searchParam.value.createEndTime = null
  memberLevelVal.value = null
  dateRange.value = []
}
// 多选变化
const onSelectionChange = (val) => {
  dataListSelections.value = val
}
// 修改成长值
const updateGrowthRef = ref(null)
const onUpdateGrowth = (id) => {
  const ids = id ? [id] : dataListSelections.value.map(item => {
    return item.userId
  })
  updateGrowthVisible.value = true
  nextTick(() => {
    updateGrowthRef.value?.onInit(ids)
  })
}
// 修改积分
const updateScoreRef = ref(null)
const onUpdateScore = (id) => {
  const ids = id ? [id] : dataListSelections.value.map(item => {
    return item.userId
  })
  updateScoreVisible.value = true
  nextTick(() => {
    updateScoreRef.value?.onInit(ids)
  })
}
// type 1 批次充值 0修改余额
const updateBalanceRef = ref(null)
const onUpdateBalance = (id, type, balance) => {
  const ids = id ? [id] : dataListSelections.value.map(item => {
    return item.userId
  })
  updateBalanceVisible.value = true
  nextTick(() => {
    updateBalanceRef.value?.onInit(ids, type, balance)
  })
}
// 送优惠券
const updateCouponRef = ref(null)
const onUpdateCoupon = (id) => {
  const ids = id ? [id] : dataListSelections.value.map(item => {
    return item.userId
  })
  updateCouponVisible.value = true
  nextTick(() => {
    updateCouponRef.value?.onInit(ids)
  })
}
// 批量给用户打标签
const updateTagsRef = ref(null)
const onUpdateTags = (id) => {
  const ids = id ? [id] : dataListSelections.value.map(item => {
    return item.userId
  })
  updateTagsVisible.value = true
  nextTick(() => {
    updateTagsRef.value?.onInit(ids)
  })
}
// 导出用户
const onExportUser = () => {
  exportDisabled.value = true
  api.soldExcel({ ...pageQuery.value, ...searchParam.value }).then(data => {
    if (data.type !== 'application/vnd.ms-excel') {
      exportDisabled.value = false
      return ElMessage.error('无用户数据导出')
    }
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = $t('user.userManager.userInformationForm')
    const elink = document.createElement('a')
    if ('download' in elink) { // 非IE下载
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
    exportDisabled.value = false
  }).catch((e) => {
    ElMessage.error(e)
    exportDisabled.value = false
  })
}
// 导入用户
const importUserRef = ref(null)
const importUser = () => {
  importUserVisible.value = true
  nextTick(() => {
    importUserRef.value?.onInit()
  })
}
/**
 * 根据选项设置时间
 * 1:今天 2:昨天 3: 近七天 4:近30天
 */
const onSetDateRange = (val) => {
  let startDay = null
  let endDay = null
  if (val === 1) {
    startDay = 0
    endDay = 0
  } else if (val === 2) {
    startDay = -1
    endDay = -1
  } else if (val === 3) {
    startDay = -7
    endDay = -1
  } else if (val === 4) {
    startDay = -30
    endDay = -1
  } else {
    return
  }
  // 开始时间
  const startTime = moment().add(startDay, 'days').startOf('days').format('YYYY-MM-DD HH:mm:ss')
  // 结束时间
  const endTime = moment().add(endDay, 'days').endOf('days').format('YYYY-MM-DD HH:mm:ss')
  dateRange.value = [startTime, endTime]
}
/**
 * 获取会员标签列表
 */
const onGetMemberTags = () => {
  tagApi.getTagPage(tagSearchParam).then(data => {
    if (!data) return
    tagTotal = data.total
    tagList.value = [...tagList.value, ...data.list]
  })
}
const onLoadMore = () => {
  tagSearchParam.pageNum++
  if (tagList.value.length < tagTotal) {
    onGetMemberTags()
  }
}

</script>

<style lang="scss" scoped>
.app-container {
   .main-content{
      .phone-number{
        width:100%;
      }
    }
  .img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100px;

  }

}
:deep(.el-select .el-select__tags > span > .el-tag.el-tag--info:nth-last-child(2)) {
  max-width: 120px;
}
:deep(.el-button--primary.is-disabled, .el-button--primary.is-disabled:hover, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active){
  background-color: #fff;
  border-color: #ebeef5;
  color: #c0c4cc;
}
</style>
