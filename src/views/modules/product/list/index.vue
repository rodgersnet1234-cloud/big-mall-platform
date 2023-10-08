<template>
  <div class="app-container page-product-list">
    <!-- 1.条件筛选 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="dataForm"
        @submit.prevent
      >
        <div class="input-row">
          <!-- 店铺名称 -->
          <el-form-item label="店铺名称：">
            <el-input
              v-model.trim="dataForm.shopName"
              placeholder="店铺名称"
              maxlength="100"
              clearable
            />
          </el-form-item>
          <!-- 商品名称 -->
          <el-form-item label="商品名称：">
            <el-input
              v-model.trim="dataForm.prodName"
              placeholder="商品名称"
              maxlength="100"
              clearable
            />
          </el-form-item>
          <!-- 商品编码 -->
          <el-form-item label="商品编码：">
            <el-input
              v-model.trim="dataForm.prodCode"
              placeholder="商品编码"
              clearable
            />
          </el-form-item>
          <!-- 商品类别 -->
          <el-form-item label="商品类别:">
            <el-select
              v-model="dataForm.spuMold"
              placeholder="商品类别"
              clearable
            >
              <el-option
                label="实物商品"
                :value="0"
              />
              <el-option
                label="虚拟商品"
                :value="1"
              />
            </el-select>
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item label="平台分类：">
            <el-cascader
              v-model="selectedMenu"
              clearable
              expand-trigger="hover"
              :options="categoryList"
              :props="categoryListTreeProps"
              change-on-select
              @change="handleSelectCategoryChange"
            />
          </el-form-item>
          <!-- 商品状态 -->
          <el-form-item label="状态:">
            <el-select
              v-model="dataForm.spuStatus"
              placeholder="状态"
              clearable
            >
              <el-option
                label="下架"
                :value="0"
              />
              <el-option
                label="上架"
                :value="1"
              />
              <el-option
                label="违规下架"
                :value="2"
              />
              <el-option
                label="违规下架待审核"
                :value="3"
              />
              <el-option
                label="待审核"
                :value="4"
              />
            </el-select>
          </el-form-item>
          <!-- 实际销量 -->
          <el-form-item label="实际销量：">
            <div class="cumulative-sales range-box">
              <el-input
                v-model.number="dataForm.saleBeginInp"
                min="0"
                @change="checkMaxValue(dataForm.saleBeginInp, 1)"
              />
              <span class="interval-line">-</span>
              <el-input
                v-model.number="dataForm.saleEndInp"
                min="0"
                @change="checkMaxValue(dataForm.saleEndInp, 2)"
              />
            </div>
          </el-form-item>
          <!-- 当前价 -->
          <el-form-item label="当前价：">
            <div class="current-pirce range-box">
              <el-input
                v-model.number="dataForm.currentPriceBeginInp"
                min="0"
                @change="checkMaxValue(dataForm.currentPriceBeginInp, 3)"
              />
              <span class="interval-line">-</span>
              <el-input
                v-model.number="dataForm.currentPriceEndInp"
                min="0"
                @change="checkMaxValue(dataForm.currentPriceEndInp, 4)"
              />
            </div>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button
              class="operation-btn"
              type="primary"
              @click="onSearch(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="onResetSearch()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <!-- 2.发布/展示/处理商品操作 -->
      <div class="operation-bar">
        <el-radio-group
          v-model="prodStatusRadio"
          @change="switchProdList()"
        >
          <!-- 全部按钮 -->
          <el-radio-button label="0">
            全部
          </el-radio-button>
          <!-- 在售中按钮 -->
          <el-radio-button label="1">
            在售中
          </el-radio-button>
          <!-- 已售罄按钮 -->
          <el-radio-button label="2">
            已售罄
          </el-radio-button>
          <!-- 已下架按钮 -->
          <el-radio-button label="3">
            已下架
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="operation-bar">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          class="all-check-btn"
          @change="handleCheckAllChange"
        >
          当页全选
        </el-checkbox>
        <!-- 下架按钮 -->
        <el-button
          v-if="prodStatusRadio === 0 || prodStatusRadio !== 3"
          v-permission="['product:spu:offline']"
          @click="changeProdStatus()"
        >
          违规下架
        </el-button>
        <el-button
          v-permission="['platform:spu:export']"
          type="primary"
          @click="exportFrom()"
        >
          导出
        </el-button>
        <span
          v-if="checkedCount"
          class="had-checked"
        >已选商品 {{ checkedCount }}</span>
      </div>

      <!-- 3.商品展示表格 -->

      <div
        ref="closepopoverRef"
        class="table-con"
      >
        <el-table
          ref="prodInfTableRef"
          :data="page.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          @selection-change="onSelectSome"
          @cell-mouse-enter="enterTableRow"
          @cell-mouse-leave="leaveTableRow"
          @sort-change="conditionSort"
        >
          <el-table-column
            align="center"
            type="selection"
            width="50"
          />
          <!-- 商品信息 -->
          <el-table-column
            class="table-item"
            label="商品信息"
            width="320"
            fixed
          >
            <template #default="scope">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow :src="scope.row.mainImgUrl" />
                </div>
                <div class="table-cell-text">
                  {{ scope.row.spuName }}
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="scope.row.spuName"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 店铺名称 -->
          <el-table-column
            class="table-item"
            label="店铺名称"
            width="180"
            fixed
            align="center"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.shopName }}
              </div>
            </template>
          </el-table-column>
          <!-- 销售价 -->
          <el-table-column
            class="table-item"
            prop="priceFee"
            label="销售价"
            sortable="custom"
            align="center"
            width="100"
          >
            <template #default="scope">
              <span class="name">{{ scope.row.priceFee }}</span>
            </template>
          </el-table-column>
          <!-- 市场价 -->
          <el-table-column
            class="table-item"
            prop="marketPriceFee"
            label="市场价"
            sortable="custom"
            align="center"
            width="100"
          />
          <!-- 实际销量 -->
          <el-table-column
            class="table-item"
            prop="actualSoldNum"
            label="实际销量"
            sortable="custom"
            width="150"
            align="center"
          />
          <!-- 注水销量 -->
          <el-table-column
            class="table-item"
            prop="waterSoldNum"
            label="注水销量"
            sortable="custom"
            align="center"
            width="150"
          >
            <template #default="scope">
              <div class="water-sold-con">
                <span>{{ scope.row.waterSoldNum }}</span>
                <el-popover
                  placement="bottom"
                  trigger="click"
                  :width="175"
                  @after-enter="getCurrentSpuId(scope.row.spuId, 'waterSoldNum')"
                  @hide="initProdInf(scope.row.spuId)"
                >
                  <div class="popover-box">
                    <div>
                      <el-input-number
                        v-model="scope.row.waterSoldNum"
                        type="number"
                        onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
                        class="sales-volume"
                        :min="0"
                        :readonly="waterSoldNumFlag"
                        :max="1000000000"
                      />
                    </div>
                    <div class="popover-bottom">
                      <el-button
                        @click="closePopover()"
                      >
                        取消
                      </el-button>
                      <el-button
                        type="primary"
                        @click="handleChange(scope.row.spuId, scope.row.waterSoldNum)"
                      >
                        保存
                      </el-button>
                    </div>
                  </div>
                  <template #reference>
                    <el-icon
                      v-show="scope.row.spuId===currentMoveSpuId || (scope.row.spuId===currentClickSpuId && currentShowPopover==='waterSoldNum')"
                      v-permission="['product:spu:editWaterSoldNum']"
                    >
                      <EditPen />
                    </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <!-- 库存 -->
          <el-table-column
            class="table-item"
            prop="stock"
            label="库存"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              <span class="name">{{ scope.row.stock }}</span>
            </template>
          </el-table-column>
          <!-- 序号 -->
          <el-table-column
            class="table-item"
            prop="seq"
            label="序号"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              <div class="seq-box can-edit-item is-center">
                <span class="name">{{ scope.row.exhibitionSeq }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 商品状态状态 1:enable, 0:disable, -1:deleted -->
          <el-table-column
            label="商品状态"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.spuStatus === 0"
                class="tag-text"
              >下架</span>
              <span
                v-else-if="row.spuStatus === 1"
                class="tag-text"
              >上架</span>
              <span
                v-else-if="row.spuStatus === 2"
                class="tag-text"
              >违规下架</span>
              <!-- 违规下架待审核 -->
              <span
                v-else-if="row.spuStatus === 3"
                class="tag-text"
              >违规下架待审核</span>
              <!-- （平台开启）创建商品待审核 -->
              <span
                v-else-if="row.spuStatus === 4"
                class="tag-text"
              >待审核</span>
              <!-- 默认值 -->
              <span
                v-else
              >--</span>
            </template>
          </el-table-column>
          <!-- 商品类型 -->
          <el-table-column
            prop="spuMold"
            label="商品类别"
            width="120"
          >
            <template #default="{row}">
              <div class="tag-text">
                {{ row.spuMold === 1 ? "虚拟商品": "实物商品" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            class="table-item"
            label="操作"
            align="center"
            width="260"
            fixed="right"
          >
            <template #default="{row}">
              <!-- 查看商品按钮 -->
              <div class="table-btn-con">
                <el-button
                  v-permission="['product:spu:view']"
                  link
                  type="primary"
                  @click="toReleaseProdPage(row.spuId)"
                >
                  详情
                </el-button>
                <el-button
                  v-if="row.spuStatus === 4"
                  link
                  type="primary"
                  @click="offlineManageHandle(row, 'showProductReview')"
                >
                  待审核
                </el-button>
                <el-button
                  v-if="row.spuStatus === 1 || row.spuStatus === 0"
                  v-permission="['product:spu:offline']"
                  link
                  type="primary"
                  @click="offlineManageHandle(row, 'offline')"
                >
                  违规下架
                </el-button>
                <el-button
                  v-if="row.spuStatus === 2 || row.spuStatus === 3"
                  v-permission="['product:spu:audit']"
                  link
                  type="primary"
                  @click="offlineManageHandle(row, 'offlineManage')"
                >
                  下架管理
                </el-button>
                <el-button
                  v-if="!row.isTop"
                  v-permission="['product:spu:top']"
                  link
                  type="primary"
                  @click="clickIsTop(row.spuId,row.isTop)"
                >
                  置顶
                </el-button>
                <el-button
                  v-else
                  v-permission="['product:spu:unTop']"
                  link
                  type="primary"
                  @click="clickIsTop(row.spuId,row.isTop)"
                >
                  取消置顶
                </el-button>
                <el-button
                  v-permission="['product:spu:delete']"
                  link
                  type="primary"
                  @click="prodDelete(row.spuId)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="operation-bar">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            class="all-check-btn"
            @change="handleCheckAllChange"
          >
            当页全选
          </el-checkbox>
          <!-- 下架按钮 -->
          <el-button
            v-if="prodStatusRadio !== 0 && prodStatusRadio !== 3"
            v-permission="['product:spu:offline']"
            @click="changeProdStatus()"
          >
            下架
          </el-button>
          <span
            v-if="checkedCount"
            class="had-checked"
          >已选商品 {{ checkedCount }}</span>
        </div>
        <el-pagination
          v-show="page.total>0"
          class="pagination"
          :page-sizes="[10, 20, 30, 50]"
          :current-page="pageQuery.pageNum"
          :page-size="pageQuery.pageSize"
          :total="page.total"
          layout="->,total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        />
      </div>
    </div>
    <prod-details
      ref="prodDetailsRef"
    />

    <!-- 下架管理 -->
    <offline-manage
      v-if="operateDialogVisible"
      ref="offlineDataRef"
      @on-or-off-the-shelf="onOrOffTheShelf"
      @offline-data-submit="offlineDataSubmit"
      @audit-online-submit="auditOnlineSubmit"
    />
    <!-- 下架管理 end -->
  </div>
</template>

<script setup>
import * as api from '@/api/product/list'
import * as categoryApi from '@/api/product/category'
import { treeDataTranslate } from '@/utils'
import prodDetails from './components/prod-details/index.vue'
import OfflineManage from '@/components/offline-manage/index.vue'
import Big from 'big.js'
import { ElMessageBox, ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

let tempSearchForm = null // 保存上次点击查询的请求条件
const dataForm = reactive({
  shopName: '',
  prodName: '',
  prodCode: '',
  saleBeginInp: '',
  saleEndInp: '',
  currentPriceBeginInp: '',
  currentPriceEndInp: '',
  spuMold: '',
  spuStatus: ''
})
const waterSoldNumBtn = ref(false)
const selectedMenu = ref([])
const categoryList = ref([])
const categoryListTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})
const prodStatusRadio = ref(0)

const currentMoveSpuId = ref('') // 移入项的spuId
const currentClickSpuId = ref('') // 点击项的spuId
const currentShowPopover = ref('') // 当前展示的弹窗
// 多选
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedCount = ref(0)
const selectedProdList = ref([]) // 被选中的商品列表
// 查询的参数
const searchParam = reactive({
})
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const page = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const oldPageVo = ref([]) // 原始数据列表
// loading
const pageLoading = ref(true)
const isSubmit = ref(true)

let spuId = null // 商品id
const operateDialogVisible = ref(false) // 商品违规下架弹窗
const waterSoldNumFlag = ref(false) // 是否只读

onMounted(() => {
  isSubmit.value = false
  getDataList()
  getProdCategoryList()
})

// 条件搜索
const onSearch = (newData = false) => {
  pageQuery.pageNum = 1
  searchParam.dataType = dataForm.dataType || searchParam.dataType
  searchParam.spuId = dataForm.prodId || undefined
  searchParam.partyCodes = dataForm.prodCode || undefined
  searchParam.shopName = dataForm.shopName || undefined
  searchParam.keyword = dataForm.prodName || undefined
  searchParam.primaryCategoryId = dataForm.primaryCategoryId || undefined
  searchParam.secondaryCategoryId = dataForm.secondaryCategoryId || undefined
  searchParam.categoryId = dataForm.categoryId || undefined
  searchParam.minSaleNum = dataForm.saleBeginInp || undefined
  searchParam.maxSaleNum = dataForm.saleEndInp || undefined
  searchParam.minPrice = accuracyCount(dataForm.currentPriceBeginInp, 100, 2) || undefined
  searchParam.maxPrice = accuracyCount(dataForm.currentPriceEndInp, 100, 2) || undefined
  searchParam.spuMold = dataForm.spuMold
  searchParam.spuStatus = dataForm.spuStatus
  searchParam.isCompose = dataForm.currentyuPreSaleStatus === '' ? undefined : dataForm.currentyuPreSaleStatus
  searchParam.sort = searchParam.sort || undefined
  getDataList(newData)
}

const route = useRoute()
// 获取商品列表
const getDataList = (newData = false) => {
  pageLoading.value = true
  waterSoldNumFlag.value = false
  searchParam.keyword = searchParam.keyword ? searchParam.keyword : route.query.spuName
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchParam }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  api.page(tempSearchForm).then(pageVO => {
    page.list = pageVO.list
    page.total = pageVO.total
    page.pages = pageVO.pages
    page.list.forEach(item => {
      item.exhibitionProdName = item.spuName
      item.exhibitionSeq = item.seq
      item.priceFee = accuracyCount(item.priceFee, 100, 3)
      item.marketPriceFee = accuracyCount(item.marketPriceFee, 100, 3)
    })
    oldPageVo.value = JSON.parse(JSON.stringify(page.list))
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
// 获取商品目录
const getProdCategoryList = () => {
  pageLoading.value = true
  categoryApi.enableCategories().then(page => {
    categoryList.value = treeDataTranslate(page, 'categoryId', 'parentId')
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
// 监听分类选择的变化
const handleSelectCategoryChange = (val) => {
  dataForm.primaryCategoryId = undefined
  dataForm.secondaryCategoryId = undefined
  dataForm.categoryId = undefined
  if (val.length === 1) { // 长度为1，表明当前选择的是一级分类（点击了一级分类）
    dataForm.primaryCategoryId = val[0] // 平台一级分类id
  } else if (val.length === 2) { // 长度为2，表明当前选择的是二级分类（点击了二级分类）
    dataForm.secondaryCategoryId = val[1] // 平台二级分类id
  } else if (val.length === 3) { // 长度为3，表明当前选择的是三级分类（点击了三级分类）
    dataForm.categoryId = val[2] // 平台三级分类id
  }
}

// 切换不同状态的商品展示
// 0：代表全部商品
// 1：在售中的商品
// 2：已售完的商品
// 3：已下架的商品
const switchProdList = () => {
  const dataType = parseInt(prodStatusRadio.value)
  checkAll.value = false
  pageQuery.pageNum = 1
  searchParam.dataType = dataType
  getDataList(true)
}

const prodDetailsRef = ref(null)
// 跳转发布商品页
const toReleaseProdPage = (spuId) => {
  prodDetailsRef.value.init(spuId)
}

// 监听表格选中
const onSelectSome = (value) => {
  const count = value.length
  checkedCount.value = count
  checkAll.value = count === page.list.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < page.list.length
  // 提取出商品id列表
  const prodList = []
  if (value.length > 0) {
    value.forEach(item => {
      prodList.push(item.spuId)
    })
  }
  selectedProdList.value = prodList
}
const prodInfTableRef = ref(null)
// 表格全选/全不选
const handleCheckAllChange = () => {
  prodInfTableRef.value.toggleAllSelection()
  isIndeterminate.value = false
}

// 条件排序
// priceFee:当前价       5-正序 4-倒序
// marketPriceFee:市场价 8-正序 7-倒序
// actualSoldNum:实际销量       18-正序 17-倒序
// stock:库存            11-正序 10-倒序
// seq:序号              13-正序 12-倒序
// waterSoldNum 注水销量  20-正序 19-倒序
const conditionSort = (column) => {
  closePopover()
  pageQuery.pageNum = 1
  let sort = null
  const sortType = column.prop
  const currentSortCode = column.order
  switch (sortType) {
    case 'priceFee':
      sort = currentSortCode ? currentSortCode === 'ascending' ? 5 : 4 : null
      break
    case 'marketPriceFee':
      sort = currentSortCode ? currentSortCode === 'ascending' ? 8 : 7 : null
      break
    case 'actualSoldNum':
      sort = currentSortCode ? currentSortCode === 'ascending' ? 18 : 17 : null
      break
    case 'stock':
      sort = currentSortCode ? currentSortCode === 'ascending' ? 11 : 10 : null
      break
    case 'seq':
      sort = currentSortCode ? currentSortCode === 'ascending' ? 13 : 12 : null
      break
    case 'waterSoldNum':
      sort = currentSortCode ? currentSortCode === 'ascending' ? 20 : 19 : null
      break
    default:
      break
  }
  searchParam.sort = sort
  getDataList(true)
}
const offlineDataRef = ref(null)
/**
 * 商品违规下架操作
 */
const offlineManageHandle = (row, key) => {
  operateDialogVisible.value = true
  spuId = row.spuId

  if (key === 'offline') {
    nextTick(() => {
      offlineDataRef.value.init('offline')
    })
  } else if (key === 'offlineManage') {
    getOfflineDetailByCouponId(row.spuId)
  } else if (key === 'showProductReview') {
    nextTick(() => {
      offlineDataRef.value.init('showProductReview')
    })
  }
}
/**
 * 获取最新下线商品的事件
 */
const getOfflineDetailByCouponId = (spuId) => {
  api.getOfflineHandleEvent(spuId).then((data) => {
    // offlineDetail = data
    nextTick(() => {
      offlineDataRef.value?.init('offlineManage', data)
    })
  })
}
/**
 * 更改注水销量
 */
const handleChange = (spuId, waterSoldNum) => {
  waterSoldNum = Math.round(waterSoldNum)
  if (waterSoldNum > 1000000000) {
    waterSoldNum = 1000000000
  }
  api.updateWaterSoldNum({ spuId, waterSoldNum }).then(() => {
    waterSoldNumFlag.value = true
    waterSoldNumBtn.value = true
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1000,
      onClose: () => {
        getDataList()
        closePopover()
      }
    })
  })
}
const checkMaxValue = (value, type) => {
  if (value >= 1000000000) {
    // 最大销量
    const maxSoldNum = 999999999
    // 最大价格
    const maxAmount = 999999999.99
    if (type === 1) {
      dataForm.saleBeginInp = maxSoldNum
    } else if (type === 2) {
      dataForm.saleEndInp = maxSoldNum
    } else if (type === 3) {
      dataForm.currentPriceBeginInp = maxAmount
    } else if (type === 4) {
      dataForm.currentPriceEndInp = maxAmount
    }
  } else if (value < 0) {
    // 最小销量
    const minSoldNum = 0
    // 最小价格
    const minAmount = 0
    if (type === 1) {
      dataForm.saleBeginInp = minSoldNum
    } else if (type === 2) {
      dataForm.saleEndInp = minSoldNum
    } else if (type === 3) {
      dataForm.currentPriceBeginInp = minAmount
    } else if (type === 4) {
      dataForm.currentPriceEndInp = minAmount
    }
  }
}
/**
 * 商品置顶
 */
const clickIsTop = (spuId, isTop) => {
  ElMessageBox.confirm(isTop ? '是否取消置顶' : '是否选择置顶', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.clickIsTop(spuId).then(() => {
      ElMessage({
        message: isTop ? '商品取消置顶成功' : '商品置顶成功',
        type: 'success',
        duration: 1500,
        onClose: () => getDataList()
      })
    })
  })
}
// 下线
const onOrOffTheShelf = (data, batchOffile) => {
  let spuIds
  if (batchOffile) {
    spuIds = selectedProdList.value
  } else {
    spuIds = [spuId]
  }
  const param = {
    handleIds: spuIds,
    offlineReason: data
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.batchOffline(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '商品已下架',
      type: 'success',
      duration: 1000,
      onClose: () => {
        getDataList()
        emit('refreshDataList')
      }
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
    handleId: spuId,
    eventId: data.eventId,
    status: data.status, // 审核状态
    refuseReason: data.refuseReason // 拒绝理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.apply(param).then(() => {
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => {
        operateDialogVisible.value = false
        getDataList()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
/**
 * 商品上架审核（平台端开启商品审核）
 */
const auditOnlineSubmit = (data) => {
  const param = {
    handleId: spuId,
    status: data.status, // 审核状态
    refuseReason: data.refuseReason // 拒绝理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.auditSpu(param).then(() => {
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => {
        operateDialogVisible.value = false
        getDataList()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
// 商品删除
const prodDelete = (spuId) => {
  ElMessageBox.confirm($t('order.order.deleteTip'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    api.deleteById(spuId).then(() => {
      ElMessage({
        message: '商品删除成功',
        type: 'success',
        duration: 1000,
        onClose: () => getDataList()
      })
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
// 移入表格行
const enterTableRow = (row) => {
  currentMoveSpuId.value = row.spuId
}
// 移出表格行
const leaveTableRow = () => {
  currentMoveSpuId.value = ''
}
// 获取弹出弹窗项信息
const getCurrentSpuId = (spuId, showPopover) => {
  currentClickSpuId.value = spuId
  currentShowPopover.value = showPopover
}
// 清空选中项弹窗信息
const clearShowPopoverInf = () => {
  currentClickSpuId.value = ''
  currentShowPopover.value = ''
}

// 关闭弹窗后,初始化数据
const initProdInf = (id) => {
  if (!waterSoldNumBtn.value) {
    const findex = oldPageVo.value.findIndex(item => {
      return item.spuId === id
    })
    if (findex !== -1) {
      page.list[findex].waterSoldNum = oldPageVo.value[findex].waterSoldNum
    }
  }
  waterSoldNumBtn.value = false
  clearShowPopoverInf()
}

const closepopoverRef = ref(null)
// 关闭popover弹窗
const closePopover = () => {
  closepopoverRef.value.click()
}

// 改变商品状态
// onTheShelf:上架
// offTheShelf:下架
const changeProdStatus = () => {
  // 如果没选商品，提示选择商品
  if (selectedProdList.value.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }

  operateDialogVisible.value = true
  nextTick(() => {
    offlineDataRef.value.init('offline', true)
  })
}
const exportFrom = () => {
  if (page.total === 0) {
    ElMessage({
      message: '没有商品可以导出！',
      duration: 1500
    })
    return
  }
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    searchParam.dataType = dataForm.dataType
    searchParam.spuIds = selectedProdList.value || []
    searchParam.spuId = spuId || undefined
    searchParam.partyCodes = dataForm.prodCode || undefined
    searchParam.shopName = dataForm.shopName || undefined
    searchParam.keyword = dataForm.prodName || undefined
    searchParam.primaryCategoryId = dataForm.primaryCategoryId || undefined
    searchParam.secondaryCategoryId = dataForm.secondaryCategoryId || undefined
    searchParam.categoryId = dataForm.categoryId || undefined
    searchParam.minSaleNum = dataForm.saleBeginInp || undefined
    searchParam.maxSaleNum = dataForm.saleEndInp || undefined
    searchParam.minPrice = accuracyCount(dataForm.currentPriceBeginInp, 100, 2) || undefined
    searchParam.maxPrice = accuracyCount(dataForm.currentPriceEndInp, 100, 2) || undefined
    searchParam.spuMold = dataForm.spuMold || undefined
    searchParam.spuStatus = dataForm.spuStatus
    searchParam.isCompose = dataForm.currentyuPreSaleStatus === '' ? undefined : dataForm.currentyuPreSaleStatus
    searchParam.sort = searchParam.sort || undefined
    api.soldPlatformExcel({ ...searchParam }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '商品信息.xlsx'
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
      isSubmit.value = false
    }).catch((e) => {
      ElMessage.error(e)
      isSubmit.value = false
    })
  })
}

// 每页数
const sizeChangeHandle = (val) => {
  pageQuery.pageSize = val
  pageQuery.pageNum = 1
  getDataList()
}
// 当前页
const currentChangeHandle = (val) => {
  pageQuery.pageNum = val
  getDataList()
}

// 精度运算
// a:第一个计算数(例如:被除数/被减数)
// b:第二个计算数(例如:除数/减数)
// countMode:计算方式(0:加 1:减 2:乘 3:除)
const accuracyCount = (a, b, countMode) => {
  if (!a && a !== 0) {
    return null
  }
  let finalResult = 0
  if (countMode === 0) {
    finalResult = new Big(a).plus(b).valueOf()
  } else if (countMode === 1) {
    finalResult = new Big(a).minus(b).valueOf()
  } else if (countMode === 2) {
    finalResult = new Big(a).times(b).valueOf()
  } else if (countMode === 3) {
    finalResult = new Big(a).div(b).valueOf()
  } else {
    return
  }
  return finalResult
}
/**
 * 清空
 */
const onResetSearch = () => {
  dataForm.saleBeginInp = undefined
  dataForm.saleEndInp = undefined
  dataForm.currentPriceBeginInp = undefined
  dataForm.currentPriceEndInp = undefined
  dataForm.primaryCategoryId = undefined
  dataForm.secondaryCategoryId = undefined
  dataForm.categoryId = undefined
  dataForm.prodCode = ''
  dataForm.shopName = ''
  dataForm.prodName = ''
  dataForm.spuMold = ''
  dataForm.spuStatus = ''
  selectedMenu.value = []
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
