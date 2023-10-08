<template>
  <div class="mod-prod-info release-goods">
    <!-- 步骤 -->
    <div class="post-step">
      <div
        class="step-item"
        :class="{'active': postingSteps === 1 || postingSteps === 2}"
      >
        <!-- 01、编辑商品信息 -->
        <div class="step-txt">
          01、编辑商品信息
        </div>
      </div>
      <div
        class="step-item"
        :class="{'active': postingSteps === 2}"
      >
        <!-- 02、编辑商品详情 -->
        <div class="step-txt">
          02、编辑商品详情
        </div>
      </div>
    </div>
    <el-form
      ref="dataFormRef"
      class="part-form"
      :model="dataForm"
      :rules="rules"
      label-width="150px"
      @submit.prevent
    >
      <div class="info-box">
        <!-- 1.商品基本信息 -->
        <div
          v-if="postingSteps===1"
          class="part-content"
        >
          <div class="part-tit">
            基本信息
          </div>

          <!-- 商品基本属性 -->
          <el-form-item
            v-if="basicAttrs.length > 0"
            label="基本属性"
          >
            <spu-category-attrs
              :attrs-list="basicAttrs"
              :disabled="false"
              @get-value-of-basic-attrs="getValueOfBasicAttrs"
            />
          </el-form-item>
          <!-- 选择语言 -->

          <!-- 商品名称 -->
          <div class="prod-name-box">
            <el-form-item
              label="商品名称"
              prop="nameZh"
              class="prod-name-con"
            >
              <el-input
                v-model="dataForm.nameZh"
                maxlength="60"
              />
              <div class="hint">
                商品名称建议：商品描述+属性，长度不超过60个字符
              </div>
            </el-form-item>
            <el-form-item
              v-if="curLang.includes(2)"
              label-width="0"
              prop="prodNameEn"
              class="prod-name-con"
            >
              <el-input
                v-model="dataForm.nameEn"
                maxlength="60"
              />
              <div class="hint">
                The suggestion: description + attribute, length cannot exceed 60
              </div>
            </el-form-item>
          </div>

          <!-- 商品卖点 -->
          <div class="prod-name-box">
            <el-form-item
              label="商品卖点"
              prop="sellingPointZh"
              class="prod-name-con"
            >
              <el-input
                v-model="dataForm.sellingPointZh"
                maxlength="100"
              />
              <div class="hint">
                商品卖点展示在商品名称下面，长度不超过100个字符
              </div>
            </el-form-item>
            <el-form-item
              v-if="curLang.includes(2)"
              label-width="0"
              prop="briefEn"
              class="prod-name-con"
            >
              <el-input
                v-model="dataForm.sellingPointEn"
                maxlength="100"
              />
              <div class="hint">
                Displayed under the title, the length cannot exceed 100
              </div>
            </el-form-item>
          </div>

          <!-- 商品排序 -->
          <el-form-item label="商品排序">
            <div class="input-number-box">
              <el-input-number
                v-model.number="dataForm.seq"
                :max="32767"
                placeholder="请输入商品排序"
                :min="0"
                validate-event
                style="width:200px"
              />
            </div>
          </el-form-item>

          <!-- 商品轮播图 -->
          <el-form-item
            class="is-required"
            prop="imgUrls"
            label="商品轮播图"
          >
            <imgs-upload v-model:modelValue="dataForm.imgUrls" />
            <div class="banner-tips">
              建议图片尺寸为 800*800，可拖动排序，最多上传9张，首图为主图
            </div>
          </el-form-item>
          <!-- 商品视频 -->
          <el-form-item label="商品视频">
            <div class="part-form-item">
              <video-upload v-model:value="dataForm.video" />
              <el-button
                v-if="dataForm.video"
                class="video-del-btn"
                type="danger"
                @click="deleteVideo"
              >
                删除视频
              </el-button>
            </div>
          </el-form-item>
        </div>

        <!-- 2.商品sku与库存 -->
        <div
          v-show="postingSteps===1"
          class="part-content"
        >
          <div class="part-tit">
            规格库存
          </div>
          <div class="part-form-div">
            <div class="part-form-item-tit">
              商品规格
            </div>
            <div class="part-form-item">
              <!-- sku-组件 -->
              <sku-block
                v-model:modelValue="salesAttrs"
                :sales-attrs="salesAttrs"
                :save-sales-attrs="originalSalesAttrs"
                :sku-tree="originalSkuTree"
                :sku="sku"
                :on-fetch-group="fetchSkuTree"
                :on-fetch-sku="fetchSku"
                :on-create-sku="createSku"
                :on-create-group="createGroup"
                :on-preview-img="onPicturePreview"
                :on-handle-sku-value-img="changeSkuGroupImg"
                :switch-sku-image-status="switchSkuImageStatus"
                :has-sku-val="hasSkuValue"
                @on-change="changeSkuGroupData"
              />
            </div>
          </div>
          <!-- 价格及库存 -->
          <div class="part-form-div">
            <div class="part-form-item-tit star">
              价格及库存
            </div>
            <div class="setup-spec">
              <div class="sku-table">
                <!-- sku表格 -->
                <sku-table
                  :data="salesAttrs"
                  :flatten="flatten"
                  :is-no-sku-value="isNoSkuValue"
                  :spu-id="parseInt(dataForm.spuId)"
                  :is-category-id="!!dataForm.shopCategoryId"
                  :is-score="isScore"
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
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <el-input
              v-model="dataForm.totalStock"
              :readonly="true"
              style="width:215px"
            />
          </div>
        </div>

        <!-- 3.运费设置 -->
        <div
          v-show="postingSteps===1"
          class="part-content"
        >
          <div class="part-tit">
            运费设置
          </div>
          <div class="part-form-logistics">
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
              <div>
                <el-select
                  v-model="dataForm.deliveryTemplateId"
                  placeholder="请选择"
                  style="width:215px"
                  @change="changeTransportId"
                >
                  <el-option
                    v-for="item in transportTemplates"
                    :key="item.transportId"
                    :label="item.transName"
                    :value="item.transportId"
                  />
                </el-select>
                <div class="lb">
                  <el-button
                    link
                    type="primary"
                    class="tb"
                    @click="getTransportData"
                  >
                    刷新
                  </el-button>
                  <span
                    v-permission="['user:transport:save']"
                    class="vertical"
                  />
                  <el-button
                    v-permission="['user:transport:save']"
                    link
                    type="primary"
                    class="tb"
                  >
                    <router-link
                      target="_blank"
                      :to="{path:'/member/score/transport'}"
                    >
                      新建
                    </router-link>
                  </el-button>
                </div>
                <div class="log-tem-tips">
                  运费模板支持按地区设置运费，按购买件数计算运费，按重量计算运费等
                </div>
              </div>
            </el-form-item>
          </div>
        </div>

        <!-- 4.商品详情 -->
        <div
          v-if="postingSteps===2"
          class="part-content"
        >
          <div class="part-tit">
            商品详情
          </div>
          <div class="part-form-info">
            <product-details
              :data-form="dataForm"
              :disabled="false"
              :is-score-prod="true"
            />
          </div>
        </div>
      </div>

      <div class="foot-btn">
        <el-form-item v-if="postingSteps===1">
          <el-button
            v-permission="['score:spu:save']"
            @click="changeFormatOfFormData('ruleForm')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            @click="nextStep"
          >
            下一步
          </el-button>
        </el-form-item>
        <el-form-item v-if="postingSteps===2">
          <el-button @click="prevStep">
            上一步
          </el-button>
          <el-button
            v-permission="['score:spu:save']"
            type="primary"
            @click="changeFormatOfFormData('ruleForm')"
          >
            保存
          </el-button>
        </el-form-item>
      </div>

      <!-- 图片预览 -->
      <picture-preview
        v-if="picturePreviewVisible"
        ref="picturePreviewRef"
      />
    </el-form>
  </div>
