<template>
  <div class="component-img-upload-box single-image-upload">
    <div class="plugin-images">
      <div
        tabindex="0"
        class="el-upload el-upload--text"
        @click="elxImgboxHandle"
      >
        <img-show
          v-if="value"
          :src="getImgSrc()"
          :class-list="['pic']"
        />
        <el-icon
          v-else
          class="el-icon-plus pic-uploader-icon"
        >
          <Plus />
        </el-icon>
      </div>
    </div>
    <!-- 弹窗, 新增图片 -->
    <img-box
      v-if="elxImgboxVisible"
      ref="elxImgboxRef"
      @refresh-pic="refreshPic"
    />
    <el-dialog
      v-model="visible"
      :append-to-body="visible"
    >
      <ImgShow :src="getImgSrc()" />
    </el-dialog>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:value'])

const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const elxImgboxVisible = ref(false)
const visible = ref(false)

const props = defineProps({
  value: {
    default: '',
    type: String
  },
  disabled: {
    default: false,
    type: Boolean
  },
  show: {
    default: true,
    type: Boolean
  }
})

// 打开图片选择窗
const elxImgboxRef = ref(null)
const elxImgboxHandle = () => {
  if (!props.show) {
    return
  }
  if (props.disabled) {
    openImg()
    return false
  }
  elxImgboxVisible.value = true
  nextTick(() => {
    elxImgboxRef.value?.init(1)
  })
}

/**
 * 获取图片路径
 */
const getImgSrc = () => {
  if (!props.value) {
    return ''
  }
  if (props.value.indexOf('http://') === 0 || props.value.indexOf('https://') === 0) {
    return props.value
  }
  return resourcesUrl + props.value
}

const openImg = () => {
  visible.value = true
}

const refreshPic = (imagePath) => {
  emit('update:value', imagePath)
}

</script>
<style lang="scss" scoped>
.component-img-upload-box {
  max-height: 120px;
}
.plugin-images {
  display: inline-block;
  width: auto;
  .el-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .pic {
      width: auto;
      max-width: 118px;
      height: auto;
      max-height: 118px;
      display: block;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
  }
}
</style>
