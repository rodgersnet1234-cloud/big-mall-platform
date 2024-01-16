<template>
  <div
    :class="{'store-signate-page-container': true, 'defaultHeight': !setTopShow}"
    :style="config.bgUrl !== '' ? setBackground : 'background: #fff'"
  >
    <div class="store-singate-content">
      <div
        v-if="setTopShow"
        class="store-top"
      >
        <div class="top-logo">
          <img
            v-show="config.showLogo === 0"
            :src="addDomain(webHeaderConfig.pcLogoImgText)"
            alt=""
          >
        </div>
        <div class="top-search">
          <div
            v-show="config.showSearch === 0"
            class="search-box"
          >
            <div
              class="search-input"
            >
              <span>{{ $t(`pcdecorate.storeSignate.searchPlaceholder`) }}</span>
              <div class="search-types">
                <div class="types-name">
                  商品
                </div>
                <img
                  src="@/assets/pc-micro-page/togger_icon.png"
                  alt=""
                >
              </div>
              <div class="search-btns">
                {{ $t(`pcdecorate.storeSignate.search`) }}
              </div>
            </div>
            <div
              v-show="config.showHotWord === 0"
              class="hot-word"
            >
              <div class="con">
                <span
                  class="item"
                >热搜内容</span>
              </div>
            </div>
          </div>
          <div
            v-show="config.showSearch === 0"
            class="top-cart"
          >
            <span>{{ $t(`pcdecorate.storeSignate.cart`) }}(0)</span>
          </div>
        </div>
      </div>
      <div
        v-if="config.showNavs === 0"
        class="store-bottom"
      >
        <div
          v-if="config.showCategory === 0"
          class="all-category"
          :style="{background: config.showCategory === 0 ? 'rgba(225, 37, 27, 1)' : 'none'}"
        >
          <span>{{ $t(`pcdecorate.storeSignate.category`) }}</span>
          <img
            src="@/assets/pc-micro-page/pc-category_icon.png"
            alt=""
          >
        </div>
        <div
          v-show="config.showNavs === 0"
          :class="{'menu-content': true, 'isPadding': config.showCategory === 1}"
        >
          <template
            v-for="(item, index) in config.navList"
            :key="index"
          >
            <div class="menu-items">
              {{ item.name }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import request from '@/utils/request'
const props = defineProps({
  itemComponent: { // 组件的信息
    type: Object,
    default: () => {}
  },
  currentIndex: { // 下标
    type: [Number, String],
    default: 0
  },
  currentRefs: {
    type: String,
    default: () => ''
  }
})

const config = ref({})
const webHeaderConfig = ref({}) // 头部配置信息读取接口

const setBackground = computed(() => {
  return {
    background: `url(${config.value.bgUrl})`,
    'background-size': '100% 100%',
    'background-repeat': 'no-repeat'
  }
})
const setTopShow = computed(() => {
  let status = true
  const { showLogo, showSearch, bgUrl } = config.value
  status = !(showLogo !== 0 && showSearch !== 0 && bgUrl === '')
  return status
})
watch(() => props.itemComponent, (newVal) => {
  if (newVal && JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    config.value = { ...newVal.rightConfigMessage }
  } else {
    config.value = {
      showLogo: 0,
      showSearch: 0,
      showHotWord: 0,
      showCategory: 0,
      showNavs: 0,
      navList: [],
      bgUrl: ''
    }
  }
}, {
  immediate: true,
  deep: true
})

onMounted(() => {
  getHeader()
})

// 请求头部
const getHeader = () => {
  request({
    url: '/mall4cloud_admin/ua/web_config/get_activity',
    method: 'get',
    params: {
      webConfigType: 'PC_WEBSITE_CONFIG'
    }
  }).then(data => {
    if (data.pcLogoImgText) {
      data.pcLogoImgText = addDomain(data.pcLogoImgText)
    } else {
      data.pcLogoImgText = require('@/assets/website-config/logo-text.png')
    }

    webHeaderConfig.value = data
  })
}

</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前版心宽度
.store-signate-page-container {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  &.defaultHeight {
    height: 40px;
  }
  .store-singate-content {
    width: $currentContentWidth;
    margin: 0 auto;
    display: flex;
    max-width: 1200px;
    flex-direction: column;
    box-sizing: border-box;
    .store-top {
      width: 100%;
      height: 130px;
      display: flex;
      align-items: center;
      max-width: 1200px;
      justify-content: space-between;
      box-sizing: border-box;
      padding-bottom: 26px;
      .top-logo {
        height: 52px;
        overflow: hidden;
        display: flex;
        align-items: center;
        img {
          width: 190px;
          height: 48px;
        }
      }
      .top-search {
        display: flex;
        .search-box{
          height: 40px;
        }
        .hot-word {
          max-width: 600px;
          overflow-x: hidden;
          white-space: nowrap;
          flex: 1;
          display: flex;
          line-height: 40px;
          .con {
            overflow: hidden;
            color: #AAA;
            .item {
              max-width: 120px;
              height: 40px;
              display: inline-block;
              margin-left: 12px;
              transition: all .2s;
              -webkit-transition: all .2s;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 12px;
            }
          }
        }
        .search-input {
          width: 600px;
          height: 40px;
          border: 2px solid #E1251B;
          position: relative;
          margin-right: 50px;
          span {
            position: absolute;
            left: 12px;
            top: 11px;
            font-size: 14px;
            color: #999;
          }
          :deep(.input-text) {
            background: #E1251B;
            height: 28px;
            ::v-deep(.el-input__inner) {
              width: 100%;
              height: 20px;
              background: none!important;
            }
          }
          .search-types {
            position: absolute;
            top: 10px;
            right: 124px;
            display: flex;
            justify-content: center;
            .types-name {
              display: block;
              font-size: 14px;
              color: #E1251B;
              margin-right: 4px;
            }
          }
          .search-btns {
            position: absolute;
            right: 0;
            width: 109px;
            height: 38px;
            background: #E1251B;
            color: #fff;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-family: Microsoft YaHei, sans-serif;
            letter-spacing: 4px;
            padding-left: 8px;
            z-index: 5;
          }
        }
        .top-cart {
          width: 160px;
          height: 40px;
          background: #E1251B;
          display: flex;
          color: #fff;
          align-items: center;
          justify-content: center;
          position: relative;
          &:before {
            content: '';
            position: absolute;
            background: url('../../../../../../../../assets/pc-micro-page/icons.88a567a.png') no-repeat -44px -36px;
            width: 19px;
            height: 18px;
            left: 25px;
            top: 11px;
          }
          span {
            margin-left: 8px;
            font-size: 14px;
            font-family: Microsoft YaHei, sans-serif;
          }
        }
      }
    }
    .store-bottom {
      width: 100%;
      height: 40px;
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      .all-category {
        width: 187px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        span {
          white-space: nowrap;
          font-size: 13px;
          color: #fff;
        }
        img {
          margin-left: 22px;
          width: 17px;
          height: 13px;
        }
      }
      .menu-content {
        width: calc(100% - 187px);
        display: flex;
        align-items: center;
        .menu-items {
          padding: 0 30px;
          text-align: center;
          overflow: hidden;
          color: #000;
          white-space: nowrap;
          font-size:  15px;
          font-family: Microsoft YaHei, sans-serif;
          &:nth-child(1) {
            padding-left: 60px;
          }
        }
        &.isPadding {
          .menu-items {
            &:nth-child(1) {
              padding-left: 0;
            }
          }
        }
      }
    }
  }
}

</style>
