<template>
  <div class="micro-image-ad-box component-image-ad">
    <!--预览区-->
    <div class="design-preview-controller">
      <div
        v-if="formData.imageList.length"
        class="ad-view-box"
        :class="'ad-view-'+formData.indicator"
      >
        <div v-if="formData.indicator ===1">
          <div
            v-for="(item, index) in formData.imageList"
            :key="index"
            :style="{display: 'block', height: formData.imgHeight + 'px'}"
          >
            <el-image
              :key="index"
              style="display: flex; align-items: center;justify-content: center; width: 100%; height: 100%"
              fit="fill"
              :src="checkFileUrl(item.url)"
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
          </div>
        </div>

        <el-image
          v-for="(item,index) in formData.imageList"
          v-else
          :key="index"
          :style="{height: formData.imgHeight + 'px'}"
          fit="fill"
          style="display: flex;justify-content: center;align-items: center;"
          class="image-ad-view"
          :src="checkFileUrl(item.url)"
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
        <div
          v-if="formData.indicator === 2 && formData.swiperOption.indicatorDots"
          :style="{'bottom': formData.swiperOption.indicatorBottom + 'px'}"
          class="ad-po"
        >
          <span :style="{background:formData.swiperOption.indicatorActiveColor}" />
          <span :style="{background:formData.swiperOption.indicatorColor}" />
          <span :style="{background:formData.swiperOption.indicatorColor}" />
        </div>
      </div>
      <div
        v-else
        class="image-ad-view"
      >
        <div class="image-ad-title">
          {{ $t('shopFeature.imageAd.widthSuggest') }}
        </div>
      </div>
    </div>
    <!--编辑区-->
    <div
      v-show="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          {{ $t('shopFeature.imageAd.imageAd') }}
        </div>
        <div class="design-editor-component-container">
          <div class="image-ad-edit">
            <div class="ad-edit-item">
              <div class="ad-edit-item-title">
                {{ $t('shopFeature.imageAd.selModel') }}
              </div>
              <div class="ad-edit-item-content">
                <div
                  v-for="(item,index) in typeList"
                  :key="index"
                  :class="['item-box-type',{active:index + 1 === formData.indicator}]"
                  @click="changeIndicator(index)"
                >
                  <img
                    v-if="index + 1 === formData.indicator"
                    :src="item.picActive"
                    alt
                  >
                  <img
                    v-else
                    :src="item.pic"
                    alt
                  >
                  <p>{{ item.title }}</p>
                </div>
              </div>
            </div>

            <el-form
              v-if="formData.indicator === 2"
              ref="formDataRef"
              class="ad-form"
              label-width="100px"
              @submit.prevent
            >
              <el-form-item :label="$t('shopFeature.imageAd.isShowDots')">
                <el-switch
                  v-model="formData.swiperOption.indicatorDots"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-form-item>
              <el-form-item
                v-if="formData.swiperOption.indicatorDots"
                :label="$t('shopFeature.imageAd.dotsColor')"
              >
                <el-color-picker
                  v-model="formData.swiperOption.indicatorColor"
                  show-alpha
                />
              </el-form-item>
              <el-form-item
                v-if="formData.swiperOption.indicatorDots"
                :label="$t('shopFeature.imageAd.actDotColor')"
              >
                <el-color-picker
                  v-model="formData.swiperOption.indicatorActiveColor"
                  show-alpha
                />
              </el-form-item>
              <el-form-item
                v-if="formData.swiperOption.indicatorDots"
                label="指示点位置"
              >
                <el-slider
                  v-model="formData.swiperOption.indicatorBottom"
                  style="width: 80%"
                  :show-tooltip="showTooltip"
                  show-input
                  input-size="small"
                  :min="0"
                  :max="formData.imgHeight - 10"
                  @input="changeBoxHeight(true)"
                  @change="changeBoxHeight(false)"
                />
              </el-form-item>
            </el-form>

            <div class="ad-edit-item">
              <div class="ad-edit-item-title">
                <span class="img-tips">{{ $t('shopFeature.imageAd.imgSizeTip') }}</span>
              </div>
              <div class="ad-edit-item-title ad-edit-img-height">
                {{ $t('shopFeature.imageAd.imgHeight') }}
                <el-slider
                  v-model="formData.imgHeight"
                  style="width: 80%"
                  :show-tooltip="showTooltip"
                  show-input
                  input-size="small"
                  :min="100"
                  :max="400"
                  @input="changeBoxHeight(true)"
                  @change="changeBoxHeight(false)"
                />
              </div>
              <div class="ad-edit-item-title">
                {{ $t('shopFeature.imageAd.addPic') }}
                <span class="tips">{{ $t('shopFeature.imageAd.max10Ads') }}</span>
              </div>
              <vue-draggable-next
                :list="formData.imageList"
                ghost-class="ghost"
                handle=".ad-handle"
              >
                <div
                  v-for="(item,index) in formData.imageList"
                  :key="index"
                  class="ad-image-list-item"
                >
                  <div
                    class="ad-image-list-img ad-handle"
                    :style="{backgroundImage:`url(${item.url})`}"
                  >
                    <p
                      class="re-choose-img"
                      @click="changeImg(index)"
                    >
                      {{ $t('shopFeature.tabNav.changePic') }}
                    </p>
                  </div>
                  <div class="ad-image-list-content">
                    <div class="ad-image-item">
                      <div class="ad-image-title">
                        {{ $t('shopFeature.imageAd.picTit') }}
                      </div>
                      <el-input
                        v-model="item.imgTit"
                        size="small"
                        :placeholder="$t('shopFeature.imageAd.picTit')"
                      />
                      <redirect-nav
                        style="width: 200px"
                        :selected-link="item.path && item.path.name"
                        :placeholder="$t('pcdecorate.placeholder.link')"
                        @handle-nav-select="handleNavSelect(index)"
                        @handle-remove-selected="handleRemoveSelected(index)"
                      />
                    </div>
                    <el-icon
                      class="close-icon"
                      @click="formData.imageList.splice(index, 1)"
                    >
                      <CircleCloseFilled />
                    </el-icon>
                  </div>
                </div>
              </vue-draggable-next>
              <!--选择图片框-->
              <div
                v-if="10 - formData.imageList.length !== 0"
                class="ad-add-image p-add-btn"
                @click="elxImgboxHandle"
              >
                <el-icon><Plus /></el-icon> {{ $t('shopFeature.imageAd.addBgImg') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗, 新增图片 -->
    <elx-imgbox
      ref="elxImgboxRef"
      :max-size="10"
      :img-size-limit="false"
      @refresh-pic="refreshPic"
    />
    <!-- 商品选择弹窗  -->
    <prods-select
      v-if="dialogChooseGoods"
      ref="ProdsSelectRef"
      :is-single="true"
      @refresh-select-prods="chooseGoodsFun"
    />
    <!--选择微页面-->
    <el-dialog
      v-model="dialogChoosePages"
      class="up-dialog"
      :close-on-click-modal="false"
      top="5vh"
      :title="$t('shopFeature.tabNav.microPage')"
      width="42%"
    >
      <div class="choose-goods-compent">
        <choose-feature
          :is-get-choose-data="isGetChooseFeature"
          @choose-choose-features-fun="chooseChooseFeaturesFun"
        />
      </div>
      <template #footer>
        <div
          style="text-align: right;margin-top: 20px;"
        >
          <el-button
            size="small"
            type="primary"
            @click="isGetChooseFeature=!isGetChooseFeature"
          >
            {{ $t('shopFeature.tabNav.confirm') }}
          </el-button>
          <el-button
            size="small"
            @click="dialogChoosePages = false"
          >
            {{ $t('shopFeature.tabNav.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 弹窗: 输入自定义路径 -->
    <el-dialog
      v-model:visible="showPathInputDialog"
      class="up-dialog"
      :title="$t('shopFeature.tabNav.customPath')"
      width="40%"
      top="30vh"
    >
      <div class="custom-path-con">
        <span>{{ $t('shopFeature.tabNav.routeLink') }}</span>
        <el-input
          v-model="customPath"
          style="margin-right: 10px;"
          :placeholder="$t('shopFeature.tabNav.pleaseFillThePath')"
        />
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button
            size="small"
            type="primary"
            @click="customPathComfirm"
          >
            {{ $t('shopFeature.tabNav.confirm') }}
          </el-button>
          <el-button
            size="small"
            @click="customPathCancel"
          >
            {{ $t('shopFeature.tabNav.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :device-type="'mobile'"
      :current-select-type="[1, 2, 3, 4, 5, 6]"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>

/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import '../../directive/index.js'
import { VueDraggableNext } from 'vue-draggable-next'
import ProdsSelect from '@/components/prods-select/index.vue'
import ElxImgbox from '@/components/img-box/index.vue'
import ChooseFeature from '@/components/choose-feature/index.vue'
import redirectNav from '../../../../../decorate/create/common-component/redirect-nav/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品
import { ElMessage } from 'element-plus'
import oneLineOnePng from '@/assets/micro-page/one-line-one.png'
import oneLineOneActivePng from '@/assets/micro-page/one-line-one-active.png'
import carouselSwiperPng from '@/assets/micro-page/carousel-swiper.png'
import carouselSwiperActivePng from '@/assets/micro-page/carousel-swiper-active.png'
import lateralSlidingPng from '@/assets/micro-page/lateral-sliding.png'
import lateralSlidingActivePng from '@/assets/micro-page/lateral-sliding-active.png'

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

const emit = defineEmits(['myCheckResult', 'componentsValueChance', 'onErrorMessageTip'])

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
}, { deep: true })

const formData = reactive({
  indicator: 1, // 选择模板: 1一行一个; 2轮播海报; 3横向滑动; 4热区
  imgHeight: 160, // 图片高度
  imageList: [], // 图片列表
  swiperOption: { // 轮播海报设置
    indicatorDots: false, // 是否显示指示点
    indicatorColor: 'rgba(0, 0, 0, .3)', // 默认指示点颜色
    indicatorActiveColor: '#e43130', // 激活的指示点颜色
    indicatorBottom: 10 // 激活的指示点位置
  }
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
  let isPass = true
  let errorMessage = ''
  if (!formData.imageList.length) {
    isPass = false
    errorMessage = $t('shopFeature.imageAd.imageAd') + props.current + $t('shopFeature.tabNav.pleaseAddPic')
  }
  if (isPass) {
    myCheckResult(isPass)
  } else {
    // 弹窗提示错误消息
    showCheckForm()
    emit('onErrorMessageTip', errorMessage)
  }
}

const formDataRef = ref(null)
/**
 * 可选
 * 当子组件不符合规则时，是否调用element ui 默认的规则判断
 * 需要默认结构为form
 * */
const showCheckForm = (cb) => {
  nextTick(() => {
    if (formDataRef.value) {
      formDataRef.value.validate((valid) => {
        if (valid) {
          if (cb) cb(valid)
        } else {
          if (cb) cb(valid)
        }
      })
    }
  })
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

const typeList = [
  {
    title: $t('shopFeature.goods.oneLineItem1'),
    pic: oneLineOnePng,
    picActive: oneLineOneActivePng
  },
  {
    title: $t('shopFeature.imageAd.carouselPoster'),
    pic: carouselSwiperPng,
    picActive: carouselSwiperActivePng
  },
  {
    title: $t('shopFeature.imageAd.lateralSliding'),
    pic: lateralSlidingPng,
    picActive: lateralSlidingActivePng
  }
]
const commandInfo = reactive({}) // 选择跳转的信息
const isGetChooseFeature = ref(false) // 是否可以返回微页面
const editLinkType = ref(0) // 当前改项目的跳转类型

const elxImgboxRef = ref(null)
/**
 * 选择图片
 * @param {Number} type
 * type 1 单选; 2 多选
 */
const elxImgboxHandle = (type) => {
  nextTick(() => {
    elxImgboxRef.value?.init(type || 2, 10 - formData.imageList.length)
  })
}

const isChangeImg = ref(false) // 是否为更换图片模式
let currentEditIndex = 0 // 当前编辑的图片
/**
 * 选择图片回调
 * @param {String} imagePath 无前缀的图片地址字符串(多图时用,分割)
 */
const refreshPic = (imagePath) => {
  const imgsList = imagePath.split(',')
  for (let i = 0; i < imgsList.length; i++) {
    imgsList[i] = checkFileUrl(imgsList[i])
  }
  if (imgsList.length) {
    if (isChangeImg.value) { // 更换图片模式
      formData.imageList[currentEditIndex].url = imgsList[0]
      formData.imageList[currentEditIndex].title = ''
      return
    }
    imgsList.forEach(res => {
      formData.imageList.push({
        url: res,
        title: '',
        link: '',
        type: '',
        imgTit: '',
        path: {
          type: '',
          name: '',
          link: ''
        },
        activeBoxs: []
      })
    })
    const imgDef = new Image()
    imgDef.src = formData.imageList[0].url
    formData.imgHeight = Math.round(375 / imgDef.width * imgDef.height)
  }
}

/** 切换模板 */
const changeIndicator = (index) => {
  formData.indicator = index + 1
}

/** 更换图片 */
const changeImg = (index) => {
  isChangeImg.value = true
  currentEditIndex = index
  elxImgboxHandle(1)
}

const dialogChooseGoods = ref(false) // 选择商品
// 选择商品回调
const chooseGoodsFun = ($event) => {
  if ($event) {
    setLinkInfo({
      title: $event.prodName,
      link: $event.prodId
    })
  }
  dialogChooseGoods.value = false
}

const dialogVisible = ref(false) // 商品弹窗
let currentImgIndex = 0 // 当前操作广告
// 选择跳转路径
const handleNavSelect = (index) => {
  dialogVisible.value = true
  currentImgIndex = index
}

// 删除跳转路径
const handleRemoveSelected = (index) => {
  formData.imageList[index].path.type = ''
  formData.imageList[index].path.name = ''
  formData.imageList[index].path.link = ''
}

// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
}

// 商品弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的是商品
    formData.imageList[currentImgIndex].path.name = value.goodsItem.spuName
    formData.imageList[currentImgIndex].path.link = value.goodsItem.spuId
    formData.imageList[currentImgIndex].path.type = '1'
  } else if (type === '2') { // 当前选择的是分类
    formData.imageList[currentImgIndex].path.name = value.categoryItem.label
    formData.imageList[currentImgIndex].path.link = value.categoryItem.data
    formData.imageList[currentImgIndex].path.type = '2'
  } else if (type === '3') { // 当前选择的是店铺
    formData.imageList[currentImgIndex].path.name = value.storeItem.shopName
    formData.imageList[currentImgIndex].path.link = value.storeItem.shopId
    formData.imageList[currentImgIndex].path.type = '3'
  } else if (type === '4') { // 当前选择的是页面
    formData.imageList[currentImgIndex].path.name = value.pageItem.title
    formData.imageList[currentImgIndex].path.link = value.pageItem.link
    formData.imageList[currentImgIndex].path.type = '4'
  } else if (type === '5') { // 当前选择的是微页面
    formData.imageList[currentImgIndex].path.name = value.smallPageItem.name
    formData.imageList[currentImgIndex].path.link = value.smallPageItem.renovationId
    formData.imageList[currentImgIndex].path.type = '5'
  } else if (type === '6') { // 自定义链接
    formData.imageList[currentImgIndex].path.name = value.customLink.url
    formData.imageList[currentImgIndex].path.link = value.customLink
    formData.imageList[currentImgIndex].path.type = '6'
  }
  dialogVisible.value = false
}

/** 设置跳转信息 */
const setLinkInfo = (obj) => {
  formData.imageList[currentEditIndex].title = obj.title
  formData.imageList[currentEditIndex].link = obj.link
  formData.imageList[currentEditIndex].type = commandInfo.type || editLinkType
}

const customPath = ref('') // 自定义路径
const showPathInputDialog = ref(false) // 自定义路径输入弹窗
/**
 * 自定义路径弹窗确认
 */
const customPathComfirm = () => {
  if (!customPath.value.trim()) {
    ElMessage.error($t('shopFeature.tabNav.pleaseFillThePath'))
    return
  }
  setLinkInfo({
    title: customPath.value,
    link: customPath.value
  })
  showPathInputDialog.value = false
  customPath.value = ''
}

/**
 * 自定义路径弹窗取消
 */
const customPathCancel = () => {
  showPathInputDialog.value = false
}

// 微页面选择
const dialogChoosePages = ref(false)

// 选择微页面回调
const chooseChooseFeaturesFun = () => {
  dialogChoosePages.value = false
}

const showTooltip = ref(true)
/* 控制滑块tooltip隐藏 */
const changeBoxHeight = (t) => {
  showTooltip.value = t
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
