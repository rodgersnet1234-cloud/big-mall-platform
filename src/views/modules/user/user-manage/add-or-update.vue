<template>
  <div class="user-manager-info">
    <el-dialog
      v-model="visible"
      :title="!dataForm.userId ? $t('table.add') : $t('table.edit')"
      :close-on-click-modal="false"
      class="user-update-dialog"
      width="70%"
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        @submit.prevent
      >
        <el-divider content-position="left">
          <h3>{{ $t("user.userManager.userInformation") }}</h3>
        </el-divider>
        <el-container
          height="160px"
          style="margin-top:20px"
        >
          <el-aside
            width="230px"
            style="background-color: rgb(255, 255, 255)"
          >
            <el-row>
              <el-col :span="10">
                <div style="font-size: 14px;color:#606266;line-height:1">
                  用户头像：
                </div>
              </el-col>
              <el-col :span="14">
                <div>
                  <img
                    v-if="!dataForm.pic"
                    src="@/assets/images/user_img.jpg"
                    width="130"
                    height="130"
                    alt=""
                  >
                  <img
                    v-else
                    :src="(dataForm.pic).indexOf('http')===-1 ? resourcesUrl + dataForm.pic : dataForm.pic"
                    class="image"
                    width="130"
                    height="130"
                    alt=""
                    @error="dataForm.pic=''"
                  >
                </div>
              </el-col>
            </el-row>
          </el-aside>
          <el-container>
            <el-main>
              <el-row>
                <el-col
                  :span="7"
                  justify="start"
                >
                  <el-form-item
                    :label="$t('user.userManager.nickName') + ':'"
                    prop="nickName"
                  >
                    <span v-if="nameVisible">{{ dataForm.nickName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="$t('table.status') + ':'"

                    prop="status"
                  >
                    <span v-if="dataForm.status === 0">{{
                      $t("table.disable")
                    }}</span>
                    <span v-if="dataForm.status === 1">{{
                      $t("user.userManager.normal")
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item
                    :label="$t('user.userManager.registrationTime') + ':'"
                    prop="userRegtime"
                  >
                    <span>{{ dataForm.createTime }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-main>
            <el-footer>
              <el-row class="user-info">
                <!-- <el-col :span="$t('language') == 'language' ? 4 : 3"> -->
                <!-- 发放优惠券 -->
                <div class="user-info-item">
                  <el-button
                    v-permission="['user:user:sendCoupons']"
                    type="primary"
                    @click="onUpdateCoupon()"
                  >
                    {{ $t("user.userManager.sendCoupons") }}
                  </el-button>
                </div>
                <!-- <el-col :span="$t('language') == 'language' ? 4 : 3"> -->
                <!-- 修改用户昵称 -->
                <div class="user-info-item">
                  <el-button
                    v-permission="['user:user:update']"
                    type="primary"
                    @click="onUpdateUserInfo()"
                  >
                    修改用户信息
                  </el-button>
                </div>
                <!-- 给用户打标签 -->
                <div class="user-info-item">
                  <el-button
                    v-permission="['user:user:tagging']"
                    type="primary"
                    @click="onUpdateTags()"
                  >
                    {{ $t("user.userManager.tagging") }}
                  </el-button>
                </div>
              </el-row>
            </el-footer>
          </el-container>
        </el-container>
        <!-- 客户标签 -->
        <el-form-item
          :label="$t('user.userManager.customerLabel') + '：'"
          prop="userTagParam"
          style="margin-left:28px;margin-bottom:35px;"
        >
          <div v-if="userTag.length > 0">
            <el-tag
              v-for="tag in userTag"
              :key="tag.tagId"
              :closable="tag.tagType === 0"
              :disable-transitions="false"
              @close="onHandleClose(tag)"
            >
              {{ tag.tagName }}
            </el-tag>
          </div>
        </el-form-item>
        <!-- 账户资产 -->
        <el-divider content-position="left">
          <h3>{{ $t("user.userManager.accountAssets") }}</h3>
        </el-divider>
        <el-container>
          <el-main>
            <!-- 储值账户 -->
            <div>
              <h4>{{ $t("user.userManager.accountWallet") }}</h4>
              <div>
                <span>{{ $t("user.userManager.currentBalance") }}：{{ dataForm.currentBalance }}</span>
                <span style="margin-left: 60px">{{ $t("user.userManager.cumulativeBalances") }}：{{ dataForm.sumBalance }}</span>
                <span style="margin-left: 60px">{{ $t("user.userManager.rechargeAmount") }}：{{ dataForm.rechargeAmount }}</span>
                <span style="margin-left: 60px">{{ $t("user.userManager.rechargeTimes") }}：{{ dataForm.rechargeTimes }}</span>
              </div>
            </div>
            <!-- /储值账户 -->

            <!-- 积分 -->
            <div>
              <h4>{{ $t("user.userManager.score") }}</h4>
              <div>
                <span>{{ $t("user.userManager.currentScore") }}：{{ dataForm.score }}</span>
                <span style="margin-left: 60px">{{ $t("user.userManager.cumulativeScore") }}：{{ dataForm.sumScore }}</span>
              </div>
            </div>
            <!-- /积分 -->

            <!-- 优惠券 -->
            <div>
              <h4>
                {{ $t("user.userManager.coupons") }}
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="$t('user.userManager.couponTip3')"
                >
                  <template #reference>
                    <i class="el-icon-question" />
                  </template>
                </el-popover>
              </h4>
              <div>
                <span>{{ $t("user.userManager.notUsed") }}：{{ couponUserParam.couponUsableNums }}</span>
                <span style="margin-left: 60px">{{ $t("user.userManager.used") }}：{{ couponUserParam.couponUsedNums }}</span>
                <span style="margin-left: 60px">{{ $t("user.userManager.invalid") }}：{{ couponUserParam.couponExpiredNums }}</span>
              </div>
            </div>
            <!-- /优惠券 -->
          </el-main>
        </el-container>
        <el-divider content-position="left">
          <h3>{{ $t("user.userManager.otherInfo") }}</h3>
        </el-divider>
      </el-form>
      <div>
        <el-tabs>
          <!-- 交易明细 -->
          <el-tab-pane :label="$t('user.userManager.tradeDetails')">
            <trade-detail ref="tradeDetailRef" />
          </el-tab-pane>
          <!-- 积分明细 -->
          <el-tab-pane :label="$t('user.userManager.scoreDetails')">
            <score-detail ref="scoreDetailRef" />
          </el-tab-pane>
          <!-- 余额明细 -->
          <el-tab-pane :label="$t('user.userManager.balanceDetails')">
            <balance-detail ref="balanceDetailRef" />
          </el-tab-pane>
          <!-- 优惠券明细 -->
          <el-tab-pane :label="$t('user.userManager.couponDetails')">
            <coupon-detail ref="couponDetailRef" />
          </el-tab-pane>
          <!-- 成长值明细 -->
          <el-tab-pane :label="$t('user.userManager.growthLog')">
            <growth-detail ref="growthDetailRef" />
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="visible = false"
          >
            {{ $t("table.cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 送优惠券弹窗 -->
    <update-coupon
      v-if="updateCouponVisible"
      ref="updateCouponRef"
      :get-way="1"
      @refresh-data-list="refreshChange"
    />
    <!-- 打标签弹窗 -->
    <update-tags
      v-if="updateTagsVisible"
      ref="updateTagsRef"
      @refresh-data-list="refreshChange"
    />
    <!-- 修改用户基本信息 -->
    <update-user-info
      v-if="updateUserInfoVisible"
      ref="updateUserInfoRef"
      @refresh-user-info="refreshInfo"
    />
  </div>
</template>

<script setup>
import UpdateCoupon from './components/update-user-copon.vue'
import UpdateTags from './components/update-user-tags.vue'
import TradeDetail from './components/trade-detail.vue'
import ScoreDetail from './components/score-detail.vue'
import BalanceDetail from './components/balance-detail.vue'
import CouponDetail from './components/coupon-detail.vue'
import GrowthDetail from './components/growth-detail.vue'
import UpdateUserInfo from './components/update-user-info.vue'
import * as api from '@/api/user/user-manager'
import { deleteUserTag } from '@/api/user/user-tag-user'

const emit = defineEmits(['refreshDataList'])

const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const visible = ref(false)
let isSubmit = false
const nameVisible = ref(true)
const updateCouponVisible = ref(false)
const updateUserInfoVisible = ref(false)
const updateTagsVisible = ref(false)
const dataForm = ref({
  userId: 0,
  nickName: '',
  pic: '',
  status: 1
})
const couponUserParam = ref({
  couponUsableNums: 0,
  couponUsedNums: 0,
  couponExpiredNums: 0
})

const userTag = ref([{ agId: 0, tagName: null }])

const onInit = (id) => {
  dataForm.value.userId = id || 0
  visible.value = true
  isSubmit = false
  nextTick(() => {
    if (dataForm.value.userId) {
      if (isSubmit) {
        return
      }
      isSubmit = true
      api.getUserInfo(dataForm.value.userId).then(data => {
        dataForm.value = data
        couponUserParam.value = dataForm.value.couponUserCountDataVO
        userTag.value = dataForm.value.userTagList
        onInitTradeDetail(dataForm.value.userId)
        onInitScoreDetail(dataForm.value.userId)
        onInitBalanceDetail(dataForm.value.userId)
        onInitCouponDetail(dataForm.value.userId)
        onInitGrowthDetail(dataForm.value.userId)
      }).catch(() => {
        isSubmit = false
      })
    }
  })
}
// 修改后刷新
const refreshChange = () => {
  onInit(dataForm.value.userId)
}
// 移除标签
const onHandleClose = (tag) => {
  deleteUserTag({ userId: dataForm.value.userId, userTagId: tag.tagId }).then(() => {
    onInit(dataForm.value.userId)
  })
}

// 打标签
const updateTagsRef = ref(null)
const onUpdateTags = (id) => {
  const ids = id ? [id] : [dataForm.value.userId]
  updateTagsVisible.value = true
  nextTick(() => {
    updateTagsRef.value?.onInit(ids)
  })
}
// 送优惠券
const updateCouponRef = ref(null)
const onUpdateCoupon = (id) => {
  const ids = id ? [id] : [dataForm.value.userId]
  updateCouponVisible.value = true
  nextTick(() => {
    updateCouponRef.value?.onInit(ids)
  })
}
// 送优惠券
const updateUserInfoRef = ref(null)

const onUpdateUserInfo = () => {
  updateUserInfoVisible.value = true
  nextTick(() => {
    updateUserInfoRef.value?.onInit(dataForm.value)
  })
}
// 调用交易信息组件方法
const tradeDetailRef = ref(null)
const onInitTradeDetail = (id) => {
  tradeDetailRef.value?.onInit(id)
}
// 调用积分详情组件方法
const scoreDetailRef = ref(null)
const onInitScoreDetail = (id) => {
  scoreDetailRef.value?.onInit(id)
}
// 余额明细
const balanceDetailRef = ref(null)
const onInitBalanceDetail = (id) => {
  balanceDetailRef.value?.onInit(id)
}
// 优惠券明细
const couponDetailRef = ref(null)
const onInitCouponDetail = (id) => {
  couponDetailRef.value?.onInit(id)
}
// 调用成长值记录组件方法
const growthDetailRef = ref(null)
const onInitGrowthDetail = (id) => {
  growthDetailRef.value?.onInit(id)
}
// 修改名称或者状态完成后刷新详情
const refreshInfo = () => {
  onInit(dataForm.value.userId)
  emit('refreshDataList')
}
defineExpose({ onInit })
</script>

<style lang="scss" scoped>
.user-manager-info {
  .user-update-dialog {
    align-items: center;

  }

  .user-info {
    display: flex;
    justify-content: flex-start;
    .user-info-item {
      display: flex;
      justify-content: flex-start;
      margin-right: 30px;
    }
  }
}
:deep(.el-main-top) {
  padding-top: 0;
}
:deep(.el-tag) {
  margin-right: 10px;
}
</style>
