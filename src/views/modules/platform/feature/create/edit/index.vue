<template>
  <div class="micro-create page-feature-edit">
    <decorate-navbar
      v-show="currentOperationType!=='detail'"
      :is-template="isTemplate"
      :data-form-l="dataForm"
      @handle-save="save"
      @view="view"
      @handle-save-template="handleSaveTemplate"
      @handle-click-component="handleClickComponent"
    />

    <div
      class="micro-box-content"
      :style="{backgroundColor:setOther.bgColor}"
    >
      <div class="design-page">
        <div class="design-page-content">
          <!-- 左侧所有装修组件 -->
          <div
            v-show="currentOperationType!=='detail'"
            class="all-use-components"
            :class="{'border-left': !sidebarFold}"
          >
            <!--所有可以选择的组件-->
            <allCanUseComponents
              :is-show-all-components="isShowAllComponents"
              :hide-these-components="hideTheseComponents"
              :show-these-components="showTheseComponents"
              @add-component="addComponent"
              @ret-all-can-use-components="onAllCanUseComponents"
            />
            <!--end 所有可以选择的组件-->
          </div>
          <!-- 界面预览 -->
          <div
            id="scrollbar"
            class="design-editor"
            :class="currentOperationType === 'detail' ? 'view-class' : ''"
          >
            <div
              class="design-box"
            >
              <div
                class="design-preview"
                :style="{margin: currentOperationType!=='detail' ? '30px 350px 0 0' : '0'}"
              >
                <div
                  v-if="componentLists.length"
                  class="item-list"
                >
                  <!--头部-->
                  <div
                    v-for="(item,index) in configComponents"
                    id="headBox"
                    :key="index"
                    class="preview-item"
                    @click.stop="clickComponent(index,1)"
                  >
                    <component
                      :is="componentLists.find(x=>x.type === item.type) ? componentLists.find(x=>x.type === item.type).routerPath : ''"
                      :current="index"
                      :is-show-edit="currentEditConfigComponentsShow === index&&configComponentsShow&&currentOperationType!=='detail'"
                      :index-key="item.type+'_'+index"
                      :data-field="item.dataField || {}"
                      :current-component="item"
                      :is-check-my-self="item.isCheckMySelf"
                      :is-start-check-field-rules="isStartCheckFieldRules"
                      @my-check-result="everyComponentsCheckResultFun"
                      @on-error-message-tip="onErrorMessageTip"
                      @components-value-chance="componentsValueChanceFromConfig"
                      @save="save"
                    />
                  </div>
                  <!--组价-->
                  <SlickList
                    v-model:list="currentUseComponents"
                    :use-drag-handle="true"
                    lock-axis="y"
                    :press-delay="500"
                    class="slickList-scroll"
                    @input="sortInput"
                    @sort-start="sortStart"
                    @sort-move="sortMove"
                    @sort-end="sortEnd"
                  >
                    <SlickItem
                      v-for="(item,index) in currentUseComponents"
                      :id="'previewItem_'+index"
                      :key="item.id"
                      :class="['preview-box',{isMoveIng:isMoveIng}]"
                      :index="index"
                    >
                      <div
                        class="preview-item"
                        @click.stop="clickComponent(index)"
                      >
                        <component
                          :is="componentLists.find(x=>x.type === item.type) ? componentLists.find(x=>x.type === item.type).routerPath : ''"
                          :current="index"
                          :current-use-components="currentUseComponents"
                          :is-show-edit="currentEditComponent === index&&isShowEdit&&currentOperationType!=='detail'"
                          :index-key="item.type+'_'+index"
                          :data-field="item.dataField || {}"
                          :current-component="item"
                          :is-check-my-self="item.isCheckMySelf"
                          :is-start-check-field-rules="isStartCheckFieldRules"
                          @top-fixed="topFixed"
                          @my-check-result="everyComponentsCheckResultFun"
                          @on-error-message-tip="onErrorMessageTip"
                          @components-value-chance="componentsValueChance"
                          @save="save"
                        />
                        <!--边框、删除、添加-->
                        <div
                          v-if="currentOperationType!=='detail'"
                          :style="{borderColor:setOther.viewTheme,borderStyle:'solid'}"
                          class="preview-item-border design-hide-class"
                          :class="currentEditComponent === index ? 'show':''"
                        >
                          <div
                            v-handle
                            class="drag-box"
                            :style="{cursor:setOther.dragCursor}"
                          />
                        </div>
                        <!--边框、删除、添加-->
                      </div>
                    </SlickItem>

                    <!-- 商品瀑布 start -->
                    <template v-if="goodsWaterfallComponent.length > 0">
                      <div
                        v-for="(item, index) in goodsWaterfallComponent"
                        :key="item.type"
                        class="preview-box"
                        @click.stop="clickgoodsWaterfallComponent()"
                      >
                        <div class="preview-item">
                          <component
                            :is="componentLists.find(x=>x.type === item.type) ? componentLists.find(x=>x.type === item.type).routerPath : ''"
                            :current="index"
                            :is-show-edit="goodsWEdit && isShowEdit"
                            :current-operation-type="currentOperationType"
                            :is-detail="!(currentOperationType!=='detail')"
                            :index-key="item.type+'_'+index"
                            :data-field="item.dataField || {}"
                            :current-component="item"
                            :is-check-my-self="item.isCheckMySelf"
                            :is-start-check-field-rules="isStartCheckFieldRules"
                            @top-fixed="topFixed"
                            @components-value-chance="goodsWaterfallComponentValueChance"
                            @save="save"
                          />
                          <!--边框、删除、添加-->
                          <div
                            v-if="currentOperationType!=='detail'"
                            :style="{borderColor:setOther.viewTheme,borderStyle:'solid'}"
                            class="preview-item-border design-hide-class"
                            :class="goodsWEdit ? 'show':''"
                          >
                            <div
                              v-handle
                              class="drag-box"
                              :style="{cursor:setOther.dragCursor}"
                            />
                          </div>
                          <!--边框、删除、添加-->
                        </div>
                      </div>
                    </template>
                    <!-- 商品瀑布 end -->
                  </SlickList>

                  <!--插入-->
                  <div
                    v-if="isShowEditorAllComponents"
                    class="design-editor-item append-component-box"
                  >
                    <div class="design-config-editor">
                      <allCanUseComponents
                        :hide-these-components="hideTheseComponents"
                        @add-component="addComponent"
                        @ret-all-can-use-components="onAllCanUseComponents"
                      />
                    </div>
                  </div>
                  <!--插入-->
                </div>
              </div>
            </div>
          </div>
          <!-- 组件管理 -->
          <div
            v-if="setOther.componentOperation"
            class="design-editor-item"
          >
            <div class="design-config-editor">
              <div class="design-editor-component-title">
                {{ $t('shopFeature.edit.componentManagement') }}
              </div>
              <div class="components-list-edit">
                <p
                  class="clear-current-component"
                  :style="[{color:setOther.viewTheme}]"
                >
                  <span>组件排序</span>
                  <span
                    @click="currentUseComponents = []; goodsWaterfallComponent = []"
                  >{{ $t('shopFeature.edit.removeAll') }}</span>
                </p>
                <SlickList
                  v-model:list="currentUseComponents"
                  :use-drag-handle="true"
                  axis="y"
                  helper-class="drag-class"
                  :transition-duration="0"
                  @update:list="componentsSortInput"
                >
                  <template
                    v-for="(item, index) in currentUseComponents"
                    :key="index"
                  >
                    <SlickItem
                      class="components-list-edit-item"
                      :index="index"
                    >
                      <div
                        v-handle
                        class="drag-box"
                      >
                        {{ componentLists.find(x=>x.type === item.type) ?
                          componentLists.find(x=>x.type === item.type).title : '' }} <em>{{ index }}</em>
                      </div>
                      <div class="drag-box-icon">
                        <el-icon @click="popBtn(2, index)">
                          <Delete />
                        </el-icon>
                      </div>
                    </SlickItem>
                  </template>
                </SlickList>

                <!-- 商品瀑布 start -->
                <template v-if="goodsWaterfallComponent.length > 0">
                  <div
                    v-for="(item, index) in goodsWaterfallComponent"
                    :key="item.type"
                    class="components-list-edit-item"
                  >
                    <div
                      v-handle
                      class="drag-box"
                    >
                      {{ componentLists.find(x=>x.type === item.type) ?
                        componentLists.find(x=>x.type === item.type).title : '' }}
                    </div>
                    <div class="drag-box-icon">
                      <el-icon
                        :title="$t('shopFeature.edit.removeComponent')"
                        class="el-icon-delete"
                        @click="popBtn(1, index)"
                      >
                        <Delete />
                      </el-icon>
                    </div>
                  </div>
                </template>
                <!-- 商品瀑布 end -->
                <div
                  v-if="currentUseComponents.length === 0"
                >
                  <el-empty :description="$t('shopFeature.edit.emptyTemplate')" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort'
