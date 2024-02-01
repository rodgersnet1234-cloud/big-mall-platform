<template>
  <el-dialog
    v-model="visible"
    title="工商信息变更申请"
    :append-to-body="true"

    :close-on-click-modal="false"
    top="10vh"
    width="70%"
    class="shop-in-category-pup-dialog"
  >
    <div class="popup">
      <!-- 修改信息 -->
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="modifyInformationRef"
        label-width="140px"
        :model="modifyInformation"
        @submit.prevent
      >
        <div class="ci-wrapper">
          <div class="left-item-wrap">
            <el-form-item
              label="统一社会信用代码："
              required
            >
              {{ modifyInformation.creditCode }}
            </el-form-item>
            <el-form-item
              label="企业名称："
              required
            >
              {{ modifyInformation.firmName }}
            </el-form-item>
            <el-form-item
              label="法定代表人："
              required
            >
              {{ modifyInformation.representative }}
            </el-form-item>
            <el-form-item
              label="注册资本："
              :class="{'txt-null': !modifyInformation.capital}"
            >
              {{ isItemNull(modifyInformation.capital) }}
            </el-form-item>
            <el-form-item
              label="住所："
              :class="{'txt-null': !modifyInformation.residence}"
            >
              {{ isItemNull(modifyInformation.residence) }}
            </el-form-item>
            <el-form-item
              label="成立日期："
              :class="{'txt-null': !modifyInformation.foundTime}"
            >
              {{ isItemNull(modifyInformation.foundTime) }}
            </el-form-item>
            <el-form-item
              label="营业期限："
              required
            >
              {{ modifyInformation.startTime.slice(0,10) + ' - ' + (!modifyInformation.endTime ? '无固定期限' : modifyInformation.endTime.slice(0, 10)) }}
            </el-form-item>
            <el-form-item
              label="经营范围："
              required
            >
              <span class="business-scope">{{ modifyInformation.businessScope }}</span>
            </el-form-item>
          </div>
          <div class="right-item-wrap">
            <!-- 右侧图片 -->
            <el-form-item
              label="营业执照电子版："
              required
            >
              <div class="business-license-box">
                <div class="logo-image-box">
                  <el-image
                    v-if="modifyInformation.businessLicense"
                    class="logo-image"
                    :src="checkFileUrl(modifyInformation.businessLicense)"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="~@/assets/images/def.png"
                      >
                    </template>
                  </el-image>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="法人身份证："
              required
            >
              <div class="business-license-box">
                <div class="logo-image-box">
                  <el-image
                    v-if="modifyInformation.identityCardFront"
                    class="logo-image"
                    :src="checkFileUrl(modifyInformation.identityCardFront)"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="~@/assets/images/def.png"
                      >
                    </template>
                  </el-image>
                  <el-image
                    v-if="modifyInformation.identityCardLater"
                    class="logo-image"
                    :src="checkFileUrl(modifyInformation.identityCardLater)"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="~@/assets/images/def.png"
                      >
                    </template>
                  </el-image>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- 审核状态 -->
      <div class="audit-status-wrap">
        <div class="left-item">
          审核状态：
        </div>
        <el-radio
          v-model="auditRadio"
          disabled
          label="0"
        >
          未审核
        </el-radio>
        <el-radio
          v-model="auditRadio"
          label="1"
        >
          已通过
        </el-radio>
        <el-radio
          v-model="auditRadio"
          label="-1"
        >
          未通过
        </el-radio>
      </div>
      <div
        v-show="auditRadio == -1"
        class="audit-status-wrap"
      >
        <div class="left-item">
          <span>拒绝原因：</span>
        </div>
        <el-input
          v-model="modifyInformation.remarks"
          type="textarea"
          show-word-limit
          maxlength="50"
          placeholder="拒绝原因"
        />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="close-btn"
          @click="closePop"
        >取消</el-button>
        <el-button
          type="primary"
          @click="auditInfor"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/platform/audit-shop'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['closePop'])

const isItemNull = computed(() => {
  return function (val) {
    if (val) return val
    return '暂无'
  }
})

// 店铺id
const shopId = ref('')
// 控制显示
const visible = ref(false)
// 审核状态选择
const auditRadio = ref('0')
const modifyInformation = ref({
  creditCode: '',
  firmName: '',
  representative: '',
  capital: '',
  residence: '',
  foundTime: '',
  startTime: '',
  endTime: '',
  businessScope: '',
  businessLicense: '',
  identityCardFront: '',
  identityCardLater: '',
  remarks: ''
})

watch(() => visible.value, (val) => {
  if (val) return
  closePop()
})

const init = (id) => {
  if (id) {
    shopId.value = id
    getauditInfor()
  }
  visible.value = true
}
// 获取审核信息
const getauditInfor = () => {
  if (shopId.value === 0) return
  api.getShopCompanyAuditingAuditInfo({ shopId: shopId.value }).then(data => {
    nextTick(() => {
      modifyInformation.value = { ...data.shopCompanyVO, ...data }
    })
  }).catch(() => {
  })
}
// 审核确认
const auditInfor = () => {
  if (auditRadio.value === '0') {
    return ElMessage({
      message: '请选择审核状态',
      type: 'error',
      duration: 1500
    })
  }
  if (auditRadio.value == -1) {
    if (!modifyInformation.value.remarks) {
      return ElMessage({
        message: '请填写拒绝原因',
        type: 'error',
        duration: 1500
      })
    }
  }

  const passData = {}
  passData.status = parseInt(auditRadio.value)
  passData.companyAuditingId = modifyInformation.value.companyAuditingId
  passData.shopCompanyId = modifyInformation.value.shopCompanyId
  passData.shopId = modifyInformation.value.shopId
  passData.remarks = modifyInformation.value.remarks

  api.updateShopCompanyAuditingAudit(passData).then(() => {
    ElMessage({
      message: '工商信息变更申请审核成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        closePop()
      }
    })
  }).catch(() => {
    closePop()
  })
}
const closePop = () => {
  if (visible.value) visible.value = false
  emit('closePop')
}

defineExpose({ init })
</script>

<style lang="scss" scoped>
  .shop-in-category-pup-dialog {
    & ::v-deep(.el-dialog) {
      min-width: 950px;
    }
    .popup {
      display: block;
      color: #606266;
      font-size: 14px;
      .audit-status-wrap{
        height: 90px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .audit-status-wrap {
        justify-content: flex-start;
        .left-item {
          min-width: 80px;
          text-align: right;
        }
      }
      .logo-image-box {
        height: 98px;
        display: flex;
        flex-wrap: nowrap;
      }
      .logo-image {
        width: 98px;
        height: 98px;
      }
      .logo-image:not(.logo-image:first-child) {
        margin-left: 20px;
      }

      .ci-wrapper {
        display: flex;
        justify-content: space-evenly;
        .left-item-wrap {
          width: 50%;
          .business-scope {
            line-break: anywhere;
          }
        }
        .right-item-wrap {
          width: 50%;
        }
      }
    }
  }
  .txt-null {
    color: #999;
  }
  .close-btn {
    border-color: #155bd4;
    color: #155bd4;
  }
  .audit-status-wrap .left-item span::before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
  ::v-deep(.el-form-item__label) {
    min-width: 160px;
    text-align: right;
  }
  div ::v-deep(.el-form-item__label) {
    min-width: 150px;
  }
</style>
