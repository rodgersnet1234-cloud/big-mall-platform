<template>
  <div>
    <el-dialog
      v-model="visible"
      :title="
        !dataForm.seckillId
          ? $t('table.edit'): $t('table.view')
      "
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        label-width="140px"
        @submit.prevent
        @keyup.enter="onSubmit()"
      >
        <el-form-item
          :label="$t('group.actName')"
          prop="seckillName"
        >
          <el-input
            v-model.trim="dataForm.seckillName"
            maxlength="36"
            show-word-limit
            :disabled="!!dataForm.seckillId"
          />
        </el-form-item>
        <el-form-item
          :label="$t('seckill.activTime')"
          prop="dateRange"
        >
          <el-date-picker
            v-model="dataForm.dateRange"
            type="daterange"
            :range-separator="$t('date.tip')"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('seckill.selectDate')"
            :disabled="!!dataForm.seckillId"
          />
        </el-form-item>
        <el-form-item
          :label="$t('seckill.selectedLot')"
          prop="selectedLot"
        >
          <el-select
            v-model="dataForm.selectedLot"
            placeholder="请选择"
            :disabled="!!dataForm.seckillId"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('seckill.purcPerPerson')"
          prop="maxNum"
        >
          <el-checkbox
            v-model="hasMaxNum"
            :disabled="!!dataForm.seckillId"
            @click="handlerChangeMaxNum"
          >
            {{ $t("seckill.openPurchaseLimit") }}
          </el-checkbox>
          <span v-show="hasMaxNum">
            {{ $t("seckill.canBePurcPer") }}
            <el-input-number
              v-model="dataForm.maxNum"
              controls-position="right"
              :min="1"
              :max="1000"
              style="width: 100px;"
              :disabled="!!dataForm.seckillId"
            />{{ $t("unit.pieces") }}
          </span>
        </el-form-item>
        <el-form-item :label="$t('seckill.product')">
          <el-button
            v-if="!dataForm.seckillId"
            plain
            style="float: left"
            @click="prodsSelectHandle()"
          >
            {{ $t("product.select") }}
          </el-button>

          <el-card
            v-if="spu != null"
            :body-style="{ padding: '0px' }"
            style="height: 160px; width: 120px"
          >
            <img-show
              :src="spu.mainImgUrl"
              :img-style="{height: '104px', width: '100%'}"
            />
            <div class="card-prod-bottom">
              <span class="card-prod-name">{{ spu.name }}</span>
              <el-button
                link
                type="primary"
                class="card-prod-name-button"
                :disabled="!!dataForm.seckillId"
                @click="deleteProd"
              >
                {{ $t("table.delete") }}
              </el-button>
            </div>
          </el-card>

          <div class="warn-tip">
            <el-icon><WarningFilled /></el-icon>
            警告：秒杀商品采用独立库存，请合理安排！
          </div>
        </el-form-item>
        <el-form-item v-if="skuList.length">
          <el-table
            :data="skuList"
            border
            :style="{width:!!dataForm.seckillId?'87.3%':'100%',marginTop: '20px'}"
          >
            <el-table-column
              prop="skuName"
              label="sku名称"
              min-width="230"
            >
              <template #default="scope">
                {{ scope.row.skuName || spu.name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="秒杀价格"
              width="221"
            >
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.seckillPrice"
                  :precision="2"
                  :step="0.01"
                  :min="0.01"
                  :max="9999999"
                  :disabled="!!(!scope.row.status || dataForm.seckillId)"
                />
                <div>{{ $t("seckill.price") }}：{{ scope.row.priceFee }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="stocks"
              :label="$t('seckill.inventory')"
              width="221"
            >
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.seckillStocks"
                  type="number"
                  :min="0"
                  :max="2147483600"
                  :disabled="!!(!scope.row.status || dataForm.seckillId)"
                />
                <div>{{ $t("seckill.exisocks") }}：{{ scope.row[spu.supplierDeliveryType===1?'supplierStock':'stock'] }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!dataForm.seckillId"
              label="状态"
            >
              <template #default="scope">
                <el-button
                  v-if="!scope.row.status"
                  link
                  type="primary"
                  :disabled="!!dataForm.seckillId"
                  @click="changeSkuStatus(`${scope.$index}`)"
                >
                  {{ $t("table.disable") }}
                </el-button>
                <el-button
                  v-else
                  link
                  type="primary"
                  :disabled="!!dataForm.seckillId"
                  @click="changeSkuStatus(`${scope.$index}`)"
                >
                  {{ $t("table.enable") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">{{
            $t("table.cancel")
          }}</el-button>
          <el-button
            type="primary"
            :disabled="!!dataForm.seckillId"
            @click="onSubmit()"
          >{{ $t("table.confirm") }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 商品选择弹窗 -->
    <!-- 如果要更改dataUrl，在商品选择组件选择商品后的判断处也要更改一下 -->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelectRef"
      :is-single="true"
      @refresh-select-prods="selectSeckillProd"
    />
  </div>
</template>

<script setup>
import ProdsSelect from '@/components/prods-select/index.vue'
import Big from 'big.js'
import * as api from '@/api/seckill/seckill'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const isSubmit = ref(false)
const prodsSelectVisible = ref(false)
const hasMaxNum = ref(false)
const dataFormRef = ref(null)
const dataForm = reactive({
  dateRange: [],
  seckillId: null,
  seckillName: null,
  startTime: null,
  selectedLot: 1,
  endTime: null,
  seckillTag: null,
  maxNum: 1,
  hasMaxNum: false,
  maxCancelTime: 2
})
const spu = ref(null)
const options = ref([{
  value: 0,
  label: '00:00',
  active: false
}, {
  value: 1,
  label: '01:00',
  active: false
}, {
  value: 2,
  label: '02:00',
  active: false
}, {
  value: 3,
  label: '03:00',
  active: false
}, {
  value: 4,
  label: '04:00',
  active: false
}, {
  value: 5,
  label: '05:00',
  active: false
}, {
  value: 6,
  label: '06:00',
  active: false
}, {
  value: 7,
  label: '07:00',
  active: false
}, {
  value: 8,
  label: '08:00',
  active: true
}, {
  value: 9,
  label: '09:00',
  active: true
}, {
  value: 10,
  label: '10:00',
  active: true
}, {
  value: 11,
  label: '11:00',
  active: true
}, {
  value: 12,
  label: '12:00',
  active: true
}, {
  value: 13,
  label: '13:00',
  active: true
}, {
  value: 14,
  label: '14:00',
  active: true
}, {
  value: 15,
  label: '15:00',
  active: true
}, {
  value: 16,
  label: '16:00',
  active: true
}, {
  value: 17,
  label: '17:00',
  active: true
}, {
  value: 18,
  label: '18:00',
  active: false
}, {
  value: 19,
  label: '19:00',
  active: false
}, {
  value: 20,
  label: '20:00',
  active: false
}, {
  value: 21,
  label: '21:00',
  active: false
}, {
  value: 22,
  label: '22:00',
  active: false
}, {
  value: 23,
  label: '23:00',
  active: false
}])
const skuList = ref([])
const isError = ref(false)
const value = ref('')

// eslint-disable-next-line no-unused-vars
const validatorDateRange = (rule, value, callback) => {
  if (!dataForm.dateRange || !dataForm.dateRange[0] || !dataForm.dateRange[1]) {
    callback(new Error($t('seckill.pleaheyTime')))
  }
  if (!dataForm.seckillId && new Date() > Date.parse(dataForm.dateRange[1])) {
    callback(new Error($t('groups.endTime')))
  } else {
    callback()
  }
}
const dataRule = {
  seckillName: [
    { required: true, message: $t('seckill.evenBeEmpty'), trigger: 'blur' }
  ],
  maxNum: [
    { required: true, message: '最大购买数量不能为空', trigger: 'blur' }
  ],
  maxCancelTime: [
    { required: true, message: $t('seckill.theOrionEmpty'), trigger: 'blur' }
  ],
  dateRange: [
    { required: true, validator: validatorDateRange, trigger: 'blur' }
  ]
}

const init = (seckillId) => {
  isSubmit.value = false
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    spu.value = null
    skuList.value = []
    dataForm.seckillId = seckillId || 0
    hasMaxNum.value = false
    if (dataForm.seckillId) {
      api.get(dataForm.seckillId).then(data => {
        data.dateRange = [data.startTime, data.endTime]
        dataForm.dateRange = data.dateRange
        dataForm.seckillId = data.seckillId
        dataForm.seckillName = data.seckillName
        dataForm.startTime = data.startTime
        dataForm.selectedLot = data.selectedLot
        dataForm.categoryId = data.categoryId
        dataForm.endTime = data.endTime
        dataForm.seckillTag = data.seckillTag
        dataForm.maxNum = data.maxNum
        dataForm.maxCancelTime = data.maxCancelTime
        hasMaxNum.value = data.maxNum > 0
        spu.value = data.spuVO
        getSkuList(data.seckillSkuList, data.skuList)
      })
    }
  })
}
const getSkuList = (seckillSkuList, skus) => {
  skus.forEach(sku => {
    sku.priceFee = Number(new Big(sku.priceFee).div(100).valueOf())
    if (seckillSkuList) {
      seckillSkuList.forEach(seckillSku => {
        if (sku.skuId === seckillSku.skuId) {
          sku.seckillStocks = seckillSku.seckillStocks
          sku.seckillPrice = new Big(seckillSku.seckillPrice).div(100).toFixed(2)
        }
      })
    }
  })
  skuList.value = skus
}

// 判断sku中的商品价格与库存是否有填写
const checkSku = () => {
  isError.value = false
  let disableNum = 0
  skuList.value.forEach(element => {
    if (!element.seckillPrice && element.status === 1) {
      isError.value = true
      value.value = $t('seckill.commoBeEmpty')
      return true
    }
    if (!element.seckillStocks && element.seckillStocks !== 0 && element.status === 1) {
      isError.value = true
      value.value = $t('seckill.commodiBeEmpty')
      return true
    }
    if (element.status === 0) {
      disableNum += 1
    }
  })
  if (disableNum === skuList.value.length) {
    isError.value = true
    value.value = $t('seckill.enableMustOne')
    return true
  }
}

// 表单提交
const onSubmit = () => {
  // 秒杀不能更新
  if (dataForm.seckillId) {
    visible.value = false
    return
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (!spu.value) {
        ElMessage({
          message: $t('seckill.pleaSenProc'),
          type: 'error'
        })
        return
      }
      if (!hasMaxNum.value) {
        dataForm.maxNum = -1
      }
      // 判断sku中的商品价格与库存是否有填写
      checkSku()
      if (isError.value) {
        ElMessage.error(value.value)
        return
      }
      if (isSubmit.value) {
        return
      }
      dataForm.startTime = dataForm.dateRange[0]
      dataForm.endTime = dataForm.dateRange[1]
      dataForm.prodId = spu.prodId
      dataForm.seckillSkuList = skuList.value.filter(sku => sku.status)
      // 检验价格
      dataForm.seckillSkuList.forEach(element => {
        element.priceFee = new Big(element.priceFee).times(100).toFixed()
        element.seckillPrice = new Big(element.seckillPrice).times(100).toFixed()
      })
      isSubmit.value = true
      const paramData = Object.assign({}, dataForm)
      paramData.hasMaxNum = hasMaxNum.value ? 1 : 0
    }
  })
}
// 显示添加指定商品弹框
const prodsSelectRef = ref(null)
const prodsSelectHandle = () => {
  prodsSelectVisible.value = true
  nextTick(() => {
    prodsSelectRef.value?.init()
  })
}
const handlerChangeMaxNum = (val) => {
  if (val) {
    dataForm.maxNum = 1
  } else {
    dataForm.maxNum = -1
  }
}
// 添加指定商品
const selectSeckillProd = (prods) => {
  if (prods) {
    spu.value = prods[0]
    dataForm.spuId = spu.value.spuId
    getSkuList(null, prods[0].skuList)
  }
}
const deleteProd = () => {
  spu.value = null
  skuList.value = []
}
const changeSkuStatus = (tagIndex) => {
  skuList.value[tagIndex].status = skuList.value[tagIndex].status ? 0 : 1
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
.card-prod-bottom {
  position: relative;
  text-align: left;

  .card-prod-name {
    margin: auto;
    padding: 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 118px;
    display: inline-block;
  }

  .card-prod-name-button {
    position: absolute;
    top: 30px;
    right: 0;
  }
}
.warn-tip {
  font-size: 12px;
  color: #e6a23c;
  width: 100%;
  display: flex;
  align-items: center;
  &:deep(.el-icon) {
    font-size: 14px;
    margin-right: 2px;
  }
}
</style>
