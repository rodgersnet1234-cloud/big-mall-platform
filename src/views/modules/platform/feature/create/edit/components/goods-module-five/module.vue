<template>
  <div class="component-module-five">
    <!-- 没有配置信息展示 start -->
    <template v-if="currentForm">
      <div class="goods-top">
        <el-image
          src=""
          fit="fill"
        >
          <template #error>
            <div class="image-slot">
              <img
                style="width: 27px"
                src="@/assets/micro-page/def.png"
                alt=""
              >
            </div>
          </template>
        </el-image>
        <el-image
          src=""
          fit="fill"
        >
          <template #error>
            <div class="image-slot">
              <img
                style="width: 27px"
                src="@/assets/micro-page/def.png"
                alt=""
              >
            </div>
          </template>
        </el-image>
      </div>
      <div class="goods-bottom">
        <div
          v-for="index in newArr.length"
          :key="index"
          class="bottom-items"
        >
          <el-image
            src=""
            fit="fill"
          >
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 16px"
                  src="@/assets/micro-page/def.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
          <div class="name">
            商品名称
          </div>
          <div class="real-price">
            <span>￥</span>
            <span>25.</span>
            <span>90</span>
          </div>
        </div>
      </div>
    </template>
    <!-- 没有配置信息展示 end -->
    <!-- 有配置信息展示 start -->
    <template v-else>
      <div class="goods-top">
        <el-image
          :src="moduleForm.leftMessage.img"
          fit="fill"
        >
          <template #error>
            <div class="image-slot">
              <img
                style="width: 27px"
                src="@/assets/micro-page/def.png"
                alt=""
              >
            </div>
          </template>
        </el-image>
        <el-image
          :src="moduleForm.rightMessage.img"
          fit="fill"
        >
          <template #error>
            <div class="image-slot">
              <img
                style="width: 27px"
                src="@/assets/micro-page/def.png"
                alt=""
              >
            </div>
          </template>
        </el-image>
      </div>
      <div class="goods-bottom">
        <!-- 有商品信息 start -->
        <template v-if="moduleForm.goodsList.length > 0">
          <template
            v-for="(item, index) in moduleForm.goodsList"
            :key="index"
          >
            <div class="bottom-items">
              <div class="bottom-items-imgs">
                <el-image
                  :src="item.imgs"
                  fit="fill"
                >
                  <template #error>
                    <div class="image-slot">
                      <img
                        style="width: 16px"
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
              <div class="name">
                {{ item.name }}{{ item.description }}
              </div>
              <div class="real-price">
                <span>￥</span>
                <span>{{ getPrice(item.price, 'left') }}.</span>
                <span>{{ getPrice(item.price, 'right') }}</span>
              </div>
            </div>
          </template>
        </template>
        <!-- 有商品信息 end -->
        <!-- 没有商品信息 start -->
        <template v-else>
          <template
            v-for="index in newArr.length"
            :key="index"
          >
            <div class="bottom-items">
              <el-image fit="fill">
                <template #error>
                  <div class="image-slot">
                    <img
                      style="width: 16px"
                      src="@/assets/micro-page/def.png"
                      alt=""
                    >
                  </div>
                </template>
              </el-image>
              <div class="name">
                商品名称
              </div>
              <div class="real-price">
                <span>￥</span>
                <span>25.</span>
                <span>90</span>
              </div>
            </div>
          </template>
        </template>
        <!-- 没有商品信息 end -->
      </div>
    </template>
    <!-- 有配置信息展示 end -->
  </div>
</template>
<script setup>
const props = defineProps({
  config: { // 配置信息
    type: Object,
    default: () => {
    }
  }
})

const newArr = reactive(new Array(4))

// 得到价格显示
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
  nextTick(() => {
    moduleForm.value = {
      ...newVal
    }
  })
}, { deep: true })

</script>
<style lang="scss" scoped>
.component-module-five {
  width: 100%;

  .goods-top {
    display: flex;
  }

  :deep(.goods-top) {
    .el-image {
      width: calc((100% - 9px) / 2);
      height: 98px;
      margin-right: 9px;
      display: flex;
      align-items: center;
      background: rgba(235, 237, 240, 0.39);
      justify-content: center;
      border-radius: 4px;
      overflow: hidden;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .goods-bottom {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;

    :deep(bottom-items) {
      .el-image {
        width: 100%;
        height: 61px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(243, 245, 247, 0.39);
        border-radius: 2px;
        overflow: hidden;
      }
    }

    .bottom-items {
      width: calc((100% - 27px) / 4);
      margin-right: 9px;
      height: 120px;
      background: #fff;
      border-radius: 4px;
      padding: 9px 8px;
      margin-bottom: 9px;

      .bottom-items-imgs {
        position: relative;

        .imgs_shelves {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 61px;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 50px;
          }
        }
      }

      &:nth-child(4n) {
        margin-right: 0;
      }

      .name {
        width: 100%;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 8px;
        font-size: 12px;
        color: #333;
        font-family: PingFang SC;
        margin: 7px 0 4px 0;
      }

      .real-price {
        color: #E43130;
        font-weight: bold;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        span {
          font-size: 12px;

          &:nth-child(2) {
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>
