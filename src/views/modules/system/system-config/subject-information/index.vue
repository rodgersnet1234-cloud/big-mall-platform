<template>
  <div class="page-subject-information">
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
    >
      <el-tab-pane
        label="主体信息"
        name="first"
      >
        <div class="basic-info-list">
          <div class="left-info">
            <div class="basic-info-item">
              <p class="tit">
                营业执照照片：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                <img-show
                  style="width:80px;height:80px"
                />
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                注册号：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantAccount' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                营业执照注册地址：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                执照有效期类型：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.shopName ' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                执照生效日期：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                执照失效日期：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactPhone' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                商户名称：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.email' }}
              </p>
            </div>

            <div class="basic-info-item">
              <p class="tit">
                经营者姓名：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.detailAddress' }}
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="经营信息"
        name="second"
      >
        <div class="basic-info-list">
          <div class="left-info">
            <div class="basic-info-item">
              <p class="tit">
                用户简称：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantAccount' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                客服电话：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                经营场景：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.shopName ' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                服务商AppID：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactName' }}
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="行业资质"
        name="third"
      >
        <div class="basic-info-list">
          <div class="left-info">
            <div class="basic-info-item">
              <p class="tit">
                所属行业：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantAccount' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                结算费率：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                特殊资质：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                <img-show style="width:80px;height:80px" />
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                优惠费率活动：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                优惠费率活动值：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                优惠费率活动补充材料：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                <img-show style="width:80px;height:80px;margin-left:10px" />
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="结算账户"
        name="fourth"
      >
        <div class="basic-info-list">
          <div class="left-info">
            <div class="basic-info-item">
              <p class="tit">
                账户类型：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantAccount' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                开户名称：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                开户行：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                开户支行：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                银行账户：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactName' }}
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="超级管理员"
        name="fifth"
      >
        <div class="basic-info-list">
          <div class="left-info">
            <div class="basic-info-item">
              <p class="tit">
                超管身份：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantAccount' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                超管姓名：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                超管身份：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.merchantName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                证件号码：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                手机号码：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactName' }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                邮箱：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ 'shopBasicInfo.contactName' }}
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script  setup>

const activeName = ref('first')
const shopBasicInfo = ref(true)

</script>
<style lang="scss" scoped>
.page-subject-information{
  width: 100%;
  min-height: 950px;
  background: #FFFFFF;
  padding: 20px;
  .basic-info-list {
     display: flex;
     align-items: top;
     justify-content: flex-start;
     width: 100%;
     margin: 20px 0;
     .left-info {
       min-width: 330px;
       width: 550px;
       margin-right: 20px;
       text-align: left;
     }
     .basic-info-item {
       display: flex;
       justify-content: flex-start;
       padding: 15px 30px;
       line-height: 24px;
       .tit {
         width: 145px;
         text-align: right;
       }
       .txt {
         display: block;
         word-break: break-all;
         letter-spacing: 1px;
       }

     }
   }
}
</style>
