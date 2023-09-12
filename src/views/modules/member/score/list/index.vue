<template>
  <div class="mod-prod-list app-container">
    <!-- 1.条件筛选 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="dataForm"
        @submit.prevent
      >
        <div class="input-row">
          <!-- 商品名称 -->
          <el-form-item label="商品名称：">
            <el-input
              v-model="dataForm.prodName"
              placeholder="商品名称"
              maxlength="100"
              clearable
            />
          </el-form-item>
          <!-- 商品编码 -->
          <el-form-item label="商品编码：">
            <el-input
              v-model="dataForm.prodCode"
              placeholder="商品编码"
              clearable
            />
          </el-form-item>
          <!-- 累计销量 -->
          <el-form-item label="实际销量：">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-input
                  class="min-width"
                  v-model.number="dataForm.saleBeginInp"
                  min="0"
                  @change="checkMaxValue(dataForm.saleBeginInp, 1)"
                />
              </el-col>
              <el-col
                style="text-align: center"
                :span="2"
              >
                -
              </el-col>
              <el-col :span="11">
                <el-input
                  class="min-width"
                  v-model.number="dataForm.saleEndInp"
                  min="0"
                  @change="checkMaxValue(dataForm.saleEndInp, 2)"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 当前价 -->
          <el-form-item label="销售价：">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-input
                  class="min-width"
                  v-model.number="dataForm.currentPriceBeginInp"
                  min="0"
                  @change="checkMaxValue(dataForm.currentPriceBeginInp, 3)"
                />
              </el-col>
              <el-col
                style="text-align: center"
                :span="2"
              >
                -
              </el-col>
              <el-col :span="11">
                <el-input
                  class="min-width"
                  v-model.number="dataForm.currentPriceEndInp"
                  @change="checkMaxValue(dataForm.currentPriceEndInp, 4)"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <!-- 查询按钮 -->
            <el-button
              class="operation-btn"
              type="primary"
              @click="conditionSearch(true)"
            >
              查询
            </el-button>
            <el-button
              @click="clearSearchInfo()"
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
        <div class="release-prod-btn">
          <el-button
            v-permission="['score:spu:save']"
            type="primary"
            @click="toReleaseProdPage(-1)"
          >
            发布新商品
          </el-button>
        </div>
      </div>
      <div class="operation-bar">
        <div
          v-if="pageVO.list.length"
          class="change-prod-status"
        >
          <el-checkbox
            v-model="isSelectedAll"
            :indeterminate="isIndeterminate"
            @change="onSelectAll"
          >
            当页全选
          </el-checkbox>
          <div class="button-box">
            <!-- 上架按钮 -->
            <el-button
              v-if="prodStatusRadio===0 || (prodStatusRadio!=1 && prodStatusRadio!=2)"
              v-permission="['score:spu:prodSale']"
              @click="changeProdStatus('onTheShelf')"
            >
              上架
            </el-button>
            <!-- 下架按钮 -->
            <el-button
              v-if="prodStatusRadio===0 || prodStatusRadio!=3"
              v-permission="['score:spu:prodNotSale']"
              @click="changeProdStatus('offTheShelf')"
            >
              下架
            </el-button>
          </div>
          <span
            v-if="checkedCount"
            style="font-size:12px;margin-left:10px;color:#155bd4;"
          >已选商品 {{ checkedCount }}</span>
        </div>
      </div>

      <!-- 3.商品展示表格 -->
      <div
        ref="closepopoverRef"
        class="table-con"
      >
        <el-table
          ref="prodListTableRef"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          @selection-change="onSelectSome"
          @sort-change="sordChange"
        >
          <el-table-column
            type="selection"
            align="center"
            width="45"
          />
          <el-table-column
            label="商品信息"
            prop="spuName"
            width="200"
          >
            <template #default="{ row }">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <img-show
                    :src="row.mainImgUrl"
                    :img-style="{width:'60px',height:'60px'}"
                  />
                </div>
                <div class="table-cell-text">
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="row.showSpuName"
                  >
                    <template #reference>
                      <div class="prod-name">
                        {{ row.showSpuName }}
                      </div>
                    </template>
                  </el-popover>
                  <el-popover
                    placement="bottom"
                    trigger="click"
                    width="400"
                    @show="getProdName(row.spuId)"
                    @after-enter="getCurrentSpuId(row.spuId, 'prodName')"
                    @hide="initProdInf(row)"
                  >
                    <div class="spu-name-input-con">
                      <el-input
                        v-model="currentModifyProdName.spuNameZh"
                        type="textarea"
                        :rows="2"
                        maxlength="100"
                        placeholder="请输入中文商品名称"
                      />
                    </div>
                    <div class="popover-bottom">
                      <el-button
                        plain
                        @click="closePopover()"
                      >
                        取消
                      </el-button>
                      <el-button
                        type="primary"
                        @click="modifyProdName(row)"
                      >
                        保存
                      </el-button>
                    </div>
                    <template #reference>
                      <el-icon
                        v-show="row.spuId==currentMoveSpuId || (row.spuId==currentClickSpuId && currentShowPopover=='prodName')"
                        v-permission="['product:spu:modifyProdName']"
                      >
                        <EditPen />
                      </el-icon>
                    </template>
                  </el-popover>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="销售价"
            prop="priceFee"
            width="auto"
            sortable="custom"
          >
            <template #default="{ row }">
              <div class="table-cell-text">
                <span>{{ row.priceFee }}</span>
                <el-popover
                  placement="bottom"
                  trigger="click"
                  width="auto"
                  @show="getProdSku(row.spuId)"
                  @after-enter="getCurrentSpuId(row.spuId, 'priceFee')"
                  @after-leave="clearShowPopoverInf()"
                >
                  <div v-if="currentModifyProdSkuList.length===1">
                    <div>
                      <el-input
                        v-model="currentModifyProdSkuList[0].priceFee"
                      />
                      <div class="popover-bottom">
                        <el-button
                          plain
                          @click="closePopover()"
                        >
                          取消
                        </el-button>
                        <el-button
                          v-permission="['product:spu:modifyProdPrice']"
                          type="primary"
                          @click="modifyProdPrice(row.spuId, currentModifyProdSkuList)"
                        >
                          保存
                        </el-button>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="currentModifyProdSkuList.length>1"
                    class="popover-table-con"
                  >
                    <el-table
                      :data="currentModifyProdSkuList"
                      header-cell-class-name="table-header"
                    >
                      <el-table-column
                        width="200"
                        prop="skuName"
                        label="规格名称"
                      />
                      <el-table-column
                        width="150"
                        prop="priceFee"
                        label="价格"
                      >
                        <template #default="scope">
                          <el-input-number
                            v-model="scope.row.priceFee"
                            :min="0"
                            :max="9999999.99"
                            style="width:100%"
                            :step="0.1"
                            :precision="2"
                            :disabled="scope.row.status!==1"
                            controls-position="right"
                          />
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="popover-bottom">
                      <el-button
                        plain
                        @click="closePopover()"
                      >
                        取消
                      </el-button>
                      <el-button
                        type="primary"
                        @click="modifyProdPrice(row.spuId, currentModifyProdSkuList)"
                      >
                        保存
                      </el-button>
                    </div>
                  </div>
                  <!-- 触发弹窗出现的按钮 -->
                  <template #reference>
                    <el-icon
                      v-show="row.spuId==currentMoveSpuId || (row.spuId==currentClickSpuId && currentShowPopover=='priceFee')"
                      :ref="`editPriceBtn${row.spuId}`"
                      v-permission="['product:spu:modifyProdPrice']"
                    >
                      <EditPen />
                    </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="市场价"
            prop="marketPriceFee"
            width="auto"
            sortable="custom"
          >
            <template #default="{ row }">
              <span class="table-cell-text">{{ row.marketPriceFee }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="累计销量"
            prop="actualSoldNum"
            width="auto"
            min-width="100"
            sortable="custom"
          />

          <el-table-column
            label="现有库存"
            prop="stock"
            width="auto"
            min-width="100"
            sortable="custom"
          >
            <template #default="{ row }">
              <div class="table-cell-text">
                <span>{{ row.stock }}</span>
                <el-popover
                  placement="bottom"
                  trigger="click"
                  width="auto"
                  @show="getProdSku(row.spuId)"
                  @after-enter="getCurrentSpuId(row.spuId, 'prodStock')"
                  @hide="clearShowPopoverInf()"
                >
                  <div v-if="currentModifyProdSkuList.length === 1">
                    <div>
                      <el-input
                        v-model="currentModifyProdSkuList[0].stock"
                      />
                      <div class="popover-bottom">
                        <el-button
                          plain
                          @click="closePopover()"
                        >
                          取消
                        </el-button>
                        <el-button
                          v-permission="['product:spu:modifyProdStock']"
                          type="primary"
                          @click="modifyProdStock(row.spuId, currentModifyProdSkuList)"
                        >
                          保存
                        </el-button>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="currentModifyProdSkuList.length > 1"
                    class="popover-table-con"
                  >
                    <el-table
                      :data="currentModifyProdSkuList"
                      header-cell-class-name="table-header"
                    >
                      <el-table-column
                        width="200"
                        prop="skuName"
                        label="规格名称"
                      />
                      <el-table-column
                        width="150"
                        prop="stock"
                        label="库存"
                      >
                        <template #default="scope">
                          <el-input-number
                            v-model="scope.row.stock"
                            :max="9999999"
                            :min="0"
                            type="number"
                            style="width:100%"
                            :disabled="scope.row.status!==1"
                            controls-position="right"
                          />
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="popover-bottom">
                      <el-button
                        plain
                        @click="closePopover()"
                      >
                        取消
                      </el-button>
                      <el-button
                        type="primary"
                        @click="modifyProdStock(row.spuId, currentModifyProdSkuList)"
                      >
                        保存
                      </el-button>
                    </div>
                  </div>
                  <template #reference>
                    <el-icon
                      v-show="row.spuId===currentMoveSpuId || (row.spuId===currentClickSpuId && currentShowPopover==='prodStock')"
                      :ref="`editStockBtn${row.spuId}`"
                      v-permission="['product:spu:modifyProdStock']"
                    >
                      <EditPen />
                    </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="序号"
            prop="seq"
            width="auto"
            sortable="custom"
          >
            <template #default="{ row }">
              <div class="table-cell-text">
                <span>{{ row.exhibitionSeq }}</span>
                <el-popover
                  placement="bottom"
                  trigger="click"
                  width="175"
                  @after-enter="getCurrentSpuId(row.spuId, 'seq')"
                  @hide="initProdInf(row)"
                >
                  <el-input-number
                    v-model="row.seq"
                    type="number"
                    :max="32767"
                    controls-position="right"
                  />
                  <div class="popover-bottom">
                    <el-button
                      plain
                      @click="closePopover()"
                    >
                      取消
                    </el-button>
                    <el-button
                      type="primary"
                      @click="modifySeq(row)"
                    >
                      保存
                    </el-button>
                  </div>
                  <template #reference>
                    <el-icon
                      v-show="row.spuId==currentMoveSpuId || (row.spuId==currentClickSpuId && currentShowPopover=='seq')"
                      v-permission="['product:spu:modifySeq']"
                    >
                      <EditPen />
                    </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="商品状态"
            prop="spuStatus"
            width="auto"
          >
            <template #default="{ row }">
              <span v-if="row.spuStatus === 0">下架</span>
              <span v-if="row.spuStatus === 1">上架</span>
              <span v-if="row.spuStatus === 2">平台下架</span>
              <span v-if="row.spuStatus === 3">等待审核</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('table.actions')"
            width="140"
          >
            <template #default="{ row }">
              <div class="table-btn-con">
                <el-button
                  v-permission="['score:spu:edit']"
                  link
                  type="primary"
                  @click="toReleaseProdPage(row.spuId)"
                >
                  编辑
                </el-button>
                <el-button
                  v-show="row.spuStatus === 0"
                  v-permission="['score:spu:prodSale']"
                  link
                  type="primary"
                  @click="prodSale(row.spuId)"
                >
                  上架
                </el-button>
                <el-button
                  v-show="row.spuStatus === 1"
                  v-permission="['score:spu:prodNotSale']"
                  link
                  type="primary"
                  @click="prodNotSale(row.spuId)"
                >
                  下架
                </el-button>
                <el-button
                  v-show="row.spuStatus === 2"
                  v-permission="['score:spu:applyOnline']"
                  link
                  type="primary"
                  @click="offlineManageHandle(row)"
                >
                  申请上线
                </el-button>
                <el-button
                  v-show="row.spuStatus === 3"
                  v-permission="['score:spu:viewAudit']"
                  link
                  type="primary"
                  @click="offlineManageHandle(row)"
                >
                  等待审核
                </el-button>
                <el-button
                  v-permission="['score:spu:delete']"
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
        <div class="page-number">
          <div
            v-if="pageVO.list.length"
            class="change-prod-status"
          >
            <span
              v-if="checkedCount"
              style="font-size:12px;margin-left:10px;color:#155bd4;"
            >已选商品 {{ checkedCount }}</span>
            <div class="button-box">
              <!-- 上架按钮 -->
              <el-button
                v-if="prodStatusRadio!==0 && prodStatusRadio!==1 && prodStatusRadio!==2"
                @click="changeProdStatus('onTheShelf')"
              >
                上架
              </el-button>
              <!-- 下架按钮 -->
              <el-button
                v-if="prodStatusRadio!==0 && prodStatusRadio!==3"
                @click="changeProdStatus('offTheShelf')"
              >
                下架
              </el-button>
            </div>
          </div>
          <el-pagination
            v-show="pageVO.total>0"
            class="pagination"
            :page-sizes="[10, 20, 50, 100]"
            :current-page="pageQuery.pageNum"
            :page-size="pageQuery.pageSize"
            :total="pageVO.total"
            layout="->,total, sizes, prev, pager, next, jumper"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
          />
        </div>
      </div>
    </div>
    <!-- 下架管理 -->
    <spu-upload
      v-if="uploadVisible"
      ref="spuUploadRef"
      @refresh-data-list="getWaitingConsignmentExcel"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/product/list.js'
import * as categoryApi from '@/api/product/category.js'
import SpuUpload from './components/spu-upload.vue'
import { treeDataTranslate } from '@/utils/index.js'
import Big from 'big.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const dataForm = reactive({
  prodName: '',
  prodCode: '',
  saleBeginInp: '',
  saleEndInp: '',
  currentPriceBeginInp: '',
  currentPriceEndInp: ''
})
const prodStatusRadio = ref(0)

