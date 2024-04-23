<template>
  <div class="component-img-upload-box">
    <div class="plugin-images">
      <div
        tabindex="0"
        class="el-upload el-upload--text"
        @click="elxImgboxHandle"
      >
        <div
          v-if="modelValue"
          class="show-pic"
        >
          <img-show
            :src="modelValue"
            :class-list="['pic']"
          />
          <div
            v-if="showDelete"
            tabindex="0"
            class="el-upload el-upload--picture-card blackba"
            @click.stop="detailImg"
          >
            <el-icon class="delete">
              <Delete />
            </el-icon>
          </div>
        </div>
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
      <img-show :src="modelValue" />
    </el-dialog>
  </div>
</template>

<script setup>
const elxImgboxVisible = ref(false)
const visible = ref(false)

const props = defineProps({
  modelValue: {
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
  },
  showDelete: {
    default: false,
    type: Boolean
  }
})
const emit = defineEmits(['update:modelValue', 'input'])

// 打开图片选择窗
const elxImgboxRef = ref(null)
const elxImgboxHandle = () => {
  if (!props.show) return
  if (props.disabled) {
    openImg()
    return false
  }
  elxImgboxVisible.value = true
  nextTick(() => {
    elxImgboxRef.value?.init(1)
  })
}

const openImg = () => {
  visible.value = true
}

const refreshPic = (imagePath) => {
  emit('update:modelValue', imagePath)
  emit('input', imagePath)
}

const detailImg = () => {
  refreshPic('')
}
</script>
<style lang="scss" scoped>
.component-img-upload-box {
  max-height: 120px;

  .show-pic{
    height: 100%;
    .blackba {
      display: none;
      position: absolute;
      background: rgba(0, 0, 0, 0.7) !important;
      left: 0;
      border: none !important;
    }
    &:hover .blackba {
      display: inline-block !important;
    }
    .delete {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
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
    .el-upload:hover {
      border-color: #409eff;
    }
  }
}
</style>
