<template>
  <div>
    <el-dialog
      v-model="visible"
      :title="$t('coupon.coupon.selectCoupons')"
      width="50%"
      :append-to-body="true"
    >
      <el-form
        :inline="true"
        :model="searchParam"
        @submit.prevent
      >
        <el-form-item>
          <el-input
            v-model="couponName"
            :placeholder="$t('user.userManager.couponTip1')"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearch"
          >
            {{ $t("table.search") }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <div class="prods-select-body">
          <el-table
            ref="couponTableRef"
            v-loading="dataListLoading"
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%;"
            @selection-change="onSelectChangeHandle"
          >
            <el-table-column
              v-if="isSingle"
              width="50"
              header-align="center"
              align="center"
            >
              <template #default="{row}">
                <div>
                  <el-radio
                    v-model="singleSelectCouponId"
                    :label="row.couponId"
                    @change="onGetSelectProdRow(row)"
                  >
&nbsp;
                  </el-radio>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!isSingle"
              type="selection"
              :selectable="onCheckSelectable"
              header-align="center"
              align="center"
              width="50"
            />
            <el-table-column
              prop="couponName"
              header-align="center"
              align="center"
              :label="$t('coupon.coupon.couponName')"
            />
            <el-table-column
              prop="subTitle"
              header-align="center"
              align="center"
              :label="$t('user.userManager.couponDscription')"
            />
            <el-table-column
              prop="getWay"
              header-align="center"
              align="center"
              :label="$t('coupon.coupon.couponType')"
            >
              <template #default="{row}">
                <div v-if="row.getWay === 1">
                  {{ $t('coupon.coupon.platformDistribution') }}
                </div>
                <div v-else>
                  {{ $t('coupon.coupon.userClaim') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="stocks"
              header-align="center"
              align="center"
              :label="$t('user.userManager.stockNum')"
            />
            <el-table-column
              prop="limitNum"
              header-align="center"
              align="center"
              :label="$t('coupon.coupon.couponUpperLimit')"
            />
            <el-table-column
              header-align="center"
              align="center"
              :label="$t('user.userManager.perRecevies')"
              width="200"
            >
              <template #header>
                <span>{{ $t('user.userManager.perRecevies') }}</span>
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="$t('user.userManager.couponTip2')"
                >
                  <template #reference>
                    <el-icon
                      class="question"
                    >
                      <QuestionFilled />
                    </el-icon>
                  </template>
                </el-popover>
              </template>
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.eachObtain"
                  controls-position="right"
                  :min="scope.row.stocks>0?1:0"
                  :max=" scope.row.stocks>0?(scope.row.stocks >= scope.row.limitNum ? scope.row.limitNum:scope.row.stocks):0"
                />
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            v-show="pageVO.total>0"
            v-model:page="pageQuery.pageNum"
            v-model:limit="pageQuery.pageSize"
            :total="pageVO.total"
            @pagination="onGetDataList()"
          />
          <!-- /分页 -->
        </div>
      </el-main>

      <template #footer>
        <span>
          <el-button
            @click="visible = false"
          >{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            :loading="confirmLoad"
            @click="onSubmitProds()"
          >{{ $t('table.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/coupon/coupon.js'
import Pagination from '@/components/Pagination/index.vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  value: {
    default: '',
    type: String
  },
  // 获取方式 null:默认（客户领取+平台发放） 0=客户领取 1=平台发放
  getWay: {
    default: null,
    type: Number
  },
  isSingle: {
    default: false,
    type: Boolean
  },
  // 最大上传数量
  limit: {
    default: 9,
    type: Number
  }
})
const emit = defineEmits(['refreshSelectCouponList', 'refreshDataList'])

const visible = ref(false)
const confirmLoad = ref(false)
const dataForm = {
  userIds: [],
  sendCoupons: []
}
const dataList = ref([]) // 标签

const pageQuery = ref({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const dataListLoading = ref(false)
// 查询参数
const searchParam = ref({})
const couponName = ref(null)
let dataListSelections = []
const onInit = (ids) => {
  visible.value = true
  dataForm.userIds = ids
  couponName.value = null
  searchParam.value.couponName = null
  onGetDataList()
}

// 分页获取标签
const onGetDataList = () => {
  dataListLoading.value = true
  searchParam.value.getWay = props.getWay
  api.pagePlatformCoupons({ ...pageQuery.value, ...searchParam.value }).then((resPageVO) => {
    pageVO.value = resPageVO
    dataList.value = pageVO.value.list
    dataList.value.forEach(item => {
      item.eachObtain = 1
    })
    dataListLoading.value = false
  })
}
// 搜索
const onSearch = () => {
  searchParam.value.couponName = couponName.value
  onGetDataList()
}
// 单选事件
const onGetSelectProdRow = (row) => {
  dataListSelections = [row]
}
/**
 * 禁用多选按钮
 */
const onCheckSelectable = (row) => {
  return row.stocks > 0
}
// 多选
// 多选点击事件
const onSelectChangeHandle = (selection) => {
  dataList.value.forEach((tableItem) => {
    const selectedProdIndex = selection.findIndex((selectedCoupon) => {
      if (!selectedCoupon) {
        dataListSelections = []
        return false
      }
      return selectedCoupon.couponId === tableItem.couponId
    })
    const dataSelectedProdIndex = dataListSelections.findIndex((dataSelectedCoupon) => dataSelectedCoupon.couponId === tableItem.couponId)
    if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
      dataListSelections.push(tableItem)
    } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
      dataListSelections.splice(dataSelectedProdIndex, 1)
    }
  })
}
// 确定事件
const onSubmitProds = () => {
  // 商品单选的情况
  if (props.isSingle) {
    dataListSelections.length && emit('refreshSelectCouponList', dataListSelections[0])
    dataListSelections = []
    visible.value = false
    return
  }
  // 多选
  const coupons = []
  if (dataListSelections.length < 1) {
    // emit('refreshSelectCouponList', [])
  } else {
    dataListSelections.forEach(item => {
      const couponIndex = coupons.findIndex((coupon) => coupon.couponId === item.couponId)
      if (couponIndex === -1) {
        coupons.push({ couponId: item.couponId, couponName: item.couponName, subTitle: item.subTitle, limitNum: item.limitNum, eachObtain: item.eachObtain })
      }
    })
    // emit('refreshSelectCouponList', coupons)
  }
  dataForm.sendCoupons = coupons
  dataListSelections = []
  onConfirm()
}
const onConfirm = () => {
  if (!dataForm.userIds) {
    return
  }
  if (!dataForm.sendCoupons.length) {
    return ElMessage.error('请选择优惠券！')
  }
  confirmLoad.value = true
  const coupons = []
  dataForm.sendCoupons.forEach(element => {
    const obj = {}
    obj.couponId = element.couponId
    obj.nums = element.eachObtain
    coupons.push(obj)
  })
  dataForm.sendCoupons = coupons
  api.sendUserCoupon(dataForm).then(() => {
    dataForm.sendCoupons = []
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 500,
      onClose: () => {
        visible.value = false
        confirmLoad.value = false
        emit('refreshDataList')
      }
    })
  }).catch(() => {
    dataForm.sendCoupons = []
    confirmLoad.value = false
  })
}

defineExpose({ onInit })
</script>
