<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    class="prod-det"
    width="1100px"
    title="商品详情"
    @close="closeDialog"
  >
    <div
      v-if="visible"
      class="mod-prod-info release-goods"
    >
      <el-form
        ref="dataFormRef"
        class="part-form"
        :model="dataForm"
        label-width="110px"
        @submit.prevent
      >
        <div class="info-box">
          <!-- 1.商品基本信息 -->
          <div class="part-content">
            <div class="part-tit">
              <span class="part-tit-num">1</span><span class="part-tit-name">商品基本信息</span>
            </div>
            <!-- 商品平台分类（不可修改） -->
            <div class="part-form-div">
              <div class="part-form-item-tit">
                平台分类
              </div>
              <div class="part-form-item">
                <div class="classify-show">
                  <category-group
                    :selected-categories="selectedCategories"
                    :show-category-select-btn="showCategorySelectBtn"
                    :single="true"
                  />
                </div>
              </div>
            </div>

            <!-- 商品店铺分类 -->
            <div
              v-if="dataForm.shopCategoryId&&dataForm.shopCategoryId!==-1"
              class="part-form-div"
            >
              <div class="part-form-item-tit">
                店铺分类
              </div>
              <div class="part-form-item">
                <div class="classify-show">
                  <category-group
                    :selected-categories="selectedShopCategories"
                    :show-category-select-btn="showCategorySelectBtn"
                    :single="true"
                  />
                </div>
              </div>
            </div>

            <!-- 商品标题(中文) -->
            <el-form-item
              label="商品标题"
              prop="nameZh"
            >
              <el-input
                v-model="dataForm.nameZh"
                :readonly="true"
                placeholder="商品标题组成：商品描述+规格"
                :disabled="!dataForm.categoryId"
                style="width:90%"
              />
            </el-form-item>
            <!-- 商品卖点(中文) -->
            <el-form-item
              label="商品卖点"
              prop="sellingPointZh"
            >
              <el-input
                v-model="dataForm.sellingPointZh"
                :readonly="true"
                type="textarea"
                placeholder="商品卖点"
                :disabled="!dataForm.categoryId"
                style="width:90%"
              />
            </el-form-item>
            <!-- 商品品牌 -->
            <el-form-item
              v-if="brandName"
              label="所属品牌"
            >
              <div class="brand">
                <img-show
                  :src="brandImgUrl"
                  :class-list="['brand-img']"
                />
                <el-tag
                  v-if="brandName"
                  class="br"
                  :disable-transitions="true"
                  @close="handleCloseBrand()"
                >
                  <span class="brandname">{{ brandName }}</span>
                </el-tag>
              </div>
            </el-form-item>
            <!-- 商品基本规格 -->
            <el-form-item
              v-if="basicAttrs.length > 0"
              label="基本属性"
            >
              <spu-category-attrs
                :input-disabled="true"
                :disabled="true"
                :attrs-list="basicAttrs"
                @get-value-of-basic-attrs="getValueOfBasicAttrs"
              />
            </el-form-item>
            <!-- 商品排序 -->
            <el-form-item label="商品排序">
              <el-input
                v-model.number="dataForm.seq"
                :readonly="true"
                :max="32767"
                oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                placeholder="请输入商品排序"
                :min="1"
                validate-event
                style="width:200px"
              />
            </el-form-item>
            <!-- 商品轮播图 -->
            <div class="part-form-div">
              <div class="part-form-item-tit">
                商品轮播图
              </div>
              <div
                v-if="dataForm.imgUrls"
                class="part-form-item "
              >
                <el-image
                  v-for="(img,index) in dataForm.imgUrls"
                  :key="index"
                  class="rotating-img"
                  style="width: 100px; height: 100px"
                  :src="img"
                  :preview-src-list="[img]"
                >
                  <template #error>
                    <img
                      class="img-slot"
                      src="@/assets/images/def.png"
                      alt
                    >
                  </template>
                </el-image>
                <div class="banner-tips">
                  建议图片尺寸为 800*800，可拖动排序，最多上传9张
                </div>
              </div>
            </div>
            <!-- 商品视频 -->
            <div
              v-if="dataForm.video"
              class="part-form-div"
            >
              <div class="part-form-item-tit star">
                商品视频
              </div>
              <div class="part-form-item">
                <video
                  :src="resourcesUrl + dataForm.video"
                  controls="controls"
                  class="video-box"
                />
              </div>
            </div>
          </div>

          <!-- 2.商品sku与库存 -->
          <div class="part-content">
            <div class="part-tit">
              <span class="part-tit-num">2</span><span class="part-tit-name">商品销售规格与库存</span>
            </div>
            <div class="part-form-div">
              <div
                v-if="salesAttrs.length"
                class="part-form-item-tit"
              >
                销售规格
              </div>
              <div class="part-form-item">
                <!-- sku-组件 -->
                <sku-block
                  :sales-attrs="salesAttrs"
                  :save-sales-attrs="originalSalesAttrs"
                  :sku-tree="originalSkuTree"
                  :on-fetch-group="fetchSkuTree"
                  :on-fetch-sku="fetchSku"
                  :on-create-sku="createSku"
                  :on-create-group="createGroup"
                  :on-preview-img="onPicturePreview"
                  :category-id="dataForm.shopCategoryId"
                  @on-change="changeSkuGroupData"
                />
              </div>
            </div>
            <!-- 价格及库存 -->
            <div class="part-form-div">
              <div class="part-form-item-tit">
                价格及库存
              </div>
              <div class="setup-spec">
                <div class="sku-table">
                  <!-- sku表格 -->
                  <sku-table
                    :data="salesAttrs"
                    :is-disabled="true"
                    :flatten="flatten"
                    :is-no-sku-value="isNoSkuValue"
                    :spu-id="parseInt(dataForm.spuId)"
                    :is-category-id="!!dataForm.categoryId"
                    @on-change-data="handleChangeData"
                  />
                </div>
              </div>
            </div>
            <div class="part-form-div">
              <div class="part-form-item-tit">
                总库存
                <el-tooltip
                  class="item"
                  effect="light"
                  content="每个规格库存的总和"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
              </div>
              <el-input
                v-model="dataForm.totalStock"
                :readonly="true"
                style="width:150px"
              />
            </div>
          </div>

          <!-- 3.运费设置/用户留言 -->
          <div class="part-content">
            <div class="part-tit">
              <span class="part-tit-num">3</span><span class="part-tit-name">{{ dataForm.spuMold!==1 ?"运费设置":"用户留言" }}</span>
            </div>
            <!-- 运费设置 -->
            <div
              v-if="dataForm.spuMold!==1"
              class="part-form-logistics"
            >
              <el-form-item label="配送方式">
                <el-checkbox
                  v-model="dataForm.deliveryMode.hasShopDelivery"
                  disabled
                >
                  快递发货
                </el-checkbox>
              </el-form-item>
              <el-form-item
                label="运费模板"
                prop="deliveryTemplateId"
              >
                <span>{{ dataForm.deliveryTemplateName }}</span>
              </el-form-item>
            </div>
            <!-- 虚拟商品的用户留言 -->
            <div
              v-else
              class="part-form-logistics"
            >
              <el-form-item label="全部留言：">
                <div
                  v-for="(item,index) in dataForm.virtualRemark"
                  :key="index"
                >
                  <span>{{ item.name }}</span>
                </div>
              </el-form-item>
            </div>
          </div>

          <!-- 4.商品详情 -->
          <div class="part-content">
            <div class="part-tit">
              <span class="part-tit-num">4</span><span class="part-tit-name">商品详情</span>
            </div>
            <div class="part-form-info">
              <product-details
                v-model:data-form="dataForm"
              />
            </div>
          </div>
        </div>

        <!-- 图片预览 -->
        <picture-preview
          v-if="picturePreviewVisible"
          ref="picturePreviewRef"
        />
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/prod-info.js'
import { getUUID, formatHtml, checkFileUrl } from '@/utils/index.js'
import { transportGet } from '@/api/distribution-manage/transport.js'
import skuBlock from '@/components/sku/SkuBlock/index.vue'
import skuTable from '@/components/sku/SkuTable/index.vue'
import spuCategoryAttrs from '@/components/spu-category-attrs/index.vue'
import productDetails from '@/components/product-details/index.vue'
import categoryGroup from '@/components/category-group/index.vue'
import picturePreview from '@/components/picture-preview/index.vue'
import Big from 'big.js'
import { ElMessage } from 'element-plus'
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const route = useRoute()
const dataForm = ref({
  spuId: route.query.spuId || null, // 商品id
  categoryId: null, // 分类id
  shopCategoryId: null, // 店铺分类id
  nameZh: '', // 商品名称
  nameEn: '', // 商品名称
  sellingPointZh: '', // 商品卖点
  sellingPointEn: '', // 商品卖点
  brandId: 0, // 品牌id（非必选）
  imgUrls: '', // 轮播图 多个图片逗号分隔
  isCompose: 0, // 是否为组合商品0普通商品，1组合商品
  mainImgUrl: '', // 商品主图
  hasSkuImg: 0, // sku是否含有图片 0无 1有
  scoreFee: 0, // 积分价格（非必填）
  seq: null, // 商品排序（非必填）
  spuAttrValues: [], // 商品规格值列表
  deliveryMode: {
    hasShopDelivery: true,
    hasUserPickUp: false,
    hasCityDelivery: false
  }, // 配送方式
  deliveryTemplateId: '', // 运费模板id
  detail: '', // 详情信息（非必填）
  skuList: [], // sku列表
  totalStock: 0, // 商品总库存
  spuMold: 0, // 商品模型 1：虚拟商品 2：实物商品
  virtualRemark: [] // 虚拟商品的用户留言
})
const salesAttrs = ref([]) // 销售规格列表
const originalSkuTree = ref([]) // sku规格选项列表(不受改变影响)