import allCanUseComponents from './components/all-can-use-components/index.vue'
import decorateNavbar from './components/decorate-navbar/index.vue' // 顶边栏
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

/**
 * 作为组件时传入说明
 *  props 解析看下文
 *  currentConfigComponents  默认配置顶部项的组件  默认为config组件
 *  currentUseComponents 正在预览区的组件  默认 []
 * */
const vHandle = HandleDirective

const props = defineProps({
  isShowPushAdd: { // 是否显示插入的模式
    type: Boolean,
    default: true
  },
  isShowClose: { // 是否关闭的模式
    type: Boolean,
    default: true
  },
  hideTheseComponents: { // 隐藏这些组件 结构如：[{type: 'config',isHide:true}]
    type: Array,
    default: () => []
  },
  showTheseComponents: { // 显示这些组件 结构如：[{type: 'config',isHide:true}]
    type: Array,
    default: () => []
  },
  isShowAllComponents: { // 是否隐藏所有组件
    type: Boolean,
    default: true
  },
  isShowSaveBtn1: { // 是否显示 上架 按扭
    type: Boolean,
    default: true
  },
  isShowSaveBtn2: { // 是否显示 保存并继续 按扭
    type: Boolean,
    default: true
  },
  isShowSaveBtn3: { // 是否显示 更多操作 按扭
    type: Boolean,
    default: true
  },
  // 是否需要返回最后保存的值，在当前页面被用作组件的时候可使用
  isNeedReturnSaveData: {
    type: Boolean,
    default: false
  },
  /** 配置顶部项的组件 */
  currentConfigComponents: {
    type: Array,
    default: () => [{ type: 'config' }] // 配置项不能删除、排序
  },
  /** 其他的组件传过来只能使用的组件 */
  currentCanUseComponents: {
    type: Array,
    default: () => [] //
  },
  microId: { // 主要运用于其他的调用微页面组件获取详情使用，具体可参考：公告广告
    type: Number,
    default: null
  },
  microKeyWord: { // 微页面 主要运用于其他的调用微页面组件获取详情使用，具体可参考：微集合
    type: String,
    default: ''
  }
})

