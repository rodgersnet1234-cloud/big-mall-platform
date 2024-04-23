<template>
  <div class="component-wait-page">
    <div class="title-tips">
      <div class="title-right">
        <el-icon color="#155BD4">
          <WarningFilled />
        </el-icon>
        <span>
          申请已受理（2023-07-05），申请单编号：2055645456454546，预计7-15个工作日内将完成审核，高峰期可能会超过预计时间，感谢您的理解
        </span>
      </div>
    </div>
    <div class="content-examine">
      <img
        src="@/assets/images/icon_wait.png"
        alt=""
      >
      <div style="margin:14px 0 20px 0">
        审核中
      </div>
      <el-button
        style="border-color: #155BD4;color: #155BD4;border-radius: 2px 2px 2px 2px;height:32px"
      >
        查看申请资料
      </el-button>
    </div>
    <div class="steps">
      <el-steps
        :active="stepsStatus"
        align-center
        style="width: 100%"
        process-status="wait"
      >
        <el-step
          title="1.提交信息"
          :description="dataForm.submitTime"
          :icon="Select"
        />
        <el-step
          title="2.微信支付审核"
          class="step-state"
          :icon="stepsStatus-1>=2?Select:'undefined'"
        >
          <template #description>
            <div class="step-text">
              正在加急审核中，请您耐心等待...<br>
              请让超级管理员 xxx使用微信扫以下二维码（30天内有效，<br>
              过期后将生成新二维码），完成核对信息后可接收申请单进展通知
            </div>
            <div>
              <img-show
                :src="dataForm.imgUrl"
                style="margin-top:82px;width:150px"
              />
            </div>
          </template>
        </el-step>
        <el-step
          title="3.账户验证"
          :description="dataForm.verificationTime"
          :icon="stepsStatus-1>=3?Select:'undefined'"
        />
        <el-step
          title="4.签署协议"
          :icon="stepsStatus-1>=4?Select:'undefined'"
          :description="signAgreementTime"
        />
        <el-step
          title="5.开通支付权限"
          :icon="stepsStatus-1>=5?Select:'undefined'"
          :description="dataForm.text"
        />
      </el-steps>
    </div>
  </div>
</template>
<script setup>
import { Select } from '@element-plus/icons-vue'
const dataForm = ref({
  submitTime: '2023-07-20 13:57:52',
  verificationTime: '2023-07-20 13:57:52',
  signAgreementTime: '2023-07-20 13:57:52',
  text: '完成签约后，系统将自动开通权限，约30分钟内完成',
  imgUrl: ''
})
const stepsStatus = ref(4)
</script>
<style lang="scss" scoped>
.component-wait-page{
  min-height: 950px;
  background-color: #fff;
  padding: 20px;
  .title-tips{
    display: flex;
    justify-content: space-between;
    width: 100%;
    line-height: 32px;
    font-size: 14px;
    color: #666666;
    background: #E6EFFF;
    border: 1px solid #81A5E4;
    border-radius: 2px;
    padding: 5px 22px;
    margin-bottom: 20px;
    .title-right{
      display: flex;
      align-items: center;
    }
    span{
      margin-left: 3px;
    }
  }
  .content-examine{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin:120px 0 60px 0;
  }
  .steps{
    height: 378px;
    background: #F9FAFB;
    padding: 73px 169px 0 169px;
    position: relative;
    left: 0;
    top: 0;
    .step-text{
      position: absolute;
      right: -40px;
      width: 365px;
      height: 54px;
      line-height: 18px;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
      color: #999999;
    }
    :deep(.el-step__title.is-finish){
      color: #333;
    }
    :deep(.el-step__description){
      color: #999;
    }
  }
  :deep(.el-step.is-center .el-step__line) {
    width: 80%;
    left: 60%;
    right: -50%;
    height: 4px;
    border-radius: 60px 60px 60px 60px;
}
:deep(.el-step__line .el-step__line-inner) {
   height: 4px;
   background: #155BD4;
   border-radius: 60px 60px 60px 60px;
}
:deep(.el-step__icon.is-icon){
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #155BD4;
}
:deep(.el-step__icon){
  color: #fff;
  opacity: 1;
}
:deep(.el-icon.el-step__icon-inner){
  font-size: 16px;
}
:deep(.is-wait .el-step__icon.is-icon){
  background: #D2D2D2;
}
}

</style>
