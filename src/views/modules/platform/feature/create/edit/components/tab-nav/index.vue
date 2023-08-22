<template>
  <div class="micro-tab-nav-box component-tab-nav">
    <!--预览控制区-->
    <div class="design-preview-controller">
      <!--文本-->
      <div
        v-if="formData.set.type === 3"
        class="nav-list"
      >
        <div
          v-for="(item,index) in showNav"
          :key="index"
          :class="['nav-item-item text_overFlow_1 nav-item-image-li', formData.size === 4? 'column-four': 'column-five']"
        >
          <span
            class="text_overFlow_1"
            :style="{color:formData.set.font_color}"
          >{{ item.title || `demo${index+1}` }}</span>
        </div>
      </div>
      <!--模式 图文-->
      <div
        v-else
        class="nav-item-image"
      >
        <div
          v-for="(item,index) in showNav"
          :key="index"
          :class="['nav-item-image-li', formData.size === 4? 'column-four': 'column-five']"
        >
          <div
            class="img-con"
            :class="{'full-img': item.img}"
          >
            <img
              :src="item.img || defPic"
              alt
            >
          </div>
          <!--图文模式-->
          <span
            v-if="formData.set.type !==1"
            class="text_overFlow_1"
            :style="{color:formData.set.font_color}"
          >
            {{ item.title || `demo${index+1}` }}</span>
        </div>
        <!-- 补齐flex布局样式 -->
        <slot v-if="showNav.length % formData.size !== 0">
          <div
            v-for="(item,index) in formData.size - (showNav.length % formData.size)"
            :key="index + 100"
            :class="['nav-item-image-li', formData.size === 4? 'column-four': 'column-five']"
            style="visibility:hidden;"
          >
            <div class="img-con">
              <img
                :src="defPic"
                alt
              >
            </div>
            <!--图文模式-->
            <span
              v-if="formData.set.type !==1"
              class="text_overFlow_1"
            >
              {{ item.title || `demo${index+1}` }}</span>
          </div>
        </slot>
      </div>
    </div>
    <!--编辑工作区-->
    <div
      v-if="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          {{ $t('shopFeature.tabNav.navBar') }}
        </div>
        <div class="tab-nav-set design-editor-component-container">
          <!-- 配置-->
          <div class="tab-set-box">
            <el-form
              ref="formDataRef"
              class="edit-form"
              @submit.prevent
            >
              <el-form-item
                label="选择模版"
                class="tab-set-style"
              >
                <el-radio-group v-model="formData.set.type">
                  <el-radio
                    v-for="(typeItem, index) in setTypeList"
                    :key="index"
                    :label="typeItem.type"
                  >
                    {{ typeItem.title }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('shopFeature.tabNav.countInLine')">
                <el-radio-group v-model="formData.size">
                  <el-radio
                    v-for="(typeItem, index) in setCountsList"
                    :key="index"
                    :label="typeItem.value"
                  >
                    {{ typeItem.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <!-- 各个导航分类 -->
          <div
            v-for="(item,index) in formData.nav"
            :key="index"
            class="tab-nav-set-item"
            :style="{borderColor:errIndex===index ? '#f56c6c': '#eee'}"
          >
            <div class="set-box">
              <!--图片-->
              <div
                v-if="formData.set.type !==3"
                class="set-image"
                :style="{backgroundImage:'url('+item.img+')'}"
                @click="choosePic(index)"
              >
                <div
                  v-if="item.img"
                  class="set-image-add"
                >
                  {{ $t('shopFeature.tabNav.changePic') }}
                </div>

                <div
                  v-else
                  class="set-image-empty"
                >
                  <div><el-icon><Plus /></el-icon></div>
                  <div>{{ $t('shopFeature.tabNav.addPic') }}</div>
                </div>
              </div>
              <!-- 标题信息 -->
              <div
                class="set-info"
                :class="{'flex-center': formData.set.type === 1}"
              >
                <div
                  v-if="formData.set.type !==1"
                  class="set-item-title"
                >
                  <span>{{ $t('shopFeature.tabNav.tit') }}</span>
                  <el-input
                    v-model="item.title"
                    maxlength="25"
                    size="small"
                    :style="{width: formData.set.type === 3 ? '274px' : '227px'}"
                    :placeholder="$t('shopFeature.tabNav.tit')"
                  />
                </div>
                <div class="set-item-title">
                  <span>{{ $t('shopFeature.tabNav.link') }}</span>
                  <div :style="{width: formData.set.type === 3 ? '274px' : '227px'}">
                    <redirect-nav
                      :selected-link="item.path && item.path.name"
                      :placeholder="$t('pcdecorate.placeholder.link')"
                      @handle-nav-select="handleNavSelect(index)"
                      @handle-remove-selected="handleRemoveSelected(index)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <el-icon
              class="set-close"
              @click="formData.nav.splice(index,1)"
            >
              <Close />
            </el-icon>
          </div>
          <div
            class="p-add-btn"
            @click="addNav"
          >
            <el-icon><Plus /></el-icon> {{ $t('shopFeature.tabNav.addNav') }}
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
import ElxImgbox from '@/components/img-box/index.vue'
import redirectNav from '../../../../../decorate/create/common-component/redirect-nav/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue'
import { ElMessage } from 'element-plus' // 选择商品
import defPng from '@/assets/micro-page/def.png'

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
  }
})

