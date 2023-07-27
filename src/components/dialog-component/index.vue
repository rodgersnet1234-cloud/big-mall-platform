<template>
  <div class="dialog-container">
    <el-dialog
      v-model="visible"
      :title="headerTitle"
      :width="dialogWidth"
      :close-on-click-modal="closeOnClickModal"
      :append-to-body="appendToBody"
      :before-close="handleClose"
      class="dialog-container"
    >
      <template #header>
        <div>
          <slot name="title" />
        </div>
      </template>
      <div class="contents-body">
        <slot name="contents" />
      </div>
      <div
        class="dialog-footers"
      >
        <slot name="footers" />
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
const emit = defineEmits(['handleClose'])
const props = defineProps({
  headerTitle: { // 头部标题
    type: String,
    default: () => ''
  },
  dialogVisible: { // 弹窗是否显示
    type: Boolean,
    default: () => false
  },
  dialogWidth: { // 弹窗的宽度
    type: String,
    default: () => '50%'
  },
  closeOnClickModal: { // 是否点击遮罩层关闭
    type: Boolean,
    default: () => false
  },
  appendToBody: {
    type: Boolean,
    default: () => true
  }
})
const visible = ref(props.dialogVisible)
watch(() => props.dialogVisible, (val) => {
  visible.value = val
}, { deep: true })
const handleClose = () => {
  emit('handleClose')
}
</script>
<style lang="scss" scoped>
.dialog-container {

        .dialog-footers {
                width: 100%;
                height: 56px;
                text-align: center;
                :deep(.el-button) {
                    padding: 9px 20px;
                }
            }
    }

</style>
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="scss">
        .el-dialog {
            top: 50%!important;
            margin-top: 0!important;
            transform: translate(0, -50%)!important;
            .el-dialog__body {
                padding: 0;
            }
        }
</style>
