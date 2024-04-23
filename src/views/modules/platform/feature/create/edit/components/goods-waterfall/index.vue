<template>
  <div class="micro-goods-box component-goods-waterfall">
    <div class="design-preview-controller">
      <div
        v-if="formData.categoryShow === 1"
        class="category"
      >
        <div
          v-for="(item, index) in categoryList"
          :key="index"
          class="category-item"
          :class="{active: 0 === index}"
        >
          {{ item.name }}
        </div>
      </div>

      <div class="goods-list">
        <template v-if="goodsList.length">
          <div
            v-for="(item, index) in goodsList"
            :key="index"
            class="goods-li"
            :class="{isGoodCell3:formData.size === 3, isGoodCell1:formData.size === 1}"
          >
            <div
              class="goods-li-box"
              :class="{'no-goods-price':!formData.showContent.find(x=>x===3)&&formData.showContent.find(x=>x===4)}"
            >
              <div
                class="goods-item"
                :class="{goodsItem1:formData.size === 1}"
              >
                <!--图片-->
                <el-image
                  class="goods-img-one"
                  :style="{width: formData.size===3 ? 90 + 'px' : 152 + 'px', height: formData.size!==1 ? (formData.size===3 ? 90 + 'px' : 152 + 'px') : '', margin: formData.size!==1?'0 auto' : ''}"
                  :class="{goodsImgOne1:formData.size === 1, 'goods-empty': !goodsList[0].prodId}"
                  :src="checkFileUrl(item.pic||'')"
                  fit="fill"
                >
                  <template #error>
                    <div class="image-slot">
                      <img
                        src="@/assets/pc-micro-page/show-default.png"
                        alt
                      >
                    </div>
                  </template>
                </el-image>
                <!-- 下架商品蒙版 start -->
                <div
                  v-if="item.status !== 1"
                  class="imgs_shelves"
                >
                  <img
                    class="been_imgs"
                    src="@/assets/pc-micro-page/been_shelves.png"
                    alt
                  >
                </div>

                <div
                  class="goods-box-info"
                  :class="{goodsBoxInfo1:formData.size === 1}"
                >
                  <div
                    v-if="formData.showContent.find(x=>x===1)"
                    class="goods-info-title"
                  >
                    {{ item.prodName }}
                  </div>
                  <div
                    v-if="formData.showContent.find(x=>x===2)"
                    class="goods-info-desc"
                  >
                    {{ item.brief }}
                  </div>
                  <div
                    v-if="formData.showContent.find(x=>x===3)||formData.showContent.find(x=>x===4)"
                    class="goods-info-price "
                    :class="{'goods-cell-3':formData.showContent.find(x=>x===4)}"
                  >
                    <div
                      v-if="formData.showContent.find(x=>x===3)"
                      class="price-info"
                    >
                      <span>¥</span>{{ formatPrice(item.price, 1).toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="(item,index) in goodsList"
            :key="index"
            class="goods-li"
            :class="{isGoodCell3:formData.size === 3, isGoodCell1:formData.size === 1}"
          >
            <div
              class="goods-li-box"
              :class="{'no-goods-price':!formData.showContent.find(x=>x===3)&&formData.showContent.find(x=>x===4)}"
            >
              <div
                class="goods-item"
                :class="{goodsItem1:formData.size === 1}"
              >
                <!--图片-->
                <div
                  class="goods-img-one"
                  :class="{goodsImgOne1:formData.size === 1, 'goods-empty': !goodsList[0].prodId}"
                  :style="{backgroundImage:'url('+(item.pic || defImg)+')'}"
                />
                <!--end 图片-->
                <div
                  class="goods-box-info"
                  :class="{goodsBoxInfo1:formData.size === 1}"
                >
                  <div
                    v-if="formData.showContent.find(x=>x===1)"
                    class="goods-info-title"
                  >
                    {{ item.prodName }}
                  </div>
                  <div
                    v-if="formData.showContent.find(x=>x===2)&&item.brief"
                    class="goods-info-desc"
                  >
                    {{ item.brief }}
                  </div>
                  <div
                    v-if="formData.showContent.find(x=>x===3)||formData.showContent.find(x=>x===4)"
                    class="goods-info-price "
                    :class="{'goods-cell-3':formData.showContent.find(x=>x===4)}"
                  >
                    <div
                      v-if="formData.showContent.find(x=>x===3)"
                      class="price-info"
                    >
                      <span>¥</span>{{ formatPrice(item.price, 1).toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      v-if="isShowEdit"
      class="design-editor-item design-hide-class"
      :style="{'top': isDetail ? '0' : '50px'}"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          {{ $t('shopFeature.allCanUse.goodsWaterfall') }}
        </div>
        <!--选择商品-->
        <div class="design-editor-component-container">
          <el-form
            ref="formDataRef"
            :model="formData"
            label-position="left"
            class="goods-select-form"
            @submit.prevent
          >
            <el-form-item
              :label="$t('shopFeature.goods.showType')"
              @change="showCategory"
            >
              <el-radio-group v-model="formData.categoryShow">
                <el-radio
                  v-for="(item, index) in categoryShow"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('shopFeature.goods.listStyle')">
              <el-radio-group v-model="formData.size">
                <el-radio
                  v-for="(count, index) in lineSize"
                  :key="index"
                  :label="count.value"
                >
                  {{ count.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('shopFeature.goods.showContent')"
              class="goods-show-container"
            >
              <div class="goods-show-content">
                <el-checkbox-group v-model="formData.showContent">
                  <el-checkbox
                    v-for="(showItem, index) in goodsShowContent"
                    :key="index"
                    :label="showItem.value"
                  >
                    {{ showItem.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item :label="$t('shopFeature.goods.sortType')">
              <el-radio-group
                v-model="formData.sortType"
                @input="changeSortType"
              >
                <el-radio
                  v-for="(item, index) in sortTypeList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="formData.sortType !== 0"
              :label="$t('shopFeature.goods.timeType')"
              class="goods-show-container"
            >
              <el-radio-group v-model="formData.timeType">
                <el-radio
                  v-for="(item, index) in timeList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('shopFeature.goods.sortStats')">
              <el-radio-group v-model="formData.sortStatus">
                <el-radio
                  v-for="(item, index) in sortStatus"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import request from '@/utils/request'
import { enableCategories } from '@/api/product/category'
import { formatPrice } from '@/utils/index.js'

const props = defineProps({
  isCheckMySelf: { // 是否开始内部验证 比如提示弹窗等。。。
    type: Boolean,
    default: false
  },
  currentComponent: { // 当前组件
    type: Object,
    default: () => {
      return {}
    }
  },
  indexKey: { // 当前组件排序索引 type_ + key
    type: String,
    default: () => {
      return ''
    }
  },
  current: { // 当前排序索引 key
    type: Number,
    default: () => {
      return null
    }
  },
  isShowEdit: { // 是否为编辑状态
    type: Boolean,
    default: false
  },
  dataField: { // 所有上传到后端的字段
    type: Object,
    default: () => {}
  },
  isStartCheckFieldRules: { // 是否开始校验规则
    type: Boolean,
    default: () => false
  },
  isDetail: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits(['myCheckResult', 'componentsValueChance'])

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
}, { deep: true })

const formData = reactive({
  size: 2, // 一行多少个
  showContent: [1, 2, 3],
  sortType: 0,
  timeType: 0,
  sortStatus: 1,
  categoryShow: 1
})

/** 设置或者重设formData的数据 */
const setFormData = () => {
  if (props.dataField) {
    for (const el in props.dataField) {
      formData[el] = props.dataField[el]
    }
  }
}

watch(() => formData, (val) => {
  if (val) {
    emit('componentsValueChance', {
      indexKey: props.indexKey,
      current: props.current,
      dataField: val
    })
  }
}, { deep: true })

watch(() => props.isStartCheckFieldRules, () => {
  startCheckFieldRulesCommonFun()
}, { deep: true })

onMounted(() => {
  setFormData()
})

/* 校验 */
const startCheckFieldRulesCommonFun = () => {
  myCheckResult(true)
}

/**
 * 返回校验结果
 * isHeader 是否为顶部 特殊情况
 * 结果：Boolean true false
 * */
const myCheckResult = ($isPass) => {
  emit('myCheckResult', {
    data: {
      isPass: $isPass,
      dataField: props.dataField,
      isHeader: (props.currentComponent.type.indexOf('config') !== -1),
      current: props.current
    }
  })
}

// 是否显示分类
const categoryShow = [
  {
    value: 1,
    label: '是'
  },
  {
    value: 2,
    label: '否'
  }
]

// 商品显示内容
const goodsShowContent = [
  {
    value: 1,
    label: $t('shopFeature.goods.prodName')
  },
  {
    value: 2,
    label: $t('shopFeature.goods.prodDesc')
  },
  {
    value: 3,
    label: $t('shopFeature.goods.prodPrice')
  }
]
// 一行几个
const lineSize = [
  {
    value: 1,
    label: $t('shopFeature.goods.oneLineItem1')
  },
  {
    value: 2,
    label: $t('shopFeature.goods.oneLineItem2')
  },
  {
    value: 3,
    label: $t('shopFeature.goods.oneLineItem3')
  }
]
const sortTypeList = [
  {
    value: 0,
    label: '上架时间'
  },
  {
    value: 1,
    label: '销量'
  },
  {
    value: 2,
    label: '评论数'
  }
]
const timeList = [
  {
    value: 0,
    label: '全部'
  },
  {
    value: 1,
    label: '最近一年'
  },
  {
    value: 2,
    label: '最近三月'
  },
  {
    value: 3,
    label: '最近一月'
  },
  {
    value: 4,
    label: '最近一周'
  }
]
const sortStatus = [
  {
    value: 0,
    label: '升序'
  },
  {
    value: 1,
    label: '降序'
  }
]

watch(() => formData.categoryShow, () => {
  getGoodsInfo()
})

let isFirst = false
watch([
  () => formData.sortType,
  () => formData.sortStatus,
  () => formData.timeType
], () => {
  if (isFirst) getGoodsInfo()
})

onMounted(() => {
  // 变更数据，保存初始装修数据
  formData.sortStatus = props.dataField.sortStatus || 0
  getCategoryList()
})

const changeSortType = (val) => {
  if (val === 0) {
    formData.timeType = 0
  }
}

const showCategory = () => {
  getGoodsInfo()
}

// 获取的接口数据
const goodsList = ref([])
const categoryList = ref([]) // 分类列表
/** 批量获取商品详情 */
const getGoodsInfo = () => {
  const paramsData = {
    pageSize: 20,
    pageNum: 1,
    spuStatus: 1,
    esRenovationSpuSort: dealSortType(formData.sortType, formData.sortStatus),
    showSpuType: 1, // 展示商品类型 0.展示指定的商品ids 1.展示瀑布流商品集合
    esTimeRange: formData.timeType
  }
  if (formData.categoryShow === 1) {
    paramsData.primaryCategoryId = categoryList.value[0].categoryId
  }
  request({
    url: '/mall4cloud_search/p/search/renovation_page',
    method: 'get',
    params: paramsData
  }).then((pageVO) => {
    goodsList.value = []
    pageVO.list[0].spus.forEach(item => {
      goodsList.value.push({
        prodId: item.spuId, // 商品id
        id: item.spuId, // 商品id
        prodType: item.spuType, // 商品类型
        prodName: item.spuName, // 商品名称
        status: item.spuStatus, // 商品状态
        price: item.priceFee, // 商品价格
        pic: checkFileUrl(item.mainImgUrl), // 商品图片
        brief: item.sellingPoint // 商品描述
      })
    })
    isFirst = true
  })
}

// 获取分类列表
const getCategoryList = () => {
  enableCategories({ shopId: 0 }).then((data) => {
    categoryList.value = data.filter(x => x.level === 0 && x.status === 1)
    getGoodsInfo()
  })
}

// 处理升降序
const dealSortType = (type, status) => {
  let res = 0
  switch (type) {
    case 0:
      res = status === 0 ? 0 : 1
      break
    case 1:
      res = status === 0 ? 3 : 2
      break
    case 2:
      res = status === 0 ? 5 : 4
      break
  }
  return res
}

</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