const emit = defineEmits(['currentUseComponentsChange'])

const route = useRoute()
const router = useRouter()

const commonStore = useCommonStore()
const sidebarFold = computed(() => {
  return commonStore.sidebarFold
})

watch(() => props.microId, (val) => {
  if (val) {
    getInfo()
  }
}, { deep: true })

const currentUseComponents = ref([])
// 通过微页面关键字获取详情
watch(() => props.microKeyWord, (val) => {
  if (val) {
    currentUseComponents.value = []
    getInfo()
  }
}, { deep: true })

watch(() => currentUseComponents.value, (val) => {
  nextTick(() => {
    emit('currentUseComponentsChange', val)
  })
}, { deep: true })

const isTemplate = ref('0') // 是否为模板编辑
let pageType = ''
let renovationId = route.query.renovationId || null
let templateId = route.query.templateId || null
/** 配置顶部项的组件 */
const configComponents = ref([{ type: 'config' }])
onMounted(() => {
  isTemplate.value = route.query.template
  const renovationIdPar = route.query.renovationId
  const templateIdPar = route.query.templateId
  pageType = route.query.type
  handleInit()
  if (pageType === 'edit') {
    renovationId = renovationIdPar
    templateId = templateIdPar
    if (isTemplate.value === '0') {
      getInfo()
    } else {
      getTemplateDetail()
    }
    localStorage.removeItem('cloudViewContent')
  } else if (pageType === 'add' && templateIdPar) {
    templateId = templateIdPar
    getTemplateDetail()
    localStorage.removeItem('cloudViewContent')
  } else {
    configComponents.value = JSON.parse(JSON.stringify(props.currentConfigComponents))
  }
  if (pageType === 'detail' && renovationIdPar) {
    getInfo()
  } else if (pageType === 'detail' && localStorage.getItem('cloudViewContent')) {
    viewContent(JSON.parse(localStorage.getItem('cloudViewContent')))
  }
  nextTick(() => {
    commonStore.updateSidebarFold(true)
  })
})

