<template>
  <el-dialog
    v-model="visible"
    :title="
      !dataForm.transportId
        ? $t('table.add')
        : $t('table.edit')
    "
    :close-on-click-modal="false"
    width="80%"
    class="component-transport-container"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="80px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('delivery.transport.name')"
        prop="transName"
        :rules="[
          {
            required: true,
            message: $t('delivery.transport.templateNameCannotBeEmpty'),
          },
        ]"
      >
        <el-input
          v-model="dataForm.transName"
          maxlength="36"
          show-word-limit
          :placeholder="$t('delivery.transport.name')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('delivery.transport.chargePrice')"
        prop="chargeType"
      >
        <el-radio-group
          v-model="dataForm.chargeType"
          :disabled="dataForm.isFreeFee === 1"
          @change="changeChargeType"
        >
          <el-radio :label="0">
            {{
              $t("delivery.transport.byCount")
            }}
          </el-radio>
          <el-radio :label="1">
            {{
              $t("delivery.transport.byWeight")
            }}
          </el-radio>
          <el-radio :label="2">
            {{
              $t("delivery.transport.byVolume")
            }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-table
        :data="dataForm.transFees"
        border
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        style="width: 100%"
      >
        <!-- 显示动态显示省市区 -->
        <el-table-column
          header-align="center"
          align="center"
          :label="$t('delivery.transport.distributableArea')"
        >
          <template #default="scope">
            <span v-if="scope.$index === 0&& dataForm.isFreeFee===1">{{
              $t("delivery.transport.allRegions")
            }}</span>
            <template v-if="dataForm.isFreeFee===0">
              <span
                v-if="
                  (!scope.row.addrNameList || !scope.row.addrNameList.length)
                "
              >{{ $t("delivery.transport.pleaseSelectADeliveryArea") }}
              </span>
              <span>
                <el-tag
                  v-for="(city, index) in scope.row.addrNameList"
                  :key="index"
                  style="margin:4px;"
                >{{ city }}</el-tag>
              </span>
              <el-button
                type="primary"
                link
                @click="onAddOrUpdate(`${scope.$index}`)"
              >
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="scope.$index > 0"
                type="primary"
                link
                @click="onDelete(`${scope.$index}`)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </template>
          </template>
        </el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[0]"
        >
          <template #default="scope">
            <div class="input-con">
              <el-form-item
                :prop="`transFees.${scope.$index}.firstPiece`"
                label-width="0px"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[0]}${$t('table.noNull')}`,
                  },
                ]"
              >
                <el-input
                  v-model="scope.row.firstPiece"
                  :disabled="!scope.row.status && scope.$index === 0"
                  :min="1"
                  :max="1000000000"
                  oninput="if(value.length>10)value=value.slice(0,10)"
                  @change="checkChargeType(scope.row,'firstPiece',dataForm.chargeType)"
                />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[1]"
        >
          <template #default="scope">
            <div class="input-con">
              <el-form-item
                :prop="`transFees.${scope.$index}.firstFee`"
                label-width="0px"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[1]}${$t('table.noNull')}`,
                  },
                ]"
              >
                <el-input-number
                  v-model="scope.row.firstFee"
                  :disabled="!scope.row.status && scope.$index === 0"
                  :precision="2"
                  :min="0"
                  :max="1000000000"
                />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[2]"
        >
          <template #default="scope">
            <div class="input-con">
              <el-form-item
                :prop="`transFees.${scope.$index}.continuousPiece`"
                label-width="0px"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[2]}${$t('table.noNull')}`,
                  },
                ]"
              >
                <el-input
                  v-model="scope.row.continuousPiece"
                  :disabled="!scope.row.status && scope.$index === 0"
                  oninput="if(value.length>10)value=value.slice(0,10)"
                  @change="checkChargeType(scope.row,'continuousPiece',dataForm.chargeType)"
                />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[3]"
        >
          <template #default="scope">
            <div class="input-con">
              <el-form-item
                :prop="`transFees.${scope.$index}.continuousFee`"
                label-width="0px"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[3]}${$t('table.noNull')}`,
                  },
                ]"
              >
                <el-input-number
                  v-model="scope.row.continuousFee"
                  :precision="2"
                  :min="0"
                  :max="1000000000"
                  :disabled="!scope.row.status && scope.$index === 0"
                />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="dataForm.isFreeFee === 0"
        style="margin-top: 20px"
      >
        <el-button
          type="primary"
          @click="addTransfee()"
        >
          {{ $t("delivery.transport.addAreaAndShipping") }}
        </el-button>
      </div>
      <el-checkbox
        v-if="!dataForm.isFreeFee"
        v-model="dataForm.hasFreeCondition"
        style="margin-top: 10px; font-size: 50px"
        @change="handleCheckChange"
      >
        {{ $t("delivery.transport.freeShippingOnSpecifiedConditions") }}
      </el-checkbox>
      <el-table
        v-if="dataForm.hasFreeCondition && !dataForm.isFreeFee"
        :data="dataForm.transFeeFrees"
        border
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        class="condition-table"
        style="width: 100%"
      >
        <!-- 显示动态显示省市区 -->
        <el-table-column
          header-align="center"
          align="center"
          :label="$t('delivery.transport.selArea')"
        >
          <template #default="scope">
            <span
              v-if="
                !scope.row.freeAddrNameList ||
                  !scope.row.freeAddrNameList.length
              "
            >{{ $t("delivery.transport.selCity") }}</span>
            <el-tag
              v-for="(city, index) in scope.row.freeAddrNameList"
              :key="index"
              style="margin:4px;"
            >
              {{ city }}
            </el-tag>
            <el-button
              type="primary"
              link
              @click="addOrUpdateTransfeeFree(`${scope.$index}`)"
            >
              {{ $t("table.edit") }}
            </el-button>
            <el-button
              v-if="scope.$index > 0"
              type="primary"
              link
              @click="deleteTransfeeFree(`${scope.$index}`)"
            >
              {{ $t("table.delete") }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="$t('delivery.transport.setShopPrice')"
        >
          <template #default="scope">
            <el-radio-group v-model="scope.row.freeType">
              <el-radio
                :label="0"
              >
                {{ $t("delivery.transport.fullPieces")
                }}{{ $t("delivery.transport.freeShipping") }}
              </el-radio>
              <el-radio :label="1">
                {{
                  $t("delivery.transport.freeShiullAmount")
                }}
              </el-radio>
              <el-radio
                :label="2"
              >
                {{ $t("delivery.transport.fullPieces")
                }}{{ $t("delivery.transport.further")
                }}{{ $t("delivery.transport.freeShiullAmount") }}
              </el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="left"
        >
          <template #default="scope">
            <div class="condition-input-con">
              <el-form-item
                v-if="scope.row.freeType === 1 || scope.row.freeType === 2"
                :prop="`transFeeFrees.${scope.$index}.amount`"
                label-width="0px"
                :rules="[{ required: true, message: `${$t('table.noNull')}` }]"
              >
                <el-input
                  v-model="scope.row.amount"
                  :precision="2"
                  :min="0"
                  oninput="if(value.length>10)value=value.slice(0,10)"
                  @change="convertPrice(scope.row,'amount')"
                >
                  <template #prepend>
                    {{
                      $t("delivery.transport.full")
                    }}
                  </template>
                  <template
                    #append
                  >
                    {{ $t("delivery.transport.dollar")
                    }}{{ $t("delivery.transport.freeShipping") }}
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="scope.row.freeType === 0 || scope.row.freeType === 2"
                :prop="`transFeeFrees.${scope.$index}.piece`"
                label-width="0px"
                :rules="[{ required: true, message: `${$t('table.noNull')}` }]"
              >
                <el-input
                  v-model="scope.row.piece"
                  oninput="if(value.length>10)value=value.slice(0,10)"
                  @change="checkChargeType(scope.row,'piece',dataForm.chargeType)"
                >
                  <template #prepend>
                    {{
                      $t("delivery.transport.full")
                    }}
                  </template>
                  <template #append>
                    {{
                      $t("delivery.transport.pwvFree")
                    }}
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="dataForm.isFreeFee === 0"
        style="margin-top: 20px"
      >
        <el-button
          type="primary"
          :disabled="!dataForm.hasFreeCondition"
          @click="addTransfeeFree()"
        >
          {{
            $t("delivery.transport.clickToAddTheSpecifiedShippingConditions")
          }}
        </el-button>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="visible = false"
        >{{
          $t("table.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >{{
          $t("table.confirm")
        }}</el-button>
      </span>
    </template>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </el-dialog>
</template>

<script setup>
import { areaNameList } from '@/utils/addr.js'
import AddOrUpdate from '../transcity-add-or-update/index.vue'
import * as api from '@/api/delivery/transport.js'
import Big from 'big.js'
import { ElMessage } from 'element-plus'
import { Debounce } from '@/utils/debounce'

const emit = defineEmits(['refreshDataList'])

const dataForm = ref({
  hasFreeCondition: false,
  transName: '',
  createTime: '',
  chargeType: 0,
  transportId: 0,
  isFreeFee: 0,
  transFees: [{ cityList: [], addrNameList: [], status: 1 }],
  transFeeFrees: [{ freeCityList: [], freeAddrNameList: [] }]
})
const tableTitle = computed(() => {
  const titles = [
    [
      $t('delivery.transport.firstPiece'),
      $t('delivery.transport.transportationCost'),
      $t('delivery.transport.continuationPiece'),
      $t('delivery.transport.continuationCost')
    ],
    [
      $t('delivery.transport.firstWeight'),
      $t('delivery.transport.transportationCost'),
      $t('delivery.transport.continuedWeight'),
      $t('delivery.transport.continuationCost')
    ],
    [
      $t('delivery.transport.firstVolume'),
      $t('delivery.transport.transportationCost'),
      $t('delivery.transport.continuedVolume'),
      $t('delivery.transport.continuationCost')
    ]
  ]
  if (dataForm.value.chargeType) {
    return titles[dataForm.value.chargeType]
  }
  return titles[0]
})

const visible = ref(false)
const addOrUpdateVisible = ref(false)
watch(() => visible.value, (val) => {
  if (!val) {
    addOrUpdateVisible.value = false
  }
})

watch(() => dataForm.value.isFreeFee, () => {
  handleBinAreas()
}, { deep: true })

/**
 * 切换 指定条件包邮 勾选状态
 */
const handleCheckChange = (hasFreeCondition) => {
  if (!hasFreeCondition) {
    dataForm.value.transFeeFrees = []
    addTransfeeFree()
  }
}

const dataFormRef = ref(null)
let transfeesBin = [] // 可配送区域运费，禁止选中列表
let transfeeFreesBin = [] // 指定条件包邮，禁止选中列表
const init = (id) => {
  visible.value = true
  dataForm.value.transportId = id || 0
  nextTick(() => {
    dataFormRef.value?.resetFields()
    dataForm.value = {
      hasFreeCondition: false,
      transName: '',
      createTime: '',
      chargeType: 0,
      transportId: 0,
      isFreeFee: 0,
      transFees: [{ cityList: [], addrNameList: [], status: 1 }],
      transFeeFrees: [{ freeCityList: [], freeAddrNameList: [] }]
    }
  })
  transfeesBin = []
  transfeeFreesBin = []
  getTransport()
}

// 收费方式切换
const changeChargeType = (type) => {
  dataForm.value.transFees.forEach(item => {
    item.firstPiece && checkChargeType(item, 'firstPiece', type)
    item.continuousPiece && checkChargeType(item, 'continuousPiece', type)
  })
  dataForm.value.transFeeFrees.forEach(item => {
    item.piece && checkChargeType(item, 'piece', type)
  })
}

// 价格格式化
const convertPrice = (row, attr) => {
  const price = +checkAmount(row[attr])
  row[attr] = price.toFixed(2)
}

// 根据收费方式格式化输入的值
const checkChargeType = (row, attr, chargeType) => {
  // 0：按件数  1：按重量  2：按体积
  if (chargeType === 0) {
    const number = getNumber(row[attr])
    row[attr] = number > 0 ? number : 1
  } else if (chargeType === 1 || chargeType === 2) {
    const price = +checkAmount(row[attr])
    row[attr] = price.toFixed(2)
  }
}

/**
 * 保留整数并小于零的数设为0
 */
const getNumber = (num) => {
  num = Math.round(num)
  return num < 0 ? 0 : num
}

const checkAmount = (data) => {
  const reg = /^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/
  let num = data
  if (!reg.test(data)) {
    num = formatPrice(formatPrice(data), 1)
  }
  if (num < 0) {
    num = 1
  }
  return num
}

const getTransport = () => {
  if (dataForm.value.transportId) {
    api.get(dataForm.value.transportId).then((data) => {
      // 获取运费模板数据
      getAreaListInfo()
      if (data.isFreeFee) {
        data.transFees[0].status = 0
      } else {
        data.transFees[0].status = 1
      }
      dataForm.value = data
      dataForm.value.transFees.forEach((transFee) => {
        const continuousFeeActual = new Big(transFee.continuousFee)
        const firstFeeActual = new Big(transFee.firstFee)
        transFee.continuousFee = continuousFeeActual.div(100)
        transFee.firstFee = firstFeeActual.div(100)
      })
      dataForm.value.transFeeFrees.forEach(element => {
        element.amount = parseFloat(new Big(element.amount || 0).div(100))
      })
      if (!dataForm.value.transFeeFrees.length) {
        dataForm.value.transFeeFrees = [{ freeCityList: [], freeAddrNameList: [] }]
      }
      dataForm.value.hasFreeCondition = !!data.hasFreeCondition
      handleBinAreas()
    })
  } else {
    getAreaListInfo()
    handleBinAreas()
  }
}

const getDataList = (row, cityList, type) => {
  if (type === 0) {
    dataForm.value.transFees[row].cityList = cityList
    dataForm.value.transFees[row].addrNameList = setAddrInfoByAreaList(cityList)
  }
  if (type === 1) {
    dataForm.value.transFeeFrees[row].freeCityList = cityList
    dataForm.value.transFeeFrees[row].freeAddrNameList = setAddrInfoByAreaList(cityList)
  }
  handleBinAreas()
}

let areaListDB = []
/**
 * 获取省市区信息
 */
const getAreaListInfo = () => {
  api.listAreaInfo().then((data) => {
    areaListDB = data
    if (dataForm.value.transFees.length > 0) {
      getAreaListByType(0)
    }
    if (dataForm.value.transFeeFrees.length > 0) {
      getAreaListByType(1)
    }
  })
}

const getAreaListByType = (type) => {
  if (type === 0) {
    for (let t = 0; t < dataForm.value.transFees.length; t++) {
      dataForm.value.transFees[t].addrNameList = setAddrInfoByAreaList(
        dataForm.value.transFees[t].cityList
      )
    }
  }
  if (type === 1) {
    for (let f = 0; f < dataForm.value.transFeeFrees.length; f++) {
      dataForm.value.transFeeFrees[f].freeAddrNameList = setAddrInfoByAreaList(
        dataForm.value.transFeeFrees[f].freeCityList
      )
    }
  }
}

/**
 * 将运费模板中的地址存入地址列表中
 */
const setAddrInfoByAreaList = (cityList) => {
  const areaList = JSON.parse(JSON.stringify(areaListDB))
  return areaNameList(areaList, cityList)
}

// 添加运费项
const addTransfee = () => {
  dataForm.value.transFees.push({
    cityList: [],
    status: 1
  })
}

// 删除运费项
const onDelete = (rowIndex) => {
  dataForm.value.transFees.splice(rowIndex, 1)
  handleBinAreas()
}

const addOrUpdateRef = ref(null)
// 可配送区域和运费编辑
const onAddOrUpdate = (rowIndex) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(
      rowIndex,
      dataForm.value.transFees[rowIndex].cityList || [],
      0,
      transfeesBin
    )
  })
}