const emit = defineEmits(['myCheckResult', 'componentsValueChance'])

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
}, { deep: true })

const formData = reactive({
  set: {
    type: 2 // 模板类型   1-图片 2-图文 3-文字
  },
  // 配置
  nav: [],
  size: 4 // 默认一行四个导航
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

const errIndex = ref('') // 信息不完整的导航项的索引
/* 校验 */
const startCheckFieldRulesCommonFun = () => {
  let isPass = true
  let errorMessage = ''
  if (!formData.nav.length) {
    isPass = false
    errorMessage = $t('shopFeature.tabNav.navBar') + props.current + $t('shopFeature.tabNav.pleaseAddNav')
  } else {
    for (let index = 0; index < formData.nav.length; index++) {
      const navItem = formData.nav[index]
      // formData.set.type    1-图片 2-图文 3-文字
      if (formData.set.type < 3) {
        // 图片校验
        if (!navItem.img || !navItem.img.trim()) {
          isPass = false
          errorMessage = $t('shopFeature.tabNav.navBar') + props.current + $t('shopFeature.tabNav.pleaseAddPic')
          errIndex.value = index
          break
        }
      }
      if (formData.set.type > 1) {
        // 导航标题校验
        if (!navItem.title || !navItem.title.trim()) {
          isPass = false
          errorMessage = $t('shopFeature.tabNav.navBar') + props.current + $t('shopFeature.tabNav.pleaseFillNavTitle')
          errIndex.value = index
          break
        }
      }
      // 公共校验
      if (navItem.path.name === '') {
        errorMessage = $t('shopFeature.tabNav.navBar') + props.current + $t('shopFeature.tabNav.pleaseChooseRouteLink')
        isPass = false
        errIndex.value = index
        break
      }
      if (navItem.linkType === 4 && !navItem.link.trim()) {
        errorMessage = $t('shopFeature.tabNav.navBar') + props.current + $t('shopFeature.tabNav.pleaseFillThePath')
        isPass = false
        errIndex.value = index
        break
      }
    }
  }
  if (isPass) {
    myCheckResult(isPass)
    errIndex.value = ''
  } else {
    showCheckForm() // 使用element-ui表单自定义校验规则: 需在form标签内,自定义rules:{required:true}
    ElMessage.error(errorMessage)
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

const setTypeList = [ // 模式
  {
    type: 1,
    title: $t('shopFeature.tabNav.picNav')
  },
  {
    type: 2,
    title: $t('shopFeature.tabNav.picTextNav')
  },
  {
    type: 3,
    title: $t('shopFeature.tabNav.tetxNav')
  }
]
const setCountsList = [
  {
    value: 4,
    label: $t('shopFeature.tabNav.line4item')
  },
  {
    value: 5,
    label: $t('shopFeature.tabNav.line5item')
  }
]
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const defPic = ref(defPng)

const showNav = ref([])
const demoNav = []
watch(() => formData, (res) => {
  if (res.size === 4) {
    demoNav.splice(4, 1)
  } else if (res.size === 5 && demoNav.length === 4) {
    demoNav.push({
      title: 'demo5'
    })
  }
  if (res.nav.length) {
    showNav.value = res.nav
  } else {
    showNav.value = demoNav
  }
}, { deep: true })

onMounted(() => {
  for (let i = 0; i < 4; i++) {
    demoNav.push({
      title: `demo${i + 1}`
    })
  }
  if (formData.nav.length) {
    showNav.value = formData.nav
  } else {
    showNav.value = demoNav
  }
})

let currentNav = 0

/**
 * 点击图片
 */
const choosePic = (index) => {
  currentNav = index
  elxImgboxHandle(1)
}

const elxImgboxRef = ref(null)
/**
 * 选择图片
 * type 1 单选; 2 多选
 */
const elxImgboxHandle = (type) => {
  nextTick(() => {
    elxImgboxRef.value?.init(type)
  })
}

/**
 * 选择图片回调
 * @param {String} imagePath 无前缀的图片地址字符串(多图时用,分割)
 */
const refreshPic = (imagePath) => {
  // 导航这里只有单选的
  formData.nav[currentNav].img = resourcesUrl + imagePath
}
/** 添加导航 */
const addNav = () => {
  formData.nav.push({
    title: `demo${formData.nav.length + 1}`, // nav 标题
    microTitle: '', // 微页面的名称
    img: '', // 图文/图片导航  图片
    path: {
      type: '',
      name: '',
      link: ''
    }
  })
}

const dialogVisible = ref(false) // 商品信息弹窗是否显示
let currentNavIndex = 0 // 当前操作导航
// 选择跳转路径
const handleNavSelect = (index) => {
  dialogVisible.value = true
  currentNavIndex = index
}

// 删除跳转路径
const handleRemoveSelected = (index) => {
  formData.nav[index].path.type = ''
  formData.nav[index].path.link = ''
  formData.nav[index].path.name = ''
}

// 商品弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}

// 商品弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的是商品
    formData.nav[currentNavIndex].path.name = value.goodsItem.spuName
    formData.nav[currentNavIndex].path.link = value.goodsItem.spuId
    formData.nav[currentNavIndex].path.type = '1'
  } else if (type === '2') { // 当前选择的是分类
    formData.nav[currentNavIndex].path.name = value.categoryItem.label
    formData.nav[currentNavIndex].path.link = value.categoryItem.data
    formData.nav[currentNavIndex].path.type = '2'
  } else if (type === '3') { // 当前选择的是店铺
    formData.nav[currentNavIndex].path.name = value.storeItem.shopName
    formData.nav[currentNavIndex].path.link = value.storeItem.shopId
    formData.nav[currentNavIndex].path.type = '3'
  } else if (type === '4') { // 当前选择的是页面
    formData.nav[currentNavIndex].path.name = value.pageItem.title
    formData.nav[currentNavIndex].path.link = value.pageItem.link
    formData.nav[currentNavIndex].path.type = '4'
  } else if (type === '5') { // 当前选择的是微页面
    formData.nav[currentNavIndex].path.name = value.smallPageItem.name
    formData.nav[currentNavIndex].path.link = value.smallPageItem.renovationId
    formData.nav[currentNavIndex].path.type = '5'
  } else if (type === '6') { // 自定义链接
    formData.nav[currentNavIndex].path.name = value.customLink.url
    formData.nav[currentNavIndex].path.link = value.customLink
    formData.nav[currentNavIndex].path.type = '6'
  }
  dialogVisible.value = false
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