onActivated(() => {
  if (route.query.renovationId && route.query.renovationId !== renovationId) {
    renovationId = route.query.renovationId
    getInfo()
  }
})

onDeactivated(() => {
  configComponents.value = []
  configComponents.value = JSON.parse(JSON.stringify(props.currentConfigComponents))
})

const currentOperationType = ref('') // 当前操作类型
const handleInit = () => {
  if (route.query.type === 'detail') {
    currentOperationType.value = 'detail'
  }
}

// 所有每次校验的结果
let allCheckResult = []
const isStartCheckFieldRules = ref(false) // 是否开始校验所有组件的规则
let isView = false // 是否预览
// 预览
const view = () => {
  allCheckResult = []
  isStartCheckFieldRules.value = !isStartCheckFieldRules.value // 开始校验
  isView = true
}

const goodsWaterfallComponent = ref([]) // 底部瀑布组件
const toView = () => {
  const $data = configComponents.value.concat(currentUseComponents.value, goodsWaterfallComponent.value)
  const par = {
    content: JSON.stringify($data),
    name: $data[0].dataField.title
  }
  localStorage.setItem('cloudViewContent', JSON.stringify(par))
  const newPage = router.resolve({
    path: 'feature-create-edit',
    query: {
      type: 'detail'
    }
  })
  isView = false
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}

const isShowEditorAllComponents = ref(false) // 是否显示插入组件区域，永远与isShowEdit相反
// 设置
const setOther = reactive({
  viewTheme: '#155BD4',
  bgColor: '#fff', // 背景
  dragCursor: 'all-scroll', // 显示的图标 all-scroll
  componentOperation: false// 是否操作组件
})
// 组件管理
const handleClickComponent = () => {
  setOther.componentOperation = !setOther.componentOperation
  isShowEditorAllComponents.value = false
}

/** 关闭组件管理 */
const componentOperation = () => {
  setOther.componentOperation = false
}

const componentLists = ref([]) // 所有可用的组件
/**
 * 获取所有可用的组件
 * */
const onAllCanUseComponents = ($list) => {
  if ($list) {
    componentLists.value = $list
  } else {
    ElMessage.success($t('shopFeature.edit.noneUseableCom'))
  }
}

let scrollTopHeight = 0
/** 正在编辑的组件 */
const currentEditComponent = ref(0)
const goodsWEdit = ref(false) // 是否修改瀑布组件
const appendPosition = reactive({
  index: '',
  position: 'bottom', // 默认底部
  theRefs: null
}) // 插入组件的位置
/**
 *  添加组件
 * */
const addComponent = (item) => {
  if (item.type === 'goodsWaterfall' && goodsWaterfallComponent.value.length === 1) {
    return ElMessage.warning('瀑布流只能添加一个！')
  }
  const goodsWaterfallComponentPar = goodsWaterfallComponent.value
  const scrollBox = document.getElementById('scrollbar')
  scrollTopHeight = scrollBox.scrollTop
  const allCurrentUseComponents = currentUseComponents.value
  const $par = { type: item.type, id: Math.floor(Math.random() * 10000000000) }
  const $appendPositionIndex = appendPosition.index
  if (item.type !== 'goodsWaterfall') {
    if ($appendPositionIndex !== '') { // 插入模式
      const $in = appendPosition.position === 'top' ? $appendPositionIndex : $appendPositionIndex + 1
      allCurrentUseComponents.splice($in, 0, item)
      currentEditComponent.value = $in
    } else {
      allCurrentUseComponents.push($par)
      currentEditComponent.value = allCurrentUseComponents.length - 1
    }
    goodsWEdit.value = false
  } else {
    currentEditComponent.value = -1
    goodsWEdit.value = true
    goodsWaterfallComponentPar.push($par)
  }
  setTimeout(() => {
    // 重置插入位置为空
    currentUseComponents.value = allCurrentUseComponents
    goodsWaterfallComponent.value = goodsWaterfallComponentPar // 瀑布组件
    appendPosition.index = ''
    reSetIsShowEdit()
    scrollBox.scrollTop = scrollTopHeight
  }, 5)
}

const configComponentsShow = ref(true)
const isShowEdit = ref(false) // 是否显示组件的编辑区
/**
 * 重置isShowEdit
 * */
