<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    top="0"
    :append-to-body="true"
    :lock-scroll="true"
    title="查看图片"
    class="img-preview"
    width="650px"
  >
    <div class="img-box">
      <img-show
        :src="imgUrl"
        :class-list="['img']"
      />
    </div>
  </el-dialog>
</template>

<script setup>

const imgUrl = ref('')
const visible = ref(false)

// eslint-disable-next-line no-unused-vars
const init = (imgUrlPar) => {
  imgUrl.value = imgUrlPar
  visible.value = true
}

// 暴露组件方法
defineExpose({
  init
})

</script>

<style lang="scss" scoped>
.img-preview.el-dialog__wrapper {
  display: flex;
  align-items: center;
}
:deep(.img-preview) {
  .el-dialog__body {
    padding: 10px 20px 20px;
    .img-box {
      display: block;
      width: 100%;
      max-height: 700px;
      overflow: auto;
    }
    .img-box::-webkit-scrollbar {
      display: none;
    }
    .img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
}
</style>