const appStore = useAppStore()
const language = computed(() => {
  return appStore.language === 'zh' ? 1 : 2
})

const visible = ref(false)
const dataFormRef = ref(null)
let originalSpuAttrValueList = [] // 基本规格回显原数据
let backTotalStock = null // 回显总库存
const showCategorySelectBtn = ref(false) // '选择分类'按钮显隐
const brandImgUrl = ref('') // 品牌logo
const brandName = ref('') // 品牌名称
const init = (spuId) => {
  dataForm.value.spuId = spuId || ''
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!spuId) {
      return
    }
    api.getProdInfoPage(spuId).then(async data => {
      data.virtualRemark = data.virtualRemark ? JSON.parse(data.virtualRemark) : []
      // 商品数据
      dataForm.value = data
      // 规格规格
      originalSpuAttrValueList = data.spuAttrValues
      backTotalStock = data.skus.reduce((res, { stock }) => {
        res += (stock || 0)
        return res
      }, 0)
      // 商品轮播图
      if (data.imgUrls) {
        const imgUrls = data.imgUrls.split(',')
        const imgs = []
        imgUrls.forEach((img) => {
          const image = checkFileUrl(img)
          imgs.push(image)
        })
        dataForm.value.imgUrls = imgs
      } else {
        dataForm.value.imgUrls = []
      }
      // 配送方式
      dataForm.value.deliveryMode = JSON.parse(data.deliveryMode)
      // 回显分类
      getCategoryBack()
      // 商品分类选择按钮
      showCategorySelectBtn.value = false
      if (data.brand?.imgUrl) {
        brandImgUrl.value = checkFileUrl(data.brand.imgUrl) // 品牌图片
      }
      brandName.value = data.brand?.name // 品牌名字
      // 根据分类获取基本规格列表
      dataForm.value.spuAttrValues.forEach(spuAttrValue => {
        if (spuAttrValue.spuAttrValueLangList && spuAttrValue.spuAttrValueLangList.length > 0) {
          spuAttrValue.spuAttrValueLangList.forEach(spuAttrValueLang => {
            if (spuAttrValueLang.lang === language.value) {
              spuAttrValue.attrName = spuAttrValueLang.attrName
              spuAttrValue.attrValueName = spuAttrValueLang.attrValueName
            }
          })
        }
      })
      getAttrsByCategoryId(data.categoryId, dataForm.value.spuAttrValues)
      // sku回显
      await skuBackShow(data.skus) // 销售规格
      // 商品详情回显
      data.detailList?.forEach(el => {
        if (el.lang === 1) {
          dataForm.value.detailZh = formatHtml(el.detail)
        }
        if (el.lang === 2) {
          dataForm.value.detailEn = formatHtml(el.detail)
        }
      })
      dataForm.value.spuLangList.forEach(spuLang => {
        if (spuLang.lang === 1) {
          dataForm.value.nameZh = spuLang.spuName
          dataForm.value.sellingPointZh = spuLang.sellingPoint
        } else if (spuLang.lang === 2) {
          dataForm.value.nameEn = spuLang.spuName
          dataForm.value.sellingPointEn = spuLang.sellingPoint
        }
      })
      // 运费模板
      getTransportData()
      visible.value = true
    })
  })
}

