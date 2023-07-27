<template>
  <!-- 标题栏 -->
  <div class="component-customer-profile-title">
    <div class="has-tooltip">
      <span>{{ titleInfo.title }}</span>
      <el-popover
        placement="top"
        width="300"
        trigger="hover"
        :content="titleInfo.content"
      >
        <template #reference>
          <el-button class="tit-mod-btn">
            <div class="que-mark">
              ?
            </div>
          </el-button>
        </template>
      </el-popover>
    </div>
    <el-button
      v-if="showExport"
      v-permission="permission"
      type="primary"
      class="filter-item"
      @click="exportFrom()"
    >
      导出
    </el-button>
  </div>
</template>

<script setup>
import { checkPermission } from '@/directive/permission/index.js'

const vPermission = checkPermission

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  titleInfo: {
    type: Object,
    default () {
      return {}
    }
  },
  showExport: {
    type: Boolean,
    default: false
  },
  permission: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['exportFrom'])

const exportFrom = () => {
  emit('exportFrom')
}

</script>

<style lang="scss" scoped>
.component-customer-profile-title {
  display: flex;
  justify-content: space-between;
  // 文字提示框盒子
  :deep(.has-tooltip) {
    display: flex;
    align-items: center;
    // justify-content: center;
    span {
      line-height: 18px;
      font-size: 18px;
      color: #333;
      font-weight: bold;
    }
    .el-button {
      width: auto;
      height: auto;
      padding: 0;
      border: none;
    }
    .el-button:hover, .el-button:focus {
      color: #333;
      background-color: transparent;
    }
    // 文字提示框的问号icon
    .que-mark {
      display: inline-block;
      width: 14px;
      height: 14px;
      line-height: 14px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      background: #C8C9CC;
      border-radius: 50%;
      margin-left: 5px;
      cursor: default;
    }
  }
}
</style>
