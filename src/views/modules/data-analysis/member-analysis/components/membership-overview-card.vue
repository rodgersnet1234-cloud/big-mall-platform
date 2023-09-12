<template>
  <!-- 会员概览卡片 -->
  <div class="component-membership-overview component-membership-overview-card">
    <div class="card-swiper-box">
      <!-- 左滑 -->
      <div
        ref="prevRef"
        class="slide-left-arrow disable"
        @click="prevPart"
      >
        <img
          src="@/assets/icon/slide-left-arrow@2x.png"
          alt=""
        >
      </div>
      <!-- 右滑 -->
      <div
        ref="nextRef"
        class="slide-right-arrow enable"
        @click="nextPart"
      >
        <img
          src="@/assets/icon/slide-right-arrow@2x.png"
          alt=""
        >
      </div>
      <!-- 列表 -->
      <div
        ref="boxRef"
        class="card-box"
      >
        <div
          ref="contentRef"
          class="card-list"
        >
          <div
            id="totalMember"
            :class="['card-item', curSelected === 0 ? 'active' : '']"
            @click="switchCards(0,$event)"
          >
            <p class="week-txt">
              累积会员数
            </p>
            <p class="strong-num">
              {{ memberData.totalMember }}
            </p>
            <div :class="['rise-fall-rate', indexSwitch === 0 ? 'rise' : 'down' ]">
              <img
                v-if="rateRatio.totalMemberRate < 0"
                src="@/assets/icon/downArrow@2x.png"
                class="arrows"
                alt
              >
              <img
                v-if="rateRatio.totalMemberRate > 0"
                src="@/assets/icon/upArrow@2x.png"
                class="arrows"
                alt
              >
              <span
                v-if="rateRatio.totalMemberRate > 0"
                style="color:hsl(150deg 53% 58%)"
              > {{ Math.abs(rateRatio.totalMemberRate) + '%' }}</span>
              <span
                v-if="rateRatio.totalMemberRate < 0"
                style="color:hsl(0deg 100% 70%)"
              > {{ Math.abs(rateRatio.totalMemberRate) + '%' }}</span>
              <span v-if="rateRatio.totalMemberRate === 0"> - </span>
            </div>
          </div>
          <div
            id="newMember"
            :class="['card-item', curSelected === 1 ? 'active' : '']"
            @click="switchCards(1,$event)"
          >
            <p class="week-txt">
              新增会员数
            </p>
            <p class="strong-num">
              {{ memberData.newMember }}
            </p>
            <div :class="['rise-fall-rate', indexSwitch === 1 ? 'rise' : 'down' ]">
              <img
                v-if="rateRatio.newMemberRate < 0"
                src="@/assets/icon/downArrow@2x.png"
                class="arrows"
                alt
              >
              <img
                v-if="rateRatio.newMemberRate > 0"
                src="@/assets/icon/upArrow@2x.png"
                class="arrows"
                alt
              >
              <span
                v-if="rateRatio.newMemberRate > 0"
                style="color:hsl(150deg 53% 58%)"
              > {{ Math.abs(rateRatio.newMemberRate) + '%' }}</span>
              <span
                v-if="rateRatio.newMemberRate < 0"
                style="color:hsl(0deg 100% 70%)"
              > {{ Math.abs(rateRatio.newMemberRate) + '%' }}</span>
              <span v-if="rateRatio.newMemberRate === 0"> - </span>
            </div>
          </div>

          <div
            id="payMember"
            :class="['card-item', curSelected === 2 ? 'active' : '']"
            @click="switchCards(2,$event)"
          >
            <p class="week-txt">
              支付会员数
              <el-tooltip
                placement="top"
                width="300"
                content="同个会员多次支付只计数一次"
              >
                <el-icon class="que-mark">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </p>
            <p class="strong-num">
              {{ memberData.payMember }}
            </p>
            <div :class="['rise-fall-rate', indexSwitch === 2 ? 'rise' : 'down' ]">
              <img
                v-if="rateRatio.payMemberRate < 0"
                src="@/assets/icon/downArrow@2x.png"
                class="arrows"
                alt
              >
              <img
                v-if="rateRatio.payMemberRate > 0"
                src="@/assets/icon/upArrow@2x.png"
                class="arrows"
                alt
              >
              <span
                v-if="rateRatio.payMemberRate > 0"
                style="color:hsl(150deg 53% 58%)"
              > {{ Math.abs(rateRatio.payMemberRate) + '%' }}</span>
              <span
                v-if="rateRatio.payMemberRate < 0"
                style="color:hsl(0deg 100% 70%)"
              > {{ Math.abs(rateRatio.payMemberRate) + '%' }}</span>
              <span v-if="rateRatio.payMemberRate === 0"> - </span>
            </div>
          </div>

          <div
            id="couponMember"
            :class="['card-item', curSelected === 3 ? 'active' : '']"
            @click="switchCards(3,$event)"
          >
            <p class="week-txt">
              领券会员数
              <el-tooltip
                placement="top"
                width="300"
                content="同个会员多次领券只计数一次"
              >
                <el-icon class="que-mark">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </p>
            <p class="strong-num">
              {{ memberData.couponMember }}
            </p>
            <div :class="['rise-fall-rate', indexSwitch === 3 ? 'rise' : 'down' ]">
              <img
                v-if="rateRatio.couponMemberRate < 0"
                src="@/assets/icon/downArrow@2x.png"
                class="arrows"
                alt
              >
              <img
                v-if="rateRatio.couponMemberRate > 0"
                src="@/assets/icon/upArrow@2x.png"
                class="arrows"
                alt
              >
              <span
                v-if="rateRatio.couponMemberRate > 0"
                style="color:hsl(150deg 53% 58%)"
              > {{ Math.abs(rateRatio.couponMemberRate) + '%' }}</span>
              <span
                v-if="rateRatio.couponMemberRate < 0"
                style="color:hsl(0deg 100% 70%)"
              > {{ Math.abs(rateRatio.couponMemberRate) + '%' }}</span>
              <span v-if="rateRatio.couponMemberRate === 0"> - </span>
            </div>
          </div>

          <div
            id="memberPayAmount"
            :class="['card-item', curSelected === 4 ? 'active' : '']"
            @click="switchCards(4,$event)"
          >
            <p class="week-txt">
              会员支付金额（元）
            </p>
            <p class="strong-num">
              {{ memberData.memberPayAmount }}
            </p>
            <div :class="['rise-fall-rate', indexSwitch === 4 ? 'rise' : 'down' ]">
              <img
                v-if="rateRatio.memberPayAmountRate < 0"
                src="@/assets/icon/downArrow@2x.png"
                class="arrows"
                alt
              >
              <img
                v-if="rateRatio.memberPayAmountRate > 0"
                src="@/assets/icon/upArrow@2x.png"
                class="arrows"
                alt
              >
              <span
                v-if="rateRatio.memberPayAmountRate > 0"
                style="color:hsl(150deg 53% 58%)"
              > {{ Math.abs(rateRatio.memberPayAmountRate) + '%' }}</span>
              <span
                v-if="rateRatio.memberPayAmountRate < 0"
                style="color:hsl(0deg 100% 70%)"
              > {{ Math.abs(rateRatio.memberPayAmountRate) + '%' }}</span>
              <span v-if="rateRatio.memberPayAmountRate === 0"> - </span>
            </div>
          </div>

          <div
            id="memberPayOrder"
            :class="['card-item', curSelected === 5 ? 'active' : '']"
            @click="switchCards(5,$event)"
          >
            <p class="week-txt">
              会员支付订单数
            </p>
            <p class="strong-num">
              {{ memberData.memberPayOrder }}
            </p>
            <div :class="['rise-fall-rate', indexSwitch === 5 ? 'rise' : 'down' ]">
              <img
                v-if="rateRatio.memberPayOrderRate < 0"
                src="@/assets/icon/downArrow@2x.png"
                class="arrows"
                alt
              >
              <img
                v-if="rateRatio.memberPayOrderRate > 0"
                src="@/assets/icon/upArrow@2x.png"
                class="arrows"
                alt
              >
              <span
                v-if="rateRatio.memberPayOrderRate > 0"
                style="color:hsl(150deg 53% 58%)"
              > {{ Math.abs(rateRatio.memberPayOrderRate) + '%' }}</span>
              <span
                v-if="rateRatio.memberPayOrderRate < 0"
                style="color:hsl(0deg 100% 70%)"
              > {{ Math.abs(rateRatio.memberPayOrderRate) + '%' }}</span>
              <span v-if="rateRatio.memberPayOrderRate === 0"> - </span>
            </div>
          </div>

          <div
            id="memberSingleAmount"
            :class="['card-item', curSelected === 6 ? 'active' : '']"
            @click="switchCards(6,$event)"
          >
            <p class="week-txt">
              会员客单价（元）
            </p>
            <p class="strong-num">
              {{ memberData.memberSingleAmount }}
            </p>
            <div :class="['rise-fall-rate', indexSwitch === 6 ? 'rise' : 'down' ]">
              <img
                v-if="rateRatio.memberSingleAmountRate < 0"
                src="@/assets/icon/downArrow@2x.png"
                class="arrows"
                alt
              >
              <img
                v-if="rateRatio.memberSingleAmountRate > 0"
                src="@/assets/icon/upArrow@2x.png"
                class="arrows"
                alt
              >
              <span
                v-if="rateRatio.memberSingleAmountRate > 0"
                style="color:hsl(150deg 53% 58%)"
              > {{ Math.abs(rateRatio.memberSingleAmountRate) + '%' }}</span>
              <span
                v-if="rateRatio.memberSingleAmountRate < 0"
                style="color:hsl(0deg 100% 70%)"
              > {{ Math.abs(rateRatio.memberSingleAmountRate) + '%' }}</span>
              <span v-if="rateRatio.memberSingleAmountRate === 0"> - </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  memberData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  oneEchartAllName: {
    type: Array,
    default: () => {
      return []
    }
  },
  oneEchartCurrentName: {
    type: String,
    default: ''
  },
  rateRatio: {
    type: Object,
    default: () => {
      return {
        couponMemberRate: 0,
        memberPayAmountRate: 0.00,
        memberPayOrderRate: 0.00,
        memberSingleAmountRate: 0,
        newMemberRate: 0,
        payMemberRate: 0,
        totalMemberRate: 0
      }
    }
  }
})

