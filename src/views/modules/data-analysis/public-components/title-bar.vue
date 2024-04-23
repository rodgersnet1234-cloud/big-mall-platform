<template>
  <!-- 数据分析板块标题栏组件 -->
  <div class="data-analysis component-title-bar">
    <div class="module-title">
      <div class="tit-lf">
        {{ title }}
      </div>
      <div class="tit-rg">
        <DateTypeSelect
          v-if="showTimeScreening"
          v-model:dateType="dateType"
          @change-data="changeData"
        />
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
    </div>
  </div>
</template>

<script setup>
import DateTypeSelect from './date-type-select.vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showTimeScreening: {
    type: Boolean,
    default: false
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

const emit = defineEmits(['getDateTime', 'exportFrom'])

const dateType = ref(4)
const changeData = (val) => {
  emit('getDateTime', {
    startTime: val[0],
    endTime: val[1],
    timeType: dateType.value
  })
}

// 导出
const exportFrom = () => {
  emit('exportFrom')
}

</script>

<style lang="scss" scoped>
// 数据分析板块标题栏
.data-analysis.component-title-bar {
  // 板块标题栏
  .module-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f7f8fa;
    padding: 16px 10px;
    .tit-lf {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 17px;
      font-weight: bold;
      padding-left: 6px;
      color: #333;
    }
    .tit-lf::before {
      display: block;
      content: '';
      width: 3px;
      height: 16px;
      background: #155bd4;
      margin-right: 5px;
      border-radius: 8px;
    }
    .tit-rg {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }
}
</style>
