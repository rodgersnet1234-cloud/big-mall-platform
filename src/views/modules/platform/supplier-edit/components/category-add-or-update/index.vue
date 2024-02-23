<template>
  <el-dialog
    v-model="visible"
    class="component-supplier-category-dialog"
    width="80%"
    top="8vh"
    :show-close="false"
    @close="closePopup"
  >
    <div class="">
      <div class="popup">
        <div class="title">
          <div class="text">
            <span class="stress">*</span>编辑签约类目
          </div>
          <div class="tips">
            请选择末级类目签约，已签约
            <span class="text-blod">{{ signCategoryList.length }}</span>
            个类目，最多可签约
            <span class="text-blod">200</span>
            个类目
          </div>
          <div
            class="close-btn"
            @click="closePopup"
          >
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </div>
        <div class="content">
          <div
            v-loading="loading"
            class="left-box"
            element-loading-text="数据处理中..."
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
                :default-expanded-keys="signCategoryParentIds"
                :default-checked-keys="signCategoryIds"
                accordion
                icon-class="el-icon-arrow-right"
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
          <div
            ref="tableBoxRef"
            class="right-box table-box"
          >
            <!-- height="572" -->
            <el-table
              :data="signCategories"
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
                label="平台扣率"
                align="center"
              >
                <template #default="{ row }">
                  <span>{{ row.platformRate }} %</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="customizeRate"
                label="自定义类目扣率"
              >
                <template #default="scope">
                  <div class="custom-rate">
                    <el-input
                      v-model="scope.row.customizeRate"
                      :min="0"
                      :max="99.99"
                      :precision="2"
                      placeholder="0~99.99"
                      size="small"
                      style="width: 80%;"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      @blur="checkCustomizeRateInt(scope)"
                      @keydown="channelInputLimit"
                    />
                    %
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="qualifications"
                label="经营资质"
                width="230px"
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
                prop="categoryStatus"
                label="状态"
                width="80"
              >
                <template #default="scope">
                  <div
                    v-if="scope.row.categoryStatus === 1"
                    class="tag-txt"
                  >
                    正常
                  </div>
                  <div
                    v-if="scope.row.categoryStatus === 0"
                    class="tag-txt red-tag-txt"
                  >
                    下架
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
        </div>
        <div class="btn-box">
          <div
            class="cancel-btn"
            @click="closePopup"
          >
            取消
          </div>
          <div
            class="confirm-btn"
            @click="comfirmSubmit"
          >
            确定
          </div>
        </div>
      </div>
      <div class="shelter-layer" />
    </div>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/platform/audit-supplier.js'
import { enableCategories } from '@/api/product/category.js'
import { treeDataTranslate } from '@/utils/index.js'
import { Debounce } from '@/utils/debounce.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['closePopup'])

const shopId = ref(0)
const categorgTreeData = ref([])
const categoryListTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})
const visible = ref(false)

// table渲染列表
const signCategories = ref([])
// 总已选分类
const newSignCategories = ref([])

// 已选分类id数组
const signCategoryIds = ref([])
// 已选分类父分类id数组
const signCategoryParentIds = ref([])

const loading = ref(false)
const messageClosed = ref(true)
const signCategoryList = ref([])
const tableBoxRef = ref('')
const categoryTreeRef = ref('')

const init = (shopIds, signCategoryLists) => {
  signCategoryList.value = JSON.parse(JSON.stringify(signCategoryLists)) || []
  shopId.value = shopIds
  getPlatformCategory()
  getSignCategoryList()
  visible.value = true

  nextTick(() => {
    tableBoxRef.value.addEventListener('scroll', onScroll, true)
  })
}
defineExpose({
  init
})
/**
 * 获取SaaS分类列表，并转换成树形结构
 */
const getPlatformCategory = () => {
  loading.value = true
  // 包含三级分类的分类列表
  enableCategories({ shopId: 0 }).then(data => {
    data = data.filter((item) => item.status === 1)
    loading.value = false
    categorgTreeData.value = treeDataTranslate(data, 'categoryId', 'parentId')
    categorgTreeData.value = removeNotThirdCategoryItem(categorgTreeData.value)
  })
}

/**
 * 签约类目列表
 */
const getSignCategoryList = (sts = 0) => {
  // api.queryCategoryContract({ shopId: shopId }).then(data => {
  //   signCategoryList = data
  //   getIds(data, 0)
  // })

  newSignCategories.value = JSON.parse(JSON.stringify(signCategoryList.value))
  signCategories.value = newSignCategories.value.splice(0, 15)
  // signCategories = newSignCategories
  getIds(signCategoryList.value, sts)
}