const reSetIsShowEdit = ($is = true, isReSetOperation = true) => {
  configComponentsShow.value = false
  isShowEdit.value = $is
  isShowEditorAllComponents.value = !isShowEdit.value
  if (isReSetOperation) {
    componentOperation()
  }
}

/** 正在编辑的组件 */
const currentEditConfigComponentsShow = ref(0)
/**
 * 点击某个组件
 * $isConfigComponents =  1 时为顶部
 * */
const clickComponent = ($index, $isConfigComponents = 0) => {
  goodsWEdit.value = false
  if ($isConfigComponents === 1) {
    currentEditConfigComponentsShow.value = $index
    configComponentsShow.value = true
    isShowEdit.value = false
    isShowEditorAllComponents.value = false
  } else {
    currentEditComponent.value = $index
    reSetIsShowEdit()
  }
  componentOperation()
}

// 点击商品瀑布组件
const clickgoodsWaterfallComponent = () => {
  currentEditComponent.value = -1
  goodsWEdit.value = true
  reSetIsShowEdit()
  componentOperation()
}

/**
 * 移除某个组件
 * */
const popBtn = ($type, index) => {
  if ($type === 1) {
    goodsWaterfallComponent.value = []
  }
  if ($type === 2) { // 确定
    const $currentUseComponents = currentUseComponents.value
    $currentUseComponents.splice(index, 1)
    currentUseComponents.value = []
    setTimeout(() => {
      currentUseComponents.value = $currentUseComponents
    }, 5)
  }
  isShowEditorAllComponents.value = false
}

// 监听某个组件的变化
const componentsValueChanceFromConfig = ($val) => {
  if ($val) {
    configComponents.value[$val.current].dataField = $val.dataField
  }
}

const componentsValueChance = ($val) => {
  if ($val) {
    currentUseComponents.value[$val.current].dataField = $val.dataField
  }
}
const goodsWaterfallComponentValueChance = ($val) => {
  if ($val) {
    goodsWaterfallComponent.value[$val.current].dataField = $val.dataField
  }
}

const isMoveIng = ref(false) // 是否正在移动
let elementArr = []
// 拖拽
const sortStart = () => {
  // 开始拖拽时隐藏编辑区
  elementArr = document.getElementsByClassName('design-hide-class')
  for (let i = 0; i < elementArr.length; i++) {
    // 隐藏样式
    elementArr[i].style.visibility = 'hidden'
  }
  setOther.dragCursor = 'all-scroll'
  isMoveIng.value = true
}

// 拖动过程，改变鼠标样式
const sortMove = () => {}

// 结束拖拽
const sortEnd = (val) => {
  // 结束拖拽时显示编辑区
  for (let i = 0; i < elementArr.length; i++) {
    // 显示样式
    elementArr[i].style.visibility = 'visible'
  }
  currentEditComponent.value = val.newIndex
  isMoveIng.value = false
  isShowEdit.value = true
}

let isDrag = false // 是否拖动了位置
// 拖拽之后的结果
const sortInput = (val, isReSet = true) => {
  if (isDrag) {
    for (let i = 0; i < val.length; i++) {
      if (val[i].type === 'goodsWaterfall') {
        if (val[val.length - 1].type !== 'goodsWaterfall') {
          ElMessage.warning('瀑布流组件只能显示在底部！')
        }
      }
    }
    // 始终保证招牌在顶部
    const arr = []
    const goodsWaterfallComponentPar = []
    val.forEach(item => {
      if (item.type === 'goodsWaterfall') {
        goodsWaterfallComponentPar.push(item)
      } else {
        arr.push(item)
      }
    })
    setTimeout(() => {
      currentUseComponents.value = arr
    }, 5)
    appendPosition.index = ''
  }
  isDrag = false
  configComponentsShow.value = false
  reSetIsShowEdit(true, isReSet)
}

/** 右边组件的拖拽 */
const componentsSortInput = (val) => {
  isDrag = true
  sortInput(val, false)
}

let savePageType = '0' // 保存类型
let saveType = 2 // 保存的类型=> 2保存 1上架 3更多操作
let dontShowMessage = false
/**
 * 保存事件 先校验
 * @param {Number/String} $type 保存类型: 1保存后返回列表页;  2保存后留在编辑页
 * @param {Boolean} dontShowMessagePar 是否显示 "保存成功" 消息提示
 * */
