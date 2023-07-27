<template>
  <div class="category-selector">
    <el-dialog
      :title="$t('components.selector.categorySelector')"
      v-model="visible"
      :append-to-body="visible"
      @close="closeDialog"
      width="1000px">
      <div class="prod-category clearfix">
        <div class="category">
          <!-- 分类 -->
          <div class="category-box">
            <el-input v-model="firstCategorys.name" :placeholder="$t('components.selector.chooseProdCateg')" :disabled="true"></el-input>
            <ul class="category-list">
              <li
                class="category-item"
                :class="item.categoryId === firstCategorys.id?'active':''"
                @click="selectfirstCategorys(item.categoryId, index)"
                v-for="(item,index) in firstCategorys.dataList"
                :key="item.categoryId"
              ><div>{{item.name}}</div></li>
            </ul>
          </div>
          <!-- 分类 -->
          <div class="category-box" v-if="secondCategorys.dataList && secondCategorys.dataList.length && firstCategorys.id !== 0">
            <el-input :placeholder="$t('components.selector.chooseProdCateg')" v-model="secondCategorys.name" :disabled="true"></el-input>
            <ul class="category-list">
              <li
                class="category-item"
                :class="item.categoryId === secondCategorys.id?'active':''"
                @click="selectSecondCategorys(item.categoryId,index)"
                v-for="(item,index) in secondCategorys.dataList"
                :key="item.categoryId"
              ><div>{{item.name}}</div></li>
            </ul>
          </div>
          <!-- 分类 -->
          <div v-if="threeCategorys.dataList.length > 0 && secondCategorys.id !== 0" class="category-box">
            <el-input v-model="threeCategorys.name" :placeholder="$t('components.selector.chooseProdCateg')" :disabled="true"></el-input>
            <ul class="category-list">
              <li
                class="category-item"
                :class="[isCreateCategory?'prohibit-sel':item.categoryId === threeCategorys.id?'active':'']"
                @click="selectThreeCategorys(item.categoryId,index)"
                v-for="(item,index) in threeCategorys.dataList"
                :key="item.categoryId"
              >
                <div>{{item.name}}</div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 当前选择 -->
        <div class="current-selected">
          <span class="blod">{{$t("components.selector.currCho")}}：</span>
          <span class="select-item">{{firstCategorys.name}}</span>
          <span class="select-item" v-if="secondCategorys.id">&nbsp;>&nbsp;&nbsp;{{secondCategorys.name}}</span>
          <span class="select-item" v-if="threeCategorys.id">&nbsp;>&nbsp;&nbsp;{{threeCategorys.name}}</span>
        </div>
        <!-- 确认 -->
        <div class="read-rule">
          <div class="read-rule-txt"
               :class="(!isCreateCategory && threeCategorys.id !== 0) || (isCreateCategory && firstCategorys.id !== 0)?'todo':''"
               @click="optionsConfirm">{{$t("components.selector.haveReadFol")}}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/product/category'

const emit = defineEmits(['closeDialog', 'getCategorySelected'])

const visible = ref(false)
const allDataList = ref([])
// 第一个分类
const firstCategorys = ref({
  id: 0,
  name: '',
  dataList: []
})
// 第二个分类
const secondCategorys = ref({
  id: 0,
  name: '',
  dataList: []
})
// 第三个分类
const threeCategorys = ref({
  id: 0,
  name: '',
  dataList: []
})
const parentId = ref(0)
const isCreateCategory = ref(false) // 是否创建（平台）分类选择
const props = defineProps({
  // categoryList: Array
  hasThreeCategory: {
    default: true,
    type: Boolean
  }
})

/**
 * 初始化
 */
