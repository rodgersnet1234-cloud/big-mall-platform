<template>
  <div class="group-container">
    <div
      v-if="sku[optionValue] && sku[optionValue] !== 0"
      class="spec-name"
    >
      <div
        class="tag-item-tit"
      >
        规格值：
      </div>
      <div class="spec-name-conter">
        <div
          v-for="(item, index) in sku.leaf"
          :key="index"
          :class="['spec-name-int',hasSkuImage?'ft-spec-val-item':''] "
        >
          <div class="spec-name-box">
            <div class="text-hid">
              {{ item[optionText] }}
            </div>
            <div
              v-if="view"
              class="del-btn"
              @click="handleRemoveSkuLeaf(index)"
            >
              <el-icon class="el-icon-close">
                <Close />
              </el-icon>
            </div>
          </div>
          <div
            v-if="hasSkuImage"

            class="img-box"
          >
            <div
              class="spec-imgbox"
            >
              <img-upload
                v-model:model-value="item.imgUrl"
                :show="view"
                class="spec-img"
                @input="handleUploadSuccess(item, $event)"
              />
              <div
                v-if="item.imgUrl"
                class="preview-btn"
                @click="picturePreview(item.imgUrl)"
              >
                预览
              </div>
            </div>
            <div
              v-if="hasSkuImage && item.imgUrl && view"
              class="del-pic"
              @click="delSpecPic(item, index)"
            >
              删除
            </div>
          </div>
        </div>
      </div>

      <!-- 新增 -->
      <div
        v-if="sku[optionValue] && sku[optionValue] !== 0"
        class="sku-item"
      >
        <el-popover
          placement="bottom"
          :disabled="selectNum>100"
          trigger="click"
          :width="250"
        >
          <div style="text-align: right; margin: 0">
            <el-select
              v-model="leafValue"
              class="popover-select"
              multiple
              filterable
              allow-create
              default-first-option
              :popper-append-to-body="false"
              placeholder="规格值"
              :teleported="false"
              style="width:100%"
              @change="createSkuLeaf"
              @visible-change="status => !status && handleSelectSku()"
            >
              <el-option
                v-for="item in skuOptions"
                :key="item[optionValue]"
                :label="item[optionText]"
                :value="item[optionValue]"
              />
            </el-select>
          </div>
          <template
            v-if="view"
            #reference
          >
            <el-icon
              class="button-add  el-icon-plus"
              @click="addSku"
            >
              <Plus />
            </el-icon>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup>
import ImgUpload from '@/components/img-upload/index.vue'
import { ElMessage } from 'element-plus'

const ease = inject('ease')
const setSalesAttrs = inject('setSalesAttrs')

const route = useRoute()

const view = ref(!(route.path === '/product/list' || route.path === '/data-analysis/product-insights'))
const leafValue = ref([])
const props = defineProps({
  sku: {
    type: Object,
    default () {
      return {}
    }
  },
  hasSkuImage: {
    type: Boolean,
    default: false
  },
  onSkuLeafChange: {
    type: Function,
    default: () => {
      return res => res
    }
  }
})

const optionValue = computed(() => {
  return ease.optionValue
})

const optionText = computed(() => {
  return ease.optionText
})

// 添加后的sku数量
const selectNum = computed(() => {
  if (setSalesAttrs.value.length === 1) { // 只有一个规格名时
    return setSalesAttrs.value[0].leaf.length + 1
  } else if (setSalesAttrs.value.length > 1) { // 有多个规格名时
    // 过滤掉当前的规格名
    const attrsLsit = setSalesAttrs.value.filter((el) => el.id !== props.sku.id)
    // 规格值数量
    let num = 0
    attrsLsit.forEach((el) => {
      if (num === 0) {
        num = el.leaf.length
      } else {
        num = num * el.leaf.length
      }
    })
    return (props.sku.leaf.length + 1) * num
  } else {
    return 0
  }
})

// 当前sku数量
const skuNum = computed(() => {
  if (setSalesAttrs.value.length === 1) { // 只有一个规格名时
    return setSalesAttrs.value[0].leaf.length
  } else if (setSalesAttrs.value.length > 1) { // 有多个规格名时
    // 过滤掉当前的规格名
    const attrsLsit = setSalesAttrs.value.filter((el) => el.id !== props.sku.id)
    // 规格值数量
    let num = 0
    attrsLsit.forEach((el) => {
      if (num === 0) {
        num = el.leaf.length
      } else {
        num = num * el.leaf.length
      }
    })
    return (props.sku.leaf.length ? props.sku.leaf.length : 1) * num
  } else {
    return 0
  }
})

const addSku = () => {
  if (selectNum.value > 100) {
    ElMessage.error(
      `${'当前已添加' +
      skuNum.value +
      '组商品规格'}（${'最多可添加' +
      100 +
      '组'}），该规格名下不可添加`
    )
  }
}