const currentModifyProdName = reactive({ spuNameZh: null, spuNameEn: null }) // 当前准备修改的商品的规格列表

let isSubmit = false
// 查询的参数
let searchParam = {}
onMounted(() => {
  isSubmit = false
  searchParam.spuId = route.query.spuId
  dataForm.prodName = route.query.spuName
  getProdList()
  getPlatformCategories() // 平台分类
})

const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 条件搜索
const conditionSearch = (newData = false) => {
  pageQuery.pageNum = 1
  searchParam = {
    spuId: dataForm.prodId || undefined,
    partyCodes: dataForm.prodCode || undefined,
    keyword: dataForm.prodName || undefined,
    shopPrimaryCategoryId: dataForm.shopPrimaryCategoryId || undefined, // 商家一级分类id
    shopSecondaryCategoryId: dataForm.shopSecondaryCategoryId || undefined, // 商家二级分类id
    primaryCategoryId: dataForm.primaryCategoryId || undefined, // 平台一级分类id
    secondaryCategoryId: dataForm.secondaryCategoryId || undefined, // 平台二级分类id
    categoryId: dataForm.categoryId || undefined, // 平台三级分类id
    minSaleNum: dataForm.saleBeginInp || undefined,
    maxSaleNum: dataForm.saleEndInp || undefined,
    minPrice: accuracyCount(dataForm.currentPriceBeginInp, 100, 2) || undefined, // 当前价最低值
    maxPrice: accuracyCount(dataForm.currentPriceEndInp, 100, 2) || undefined, // 当前价最高值
    isCompose: dataForm.currentyuPreSaleStatus === '' ? undefined : dataForm.currentyuPreSaleStatus
  }
  getProdList(newData)
}

