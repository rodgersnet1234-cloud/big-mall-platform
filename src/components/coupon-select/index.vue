<template>
  <el-dialog
    v-model="visible"
    :title="$t('coupon.coupon.selectCoupons')"
    :modal="false"
    top="100px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
  >
    <div class="components-coupons-select">
      <el-table
        ref="couponTableRef"
        v-loading="dataListLoading"
        :data="dataList"
        border
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
              <!-- native modifier has been removed, please confirm whether the function has been affected  -->
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
          :label-class-name="(dataList && dataList.length) ? '' : 'couponTableSelection'"
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
          :label="$t('coupon.coupon.couponDscription')"
        >
          <template #default="{row}">
            <div>{{ row.subTitle||'-' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="getWay"
          header-align="center"
          align="center"
          :label="$t('coupon.coupon.couponType')"
        />
        <el-table-column
          prop="limitNum"
          header-align="center"
          align="center"
          :label="$t('coupon.coupon.couponUpperLimit')"
        />
      </el-table>
      <!-- 分页条 -->
      <Pagination
        v-show="pageVO.total>0"
        v-model:page="pageQuery.pageNum"
        v-model:limit="pageQuery.pageSize"
        :total="pageVO.total"
        @pagination="onGetDataList()"
      />
    </div>
    <template #footer>
      <span>
        <el-button
          type="primary"
          @click="visible = false"
        >{{ $t("table.cancel") }}</el-button>
        <el-button
          type="primary"
          @click="onSubmitProds()"
        >{{ $t("table.confirm") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { pagePlatformCoupons } from '@/api/coupon/coupon'
import Pagination from '@/components/Pagination/index.vue'

const emit = defineEmits(['refreshSelectCouponList'])

const visible = ref(false)

// 查询的参数
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
// 查询参数
const searchParam = {
}
const singleSelectCouponId = ref(0)
let selectCoupons = []
const dataList = ref([])
const dataListLoading = ref(false)
let dataListSelections = []
const props = defineProps({
  isSingle: {
    default: false,
    type: Boolean
  },
  // 获取方式 null:默认（客户领取+平台发放） 0=客户领取 1=平台发放
  getWay: {
    default: null,
    type: Number
  },
  dataUrl: {
    default: '/p/coupon/list',
    type: String
  }
})

onActivated(() => {
  onGetDataList()
})

// 获取数据列表
const onInit = (isSelectCoupons) => {
  selectCoupons = isSelectCoupons
  visible.value = true
  dataListLoading.value = true
  if (selectCoupons) {
    selectCoupons.forEach(row => {
      dataListSelections.push(row)
    })
  }
  onGetDataList()
}
const couponTableRef = ref(null)
const onGetDataList = () => {
  searchParam.getWay = props.getWay
  pagePlatformCoupons({ ...pageQuery.value, ...searchParam }).then((resPageVO) => {
    pageVO.value = resPageVO
    dataList.value = pageVO.value.list
    dataList.value.forEach(item => {
      // 平台投放 / 用户领取
      item.getWay = item.getWay === 1 ? $t('coupon.coupon.platformDistribution') : $t('coupon.coupon.userClaim')
    })
    dataListLoading.value = false
    if (selectCoupons) {
      nextTick(() => {
        selectCoupons.forEach(row => {
          const index = dataList.value.findIndex((couponItem) => couponItem.couponId === row.couponId)
          couponTableRef.toggleRowSelection(dataList.value[index])
        })
      })
    }
  })
}

// 单选商品事件
const onGetSelectProdRow = (row) => {
  dataListSelections = [row]
}
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
    emit('refreshSelectCouponList', [])
  } else {
    dataListSelections.forEach(item => {
      const couponIndex = coupons.findIndex((coupon) => coupon.couponId === item.couponId)
      if (couponIndex === -1) {
        coupons.push({ couponId: item.couponId, couponName: item.couponName, subTitle: item.subTitle, limitNum: item.limitNum })
      }
    })
    emit('refreshSelectCouponList', coupons)
  }

  dataListSelections = []
  visible.value = false
}
defineExpose({ onInit })
</script>
<style lang="scss" scoped>
.components-coupons-select {
  height: 600px;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
 :deep(.couponTableSelection>.el-checkbox>.el-checkbox__input>.el-checkbox__inner::after) {
  visibility: hidden;
}
}
</style>
