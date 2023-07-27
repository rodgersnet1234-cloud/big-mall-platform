<template>
  <div class="group-container">
    <div class="spec-name">
      <div
        v-for="(item, index) in sku.leaf"
        :key="index"
        class="spec-name-int"
      >
        <el-tag
          :type="item.type"
          effect="plain"
          :closable="!!view"
          @close="handleRemoveSkuLeaf(index)"
        >
          {{ item[optionText] }}
        </el-tag>
        <div class="img-box">
          <div
            v-if="hasSkuImage"
            class="spec-imgbox"
          >
            <img-upload
              v-if="hasSkuImage"
              v-model="item.imgUrl"
              :show="!!view"
              class="spec-img"
              @input="handleUploadSuccess(item, $event)"
            />
            <div
              v-if="hasSkuImage && item.imgUrl"
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

      <!-- 新增 -->
      <div
        v-if="sku[optionValue] && sku[optionValue] !== 0"
        class="sku-item"
      >
        <el-popover
          :visible="visiable"
          placement="bottom"
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
          <template #reference>
            <el-button
              type="primary"
              style="width: 20px;height: 20px;font-size: 13px"
              circle
              @click="visiable=true"
            >
              <el-icon>
                <Plus />
              </el-icon>
            </el-button>
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

const route = useRoute()

const view = ref(!(route.path === '/product/list' || route.path === '/product-insights'))
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
}, { immediate: true })

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
}

const handleSelectSku = () => {
  const skuPar = props.sku
  const skuLeaf = skuOptions.value.filter(item => {
    return leafValue.value.includes(item[optionValue.value])
  })

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
      // $forceUpdate()
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