// loading
const pageLoading = ref(true)
const uploadVisible = ref(false)
let tempSearchForm = null // 保存上次点击查询的请求条件
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// 多选
const isSelectedAll = ref(false)
const selectedProdList = ref([]) // 被选中的商品列表
const checkedCount = ref(0)
/**
 * 获取商品列表
 */
const getProdList = (newData = false) => {
  pageLoading.value = true
  uploadVisible.value = false
  // 商品类型 3:积分商品
  searchParam.spuType = 3
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchParam }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  api.page(tempSearchForm).then(pageVOPar => {
    pageVOPar.list.forEach(item => {
      item.showSpuName = item.spuName
      item.exhibitionSeq = item.seq
      item.isSelected = false
      item.priceFee = accuracyCount(item.priceFee, 100, 3)
      item.marketPriceFee = accuracyCount(item.marketPriceFee, 100, 3)
    })
    pageVO.list = pageVOPar.list
    pageVO.total = pageVOPar.total
    pageVO.pages = pageVOPar.pages
    pageLoading.value = false
  })
  isSelectedAll.value = false
  selectedProdList.value = []
  checkedCount.value = 0
}

const platformCategories = ref([]) // 平台分类
/**
 * 获取平台分类
 */
const getPlatformCategories = () => {
  pageLoading.value = true
  categoryApi.enableCategories({ shopId: 0 }).then(pageVO => {
    platformCategories.value = treeDataTranslate(pageVO, 'categoryId', 'parentId')
    pageLoading.value = false
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

const isIndeterminate = ref(false)
// 切换不同状态的商品展示
// 0：代表全部商品
// 1：在售中的商品
// 2：已售完的商品
// 3：已下架的商品
const switchProdList = () => {
  const dataType = Number(prodStatusRadio.value)
  isSelectedAll.value = false
  isIndeterminate.value = false
  pageQuery.pageNum = 1
  searchParam = {
    dataType
  }
  getProdList(true)
}

// 跳转发布商品页
const toReleaseProdPage = (spuId) => {
  if (spuId === -1) {
    router.push('/member/score/post-prod')
  } else {
    router.push({
      path: '/member/score/post-prod',
      query: {
        spuId
      }
    })
  }
}

const spuUploadRef = ref(null)

const getWaitingConsignmentExcel = () => {
  getProdList()
}

/**
 * 监听表格选中
 */
const onSelectSome = (val) => {
  selectedProdList.value = val
  checkedCount.value = val.length
  isSelectedAll.value = val.length === pageVO.list.length
}

const prodListTableRef = ref(null)
/**
 * 全选按钮
 */
const onSelectAll = () => {
  isSelectedAll.value = selectedProdList.value.length < pageVO.list.length
  prodListTableRef.value?.toggleAllSelection()
}

/**
  * 条件排序
  * price_dese 价格        5-正序 4-倒序
  * marketPriceFee 市场价  8-正序  7-倒序
  * actualSoldNum:实际销量 18-正序 17-倒序
  * stock:库存             11-正序 10-倒序
  * seq:序号               13-正序 12-倒序
 */

const sordChange = (e) => {
  const sortType = e.prop
  const currentSortCode = e.order
  let sort = null
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
    default:
      break
  }
  searchParam = {
    sort
  }
  getProdList(true)
}

// 改变商品状态
// onTheShelf:上架
// offTheShelf:下架
const changeProdStatus = (status) => {
  // 如果没选商品，提示选择商品
  if (selectedProdList.value.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }

  if (status === 'onTheShelf') {
    prodSale(selectedProdList.value)
  } else if (status === 'offTheShelf') {
    prodNotSale(selectedProdList.value)
  }
}

// 商品上架
const prodSale = (spuIdOrSpuIds) => {
  // 是否操作单个商品
  const isSingle = typeof (spuIdOrSpuIds) === 'number'
  const param = {
    status: 1,
    spuId: isSingle ? spuIdOrSpuIds : undefined,
    spuIds: isSingle ? undefined : spuIdOrSpuIds.map(item => { return item.spuId })
  }
  if (isSubmit) {
    return
  }
  isSubmit = true
  api.updateProdStatus(param).then(() => {
    ElMessage({
      message: '商品上架成功',
      type: 'success',
      duration: 1500,
      onClose: () => getProdList()
    })
    isSubmit = false
  }).catch(() => {
    isSubmit = false
  })
}

// 商品下架
const prodNotSale = (spuIdOrSpuIds) => {
  // 是否操作单个商品
  const isSingle = typeof (spuIdOrSpuIds) === 'number'
  const prodList = pageVO.list.filter(item => {
    return item.spuStatus === 0
  })
  let flag = 0
  for (let i = 0; i < prodList.length; i++) {
    for (let j = 0; j < spuIdOrSpuIds.length; j++) {
      if (spuIdOrSpuIds[j].spuId === prodList[i].spuId) {
        flag = 1
        break
      }
    }
    if (flag) {
      break
    }
  }
  if (flag) {
    ElMessage.error('请勿选择已经下架的商品')
    return
  }
  const param = {
    status: 0,
    spuId: isSingle ? spuIdOrSpuIds : undefined,
    spuIds: isSingle ? undefined : spuIdOrSpuIds.map(item => { return item.spuId })
  }
  if (isSubmit) {
    return
  }
  ElMessageBox.confirm($t('order.order.offlineTip'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    isSubmit = true
    api.updateProdStatus(param).then(() => {
      ElMessage({
        message: '商品下架成功',
        type: 'success',
        duration: 1500,
        onClose: () => getProdList()
      })
      isSubmit = false
    }).catch(() => {
      isSubmit = false
    })
  }).catch(() => { })
}

// 商品删除
const prodDelete = (spuId) => {
  if (isSubmit) {
    return
  }
  ElMessageBox.confirm($t('distribution.deletes'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    isSubmit = true
    api.deleteById(spuId).then(() => {
      ElMessage({
        message: '商品删除成功',
        type: 'success',
        duration: 1500,
        onClose: () => getProdList()
      })
      isSubmit = false
    }).catch(() => {
      isSubmit = false
    })
  }).catch(() => { })
}

const currentMoveSpuId = ref('') // 移入项的spuId
/**
 * 鼠标移入单元格
 */
const cellMouseEnter = (row) => {
  currentMoveSpuId.value = row.spuId
}
/**
 * 鼠标移出单元格
 */
const cellMouseLeave = () => {
  currentMoveSpuId.value = ''
}

const currentClickSpuId = ref('') // 点击项的spuId
const currentShowPopover = ref('') // 当前展示的弹窗
// 获取弹出弹窗项信息
const getCurrentSpuId = (spuId, currentShowPopoverPar) => {
  currentClickSpuId.value = spuId
  currentShowPopover.value = currentShowPopoverPar
}

// 清空选中项弹窗信息
const clearShowPopoverInf = () => {
  currentClickSpuId.value = ''
  currentShowPopover.value = ''
}

const currentModifyProdSkuList = ref([]) // 当前准备修改的商品的规格列表
/**
 * 获取商品sku列表
 */
const getProdSku = (spuId) => {
  api.get(spuId).then(data => {
    currentModifyProdSkuList.value = data.skus
    currentModifyProdSkuList.value.forEach(item => {
      item.originalStock = item.stock
      item.priceFee = accuracyCount(item.priceFee, 100, 3)
      item.oldPriceFee = item.priceFee
      item.marketPriceFee = accuracyCount(item.marketPriceFee, 100, 3)
    })
  })
}

/**
 * 获取商品名称列表
 */
const getProdName = (spuId) => {
  api.get(spuId).then(data => {
    data.spuLangList.forEach(spuLang => {
      if (spuLang.lang === 1) {
        currentModifyProdName.spuNameZh = spuLang.spuName
        currentModifyProdName.spuNameZhOld = spuLang.spuName
      } else {
        currentModifyProdName.spuNameEn = spuLang.spuName
        currentModifyProdName.spuNameEnOld = spuLang.spuName
      }
    })
  })
}

// 关闭弹窗后,初始化数据
const initProdInf = (row) => {
  row.spuName = row.showSpuName
  row.seq = row.exhibitionSeq
  clearShowPopoverInf()
}

const closepopoverRef = ref(null)
// 关闭popover弹窗
const closePopover = () => {
  closepopoverRef.value?.click()
}

// 修改商品名称
const modifyProdName = (row) => {
  const nameObject = currentModifyProdName
  if (nameObject.spuNameZh.trim() === '') {
    ElMessage({
      message: '请输入中文商品名称',
      type: 'warning'
    })
    return
  } else if (nameObject.spuNameZh === nameObject.spuNameZhOld && nameObject.spuNameEn === nameObject.spuNameEnOld) {
    closePopover()
    return
  }
  const spuLangList = [{ lang: 1, spuName: nameObject.spuNameZh }]
  if (nameObject.spuNameEn) {
    spuLangList.push({ lang: 2, spuName: nameObject.spuNameEn })
  }
  const param = {
    spuId: row.spuId,
    spuLangList
  }
  if (isSubmit) {
    return
  }
  isSubmit = true
  api.updatePartProdStatus({ ...param }).then(() => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getProdList()
        closePopover()
      }
    })
    isSubmit = false
  }).catch(() => {
    isSubmit = false
  })
}