const emit = defineEmits(['update:oneEchartAllName', 'update:oneEchartCurrentName', 'updateEchart'])

// 内容里的数据改变，重新判断内容和盒子大小比较
watch(
  () => props.rateRatio,
  () => {
    judgeSize()
  },
  { deep: true }
)
const screenWidth = ref('') // 屏幕宽度
// 窗口变化，重新判断内容和盒子大小比较
watch(
  () => screenWidth.value,
  () => {
    judgeSize()
  },
  { deep: true }
)

const curSelected = ref(0)
onMounted(() => {
  curSelected.value = 0
  const ele = document.getElementsByClassName('week-txt')
  for (let j = 0, len = ele.length; j < len; j++) {
    const arr = props.oneEchartAllName
    arr.push(ele[j].innerText)
    emit('update:oneEchartAllName', arr)
  }
  // 监听游览器窗口变化
  window.addEventListener('resize', () => {
    screenWidth.value = document.body.offsetWidth
  })
  judgeSize()
})

const indexSwitch = ref(0)
/**
 * 选择卡片
 */
const switchCards = (index, e) => {
  curSelected.value = index
  indexSwitch.value = index
  emit('updateEchart', index)
}

const boxRef = ref(null)
const contentRef = ref(null)
const prevRef = ref(null)
const nextRef = ref(null)
let isMove = false // 当内容宽度大于盒子宽度，isMove为true，反之为false
// 判断内容和盒子的大小
const judgeSize = () => {
  nextTick(() => {
    if (contentRef.value.clientWidth > boxRef.value?.clientWidth) {
      isMove = true
      if (contentRef.value.style.right === '0px') {
        prevRef.value.style.cursor = 'pointer'
      } else {
        nextRef.value.style.cursor = 'pointer'
      }
    } else {
      isMove = false
      prevRef.value.style.cursor = 'not-allowed'
      nextRef.value.style.cursor = 'not-allowed'
      contentRef.value.style.left = ''
      contentRef.value.style.right = ''
    }
  })
}

