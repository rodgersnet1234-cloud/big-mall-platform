<template>
  <div class="micro-classification-list-box component-classification-list">
    <div class="design-preview-controller">
      <div
        ref="design_vue_pre"
        class="rc-design-vue-preview default-preview"
      >
        <img
          v-if="!formData.categoryList.length"
          src="@/assets/micro-page/class.png"
          alt
        >

        <div
          v-if="formData.categoryList.length"
          class="all-class"
        >
          <div class="all-item-left">
            <div
              v-for="(item,index) in formData.categoryList"
              :key="index"
              :class="['all-item-list',{active:index === 0}]"
            >
              {{ item.title }}
            </div>
          </div>
          <div class="all-item-right">
            <div
              v-for="(item,index) in formData.categoryList"
              :key="index"
            >
              <div
                v-if="item.banner&&item.banner.image_url"
                class="banner-wrapper"
              >
                <div
                  class="banner-wrapper-cont"
                  :style="{backgroundImage:'url('+item.banner.image_url+')'}"
                />
              </div>
              <div class="group_body">
                <div class="container_group">
                  <div class="container_group-title">
                    {{ item.title }}
                  </div>
                  <div
                    v-if="item.subCategoryList"
                    class="container_group-list"
                  >
                    <div
                      v-for="(itemSub,indexSub) in item.subCategoryList"
                      :key="indexSub"
                      class="container_group-list-item"
                    >
                      <div
                        v-if="itemSub.image_url"
                        class="cap-category-container__img"
                        :style="{backgroundImage:'url('+itemSub.image_url+')'}"
                      />
                      <div
                        v-if="itemSub.title"
                        class="cap-category-container__title"
                      >
                        {{ itemSub.title }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          商品分类列表
        </div>
        <div
          v-for="(item,index) in formData.categoryList"
          :key="index"
          class="collapse-box"
        >
          <div class="collapse-item">
            <div class="title-header">
              分类{{ index+1 }} :
              <el-input
                v-model="item.title"
                class="inputTitle"
                placeholder="请输入分类名称"
                @click.stop="inputFocus(index)"
              />
              <el-icon class="iconRight">
                <ArrowDown v-if="item.isSw" />
                <ArrowRight v-else />
              </el-icon>
            </div>
            <div :class="['collapse-con',{hide:!item.isSw}]">
              <div class="add-ads-desc">
                <span class="label-name">分类头图</span>：
              </div>
              <!--添加一个背景图-->
              <div
                v-if="!item.banner.image_url"
                class="editor-card-add"
                @click="addHeaderImg(index)"
              >
                <div class="add-image">
                  <div class="add-image-text">
                    <el-icon>
                      <Plus />
                    </el-icon>
                    添加一个背景图
                  </div>
                  <div class="add-image-tip">
                    {{ headerImg }}
                  </div>
                </div>
              </div>

              <!--头图-->
              <div
                v-if="item.banner.image_url"
                class="class-edit-box"
              >
                <div class="editor_subentry-item clearfix">
                  <div class="image-component image-editor">
                    <div class="has-choosed-image-box">
                      <img-show
                        :src="item.banner.image_url"
                        :img-style="{width:'80px',height:'80px'}"
                        :class-list="['thumb-image']"
                      />
                      <span
                        class="modify-image"
                        @click.stop="addHeaderImg(index)"
                      >更换图片</span>
                    </div>
                  </div>

                  <div class="subentry-item-editor">
                    <div class="subentry-control-group">
                      <label class="editor-container">
                        <div class="control-group-label">
                          跳转:
                        </div>
                        <div class="editor__control-group-control">
                          <div class="rc-choose-link-menu">
                            <div style="display: inline-block;">
                              <el-dropdown
                                trigger="click"
                                @command="handleCommandOne"
                              >

                                <div
                                  style="font-size: 12px;color: #333;cursor: pointer;"
                                  @click="chooseItem(index,2)"
                                >
                                  <span
                                    v-show="item.banner.type"
                                    class="typelabel"
                                  >{{ typeNameFilter(item.banner.type) }}</span>
                                  {{ item.banner.title ? item.banner.title : '选择跳转到的页面' }}
                                  <i class="zenticon zenticon-right rc-choose-link-menu--closed" />
                                </div>

                                <template #dropdown><el-dropdown-menu>
                                  <el-dropdown-item
                                    v-for="(v,i) in linkArray"
                                    :key="i"
                                    :command="({index,v})"
                                  >
                                    {{ v.title }}
                                  </el-dropdown-item>
                                </el-dropdown-menu></template>

                              </el-dropdown>

                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <el-icon
                  class="item-delete "
                  @click="item.banner.image_url=''"
                >
                  <CircleCloseFilled />
                </el-icon>
              </div>

              <div class="add-ads-desc">
                <span class="label-name">子分类</span>：
              </div>
              <div class="editor">
                <div class="editor-container">
                  <div class="editor editor-control">
                    <div class="rc-design-editor-card">
                      <div class="editor-card rc-design-component-image-ad-editor-card">
                        <!--添加的图 item-->
                        <SlickList
                          v-model="item.subCategoryList"
                          :use-drag-handle="true"
                          axis="y"
                        >
                          <SlickItem
                            v-for="(subItem,subIndex) in item.subCategoryList"
                            :key="subIndex"
                            class="class-edit-box"
                            :index="subIndex"
                          >
                            <div class="editor_subentry-item clearfix">
                              <div class="image-component image-editor">
                                <div class="has-choosed-image-box">
                                  <img-show
                                    :src="subItem.image_url"
                                    :img-style="{width:'80px',height:'80px'}"
                                    :class-list="['thumb-image']"
                                  />
                                  <div
                                    v-handle
                                    class="drag_box"
                                  />
                                  <span
                                    class="modify-image"
                                    @click.stop="addItemImg(subIndex,index)"
                                  >更换图片</span>
                                </div>
                              </div>
                              <div class="subentry-item-editor">
                                <div class="zent-design-editor__control-group">
                                  <label class="editor-container">
                                    <div class="control-group-label">
                                      标题:
                                    </div>
                                    <div class="editor__control-group-control">
                                      <div class="zent-input-wrapper">
                                        <el-input
                                          v-model.trim="subItem.title"
                                          size="small"
                                          placeholder="建议10个字以内，可不填"
                                          clearable
                                        />
                                      </div>
                                    </div>
                                  </label>
                                </div>
                                <div class="subentry-control-group">
                                  <label class="editor-container">
                                    <div class="control-group-label">
                                      跳转:
                                    </div>
                                    <div class="editor__control-group-control">
                                      <div class="rc-choose-link-menu">
                                        <div style="display: inline-block;">
                                          <el-dropdown
                                            trigger="click"
                                            @command="handleCommandOne"
                                          >
                                            <div
                                              :class="['choose_ed',{active:subItem.type&&subItem.title}]"
                                              @click="chooseItem(index,1,subIndex)"
                                            >
                                              <span
                                                v-if="subItem.type"
                                                class="typelabel"
                                              >
                                                {{ typeNameFilter(subItem.type) }}
                                              </span>

                                              {{ subItem.type&&subItem.title ? subItem.title : '选择跳转到的页面' }}
                                              <i class="zenticon zenticon-right rc-choose-link-menu--closed" />
                                            </div>
                                            <template #dropdown><el-dropdown-menu>
                                              <el-dropdown-item
                                                v-for="(v,i) in linkArray"
                                                :key="i"
                                                :command="({index,v})"
                                              >
                                                {{ v.title }}
                                              </el-dropdown-item>
                                            </el-dropdown-menu></template>
                                          </el-dropdown>

                                        </div>
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <el-icon
                              class="item-delete"
                              @click="item.subCategoryList.splice(subIndex,1)"
                            >
                              <CircleCloseFilled />
                            </el-icon>
                          </SlickItem>
                        </SlickList>
                        <!--添加一个子分类-->
                        <div
                          class="editor-card-add"
                          @click="addNewChildren(index)"
                        >
                          <div class="add-image">
                            <div class="add-image-text">
                              <el-icon>
                                <Plus />
                              </el-icon>
                              添加一个子分类
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-icon
              class="item-delete all-del"
              @click="formData.categoryList.splice(index,1)"
            >
              <CircleCloseFilled />
            </el-icon>
          </div>
        </div>
        <!--添加一个主分类-->
        <div
          style="padding: 10px;"
          class="editor-card-add"
          @click="addNewItem"
        >
          <div style="text-align: center;width: 100%;display: flex;align-items: center">
            <el-icon><Plus /></el-icon> 添加一个主分类
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
  </div>
</template>
<script setup>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort'
import ProdsSelect from '@/components/prods-select/index.vue'
import ElxImgbox from '@/components/img-box/index.vue'

const vHandle = HandleDirective

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
  categoryList: []
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
  formData.categoryList.forEach(res => {
    if (!res.title) {
      isPass = false
    }
  })
  myCheckResult((formData.categoryList.length > 0 && isPass))
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

const linkArray = [
  { type: 1, title: '商品详情页', link: '' },
  { type: 2, title: '微页面', link: '' }
]
const headerImg = '建议宽度 765*282 像素'

const typeNameFilter = (val) => {
  let str = ''
  switch (val) {
    case 1:
      str = '商品详情页'
      break
  }
  return str
}

const collapseActive = []
const inputFocus = (index) => {
  setTimeout(() => {
    if (!collapseActive.find(x => x === index)) {
      collapseActive.push(index)
    }
  }, 100)
}

const categoryListPar = {
  isSw: true, // 是否展开
  title: '',
  subCategoryList: [],
  banner: {
    title: '',
    type: '',
    link: '',
    image_url: ''
  }
}

/** 添加主分类 */
const addNewItem = () => {
  formData.categoryList.push(JSON.parse(JSON.stringify(categoryListPar)))
}

let canChooseImagesNum = 1 // 可以添加的图片数量
let currentChangeType = 1 // 当前切换的模式，1是分类2是头图
let currentIndex = 0 // 当前编辑的categoryList index
/** 添加头图 */
const addHeaderImg = (index) => {
  canChooseImagesNum = 1
  currentChangeType = 2 // 头图模式
  currentIndex = index
  elxImgboxHandle(1)
}

let subCategoryListIndex = 0 // 当前编辑的subCategoryList index
/** 子分类修改图片 */
const addItemImg = (subIndex, index) => {
  canChooseImagesNum = 1// 编辑模式只能选中一张图片
  currentChangeType = 1// 分类模式
  currentIndex = index
  subCategoryListIndex = subIndex // 当前编辑的subCategoryList index
  elxImgboxHandle(1)
}

/** 添加新的子分类 */
const addNewChildren = (index) => {
  canChooseImagesNum = 1000// 新增模式只能选中1000张图片
  currentChangeType = 1// 分类模式
  currentIndex = index
  elxImgboxHandle(2)
}

// 点击修改目标
const chooseItem = (index, type = 1, subIndex) => {
  currentIndex = index
  currentChangeType = type // 默认分类模式
  if (subIndex >= 0) {
    subCategoryListIndex = subIndex
  }
}

let currentLinkArrayIndex = 0
const dialogChooseGoods = ref(false) // 商品弹窗
/** 选择目标地址回调 */
const handleCommandOne = (obj) => {
  currentLinkArrayIndex = obj.v.type
  const no = [1, 2, 6]// 非商品，微页面，优惠券
  if (!no.find(x => x === obj.v.type)) {
    if (currentChangeType === 2) { // 头图模式
      for (const ol in obj.v) {
        setBanner({ key: ol, val: obj.v[ol] })
      }
    } else { // 分类模式
      for (const ol in obj.v) {
        setSubCategoryList({ key: ol, val: obj.v[ol] })
      }
    }
  } else {
    switch (obj.v.type) {
      case 1: // 商品弹窗
        dialogChooseGoods.value = true
        break
    }
  }
}

/**
 * 设置banner
 * attr 如果不为空 ， {key,val}
 * key, val, attr = []
 * */
const setBanner = (obj) => {
  if (obj.attr && obj.attr.length) {
    obj.attr.forEach(res => {
      formData.categoryList[currentIndex].banner[res.key] = res.val
    })
    return
  }
  formData.categoryList[currentIndex].banner[obj.key] = obj.val
}

/**
 * 设置subCategoryList
 * attr 如果不为空 ， {key,val}
 * */
const setSubCategoryList = (obj) => {
  if (obj.attr && obj.attr.length) {
    obj.attr.forEach(res => {
      formData.categoryList[currentIndex].subCategoryList[subCategoryListIndex][res.key] = res.val
    })
    return
  }
  formData.categoryList[currentIndex].subCategoryList[subCategoryListIndex][obj.key] = obj.val
}

/**
 * 设置商品、微页面、优惠券的值
 * */
const setCallbackVal = (title, link) => {
  const par = [
    {
      key: 'title',
      val: title
    },
    {
      key: 'link',
      val: link
    },
    {
      key: 'type',
      val: currentLinkArrayIndex
    }
  ]

  if (currentChangeType === 2) { // 头图模式
    setBanner({
      attr: par
    })
  } else { // 分类模式
    setSubCategoryList({
      attr: par
    })
  }
}

// 选择商品回调
const chooseGoodsFun = ($event) => {
  dialogChooseGoods.value = false
  const $goodsData = $event.data
  if ($goodsData.length) {
    setCallbackVal($goodsData[0].productName, $goodsData[0].id)
  }
}

const elxImgboxRef = ref(null)
/**
 * 选择图片
 * @param {Number} type
 * type 1 单选; 2 多选
 */
const elxImgboxHandle = (type) => {
  nextTick(() => {
    elxImgboxRef.value.init(type)
  })
}

/**
 * 选择图片回调
 * @param {String} imagePath 无前缀的图片地址字符串(多图时用,分割)
 */
const refreshPic = (imagePath) => {
  const imgsList = imagePath.split(',')
  if (imgsList.length) {
    const chooseImages = { key: 'image_url', val: addDomain(imgsList[0]) }
    if (currentChangeType === 2) { // 头图模式
      setBanner(chooseImages)
    } else {
      if (canChooseImagesNum > 1) { // 通过可以添加图片的数量来判断是否为新增模式
        imgsList.forEach(res => {
          formData.categoryList[currentIndex].subCategoryList.push({
            title: '',
            type: '',
            link: '',
            image_url: addDomain(res)
          })
        })
        return
      }
      setSubCategoryList(chooseImages)
    }
  }
}
</script>

<style lang="scss" scoped>
@use "index";
</style>