</template>

<script setup>
import * as api from '@/api/product/prod-info.js'
import Big from 'big.js'
import { getUUID } from '@/utils/index.js'
import { getShopAttrs } from '@/api/product/category.js'
import { transportPage } from '@/api/distribution-manage/transport.js'
import imgsUpload from '@/components/imgs-upload/index.vue'
import videoUpload from '@/components/video-upload/index.vue'
import skuBlock from '@/components/sku/SkuBlock/index.vue'
import skuTable from '@/components/sku/SkuTable/index.vue'
import spuCategoryAttrs from '@/components/spu-category-attrs/index.vue'
import productDetails from '@/components/product-details/index.vue'
import picturePreview from '@/components/picture-preview/index.vue'
import { checkPermission } from '@/directive/permission/index.js'
import { Debounce } from '@/utils/debounce.js'
import { ElMessage } from 'element-plus'

const vPermission = checkPermission

const route = useRoute()
const router = useRouter()

const rules = reactive({
  nameZh: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  seq: [
    { required: true, message: '请输入商品排序', trigger: 'blur' }
  ],
  deliveryTemplateId: [
    { required: true, message: '请选择运费模板', trigger: 'change' }
  ],
  imgUrls: [
    { required: true, message: '请选择商品轮播图', trigger: 'onChange' }
  ]
})
const flatten = ref([])
const isScore = ref(true)

