<template>
  <div class="category-components">
    <div class="content">
      <!-- 左边-全部分类列表 -->
      <div class="left-box">
        <el-tree
          ref="categoryTreeRef"
          v-loading="loading"
          :data="categorgTreeData"
          node-key="categoryId"
          :props="categoryListTreeProps"
          class="filter-tree"
          show-checkbox
          :render-after-expand="false"
          highlight-current
          icon-class="el-icon-arrow-right"
          :default-expanded-keys="signCategoryParentIds"
          :default-checked-keys="signCategoryIds"
          @check-change="handleCheckChange"
        >
          <template #default="{ data }">
            <el-tooltip
              :content="data.level === 2 ? data.name + ' ' + data.deductionRate + '%' : data.name"
              placement="right"
              effect="light"
              :open-delay="500"
              class="custom-tree-node"
            >
              <span>{{ data.level === 2 ? data.name + ' ' + data.deductionRate + '%' : data.name }}</span>
            </el-tooltip>
          </template>
        </el-tree>
      </div>

      <!-- 右边-选中类目表格 -->
      <div
        ref="tableBoxRef"
        class="right-box table-box"
      >
        <el-table
          :data="signCategoryList"
          :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
        >
          <el-table-column
            prop="name"
            label="类目"
          />
          <el-table-column
            prop="parentName"
            label="上级类目"
          />
          <el-table-column
            prop="platformRate"
            label="类目扣率"
          >
            <template #default="{ row }">
              <span>{{ row.platformRate }} %</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="customizeRate"
            label="自定义类目扣率"
            min-width="125"
          >
            <template #default="scope">
              <div class="custom-rate">
                <!-- native modifier has been removed, please confirm whether the function has been affected  -->
                <el-input
                  v-model="scope.row.customizeRate"
                  type="number"
                  :min="0"
                  :max="99.9999"
                  :precision="4"
                  placeholder="0~99.9999"
                  size="mini"
                  style="width: 80%;"
                  @blur="checkCustomizeRateInt(scope)"
                  @keydown="channelInputLimit"
                />%
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="qualifications"
            label="经营资质"
            width="200px"
          >
            <template #default="scope">
              <div class="business-qual">
                <imgs-upload
                  v-model="scope.row.qualifications"
                  :limit="2"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="80px"
          >
            <template #default="scope">
              <el-button
                type="text"
                @click="deleteSelectedCategory(scope)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- /右边-选中类目表格 -->
    </div>
  </div>
</template>

<script setup>
import { enableCategories } from '@/api/product/category'
import { treeDataTranslate } from '@/utils'
import { ElMessage } from 'element-plus'

const props = defineProps({
  categorySigningList: {
    type: Array,
    default () {
      return []
    }
  }
})
const emit = defineEmits(['getSignCategoryList'])

const message = ref(false)
// 全部分类
const categorgTreeData = ref([])
const loading = ref(false)
const categoryListTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})

// 已选分类列表
const signCategoryList = ref([])
// 已选分类id数组
const signCategoryIds = ref([])
// 已选分类父分类id数组
const signCategoryParentIds = ref([])

// 已选分类列表
watch(() => signCategoryList.value, () => {
  emit('getSignCategoryList', signCategoryList.value)
}, { deep: true })
// 已选分类id数组
watch(signCategoryIds, () => {
  if (signCategoryList.value.length === 200) {
    // signCategoryIds[signCategoryIds.length].
  }
})

onMounted(() => {
  getPlatformCategory()
})

/**
 * 获取平台分类列表，并转换成树形结构
 */
const getPlatformCategory = () => {
  loading.value = true
  // 包含三级分类的分类列表
  enableCategories({ shopId: 0 }).then(data => {
    data = data.filter((item) => {
      return item.status === 1
    })
    loading.value = false
    const _categorgTreeData = treeDataTranslate(data, 'categoryId', 'parentId')
    // categorgTreeData = disabledParentCategory(categorgTreeData)
    categorgTreeData.value = _categorgTreeData
    categorgTreeData.value = removeNotThirdCategoryItem(categorgTreeData.value)
    signCategoryList.value = props.categorySigningList
    getIds(props.categorySigningList)
  })
}
/**
 * 去除没有三级分类的类目
 */
const removeNotThirdCategoryItem = (treeData) => {
  const firstCategory = treeData
  const length = firstCategory.length
  for (let i = 0, index = 0; i < length; i++) {
    if (firstCategory[index].level !== 2) {
      if (firstCategory[index].children && firstCategory[index].children.length > 0 && (firstCategory[index].children.some(item => item.children) || firstCategory[index].level !== 0)) {
        const secondCategory = firstCategory[index].children
        firstCategory[index].children = removeNotThirdCategoryItem(secondCategory)
      } else {
        firstCategory.splice(index, 1)
        // 当前位置的元素已经被删除，当前位置索引不用++
        continue
      }
    }
    index++
  }
  return firstCategory
}

const categoryTreeRef = ref('')

const getIds = (data, sts) => {
  signCategoryIds.value.splice(0, signCategoryIds.value.length)
  signCategoryParentIds.value.splice(0, signCategoryParentIds.value.length)
  data.forEach(el => {
    // 已选分类id
    console.log('bbbb')
    signCategoryIds.value.push(el.categoryId)
    // 已选分类的父分类id
    console.log('cccccc')
    signCategoryParentIds.value.push(el.parentId)
  })
  if (sts === 1) {
    nextTick(() => {
      categoryTreeRef.value.setCheckedKeys(signCategoryIds.value)
    })
  }
}

