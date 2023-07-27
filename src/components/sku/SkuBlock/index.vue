<template>
  <div class="ease-sku">
    <sku-group
      v-for="(item, index) in data"
      :key="index"
      :index="index"
      :sku="item"
      :sku-tree="skuTreeData"
      :on-change-has-img="onChangeHasImg"
      :on-sku-change="rebuildSku"
      :on-sku-remove="handleSkuRemove"
    />
    <!-- 添加属性 -->
    <div
      v-if="data.length < maxSize && view"
      class="part-form-item"
    >
      <div class="part-form-item">
        <div
          class="add-sku"
          @click="addSku"
        >
          添加商品规格
        </div>
        <div class="part-tips">
          (最多可添加100组)
        </div>
        <div
          v-if="!hasSkuValue"
          class="warning"
        >
          请先选择已添加规格的规格值！
        </div>
        <div
          v-if="!hasSkuId"
          class="warning"
        >
          请先选择已添加规格！
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import skuGroup from '@/components/sku/SkuGroup/index.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  maxSize: {
    type: Number,
    default: 2
  },
  hasSkuImg: {
    type: Boolean,
    default: false
  },
  showAddSkuImage: {
    type: Boolean,
    default: true
  },
  salesAttrs: {
    type: Array,
    default () {
      return []
    }
  },
  saveSalesAttrs: {
    type: Array,
    default () {
      return []
    }
  },
  action: {
    type: String,
    default: ''
  },
  headers: {
    type: Object,
    default () {
      return {}
    }
  },
  accept: {
    type: String,
    default: ''
  },
  uploadName: {
    type: String,
    default: 'resource'
  },
  // 可选规格列表
  skuTree: {
    type: Array,
    default () {
      return []
    }
  },
  sku: {
    type: Object,
    default () {
      return {}
    }
  },
  // 自定义sku的id key
  optionValue: {
    type: String,
    default: 'id'
  },
  // 自定义sku的text key
  optionText: {
    type: String,
    default: 'text'
  },
  // 异步获取规格列表
  onFetchGroup: {
    type: Function,
    default: () => {
      return Promise.resolve(res => res)
    }
  },
  // 异步获取规格可选值
  onFetchSku: {
    type: Function,
    default: () => {
      return Promise.resolve(res => res)
    }
  },
  // 创建新的规格名
  onCreateGroup: {
    type: Function,
    default: () => {
      return Promise.resolve(res => res)
    }
  },
  // 创建新的规格值
  onCreateSku: {
    type: Function,
    default: () => {
      return Promise.resolve(res => res)
    }
  },
  // 图片预览
  onPreviewImg: {
    type: Function,
    default: () => {
      return Promise.resolve(res => res)
    }
  },
  // 涂理图片添加/更改/删除
  onHandleSkuValueImg: {
    type: Function,
    default: () => {
      return Promise.resolve(res => res)
    }
  },
  // 切换选择图片状态
  switchSkuImageStatus: {
    type: Function,
    default: () => {
      return Promise.resolve(res => res)
    }
  },
  hasSkuVal: {
    type: Boolean,
    default: null
  }
})

const emit = defineEmits(['input', 'on-change', 'on-change', 'on-change', 'update:hasSkuImg', 'update:modelValue'])

const route = useRoute()
const view = ref(!(route.path === '/product/list' || route.path === '/product-insights'))
const data = ref(props.salesAttrs)
const skuTreeData = ref(props.skuTree)
const hasSkuId = ref(true)
const hasSkuValue = ref(props.hasSkuVal)
watch(() => data.value, (newVal) => {
  emit('update:modelValue', newVal)
  emit('on-change', data.value)
  // 已选属性值，隐藏错误提示
  if (data.value?.some((item) => item.id && item.leaf?.length > 0)) {
    hasSkuValue.value = true
  }
  // 已选属性，隐藏错误提示
  if (data.value?.some((item) => item.id)) {
    hasSkuId.value = true
  }
}, { immediate: true })

watch(() => props.skuTree, (newVal) => {
  skuTreeData.value = newVal
}, { immediate: true, deep: true })

const onChangeHasImg = (val) => {
  emit('update:hasSkuImg', val)
}

const addSku = () => {
  hasSkuValue.value = true
  hasSkuId.value = true

  // 未选属性值，提示用户并禁止继续加选属性
  if (data.value?.some((item) => item.id && item.leaf && !item.leaf.length)) {
    hasSkuValue.value = false
    return
  }
  // 未选已添加属性，提示用户并禁止继续加选属性
  if (data.value?.some((item) => !item.id)) {
    hasSkuId.value = false
    return
  }
  data.value.push({
    leaf: []
  })
}

const rebuildSku = (sku, index) => {
  const { optionText } = props
  if (
    data.value.some(
      (item, idx) => item[optionText] === sku[optionText] && index !== idx
    )
  ) {
    ElMessage({
      message: '规格名不能重复',
      duration: 800
    })
    data.value[index] = []
    return
  }
  data.value[index] = Object.assign({}, sku)
}

/**
 * 删除属性
 */
const handleSkuRemove = (sku, index) => {
  data.value.splice(index, 1)

  if (index === 0 && data.value.length > 0) {
    data.value[0].leaf.forEach((item) => {
      item.is_show = sku?.leaf[0].is_show
    })
  }
  // 属性选择列表中不存在被删除的已选属性
  if (!skuTreeData.value?.some(item => item[props.optionValue] === sku[props.optionValue])) {
    // 被删除的已选属性id为数字类型（即非手动创建的属性）
    if (typeof (sku[props.optionValue]) === 'number') {
      // 删除某个已选属性后，往属性选项列表中增加被删除的已选属性
      skuTreeData.value.push(sku)
    }
  }
}

onBeforeMount(() => {
  const { onFetchGroup } = props
  if (typeof (onFetchGroup) == 'function') {
    onFetchGroup().then(skuTree => {
      skuTreeData.value = skuTree
    })
  }
})

provide('ease', props)

</script>

<style lang="scss" scoped>
.ease-sku {
  border: 1px solid #DCDCDC;
  .part-form-item{
    display: flex;
    background-color: #f8f8f8;
    // padding: 10px;
    margin: 10px;
    align-items: center;

    .add-sku{
      height: 32px;
      line-height: 32px;
      padding: 0 15px;
      font-size: 13px;
      background-color: #fff;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      cursor: pointer;
      display: inline-block;
    }

    .add-sku:hover{
      border: 1px solid #155bd4;
      color: #155bd4;

    }
    .part-tips{
      font-size: 12px;
      color: #999999;
      margin-left: 10px;
    }
  }
  .warning {
    display: inline-block;
    margin-left: 15px;
    color: #e43130;
    font-size: 13px;
  }
}
</style>
