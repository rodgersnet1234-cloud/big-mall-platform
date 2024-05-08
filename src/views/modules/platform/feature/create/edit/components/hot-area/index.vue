<template>
  <div class="micro-image-ad-box component-hot-area">
    <!--预览区-->
    <div class="design-preview-controller">
      <div
        v-if="formData.imageList.length"
        class="ad-view-box"
        :class="'ad-view-'+formData.indicator"
      >
        <div v-if="formData.indicator ===1 || formData.indicator ===4 ">
          <img
            v-for="(item, index) in formData.imageList"
            :key="index"
            style="display: block"
            :src="checkFileUrl(item.url)"
            alt=""
          >
        </div>
      </div>
      <div
        v-else
        class="image-ad-view"
      >
        <div class="image-ad-title">
          <img
            src="~@/assets/micro-page/p-ad-def.png"
            alt
          >
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
          {{ $t('shopFeature.imageAd.hotArea') }}
        </div>
        <div class="image-ad-edit">
          <div class="ad-edit-item-title">
            {{ $t('shopFeature.imageAd.addPic') }}
            <span class="tips">{{ $t('shopFeature.imageAd.max10Ads') }}</span>
          </div>
          <!--hot model-->
          <vue-draggable-next
            :list="formData.imageList"
            ghost-class="ghost"
            style="width: 376px;"
            handle=".ad-handle"
          >
            <div
              v-for="(item,index) in formData.imageList"
              :key="index"
              class="ad-image-hot"
            >
              <div
                class="add-ad-image"
                @click="showHotAreaPop(index)"
              >
                {{ $t('shopFeature.imageAd.addHotArea') }}
              </div>
              <div
                class="add-ad-image"
                @click="changeImg(index)"
              >
                {{ $t('shopFeature.tabNav.changePic') }}
              </div>
              <div class="ad-image-hot-box">
                <div
                  v-show="item.activeBoxs.length"
                  class="ad-image-hot-content ad-handle"
                >
                  <div
                    v-for="(hotItem,hotIndex) in item.activeBoxs"
                    :key="hotIndex"
                    class="ad-hot-box-item"
                    :style="`transform: translate(${hotItem.translateX * hotScale}px,${hotItem.translateY * hotScale}px);width:${hotItem.width * hotScale}px;height:${hotItem.height * hotScale}px;`"
                  >
                    <div
                      class="redirect-title"
                      style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis"
                    >
                      {{ hotItem.title }}
                    </div>
                    <el-icon
                      class="close-icon"
                      @click="item.activeBoxs.splice(hotIndex, 1)"
                    >
                      <Close />
                    </el-icon>
                  </div>
                </div>
                <img-show
                  :src="checkFileUrl(item.url)"
                  :class-list="['ad-handle']"
                />
                <el-icon
                  class="close-icon"
                  @click="formData.imageList.splice(hotIndex, 1)"
                >
                  <CircleCloseFilled />
                </el-icon>
              </div>
            </div>
          </vue-draggable-next>
          <!--选择图片框-->
          <div
            v-if="10 - formData.imageList.length !== 0"
            class="p-add-btn"
            @click="elxImgboxHandle"
          >
            <el-icon><Plus /></el-icon> {{ $t('shopFeature.imageAd.addBgImg') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 添加热区弹窗 start -->
    <el-dialog
      v-model="dialogHot"
      class="up-dialog"
      :close-on-click-modal="false"
      top="5vh"
      :title="$t('shopFeature.imageAd.addHotArea')"
      width="550px"
    >
      <div class="ad-hot-box">
        <div v-if="dialogHot&&formData.imageList.length">
          <img-show
            :src="formData.imageList[currentEditIndex].url"
            :class-list="['box-img']"
          />
          <div
            v-for="(item,index) in cacheImageActiveBox"
            :key="index"
            v-drag="{cacheImageActiveBox,index}"
            class="ad-drag"
          >
            <div
              class="titles"
              style="text-align: center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer;"
              @click.stop="handleNavLink(index)"
            >
              {{ item.title }}
            </div>
            <el-icon
              class="close-icon el-icon-close"
              @click="cacheImageActiveBox.splice(index, 1)"
            >
              <Close />
            </el-icon>
          </div>
        </div>
      </div>
      <template #footer>
        <div style="text-align: right;margin-top: 20px;">
          <el-button
            size="small"
            type="primary"
            @click="addHotArea"
          >
            {{ $t('shopFeature.imageAd.addHotArea') }}
          </el-button>
          <el-button
            size="small"
            @click="saveHotBox"
          >
            {{ $t('shopFeature.imageAd.save') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加热区弹窗 end -->
    <!-- 弹窗, 新增图片 -->
    <elx-imgbox
      ref="elxImgboxRef"
      :max-size="10"
      :img-size-limit="false"
      @refresh-pic="refreshPic"
    />
    <!-- 商品选择弹窗  -->
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :device-type="'mobile'"
      :custom-link-arr="customLinkArr"
      :current-select-type="[1, 2, 3, 4, 5, 6]"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import '../../directive/index'
import { VueDraggableNext } from 'vue-draggable-next'
import ElxImgbox from '@/components/img-box/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue'
import { ElMessage } from 'element-plus' // 选择商品

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
  indicator: 4, // 选择模板: 1一行一个; 2轮播海报; 3横向滑动; 4热区
  imageList: [] // 图片列表
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
  if (formData.imageList.length > 0) {
    myCheckResult(true)
  } else {
    emit('onErrorMessageTip', $t('shopFeature.imageAd.hotArea') + props.current + $t('shopFeature.tabNav.pleaseAddPic'))
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

const hotScale = ref(376 / 500)

const boxItem = { // 盒子模板
  link: '',
  type: '',
  title: '跳转链接',
  left: 0,
  top: 0,
  translateX: 0,
  translateY: 0,
  width: 102,
  height: 102
}

const elxImgboxRef = ref(null)
/**
 * 选择图片
 * type 1 单选; 2 多选
 */
const elxImgboxHandle = (type) => {
  if (type !== 1) {
    isChangeImg.value = false
  }
  nextTick(() => {
    elxImgboxRef.value?.init(type || 2, 10 - formData.imageList.length)
  })
}

const currentEditIndex = ref(0) // 当前编辑的图片
const isChangeImg = ref(false) // 是否为更换图片模式
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
      formData.imageList[currentEditIndex.value].url = imgsList[0]
      formData.imageList[currentEditIndex.value].title = ''
      return
    }
    imgsList.forEach(res => {
      formData.imageList.push({
        url: res,
        title: '',
        link: '',
        type: '',
        imgTit: '',
        activeBoxs: []
      })
    })
  }
}

const dialogHot = ref(false) // 是否显示热区
const cacheImageActiveBox = ref([]) // 缓存当前box list
/** 显示添加热区 */
const showHotAreaPop = (index) => {
  dialogHot.value = true
  currentEditIndex.value = index
  cacheImageActiveBox.value = JSON.parse(JSON.stringify(formData.imageList[currentEditIndex.value].activeBoxs))
}

/** 点击添加热区 */
const addHotArea = () => {
  cacheImageActiveBox.value.push(JSON.parse(JSON.stringify(boxItem)))
}
/** 保存热区 */
const saveHotBox = () => {
  const hotAreaBoxs = cacheImageActiveBox.value
  let flag = true
  for (let i = 0; i < hotAreaBoxs.length; i++) {
    const el = hotAreaBoxs[i]
    if (!el.type) {
      flag = false
      ElMessage.error($t('shopFeature.imageAd.setHotAreaRoute'))
      break
    }
  }
  if (flag) {
    formData.imageList[currentEditIndex.value].activeBoxs = hotAreaBoxs
    dialogHot.value = false
  }
}

/** 更换
 * 图片 */
const changeImg = (index) => {
  isChangeImg.value = true
  currentEditIndex.value = index
  elxImgboxHandle(1)
}

const dialogVisible = ref(false) // 商品弹窗
let currentImgIndex = 0 // 当前操作热区
const customLinkArr = ref({}) // 自定义连接回显
// 热区跳转路径
const handleNavLink = (index) => {
  dialogVisible.value = true
  currentImgIndex = index
  customLinkArr.value = cacheImageActiveBox.value[index]
}
// 商品弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 商品弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的是商品
    cacheImageActiveBox.value[currentImgIndex].type = '1'
    cacheImageActiveBox.value[currentImgIndex].title = value.goodsItem.spuName
    cacheImageActiveBox.value[currentImgIndex].link = value.goodsItem.spuId
  } else if (type === '2') { // 当前选择的是分类
    cacheImageActiveBox.value[currentImgIndex].type = '2'
    cacheImageActiveBox.value[currentImgIndex].title = value.categoryItem.label
    cacheImageActiveBox.value[currentImgIndex].link = value.categoryItem.data
  } else if (type === '3') { // 当前选择的是店铺
    cacheImageActiveBox.value[currentImgIndex].type = '3'
    cacheImageActiveBox.value[currentImgIndex].title = value.storeItem.shopName
    cacheImageActiveBox.value[currentImgIndex].link = value.storeItem.shopId
  } else if (type === '4') { // 当前选择的是页面
    cacheImageActiveBox.value[currentImgIndex].type = '4'
    cacheImageActiveBox.value[currentImgIndex].title = value.pageItem.title
    cacheImageActiveBox.value[currentImgIndex].link = value.pageItem.link
  } else if (type === '5') { // 当前选择的是微页面
    cacheImageActiveBox.value[currentImgIndex].type = '5'
    cacheImageActiveBox.value[currentImgIndex].title = value.smallPageItem.name
    cacheImageActiveBox.value[currentImgIndex].link = value.smallPageItem.renovationId
  } else if (type === '6') { // 自定义链接
    cacheImageActiveBox.value[currentImgIndex].type = '6'
    cacheImageActiveBox.value[currentImgIndex].title = value.customLink.url
    cacheImageActiveBox.value[currentImgIndex].link = value.customLink
  }
  dialogVisible.value = false
}

</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
