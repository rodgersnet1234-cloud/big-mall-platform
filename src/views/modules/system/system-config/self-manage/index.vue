<template>
  <div class="page-self-manage">
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
    >
      <el-tab-pane
        :label="$t('platform.config.miniPrograms')"
        name="first"
      >
        <mini-app
          v-if="miniAppShow"
          @mini-app-show="miniAppShowState(state)"
        />
        <!-- 配置小程序 -->
        <div v-if="!miniAppShow">
          <div class="title-tips">
            <div>
              <div>
                • 下载之后需使用微信开发者工具上传代码，微信开发者工具下载地址-<a
                  target="_blank"
                  style="text-decoration:none;color:black"
                  rel="noopener noreferrer"
                  href="https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
                >点击前往</a>
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
                  @click="miniAppShow=true"
                >
                  编辑信息
                </el-button>
              </div>
              <div
                class="applet-message-left"
              >
                <img
                  v-if="miniAppImgUrl"
                  :src="miniAppImgUrl"
                  alt=""
                  style="width:160px;height:160px;margin:82px 0 50px 0"
                >
                <img
                  v-else
                  src="~@/assets/images/def.png"
                  style="width:160px;height:160px;margin:82px 0 50px 0"
                >
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
                      {{ appletInformation.appName }}
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
                      {{ appletInformation.appId }}
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
                  :active="3"
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
                  @click="onDownload"
                >
                  下载小程序代码包
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('platform.config.weChatOfficialAccount')"
        name="second"
      >
        <mp
          v-if="mpShow"
          @mp-show="mpShowState"
        />
        <div
          v-else
          class="official-accounts"
        >
          <div class="top-message">
            <div class="text">
              <span>公众号信息</span>
              <el-button
                type="primary"
                link
                @click="mpShow=true"
              >
                编辑信息
              </el-button>
            </div>
            <div
              class="applet-message-left"
            >
              <img
                v-if="mpImgUrl"
                :src="mpImgUrl"
                alt=""
                style="width:160px;height:160px;margin:82px 0 50px 0"
              >
              <img
                v-else
                src="~@/assets/images/def.png"
                style="width:160px;height:160px;margin:82px 0 50px 0"
              >
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
                    {{ mpInformation.appName }}
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
                    {{ mpInformation.appId }}
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
<script  setup>
import { Download, Promotion, Upload } from '@element-plus/icons-vue'
import * as api from '@/api/platform/sys-config.js'
import miniApp from './components/wx-ma-config.vue'
import mp from './components/wx-mp-config.vue'
import { ElMessage } from 'element-plus'
const miniAppShow = ref(true)
const activeName = ref('first')

let appletInformation = reactive({})
const miniAppImgUrl = ref('')
const miniAppShowState = (state) => {
  miniAppShow.value = state
  api.getAppletInformation().then(res => {
    appletInformation = res
  })
  api.getAppletQRcode().then(res => {
    getBase64(res).then(base64 => {
      miniAppImgUrl.value = base64
    }).catch(err => {
      console.log(err, 'err')
    })
  })
}
const onDownload = () => {
  if (appletInformation.value) {
    api.onDownloadZip().then(res => {
      const blob = new Blob([res], { type: 'application/zip' })
      const elink = document.createElement('a')
      elink.style.display = 'none'
      elink.download = '小程序代码包'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
  } else {
    ElMessage.error('微信小程序配置信息有误')
  }
}
const mpShow = ref(true)
let mpInformation = reactive({})
const mpImgUrl = ref('')
const mpShowState = (state) => {
  mpShow.value = state
  api.getOfficialAccountInformation().then(res => {
    mpInformation = res
  })
  api.getOfficialAccountQRcode().then(res => {
    getBase64(res).then(base64 => {
      mpImgUrl.value = base64
    }).catch(err => {
      console.log(err, 'err')
    })
  })
}

// 二进制流转为base64
const getBase64 = (data) => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([data], { type: 'image/jpg' })
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
</script>
<style lang="scss" scoped>
.page-self-manage{
  background-color: #fff;
  padding: 20px;
  :deep(.el-tabs__header){
    margin-bottom:30px;
  }

  :deep(.gray-box) {
      background: #f2f2f6;
      padding: 20px 35px;
      height: 100%;
  }
  :deep(.title) {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    padding-right: 20px;
    margin-bottom: 25px;
  }
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
         i{
          width: 0 !important;
         }
        }
      }
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