const save = ($type, dontShowMessagePar) => {
  savePageType = '0'
  saveType = $type
  dontShowMessage = dontShowMessagePar
  allCheckResult = []
  isStartCheckFieldRules.value = !isStartCheckFieldRules.value // 开始校验
}

const dataForm = ref({
  name: '',
  remark: '',
  imgUrl: ''
}) // 模板信息
/**
 * 保存模板 先校验
 * @param {Boolean} dataFormPar 模板信息
 * */
const handleSaveTemplate = (dataFormPar) => {
  savePageType = '1'
  dataForm.value = dataFormPar
  allCheckResult = []
  isStartCheckFieldRules.value = !isStartCheckFieldRules.value // 开始校验
}

const isCheckMySelf = ref(false) // 在规则判断不通过改变通知子组件
/** 所有的正在编辑的校验结果 */
const everyComponentsCheckResultFun = (ev) => {
  allCheckResult.push(ev.data)
  /** 统计当前所有正在使用组件的数量 */
  const currentUserAllComponentsList = currentUseComponents.value.length + configComponents.value.length
  if (allCheckResult.length === currentUserAllComponentsList) {
    const $allCheckResult = allCheckResult
    for (let i = 0; i < $allCheckResult.length; i++) {
      const cur = $allCheckResult[i]
      if (!cur.isPass) {
        let $type = 0
        if (cur.isHeader) { // 头部的验证规则不通过
          configComponents.value[cur.current].isCheckMySelf = !configComponents.value[cur.current].isCheckMySelf
          $type = 1
        } else { // 底部的不通过
          currentUseComponents.value[cur.current].isCheckMySelf = !currentUseComponents.value[cur.current].isCheckMySelf
        }
        clickComponent(cur.current, $type)
        isStartCheckFieldRules.value = false
        // 开始通知子组件开始提示用户 ，弹窗等。。。
        isCheckMySelf.value = !isCheckMySelf.value
        break
      }
      if (i === $allCheckResult.length - 1) { // 验证完成，可以保存了
        if (isView) {
          toView()
        } else {
          savePush()
        }
      }
    }
  }
}

// 验证完毕之后发布push
const savePush = () => {
  const $parameter = configComponents.value.concat(currentUseComponents.value, goodsWaterfallComponent.value)
  $parameter.forEach(re => { // 移除isCheckMySelf字段，不能上传数据库
    delete re.isCheckMySelf
  })
  if (savePageType === '0') {
    saveData($parameter)
  } else {
    saveTemplateData($parameter, saveType)
  }
}

let isSubmit = false
/** 保存到数据库 */
const saveData = async ($data) => {
  if (isSubmit) {
    return
  }
  isSubmit = true
  const par = {
    content: JSON.stringify($data),
    name: $data[0].dataField.title || $t('shopFeature.header.microTitle')
  }
  if (renovationId) {
    par.renovationId = renovationId
  }
  let url
  let method
  if (renovationId) {
    url = '/mall4cloud_admin/mp/shop_renovation/update_h5'
    method = 'put'
  } else {
    url = '/mall4cloud_admin/mp/shop_renovation/save_h5'
    method = 'post'
  }
  request({
    url,
    method,
    data: par
  }).then((data) => {
    if (!renovationId) {
      renovationId = data
      router.replace({
        path: 'feature-create-edit',
        query: {
          renovationId,
          template: '0',
          type: 'edit'
        }
      })
    }
    if (!dontShowMessage) {
      ElMessage({
        message: $t('shopFeature.edit.saveSuccess'),
        type: 'success',
        duration: 1500
      })
    } else {
      dontShowMessage = false
    }
  }).finally(() => {
    isSubmit = false
  })
}

/** 保存模板到数据库 */
const saveTemplateData = async ($data) => {
  if (isSubmit) {
    return
  }
  isSubmit = true
  const par = {
    content: JSON.stringify($data),
    remark: dataForm.value.remark,
    image: dataForm.value.imgUrl,
    name: dataForm.value.name, // 模板名称
    type: 2 // 装修类型
  }
  if (templateId) {
    par.templateId = templateId
  }
  let url
  let method
  if (templateId) {
    url = '/mall4cloud_admin/mp/shop_template/update_h5'
    method = 'put'
  } else {
    url = '/mall4cloud_admin/mp/shop_template/save_h5'
    method = 'post'
  }
  request({
    url,
    method,
    data: par
  }).then((data) => {
    if (!templateId) {
      templateId = data
    }
    if (!dontShowMessage) {
      ElMessage({
        message: $t('shopFeature.edit.saveSuccess'),
        type: 'success',
        duration: 1500
      })
    } else {
      dontShowMessage = false
    }
  }).finally(() => {
    isSubmit = false
  })
}