// 修改商品价格
const modifyProdPrice = (spuId, skus) => {
  const skuList = []
  let isChangePriceFee = false
  let minPriceFee = 0
  // 判断是否价格有变动,没有变动不更新价格,关闭弹窗即可
  for (let i = 0; i < skus.length; i++) {
    if (skus[i].priceFee < 0) {
      ElMessage({
        message: '价格不得小于0',
        type: 'warning'
      })
      return false
    }
    if (skus[i].oldPriceFee !== skus[i].priceFee) {
      isChangePriceFee = true
      break
    }
  }
  if (isChangePriceFee === false) {
    closePopover()
    return
  }
  // 把需要传递的参数,单独取出来
  for (let i = 0; i < skus.length; i++) {
    if (skus[i].priceFee === '') {
      ElMessage({
        message: '请输入商品价格',
        type: 'warning'
      })
      return
    } else {
      skuList.push({
        priceFee: accuracyCount(skus[i].priceFee, 100, 2),
        skuId: skus[i].skuId
      })
    }
  }
  // 获取多种规格下的最小价格
  minPriceFee = skuList[0].priceFee
  for (let i = 1; i < skuList.length; i++) {
    if (minPriceFee > skuList[i].priceFee) {
      minPriceFee = skuList[i].priceFee
    }
  }
  const param = {
    spuId,
    priceFee: minPriceFee,
    skuList
  }
  if (isSubmit) {
    return
  }
  isSubmit = true
  api.updatePartProdStatus({ ...param }).then(() => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getProdList()
        closePopover()
      }
    })
    isSubmit = false
  }).catch(() => {
    isSubmit = false
  })
}