const skuOptions = ref([])
const visiable = ref(false)
const fetchLeafById = (id) => {
  if (!id) return
  ease.onFetchSku(id).then((skuOptionsPar) => {
    // 筛选未选择的属性
    skuOptions.value = skuOptionsPar.filter(skuItem => !props.sku.leaf.find(item => item.id === skuItem.id))
  })
}
watch(() => props.sku, () => {
  fetchLeafById(props.sku[optionValue.value])
})

const handleHideVisiable = () => {
  visiable.value = false
}

const handleResetLeafValue = () => {
  leafValue.value = []
}

const handleRemoveSkuLeaf = (index) => {
  const skuPar = props.sku
  skuPar.leaf?.splice(index, 1)
  props.onSkuLeafChange(skuPar.leaf)
}

const filterSkuOptions = (data) => {
  const oldSellData = []
  const addSelData = []
  const skuOptionsPar = skuOptions.value
  data.forEach(item => {
    if (skuOptionsPar.find(skuItem => skuItem.id === item)) {
      oldSellData.push(item)
    } else {
      addSelData.push(item)
    }
  })
  return {
    oldSellData, addSelData
  }
}

const skuOptionsNum = (numPra) => {
  if (setSalesAttrs.value.length === 1) { // 只有一个规格名时
    return setSalesAttrs.value[0].leaf.length + numPra
  } else if (setSalesAttrs.value.length > 1) { // 有多个规格名时
    // 过滤掉当前的规格名
    const attrsLsit = setSalesAttrs.value.filter((el) => el.id !== props.sku.id)
    // 规格值数量
    let num = 0
    attrsLsit.forEach((el) => {
      if (num === 0) {
        num = el.leaf.length
      } else {
        num = num * el.leaf.length
      }
    })
    return (props.sku.leaf.length + numPra) * num
  } else {
    return 0
  }
}

const createSkuLeaf = (selVal) => {
  // 判断空格
  const idx = selVal.length - 1
  const curVal = selVal[idx] ? String(selVal[idx]) : ''
  const reg = /[\\;\\；]/g
  // 特殊符号
  if (reg.test(curVal)) {
    leafValue.value.splice(idx, 1)
    ElMessage({
      message: '不允许包含特殊字符;',
      type: 'error',
      duration: 1500
    })
    return
  }
  if (!curVal.trim()) {
    leafValue.value.splice(idx, 1)
  }
  const { addSelData, oldSellData } = filterSkuOptions(selVal)
  if (!addSelData.length) return
  ease.onCreateSku({
    data: addSelData,
    id: props.sku[optionValue.value]
  }).then((processedNewOptions) => {
    if (processedNewOptions[0].text.length > 20) {
      ElMessage({
        message: '属性名长度不可超过20个字符',
        duration: 1500
      })
      processedNewOptions = []
    }
    skuOptions.value.push(...processedNewOptions)
    nextTick(() => {
      leafValue.value = processedNewOptions.map(item => item.id).concat(oldSellData)
    })
  })
}

const handleSelectSku = () => {
  if (skuOptionsNum(leafValue.value.length) > 100) {
    ElMessage.error(
      `${'当前已添加' +
      skuNum.value +
      '组商品规格'}（${'最多可添加' +
      100 +
      '组'}），该规格名下不可添加`
    )
    return
  }
  const skuPar = props.sku
  const skuLeaf = skuOptions.value.filter(item => leafValue.value.indexOf(item[optionValue.value]) >= 0)

  skuLeaf.forEach(item => {
    item.is_show = props.hasSkuImage
    item.imgUrl = ''
  })

  const skuLeafIds = skuPar.leaf.map(item => item[optionValue.value])

  skuLeaf.forEach(item => {
    if (!skuLeafIds.includes(item[optionValue.value])) {
      skuPar.leaf.push(item)
    }
  })

  // 过滤同名规格值
  for (let i = 0; i < skuPar.leaf.length; i++) {
    for (let j = i + 1; j < skuPar.leaf.length; j++) {
      if (skuPar.leaf[i][optionText.value] === skuPar.leaf[j][optionText.value]) {
        skuPar.leaf.splice(i, 1)
        j--
      }
    }
  }

  handleResetLeafValue()
  handleHideVisiable()
  props.onSkuLeafChange(skuPar.leaf)
}

const handleUploadSuccess = (item, urls) => {
  const skuPar = props.sku
  skuPar.leaf.forEach(el => {
    if (el.id === item.id) {
      el.imgUrl = urls
      el.is_show = true
    }
  })
  ease.onHandleSkuValueImg(skuPar)
}

// 删除图片
// eslint-disable-next-line no-unused-vars
const delSpecPic = (item, index) => {
  const skuPar = props.sku
  skuPar.leaf[index].imgUrl = ''
  // $forceUpdate()
  ease.onHandleSkuValueImg(skuPar)
}

// 图片预览
const picturePreview = (imgUrl) => {
  ease.onPreviewImg(imgUrl)
}
onBeforeMount(() => {
  const skuPar = props.sku
  skuPar[optionValue.value] && fetchLeafById(skuPar[optionValue.value])
})

</script>

<style lang="scss" scoped>
@use "index";
</style>
