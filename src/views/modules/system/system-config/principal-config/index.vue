<template>
  <div class="page-principal-config">
    <div class="title-text">
      <div class="top-text">
        请选择主体配置方式
      </div>
      <div class="bottom-text">
        请根据实际业务场景选择一种认证方式进行主体配置。认证过程中可随时切换选择其他方式去进行认证，原认证信息将不再保留，认证成功后不再支持切换。
      </div>
    </div>
    <div class="way-card">
      <div class="card-content">
        <div
          v-if="'a'===state"
          class="state-text"
        >
          认证中
        </div>
        <img
          src="@/assets/images/icon_Subject authentication.png"
          alt=""
          style="margin-top:60px"
        >
        <div class="top-text">
          主体认证+授权小程序/公众号
        </div>
        <div class="bottom-text">
          ① 由服务商协助配置微信支付<br>
          ② 由服务商协助管理微信小程序/公众号<br>
          ③ 商城平台与SaaS后台进行线上结算，与商家及<br>
          供应商进行线下结算
        </div>

        <div>
          <router-link
            :to="{path:'information-config',query:{type:'subject'}}"
          >
            <el-button
              type="primary"
            >
              {{ state==='a'?'继续编辑':'立即认证' }}
            </el-button>
          </router-link>
        </div>
      </div>
      <!-- 非主体认证 -->
      <div class="card-content">
        <div
          v-if="'b'===state"
          class="state-text"
        >
          认证中
        </div>
        <img
          src="@/assets/images/icon_Subject authentication2.png"
          alt=""
          style="margin-top:60px"
        >
        <div class="top-text">
          非主体认证+授权小程序/公众号
        </div>
        <div class="bottom-text">
          ① 需自行配置微信支付<br>
          ② 由服务商协助管理微信小程序/公众号<br>
          ③ 商城平台与SaaS后台、入驻商家及供应商都进<br>
          行线下结算
        </div>
        <router-link :to="{path:'information-config',query:{type:'notSubject'}}">
          <el-button
            type="primary"
          >
            立即认证
          </el-button>
        </router-link>
      </div>
      <div class="card-content">
        <div
          v-if="'c'===state"
          class="state-text"
        >
          认证中
        </div>
        <img
          src="@/assets/images/icon_Subject authentication3.png"
          alt=""
          style="margin-top:60px"
        >
        <div class="top-text">
          非主体认证+自行管理小程序/公众号
        </div>
        <div class="bottom-text">
          ① 需自行配置微信支付<br>
          ② 需自行管理微信小程序/公众号<br>
          ③ 商城平台与SaaS后台、入驻商家及供应商都进行<br>
          线下结算
        </div>

        <router-link :to="{path:'information-config',query:{type:'NonSubSelfManage'}}">
          <el-button
            v-if="1==1"
            type="primary"
            @click="loading=true"
          >
            立即认证
          </el-button>
        </router-link>
        <el-button
          v-if="1==2"
          type="primary"
        >
          继续编辑
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
const state = ref('a')

</script>
<style lang="scss" scoped>
.page-principal-config {
  width: 100%;
  min-height: 950px;
  background: #FFFFFF;
  padding: 100px 189px;
  .title-text{
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    .top-text{
      font-size: 22px;
      height: 24px;
      line-height: 24px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
      font-weight: 400;
      color: #333333;
   }
    .bottom-text{
      margin: 20px 0 100px;
      width: 647px;
      height: 42px;
      line-height: 21px;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
      text-align:center;
      color: #666666;
   }
  }

  .way-card{
    display: flex;
    flex-wrap: wrap;
    .card-content{
      position: relative;
      width: 398px;
      height: 482px;
      background: #FBFCFD;
      border-radius: 8px;
      border: 1px solid #DCDFE6;
      display: flex;
      flex-direction: column;
      align-items: center;
      .top-text{
        width: 238px;
        height: 24px;
        font-size: 18px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
        color: #333333;
        line-height: 21px;
        margin: 60px 0 20px;
       }
       .bottom-text{
        height: 84px;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
        font-weight: 400;
        color: #666666;
        line-height: 21px;
      }
      :deep(.el-button){
        width: 124px;
        height: 42px;
        background: #155BD4;
        border-radius: 2px;
        margin: 60px 0;
      }
      &:nth-child(2) {
            margin: 0 30px;
      }
      .state-text{
        position: absolute;
        top: 0;
        right: 0;
        width: 82px;
        height: 30px;
        line-height: 30px;
        background: rgba(81,196,25,0.2);
        border-radius: 0px 8px 0px 8px;
        text-align: center;
        color: #51C419;
      }
    }
  }
}

</style>