const selectedCategories = ref([]) // 选中的平台分类
const selectedShopCategories = ref([]) // 选中的平台分类
/**
 * 获取分类
 */
const getCategoryBack = () => {
  // 平台分类
  selectedCategories.value = [] // 选中的分类
  dataForm.value.category.categories.forEach(category => {
    selectedCategories.value.push({ name: category.name })
  })
  selectedCategories.value.push({ name: dataForm.value.category.name })

  // 店铺分类
  selectedShopCategories.value = []
  if (dataForm.value.shopCategory) {
    dataForm.value.shopCategory.categories.forEach(category => {
      selectedShopCategories.value.push({ name: category.name })
    })
    selectedShopCategories.value.push({ name: dataForm.value.shopCategory.name })
  }
}

const basicAttrs = ref([]) // 基本规格列表
/**
 * 根据分类获取基本规格列表
 */
const getAttrsByCategoryId = (categoryId, spuAttrValues) => {
  const param = {
    categoryId,
    attrType: 1 // 基本规格
  }
  api.getAttrsByCategoryId(param).then((data) => {
    // 获取数据回显
    if (spuAttrValues) {
      data.forEach((attr) => {
        spuAttrValues.forEach(spuAttr => {
          if (!attr.attrValues.length && (!spuAttr.attrValueId || spuAttr.attrValueId === 0)) {
            if (attr.attrId === spuAttr.attrId) {
              attr.attrValue = spuAttr.attrValueName
            }
          } else {
            if (attr.attrValues.some(attr => spuAttr.attrValueId === attr.attrValueId)) {
              attr.attrValue = spuAttr.attrValueId
            }
          }
        })
      })
    }
    basicAttrs.value = data
    basicAttrs.value.forEach(attr => {
      attr.attrLangList.forEach(attrLang => {
        if (attrLang.lang === language.value) {
          attr.name = attrLang.name
        }
      })
      attr.attrValues.forEach(attrValue => {
        attrValue.values.forEach(valueLang => {
          if (valueLang.lang === language.value) {
            attrValue.value = valueLang.value
          }
        })
      })
    })
  })
}

