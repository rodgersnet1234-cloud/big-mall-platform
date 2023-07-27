<template>
  <GoodsListComponent :config="config" />
</template>
<script setup>
import GoodsListComponent from '../../../../common-component/goods-list-component/index.vue'
const props = defineProps({
  itemComponent: { // 组件信息展示
    type: Object,
    default: () => {}
  }
})

const config = ref({
  datalist: []
})

watch(() => props.itemComponent, (newVal) => {
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    config.value = {
      showMany: newVal.rightConfigMessage.listType,
      showName: newVal.rightConfigMessage.showContent.find(item => Number(item) === 0) ? 0 : 1,
      showDescription: newVal.rightConfigMessage.showContent.find(item => Number(item) === 1) ? 0 : 1,
      showPrice: newVal.rightConfigMessage.showContent.find(item => Number(item) === 2) ? 0 : 1,
      listTypeList: new Array(newVal.rightConfigMessage.listType),
      dataList: newVal.rightConfigMessage.goodsList
    }
  } else {
    config.value = {
      showMany: 3, // 一行展示多少个商品
      showName: 0, // 是否展示商品名称
      showDescription: 0, // 是否展示商品描述
      showPrice: 0, // 是否展示商品价格
      listTypeList: new Array(3),
      dataList: []
    }
  }
}, {
  immediate: true,
  deep: true
})
</script>