// 修改商品库存
const modifyProdStock = (spuId, skus) => {
  const skuList = []
  let totalChangeStock = 0
  for (let i = 0; i < skus.length; i++) {
    if (skus[i].stock < 0) {
      ElMessage({
        message: '库存不得小于0',
        type: 'warning'
      })
      return false
    }
    let changeStock = 0
    if (skus[i].stock === '') {
      ElMessage({
        message: '请输入商品库存',
        type: 'warning'
      })
      return
    } else {
      changeStock = parseInt(skus[i].stock - skus[i].originalStock)
      totalChangeStock += changeStock
      skuList.push({
        changeStock,
        skuId: skus[i].skuId
      })
    }
  }
  // 如果库存没有发生改变,就不更新库存,只关闭弹窗
  let skuChange = false
  skuList.forEach(sku => {
    if (sku.changeStock !== 0) {
      skuChange = true
    }
  })
  if (!skuChange) {
    closePopover()
    return
  }
  const param = {
    spuId,
    changeStock: totalChangeStock,
    skuList
  }
  if (isSubmit) {
    return
  }
  isSubmit = true
  api.updatePartProdStatus({ ...param }).then(() => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getProdList()
        closePopover()
      }
    })
    isSubmit = false
  }).catch(() => {
    isSubmit = false
  })
}

