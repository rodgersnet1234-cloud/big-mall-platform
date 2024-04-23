<template>
  <div class="components-distribution-prod-info">
    <el-dialog
      v-model="visible"
      title="查看"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :label-width="'100px'"
        :disabled="true"
        @submit.prevent
      >
        <el-form-item label="关联商品">
          <div v-if="prodData[0] != null">
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px; width: 120px"
            >
              <ImgShow
                :src="prodData[0].mainImgUrl"
                :img-style="{height: '104px', width: '100%'}"
              />
              <div class="card-prod-bottom card-prod-d">
                <span class="card-prod-name">{{ prodData[0].spuName }}</span>
              </div>
            </el-card>
          </div>
        </el-form-item>

        <div>
          <el-form-item
            label="奖励方式"
            prop="awardType"
          >
            <el-radio-group v-model="dataForm.awardMode">
              <el-radio :label="0">
                按比例奖励
              </el-radio>
              <el-radio :label="1">
                按固定数值奖励
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="top"
                >
                  <template #content>
                    <div>商品实际付款金额(剔除运费)需大于奖励金额，否则分销判定为失效</div>
                  </template>
                  <span>
                    <el-icon><QuestionFilled /></el-icon>
                  </span>
                </el-tooltip>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="间推奖励"
            prop="awardType"
          >
            <el-radio-group v-model="dataForm.parentAwardSet">
              <el-radio :label="0">
                关闭
              </el-radio>
              <el-radio :label="1">
                开启
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="直推奖励"
            prop="awardType"
          >
            <div>
              <el-input
                v-model="dataForm.awardNumbers"
                :precision="2"
                :min="0"
                style="width: 200px"
              >
                <template #append>
                  <span v-if="dataForm.awardMode === 1">{{ $t("admin.dollar") }}</span>
                  <span v-else>%</span>
                </template>
              </el-input>

              <span
                v-if="dataForm.parentAwardSet === 1"
              >&nbsp; 间推奖励</span>
              <el-input
                v-if="dataForm.parentAwardSet === 1"
                v-model="dataForm.parentAwardNumbers"
                :precision="2"
                :min="0"
                style="width: 200px"
              >
                <template #append>
                  <span v-if="dataForm.awardMode === 1">{{ $t("admin.dollar") }}</span>
                  <span v-else>%</span>
                </template>
              </el-input>
            </div>
          </el-form-item>
        </div>

        <el-form-item
          v-if="!editFlag"
          label="'状态' + ':'"
          prop="state"
        >
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="1">
              上架
            </el-radio>
            <el-radio :label="0">
              下架
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="closeDialog()"
          >关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Big from 'big.js'

const emit = defineEmits(['closeDialog'])

const dataForm = reactive({
  spuId: 0,
  state: 1,
  awardMode: 0,
  awardNumbers: '',
  parentAwardNumbers: '',
  parentAwardSet: 0
})
const prodData = ref([])
const visible = ref(false)
const editFlag = ref(null)

const init = (data) => {
  editFlag.value = true
  dataForm.state = data.distributionInfo.state
  dataForm.awardMode = data.distributionInfo.awardMode
  dataForm.awardNumbers = data.distributionInfo.awardNumbers
  dataForm.parentAwardNumbers = data.distributionInfo.parentAwardNumbers
  dataForm.parentAwardSet = data.distributionInfo.parentAwardSet
  dataForm.distributionSpuId = data.distributionInfo.distributionSpuId
  dataForm.spuId = data.spuId
  dataForm.awardNumbers = parseFloat(bigActualTotal(parseFloat(dataForm.awardNumbers), 100)) // 直推价*100
  dataForm.parentAwardNumbers = parseFloat(bigActualTotal(parseFloat(dataForm.parentAwardNumbers), 100)) // 间推价*100
  prodData.value[0] = data
  visible.value = true
}
const closeDialog = () => {
  emit('closeDialog')
}

// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
.components-distribution-prod-info {
  :deep(.el-input__inner) {
    padding: 2px;
    border-radius: 3px;
  }
  :deep(.el-input-group__append,
    .el-input-group__prepend) {
    padding: 0 10px;
  }
}
:deep(.elTable) {
  th {
    padding: 10px 0 !important;
  }
  td {
    padding: 2px 0 !important;
  }
}

.table-template > * {
  display: inline-block;
  margin: auto;
}
.card-prod-bottom {
  display: flex;
  justify-content: space-around;
}
.card-prod-bottom .card-prod-name {
  margin: auto;
  padding: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 118px;
  display: inline-block;
}
.card-prod-d .card-prod-name {
  padding-right: 5px;
}
</style>