// 左箭头
const prevPart = () => {
  if (isMove === true) {
    if (contentRef.value.style.left !== '0px') {
      contentRef.value.style.left = '0'
      contentRef.value.style.right = ''
      prevRef.value.style.cursor = 'not-allowed'
      nextRef.value.style.cursor = 'pointer'
    }
  }
}
// 右箭头
const nextPart = () => {
  if (isMove === true) {
    if (contentRef.value.style.right !== '0px') {
      contentRef.value.style.right = '0px'
      contentRef.value.style.left = ''
      prevRef.value.style.cursor = 'pointer'
      nextRef.value.style.cursor = 'not-allowed'
    }
  }
}

defineExpose({
  indexSwitch: indexSwitch.value
})

</script>

<style lang="scss" scoped>
.component-membership-overview.component-membership-overview-card {
  .card-swiper-box {
    position: relative;
    display: block;
    width: 100%;
    padding: 0 40px;
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    p {
      margin: 0;
    }

    // 左右滑动操作箭头
    .slide-left-arrow,
    .slide-right-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      width: 25px;
      height: 25px;
    }
    .slide-left-arrow img,
    .slide-right-arrow img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .slide-left-arrow {
      left: 0;
    }
    .slide-right-arrow {
      right: 0;
    }
    .slide-left-arrow,
    .slide-right-arrow {
      cursor: pointer;
    }
    .slide-left-arrow,
    .slide-right-arrow {
      cursor: not-allowed;
    }
    .slide-left-arrow:hover,
    .slide-right-arrow:hover {
      opacity: 0.8;
    }

    // 列表
    .card-box {
      position: relative;
      height: 125px;
      margin: 20px 0;
      overflow: hidden;
      .card-list {
        position: absolute;
        .card-item {
          display: inline-block;
          margin-right: 20px;
          width: 200px;
          border: 1px solid #EAF0F4;
          border-radius: 4px;
          padding: 20px;
          box-sizing: border-box;
          cursor: pointer;
          :deep(.week-txt) {
            color: #666;
            padding-bottom: 10px;
            .el-button {
              width: auto;
              height: auto;
              padding: 0;
              border: none;
            }
            .tit-mod-btn.el-button:hover, .tit-mod-btn.el-button:focus {
              color: #333;
              background-color: transparent;
            }
            // 文字提示框的问号icon
            .que-mark {
              display: inline-block;
              width: 14px;
              height: 14px;
              vertical-align: text-top;
              color: #C8C9CC;
              margin-left: 5px;
              cursor: default;
            }
          }
          .strong-num {
            font-size: 20px;
            font-weight: bold;
            padding-bottom: 10px;
          }
          .rise-fall-rate {
            span {
              font-size: 12px;
            }
            .arrows {
              display: inline-block;
              width: 8px;
              height: 10px;
              margin: 0 4px 0 12px;
            }
          }
          .rise-fall-rate.rise {
            span {
              color: #3CC480;
            }
          }
          .rise-fall-rate.down {
            span {
              color: #FF4141;
            }
          }
        }
        .card-item.active {
          border-color: #155bd4;
          background: #f5faff;
        }
      }
    }

  }
}
</style>
