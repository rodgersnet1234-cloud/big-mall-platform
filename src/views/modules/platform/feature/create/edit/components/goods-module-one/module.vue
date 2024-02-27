<template>
  <div class="module-one-component component-module-one">
    <!-- 默认显示 start -->
    <template v-if="currentForm">
      <div
        class="module-one-header"
        :style="{height: (28 + config.titleHeight) + 'px'}"
      >
        <div
          class="main-title"
          style="font-size: 16px; color: #333;"
        >
          {{ moduleForm.mainTitle }}
        </div>
        <div
          class="sub-title"
          :style="{
            'color': config.subTitleColor,
            'font-size': config.subTitleSize + 'px'
          }"
        >
          {{ moduleForm.subTitle }}
        </div>
      </div>
      <div class="module-one-goodsList">
        <div class="goods-items">
          <el-image fit="fill">
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 14px"
                  src="@/assets/micro-page/def.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
          <div class="real-price">
            <span>￥</span>
            <span>9.</span>
            <span>90</span>
          </div>
          <div class="del-price">
            ￥40.00
          </div>
        </div>
        <div class="goods-items">
          <el-image fit="fill">
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 14px"
                  src="@/assets/micro-page/def.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
          <div class="real-price">
            <span>￥</span>
            <span>9.</span>
            <span>90</span>
          </div>
          <div class="del-price">
            ￥40.00
          </div>
        </div>
      </div>
    </template>
    <!-- 默认显示 end -->
    <!-- 有数据的时候显示 start -->
    <template v-else>
      <div
        class="module-one-header"
        :style="{height: (28 + config.titleHeight) + 'px'}"
      >
        <div
          class="main-title"
          :style="{
            'color': moduleForm.mainTitleColor,
            'font-size': moduleForm.mainTitleSize + 'px'}"
        >
          {{ moduleForm.mainTitle }}
        </div>
        <div
          class="sub-title"
          :style="{
            'color': moduleForm.subTitleColor,
            'font-size': moduleForm.subTitleSize + 'px'}"
        >
          {{ moduleForm.subTitle }}
        </div>
      </div>
      <div class="module-one-goodsList">
        <!-- 当商品有数据的时候显示 start -->
        <template v-if="moduleForm.goodsList.length > 0">
          <template
            v-for="(item, index) in moduleForm.goodsList"
            :key="index"
          >
            <div class="goods-items">
              <div class="goods-items-img">
                <el-image
                  :src="checkFileUrl(item.imgs)"
                  fit="fill"
                >
                  <template #error>
                    <div class="image-slot">
                      <img
                        style="width: 14px"
                        src="@/assets/micro-page/def.png"
                        alt=""
                      >
                    </div>
                  </template>
                </el-image>
                <!-- 下架商品蒙版 start -->
                <div
                  v-if="item.status !== 1"
                  class="imgs_shelves"
                >
                  <img
                    class="been_imgs"
                    src="@/assets/pc-micro-page/been_shelves.png"
                    alt
                  >
                </div>
                <!-- 下架商品蒙版 end -->
              </div>
              <div class="real-price">
                <span>￥</span>
                <span>{{ getPrice(item.price, 'left') }}.</span>
                <span>{{ getPrice(item.price, 'right') }}</span>
              </div>
              <div
                v-if="item.orignPrice >= item.price"
                class="del-price"
              >
                ￥{{ formatPrice(item.orignPrice, 1 ).toFixed(2) }}
              </div>
            </div>
          </template>
        </template>
        <!-- 当商品有数据的时候显示 end -->
        <!-- 当商品没有数据的时候显示 start -->
        <template v-else>
          <template
            v-for="index in goodsArr.length"
            :key="index"
          >
            <div class="goods-items">
              <el-image fit="fill">
                <template #error>
                  <div class="image-slot">
                    <img
                      style="width: 14px"
                      src="@/assets/micro-page/def.png"
                      alt=""
                    >
                  </div>
                </template>
              </el-image>
              <div class="real-price">
                <span>￥</span>
                <span>9.</span>
                <span>90</span>
              </div>
              <div class="del-price">
                ￥40.00
              </div>
            </div>
          </template>
        </template>
      <!-- 当商品没有数据的时候显示 end -->
      </div>
    </template>
    <!-- 有数据的时候显示 end -->
  </div>
</template>
<script setup>
import { formatPrice } from '@/utils/index.js'

const props = defineProps({
  config: { // 配置信息
    type: Object,
    default: () => {}
  }
})

const goodsArr = new Array(2)

const getPrice = computed(() => {
  return (price, type) => {
    price = formatPrice(price, 1).toFixed(2)
    if (!price) return
    const point = price.toString().indexOf('.') // 如果为-1则表示没找到
    let leftPrice
    let rightPrice
    if (point === -1) { // 当前是整数
      leftPrice = price
      rightPrice = '00'
    } else {
      leftPrice = price.toString().slice(0, point)
      rightPrice = price.toString().slice(point + 1)
    }
    switch (type) {
      case 'left':
        return leftPrice
      case 'right':
        return rightPrice
      default:
        break
    }
  }
})

const moduleForm = ref({})
const currentForm = computed(() => {
  return JSON.stringify(moduleForm.value) === '{}'
})

watch(() => props.config, (newVal) => {
  moduleForm.value = {
    ...newVal
  }
}, { immediate: true, deep: true })

</script>
<style lang="scss" scoped>
.component-module-one {
  width: 100%;
  .module-one-header {
    overflow: hidden;
    margin-bottom: 15px;
    .main-title {
      font-family: PingFang SC;
      font-weight: bold;
      margin: 12px 0 4px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sub-title {
      width: 100%;
      font-family: PingFang SC;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .module-one-goodsList {
    width: 100%;
    display: flex;
    overflow: hidden;
    margin-bottom: 18px;
    :deep(.goods-items) {
      .el-image {
        width: 60px;
        height: 60px;
        background: rgba(243, 245, 247, 0.39);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .goods-items {
      width: 60px;
      &:nth-child(1) {
        margin-right: 28px;
      }
      .goods-items-img {
        position: relative;
        .imgs_shelves {
          position: absolute;
          width: 60px;
          height: 60px;
          background: rgba(0, 0, 0, 0.6);
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 50px;
          }
        }
      }
      .real-price {
        color: #E1251B;
        text-align: center;
        margin-top: 8px;
        font-family: Microsoft YaHei;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        span {
          font-size: 11px;
          &:nth-child(2) {
            font-size: 13px;
          }
        }
      }
      .del-price {
        font-family: PingFang SC;
        font-weight: bold;
        text-align: center;
        color: #AAAAAA;
        font-size: 11px;
        text-decoration: line-through;
        transform: scale(0.95);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
      }
    }
  }
}
</style>