const init = (type, selectedCategories) => {
  visible.value = true
  if (selectedCategories && selectedCategories.length > 0) {
    firstCategorys.value = selectedCategories[0] || firstCategorys.value
    secondCategorys.value = selectedCategories[1] || secondCategorys.value
    threeCategorys.value = selectedCategories[2] || threeCategorys.value
  }
  const request = props.hasThreeCategory ? api.enableCategories() : api.shopCategoryPage()
  request.then(data => {
    if (props.hasThreeCategory) {
      let firstCategorysList = [] // 一级分类
      let secondCategorysList = [] // 二级分类
      const threeCategorysList = [] // 三级分类
      // 筛选当前分类是否有下一级分类
      const screen = (upperArr, lowerArr) => {
        return upperArr.filter(item => {
          return lowerArr.some(el => {
            return el.parentId === item.categoryId
          })
        })
      }
      data.forEach((item) => {
        if (item.status === 1) {
          if (item.level === 0) {
            firstCategorysList.push(item)
          }
          if (item.level === 1) {
            secondCategorysList.push(item)
          }
          if (item.level === 2) {
            threeCategorysList.push(item)
          }
        }
      })
      // 筛选二级分类
      secondCategorysList = screen(secondCategorysList, threeCategorysList)
      // 筛选一级分类
      firstCategorysList = screen(firstCategorysList, secondCategorysList)
      data = [...firstCategorysList, ...secondCategorysList, ...threeCategorysList]
    }
    allDataList.value = data
    firstCategorys.value.dataList = allDataList.value.filter(item => item.level === 0)
    if (selectedCategories && selectedCategories.length === 2) {
      secondCategorys.value.dataList = allDataList.value.filter(item => item.parentId === firstCategorys.value.id)
    }
  })
  isCreateCategory.value = type && type === 1
}
const show = () => {
  visible.value = true
}
const hide = () => {
  visible.value = false
}
// 选中第一个分类
const selectfirstCategorys = (categoryId, index) => {
  secondCategorys.value.dataList = allDataList.value.filter(item => item.parentId === categoryId)
  firstCategorys.value.name = index >= 0 ? firstCategorys.value.dataList[index].name : firstCategorys.value.name
  parentId.value = firstCategorys.value.id = categoryId
  secondCategorys.value.id = 0
  threeCategorys.value.id = 0
}
// 选中第二个分类
const selectSecondCategorys = (categoryId, index) => {
  threeCategorys.value.dataList = allDataList.value.filter(item => item.parentId === categoryId)
  parentId.value = secondCategorys.value.id = categoryId
  secondCategorys.value.name = index >= 0 ? secondCategorys.value.dataList[index].name : secondCategorys.value.name
  threeCategorys.value.id = 0
}
// 选中第三个分类
const selectThreeCategorys = (categoryId, index) => {
  if (isCreateCategory.value) {
    return
  }
  parentId.value = threeCategorys.value.id = categoryId
  threeCategorys.value.name = index >= 0 ? threeCategorys.value.dataList[index].name : threeCategorys.value.name
}
// Dialog 关闭
const closeDialog = () => {
  emit('closeDialog')
}
// 新增 / 修改
const optionsConfirm = () => {
  if (!isCreateCategory.value && !threeCategorys.value.id) {
    return
  }
  if (isCreateCategory.value && !firstCategorys.value.id) {
    return
  }
  // $store.commit('common/removeMainActiveTab')
  const selectedCategories = []
  if (firstCategorys.value.id) {
    selectedCategories.push(firstCategorys.value)
  }
  if (secondCategorys.value.id) {
    selectedCategories.push(secondCategorys.value)
  }
  if (!isCreateCategory.value && threeCategorys.value.id) {
    selectedCategories.push(threeCategorys.value)
  }
  emit('getCategorySelected', selectedCategories, parentId.value)
}

defineExpose({ init })
</script>

<style lang="scss">
  .prod-category {
    .clearfix::after {
      display: block;
      content: "";
      visibility: hidden;
      height: 0;
      clear: both;
    }
    width: 90%;
    margin: 0 auto;
    ul,
    li {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .tips {
      // display: inline-block;
      float: right;
      padding: 10px 12px;
      background: #155bd4;
      color: #fff;
      font-size: 13px;
      margin: 0;
    }
    .category-box {
      box-sizing: border-box;
      width: 32%;
      box-sizing: border-box;
      display: inline-block;
      border: 1px solid #e4e4e4;
      padding: 20px;
      background: #fff;
      box-shadow: 0px 5px 8px -4px #e2e2e2;
    }
    .int {
      width: 100%;
      height: 2.5em;
      line-height: 2.5em;
      text-indent: 1em;
      border: 1px solid #e2e2e2;
      border-radius: 5px;
      outline: none;
      /* box-shadow: 0px 5px 8px -4px #e2e2e2; */
    }
    input.int::placeholder {
      color: #bdbdbd;
    }
    .category-list {
      margin-top: 10px;
      height: 250px;
      margin-left: 10px;
      overflow-y: auto;
    }
    .category-item {
      max-width: 100%;
      padding: 6px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .category-item div{
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      word-break: break-word;
      word-wrap: break-word;
    }

    .category-item:hover,
    .category-item.active {
      // background: #e9f9ff;
      background: #f5f5f5;
      border-radius: 3px;
    }
    .current-selected {
      display: block;
      width: 100%;
      margin-top: 20px;
      border: 2px solid #fedbab;
      padding: 6px;
      background: #fffaf2;
      line-height: 1.5em;
      word-break: break-word;
      word-wrap: break-word;
      overflow: hidden;
    }
    .read-rule {
      width: 100%;
      margin-top: 20px;
    }
    .read-rule-txt {
      text-align: center;
      color: #fff;
      background: #999999;
      line-height: 3em;
      width: 50%;
      margin: 0 auto;
    }
    .rule {
      border: 1px solid #b9b9b9;
      padding: 0 10px;
      font-size: 13px;
      color: #777;
      margin-top: 20px;
    }
    .notice {
      line-height: 3em;
      border-bottom: 1px dashed #b9b9b9;
      margin: 0;
    }
    .blod {
      display: inline-block;
      font-weight: bold;
    }
    .rule-tit {
      text-align: center;
    }
    .rule-txt {
      line-height: 1.5em;
      padding-bottom: 30px;
    }
    .todo {
      background: #155bd4;
      cursor: pointer;
    }
    .prohibit-sel {
      cursor: not-allowed;
    }
  }
</style>