// 添加指定包邮条件
const addTransfeeFree = () => {
  dataForm.value.transFeeFrees.push({
    freeCityList: []
  })
}

// 删除指定包邮条件
const deleteTransfeeFree = (rowIndex) => {
  dataForm.value.transFeeFrees.splice(rowIndex, 1)
  handleBinAreas()
}

// 指定包邮条件编辑
const addOrUpdateTransfeeFree = (rowIndex) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(
      rowIndex,
      dataForm.value.transFeeFrees[rowIndex].freeCityList || [],
      1,
      transfeeFreesBin
    )
  })
}

/**
 * 验证指定区域是否设置包邮条件
 */
const checkTransfeeFrees = () => {
  let isTrue = true
  if (dataForm.value.transFeeFrees.length > 0) {
    dataForm.value.transFeeFrees.forEach((element) => {
      if (!element.freeType && element.freeType !== 0) {
        isTrue = false
      }
    })
  }
  return isTrue
}

// 设置不可选中
const handleBinAreas = () => {
  transfeesBin = []
  transfeeFreesBin = []
  const transFees = dataForm.value.transFees
  const transFeeFrees = dataForm.value.transFeeFrees
  if (transFees.length > 0) {
    transFees.forEach((i) => {
      if (i.cityList.length > 0) {
        i.cityList.forEach((j) => {
          if (!judgeArrHaving(transfeesBin, j)) {
            transfeesBin.push(j.areaId)
          }
        })
      }
    })
  }
  if (transFeeFrees.length > 0) {
    transFeeFrees.forEach((i) => {
      if (i.freeCityList.length > 0) {
        i.freeCityList.forEach((j) => {
          if (!judgeArrHaving(transfeeFreesBin, j)) {
            transfeeFreesBin.push(j.areaId)
          }
        })
      }
    })
  }
}