const spuAttrValueList = [] // 商品基本规格值列表
/**
 * 基本规格数据
 */
// eslint-disable-next-line no-unused-vars
const getValueOfBasicAttrs = (attrsList, attrs, st) => {
  const originalSpuAttrValueListPar = originalSpuAttrValueList
  const spuAttrValueListPar = spuAttrValueList
  const spuAttrValue = {}
  if (dataForm.value.spuId) { // 回显
    originalSpuAttrValueListPar.forEach((item) => {
      if (item.attrId === attrs.attrId) {
        attrs.spuAttrValueId = item.spuAttrValueId
        spuAttrValue.spuAttrValueId = attrs.spuAttrValueId
      }
    })
  }
  // 获取基本规格子组件返回数据
  spuAttrValue.attrId = attrs.attrId
  spuAttrValue.attrName = attrs.name
  if (st === 0) { // 下拉选择
    attrs.attrValues.some(attr => {
      let val = false
      if (attrs.attrValue === attr.attrValueId) {
        spuAttrValue.attrValueId = attrs.attrValue
        spuAttrValue.attrValueName = attr.value
        spuAttrValueListPar.push(spuAttrValue)
        val = true
      }
      return val
    })
  }
  if (st === 1) { // 输入框
    spuAttrValue.attrValueId = ''
    spuAttrValue.attrValueName = attrs.attrValue
    if (attrs.searchType === 1 && !attrs.attrValue) {
      ElMessage({
        message: '当前规格为必填规格，请填写规格值！',
        duration: 1500
      })
      return
    } else {
      spuAttrValueList.push(spuAttrValue)
    }
  }
  // 去重
  removeDuplication(spuAttrValueList, 'attrId')
  dataForm.value.spuAttrValues = spuAttrValueList
}