const language = computed(() => {
  return localStorage.getItem('cloudLanguage') === 'zh' ? 1 : 2
})

const originalSalesAttrs = ref([]) // 起初的(不变的)销售属性
const basicAttrs = ref([]) // 基本属性列表
watch(() => language, () => {
  loadAttrsData(originalSalesAttrs.value)
  loadAttrsData(basicAttrs.value)
}, { deep: true })

onMounted(() => {
  init()
  getTransportData() // 运费模板
})

// 当前语言 1中文 2英文
const curLang = ref([1])

const dataFormRef = ref(null)
const dataForm = ref({
  spuId: route.query.spuId || null, // 商品id
  shopCategoryId: null, // 店铺分类id
  nameZh: '', // 中文商品名称
  nameEn: '', // 英文商品名称
  sellingPointZh: '', // 中文商品卖点
  sellingPointEn: '', // 英文商品卖点
  brandId: null, // 品牌id（非必选）
  imgUrls: '', // 轮播图 多个图片逗号分隔
  isCompose: 0, // 是否为组合商品0普通商品，1组合商品
  mainImgUrl: '', // 商品主图
  hasSkuImg: 0, // sku是否含有图片 0无 1有
  scoreFee: 0, // 积分价格（非必填）
  seq: 0, // 商品排序（非必填）
  spuAttrValues: [], // 商品属性值列表
  deliveryMode: {
    hasShopDelivery: true,
    hasUserPickUp: false,
    hasCityDelivery: false
  }, // 配送方式
  deliveryTemplateId: '', // 运费模板id
  detail: '', // 详情信息（非必填）
  skuList: [], // sku列表
  totalStock: 0, // 商品总库存
  video: '', // 商品视频
  brand: null // 品牌
})

watch(() => dataForm.value.imgUrls, (newVal) => {
  if (newVal) {
    dataFormRef.value?.clearValidate()
  }
}, { deep: true })

let originalSpuAttrValueList = [] // 基本属性回显原数据
const init = () => {
  querySalesAttrData() // 请求销售属性
  const spuId = dataForm.value.spuId
  dataForm.value.spuId = spuId || ''
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.value.spuId) {
      return
    }
    api.getProdInfoPage(spuId).then(data => {
      dataForm.value = data
      originalSpuAttrValueList = data.spuAttrValues
      // 回显品牌数据
      const array = []
      array.push(data.brand)
      const newArr = []
      if (data.brand) {
        array.forEach((item) => {
          newArr.push(
            Object.assign({}, item, {
              brandName: item.name,
              brandImgUrl: item.imgUrl
            })
          )
        })
      }
      dataForm.value.brand = newArr

      // 配送方式
      dataForm.value.deliveryMode = JSON.parse(data.deliveryMode)

      // 根据分类获取基本属性列表
      data.spuAttrValues.forEach(spuAttrValue => {
        if (spuAttrValue.spuAttrValueLangList && spuAttrValue.spuAttrValueLangList.length > 0) {
          spuAttrValue.spuAttrValueLangList.forEach(spuAttrValueLang => {
            if (spuAttrValueLang.lang === language) {
              spuAttrValue.attrName = spuAttrValueLang.attrName
              spuAttrValue.attrValueName = spuAttrValueLang.attrValueName
            }
          })
        }
      })
      // sku回显
      skuBackShow(data.skus) // 销售属性
      // 商品详情
      dataForm.value.detailList.forEach(detail => {
        if (detail.lang === 1) {
          dataForm.value.detailZh = detail.detail
        } else if (detail.lang === 2) {
          dataForm.value.detailEn = detail.detail
        }
      })
      // 商品数据
      dataForm.value.spuLangList.forEach(spuLang => {
        if (spuLang.lang === 1) {
          dataForm.value.nameZh = spuLang.spuName
          dataForm.value.sellingPointZh = spuLang.sellingPoint
        } else if (spuLang.lang === 2) {
          dataForm.value.nameEn = spuLang.spuName
          dataForm.value.sellingPointEn = spuLang.sellingPoint
        }
      })
      // 回显商品名
      dataForm.value.nameEn ? curLang.value = [1, 2] : curLang.value = []
    })
  })
}