const judgeArrHaving = (arr, data) => {
  let isExist = false
  if (arr.length < 1) {
    return isExist
  }
  if (arr.includes(data.areaId)) {
    isExist = true
  }
  return isExist
}

const emptyCityHint = () => {
  ElMessage({
    message: $t('delivery.transport.pleaseSelectADeliveryArea'),
    type: 'error',
    duration: 1500
  })
}

// 填写信息提示
const formWriteHint = () => {
  ElMessage({
    message: $t('delivery.transport.pleaseWriteInfo'),
    type: 'error',
    duration: 1500
  })
}

// 表单提交
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      formWriteHint()
    }
    if (valid) {
      const transFeesLen = dataForm.value.transFees.length || 0
      if (!transFeesLen) {
        emptyCityHint()
        return
      }

      for (let i = 0; i < transFeesLen; i++) {
        const transfee = dataForm.value.transFees[i]
        if (transfee.cityList.length === 0 && dataForm.value.isFreeFee === 0) {
          emptyCityHint()
          return
        }
      }

      if (
        dataForm.value.isFreeFee === 0 &&
        dataForm.value.hasFreeCondition &&
        !checkTransfeeFrees()
      ) {
        ElMessage.error(
          $t('delivery.transport.setRegionalConditions')
        )
        return
      }
      const hasFreeConditionPar = dataForm.value.hasFreeCondition ? '1' : '0'
      const dataFormPar = JSON.parse(JSON.stringify(dataForm.value))
      dataFormPar.transFees.forEach((transFee) => {
        const continuousFeeActual = new Big(transFee.continuousFee)
        const firstFeeActual = new Big(transFee.firstFee)
        transFee.continuousFee = continuousFeeActual.times(100)
        transFee.firstFee = firstFeeActual.times(100)
      })
      dataFormPar.transFeeFrees.forEach(element => {
        if (element.amount) {
          element.amount = new Big(element.amount).times(100)
        }
      })
      dataFormPar.hasFreeCondition = hasFreeConditionPar
      const request = dataFormPar.transportId ? api.update(dataFormPar) : api.save(dataFormPar)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
            dataFormRef.value?.resetFields()
          }
        })
      })
    }
  })
})

defineExpose({ init })

</script>

<style lang="scss" scoped>
.component-transport-container {
  .input-con {
    display: flex;
    justify-content: center;
    padding-top: 22px;
    &::v-deep(.el-input-number--small) {
      width: auto;
    }
  }

  .condition-table {
    .condition-input-con {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
