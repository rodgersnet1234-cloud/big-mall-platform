<template>
  <div class="spu-catagory-attrs">
    <div class="part-section">
      <div
        v-for="(attrs, attrIdx) in attrsList"
        :key="attrIdx"
        class="part-sec-item"
      >
        <div class="flx">
          <div class="sec-tit">
            <span
              v-if="attrs.searchType === 1"
              class="required"
            >* </span>
            <span class="name">{{ attrs.name }}</span>
          </div>
          <el-select
            v-if="attrs.attrValues.length"
            v-model="attrs.attrValue"
            :disabled="inputDisabled"
            placeholder="请选择"
            style="width:230px"
            @change="getValueOfBasicAttrs(attrs, 0)"
          >
            <el-option
              v-for="item in attrs.attrValues"
              :key="item.attrValueId"
              :disabled="disabled"
              :label="item.value"
              :value="item.attrValueId"
            />
          </el-select>
          <el-input
            v-else
            v-model="attrs.attrValue"
            :disabled="inputDisabled"
            style="width:230px"
            @blur="getValueOfBasicAttrs(attrs, 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['getValueOfBasicAttrs'])
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  attrsList: {
    type: Array,
    default () {
      return []
    }
  },
  disabled: {
    type: Boolean,
    default () {
      return true
    }
  },
  inputDisabled: {
    type: Boolean,
    default () {
      return false
    }
  }
})

// 获取数据
const getValueOfBasicAttrs = (attrs, st) => {
  emit('getValueOfBasicAttrs', attrs, st)
}

</script>

<style lang="scss" scoped>
.spu-catagory-attrs {
  .required{
    color: #ff4949 !important;
  }
  .part-section {
    background: #f9f9f9;
    padding: 20px 20px 0;
    text-align: left;
    width: 680px;
    overflow: hidden;
    .part-sec-item {
      display: inline-block;
      width: 48%;
      margin-bottom: 20px;
      margin-right: 10px;
      .flx {
        display: flex;
        align-items: baseline;
        :deep(.sec-tit) {
          position: relative;
          margin-right: 15px;
          text-align: right;
          line-height: 1.5em;
          width: 100px;
          // 三角形样式
          .stars-icon {
            color: #ff4949;
            margin-right: 2px;
          }
        }
      }
    }
    .part-sec-item:nth-child(2n) {
      margin-right: 0;
    }
  }
}
</style>
