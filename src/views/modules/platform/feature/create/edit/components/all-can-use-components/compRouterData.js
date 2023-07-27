import header from '@/views/modules/platform/feature/create/edit/components/header/index.vue'
import headerAD from '@/views/modules/platform/feature/create/edit/components/header-ad/index.vue'
import pTextPng from '@/assets/micro-page/p-text.png'
import pTextActivePng from '@/assets/micro-page/p-text-active.png'
import titleText from '@/views/modules/platform/feature/create/edit/components/title-text/index.vue'
import pNoticePng from '@/assets/micro-page/p-notice.png'
import pNoticeActivePng from '@/assets/micro-page/p-notice-active.png'
import notice from '@/views/modules/platform/feature/create/edit/components/notice/index.vue'
import pSearchPng from '@/assets/micro-page/p-search.png'
import pSearchActivePng from '@/assets/micro-page/p-search-active.png'
import search from '@/views/modules/platform/feature/create/edit/components/search/index.vue'
import pProdListPng from '@/assets/micro-page/p-prod-list.png'
import pProdListActivePng from '@/assets/micro-page/p-prod-list-active.png'
import goods from '@/views/modules/platform/feature/create/edit/components/goods/index.vue'
import goodsWaterfallPng from '@/assets/micro-page/goods-waterfall.png'
import goodsWaterfallActivePng from '@/assets/micro-page/goods-waterfall-active.png'
import goodsWaterfall from '@/views/modules/platform/feature/create/edit/components/goods-waterfall/index.vue'
import pImageADPng from '@/assets/micro-page/p-image-ad.png'
import pImageAdActivePng from '@/assets/micro-page/p-image-ad-active.png'
import imageAD from '@/views/modules/platform/feature/create/edit/components/image-ad/index.vue'
import pTabsPng from '@/assets/micro-page/p-tabs.png'
import pTabsActivePng from '@/assets/micro-page/p-tabs-active.png'
import tabNav from '@/views/modules/platform/feature/create/edit/components/tab-nav/index.vue'
import pPromotionPng from '@/assets/micro-page/p-promotion.png'
import pPromotionActivePng from '@/assets/micro-page/p-promotion-active.png'
import promotionalActivities
  from '@/views/modules/platform/feature/create/edit/components/promotional-activities/index.vue'
import pHotareaPng from '@/assets/micro-page/p-hotarea.png'
import pHotareaActivePng from '@/assets/micro-page/p-hotarea-active.png'
import hotArea from '@/views/modules/platform/feature/create/edit/components/hot-area/index.vue'
import PCGoodsModulePng from '@/assets/pc-micro-page/pc_goods_module.png'
import PCGoodsModuleActivePng from '@/assets/pc-micro-page/pc_goods_module_active.png'
import goodsModuleOne from '@/views/modules/platform/feature/create/edit/components/goods-module-one/index.vue'
import goodsModuleTwo from '@/views/modules/platform/feature/create/edit/components/goods-module-two/index.vue'
import goodsModuleThree from '@/views/modules/platform/feature/create/edit/components/goods-module-three/index.vue'
import goodsModuleFour from '@/views/modules/platform/feature/create/edit/components/goods-module-four/index.vue'
import goodsModuleFive from '@/views/modules/platform/feature/create/edit/components/goods-module-five/index.vue'

export const componentLists = [
  {
    type: 'config', // 组件名称标识
    title: $t('shopFeature.allCanUse.config'),
    isHide: true, // 是否隐藏选择
    isHeader: true, // 是否为头部
    routerPath: shallowRef(header) // 路由地址
  },
  { // 公共广告头部配置
    type: 'config_common_ad',
    title: $t('shopFeature.allCanUse.config'),
    isHide: true, // 是否隐藏选择
    isHeader: true, // 是否为头部
    routerPath: shallowRef(headerAD)
  },
  // 标题文本
  {
    type: 'titleText',
    title: $t('shopFeature.allCanUse.titleText'),
    pic: pTextPng,
    picActive: pTextActivePng,
    routerPath: shallowRef(titleText)
  },
  // 公告
  {
    type: 'notice',
    title: $t('shopFeature.allCanUse.notice'),
    pic: pNoticePng,
    picActive: pNoticeActivePng,
    routerPath: shallowRef(notice)
  },
  // 搜索
  {
    type: 'search',
    title: $t('shopFeature.searchBar.searchBar'),
    pic: pSearchPng,
    picActive: pSearchActivePng,
    routerPath: shallowRef(search)
  },
  // 商品列表
  {
    type: 'goods',
    title: $t('shopFeature.allCanUse.goodsList'),
    pic: pProdListPng,
    picActive: pProdListActivePng,
    routerPath: shallowRef(goods)
  },
  // 商品瀑布流
  {
    type: 'goodsWaterfall',
    title: $t('shopFeature.allCanUse.goodsWaterfall'),
    pic: goodsWaterfallPng,
    picActive: goodsWaterfallActivePng,
    routerPath: shallowRef(goodsWaterfall)
  },
  // 图片广告
  {
    type: 'imageAd',
    title: $t('shopFeature.allCanUse.imgAd'),
    pic: pImageADPng,
    picActive: pImageAdActivePng,
    routerPath: shallowRef(imageAD)
  },
  // 导航栏
  {
    type: 'tabNav',
    title: $t('shopFeature.allCanUse.navigationBar'),
    pic: pTabsPng,
    picActive: pTabsActivePng,
    routerPath: shallowRef(tabNav)
  },
  // 促销活动
  {
    type: 'promotionalActivities',
    title: $t('shopFeature.allCanUse.activities'),
    pic: pPromotionPng,
    picActive: pPromotionActivePng,
    routerPath: shallowRef(promotionalActivities)
  },
  // 热区
  {
    type: 'hotArea',
    title: $t('shopFeature.imageAd.hotAreaTit'),
    pic: pHotareaPng,
    picActive: pHotareaActivePng,
    routerPath: shallowRef(hotArea)
  },
  {
    type: 'goodsModule1',
    title: $t('shopFeature.allCanUse.goodsModule1'),
    pic: PCGoodsModulePng,
    picActive: PCGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleOne)
  },
  {
    type: 'goodsModule2',
    title: $t('shopFeature.allCanUse.goodsModule2'),
    pic: PCGoodsModulePng,
    picActive: PCGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleTwo)
  },
  {
    type: 'goodsModule3',
    title: $t('shopFeature.allCanUse.goodsModule3'),
    pic: PCGoodsModulePng,
    picActive: PCGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleThree)
  },
  {
    type: 'goodsModule4',
    title: $t('shopFeature.allCanUse.goodsModule4'),
    pic: PCGoodsModulePng,
    picActive: PCGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleFour)
  },
  {
    type: 'goodsModule5',
    title: $t('shopFeature.allCanUse.goodsModule5'),
    pic: PCGoodsModulePng,
    picActive: PCGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleFive)
  }
]
