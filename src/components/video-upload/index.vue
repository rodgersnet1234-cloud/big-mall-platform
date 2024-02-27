<template>
  <div>
    <div class="plugin-video">
      <div
        tabindex="0"
        class="el-upload el-upload--text"
        @click.stop="videoboxHandle"
      >
        <video
          v-if="value"
          ref="myVideoRef"
          class="video"
          :src="checkFileUrl(value)"
          controls="controls"
        />
        <div
          v-else
          class="el-upload--picture-card"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </div>
      </div>
    </div>
    <!-- 弹窗, 新增视频 -->
    <video-box
      v-if="videoboxVisible"
      ref="videoboxRef"
      @refresh-pic="refreshPic"
    />
    <el-dialog
      v-model="visible"
      :append-to-body="visible"
    />
  </div>
</template>

<script setup>
import VideoBox from '@/components/video-box/index.vue'

const emit = defineEmits(['input', 'update:value'])

const videoboxVisible = ref(false)
const visible = ref(false)

const props = defineProps({
  value: {
    default: '',
    type: String
  },
  disabled: {
    default: false,
    type: Boolean
  }
})
const videoboxRef = ref(null)
// 打开视频选择窗
const videoboxHandle = () => {
  if (props.disabled) {
    openImg()
    return false
  }
  videoboxVisible.value = true
  nextTick(() => {
    videoboxRef.value?.init(1)
  })
}

const openImg = () => {
  visible.value = true
}
const refreshPic = (imagePath) => {
  emit('update:value', imagePath)
}

</script>

<style lang="scss" scoped>
.plugin-video {
  display: inline-block;
  width: auto;
  .el-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 120px;
    max-width: 300px;
    height: auto;
    min-height: 120px;
    max-height: 250px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .video {
      width: auto;
      max-width: 300px;
      height: auto;
      max-height: 250px;
      display: block;
    }
    .el-upload--picture-card {
      border: 0;
      font-size: 28px;
      color: #8c939d;
      background: #fff;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
  }
}
</style>
