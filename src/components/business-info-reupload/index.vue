
<template>
  <el-dialog
    v-model="dialogVisible"
    title="影印件上传"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="500px"
  >
    <el-alert
      :title="msg"
      type="error"
      show-icon
      style="margin-bottom: 20px;"
    />
    <el-form
      ref="companyInfoFormRef"
      :model="companyInfoForm"
      :rules="companyInfoRule"
      label-width="140px"
      class="business-info"
      @submit.prevent
    >
      <el-form-item
        label="营业执照电子版"
        prop="businessLicense"
      >
        <div class="business-license-box">
          <div class="license-content">
            <img-upload v-model="companyInfoForm.businessLicense" />
            <div class="example-box">
              <img src="@/assets/example-img/Business-license.png">
              <div class="tips">
                示例
              </div>
            </div>
          </div>
          <div class="upload-tips">
            仅限jpg、gif、png，仅限上传1张
          </div>
        </div>
      </el-form-item>
      <div class="id-box">
        <div class="upload-content">
          <div class="upload-img">
            <el-form-item
              class="idcard"
              label="法人身份证"
              prop="identityCardFront"
            >
              <img-upload v-model="companyInfoForm.identityCardFront" />
            </el-form-item>
            <el-form-item
              class="idcard"
              label-width="0"
              prop="identityCardLater"
            >
              <img-upload v-model="companyInfoForm.identityCardLater" />
            </el-form-item>
          </div>
          <div class="upload-example">
            <div class="example-box">
              <img src="@/assets/example-img/idcard1.png">
              <div class="tips">
                人像面示例
              </div>
            </div>
            <div class="example-box">
              <img src="@/assets/example-img/idcard2.png">
              <div class="tips">
                国徽面示例
              </div>
            </div>
          </div>
          <div class="upload-tips">
            请上传身份证正反面照片，仅限jpg、gif、png，仅限上传2张
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          上传
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { Debounce } from '@/utils/debounce'
import ImgUpload from '@/components/img-upload/index.vue'
import * as shopApi from '@/api/platform/audit-shop'
import * as supplierApi from '@/api/platform/audit-supplier'
import { ElMessage } from 'element-plus'

const props = defineProps({
  companyId: {
    type: Number,
    default: 0
  },
  shopId: {
    type: Number,
    default: 0
  },
  supplierId: {
    type: Number,
    default: 0
  }
})

const companyInfoFormRef = ref(null)
const dialogVisible = ref(false)
const companyInfoForm = reactive({
  businessLicense: '',
  identityCardFront: '',
  identityCardLater: ''
})
const idCardCollectProcessStatus = ref(-1) // 影印件采集审核状态 0.未上传 1.待审核 2.只有工商认证通过 3.只有法人信息通过 4.均审核通过
const msg = ref('') // 提示信息
const companyInfoRule = () => {
  return {
    businessLicense: [
      { required: true, message: '请上传营业执照电子版', trigger: 'change' }
    ],
    identityCardFront: [
      { required: true, message: '请上传法人身份证人像面', trigger: 'change' }
    ],
    identityCardLater: [
      { required: true, message: '请上传法人身份证国徽面', trigger: 'change' }
    ]
  }
}

const init = (data) => {
  dialogVisible.value = true
  idCardCollectProcessStatus.value = data
  if (data === 0) {
    msg.value = '审核未通过，请重新上传'
  } else if (data === 2) {
    msg.value = '法人身份证审核失败，请重新上传'
  } else if (data === 3) {
    msg.value = '工商营业执照审核失败，请重新上传'
  }
  nextTick(() => {
    companyInfoFormRef.value?.resetFields()
  })
}
const submitForm = Debounce(function () {
  const request = ref(null)
  if (props.shopId) {
    companyInfoForm.shopId = props.shopId
    companyInfoForm.shopCompanyId = props.companyId
    request.value = shopApi.reUploadIdCard(companyInfoForm)
  } else if (props.supplierId) {
    companyInfoForm.supplierId = props.supplierId
    companyInfoForm.supplierCompanyId = props.companyId
    request.value = supplierApi.reUploadIdCard(companyInfoForm)
  }
  companyInfoFormRef.value?.validate(valid => {
    if (valid) {
      request((data) => {
        ElMessage({
          message: data,
          type: 'success',
          onClose: () => {
            // 上传成功后，刷新页面
            location.reload()
          }
        })
      })
    }
  })
}, 1500)

</script>

<style lang="scss" scoped>

  .business-license-box {
    .license-content {
      display: flex;
      height: 120px;
    }
  }
  .id-box {
    .upload-content {
      .upload-img {
        display: flex;
        div {
          &:nth-child(2) {
            margin-left: 20px;
          }
        }
      }
      .upload-example {
        display: flex;
        // margin-top: 15px;
        margin-left: 140px;
        .example-box {
          margin-left: 0;
          &:nth-child(2) {
            margin-left: 20px;
          }
        }
      }
      .upload-tips {
        margin-left: 140px;
      }
    }
  }

  // 示例框
  .example-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 120px;
    background: #FFFFFF;
    border: 1px solid #EAEAEA;
    border-radius: 3px;
    box-sizing: border-box;
    margin-left: 20px;
    img {
      display: block;
      width: auto;
      max-width: 100%;
      height: auto;
      max-height: 100%;
    }
    .tips {
      position: absolute;
      left: -1px;
      bottom: 0;
      width: 120px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      background: rgba(51, 51, 51, 0.5);
      text-align: center;
      border-radius: 0px 0px 3px 3px;
    }
  }

  .upload-tips {
    font-size: 12px;
    color: #999;
    line-height: 1.5em;
    margin-top: 10px;
  }

  // 图片上传框样式修改
  :deep(.el-upload) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 121px;
    background: #FFFFFF;
    border: 1px solid #EAEAEA;
    border-radius: 3px;
    box-sizing: border-box;
    .el-icon-plus {
      font-size: 22px;
      color: #EAEAEA;
    }
  }
</style>
