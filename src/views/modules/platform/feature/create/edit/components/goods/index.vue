<template>
  <div class="micro-goods-box component-goods">
    <div class="design-preview-controller">
      <div class="goods-list">
        <template v-if="formData.goods.length">
          <div
            v-for="(item, index) in formData.goods"
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
                  :class="{goodsImgOne1:formData.size === 1, 'goods-empty': !formData.goods[0].prodId}"
                  :src="item.pic"
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
        <div
          v-if="goodsList.length===0"
          class="empty-tips"
        >
          {{ $t('shopFeature.goods.pleaseAddProd') }}
        </div>
      </div>
    </div>

    <div
      v-if="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          {{ $t('shopFeature.allCanUse.goodsList') }}
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
              :label="$t('shopFeature.goods.prod')"
              class="goods-select-con"
            >
              <div class="goods-select-list">
                <div
                  v-for="(item,index) in formData.goods"
                  :key="index"
                  class="goods-select-item"
                >
                  <el-image
                    class="goods-select-item-img"
                    :class="{'goods-empty': !formData.goods[0].prodId}"
                    :src="item.pic"
                    fit="fill"
                  >
                    <template #error>
                      <div class="image-slot">
                        <img
                          src="@/assets/pc-micro-page/show-default.png"
                          style="width: 100%;"
                          alt
                        >
                      </div>
                    </template>
                  </el-image>
                  <span
                    class="close-item"
                    @click="formData.goods.splice(index,1)"
                  >x</span>
                </div>
                <div class="goods-select-item">
                  <div
                    class="goods-select-item-img add-btn"
                    @click="selectProdHandle"
                  >
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </div>
                </div>
              </div>
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
          </el-form>
        </div>
      </div>
    </div>
    <prods-select
      v-if="dialogChooseGoods"
      ref="ProdsSelectRef"
      @refresh-select-prods="chooseGoodsFun"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :device-type="'mobile'"
      :is-mulilt="true"
      :echo-data-list="echoDataList"
      :current-select-type="[1]"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import defPng from '@/assets/micro-page/def.png'
import { formatPrice } from '@/utils/index'
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import ProdsSelect from '@/components/prods-select/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue'
import { ElMessage } from 'element-plus'

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
    default: () => { }
  },
  isStartCheckFieldRules: { // 是否开始校验规则
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
  goods: []
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
  if (formData.goods.length > 0) {
    myCheckResult(true)
  } else {
    ElMessage.error($t('shopFeature.allCanUse.goodsList') + props.current + $t('shopFeature.goods.pleaseAddProd'))
  }
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

// 获取的接口数据
const goodsList = ref([])
// 默认数据
const demoGoods = []

watch(() => goodsList.value, (val) => {
  if (val.length) {
    if (!goodsList.value.find(x => x.myGoodsType === 1)) {
      formData.goods = []
      val.forEach(res => {
        formData.goods.push(res.prodId)
      })
      goodsList.value.concat(val)
    }
  } else {
    goodsList.value = demoGoods
  }
}, { deep: true })

onMounted(() => {
  goodsList.value = []
  for (let i = 0; i < 4; i++) {
    goodsList.value.push({
      prodId: '', // 商品id
      prodName: $t('shopFeature.goods.prodName'),
      price: '90', // 商品价格
      pic: defPng,
      brief: $t('shopFeature.goods.prodDesc'),
      myGoodsType: 1
    })
  }
})

const dialogVisible = ref(false) // 商品弹窗
const echoDataList = ref([]) // 回显商品数据
// 选择商品操作
const selectProdHandle = () => {
  dialogVisible.value = true
  echoDataList.value = [] // 商品数据回显
  formData.goods.forEach(item => {
    item.spuId = item.id
    echoDataList.value.push(item)
  })
}

const dialogChooseGoods = ref(false)
// 选择商品回调
const chooseGoodsFun = ($event) => {
  if ($event) {
    if (goodsList.value.find(x => x.myGoodsType === 1)) {
      goodsList.value = []
    }
    $event.forEach(newGoodItem => {
      if (formData.goods.indexOf(newGoodItem.prodId) === -1) {
        goodsList.value.push(newGoodItem)
      }
    })
  }
  dialogChooseGoods.value = false
}

// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
}

// 商品确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') {
    formData.goods = []
    value.goodsItem.forEach(item => {
      formData.goods.push({
        prodId: item.spuId || item.prodId, // 商品id
        id: item.spuId || item.id, // 商品id
        prodType: item.spuType || item.prodType, // 商品类型
        prodName: item.spuName || item.prodName, // 商品名称
        status: item.spuStatus || item.status, // 商品状态
        price: item.priceFee || item.price, // 商品价格
        pic: item.mainImgUrl || item.pic, // 商品图片
        brief: item.sellingPoint || item.brief // 商品描述
      })
    })
  }
  dialogVisible.value = false
}

</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