const viewContent = async (data) => {
  configComponents.value = []
  const par = {}
  if (props.microKeyWord) {
    par.keyword = props.microKeyWord
  }
  if (renovationId) {
    par.renovationId = renovationId
  }
  let detail = {
    keyword: 'other',
    pageData: data.content
  }
  if (props.microKeyWord === 'productCatalog') {
    detail = {
      keyword: 'productCatalog',
      pageData: data.content
    }
  }
  let $data = JSON.parse(detail.pageData)
  $data = await matchproducts($data)
  if ($data.length) {
    configComponents.value = []
    $data.forEach(re => {
      if (re.type.indexOf('config') !== -1) {
        configComponents.value.push(re)
      } else {
        currentUseComponents.value.push(re)
      }
    })
  }
}

/**
 * 获取详情
 */
const getInfo = () => {
  request({
    url: '/mall4cloud_admin/mp/shop_renovation/get_h5',
    params: {
      renovationId
    },
    method: 'GET'
  }).then(async (data) => { //
    configComponents.value = []
    const par = {}
    if (props.microKeyWord) {
      par.keyword = props.microKeyWord
    }
    if (renovationId) {
      par.renovationId = renovationId
    }
    let detail = {
      keyword: 'other',
      pageData: data.content
    }
    if (props.microKeyWord === 'productCatalog') {
      detail = {
        keyword: 'productCatalog',
        pageData: data.content
      }
    }
    let $data = JSON.parse(detail.pageData)
    $data = await matchproducts($data)
    if ($data.length) {
      configComponents.value = []
      $data.forEach(re => {
        re.id = Math.floor(Math.random() * 10000000000)
        if (re.type.indexOf('config') !== -1) {
          configComponents.value.push(re)
        } else if (re.type.indexOf('goodsWaterfall') !== -1) {
          goodsWaterfallComponent.value.push(re)
        } else {
          currentUseComponents.value.push(re)
        }
      })
    }
  })
}

// 获取模板详情
const getTemplateDetail = () => {
  request({
    url: '/mall4cloud_admin/mp/shop_template/get_h5',
    params: {
      templateId
    },
    method: 'GET'
  }).then(async (data) => {
    configComponents.value = []
    if (pageType === 'edit') {
      dataForm.value = {
        name: data.name || '',
        remark: data.remark || '',
        imgUrl: data.image || ''
      }
    }
    if (pageType === 'add' && isTemplate.value === '0') {
      templateId = null
    }
    const par = {}
    if (props.microKeyWord) {
      par.keyword = props.microKeyWord
    }
    if (templateId) {
      par.templateId = templateId
    }
    let detail = {
      keyword: 'other',
      pageData: data.content
    }
    if (props.microKeyWord === 'productCatalog') {
      detail = {
        keyword: 'productCatalog',
        pageData: data.content
      }
    }
    let $data = JSON.parse(detail.pageData)
    $data = await matchproducts($data)
    if ($data.length) {
      configComponents.value = []
      $data.forEach(re => {
        re.id = Math.floor(Math.random() * 10000000000)
        if (re.type.indexOf('config') !== -1) {
          configComponents.value.push(re)
        } else if (re.type.indexOf('goodsWaterfall') !== -1) {
          goodsWaterfallComponent.value.push(re)
        } else {
          currentUseComponents.value.push(re)
        }
      })
    }
  })
}