const getIds = (data, sts) => {
  signCategoryIds.value.splice(0, signCategoryIds.value.length)
  signCategoryParentIds.value.splice(0, signCategoryParentIds.value.length)
  data.forEach(el => {
    // 已选分类id
    signCategoryIds.value.push(el.categoryId)
    // 已选分类的父分类id
    if (sts !== 2) {
      signCategoryParentIds.value.push(el.parentId)
    }
  })
  if (sts === 1) {
    nextTick(() => {
      categoryTreeRef.value.setCheckedKeys(signCategoryIds.value)
    })
  }
}

/**
 * 监听滚动
 */
const onScroll = () => {
  const boxDome = document.querySelector(
    '.right-box.table-box .el-table .el-table__body-wrapper'
  )
  const tableDome = document.querySelector(
    '.right-box.table-box .el-table .el-table__body-wrapper .el-table__body'
  )
  // 容器高度
  const boxHeight = boxDome.offsetHeight
  // 距离顶部距离
  const boxScrollTop = boxDome.scrollTop
  // 表格高度
  const tableHeight = tableDome.offsetHeight

  if ((tableHeight - boxHeight - boxScrollTop) <= 100) {
    // if (boxScrollTop === tableHeight - boxHeight) {
    signCategories.value = signCategories.value.concat(newSignCategories.value.splice(0, 15))
  }
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
    const signCategory = {
      categoryId: nodeObj.categoryId,
      name: nodeObj.name,
      parentName: nodeObj.parentName,
      platformRate: nodeObj.deductionRate,
      categoryStatus: nodeObj.status,
      qualifications: ''
    }
    signCategoryList.value.push(signCategory)
    newSignCategories.value.push(signCategory)
    if (signCategories.value.length < 10) {
      signCategories.value = signCategories.value.concat(newSignCategories.value.splice(0, 10))
    } else {
      nextTick(() => {
        onScroll()
      })
    }
  } else {
    signCategoryList.value = deleteById(nodeObj.categoryId, signCategoryList.value)
    newSignCategories.value = deleteById(nodeObj.categoryId, newSignCategories.value)
    signCategories.value = deleteById(nodeObj.categoryId, signCategories.value)
    nextTick(() => {
      onScroll()
    })
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
 * 自定义扣率输入框判断
 */
const checkCustomizeRateInt = (scope) => {
  const { row, $index } = scope
  const customizeRate = parseFloat(row.customizeRate)
  if (!customizeRate) {
    return
  }
  const reg1 = /^(\d{1,2})$/
  const reg2 = /^((\d{1,2})|(0{1}))(\.\d{0,2})$/
  if (!reg1.test(customizeRate)) {
    if (!reg2.test(customizeRate)) {
      signCategories.value[$index].customizeRate = ''
      messageClosed.value = false
      ElMessage({
        message: '自定义类目扣率数值在0~99.99之间，最多保留2位小数',
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
  if (key === '-' || key === '+' || (key === '.' && e.target.value?.includes('.'))) {
    e.returnValue = false
    return false
  }
  return true
}

/**
 * 签约分类
 */
const signCategory = Debounce(function () {
  if (!messageClosed) {
    return
  }
  const categoryShopDTOList = []
  signCategoryList.value.forEach(item => {
    const param = {
      categoryId: item.categoryId,
      rate: item.customizeRate,
      qualifications: item.qualifications ? item.qualifications : null,
      shopId: shopId.value
    }
    categoryShopDTOList.push(param)
  })
  const params = {
    categoryShopDTOList,
    shopId: shopId.value,
    sysType: 3
  }
  api.signCategory(params).then(() => {
    ElMessage({
      message: '类目保存成功！',
      type: 'success',
      duration: 1000
    })
    closePopup()
  })
}, 1500)

/**
 * 确认提交
 */
const comfirmSubmit = () => {
  if (signCategoryList.value.length > 0) {
    signCategoryList.value.forEach((el) => {
      signCategories.value.forEach((item) => {
        if (el.categoryId === item.categoryId) {
          el.qualifications = item.qualifications
          el.customizeRate = item.customizeRate
        }
      })
    })
    signCategory()
  } else {
    ElMessage({
      message: '请选择至少一种分类',
      type: 'error',
      duration: 1000
    })
  }
}

/**
 * 删除已选分类
 */
const deleteSelectedCategory = (scope) => {
  const index = scope.$index
  signCategoryList.value.splice(index, 1)
  signCategories.value.splice(index, 1)
  getIds(signCategoryList.value, 1)
  onScroll()
}

/**
 * 关闭弹窗
 */
const closePopup = () => {
  emit('closePopup', 'category')
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