// 国际化数据筛选
const loadAttrsData = (data) => {
  data.forEach(attr => {
    // 属性名
    let name = null
    for (let i = 0; i < attr.attrLangList.length; i++) {
      const attrLang = attr.attrLangList[i]
      name = attrLang.name ? attrLang.name : name
      if (attrLang.lang === language && attrLang.name) {
        break
      }
    }
    attr.name = name
    // 属性值
    for (let k = 0; k < attr.attrValues.length; k++) {
      let value = null
      const attrValues = attr.attrValues[k]
      for (let j = 0; j < attrValues.values.length; j++) {
        const attrValue = attrValues.values[j]
        if (attrValue.lang === language) {
          value = attrValue.value ? attrValue.value : value
        }
        if (attrValue.lang === language && attrValue.name) {
          break
        }
      }
      attrValues.value = value
    }
  })
}

const spuAttrValueList = ref([]) // 商品基本属性值列表
/**
 * 基本属性数据
 */
const getValueOfBasicAttrs = (attrs, st) => {
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
  // 获取基本属性子组件返回数据
  spuAttrValue.attrId = attrs.attrId // 属性id
  spuAttrValue.attrName = attrs.name // 属性名
  spuAttrValue.searchType = attrs.searchType // 属性值
  if (st === 0) { // 下拉选择
    attrs.attrValues.some(attr => {
      if (attrs.attrValue === attr.attrValueId) {
        spuAttrValue.attrValueId = attrs.attrValue // 属性值id
        spuAttrValue.attrValueName = attr.value // 属性值
        spuAttrValueListPar.push(spuAttrValue)
        return true
      } else {
        return false
      }
    })
  }
  if (st === 1) { // 输入框
    spuAttrValue.attrValueId = ''
    spuAttrValue.attrValueName = attrs.attrValue // 属性值id
    spuAttrValueListPar.push(spuAttrValue) // 属性值
  }
  // 去重
  dataForm.value.spuAttrValues = removeDuplication(spuAttrValueListPar, 'attrId')
}

/**
 * 删除视频
 */
const deleteVideo = () => {
  dataForm.value.video = null
}

const isNoSkuValue = ref(false) // 回显时的商品是否有sku
const salesAttrs = ref([]) // 销售属性列表
/**
 * sku回显
 */