// 修改序号
const modifySeq = (scope) => {
  if (scope.seq < 0) {
    ElMessage({
      message: '序号不得小于0',
      type: 'warning'
    })
    return false
  }
  if (scope.seq === '') {
    ElMessage({
      message: '请输入序号',
      type: 'warning'
    })
    return
  } else if (scope.exhibitionSeq === scope.seq) {
    closePopover()
    return
  }
  const param = {
    spuId: scope.spuId,
    seq: scope.seq
  }
  if (isSubmit) {
    return
  }
  isSubmit = true
  api.updatePartProdStatus({ ...param }).then(() => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getProdList()
        closePopover()
      }
    })
    isSubmit = false
  }).catch(() => {
    isSubmit = false
  })
}

// 每页数
const sizeChangeHandle = (val) => {
  pageQuery.pageSize = val
  pageQuery.pageNum = 1
  getProdList()
}

// 当前页
const currentChangeHandle = (val) => {
  pageQuery.pageNum = val
  getProdList()
}

/**
 * 精度运算
 * @param {Number} a:第一个计算数(例如:被除数/被减数)
 * @param {Number} b:第二个计算数(例如:除数/减数)
 * @param {Number} countMode:计算方式(0:加 1:减 2:乘 3:除)
 */
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

const selectedMenu = ref([])
const selectedPlatformCategories = ref([])
/**
 * 清空
 */
const clearSearchInfo = () => {
  dataForm.saleBeginInp = undefined
  dataForm.saleEndInp = undefined
  dataForm.currentPriceBeginInp = undefined
  dataForm.currentPriceEndInp = undefined
  dataForm.primaryCategoryId = undefined
  dataForm.secondaryCategoryId = undefined
  dataForm.categoryId = undefined
  dataForm.shopPrimaryCategoryId = undefined
  dataForm.shopSecondaryCategoryId = undefined
  dataForm.prodCode = ''
  dataForm.prodName = ''
  selectedMenu.value = []
  selectedPlatformCategories.value = []
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
