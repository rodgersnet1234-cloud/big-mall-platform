<template>
  <div class="store-list-components">
    <template v-if="config.storeList && config.storeList.length > 0">
      <div
        v-for="(item, index) in config.storeList"
        :key="index"
        class="store-list-items"
      >
        <div class="images">
          <el-image
            :src="addDomain(item.shopLogo)"
            fit="cover"
          >
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 30px"
                  src="@/assets/pc-micro-page/show-default.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
          <!-- 下线蒙版 start-->
          <div
            v-if="item.shopStatus !== 1"
            class="imgs_shelves"
          >
            <img
              class="been_imgs"
              src="@/assets/pc-micro-page/offlined.png"
              alt=""
            >
          </div>
          <!-- 下线蒙版 end -->
        </div>
        <div class="right-content">
          <span>{{ item.shopName }}</span>
          <span>{{ item.shopFocusNumber }}{{ $t('pcdecorate.storeList.storeAttention') }}</span>
          <span>{{ $t('pcdecorate.storeList.storeIn') }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <template
        v-for="(item, index) in defaultArr"
        :key="index"
      >
        <div class="store-list-items">
          <div class="images">
            <el-image
              src=""
              fit="cover"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    style="width: 30px"
                    src="@/assets/pc-micro-page/show-default.png"
                    alt=""
                  >
                </div>
              </template>
            </el-image>
          </div>
          <div class="right-content">
            <span>{{ $t('pcdecorate.storeList.storeName') }}</span>
            <span>0{{ $t('pcdecorate.storeList.storeAttention') }}</span>
            <span>{{ $t('pcdecorate.storeList.storeIn') }}</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script setup>
defineProps({
  config: { // 配置店铺
    type: Object,
    default: () => {}
  }
})
const defaultArr = new Array(4)

</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