const skuBackShow = (skus) => {
  if (skus && skus.length > 0) {
    const ids = []
    const attrValueNameMapId = []
    skus.forEach(sku => {
      sku.spuSkuAttrValues?.forEach((attrInfo, idx) => {
        if (attrInfo.spuSkuAttrValueLangList) {
          attrInfo.spuSkuAttrValueLangList.forEach(spuSkuAttrValueLang => {
            if (spuSkuAttrValueLang.lang === language || spuSkuAttrValueLang.lang === 0) {
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
        if (salesAttrs.value[idx] === undefined) {
          salesAttrs.value[idx] = {
            id: ids[idx],
            leaf: [skuValueItem],
            text: attrInfo.attrName
          }
        } else {
          salesAttrs.value[idx].leaf.push(skuValueItem)
        }
      })
      if (!sku.spuSkuAttrValues.length) {
        isNoSkuValue.value = true
      }
    })
    salesAttrs.value.forEach((attr, i) => {
      // 去重
      attr.leaf = removeDuplication(attr.leaf, 'text')
      salesAttrs.value[i] = attr
    })
    skus.forEach((skuItem, i) => {
      skuItem.marketPriceFee = parseFloat(bigActualTotal(parseFloat(skuItem.marketPriceFee), 100)) // 市场价
      skuItem.priceFee = parseFloat(bigActualTotal(parseFloat(skuItem.priceFee), 100)) // 销售价
      flatten.value[i] = skuItem
    })
  }
  querySalesAttrData(skus)
}

const originalSkuTree = ref([]) // sku属性选项列表(不受改变影响)
let skuTree = [] // 规格列表
/**
 * 获取店铺中的销售属性
 */
const querySalesAttrData = (skus) => {
  if (!skus) {
    originalSalesAttrs.value.splice(0, originalSalesAttrs.value.length)
  }
  skuTree.splice(0, skuTree.length) // 清空
  // 收集已创建属性id
  const usedAttridsSet = skus?.reduce((attrIdsSet, skuItem) => {
    skuItem.spuSkuAttrValues.forEach(val => attrIdsSet.add(val.attrId))
    return attrIdsSet
  }, new Set())
  getShopAttrs().then((data) => {
    loadAttrsData(data)
    originalSalesAttrs.value = data
    let skuTrees = []
    data.forEach((item) => {
      // 将已创建属性以外的其他属性放入新数组
      if (!usedAttridsSet?.has(item.attrId) || !usedAttridsSet) {
        skuTrees.push({ id: item.attrId, text: item.name })
      }
    })
    // 去重
    skuTrees = removeDuplication(skuTrees, 'id')
    originalSkuTree.value = skuTrees
    skuTree = skuTrees
  })
}

/**
 * 规格组件相关 start
 */
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

let sku = []
// 获取规格可选值
const getSkus = (id) => {
  sku = []
  originalSalesAttrs.value.forEach(attr => {
    if (id === attr.attrId) {
      attr.attrValues.forEach(attrVal => {
        const attrValue = {}
        attrValue.text = attrVal.values[0].value
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
    if (text) {
      resolve(getUUID())
    } else {
      reject(new Error())
    }
  })
}

const createSku = (data) => {
  // 创建新的规格值
  return new Promise((resolve) => {
    resolve(data.data.map(item => {
      return {
        id: getUUID(),
        text: item
      }
    }))
  })
}

// SkuGroup返回数据
const changeSkuGroupData = (data) => {
  if (!data.length) {
    dataForm.value.hasSkuImg = 0
  }
}
// 切换规格图片是否可添加状态
const switchSkuImageStatus = (sts) => {
  dataForm.value.hasSkuImg = sts ? 1 : 0
}
// 添加/修改/删除规格图片的处理
const changeSkuGroupImg = (data) => {
  salesAttrs.value.forEach(el => {
    if (el.id === data.id) {
      el.leaf = data.leaf
    }
  })
}

let skuTableData = [] // sku表格返回数据
// SkuTable返回数据
const handleChangeData = (data) => {
  skuTableData = data
  const salePrices = []
  const scorePrices = []
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
    scorePrices.push(sku.scoreFee)
  })
  dataForm.value.priceFee = Math.min.apply(null, salePrices) // 最低价-售价
  dataForm.value.marketPriceFee = Math.min.apply(null, marketPrices) // 最低价-市场价
  dataForm.value.scoreFee = Math.min.apply(null, scorePrices) // 最低价-市场价
  dataForm.value.totalStock = totalStock // 总库存
}
// 规格组件相关 end

const transportTemplates = ref([]) // 运费模板列表
/**
 * 运费模板
 */
const getTransportData = () => {
  transportPage().then(data => {
    transportTemplates.value = data
  })
}

/**
 * 选择运费模板
 */
const changeTransportId = (id) => {
  dataForm.value.deliveryTemplateId = id
}

/**
 * 处理提交的skuList的数据格式
 */
const changeSkuFormat = () => {
  /** 原始sku属性选项Id数组 */
  const originalSkuIds = originalSalesAttrs.value.map((attr) => attr.attrId)
  skuTableData.forEach(skuItem => {
    const attrsZh = []
    const attrsEn = []
    const valueZh = []
    const valueEn = []
    if (skuItem.spuSkuAttrValues?.length > 0) {
      skuItem.spuSkuAttrValues.forEach(attr => {
        // sku图片
        salesAttrs.value[0]?.leaf?.forEach(attrVal => {
          if (attr.attrValueName === attrVal.text) {
            skuItem.imgUrl = attrVal.imgUrl ? attrVal.imgUrl : ''
          }
        })
        // 新增(手动输入)属性的id为空
        if (!originalSkuIds.includes(attr.attrId)) {
          attr.attrId = ''
        }
        const originalSku = getSkus(attr.attrId)
        const originalSkuValIds = originalSku.map(sku => sku.id) // 原始sku属性值选项Id数组
        // 当sku属性id为空时，sku属性值id也为空 || 请求到的属性值列表中不包含当前的id
        if (!attr.attrId || !originalSkuValIds.includes(attr.attrValueId)) {
          // 新增(手动输入)属性值的id为空
          attr.attrValueId = ''
        }

        // 多个属性名、属性值收集
        const attrInfo = getAttrInfo(originalSalesAttrs.value, attr)
        attrsZh.push(attrInfo.attrNameZh)
        attrsEn.push(attrInfo.attrNameEn)
        valueZh.push(attrInfo.valueZh)
        valueEn.push(attrInfo.valueEn)
      })
      // attrs.push(attr.attrName)
      const skuLangZh = { lang: 1 }
      const skuLangEn = { lang: 2 }

      // attrs（属性名拼接）
      // 多个销售属性名逗号分隔  如：'颜色,版本'
      skuLangZh.attrs = Array.from(new Set(attrsZh)).join(',')
      skuLangEn.attrs = Array.from(new Set(attrsEn)).join(',')

      // skuName（属性值拼接）
      if (valueZh.length > 1) {
        skuLangZh.skuName = [valueZh[0], valueZh[1]].join(' ') // 属性值名称 如：'红色 256G'
        skuLangEn.skuName = [valueEn[0], valueEn[1]].join(' ') // 属性值名称 如：'红色 256G'
      } else if (skuItem.spuSkuAttrValues[0] && !skuItem.spuSkuAttrValues[1]) {
        skuLangZh.skuName = String(valueZh[0])
        skuLangEn.skuName = String(valueEn[0])
      }
      skuItem.skuLangList = []
      skuItem.skuLangList.push(skuLangZh)
      skuItem.skuLangList.push(skuLangEn)
    } else {
      skuItem.spuSkuAttrValues = []
    }
    if (dataForm.value.hasSkuImg === 0) {
      skuItem.imgUrl = ''
    }
  })
  // 已存在skuId&无属性的情况下，修改sku信息时应带上原本的skuId，避免skuId被更新
  if (dataForm.value.skus?.length === 1 && skuTableData.length === 1) {
    if (!dataForm.value.skus[0].spuSkuAttrValues.length && !skuTableData[0].spuSkuAttrValues.length) {
      skuTableData[0].skuId = dataForm.value.skus[0].skuId
    }
  }

  dataForm.value.skuList = skuTableData
}

const getAttrInfo = (data, attr) => {
  if (!attr.attrId && !attr.attrValueId) {
    return { attrNameZh: attr.attrName, valueZh: attr.attrValueName, attrNameEn: attr.attrName, valueEn: attr.attrValueName }
  }
  const attrInfo = {}
  data.forEach(spuSkuAttrValue => {
    if (spuSkuAttrValue.attrId === attr.attrId) {
      // 属性名
      if (spuSkuAttrValue.attrLangList.length === 1) {
        // attrLangList长度为1，即只存在中文
        attrInfo.attrNameZh = spuSkuAttrValue.attrLangList[0].name
        attrInfo.attrNameEn = spuSkuAttrValue.attrLangList[0].name
      } else {
        spuSkuAttrValue.attrLangList.forEach(attrLang => {
          if (attrLang.lang === 1) {
            attrInfo.attrNameZh = attrLang.name
          } else {
            attrInfo.attrNameEn = attrLang.name
          }
        })
      }
      // 属性值
      if (!attr.attrValueId) {
        attrInfo.valueZh = attr.attrValueName
        attrInfo.valueEn = attr.attrValueName
        return attrInfo
      }
      spuSkuAttrValue.attrValues.forEach(attrValue => {
        if (attrValue.attrValueId === attr.attrValueId) {
          if (attrValue.values.length === 1) {
            // attrValue.values长度为1，即只存在中文
            attrInfo.valueZh = attrValue.values[0].value
            attrInfo.valueEn = attrValue.values[0].value
          } else {
            attrValue.values.forEach(value => {
              if (value.lang === 1) {
                attrInfo.valueZh = value.value
              } else {
                attrInfo.valueEn = value.value
              }
            })
          }
        }
      })
    }
  })
  return attrInfo
}

/**
 * 基本属性未填写部分数据处理
 */
const basicAttrData = () => {
  const spuAttrIds = []
  dataForm.value.spuAttrValues.forEach(spuAttrItem => {
    spuAttrIds.push(spuAttrItem.attrId)
  })
  // 已填id数组中不包含当前项id
  basicAttrs.value.forEach(attr => {
    if (!spuAttrIds.includes(attr.attrId)) {
      dataForm.value.spuAttrValues.push({
        attrId: attr.attrId,
        attrName: attr.name,
        attrValueId: '',
        attrValueName: ''
      })
    }
  })
  // 去重
  dataForm.value.spuAttrValues = removeDuplication(dataForm.value.spuAttrValues, 'attrId')
  basicAttrVerification()
}

let basicAttrNotComplete = false // 基本属性不完整
/**
 * 基本属性填写校验
 */
const basicAttrVerification = () => {
  // 重要属性id数组
  const importantBasicAttrIds = []
  basicAttrs.value.forEach((el) => {
    // searchType 作为搜索参数 0:不需要，1:需要（1即为重要属性，重要属性必填）
    if (el.searchType === 1) {
      importantBasicAttrIds.push(el.attrId)
    }
  })
  dataForm.value.spuAttrValues.some(attrValue => {
    basicAttrNotComplete = false
    // 重要属性 且 属性值（属性值id）为空
    if (importantBasicAttrIds.includes(attrValue.attrId) &&
    (!attrValue.attrValueId || !attrValue.attrValueName)) {
      ElMessage({
        message: '重要基本属性不能为空！',
        duration: 1000
      })
      basicAttrNotComplete = true
      return true
    } else {
      return false
    }
  })
}

const hasSkuValue = ref(true) // 是否有属性值
/**
 * 表单验证
 */
const formValidation = () => {
  const dataFormPar = dataForm.value
  basicAttrData() // 基本属性校验
  if (basicAttrNotComplete) {
    return false
  }
  if (!dataFormPar.imgUrls) {
    ElMessage({
      message: '请上传商品轮播图！',
      duration: 1000
    })
    return false
  }
  if (salesAttrs.value?.find((item) => item.id && item.leaf && !item.leaf.length)) {
    ElMessage({
      message: '请选择已添加规格的规格值！',
      duration: 1500
    })
    hasSkuValue.value = false
    return false
  }
  // 勾选“添加属性图片”但未上传任何图片时（至少上传一张图片）
  if (dataFormPar.hasSkuImg === 1 && !dataFormPar.skuList.find(el => el.imgUrl) && salesAttrs.value[0].id) {
    ElMessage({
      message: '请上传属性图片！',
      duration: 1000
    })
    return false
  }
  if (dataFormPar.skuList?.some((skuItem) => skuItem.stock === '' || skuItem.stock === null)) {
    ElMessage({
      message: '商品库存不能为空！',
      duration: 1000
    })
    return false
  }
  let index = 0
  dataFormPar.skuList.forEach(temp => {
    if (temp.status === 0) {
      index++
    }
  })
  if (index === dataFormPar.skuList.length && dataFormPar.skuList.length !== 0) {
    ElMessage({
      message: 'sku状态不能全部为禁用！',
      duration: 1000
    })
    return false
  }
  return true
}

const postingSteps = ref(1)
// 上一步
const prevStep = () => {
  postingSteps.value = 1
}

// 下一步
const nextStep = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      ElMessage({
        message: '请先将必填信息填写完整！',
        duration: 1500
      })
      return
    }
    // sku数据格式转换
    changeSkuFormat()

    // 修改商品详情时，将未修改的基本属性项push到dataForm.spuAttrValues
    if (dataForm.value.spuId) {
      const spuAttrValIds = []
      dataForm.value.spuAttrValues.forEach(attr => {
        spuAttrValIds.push(attr.attrId)
      })
      originalSpuAttrValueList.forEach(attr => {
        if (!spuAttrValIds.includes(attr.attrId)) {
          dataForm.value.spuAttrValues.push(attr)
        }
      })
    }
    // 表单验证
    const dataFormVal = formValidation()
    if (!dataFormVal) {
      return
    }
    postingSteps.value = 2
  })
}

/**
 * 表单提交数据处理
 */
const changeFormatOfFormData = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      ElMessage({
        message: '请先将必填信息填写完整！',
        duration: 1500
      })
      return
    }
    // sku数据格式转换
    changeSkuFormat()

    // 修改商品详情时，将未修改的基本属性项push到dataForm.spuAttrValues
    if (dataForm.value.spuId) {
      const spuAttrValIds = []
      dataForm.value.spuAttrValues.forEach(attr => {
        spuAttrValIds.push(attr.attrId)
      })
      originalSpuAttrValueList.forEach(attr => {
        if (!spuAttrValIds.includes(attr.attrId)) {
          dataForm.value.spuAttrValues.push(attr)
        }
      })
    }
    // 表单验证
    const dataFormVal = formValidation()
    if (!dataFormVal) {
      return
    }
    // 深拷贝dataForm，使页面展示数据不受下面数据修改的影响
    const dataFormPar = JSON.parse(JSON.stringify(dataForm.value))
    // deliveryMode转换格式
    dataFormPar.deliveryMode = JSON.stringify(dataFormPar.deliveryMode)
    dataFormPar.skuList.forEach(sku => {
      // 修改商品时，删除已有属性的spuSkuAttrValues
      if ((sku.skuId !== undefined && sku.spuId !== undefined) && sku.spuSkuAttrValues) {
        sku.spuSkuAttrValues = undefined
      }
      // 价格 * 100
      if (sku.priceFee > 0) {
        sku.priceFee = parseFloat(bigProductTotalAmount(parseFloat(sku.priceFee), 100)) // 售价*100
      }
      if (sku.marketPriceFee > 0) {
        sku.marketPriceFee = parseFloat(bigProductTotalAmount(parseFloat(sku.marketPriceFee), 100)) // 市场价*100
      }
    })

    if (dataFormPar.priceFee === undefined) {
      dataFormPar.priceFee = 0.01
    }
    if (dataFormPar.marketPriceFee === undefined) {
      dataFormPar.marketPriceFee = 0.00
    }

    dataFormPar.priceFee = parseFloat(bigProductTotalAmount(parseFloat(dataFormPar.priceFee), 100)) // 最低-售价*100
    dataFormPar.marketPriceFee = parseFloat(bigProductTotalAmount(parseFloat(dataFormPar.marketPriceFee), 100)) // 最低-市场价*100

    // 轮播图首图为主图mainImgUrl
    dataFormPar.mainImgUrl = (dataFormPar.imgUrls).split(',')[0]
    // 删除多余参数(修改商品时)
    if (dataForm.value.skus) {
      dataFormPar.skus = undefined
    }
    // 多语言信息
    dataFormPar.spuLangList = []
    dataFormPar.spuLangList.push({ lang: 1, spuName: dataForm.value.nameZh, sellingPoint: dataForm.value.sellingPointZh, detail: dataForm.value.detailZh })
    dataFormPar.spuLangList.push({ lang: 2, spuName: dataForm.value.nameEn, sellingPoint: dataForm.value.sellingPointEn, detail: dataForm.value.detailEn })
    // 请求提交表单
    onSubmit(dataFormPar)
  })
}

