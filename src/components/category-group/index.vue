<template>
  <div class="component-category-group">
    <div class="category classify-show">
      <div
        v-if="selectedCategories.length > 0 && single"
        class="category-sel1 classify"
      >
        <!-- 商品详情/分类 -->
        <span v-if="selectedCategories[0]">
          {{ selectedCategories[0].name }}
        </span>
        <span v-if="selectedCategories[1]">
          &nbsp;>&nbsp;
          {{ selectedCategories[1].name }}
        </span>
        <span v-if="selectedCategories[2]">
          &nbsp;>&nbsp;
          {{ selectedCategories[2].name }}
        </span>
        <span
          v-if="isCreateCategory && showCategorySelectBtn"
          class="del-cate"
          @click="deleteCategoryItemOfSelected"
        >×</span>
      </div>
      <div
        v-if="showCategorySelectBtn && single"
        class="change-category change-classify"
        @click="selectOrReviseCategory"
      >
        {{ selectedCategories.length?'修改':'选择' }}分类
      </div>
      <!-- 品牌/属性 -->
      <div
        v-if="selectedCategories.length > 0 && multiple"
        class="category-sel2"
      >
        <p
          v-for="(item,index) in selectedCategories"
          :key="index"
        >
          <span v-if="item.firstCategoryName">
            {{ item.firstCategoryName }}
          </span>
          <span v-if="item.secondCategoryName">&nbsp;>&nbsp;
            {{ item.secondCategoryName }}
          </span>
          <span v-if="item.threeCategoryName">&nbsp;>&nbsp;
            {{ item.threeCategoryName }}
          </span>
          <span
            class="del-cate"
            @click="deleteCategoryItemOfSelected(index)"
          >×</span>
        </p>
        <p
          class="change-category"
          @click="selectOrReviseCategory"
        >
          选择分类
        </p>
      </div>
      <div
        v-if="!selectedCategories.length && multiple"
        class="change-category"
        @click="selectOrReviseCategory"
      >
        选择分类
      </div>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['selectOrReviseCategory', 'deleteCategoryItemOfSelected'])
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  selectedCategories: {
    type: Array,
    default () {
      return []
    }
  },
  showCategorySelectBtn: {
    type: Boolean,
    default () {
      return true
    }
  },
  multiple: {
    type: Boolean,
    default () {
      return false
    }
  },
  single: {
    type: Boolean,
    default () {
      return false
    }
  },
  isCreateCategory: {
    type: Boolean,
    default () {
      return false
    }
  }
})

// 选择/修改分类
const selectOrReviseCategory = () => {
  emit('selectOrReviseCategory')
}

// 删除
const deleteCategoryItemOfSelected = (index) => {
  emit('deleteCategoryItemOfSelected', index)
}

</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.component-category-group {
  .category {
    display: flex;
    align-items: flex-end;
    font-size: 13px;
    .category-sel1 {
      max-width: 640px;
      line-height: 1.5em;
      padding: 8px;
      border: 1px solid #eee;
      .del-cate {
        color: #999;
        border-color: #999;
      }
    }
    .category-sel2 {
      display: inline-block;
      max-width: 640px;
      p {
        display: inline-block;
        line-height: 1.5em;
        padding: 8px;
        border: 1px solid #eee;
        margin-right: 5px;
        margin-bottom: 5px;
      }
      p.change-category  {
        border: none;
      }
    }
    .del-cate {
      display: inline-block;
      text-align: center;
      font-size: 13px;
      width: 13px;
      height: 13px;
      line-height: 12px;
      border: 1px solid #eee;
      border-radius: 50%;
      color: #eee;
      margin-left: 10px;
    }
    .category-sel1:hover,
    .category-sel2 p:hover {
      border-color: #ccc;
      .del-cate {
        cursor: pointer;
        display: inline-block;
        border-color: #999;
        color: #999;
      }
    }
    .change-category {
      color: #0071db;
      cursor: pointer;
      line-height: 36px;
    }
    .change-category:hover {
      color: #0258a8;
    }
  }
}
</style>
