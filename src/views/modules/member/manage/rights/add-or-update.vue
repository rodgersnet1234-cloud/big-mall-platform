<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.rightsId? $t('table.edit'): '新增'"
    top="4vh"
    class="coupon-dialog"
    :close-on-press-escape="false"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item
        :label="$t('user.rights.rightsName')"
        prop="rightsName"
      >
        <el-input
          v-model="dataForm.rightsName"
          :placeholder="$t('user.rights.enterContent')"
          maxlength="6"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="权益类型"
        prop="rightsType"
      >
        <el-select
          v-model="dataForm.rightsType"
          placeholder="请选择"
          :disabled="!!dataForm.rightsId"
          style="width:100%"
          @change="onSelectRightsType(dataForm.rightsType)"
        >
          <el-option
            v-for="item in rightsTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('user.rights.rightsIcon')"
        prop="icon"
      >
        <div style="width: 120px; height: 120px">
          <img-upload v-model="dataForm.icon" />
        </div>
      </el-form-item>
      <div
        v-if="dataForm.rightsType !== 0"
        class="prods-select-body"
      >
        <el-form-item
          v-if="dataForm.rightsType === 0 || dataForm.rightsType === 5"
          label="包邮类型"
          prop="freeFeeType"
          class="discount-body"
        >
          <el-radio-group v-model="dataForm.freeFeeType">
            <el-radio :label="2">
              自营店包邮
            </el-radio>
            <el-radio :label="1">
              全平台包邮
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataForm.rightsType === 0 || dataForm.rightsType === 1"
          :label="$t('user.level.pointFeedbackRate')"
          prop="rateScore"
        >
          <el-input-number
            v-model="dataForm.rateScore"
            :placeholder="$t('user.level.enterMagnification')"
            :min="0"
            :max="99.9"
            :precision="1"
            style="width: 200px;"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          v-if="dataForm.rightsType === 0 || dataForm.rightsType === 2 "
          :label="$t('user.level.coupons')"
          prop="couponList"
        >
          <template v-if="dataForm.isCoupon">
            <span>
              <el-button
                link
                type="primary"
                @click.prevent="conpouSelectHandle()"
              >{{ $t("user.level.selectCoupons") }}</el-button>
              <el-tooltip
                v-if="couponList.length > 0"
                class="item"
                effect="dark"
                content="注意：已选择的优惠券过期或取消投放时，列表中该优惠券会被移除"
                placement="top"
              >
                <i class="el-icon-warning" />
              </el-tooltip>
            </span>
            <el-table
              v-if="couponList.length > 0"
              :data="couponList"
              height="200"
              style="width: 100%"
            >
              <el-table-column
                :label="$t('user.recharge.couponName')"
                width="180"
              >
                <template #default="scope">
                  <span style="margin-left: 10px">{{
                    scope.row.couponName
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('user.recharge.couponUpperLimit')"
                width="140"
              >
                <template #default="scope">
                  <span style="margin-left: 10px">{{ scope.row.limitNum }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('table.actions')"
                width="180"
              >
                <template #default="scope">
                  <el-button
                    type="danger"
                    @click="onDeleteCoupon(scope.$index)"
                  >
                    {{ $t("table.delete") }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <el-form-item
          v-if="dataForm.rightsType === 0 || dataForm.rightsType === 3"
          :label="$t('user.level.bonusPoints')"
          prop="presScore"
        >
          <el-input-number
            v-model="dataForm.presScore"
            :placeholder="$t('user.level.enterInteger')"
            :min="0"
            :max="999999"
            style="width: 200px;"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item
          v-if="dataForm.rightsType === 0 || dataForm.rightsType === 4"
          label="折扣范围"
          prop="discountRange"
          class="discount-body"
        >
          <el-radio-group v-model="dataForm.discountRange">
            <el-radio :label="0">
              {{ $t("user.level.platform") }}
            </el-radio>
            <el-radio :label="1">
              {{ $t("user.level.selfShop") }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataForm.rightsType === 0 || dataForm.rightsType === 4"
          label="会员折扣"
          prop="discountRange"
          class="discount-body"
        >
          <el-input-number
            v-model.number="dataForm.discount"
            :placeholder="$t('user.level.discountRange')"
            :min="0.0"
            :max="10"
            :precision="1"
            style="width: 200px;"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          v-if="dataForm.isDiscount && dataForm.discountType === 1"
          prop="categoryIds"
        >
          <el-tree
            ref="categoryTreeRef"
            :data="categoryList"
            :props="categoryListTreeProps"
            node-key="categoryId"
            show-checkbox
          />
        </el-form-item>
        <!-- </el-form> -->
        <coupon-select
          v-if="couponSelectVisible"
          ref="couponSelectRef"
          :get-way="1"
          @refresh-select-coupon-list="onSelectDistributionCoupon"
        />
      </div>
      <el-form-item
        :label="$t('user.rights.rightsIntroduce')"
        prop="description"
      >
        <el-input
          v-model="dataForm.description"
          maxlength="6"
          show-word-limit
          :placeholder="$t('user.rights.rightsIntroduce')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.rights.sequence')"
        prop="seq"
      >
        <el-input
          v-model="dataForm.seq"
          :placeholder="$t('user.rights.errorIntegerTip')"
          type="number"
          precision="0"
          @change="onSetShopGetScore"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.rights.rightDetail')"
        prop="details"
      >
        <tiny-mce
          v-if="visible"
          ref="detailsRef"
          v-model="dataForm.details"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/user/user-rights.js'
import ImgUpload from '@/components/img-upload/index.vue'
import CouponSelect from '@/components/coupon-select/index.vue'
import { ElMessage } from 'element-plus'
import TinyMce from '@/components/tiny-mce/index.vue'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const couponSelectVisible = ref(false)
const dataForm = ref({
  couponIds: [],
  rightsId: null,
  rightsName: null,
  rightsType: null,
  icon: '',
  description: null,
  details: null,
  seq: 1,
  rateScore: 0,
  isRateScore: false, // 积分倍率  1
  freeFeeType: 2,
  isCoupon: false, // 优惠券 2
  presScore: 0,
  isPresScore: false, // 赠送积分 3
  isDiscount: false, // 4.会员折扣
  discountRange: 0
})
let isSubmit = false
// eslint-disable-next-line no-unused-vars
const validate = (rule, value, callback) => {
  const reg = /<p>(&nbsp;|&nbsp;\s+)+<\/p>|<p>(<br>)+<\/p>/g
  if (value.trim() === '' || reg.test(value)) {
    callback(new Error('输入内容不能为空'))
  } else {
    callback()
  }
}
const dataRule = {
  rightsName: [
    { required: true, message: $t('user.rights.nameCanNotEmpty'), trigger: 'blur' },
    { validator: validate, trigger: 'blur' }
  ],
  rightsType: [
    { required: true, message: '权益类型不能为空', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: $t('user.rights.iconCanNotEmpty'), trigger: 'blur' }
  ],
  description: [
    { required: true, message: $t('user.rights.intrCanNotEmpty'), trigger: 'blur' },
    { validator: validate, trigger: 'blur' }
  ],
  details: [
    { required: true, message: '权益详情不能为空', trigger: 'blur' },
    { validator: validate, trigger: 'blur' }
  ]
}
// [0.自定义 1.积分回馈倍率 2.优惠券 3.积分赠送(数量) 4.折扣范围(全平台、自营店) 5.会员折扣 6.包邮类型]
const rightsTypeList = [{
  value: 0,
  label: '自定义'
}, {
  value: 1,
  label: '积分回馈倍率',
  icon: ''
}, {
  value: 2,
  label: '优惠券',
  icon: ''
}, {
  value: 3,
  label: '积分赠送',
  icon: ''
}, {
  value: 4,
  label: '会员折扣',
  icon: ''
}, {
  value: 5,
  label: '包邮类型',
  icon: ''
}]
const couponList = ref([])

const dataFormRef = ref(null)
const detailsRef = ref(null)
const onInit = (rightsId) => {
  onInitFrom()
  dataForm.value.rightsId = rightsId || null
  visible.value = true
  isSubmit = false
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.value.rightsId) {
      return
    }
    api.get(rightsId).then(data => {
      dataForm.value = data
      dataForm.value.details = data.details || ''
      dataForm.value.discount = dataForm.value.discount / 10
      dataForm.value.rateScore = dataForm.value.rateScore / 10
      couponList.value = data.couponList.filter(item => {
        return item.status === 1
      })
      if (dataForm.value.discount !== null && dataForm.value.rightsType !== 0) {
        dataForm.value.isDiscount = true
      }
      if (dataForm.value.presScore !== null && dataForm.value.rightsType !== 0) {
        dataForm.value.isPresScore = true
      }
      if (dataForm.value.rateScore !== null && dataForm.value.rightsType !== 0) {
        dataForm.value.isRateScore = true
      }
      if (dataForm.value.rightsType === 1) {
        dataForm.value.isRateScore = true
      }
      if (dataForm.value.rightsType === 2) {
        dataForm.value.isCoupon = true
      }
      if (dataForm.value.rightsType === 3) {
        dataForm.value.isPresScore = true
      }
      if (dataForm.value.rightsType === 4) {
        dataForm.value.isDiscount = true
      }
    })
  })
}
const onInitFrom = () => {
  dataForm.value = {
    couponIds: [],
    rightsId: null,
    rightsName: null,
    rightsType: null,
    icon: '',
    description: '',
    details: '',
    seq: 1,
    rateScore: 0,
    isRateScore: false, // 积分倍率  1
    freeFeeType: 2,
    isCoupon: false, // 优惠券 2
    presScore: 0,
    isPresScore: false, // 赠送积分 3
    isDiscount: false, // 会员折扣 5
    discountRange: 0
  }
  couponList.value = []
}

// 选择自定义时初始化数据
const onSelectRightsType = (rightsType) => {
  dataForm.value.rightsType = rightsType
  if (rightsType === 1) {
    dataForm.value.isRateScore = true
  }
  if (rightsType === 2) {
    dataForm.value.isCoupon = true
  }
  if (rightsType === 3) {
    dataForm.value.isPresScore = true
  }
  if (rightsType === 4) {
    dataForm.value.isDiscount = true
  }
  if (rightsType === 0) {
    dataForm.value.couponIds = []
    dataForm.value.rightsType = 0
    dataForm.value.rateScore = 0
    dataForm.value.isRateScore = false
    dataForm.value.freeFeeType = 1
    dataForm.value.isCoupon = false
    dataForm.value.presScore = 0
    dataForm.value.isPresScore = false
    dataForm.value.isDiscount = false
    dataForm.value.discountRange = 0
    dataForm.value.couponList = []
  }
  if (rightsType !== 0) {
    dataForm.value.rightsType = rightsType
  }
}

// 顺序数值判断
const onSetShopGetScore = () => {
  const num = Math.round(dataForm.value.seq)
  dataForm.value.seq = num < 1 ? 1 : num
  if (num >= 100000000) {
    dataForm.value.seq = 100000000
  }
}
/**
 * 表单提交
 */
const onSubmit = () => {
  dataForm.value.couponIds = []
  if (dataForm.value.isCoupon && (dataForm.value.rightsType === 2 || dataForm.value.rightsType === 0) && couponList.value.length) {
    couponList.value.forEach(item => {
      dataForm.value.couponIds.push(item.couponId)
    })
  }
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    if (isSubmit) {
      return
    }

    const param = { ...dataForm.value }

    param.discount = param.discount * 10 || 0.0
    param.rateScore = param.rateScore * 10
    isSubmit = true
    const request = dataForm.value.rightsId ? api.update(param) : api.save(param)
    request.then(() => {
      isSubmit = true
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
    }).catch(() => {
      isSubmit = false
    })
  })
}
/**
 * 显示添加指定优惠券弹框
 */
const couponSelectRef = ref(null)
const conpouSelectHandle = () => {
  couponSelectVisible.value = true
  nextTick(() => {
    couponSelectRef.value.onInit(couponList.value)
  })
}
// 删除选中的优惠券
const onDeleteCoupon = (index) => {
  couponList.value.splice(index, 1)
}
/**
 * 优惠券选择回调
 */
const onSelectDistributionCoupon = (coupons) => {
  if (coupons.length > 0) {
    couponList.value = coupons
  } else {
    couponList.value = []
  }
}
defineExpose({ onInit })
</script>

<style lang="scss" scoped>

.coupon-dialog {
  :deep(.el-dialog) {
    margin-bottom: 30px;
    min-width: 800px;
  }
  :deep(.el-dialog__body) {
    padding: 30px !important;
  }
  :deep(.el-form-item--medium .el-form-item__label) {
    text-align: right;
  }

}
</style>