/**
 * 表单提交
 */
const onSubmit = Debounce((dataFormPar) => {
  // 移除不需要的数据
  dataFormPar.shopCategory = null
  dataFormPar.category = null
  dataFormPar.brand = null
  dataFormPar.detailList = null
  const request = dataFormPar.spuId ? api.update(dataFormPar) : api.save(dataFormPar)
  request.then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1000,
      onClose: () => {
        resetForm()
        router.push('/member/score/list')
      }
    })
  })
}, 1500)

// 重置
const resetForm = () => {
  dataFormRef.value?.resetFields()
  if (!dataForm.value.spuId) {
    // 平台分类id
    dataForm.value.categoryId = ''
    // 基本属性列表
    basicAttrs.value = []
  }
  dataForm.value = {
    spuId: route.query.spuId || null, // 商品id
    categoryId: dataForm.value.categoryId,
    shopCategoryId: null, // 店铺分类id
    nameZh: '', // 中文商品名称
    nameEn: '', // 英文商品名称
    detail: '',
    sellingPointZh: '', // 中文商品卖点
    sellingPointEn: '', // 英文商品卖点
    brandId: null, // 品牌id（非必选）
    imgUrls: '', // 轮播图 多个图片逗号分隔
    isCompose: 0, // 是否为组合商品0普通商品，1组合商品
    mainImgUrl: '', // 商品主图
    hasSkuImg: 0, // sku是否含有图片 0无 1有
    scoreFee: 0, // 积分价格（非必填）
    seq: null, // 商品排序（非必填）
    spuAttrValues: [], // 商品属性值列表
    deliveryMode: {
      hasShopDelivery: true,
      hasUserPickUp: false,
      hasCityDelivery: false
    }, // 配送方式
    deliveryTemplateId: '', // 运费模板id
    detailZh: '', // 中文详情
    detailEn: '', // 英文详情
    skuList: [], // sku列表
    totalStock: 0, // 商品总库存
    video: '', // 商品视频
    brand: null // 品牌
  }
  // sku
  salesAttrs.value = []
}

// 精度运算-乘法
const bigProductTotalAmount = (a, b) => {
  return new Big(a).times(b).valueOf()
}

// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}

/**
 * 去重
 */
const removeDuplication = (items, validKey) => {
  items.reverse() // 倒序，保留最新的数据
  const ids = []
  const list = []
  for (let i = 0; i < items.length; i++) {
    if (ids.indexOf(items[i][validKey]) === -1) {
      list.push(items[i])
      ids.push(items[i][validKey])
    }
  }
  list.reverse()
  return list
}

const picturePreviewVisible = ref(false) // 预览图片弹窗
const picturePreviewRef = ref(null)
// 图片预览
const onPicturePreview = (imgUrl) => {
  picturePreviewVisible.value = true
  nextTick(() => {
    picturePreviewRef.value?.init(imgUrl)
  })
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
