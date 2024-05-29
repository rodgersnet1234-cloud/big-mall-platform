<template>
  <!-- 属性组 -->
  <div class="part-spec-section">
    <div class="spec-box">
      <div class="spec-select">
        <div class="sel-box">
          <div class="sku-name">
            规格名：
          </div>
          <div
            v-if="view"
            class="select"
          >
            <el-select
              v-model="skuValue"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
              :popper-append-to-body="false"
              style="width:150px"
              @change="handleSelectSku"
            >
              <el-option
                v-for="item in ease.skuTree"
                :key="item[optionValue]"
                :label="item[optionText]"
                :value="item[optionValue]"
              />
            </el-select>
            <span class="tips">支持手动输入创建新规格名，鼠标点击或回车均可添加，规格名称不超过10个字符</span>
          </div>
          <div
            v-else
            class="sku-name"
          >
            {{ skuValue }}
          </div>
        </div>
        <div
          v-if="index === 0 && ease.showAddSkuImage && view"
          class="sel-add-img"
        >
          <el-checkbox
            v-model="hasSkuImage"
            @change="handleCheckedSkuImage"
          >
            添加规格图片
          </el-checkbox>
        </div>
      </div>
      <div
        v-if="view"
        class="del-btn"
        @click="onSkuRemove(sku, index)"
      >
        删除规格
      </div>
    </div>
    <!-- sku值 -->
    <sku-container
      :sku="sku"
      :has-sku-image="hasSkuImage"
      :on-sku-leaf-change="handleSkuLeafChange"
    />
  </div>
</template>

<script setup>
import skuContainer from '@/components/sku/SkuContainer/index.vue'
import { ElMessage } from 'element-plus'

const ease = inject('ease', {})

const props = defineProps({
  index: {
    type: Number,
    default: 0
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
  onSkuChange: {
    type: Function,
    default: () => {
      return res => res
    }
  },
  onSkuRemove: {
    type: Function,
    default: () => {
      return res => res
    }
  }
})

const route = useRoute()

const view = ref(!(route.path === '/product/list' || route.path === '/data-analysis/product-insights'))

const hasSkuImage = ref(props.sku.leaf ? props.sku.leaf.some(item => item.imgUrl) : false)

const skuValue = ref('')
const currentSku = ref('')
watch(() => props.sku, (newVal) => {
  skuValue.value = ''
  if (newVal[props.optionText]) {
    nextTick(() => {
      skuValue.value = newVal[props.optionText]
      currentSku.value = newVal
    })
  }
}, { immediate: true })

// 选择sku
const handleSelectSku = (value) => {
  const reg = /[\\;\\:\\；\\：]/g
  // 特殊符号
  if (reg.test(value)) {
    skuValue.value = ''
    ElMessage({
      message: '不允许包含特殊字符:;',
      duration: 1500,
      type: 'error'
    })
    return
  }
  // 空格判断
  if (!String(value).trim()) {
    skuValue.value = ''
    return
  }
  if (value.length > 10) {
    ElMessage({
      message: '属性名长度不可超过10个字符',
      duration: 1500
    })
    skuValue.value = ''
    return
  }
  const { index, optionValue } = props
  // 当切换当前属性时，把非手动创建的当前属性重新放入可选择列表中
  if (currentSku.value && value !== currentSku.value.id &&
    typeof (currentSku.value.id) === 'number' &&
    !ease.skuTree.find(el => el.id === currentSku.value.id)) {
    ease.skuTree.push(currentSku.value)
  }
  if (typeof (value) === 'number') {
    const sku = ease.skuTree.find(item => item[optionValue] === value)
    sku.leaf = []
    if (props.onSkuChange(sku, index) === false) {
      skuValue.value = ''
    } else {
      ease.skuTree.some((item, idx) => {
        // 列表删除已选中属性
        if (item[optionValue] === value) {
          currentSku.value = ease.skuTree[idx]
          ease.skuTree.splice(idx, 1)
        }
        return false
      })
    }
    return
  }
  createSku(value)
}

// 创建sku
const createSku = (text) => {
  let { sku, index, optionValue, optionText } = props
  ease.onCreateGroup(text).then(data => {
    if (data && data !== 0) {
      sku = {
        [optionValue]: data,
        [optionText]: text,
        leaf: []
      }
      props.onSkuChange(sku, index)
    }
  })
}

// 添加图片复选框
const handleCheckedSkuImage = () => {
  // 切换添加图片的状态
  ease.switchSkuImageStatus(hasSkuImage.value)
}

const handleSkuLeafChange = (leaf) => {
  const { sku, index } = props
  sku.leaf = leaf
  props.onSkuChange(sku, index)
}

</script>
<style lang="scss" scoped>
/* 商品属性 */
.part-spec-section {
  padding: 10px;

  .spec-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 400px;
    padding: 8px 10px;
    background: #f8f8f8;
    .spec-select {
      display: flex;
      // align-items: center;
      .sel-box{
        display: flex;
        .sku-name{
          margin-right: 10px;
          height: 30px;
          line-height: 30px;
        }
        .select{
          width: 150px;
          .tips{
            color: #999;
            font-size: 12px;
            height: 1em;
            line-height: 1em;
            margin: 5px 0;
            white-space: nowrap;
          }
        }
      }
    }
    .spec-select .sel-add-img {
      margin-left: 20px;
      height: 30px;
      line-height: 30px;
    }
    .del-btn {
      font-size: 13px;
      color: #155bd4;
      cursor: pointer;
    }
  }

}
</style>
