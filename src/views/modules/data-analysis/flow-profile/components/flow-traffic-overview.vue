<template>
  <!-- 流量总览 -->
  <div class="page-flow-profile component-traffic-overview">
    <!-- 标题栏 -->
    <titleBar
      :title="plateTitle"
      :show-time-screening="true"
      :show-export="true"
      :permission="'platform:analysisData:export'"
      @export-from="exportFrom"
      @get-date-time="getDateTime"
    />

    <!-- 平台栏 -->
    <!-- 系统类型systemType 0全部 1PC 2H5 3微信小程序 4安卓 5IOS -->
    <div class="each-platform">
      <div
        :class="['pla-item', curSystemType === 0 ? 'active' : '']"
        @click="switchSystemType(0)"
      >
        <div class="top-tit">
          <div class="platform">
            全部
          </div>
          <div class="visitors">
            访客数
          </div>
        </div>
        <div class="bottom-data">
          <div class="num">
            {{ sysData.all || 0 }}
          </div>
        </div>
      </div>
      <div
        :class="['pla-item', curSystemType === 1 ? 'active' : '']"
        @click="switchSystemType(1)"
      >
        <div class="top-tit">
          <div class="platform">
            PC
          </div>
          <div class="visitors">
            访客数
          </div>
        </div>
        <div class="bottom-data">
          <div class="num">
            {{ sysData.pc }}
          </div>
        </div>
      </div>
      <div
        :class="['pla-item', curSystemType === 2 ? 'active' : '']"
        @click="switchSystemType(2)"
      >
        <div class="top-tit">
          <div class="platform">
            H5
          </div>
          <div class="visitors">
            访客数
          </div>
        </div>
        <div class="bottom-data">
          <div class="num">
            {{ sysData.h5 }}
          </div>
        </div>
      </div>
      <div
        :class="['pla-item', curSystemType === 3 ? 'active' : '']"
        @click="switchSystemType(3)"
      >
        <div class="top-tit">
          <div class="platform">
            微信小程序
          </div>
          <div class="visitors">
            访客数
          </div>
        </div>
        <div class="bottom-data">
          <div class="num">
            {{ sysData.applets }}
          </div>
        </div>
      </div>
      <div
        :class="['pla-item', curSystemType === 4 ? 'active' : '']"
        @click="switchSystemType(4)"
      >
        <div class="top-tit">
          <div class="platform">
            安卓
          </div>
          <div class="visitors">
            访客数
          </div>
        </div>
        <div class="bottom-data">
          <div class="num">
            {{ sysData.android }}
          </div>
        </div>
      </div>
      <div
        :class="['pla-item', curSystemType === 5 ? 'active' : '']"
        @click="switchSystemType(5)"
      >
        <div class="top-tit">
          <div class="platform">
            IOS
          </div>
          <div class="visitors">
            访客数
          </div>
        </div>
        <div class="bottom-data">
          <div class="num">
            {{ sysData.ios }}
          </div>
        </div>
      </div>
    </div>

    <!-- 平台数据 -->
    <div class="platform-data">
      <!-- 浏览访问 -->
      <div class="data-visits-box browse-visits">
        <div class="left-tit">
          <div class="middle">
            <img
              src="@/assets/icon/access@2x.png"
              class="icon"
              alt
            >
            <div class="tit">
              浏览访问
            </div>
          </div>
        </div>
        <div class="right-data">
          <div class="data-line">
            <div class="item">
              <div class="name">
                访客数
              </div>
              <div class="num">
                {{ flowData.userNums }}
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.userNumsRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.userNumsRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.userNumsRatio) }}%</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="name">
                新访客数
              </div>
              <div class="num">
                {{ flowData.newUserNums }}
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.newUserNumsRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.newUserNumsRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.newUserNumsRatio) }}%</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="name">
                跳失率
              </div>
              <div class="num">
                {{ flowData.lossUserRate }}%
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.lossUserRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.lossUserRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.lossUserRatio) }}%</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 第二行 -->
          <div class="data-line">
            <div class="item">
              <div class="name">
                浏览量
              </div>
              <div class="num">
                {{ flowData.visitNums }}
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.visitNumsRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.visitNumsRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.visitNumsRatio) }}%</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="name">
                人均浏览量
              </div>
              <div class="num">
                {{ flowData.averageVisitNums }}
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.averageVisitNumsRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.averageVisitNumsRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.averageVisitNumsRatio) }}%</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="name">
                加购人数
              </div>
              <div class="num">
                {{ flowData.plusShopCartUser }}
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.plusShopCartUserRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.plusShopCartUserRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.plusShopCartUserRatio) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 成交转换 -->
      <div class="data-visits-box tran-conversion">
        <div class="left-tit">
          <div class="middle">
            <img
              src="@/assets/icon/conversion@2x.png"
              class="icon"
              alt
            >
            <div class="tit">
              成交转换
            </div>
          </div>
        </div>
        <div class="right-data">
          <div class="data-line">
            <div class="item">
              <div class="name">
                下单人数
              </div>
              <div class="num">
                {{ flowData.placeOrderUser }}
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.placeOrderUserRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.placeOrderUserRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.placeOrderUserRatio) }}%</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="name">
                访问-下单转化率
              </div>
              <div class="num">
                {{ flowData.placeOrderRate }}%
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.placeOrderRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.placeOrderRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.placeOrderRatio) }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="data-line">
            <div class="item">
              <div class="name">
                支付人数
              </div>
              <div class="num">
                {{ flowData.payUser }}
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.payUserRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.payUserRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.payUserRatio) }}%</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="name">
                访问-支付转化率
              </div>
              <div class="num">
                {{ flowData.payRate }}%
              </div>
              <div class="quite">
                <div class="quite-txt">
                  较前一日
                </div>
                <div
                  v-if="flowData.ratio"
                  :class="['lift-rate', flowData.ratio.payRatio < 0 ? 'down' : 'rise']"
                >
                  <img
                    v-if="flowData.ratio.payRatio < 0"
                    src="@/assets/icon/downArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <img
                    v-else
                    src="@/assets/icon/upArrow@2x.png"
                    class="arrows"
                    alt
                  >
                  <span class="percentage">{{ Math.abs(flowData.ratio.payRatio) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/data-analysis/flow-profile.js'
import titleBar from '../../public-components/title-bar.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const props = defineProps({
  // 系统类型 0:全部 1:pc  2:h5  3:小程序 4:安卓  5:ios
  systemType: {
    type: Number,
    default: () => {
      return 0
    }
  },
  // 时间类型 1:自然日 2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天
  timeType: {
    type: Number,
    default: () => {
      return 5
    }
  },
  startTime: {
    type: String,
    default: ''
  },
  endTime: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['switchSystemType', 'getDateTime'])

const plateTitle = ref('流量总览')

// 系统类型 0:全部 1:pc  2:h5  3:小程序 4:安卓  5:ios
const curSystemType = ref(props.systemType)
watch(() => props.systemType, () => {
  curSystemType.value = props.systemType
  if (props.startTime && props.startTime !== '') {
    init()
  }
})

// 流量总览
const flowData = ref({})
// 流量总览-系统用户数量
const sysData = ref({})
const init = () => {
  const params = {
    systemType: curSystemType.value || 0,
    timeType: props.timeType,
    startTime: props.startTime || '',
    endTime: props.endTime || ''
  }
  // 流量总览
  api.flowAll(params).then(data => {
    flowData.value = data
  })
  // 流量总览-系统用户数量
  api.flowSystem(params).then(data => {
    sysData.value = data
  })
}

/**
 * 导出
 */
const exportFrom = () => {
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    const param = {
      systemType: curSystemType.value || 0,
      timeType: props.timeType,
      startTime: props.startTime || '',
      endTime: props.endTime || ''
    }
    api.soldExcelSystem({ ...param }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '流量总览.xlsx'
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    }).catch((e) => {
      ElMessage.error(e)
    })
  })
}

