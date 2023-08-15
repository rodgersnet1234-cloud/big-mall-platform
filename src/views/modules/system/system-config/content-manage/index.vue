<template>
  <div class="page-content-manage">
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="微信小程序"
        name="first"
      >
        <!-- 授权前 -->
        <div
          v-if="!afterEmpower"
          class="wx-applet"
        >
          <div
            class="label-item"
            style="margin-right:80px"
          >
            <img
              src="@/assets/images/icon_add.png"
              alt=""
            >
            <el-button
              style="margin:50px 0 20px"
              @click="toEmpower"
            >
              已有小程序，去授权
            </el-button>
            <div class="label-messages">
              为保证所有功能的正常使用，授权时 请把所有权限统一授权
            </div>
          </div>
          <div
            class="label-item"
            style="margin:0"
          >
            <img
              src="@/assets/images/icon_create.png"
              alt=""
            >
            <el-button
              style="margin:50px 0 20px"
              @click="toCreated"
            >
              没有小程序，去创建
            </el-button>
            <div class="label-messages">
              请在微信公众平台申请新的公众号， 成功创建后再绑定授权
            </div>
          </div>
        </div>
        <!-- 授权后 -->
        <div
          v-if="!afterEmpower"
          class=" after-empower"
        >
          <img-show style="width:160px;height:160px;margin:93px 0 50px 0" />
          <table>
            <tr class="table-title">
              <td class="tt-item-left">
                {{ '小程序名称' }}
              </td>
              <td class="tt-item">
                {{ '超级无敌大boss' }}
              </td>
            </tr>
            <tr class="table-title">
              <td class="tt-item-left">
                {{ '小程序appid' }}
              </td>
              <td class="tt-item">
                {{ 'kfcvme50898565' }}
              </td>
            </tr>
            <tr class="table-title">
              <td class="tt-item-left">
                {{ '小程序操作' }}
              </td>
              <td class="tt-item">
                <span
                  style="padding-right:10px"
                  class="tt-item-text"
                  @click="onUnbinding"
                >解除授权</span>

                <span
                  class="tt-item-text"
                  @click="onRevise"
                >重新授权</span>
              </td>
            </tr>
          </table>
        </div>
        <!-- 配置小程序 -->
        <div>
          <div class="title-tips">
            <div>
              <div>
                • 下载之后需使用微信开发者工具上传代码，微信开发者工具下载地址：xxxxxx
              </div>
              <div>
                • 上传之后登录微信公众平台，在版本管理中选择刚上传的版本提交审核，审核通过之后即可发布小程序。
              </div>
            </div>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <div class="top-message">
              <div class="text">
                <span>小程序信息</span>
                <el-button
                  type="primary"
                  link
                >
                  编辑信息
                </el-button>
              </div>
              <div
                class="applet-message-left"
              >
                <img-show style="width:160px;height:160px;margin:82px 0 50px 0" />
                <table>
                  <tr
                    class="table-title"
                  >
                    <td
                      class="tt-item-left"
                    >
                      {{ '小程序名称' }}
                    </td>

                    <td
                      class="tt-item"
                    >
                      {{ '超级无敌大boss' }}
                    </td>
                  </tr>
                  <tr class="table-title">
                    <td
                      class="tt-item-left"
                    >
                      {{ '小程序appid' }}
                    </td>
                    <td
                      class="tt-item"
                    >
                      {{ 'kfcvme50898565' }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="top-message"
              style="width:885px"
            >
              <div class="text">
                <span>源码下载</span>
              </div>
              <div
                class="applet-message-right"
              >
                <el-steps
                  :active="1"
                  align-center
                  process-status="wait"
                >
                  <el-step
                    title="下载小程序代码包"
                    :icon="Download"
                  />
                  <el-step
                    title="上传代码"
                    :icon="Upload"
                  />
                  <el-step
                    title="发布小程序"
                    :icon="Promotion"
                  />
                </el-steps>
                <el-button
                  type="primary"
                  style="display: block;margin: 111px auto 0;border-radius: 2px"
                >
                  下载小程序代码包
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="微信公众号"
        name="second"
      >
        <!-- 授权后 -->
        <div
          v-if="!afterEmpower"
          class="after-empower"
        >
          <img-show style="width:160px;height:160px;margin:93px 0 50px 0" />
          <table>
            <tr class="table-title">
              <td
                class="tt-item-left"
              >
                {{ '公众号名称' }}
              </td>
              <td class="tt-item">
                {{ '超级无敌大boss' }}
              </td>
            </tr>
            <tr class="table-title">
              <td class="tt-item-left">
                {{ '公众号appid' }}
              </td>
              <td class="tt-item">
                {{ 'kfcvme50898565' }}
              </td>
            </tr>
            <tr class="table-title">
              <td class="tt-item-left">
                {{ '公众号操作' }}
              </td>
              <td class="tt-item">
                <span
                  style="padding-right:10px"
                  class="tt-item-text"
                  @click="onUnbinding"
                >解除授权</span>

                <span
                  class="tt-item-text"
                  @click="onRevise"
                >重新授权</span>
              </td>
            </tr>
          </table>
        </div>
        <div class="official-accounts">
          <div class="top-message">
            <div class="text">
              <span>公众号信息</span>
              <el-button
                type="primary"
                link
              >
                编辑信息
              </el-button>
            </div>
            <div
              class="applet-message-left"
            >
              <img-show style="width:160px;height:160px;margin:82px 0 50px 0" />
              <table>
                <tr
                  class="table-title"
                >
                  <td
                    class="tt-item-left"
                  >
                    {{ '公众号名称：' }}
                  </td>

                  <td
                    class="tt-item"
                  >
                    {{ '超级无敌大boss' }}
                  </td>
                </tr>
                <tr class="table-title">
                  <td
                    class="tt-item-left"
                  >
                    {{ '公众号appid' }}
                  </td>
                  <td
                    class="tt-item"
                  >
                    {{ 'kfcvme50898565' }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { Download, Promotion, Upload } from '@element-plus/icons-vue'
const afterEmpower = ref(true)
const activeName = ref('first')
const handleClick = (tab, event) => {
  console.log(tab, event)
}
// 去授权
const toEmpower = () => {
  console.log('toEmpower')
}
// 去创建
const toCreated = () => {
  window.open('https://pay.weixin.qq.com/partner/public/home', '_blank')
}
// 接触授权
const onUnbinding = () => {
  console.log('接触授权')
}
// 重新授权
const onRevise = () => {
  console.log('重新授权')
}
</script>
<style lang="scss" scoped>
.page-content-manage{
  min-height: 868px;
  width: 100%;
  background: #fff;
  .title-tips{
    display: flex;
    justify-content: space-between;
    width: 100%;
    line-height: 32px;
    font-size: 14px;
    color: #666666;
    background: #FFF7DD;
    border: 1px solid #FFD888;
    border-radius: 2px;
    padding: 5px 22px;
    margin:5px 0 60px 0;

    span{
      margin-left: 3px;
    }
  }
  .demo-tabs{
    padding: 46px 20px 20px
  }
  .wx-applet{
   display: flex;
   padding: 86px 165px;
   :deep(.el-button){
    color: #155BD4;
    border: 1px solid #155BD4;
    border-radius: 2px;
  }
  }
  .label-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 620px;
    height: 362px;
    border: 1px solid #E3E2E5;
    border-radius: 5px;
    padding: 50px 0 40px 0;
  }
  .label-messages{
    width: 224px;
    text-align: center;
    color: #999999;
  }

  :deep(.el-tabs__item){
    width: 90px !important;
    padding: 0;
  }

  .after-empower{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 156px auto;
    width: 560px;
    height: 460px;
    border-radius: 2px ;
    border: 1px solid #DCDFE6;
  }
  .table-title{
    font-size: 14px;
    height: 14px;
    line-height: 14px;
    .tt-item{
      padding-bottom:20px
    }
    .tt-item-left{
    text-align: right;
    padding-right: 20px;
    padding-bottom:20px;
    color: #666666;
    }
    .tt-item-text{
    color:#155BD4 ;
    }
  }

  .top-message{
    position: relative;
    width: 685px;
    height: 460px;
    border-radius: 2px ;
    border: 1px solid #DCDFE6;
    padding: 20px;

    .text{
      display:flex;
      justify-content: space-between;
      margin-left: 10px;
      :deep(.el-button){
        border: 0;
  }
    }
    &::before{
        content: "";
        display: inline-block;
        position: absolute;
        margin-right: 10px;
        width: 4px;
        height: 19px;
        background: #155BD4;
        border-radius: 2px;
      }
      .applet-message-left{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .applet-message-right{
        margin: 119px 15px 0;
        :deep(.el-icon.el-step__icon-inner){
          font-size: 45px;
        }

        :deep(.el-step.is-horizontal .el-step__line) {
         border: 1px dashed #DCDFE6;
         background-color:rgba(0, 0, 0, 0);
}
      }
  }
  .official-accounts{
    margin-top:60px ;
    width: 685px;
    height: 460px;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #DCDFE6;
  }
}

</style>