/**
 * 把categoryListTree第三级分类外，其余全部禁用
 */
const disabledParentCategory = (treeData) => {
  for (let i = 0; i < treeData.length; i++) {
    if (treeData[i].children) {
      treeData[i].disabled = true
      treeData[i].children = disabledParentCategory(treeData[i].children)
    }
  }
  return treeData
}

/**
 * 节点选中状态发生变化时的回调
 * @param {Object} nodeObj 该节点所对应的对象
 * @param {Boolean} nodeStatus 节点本身是否被选中
 */
const handleCheckChange = (nodeObj, nodeStatus) => {
  if (nodeObj.level !== 2) {
    return
  }
  if (nodeStatus) {
    if (signCategoryList.value.length === 200) {
      if (!message.value) {
        message.value = true
        ElMessage({
          message: '最多可选择200个类目',
          type: 'error',
          duration: 1000,
          onClose: () => {
            message.value = false
          }
        })
      }
      getIds(signCategoryList.value, 1)
      return
    }
    const signCategory = ref({
      categoryId: nodeObj.categoryId,
      name: nodeObj.name,
      parentName: nodeObj.parentName,
      platformRate: nodeObj.deductionRate,
      qualifications: '',
      parentId: nodeObj.parentId
    })
    signCategoryList.value.push(signCategory.value)
  } else {
    deleteById(nodeObj.categoryId, signCategoryList.value)
  }
}

/**
 * 根据id删除数组项
 * @param {Number} id 需要删除的id
 * @param {Array} list 目标数组
 * @return {Array}
 */
const deleteById = function (id, list) {
  for (let index = list.length - 1; index >= 0; index--) {
    if (list[index] && list[index].categoryId === id) {
      list.splice(index, 1)
    }
  }
  return list
}

/**
 * 删除已选分类
 */
const deleteSelectedCategory = (scope) => {
  const index = scope.$index
  signCategoryList.value.splice(index, 1)
  getIds(signCategoryList.value, 1)
}

const messageClosed = ref(null)
/**
 * 自定义扣率输入框判断
 */
const checkCustomizeRateInt = (scope) => {
  const { row, $index } = scope
  const customizeRate = parseFloat(row.customizeRate)
  if (!customizeRate) {
    return
  }
  const reg1 = /^(\d{1,2})$/
  const reg2 = /^((\d{1,2})|(0{1}))(\.\d{0,4})$/
  if (!reg1.test(customizeRate)) {
    if (!reg2.test(customizeRate)) {
      signCategoryList.value[$index].customizeRate = ''
      messageClosed.value = false
      ElMessage({
        message: '自定义类目扣率数值在0~99.9999之间，最多保留4位小数',
        type: 'error',
        duration: 2000,
        onClose: () => {
          messageClosed.value = true
        }
      })
    }
  }
}
const channelInputLimit = (e) => {
  const key = e.key
  // 不允许输入'-'
  if (key === '-' || key === '+') {
    e.returnValue = false
    return false
  }
  return true
}

</script>

<style lang="scss" scoped>
.category-components {
  .content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    color: #606266;
    // 左边-全部分类列表
    .left-box {
      display: block;
      width: 20%;
      min-width: 200px;
      height: 450px;
      margin-right: 10px;
      font-size: 14px;
      border: 1px solid #E9EAEC;
      background: #FFFFFF;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      overflow-y: scroll;
      padding: 10px 0;
      /* 谷歌隐藏滚动条 */
      &::-webkit-scrollbar {
        display: none;
      }
      /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
      /* IE隐藏滚动条 */
      -ms-overflow-style: none;
      /* 火狐隐藏滚动条 */
      overflow: -moz-scrollbars-none;

      ::v-deep .filter-tree {
        padding-right: 10px;
        .el-tree-node__expand-icon {
          position: absolute;
          right: 2%;
        }
        .el-checkbox {
          margin-left: 12px;
        }
        .el-tree-node__expand-icon.expanded {
          transform: rotate(-90deg);
        }
        .custom-tree-node {
          display: inline-block;
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    // 右边-选中分类表格
    .right-box.table-box {
      position: relative;
      display: block;
      width: 80%;
      max-height: 450px;
      border: 1px solid #E9EAEC;
      border-bottom: 0;
      box-sizing: border-box;

      // 上传图片样式
      .business-qual {
        ::v-deep(.mul-pic-upload .el-upload-list--picture-card .el-upload-list__item) {
          width: 80px;
          height: 80px;
          line-height: 80px;
          margin-bottom: 0;
        }
        ::v-deep(.mul-pic-upload .el-upload--picture-card) {
          width: 80px;
          height: 80px;
          line-height: 80px;
        }
      }

      // 表格
      ::v-deep(.el-table__body-wrapper) {
        max-height: 400px;
        overflow-y: scroll;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
      }
      ::v-deep(.el-table__body-wrapper::-webkit-scrollbar) {
        display: none; /* Chrome Safari */
      }
      ::v-deep(.el-table__body) {
        width: 100%;
      }
      // 自定义扣率
      .custom-rate {
        ::v-deep .el-input {
          .el-input__inner {
            padding: 0 5px;
            padding-right: 0;
          }
        }
      }
    }
  }
}
</style>