const isNoSkuValue = ref(false) // 回显时的商品是否有sku
const flatten = ref([])
/**
 * sku回显
 */
const skuBackShow = (skus) => {
  if (skus && skus.length > 0) {
    const salesAttrsPar = []
    const ids = []
    const attrValueNameMapId = []
    skus.forEach(sku => {
      sku.spuSkuAttrValues?.forEach((attrInfo, idx) => {
        if (attrInfo.spuSkuAttrValueLangList) {
          attrInfo.spuSkuAttrValueLangList.forEach(spuSkuAttrValueLang => {
            if (spuSkuAttrValueLang.lang === language.value || spuSkuAttrValueLang.lang === 0) {
              attrInfo.attrName = spuSkuAttrValueLang.attrName
              attrInfo.attrValueName = spuSkuAttrValueLang.attrValueName
            }
          })
        }
        // 无sku
        if (attrInfo.attrName === null && attrInfo.attrValueName === null) {
          isNoSkuValue.value = true
          return
        }

        /** 有sku */
        /** left的每一项 */

        // 每一层id一致
        ids[idx] = ids[idx] || attrInfo.attrId || getUUID() // 无attrId则随机生成一个新id
        attrInfo.attrId = ids[idx]

        if (!attrValueNameMapId[idx]) {
          attrValueNameMapId[idx] = {}
        }

        const attrValueId = attrValueNameMapId[idx][attrInfo.attrValueName] || attrInfo.attrValueId || getUUID()
        attrValueNameMapId[idx][attrInfo.attrValueName] = attrValueId
        attrInfo.attrValueId = attrValueId
        const skuValueItem = {
          id: attrValueId,
          is_show: !!sku.imgUrl,
          text: attrInfo.attrValueName
        }

        if (idx === 0) {
          skuValueItem.imgUrl = sku.imgUrl || ''
        }
        if (salesAttrsPar[idx] === undefined) {
          salesAttrsPar[idx] = {
            id: ids[idx],
            leaf: [skuValueItem],
            text: attrInfo.attrName
          }
        } else {
          salesAttrsPar[idx].leaf.push(skuValueItem)
        }
      })
    })
    // 去重
    salesAttrsPar.forEach(attr => {
      attr.leaf = removeDuplication(attr.leaf, 'text')
    })
    skus.forEach(skuItem => {
      skuItem.marketPriceFee = parseFloat(bigActualTotal(parseFloat(skuItem.marketPriceFee), 100)) // 市场价
      skuItem.priceFee = parseFloat(bigActualTotal(parseFloat(skuItem.priceFee), 100)) // 销售价
    })
    skus.forEach((skuItem, i) => {
      flatten.value[i] = skuItem
    })
    salesAttrsPar.forEach((attr, i) => {
      salesAttrs.value[i] = attr
    })
    flatten.value = skus
  }
  querySalesAttrData(skus)
}

const originalSalesAttrs = ref([]) // 起初的(不变的)销售规格
let skuTree = [] // 规格列表
/**
 * 获取店铺中的销售规格
 */
const querySalesAttrData = (skus) => {
  if (!skus) {
    originalSalesAttrs.value.splice(0, originalSalesAttrs.value.length)
  }
  skuTree.splice(0, skuTree.length) // 清空
}

// 去重
const removeDuplication = (items, validKey) => {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i][validKey] === items[j][validKey]) {
        items.splice(i, 1)
        j--
      }
    }
  }
  return items
}

const fetchSkuTree = () => {
  // 异步获取规格列表
  return new Promise(resolve => {
    resolve(skuTree)
  })
}

const fetchSku = (id) => {
  // 异步获取规格可选值
  return new Promise(resolve => {
    resolve(getSkus(id))
  })
}

