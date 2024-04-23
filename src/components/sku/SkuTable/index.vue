<template>
  <div class="ease-sku-table">
    <!-- 批量设置 -->
    <div
      v-if="lists[0] && lists[0].spuSkuAttrValues && lists.length > 1"
      class="batch-settings"
    >
      <div
        v-if="view"
        class="batch"
      >
        <div>
          <span class="bat-tit">批量设置</span>
          <span class="set-tips">在下方栏中选择内容进行批量填充</span>
        </div>
      </div>
      <div
        v-if="view"
        ref="settingBarRef"
        class="bat-set-sel"
        @scroll="listeningSetBarScroll"
      >
        <span
          v-for="(skuItem, index) in setLeafList"
          :key="index"
          class="select-part"
        >
          <el-select
            v-model="skuItem.value"
            class="bat-set-item"
            placeholder="请选择"
            :style="{'width': '100%'}"
            @change="changeValue"
          >
            <el-option
              v-for="item in skuItem"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            />
          </el-select>
        </span>
        <span class="select-part">

          <el-input
            v-model="stockIntVal"
            class="bat-set-item"
            :mini="0 "
            maxlength="7"
            placeholder="库存"
            oninput="value=value.replace(/\D/g,'');value = value > 9999999 ? 9999999 : value"
            :style="{'width': '100%'}"
          />
        </span>

        <el-input-number
          v-model="markedPriceIntVal"
          class="bat-set-item"
          type="number"
          controls-position="right"
          :min="0"
          :max="9999999.99"
          :step="0.1"
          :precision="2"
          placeholder="市场价(元)"
          :style="{'width': inputWidth}"
        />

        <el-input-number
          v-model="priceIntVal"
          class="bat-set-item"
          type="number"
          controls-position="right"
          :min="isScore ? 0 : 0.01"
          :max="9999999.99"
          :step="0.1"
          :precision="2"
          placeholder="销售价(元)"
          :style="{'width': inputWidth}"
        />

        <el-input-number
          v-if="isScore"
          v-model="scorePriceIntVal"
          class="bat-set-item"
          type="number"
          controls-position="right"
          :min="1"
          :max="9999999"
          :step="1"
          :precision="0"
          placeholder="积分价"
          :style="{'width': inputWidth}"
        />

        <el-input-number
          v-model="volumeIntVal"
          class="bat-set-item"
          type="number"
          controls-position="right"
          :min="0"
          :max="999.99"
          :step="0.1"
          :precision="2"
          placeholder="体积(m³)"
          :style="{'width': inputWidth}"
        />

        <el-input-number
          v-model="weightIntVal"
          class="bat-set-item"
          type="number"
          controls-position="right"
          :min="0"
          :max="9999.99"
          :step="0.1"
          :precision="2"
          placeholder="重量(kg)"
          :style="{'width': inputWidth}"
        />
        <span
          v-if="spuId && !isNoSkuValue"
          class="bat-set-item"
        />
        <span
          class="bat-set-item button"
          :style="{'width': tableInputWidth + 'px'}"
        >
          <el-button
            type="primary"
            @click="setNow"
          >
            保存批量设置
          </el-button>
        </span>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      ref="elTableRef"
      :key="tableRefKey"
      border
      :data="lists"
      class="tab-con"
      :span-method="objectSpanMethod"
    >
      <el-table-column
        v-for="(label, index) in columns"
        :key="index"
        :label="label"
      >
        <template #default="scope">
          <span v-if="scope.row.spuSkuAttrValues && scope.row.spuSkuAttrValues.length > 0">
            {{ scope.row.spuSkuAttrValues[index].attrValueName || '' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="stock"
        label="库存"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input
            id="tableInput"
            ref="tableInputRef"
            v-model="scope.row.stock"
            :disabled="scope.row.status===0 || isDisabled"
            controls-position="right"
            class="tab-int"
            oninput="value=value.replace(/\D/g,'');value = value > 9999999 ? 9999999 : value"
            @blur="stockValidAndChange(scope)"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="marketPriceFee"
        label="市场价(元)"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.marketPriceFee"
            :min="0"
            :max="9999999.99"
            :step="0.1"
            :precision="2"
            :disabled="scope.row.status===0 || isDisabled"
            controls-position="right"
            class="tab-int"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="priceFee"
        label="销售价(元)"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.priceFee"
            :min="isScore ? 0.00 : 0.01"
            :max="9999999.99"
            :step="0.1"
            :precision="2"
            :disabled="scope.row.status===0 || isDisabled"
            controls-position="right"
            class="tab-int"
            @blur="changePrice(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column
        v-if="isScore"
        prop="scoreFee"
        label="积分价"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.scoreFee"
            :min="1"
            :max="99999999"
            :step="1"
            :precision="0"
            :disabled="scope.row.status===0 || isDisabled"
            controls-position="right"
            class="tab-int"
            @blur="changeScorePrice(scope)"
          />
        </template>
      </el-table-column>

      <el-table-column
        v-if="!isMold"
        prop="volume"
        label="体积(m³)"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.volume"
            :min="0"
            :max="999.99"
            :step="0.1"
            :precision="2"
            :disabled="scope.row.status===0 || isDisabled"
            controls-position="right"
            class="tab-int"
          />
        </template>
      </el-table-column>

      <el-table-column
        v-if="!isMold"
        prop="weight"
        label="重量(kg)"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.weight"
            :min="0"
            :max="9999.99"
            :step="0.1"
            :precision="2"
            :disabled="scope.row.status===0 || isDisabled"
            controls-position="right"
            class="tab-int"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="skuCode"
        label="商品编码"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.partyCode"
            :min="0"
            :disabled="scope.row.status===0 || isDisabled"
            maxlength="20"
            class="tab-int"
          />
        </template>
      </el-table-column>

      <el-table-column
        v-if="!isNoSkuValue"
        prop="skuCode"
        label="sku状态"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-button
            v-if="!isDisabled"
            link
            :style="{color: view?'#155bd4':'#C0C4CC'}"
            @click="skuStatusOperation(scope)"
          >
            {{ scope.row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <span v-else>{{ scope.row.status === 1 ? '启用' : '禁用' }}</span>
          <span
            v-if="scope.row.skuComboList && scope.row.skuComboList.length > 0"
            class="goods-btn"
            @click="openGoodList(scope.row.skuComboList)"
          >商品({{ scope.row.skuComboList.length }})</span>
        </template>
      </el-table-column>
    </el-table>

    <association-goods
      v-if="associationGoodsVisible"
      ref="associationGoodsRef"
    />
  </div>
</template>

<script setup>
import { flatten as genFlatten } from '@/utils'
import { getCurrentInstance } from 'vue'
import AssociationGoods from '../association-goods/index.vue'

const emit = defineEmits(['on-change-data'])

const props = defineProps({
  data: {
    type: Array,
    default () {
      return []
    }
  },
  flatten: {
    type: Array,
    default () {
      return []
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
  spuId: {
    type: Number,
    default: null
  },
  isNoSkuValue: {
    type: Boolean,
    default: false
  },
  isScore: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  // 是否为虚拟商品
  isMold: {
    type: Boolean,
    default: false
  },
  defaultWarehouse: {
    type: Number,
    default: 0
  }
})

watch(() => props.isScore, () => {
}, { deep: true })

let originList = []
const route = useRoute()
const view = ref(!(route.path === '/product/list' || route.path === '/data-analysis/product-insights'))

const inputWidth = ref('110px')
let timer = null

const filter = computed(() => {
  return props.data.filter(item => item.text && item.leaf.length)
})

const setLeafList = computed(() => {
  // 立即设置-规格下拉框列表
  const { data } = props
  const leaf = []
  data.forEach((item) => {
    if (item.leaf?.length) {
      leaf.unshift([{ id: -1, is_show: false, text: '全部' }, ...item.leaf])
    }
  })
  leaf.forEach((item) => {
    item.value = -1
  })
  return leaf.reverse()
})

const lists = ref([])
const genLists = (filterPar, flattenPar) => {
  let data
  const baseData = {
    stock: 0, // 库存
    marketPriceFee: 0, // 市场价
    priceFee: props.isScore ? 0.00 : 0.01, // 销售价
    scoreFee: 1, // 积分价
    volume: 0, // 体积
    weight: 0, // 重量
    partyCode: null, // 商品编码
    modelId: null, // 条形码
    status: 1, // 状态
    stockPointList: [] // 库存点库存
  }
  if (filterPar.length && genFlatten(filterPar, flattenPar).length) {
    data = genFlatten(filterPar, flattenPar, { extraData: baseData })
  } else {
    data = [baseData]
  }
  if (data.length === 1 && !data[0]?.spuSkuAttrValues) {
    props.flatten.forEach(el => {
      const baseData = {
        stock: el.stock, // 库存
        marketPriceFee: el.marketPriceFee, // 市场价
        priceFee: el.priceFee, // 销售价
        scoreFee: el.scoreFee, // 积分价
        volume: el.volume, // 体积
        weight: el.weight, // 重量
        partyCode: el.partyCode, // 商品编码
        modelId: el.modelId, // 条形码
        status: el.status || null, // 状态
        stockPointList: el.stockPointList || [], // 库存点库存
        skuComboList: el.skuComboList
      }
      data = [baseData]
    })
  }
  return data
}

const rowspan = ref([])
const computeRowspan = () => {
  rowspan.value = []
  const rowspanPar = (index) => {
    const span = []
    let dot = 0
    lists.value.forEach((item, idx) => {
      if (idx === 0) {
        span.push(1)
      } else {
        if (item.spuSkuAttrValues?.[index].attrValueName === lists.value[idx - 1].spuSkuAttrValues?.[index].attrValueName) {
          span[dot] += 1
          span.push(0)
        } else {
          dot = idx
          span.push(1)
        }
      }
    })

    rowspan.value.push(span)
  }

  // eslint-disable-next-line no-unused-vars
  filter.value.forEach((item, index) => {
    rowspanPar(index)
  })
}

const columns = ref([])
const elTableRef = ref(null)
const tableRefKey = computed(() => {
  return Symbol(columns.value)
})
watch(() => filter.value, async (newVal) => {
  columns.value = newVal.map(item => item[props.optionText])
  lists.value = await genLists(filter.value, props.flatten)
  elTableRef.value?.doLayout()
  computeRowspan()
}, { immediate: true })

watch(() => props.flatten, () => {
  if (props.spuId && props.isNoSkuValue) { // 有skuId，未选择属性
    originList = JSON.parse(JSON.stringify(props.flatten))
  } else {
    originList = JSON.parse(JSON.stringify(lists.value))
  }
  if (lists.value.length === 1 && !lists.value[0]?.spuSkuAttrValues) {
    props.flatten.forEach(el => {
      const baseData = {
        stock: el.stock, // 库存
        marketPriceFee: el.marketPriceFee, // 市场价
        priceFee: el.priceFee, // 销售价
        scoreFee: el.scoreFee, // 积分价
        volume: el.volume, // 体积
        weight: el.weight, // 重量
        partyCode: el.partyCode, // 商品编码
        modelId: el.modelId, // 条形码
        status: el.status || null, // 状态
        stockPointList: el.stockPointList || []
      }
      lists.value = [baseData]
    })
  }
}, { deep: true, immediate: true })

watch(() => lists.value, (newVal) => {
  if (props.spuId && props.isNoSkuValue) { // 有skuId，未选择属性
    originList = JSON.parse(JSON.stringify(props.flatten))
  } else {
    originList = JSON.parse(JSON.stringify(newVal))
  }
})

const tableInputWidth = ref(0) // 表格内输入框的大小
/**
 * 监听表格输入框大小变化
 */
const listeningInputBox = () => {
  nextTick(() => {
    const input = document.querySelector(
      '.tab-int .el-input.el-input--medium'
    )
    timer = setTimeout(() => {
      tableInputWidth.value = input?.offsetWidth - 3
    }, 200)
  })
}
watch(() => lists.value, (data) => {
  emit('on-change-data', data)
  listeningInputBox()
}, { deep: true })

watch(() => setLeafList.value, () => {
  if (setLeafList.value.length > 1) {
    inputWidth.value = '95px'
  } else if (setLeafList.value.length > 2) { /* empty */ } else {
    inputWidth.value = '90px'
  }
}, { immediate: true, deep: true })

onMounted(() => {
  listeningTableScroll()
})

const settingBarRef = ref(null)
/**
 * 控制设置栏和表格同步滚动
 */
const listeningTableScroll = () => {
  // 获取需要绑定的table
  const elTable = elTableRef.value.bodyWrapper
  elTable?.addEventListener('scroll', () => {
    const settingBar = settingBarRef.value
    // 横向滚动距离
    const tableScrollLeft = elTable.scrollLeft
    if (tableScrollLeft >= 0) {
      settingBar.scrollLeft = tableScrollLeft
    }
  })
}

const listeningSetBarScroll = () => {
  const settingBar = settingBarRef.value
  settingBar?.addEventListener('scroll', () => {
    const elTable = elTableRef.value?.bodyWrapper
    // 横向滚动距离
    const inputBoxScrollLeft = settingBar.scrollLeft
    if (inputBoxScrollLeft >= 0) {
      elTable.scrollLeft = inputBoxScrollLeft
    }
  })
}

const changeScorePrice = (row) => {
  const obj = row.row
  if (!row.row.scoreFee) {
    obj.scoreFee = 1
    lists.value[row.$index] = obj
    lists.value[row.$index].scoreFee = 1
  }
}

/**
 * 库存修改与验证
 * @param {Object} scope 表格当前行
 */
const stockValidAndChange = (scope) => {
  const { $index, row } = scope

  // 修改时更新库存信息（库存点ID为默认仓库id）
  lists.value[$index].stockPointList = [{
    stock: row.stock,
    stockPointId: props.defaultWarehouse,
    stockPointType: 1,
    type: 0
  }]

  /** 无属性 */
  if (originList?.length === 1 && !originList?.[0].spuSkuAttrValues && !row.spuSkuAttrValues) {
    lists.value[$index].changeStock = parseInt(row.stock) - parseInt(originList[0].stock)
    return
  }

  /** 有属性 */
  const spuSkuAttrValues = row.spuSkuAttrValues || []
  const currentAttrValIds = (spuSkuAttrValues.map(item => item.attrValueId))?.filter(id => id)
  // 当前无输入，赋值0（默认值）
  if (!lists.value[$index].stock) {
    lists.value[$index].stock = 0
  }
  const originSku = originList?.find(item => {
    const orginSpuSkuAttrValues = item.spuSkuAttrValues || []
    const originAttrValIds = (orginSpuSkuAttrValues.map(val => val.attrValueId))?.filter(id => id)
    return isEqualArrays(currentAttrValIds, originAttrValIds)
  })
  // 匹配失败, 无相同sku
  if (!originSku) {
    return
  }
  // 当前sku与原sku匹配成功（存在originSku）,判断库存
  const originStock = originSku.stock
  if (originStock !== undefined) { // 存在原库存
    lists.value[$index].stockPointList[0].changeStock = parseInt(row.stock) - parseInt(originStock)
    lists.value[$index].changeStock = parseInt(row.stock) - parseInt(originStock)
  }
}

// 两个数组是否相等
const isEqualArrays = (arr1, arr2) => {
  return arr1.length === arr2.length && arr1.every(val1 => !!arr2?.find(val2 => String(val1) === String(val2)))
}

const { proxy } = getCurrentInstance()
const changeValue = () => {
  proxy.$forceUpdate() // 刷新
}

const stockIntVal = ref(null) // 库存
const markedPriceIntVal = ref(null)
const priceIntVal = ref(null)
const scorePriceIntVal = ref(null)// 积分价
const skuCodeIntVal = ref(null)
const barCodeIntVal = ref(null) // 条形码
const volumeIntVal = ref(null) // 体积
const weightIntVal = ref(null) // 重量
// 立即设置
const setNow = () => {
  const listsPar = lists.value
  const setLeafListPar = setLeafList.value
  const spuIdPar = props.spuId

  const stockIntValPar = parseInt(stockIntVal.value)
  const markedPriceIntValPar = parseInt(markedPriceIntVal.value)
  const priceIntValPar = parseFloat(priceIntVal.value)
  const scorePriceIntValPar = scorePriceIntVal.value
  const skuCodeIntValPar = parseInt(skuCodeIntVal.value)
  const barCodeIntValPar = parseInt(barCodeIntVal.value)
  const volumeIntValPar = parseInt(volumeIntVal.value)
  const weightIntValPar = parseInt(weightIntVal.value)

  const vaildSkuValArr = []
  setLeafListPar.forEach((item) => {
    vaildSkuValArr.push(item.value)
  })
  listsPar.forEach((item, index) => {
    const { spuSkuAttrValues } = item
    // -1为全部项
    if (spuSkuAttrValues.every((attr, idx) => {
      return vaildSkuValArr[idx] === -1 || attr.attrValueId === vaildSkuValArr[idx]
    })) {
      // setItem(item, index)
      item.marketPriceFee = markedPriceIntValPar >= 0 ? markedPriceIntValPar : item.marketPriceFee || 0
      item.priceFee = priceIntValPar >= 0.01 ? priceIntValPar : item.priceFee || 0 // 销售价
      item.scoreFee = scorePriceIntValPar >= 1 ? scorePriceIntValPar : (item.scoreFee || 1) // 积分价
      item.volume = volumeIntValPar >= 0 ? volumeIntValPar : item.volume // 体积
      item.weight = weightIntValPar >= 0 ? weightIntValPar : item.weight // 重量
      item.partyCode = skuCodeIntValPar || item.partyCode // 商品编码
      item.modelId = barCodeIntValPar || item.modelId // 商品条形码
      item.stock = stockIntValPar && stockIntValPar >= 0 ? stockIntValPar : item.stock

      let isHaveDefaultWarehouse = false // 库存中是否存在默认仓库
      if (stockIntVal.value || stockIntVal.value === 0) {
        for (let i = 0; i < item.stockPointList.length; i++) {
          if (item.stockPointList[i].skuId) {
            // 存在skuId，则计算changeStock，并将默认仓库库存设置为Data.stockIntVal
            if (item.stockPointList[i].type !== 0) {
              // 非默认仓库，库存改为0
              /* item.stockPointList[i].changeStock = -(item.stockPointList[i].stock - (item.stockPointList[i].changeStock || 0))
            item.stockPointList[i].stock = 0 */
              item.stockPointList.splice(i, 1)
            } else {
              item.stockPointList[i].changeStock = stockIntVal.value - item.stockPointList[i].stock + (item.stockPointList[i].changeStock || 0)
              item.stockPointList[i].stock = stockIntVal.value
              isHaveDefaultWarehouse = true
            }
          } else {
            if (item.stockPointList[i].type === 0) {
              isHaveDefaultWarehouse = true
              item.stockPointList[i].stock = stockIntVal.value // 无skuId的默认仓库（此次修改新增的仓库库存，无需传changeStock）
              continue
            }
            item.stockPointList.splice(i, 1) // 不存在skuId，则删除当前项
          }
        }
        if (!isHaveDefaultWarehouse) {
          // 不存在默认仓库，则存储一条默认仓库信息
          item.stockPointList.push({
            stock: stockIntVal.value,
            stockPointId: props.defaultWarehouse,
            stockPointType: 1,
            type: 0
          })
        }
      }

      // 如果存在原库存
      if (spuIdPar && item.stock >= 0 && (stockIntValPar && stockIntValPar >= 0) && parseInt(originList[index]?.stock) >= 0) {
        // 改变的库存数量(新增-原有，changeStock允许负数)
        item.changeStock = stockIntValPar - parseInt(originList[index].stock)
      }
    }
  })

  lists.value = listsPar
}

const objectSpanMethod = ({
  rowIndex,
  columnIndex
}) => {
  for (let i = 0; i < filter.value.length; i++) {
    if (columnIndex === i) {
      if (rowspan.value[i] && rowspan.value[i][rowIndex]) {
        return {
          rowspan: rowspan.value[i][rowIndex],
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    }
  }
}

/**
 * sku状态
 */
const skuStatusOperation = (scope) => {
  const { $index } = scope
  const currentStatus = lists.value[$index]?.status
  lists.value[$index].status = currentStatus === 0 ? 1 : 0
}

const associationGoodsRef = ref(null)
const associationGoodsVisible = ref(false)
const openGoodList = (list) => {
  associationGoodsVisible.value = true
  nextTick(() => {
    associationGoodsRef.value.openDialog(list || [])
  })
}

const changePrice = (row) => {
  if (!row.priceFee) {
    row.priceFee = props.isScore ? 0.00 : 0.01
  }
}

// 离开页面前
onUnmounted(() => {
  clearInterval(timer)
})

</script>

<style lang="scss" scoped>
@use "index";
</style>
