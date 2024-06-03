<template>
  <div class="micro-goodsThree-box component-goods-module-three">
    <!-- 预览控制区 start -->
    <div class="design-preview-controller">
      <module-component :config="formData" />
    </div>
    <!-- 预览控制区 end -->
    <!-- 编辑工作区 start -->
    <div
      v-if="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          <div style="flex: 1;">
            商品模块3
            {{ currentComponent.customRemark }}
          </div>
          <custom-remark-edit-popover
            :index="currentUseComponents.findIndex(item => item.id === currentComponent.id)"
            :current-edit-component="currentEditComponent"
            @set-current-component="setCurrentComponent"
            @save-edit="saveCustomRemark"
          />
        </div>
        <div class="config-item">
          <div class="title">
            自定义标题
          </div>
          <div class="bottom-config">
            <el-input
              v-model="formData.mainTitle"
              maxlength="8"
            />
          </div>
        </div>
        <div class="config-item">
          <div class="title">
            添加商品
          </div>
          <div class="bottom-config">
            <select-goods-component
              :goods-list="formData.goodsList"
              @handle-add-click="handleAddClick"
              @handle-remove="handleRemove"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑工作区 end -->
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="[1]"
      :is-mulilt="true"
      :device-type="'mobile'"
      :echo-data-list="echoDataList"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import selectGoodsComponent from '../../../../../decorate/create/common-component/select-goods-component/index.vue'
import moduleComponent from './module.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue'
import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'

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
  },
  currentUseComponents: {
    type: Array,
    default: () => {}
  }
})

const emit = defineEmits(['myCheckResult', 'componentsValueChance', 'onErrorMessageTip'])

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
}, { deep: true })

const formData = reactive({
  mainTitle: '热卖推荐', // 自定义文字
  goodsList: []
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
  let isPass
  let errMessage
  if (formData.mainTitle === '') {
    isPass = false
    errMessage = '商品模块3的自定义标题不能为空'
  } else if (formData.goodsList.length === 0) {
    isPass = false
    errMessage = '商品模块3的商品不能为空'
  } else {
    isPass = true
    errMessage = ''
  }
  if (isPass) {
    myCheckResult(isPass)
  } else {
    emit('onErrorMessageTip', errMessage)
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

const dialogVisible = ref(false) // 商品弹窗
const echoDataList = ref([]) // 回显商品数据
// 选择商品
const handleAddClick = () => {
  dialogVisible.value = true
  echoDataList.value = []
  formData.goodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 删除商品
const handleRemove = (index) => {
  formData.goodsList.splice(index, 1)
}
// 弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的是商品
    formData.goodsList = []
    value.goodsItem.forEach(item => {
      formData.goodsList.push({
        id: item.prodId || item.spuId, // 商品id
        name: item.prodName || item.spuName, // 商品名称
        prodType: item.prodType || item.spuType, // 商品类型
        price: item.price || item.priceFee, // 商品价格
        status: item.status || item.spuStatus, // 商品状态
        imgs: item.pic || item.mainImgUrl, // 商品图片
        orignPrice: item.oriPrice || item.marketPriceFee, // 商品原价
        description: item.brief || item.sellingPoint // 商品描述
      })
    })
  }
  dialogVisible.value = false
}

// 自定义标签
const currentEditComponent = ref({})
const setCurrentComponent = (index) => {
  currentEditComponent.value = props.currentUseComponents[index]
}
const saveCustomRemark = (remark) => {
  currentEditComponent.value.customRemark = remark
}

</script>
<style lang="scss" scoped>
@use "index";
</style>
