<template>
  <div class="page-information-config">
    <div
      class="wx-applet"
    >
      <div
        class="label-item"
        style="margin-right:80px"
      >
        <img
          src="@/assets/images/Payment_Illustration.png"
          alt=""
        >
        <div class="top-text">
          支付信息配置
        </div>
        <!-- 主体认证 -->
        <div
          v-if="query.type=='subject'"
          class="bottom-text"
        >
          填写主体相关信息，由服务商协助开通微信支付
        </div>
        <!-- 非主体认证 -->
        <div
          v-else-if="query.type=='NonSubSelfManage'||query.type=='notSubject'"
          class="bottom-text"
        >
          根据实际业务场景按需填写相关支付配置信息
        </div>
        <router-link :to="query.type=='NonSubSelfManage'||query.type=='notSubject'?'pay-config':'subject-certification'">
          <el-button
            style="margin-top:60px"
          >
            选择
          </el-button>
        </router-link>
      </div>
      <div
        class="label-item"
        style="margin-right:80px"
      >
        <img
          src="@/assets/images/Authorized-illustration.png"
          alt=""
        >
        <div class="top-text">
          微信信息配置
        </div>
        <!-- 主体认证 -->
        <div
          v-if="query.type=='subject'||query.type=='notSubject'"
          class="bottom-text"
        >
          扫码授权微信小程序/公众号，由服务商进行更新升级
        </div>
        <!-- 非主体认证 -->
        <div
          v-else-if="query.type=='NonSubSelfManage'"
          class="bottom-text"
        >
          填写微信小程序/公众号相关配置信息并自行开发管理
        </div>
        <router-link :to="query.type=='NonSubSelfManage'?'self-manage':''">
          <el-button
            style="margin-top:60px"
          >
            选择
          </el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
const { query } = useRoute()
</script>
<style lang="scss" scoped>
.page-information-config{
  width: 100%;
  min-height: 950px;
  background: #FFFFFF;
  border-radius: 2px;
  .wx-applet{
   display: flex;
   padding: 248px 165px;
   :deep(.el-button){
    color: #155BD4;
    width: 124px;
    border: 1px solid #155BD4;
    border-radius: 2px;
  }
  }
  .label-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 620px;
    height: 454px;;
    border: 1px solid #E3E2E5;
    border-radius: 5px;
    padding: 80px 10px 60px 10px;
    .top-text{
      height: 24px;
      line-height: 21px;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
      color: #333333;
      margin: 20px 0 10px 0;
    }
    .bottom-text{
      height: 18px;
      line-height: 16px;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
      color: #666666;
    }
  }
}
</style>
