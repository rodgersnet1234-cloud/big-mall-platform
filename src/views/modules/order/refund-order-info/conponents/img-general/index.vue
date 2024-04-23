<template>
  <el-image
    v-for="(imgUrl,imgInx) in showImgs"
    :key="imgInx"
    :src="imgUrl"
    class="img-box"
    :preview-src-list="showImgs"
    :initial-index="initialIndex"
    @click="initialIndex=imgInx"
  >
    <template #error>
      <img
        class="img-box"
        src="~@/assets/images/def.png"
      >
    </template>
  </el-image>
</template>

<script setup>
const props = defineProps({
  imgList: {
    type: Array,
    default: () => ([])
  }
})
const initialIndex = ref(0)
const showImgs = computed(() => {
  const type = typeof props.imgList
  let arr = []
  if (type !== 'function' && props.imgList.length > 0) {
    arr = props.imgList.map(item => {
      return checkFileUrl(item)
    })
  }
  return arr
})

</script>

<style lang="scss" scoped>
.img-box {
  margin-right: 8px;
  width: 40px;
  height: 40px;
  font-size: 0;
  border-radius: 2px;
  overflow: hidden;
}
</style>