// 获取规格可选值
const getSkus = (id) => {
  const sku = []
  originalSalesAttrs.value.forEach(attr => {
    if (id === attr.attrId) {
      attr.attrValues.forEach(attrVal => {
        const attrValue = {}
        attrValue.text = attrVal.value
        attrValue.id = attrVal.attrValueId
        sku.push(attrValue)
      })
    }
  })
  return sku
}

const createGroup = (text) => {
  // 创建新的规格名
  return new Promise((resolve, reject) => {
    const randomId = 'random_'
    if (text) {
      resolve(randomId + parseInt(Math.random() * 100, 10) + 1)
    } else {
      reject(new Error())
    }
  })
}

const createSku = (data) => {
  // 创建新的规格值
  return new Promise((resolve) => {
    const randomId = 'random_'
    resolve(data.data.map(item => {
      return {
        id: randomId + parseInt(Math.random() * 100, 10) + parseInt(Math.random() * 100, 10),
        text: item,
        leaf: []
      }
    }))
  })
}

// SkuGroup返回数据
const changeSkuGroupData = (data) => {
  skuTree = data
  data?.[0]?.leaf.forEach(attr => {
    if (attr.is_show) {
      dataForm.value.hasSkuImg = 1
    } else {
      dataForm.value.hasSkuImg = 0
    }
  })
}

let skuTableData = [] // sku表格返回数据
// SkuTable返回数据
const handleChangeData = (data) => {
  skuTableData = data
  const salePrices = []
  const marketPrices = []
  let totalStock = 0
  skuTableData?.forEach((sku) => {
    if (!sku.marketPriceFee) {
      sku.marketPriceFee = 0
    }
    if (sku.stock) {
      totalStock += Number(sku.stock) // 库存累加
    }
    salePrices.push(sku.priceFee) // 售价
    marketPrices.push(sku.marketPriceFee) // 市场价
  })
  if (dataForm.value.skus) {
    dataForm.value.skus.forEach(() => {
      dataForm.value.changeStock = totalStock - backTotalStock
    })
  }
  dataForm.value.priceFee = Math.min.apply(null, salePrices) // 最低价-售价
  dataForm.value.marketPriceFee = Math.min.apply(null, marketPrices) // 最低价-市场价
  dataForm.value.totalStock = totalStock // 总库存
}

/**
 * 运费模板
 */
const getTransportData = () => {
  if (dataForm.value.deliveryTemplateId) {
    transportGet(dataForm.value.deliveryTemplateId).then(data => {
      dataForm.value.deliveryTemplateName = data.transName
    })
  }
}

// 关闭dialog
const closeDialog = () => {
  dataForm.value = {
    spuId: null, // 商品id
    categoryId: null, // 分类id
    shopCategoryId: null, // 店铺分类id
    name: '', // 商品名称
    sellingPoint: '', // 商品卖点
    brandId: 0, // 品牌id（非必选）
    imgUrls: '', // 轮播图 多个图片逗号分隔
    isCompose: 0, // 是否为组合商品0普通商品，1组合商品
    mainImgUrl: '', // 商品主图
    hasSkuImg: 0, // sku是否含有图片 0无 1有
    scoreFee: 0, // 积分价格（非必填）
    seq: null, // 商品排序（非必填）
    spuAttrValues: [], // 商品规格值列表
    deliveryMode: {
      hasShopDelivery: true,
      hasUserPickUp: false,
      hasCityDelivery: false
    }, // 配送方式
    deliveryTemplateId: '', // 运费模板id
    detail: '', // 详情信息（非必填）
    skuList: [], // sku列表
    totalStock: 0 // 商品总库存
  }
  salesAttrs.value = []
  basicAttrs.value = []
  brandName.value = '' // 品牌名称
  brandImgUrl.value = '' // 品牌logo
  selectedCategories.value = []
  visible.value = false
}

// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}

const picturePreviewVisible = ref(false) // 预览图片弹窗
const picturePreviewRef = ref(null)
// 图片预览
const onPicturePreview = (imgUrl) => {
  picturePreviewVisible.value = true
  nextTick(() => {
    picturePreviewRef.value.init(imgUrl)
  })
}

// 暴露组件方法
defineExpose({
  init
})

</script>

<style lang="scss" scoped>
@use "index";
</style>
