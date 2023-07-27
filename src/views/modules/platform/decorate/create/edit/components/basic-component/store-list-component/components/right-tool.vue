<template>
  <div class="store-config-content">
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeList.showSubTitle`) }}
      </div>
      <div class="right-select">
        <el-radio-group v-model="storeConfigForm.showSubTitle">
          <el-radio :label="0">
            {{ $t(`pcdecorate.storeList.show`) }}
          </el-radio>
          <el-radio :label="1">
            {{ $t(`pcdecorate.storeList.hide`) }}
          </el-radio>
        </el-radio-group>
      </div>
      <el-input
        v-show="storeConfigForm.showSubTitle===0"
        v-model.trim="storeConfigForm.subTitle"
        class="subtitle-input"
        maxlength="9"
      />
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeList.mainTileColor`) }}
      </div>
      <pick-color-component
        :define-color="storeConfigForm.mainTextColor"
        @handle-change-color="handleMainTitleColor"
      />
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeList.subTitleColor`) }}
      </div>
      <pick-color-component
        :define-color="storeConfigForm.subTextColor"
        :reset-color="'rgba(153, 153, 153, 1)'"
        @handle-change-color="handleSubTitleColor"
      />
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeList.titleBgColor`) }}
      </div>
      <pick-color-component
        :define-color="storeConfigForm.bgColor"
        :reset-color="'rgba(244, 244, 244, 1)'"
        @handle-change-color="handleBgColor"
      />
    </div>
    <div class="config-items">
      <div class="items-content slider-content">
        <div class="title">
          {{ $t(`pcdecorate.storeList.titleSize`) }}
        </div>
        <div class="right-content">
          <el-slider
            v-model="storeConfigForm.mainFontSize"
            :min="12"
            :max="40"
            show-input
            @change="mainChange"
          />
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="items-content slider-content">
        <div class="title">
          {{ $t(`pcdecorate.storeList.subTitleSize`) }}
        </div>
        <div class="right-content">
          <el-slider
            v-model="storeConfigForm.subFontSize"
            :min="12"
            :max="40"
            show-input
            @change="subChange"
          />
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="items-content slider-content">
        <div class="title">
          {{ $t(`pcdecorate.storeList.marginTop`) }}
        </div>
        <div class="right-content">
          <el-slider
            v-model="storeConfigForm.marginTop"
            :min="0"
            :max="100"
            show-input
            @change="topChange"
          />
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="items-content slider-content">
        <div class="title">
          {{ $t(`pcdecorate.storeList.marginBottom`) }}
        </div>
        <div class="right-content">
          <el-slider
            v-model="storeConfigForm.marginBottom"
            :min="0"
            :max="100"
            show-input
            @change="bottomChange"
          />
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeList.addStore`) }}
      </div>
      <!-- 选择店铺 start -->
      <select-goods-component
        :goods-list="storeConfigForm.storeList"
        @handle-add-click="handleAddClick"
        @handle-remove="handleRemove"
      />
      <!-- 选择店铺 end -->
    </div>
    <!-- 商品 | 页面 | 店铺 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="[3]"
      :is-mulilt="true"
      :echo-data-list="echoDataList"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 店铺 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import selectGoodsComponent from '../../../../../common-component/select-goods-component/index.vue' // 选择商品组件
import pickColorComponent from '../../../../../common-component/pick-color/index.vue' // 颜色选择器
import { bigNumberTransform } from '@/utils/index.js'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品

const props = defineProps({
  currentRef: { // 当前组件的ref
    type: String,
    default: () => ''
  },
  currentItem: { // 点击当前组件的显示配置信息
    type: Object,
    default: () => {}
  },
  editItem: { // 当前组件的配置信息
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['handleUpdateMessage'])

const storeConfigForm = ref({
  showSubTitle: 0, // 是否显示副标题
  subTitle: '', // 副标题文字
  mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
  subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
  bgColor: 'rgba(244, 244, 244, 1)', // 标题的背景颜色
  mainFontSize: 24, // 主标题文字大小
  subFontSize: 12, // 副标题文字大小
  marginTop: 18, // 上边距
  marginBottom: 18, // 下边距
  storeList: [] // 店铺信息
})
watch(() => storeConfigForm.value, (newVal) => {
  const obj = {
    type: 'store_list',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, {
  deep: true
})
watch(() => props.currentItem, (newVal) => { // 监听组件回显
  if (newVal.currentConfigType === 'store_list') {
    if (JSON.stringify(newVal.config) !== '{}') {
      storeConfigForm.value = { ...newVal.config }
    } else {
      init()
    }
  }
})

const init = () => {
  storeConfigForm.value = {
    showSubTitle: 0, // 是否显示副标题
    subTitle: '口碑好店，无限回购', // 副标题文字
    mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
    subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
    bgColor: 'rgba(244, 244, 244, 1)', // 标题的背景颜色
    mainFontSize: 24, // 主标题文字大小
    subFontSize: 12, // 副标题文字大小
    marginTop: 18, // 上边距
    marginBottom: 18, // 下边距
    storeList: [] // 店铺信息
  }
}
// 标题的文字颜色
const handleMainTitleColor = (color) => {
  storeConfigForm.value.mainTextColor = color
}
// 副标题文字颜色
const handleSubTitleColor = (color) => {
  storeConfigForm.value.subTextColor = color
}
// 标题背景色
const handleBgColor = (color) => {
  storeConfigForm.value.bgColor = color
}
// 添加店铺
const echoDataList = ref([]) // 回显店铺数据
const dialogVisible = ref(false) // 弹窗是否显示
const handleAddClick = () => {
  dialogVisible.value = true
  echoDataList.value = [] // 店铺数据
  storeConfigForm.value.storeList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 删除店铺
const handleRemove = (index) => {
  storeConfigForm.value.storeList.splice(index, 1)
}
// 弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '3') { // 当前选择的是店铺
    storeConfigForm.value.storeList = []
    value.storeItem.forEach(item => {
      storeConfigForm.value.storeList.push({
        shopId: item.shopId, // 店铺id
        shopLogo: item.shopLogo, // 店铺logo(用于回显)
        imgs: item.shopLogo, // 店铺logo
        shopName: item.shopName, // 店铺名称
        shopStatus: item.shopStatus, // 店铺状态
        type: item.type, // 店铺类型
        fansCount: item.fansCount, // 关注人数
        shopFocusNumber: item.shopFocusNumber || (item.collectionNum === null ? 0 : bigNumberTransform(item.collectionNum)) // 店铺关注人数
      })
    })
  }
  dialogVisible.value = false
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) === '{}') {
    status = false
    message = $t('pcdecorate.storeList.warning1')
  } else if (props.editItem.showSubTitle === 0 && props.editItem.subTitle === '') {
    status = false
    message = $t('pcdecorate.storeList.warning2')
  } else if (props.editItem.storeList.length === 0) {
    status = false
    message = $t('pcdecorate.storeList.warning3')
  } else {
    status = true
  }
  return {
    status,
    message
  }
}

// 主标题防止小数
const mainChange = (val) => {
  return (storeConfigForm.value.mainFontSize = Math.floor(val))
}
// 副标题防止小数
const subChange = (val) => {
  return (storeConfigForm.value.subFontSize = Math.floor(val))
}
// 上边距防止小数
const topChange = (val) => {
  return (storeConfigForm.value.marginTop = Math.floor(val))
}
// 下边距防止小数
const bottomChange = (val) => {
  return (storeConfigForm.value.marginBottom = Math.floor(val))
}
defineExpose({ handleValidate })
</script>
<style lang="scss" scoped>
.store-config-content {
  .subtitle-input {
        :deep(.el-input__inner) {
            height: 28px;
        }
    }
  .config-items {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    .title {
      display: flex;
      margin-bottom: 20px;
      align-items: center;
      position: relative;
      margin-left: 0 !important;
    }
    .title::before {
      width: 0 !important;
    }
    .right-select {
      margin: 0 0 20px 0;
      width: 100%;
    }
    .items-content {
      display: flex;
      align-items: center;
      overflow: hidden;
      .title {
        width: 70px;
        height: 100%;
        display: flex;
        align-items: center;
        padding-top: 15px;
      }
      .right-content {
        width: 78%;
        padding-bottom: 3px;
      }
    }
  }
}
</style>