/**
 * 切换平台
 @param {String} type
 */
const switchSystemType = (type) => {
  // 系统类型systemType 0全部 1PC 2H5 3微信小程序 4安卓 5IOS
  curSystemType.value = type
  emit('switchSystemType', curSystemType.value)
}

/**
 * 获取筛选时间
 */
const getDateTime = async (data) => {
  await emit('getDateTime', data)
  init()
}

</script>

<style lang="scss" scoped>
// 流量总览
.page-flow-profile.component-traffic-overview {
  // 各平台流量总览
  .each-platform {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 30px;
    font-size: 14px;
    color: #333;
    .pla-item {
      display: block;
      width: 19%;
      border: 1px solid #EAF0F4;
      border-radius: 4px;
      padding: 10px;
      cursor: pointer;
      .top-tit {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .visitors {
          font-size: 12px;
          color: #666;
        }
      }
      .bottom-data {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .num {
          font-size: 25px;
          font-weight: bold;
        }
      }
    }
    .pla-item:hover {
      box-shadow: 0 2px 8px rgba(200, 201, 204, 0.5);
    }
    .pla-item:not(:last-child) {
      margin-right: 20px;
    }
    .pla-item.active {
      border-color: #155bd4;
      background: #f5f9ff;
    }
  }
  .lift-rate {
    display: flex;
    align-items: center;
    font-size: 12px;
    .arrows {
      display: block;
      width: 8px;
      height: 10px;
      margin-right: 3px;
    }
  }
  .lift-rate.down .percentage {
    color: #FF4141;
    line-height: 1em;
  }
  .lift-rate.rise .percentage {
    color: #3CC480;
    line-height: 1em;
  }
  // 平台对应数据
  .platform-data {
    display: flex;
    align-items: center;
    margin-top: 30px;
    .data-visits-box {
      display: flex;
      align-items: center;
      // flex-flow: column;
      justify-content: space-between;//两端对齐
      height: 300px;
      .left-tit {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 80px;
        height: 100%;
        color: #fff;
        background: #155bd4;
        padding: 0 10px;
        .icon {
          display: block;
          width: 26px;
          height: 26px;
          margin: 0 auto;
        }
        .tit {
          margin-top: 10px;
          font-size: 14px;
        }
      }
      .right-data {
        display: flex;
        flex-flow: column; //垂直排列
        justify-content: space-between;//两端对齐
        width: 100%;
        height: 300px;
        background: #f5f9ff;
        padding: 20px;
        .data-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          .item {
            display: block;
            font-size: 14px;
            padding: 10px;
            .num {
              font-size: 20px;
              font-weight: bold;
              margin-top: 10px;
            }
            .quite {
              margin-top: 15px;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              font-size: 12px;
              .quite-txt {
                margin-right: 15px;
                color: #999;
              }
            }
          }
        }
        .data-line:not(:first-child) {
          margin-top: 40px;
        }
      }
    }
    .data-visits-box:not(:last-child) {
      margin-right: 10px;
    }
    .data-visits-box.browse-visits {
      width: 60%;
      min-width: 530px;
    }
    .data-visits-box.tran-conversion {
      width: 40%;
      min-width: 366px;
    }
  }
}
</style>
