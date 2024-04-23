<template>
  <div class="discount-manage app-container">
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="120px"
      style="width: 700px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('discount.discount.actName')"
        prop="discountName"
        :rules="[{ required: true, message: $t('table.noNull') }]"
      >
        <el-input
          v-model="dataForm.discountName"
          maxlength="50"
          show-word-limit
          :placeholder="$t('discount.discount.actName')"
          disabled
        />
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.mobiltyDiagram') + '（710*260）'"
        prop="mobilePic"
      >
        <el-image
          style="width: 100px; height: 100px"
          :src="checkFileUrl(dataForm.mobilePic)"
          :preview-src-list="checkFileUrl(dataForm.mobilePicL)"
        >
          <template #error>
            <img
              class="img-slot"
              src="~@/assets/images/def.png"
            >
          </template>
        </el-image>
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.pcActivityListChart') + '（590*240）'"
        prop="pcPic"
      >
        <el-image
          style="width: 100px; height: 100px"
          :src="checkFileUrl(dataForm.pcPic)"
          :preview-src-list="checkFileUrl(dataForm.pcPicL)"
        >
          <template #error>
            <img
              class="img-slot"
              src="~@/assets/images/def.png"
            >
          </template>
        </el-image>
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.pcActiviroundMap') + '（1200*360）'"
        prop="pcBackgroundPic"
      >
        <el-image
          style="width: 100px; height: 100px"
          :src="checkFileUrl(dataForm.pcBackgroundPic)"
          :preview-src-list="[checkFileUrl(dataForm.pcBackgroundPicL)]"
        >
          <template #error>
            <img
              class="img-slot"
              src="~@/assets/images/def.png"
            >
          </template>
        </el-image>
      </el-form-item>
      <el-form-item :label="$t('discount.discount.activTime')">
        <div class="activ-time">
          <el-form-item
            prop="startTime"
          >
            <el-date-picker
              v-model="dataForm.startTime"
              type="datetime"
              :placeholder="$t('discount.discount.chooseStartDate')"
              value-format="YYYY-MM-DD HH:mm:ss"
              disabled
            />
          </el-form-item>
          <div class="underline">
            -
          </div>
          <el-form-item
            prop="endTime"
          >
            <el-date-picker
              v-model="dataForm.endTime"
              type="datetime"
              :placeholder="$t('discount.discount.chooseEndDate')"
              value-format="YYYY-MM-DD HH:mm:ss"
              disabled
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.typeOfActivity')"
        prop="discountRule"
      >
        <el-radio-group
          v-model="dataForm.discountRule"
          :disabled="!!dataForm.discountId"
        >
          <el-radio :label="0">
            {{ $t("discount.discount.fullMoneoney") }}
          </el-radio>
          <el-radio :label="3">
            {{ $t("discount.discount.fullDiscount") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.discountRule === 0 || dataForm.discountRule === 1"
        :label="$t('discount.discount.typeOfExemption')"
        prop="discountType"
      >
        <el-radio-group
          v-model="dataForm.discountType"
          disabled
        >
          <el-radio :label="0">
            {{
              $t("discount.discount.decreaseOestLevel")
            }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("discount.discount.decreaeryTime") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 卡片 START -->
      <el-form-item :label="$t('discount.discount.offerContent')">
        <el-card
          v-for="(discountItem, index) in dataForm.discountItemList"
          :key="discountItem.discountItemId"
          class="box-card"
          style="margin-bottom: 30px"
        >
          <template #header>
            <div
              v-if="!dataForm.discountType"
              class="clearfix"
            >
              <span>{{ $t("discount.discount.activityLevel") }} {{ index + 1 }}</span>
            </div>
          </template>
          <el-form-item
            class="text item"
            :label="$t('discount.discount.conditionsOfUse')"
            style="margin-bottom: 20px"
            :rules="[{ required: true, message: $t('table.noNull') }]"
          >
            <el-input
              v-model="discountItem.needAmount"
              type="number"
              style="width: 250px"
              disabled
            >
              <template #prepend>
                <span v-if="dataForm.discountType === 1">{{
                  $t("discount.discount.everyFull")
                }}</span>
                <span v-else>{{ $t("discount.discount.full") }}</span>
              </template>
              <template #append>
                {{ discountItemTexts[0] }}
              </template>
            </el-input>
            <div>
              <span style="color:#c0c4cf">{{
                $t("discount.discount.pleaseEnteThan0")
              }}</span>
              <el-tooltip
                v-if="dataForm.discountType === 0"
                style="margin-left:6px"
                class="item"
                effect="light"
                placement="top"
              >
                <template #content>
                  <div>{{ $t("discount.discount.conditionsOfUseIn") }}</div>
                </template>
                <span>
                  <el-icon><QuestionFilled /></el-icon>
                </span>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item
            class="text item"
            :label="$t('discount.discount.discountedPrice')"
            :rules="[{ required: true, message: $t('table.noNull') }]"
          >
            <el-input
              v-model="discountItem.discount"
              type="number"
              style="width: 200px"
              disabled
            >
              <template #prepend>
                <span
                  v-if="dataForm.discountRule < 2"
                >{{ $t("discount.discount.reducea") }}</span>
                <span
                  v-else
                >{{ $t("discount.discount.dozen") }}</span>
              </template>
              <template #append>
                {{ discountItemTexts[1] }}
              </template>
            </el-input>
            <div
              v-if="dataForm.discountRule <2"
              style="color:#c0c4cf"
            >
              {{ $t("discount.discount.pleaseThan0") }}
            </div>
            <div
              v-else
              style="color:#c0c4cf"
            >
              {{ $t("discount.discount.pleaseEnterTheNumber010") }}
            </div>
          </el-form-item>
        </el-card>
      </el-form-item>
      <!-- 卡片 END -->
      <el-form-item>
        <el-button
          v-if="dataForm.discountType === 0"
          plain
          disabled
        >
          {{ $t("discount.discount.addAct") }}
        </el-button>
      </el-form-item>
      <el-form-item
        v-if="dataForm.discountRule >= 2 || dataForm.discountType !== 0"
        :label="$t('discount.discount.maximumDiscountAmount')"
        prop="maxReduceAmount"
        :rules="[{ required: true, message: $t('table.noNull') }]"
      >
        <el-input
          v-model="dataForm.maxReduceAmount"
          type="number"
          :placeholder="$t('discount.discount.maximumDiscountAmount')"
          :max="9999999999999"
          disabled
        />
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.applicableProductType')"
        prop="suitableSpuType"
        :rules="[{ required: true, message: $t('table.noNull') }]"
      >
        <el-radio-group
          v-model="dataForm.suitableSpuType"
          disabled
        >
          <el-radio :label="0">
            {{ $t("discount.discount.allProdsPar") }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("discount.discount.participateInD") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.suitableSpuType !== 0"
        style="width: 900px"
        class="prods-box"
      >
        <el-row>
          <el-col
            v-for="(discountProd, index) in discountProds"
            :key="index"
            :span="4"
            style="margin-bottom: 10px;"
          >
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 140px; width: 120px"
            >
              <ImgShow
                :src="discountProd.mainImgUrl"
                :img-style="{height: '104px', width: '100%'}"
              />
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{ discountProd.spuName }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 商品 -->
      <el-form-item
        v-if="dataForm.status === 1 || dataForm.status === 0"
        :label="$t('discount.discount.status')"
        prop="status"
      >
        <el-radio-group
          v-model="dataForm.status"
          disabled
        >
          <el-radio :label="1">
            {{ $t("discount.discount.turnOn") }}
          </el-radio>
          <el-radio :label="0">
            {{ $t("discount.discount.close") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{
            $t('table.confirm')
          }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import * as api from '@/api/discount/discount'
import Big from 'big.js'
import { checkFileUrl } from '@/utils/index.js'

const dataForm = reactive({
  discountId: 0,
  discountName: '',
  mobilePic: '',
  pcPic: '',
  pcBackgroundPic: '',
  discountRule: 0,
  discountType: 0,
  suitableSpuType: 0,
  maxReduceAmount: 0,
  shopId: '',
  startTime: '',
  endTime: '',
  status: 1,
  discountItemList: [],
  discountProds: [],
  spuIds: []
})
const discountProds = ref([])
const discountItemTexts = computed(() => {
  const texts = []
  if (dataForm.discountRule === 0 || dataForm.discountRule === 2) {
    texts[0] = $t('unit.dollar')
  } else {
    texts[0] = $t('discount.discount.item')
  }
  if (dataForm.discountRule === 0 || dataForm.discountRule === 1) {
    texts[1] = $t('unit.dollar')
  } else {
    texts[1] = $t('discount.discount.fold')
  }
  return texts
})

onMounted(() => {
  if (useRoute().query.discountId !== undefined) {
    dataForm.discountId = useRoute().query.discountId
  }
  getDataList()
})

const dataFormRef = ref(null)
const getDataList = () => {
  nextTick(() => {
    dataFormRef.value?.resetFields()
    dataForm.discountItemList = [{ needAmount: 1, discount: 0.01 }]
  })
  if (dataForm.discountId) {
    api.get(dataForm.discountId).then(data => {
      dataForm.discountId = data.discountId
      dataForm.discountName = data.discountName
      dataForm.mobilePic = data.mobilePic
      dataForm.pcBackgroundPic = data.pcBackgroundPic
      dataForm.pcPic = data.pcPic
      dataForm.discountRule = data.discountRule
      dataForm.discountType = data.discountType
      dataForm.suitableSpuType = data.suitableSpuType
      dataForm.maxReduceAmount = data.maxReduceAmount
      dataForm.shopId = data.shopId
      dataForm.startTime = data.startTime
      dataForm.endTime = data.endTime
      dataForm.status = data.status
      dataForm.groupActivityId = data.groupActivityId
      dataForm.discountProds = data.discountProds
      dataForm.spuList = data.spuList
      dataForm.discountItemList = data.discountItemList
      dataForm.mobilePicL = [data.mobilePic]
      dataForm.pcPicL = [data.pcPic]
      dataForm.pcBackgroundPicL = [data.pcBackgroundPic]
      discountProds.value = dataForm.spuList
      dataForm.maxReduceAmount = new Big(dataForm.maxReduceAmount).div(100)
      dataForm.discountItemList.forEach(discountItem => {
        discountItem.discount = new Big(discountItem.discount).div(100).toFixed(2)
        discountItem.needAmount = new Big(discountItem.needAmount).div(100).toFixed(2)
      })
    })
  }
}

// 表单提交
const router = useRouter()
const onSubmit = () => {
  router.go(-1)
}

</script>
<style lang="scss" scoped>
:deep(.el-form-item__content){
  display: block;
}
.prods-box {
  .card-prod-bottom {
    .card-prod-name {
      display: block;
      padding: 0 5px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
}
.activ-time {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .underline {
    margin: 0 6px;
  }
}
</style>
