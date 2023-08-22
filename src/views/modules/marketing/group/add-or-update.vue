<template>
  <el-dialog
    v-model="visible"
    :title="$t('table.view')"
  >
    <el-form
      :model="dataForm"
      label-position="right"
      label-width="130px"
      style="margin-left:50px;"
      @submit.prevent
    >
      <!-- 活动名称 -->
      <el-form-item
        :label="$t('group.activityName')"
        prop="activityName"
      >
        <el-input
          v-model="dataForm.activityName"
          maxlength="30"
          show-word-limit
          :disabled="true"
        />
      </el-form-item>
      <!-- 活动开始时间（活动状态：未开始、经行中、已结束） -->
      <el-form-item
        :label="$t('group.startTime')"
        prop="startTime"
      >
        <el-date-picker
          v-model="dataForm.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          class="date-picker"
          :disabled="true"
          :placeholder="$t('group.selectEventStartTime')"
        />
      </el-form-item>
      <!-- 活动结束时间（活动状态：未开始、经行中、已结束） -->
      <el-form-item
        :label="$t('group.endTime')"
        prop="endTime"
      >
        <el-date-picker
          v-model="dataForm.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          class="date-picker"
          :disabled="true"
          :placeholder="$t('group.selectEventEndTime')"
        />
      </el-form-item>
      <!-- 成团人数 -->
      <el-form-item
        :label="$t('group.groupNumber')"
        prop="groupNumber"
      >
        <el-input
          v-model="dataForm.groupNumber"
          type="number"
          min="2"
          max="1000000000"
          :disabled="true"
          class="groupActivity-input"
        >
          <template #append>
            {{ $t("group.people") }}
          </template>
        </el-input>
      </el-form-item>
      <!-- 商品是否限购（1:限购、0:不限购） -->
      <el-form-item
        :label="$t('group.hasMaxNum')"
        prop="hasMaxNum"
      >
        <el-radio-group
          v-model="dataForm.hasMaxNum"
          :disabled="true"
        >
          <el-radio :label="0">
            {{ $t("group.close") }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("group.open") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 限购数量 -->
      <el-form-item
        v-if="dataForm.hasMaxNum"
        :label="$t('group.maxNum')"
        prop="maxNum"
      >
        <el-input
          v-model="dataForm.maxNum"
          type="number"
          :disabled="true"
          min="1"
          max="100000000"
          class="groupActivity-input"
        >
          <template #append>
            {{ $t("group.memberPeople") }}
          </template>
        </el-input>
      </el-form-item>
      <!-- 是否模拟成团（1:模拟参团、0:不模拟） -->
      <el-form-item
        :label="$t('group.hasRobot')"
        prop="hasRobot"
      >
        <div>
          <el-radio-group
            v-model="dataForm.hasRobot"
            :disabled="true"
          >
            <el-radio :label="0">
              {{ $t("group.close") }}
            </el-radio>
            <el-radio :label="1">
              {{ $t("group.open") }}
            </el-radio>
          </el-radio-group>
          <el-tooltip
            :content="$t('group.tip5')"
            placement="top"
            class="tips"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </el-form-item>
      <!-- 是否开启凑团模式（1:凑团、0:不凑团） -->
      <el-form-item
        :label="$t('group.hasGroupTip')"
        prop="hasGroupTip"
      >
        <el-radio-group
          v-model="dataForm.hasGroupTip"
          :disabled="true"
        >
          <el-radio :label="0">
            {{ $t("group.close") }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("group.open") }}
          </el-radio>
        </el-radio-group>
        <el-tooltip
          :content="$t('group.tip8')"
          placement="top"
          class="tips"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </el-form-item>
      <!-- 活动是否预热 -->
      <el-form-item
        :label="$t('group.isPreheat')"
        prop="isPreheat"
      >
        <el-radio-group
          v-model="dataForm.isPreheat"
          :disabled="true"
        >
          <el-radio :label="0">
            {{ $t("group.close") }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("group.open") }}
          </el-radio>
        </el-radio-group>
        <el-tooltip
          :content="$t('group.tip9')"
          placement="top"
          class="tips"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </el-form-item>
      <!-- 商品选择框 -->
      <el-form-item
        :label="$t('group.selectProd')"
        prop="spuId"
      >
        <!-- 商品 -->
        <div v-if="dataForm.spuId">
          <el-card
            v-for="item in spus"
            :key="item.spuId"
            :body-style="{ padding: '0px' }"
            style="height: 160px;width: 120px"
          >
            <ImgShow
              :src="item.mainImgUrl"
              :img-style="{height: '104px', width: '100%'}"
            />
            <div class="card-prod-bottom">
              <span class="card-prod-name">{{ item.spuName }}</span>
              <el-button
                link
                type="primary"
                class="card-prod-name-button"
                :disabled="true"
              >
                删除
              </el-button>
            </div>
          </el-card>
        </div>
        <!-- 商品sku列表 -->
        <div v-if="skus && skus.length > 0">
          <el-table
            :data="skus"
            header-cell-class-name="table-header"
            style="width: 100%"
          >
            <el-table-column label="sku名称">
              <template #default="scope">
                <span>{{ scope.row.skuName || spus[scope.$index].spuName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动价格">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.actPrice"
                  :min="0.01"
                  :max="100000000"
                  :disabled="true"
                  class="groupActivity-input"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="visible = !visible"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import Big from 'big.js'
import * as api from '@/api/group/group'

const visible = ref(false)
const skus = ref([])
const spus = ref([])
const dataForm = reactive({
  groupActivityId: 0,
  shopId: null,
  activityName: null,
  startTime: null,
  endTime: null,
  groupNumber: null,
  hasMaxNum: 0,
  maxNum: null,
  hasRobot: 0,
  hasLeaderPrice: 0,
  isPreheat: 0,
  hasGroupTip: 0,
  spuId: null,
  status: null
})

const init = (groupActivityId) => {
  dataForm.groupActivityId = groupActivityId || 0
  visible.value = true
  skus.value = []
  spus.value = []
  nextTick(() => {
    if (!dataForm.groupActivityId) {
      return
    }
    api.get(groupActivityId).then(data => {
      spus.value = [{
        spuId: data.spuId,
        spuName: data.spuName,
        mainImgUrl: data.mainImgUrl
      }]
      data.groupSkuList.forEach(sku => {
        skus.value.push({
          skuId: sku.skuId,
          skuName: sku.skuName,
          actPrice: new Big(sku.actPrice ? sku.actPrice : 0).div(100),
          leaderPrice: new Big(sku.leaderPrice ? sku.leaderPrice : 0).div(100),
          sellNum: sku.sellNum
        })
      })
      dataForm.groupActivityId = data.groupActivityId
      dataForm.shopId = data.shopId
      dataForm.activityName = data.activityName
      dataForm.startTime = data.startTime
      dataForm.endTime = data.endTime
      dataForm.groupNumber = data.groupNumber
      dataForm.hasMaxNum = data.hasMaxNum
      dataForm.maxNum = data.maxNum
      dataForm.hasRobot = data.hasRobot
      dataForm.isPreheat = data.isPreheat
      dataForm.hasGroupTip = data.hasGroupTip
      dataForm.spuId = data.spuId
      dataForm.status = data.status
    })
  })
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
:deep(.el-form-item__content){
  display: block;
}
.tips {
  margin-left: 20px;
}
// 商品
:deep(.el-card) {
  display: inline-block;
  margin-top: 10px;
  margin-right: 10px;
}
.card-prod-bottom {
  position: relative;
  text-align: left;
  top: -15px;

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
</style>
