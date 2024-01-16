<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="关联商品"
    width="65%"
    class="component-association-goods"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-table
      :data="comData.list"
      header-row-class-name="header-row"
      style="margin-top: 10px"
    >
      <el-table-column
        property="spuName"
        label="商品名称"
        align="center"
      >
        <template #default="scope">
          <div class="prod-name">
            {{ scope.row.spuName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        property="skuName"
        label="商品规格"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row.skuName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="comboCount"
        label="组合内数量"
        align="center"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.comboCount"
            :min="1"
            controls-position="right"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column
        property="priceFee"
        label="原销售价(元)"
        align="center"
      >
        <template #default="scope">
          {{ formatPrice(scope.row.priceFee, 1).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        property="stock"
        label="商品库存"
        align="center"
      />
    </el-table>
    <div class="total-price">
      合计库存: <span class="price">{{ totalStock }}</span>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="dialogTableVisible = false"
        >
          取消
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { formatPrice } from '@/utils/index.js'
import Big from 'big.js'

const dialogTableVisible = ref(false)
// 打开弹窗
const openDialog = (data = []) => {
  resetData()
  comData.list = JSON.parse(JSON.stringify(data))
  dialogTableVisible.value = true
}

const comData = reactive({
  list: [],
  totalStock: 0
})

const totalStock = computed(() => {
  let num
  let arr = []
  if (comData.list.length > 0) {
    arr = comData.list.map((item) => {
      return item.stock / item.comboCount
    })
    num = parseInt(Math.min(...arr))
  } else {
    num = 0
  }
  return num || 0
})

// 初始化数据
const resetData = () => {
  comData.list = []
  comData.totalStock = 0
}

defineExpose({
  openDialog
})

</script>

<style scoped lang="scss">
// 定义表头样式
:deep(.header-row) {
  .el-table__cell {
    background-color: #F7F8FA;
    height: 57px;
    font-weight: bold;
  }
}

.total-price {
  margin: 20px 0 0 20px;

  &:deep(.price) {
    text-decoration: underline;
    margin-right: 30px;
  }
}

.prod-name {
  flex: 1;
  font-size: 14px;
  color: #333333;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
