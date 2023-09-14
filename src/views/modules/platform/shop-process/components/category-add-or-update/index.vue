<template>
  <div class="category-components">
    <div class="content">
      <!-- 左边-全部分类列表 -->
      <div
        v-loading="loading"
        element-loading-text="数据处理中..."
        class="left-box"
      >
        <div class="tree-box">
          <el-tree
            ref="categoryTreeRef"
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
            @check="onCheckChange"
            @node-click="onNodeClick"
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
                <el-input
                  v-model.number="scope.row.customizeRate"
                  :min="0"
                  :max="99.9999"
                  :precision="4"
                  placeholder="0~99.9999"
                  size="small"
                  style="width: 80%;"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
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
                link
                type="primary"
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
import { enableCategories } from '@/api/product/category.js'
import { treeDataTranslate } from '@/utils/index.js'
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

onMounted(() => {
  getPlatformCategory()
})

/**
 * 获取平台分类列表，并转换成树形结构
 */
const getPlatformCategory = () => {
  loading.value = true
  // 包含三级分类的分类列表
  enableCategories({ shopId: 0 }).then((data1) => {
    data1 = data1.filter((item) => {
      return item.status === 1
    })
    loading.value = false
    nextTick(() => {
      categorgTreeData.value = treeDataTranslate(data1, 'categoryId', 'parentId')
    })
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
    signCategoryIds.value.push(el.categoryId)
    // 已选分类的父分类id
    signCategoryParentIds.value.push(el.parentId)
  })
  if (sts === 1) {
    nextTick(() => {
      categoryTreeRef.value.setCheckedKeys(signCategoryIds.value)
    })
  }
}

let message = false
/**
 * 对勾选到的数据逐一处理
 * @param nodeObj 节点数据
 * @param isExist 是否为选中状态
 * @returns {Promise<void>}
 */
const onCheckLevel = async (nodeObj, isExist) => {
  const isExistTwo = signCategoryList.value.some(item => item.categoryId === nodeObj.categoryId)
  if (nodeObj.level !== 2) {
    return
  }
  if (isExist) {
    if (signCategoryList.value.length >= 200) {
      if (!message) {
        message = true
        ElMessage({
          message: '最多可签约 200 个类目',
          type: 'error',
          duration: 1000,
          onClose: () => {
            message = false
          }
        })
      }
      getIds(signCategoryList.value, 1)
      return
    }
    if (isExistTwo) {
      return
    }
    const signCategoryObj = {
      categoryId: nodeObj.categoryId,
      name: nodeObj.name,
      parentName: nodeObj.parentName,
      platformRate: nodeObj.deductionRate,
      categoryStatus: nodeObj.status,
      qualifications: ''
    }
    signCategoryList.value.push(signCategoryObj)
  } else {
    deleteById(nodeObj.categoryId, signCategoryList.value)
  }
}

/**
 * 将勾选到的数据进行遍历
 * @param nodeObj 勾选到的当前节点数据
 * @param isExist 判断是否为选中状态
 * @returns {Promise<void>}
 */
const onHandleCheck = async (nodeObj, isExist) => {
  await onCheckLevel(nodeObj, isExist)
  if (nodeObj.children && nodeObj.children.length > 0) {
    for (const item of nodeObj.children) {
      await onCheckLevel(item, isExist)
      if (item.children && item.children.length > 0) {
        for (const childItem of item.children) {
          if (signCategoryList.value.length >= 200 && isExist) {
            await getIds(signCategoryList.value, 1)
            return
          }
          await onCheckLevel(childItem, isExist)
        }
      }
    }
  }
}

/**
 * 节点选中状态发生变化时的回调
 * @param {Object} nodeObj 该节点所对应的对象
 * @param {Boolean} nodeStatus 节点本身是否被选中
 */
const onCheckChange = async (nodeObj, nodeStatus) => {
  const isExist = nodeStatus.checkedKeys.includes(nodeObj.categoryId)
  if (nodeObj.level !== 2 && signCategoryList.value.length >= 200 && isExist) {
    ElMessage({
      message: '最多可签约 200 个类目',
      type: 'error',
      duration: 1000
    })
    await getIds(signCategoryList.value, 1)
    return
  }
  if (nodeObj.level === 2) {
    await onHandleCheck(nodeObj, isExist)
    return
  }
  loading.value = true
  setTimeout(() => {
    onHandleCheck(nodeObj, isExist).then(() => {
      loading.value = false
    })
  }, 200)
}

/**
 * 点击节点时触发
 * @param nodeObj 对应于节点点击的节点对象
 * @param nodeStatus TreeNode 的 node 属性
 * @returns {Promise<void>}
 */
const onNodeClick = async (nodeObj, nodeStatus) => {
  if (nodeStatus.level !== 3) return
  await onCheckLevel(nodeObj, !nodeStatus.checked)
  await getIds(signCategoryList.value, 1)
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
@use "index";
</style>