// 匹配商品
const matchproducts = async (arr) => {
  const res = await searchGoodsMessage(arr)
  res.forEach(item => {
    if (item.spuActivity) {
      if (item.spuActivity.groupActivity) {
        item.activityPrice = item.spuActivity.groupActivity.price
      }
      if (item.spuActivity.sekillActivitySpuVO) {
        item.activityPrice = item.spuActivity.sekillActivitySpuVO.seckillPrice
      }
    }
  })
  arr.forEach(item => {
    if (item.type === 'goods') { // 商品列表
      const goodsParams = {
        prodName: 'spuName',
        status: 'spuStatus',
        price: 'priceFee',
        pic: 'mainImgUrl',
        brief: 'sellingPoint'
      }
      item.dataField.goods = handleScreenGoods(item.dataField.goods, res, 'prodId', goodsParams)
    } else if (item.type === 'promotionalActivities') { // 促销活动
      const promoParams = {
        prodName: 'spuName',
        prodType: 'spuType',
        status: 'spuStatus',
        groupNumber: 'groupNumber',
        price: 'activityPrice',
        pic: 'mainImgUrl',
        brief: 'sellingPoint',
        oriPrice: 'priceFee',
        activityPrice: 'activityPrice'
      }
      item.dataField.prodIds = handleScreenGoods(item.dataField.prodIds, res, 'prodId', promoParams)
    } else if (item.type === 'goodsModule1') { // 商品模块1
      item.dataField.leftConfig.goodsList = handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
      item.dataField.rightConfig.goodsList = handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
    } else if (item.type === 'goodsModule3' || item.type === 'goodsModule4' || item.type === 'goodsModule5') { // 商品模块3 4 5
      item.dataField.goodsList = handleScreenGoods(item.dataField.goodsList, res, 'id')
    }
  })
  return arr
}

// 查询商品信息
const searchGoodsMessage = (arr) => {
  let goodsArr = []
  arr.forEach(item => {
    if (item.type === 'goods') { // 商品信息
      item.dataField.goods.forEach(v => {
        goodsArr.push(v.prodId)
      })
    } else if (item.type === 'promotionalActivities') { // 促销和活动
      item.dataField.prodIds.forEach(v => {
        goodsArr.push(v.prodId)
      })
    } else if (item.type === 'goodsModule1') { // 商品模块1
      item.dataField.leftConfig.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
      item.dataField.rightConfig.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goodsModule3') { // 商品模块3
      item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goodsModule4') { // 商品模块4
      item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goodsModule5') { // 商品模块5
      item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    }
  })
  goodsArr = Array.from(new Set(goodsArr))
  return new Promise((resolve) => {
    request({
      url: '/mall4cloud_search/p/search/renovation_page',
      method: 'get',
      params: {
        spuIds: goodsArr,
        pageNum: 1,
        pageSize: goodsArr.length,
        getDelete: 1
      }
    }).then((data) => {
      if (data.list) {
        data.list[0].spus.forEach(item => {
          if (item.spuActivity && item.spuActivity.groupActivity) {
            item.groupNumber = item.spuActivity.groupActivity.groupNumber
          }
        })
        resolve(data.list[0].spus)
      } else {
        resolve([])
      }
    })
  })
}

// 筛选商品回显 currentArr: 表示当前装修的商品，backReturnArr: 表示根据现有id查询后端返回的商品
const handleScreenGoods = (currentArr, backReturnArr, type, otherParams) => {
  let params
  if (otherParams) {
    params = {
      ...otherParams
    }
  } else {
    params = {
      // 商品名称
      prodType: 'spuType', // 商品类型
      status: 'spuStatus', // 商品状态
      price: 'priceFee', // 商品价格
      imgs: 'mainImgUrl', // 商品图片
      orignPrice: 'marketPriceFee', // 商品原价
      description: 'sellingPoint' // 商品描述
    }
  }
  const arr = []
  for (let i = 0; i < currentArr.length; i++) {
    for (let j = 0; j < backReturnArr.length; j++) {
      if (currentArr[i][type] === backReturnArr[j].spuId) {
        for (const key in params) {
          currentArr[i][key] = backReturnArr[j][params[key]]
        }
        if (currentArr[i].spuType) currentArr[i].spuType = backReturnArr[j].spuType
        arr.push(currentArr[i])
      }
    }
  }
  return arr
}

const topFixed = (current) => {
  currentUseComponents.value.unshift(currentUseComponents.value[current])
  currentUseComponents.value.splice(current + 1, 1)
  currentEditComponent.value = 0
}

let errorMessageTipList = []
/**
 * 获取所有组件的错误提示，集中处理
 * 利用防抖函数，每次只展示一条报错信息
 */
const onErrorMessageTip = Debounce((errorTip) => {
  errorMessageTipList.push(errorTip)
  if (errorMessageTipList.length > 0) {
    for (let i = 0; i < 1; i++) {
      ElMessage.error(errorMessageTipList[0])
    }
    errorMessageTipList = []
  }
}, 1000)

</script>

<style lang="scss" scoped>
@use "index";
</style>
