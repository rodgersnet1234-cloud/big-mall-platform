<template>
  <div class="app-container">
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->

    <el-form @submit.prevent>
      <el-form-item>
        <el-alert
          title="商品类目最多可添加3个层级，一级及二级类目只做为结构类目存在，未添加三级类目的类目不会在商城前台展示。对商品类目的修改或删除将会影响到商品展示与销售利润，请谨慎操作，尽量使用“修改”而避免“删除”！"
          type="warning"
          show-icon
          :closable="false"
        />
      </el-form-item>
    </el-form>
    <!-- 搜索相关区域 -->
    <div class="filter-container">
      <!-- <el-button icon="el-icon-search" class="filter-item" @click="getPage()">{{ $t('table.search') }}</el-button> -->
      <el-button
        v-permission="['product:category:save']"
        type="primary"
        class="filter-item"
        @click="onAddOrUpdate()"
      >
        {{ $t('table.create') }}
      </el-button>
      <el-button
        v-permission="['platform:category:export']"
        type="primary"
        class="filter-item"
        @click="exportFrom()"
      >
        导出
      </el-button>
    </div>

    <!-- 分类列表 -->
    <div class="category-list">
      <!-- 一级 -->
      <div
        v-if="page.list.length"
        :class="['addr-list-box', page.list.length?'active':'']"
      >
        <div class="addr-list">
          <div
            v-for="(firstItem, index) in page.list"
            :key="index"
            :class="['addr-item', firstItemId===firstItem.categoryId?'active':'']"
          >
            <div
              class="dot"
              @click="getSecondList(index)"
            >
              {{ firstItem.name }}
            </div>
            <div class="btn">
              <div class="tag">
                <el-tag
                  v-if="firstItem.status == 0"
                  type="danger"
                >
                  下架
                </el-tag>
                <el-tag
                  v-else
                >
                  正常
                </el-tag>
              </div>
              <el-button
                v-permission="['product:category:update']"
                type="text"
                icon="el-icon-edit"
                @click="onAddOrUpdate(firstItem.categoryId, firstItem.level)"
              >
                编辑
              </el-button>
              <!-- 上架 -->
              <el-button
                v-if="firstItem.status === 0"
                v-permission="['product:category:updateStatus']"
                type="text"
                icon="el-icon-top"
                @click="enableOrDisable(firstItem.categoryId, firstItem.status, index)"
              >
                {{ $t('action.putOnShelf') }}
              </el-button>
              <!-- 下架 -->
              <el-button
                v-if="firstItem.status === 1"
                v-permission="['product:category:updateStatus']"
                type="text"
                icon="el-icon-bottom"
                @click="enableOrDisable(firstItem.categoryId, firstItem.status, index)"
              >
                {{ $t('action.offShelf') }}
              </el-button>
              <el-button
                v-permission="['product:category:delete']"
                type="text"
                icon="el-icon-delete"
                @click="onDelete(firstItem.categoryId)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 二级 -->
      <div
        v-if="secondList.length"
        :class="['addr-list-box', secondList.length?'active':'']"
      >
        <div class="addr-list">
          <div
            v-for="(secondItem, secondIdx) in secondList"
            :key="secondIdx"
            :class="['addr-item', secondItemId===secondItem.categoryId?'active':'']"
          >
            <div
              class="dot"
              @click="getThreeList(secondIdx)"
            >
              {{ secondItem.name }}
            </div>
            <div class="btn">
              <div class="tag">
                <el-tag
                  v-if="secondItem.status == 0"
                  type="danger"
                >
                  下架
                </el-tag>
                <el-tag
                  v-else
                >
                  正常
                </el-tag>
              </div>
              <el-button
                v-permission="['product:category:update']"
                type="text"
                icon="el-icon-edit"
                @click="onAddOrUpdate(secondItem.categoryId, secondItem.level)"
              >
                编辑
              </el-button>
              <!-- 上架 -->
              <el-button
                v-if="secondItem.status === 0"
                v-permission="['product:category:updateStatus']"
                type="text"
                icon="el-icon-top"
                @click="enableOrDisable(secondItem.categoryId, secondItem.status, secondIdx)"
              >
                {{ $t('action.putOnShelf') }}
              </el-button><!-- 下架 -->
              <el-button
                v-if="secondItem.status === 1"
                v-permission="['product:category:updateStatus']"
                type="text"
                icon="el-icon-bottom"
                @click="enableOrDisable(secondItem.categoryId, secondItem.status, secondIdx)"
              >
                {{ $t('action.offShelf') }}
              </el-button>
              <el-button
                v-permission="['product:category:delete']"
                type="text"
                icon="el-icon-delete"
                @click="onDelete(secondItem.categoryId)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 三级 -->
      <div
        v-if="threeList.length"
        :class="['addr-list-box', threeList.length?'active':'']"
      >
        <div class="addr-list">
          <div
            v-for="(threeItem, threeIdx) in threeList"
            :key="threeIdx"
            class="addr-item"
          >
            <div class="dot">
              {{ threeItem.name }}
            </div>
            <div class="btn">
              <div class="tag">
                <el-tag
                  v-if="threeItem.status == 0"
                  type="danger"
                >
                  下架
                </el-tag>
                <el-tag
                  v-else
                >
                  正常
                </el-tag>
              </div>
              <el-button
                v-permission="['product:category:update']"
                type="text"
                icon="el-icon-edit"
                @click="onAddOrUpdate(threeItem.categoryId, threeItem.level)"
              >
                编辑
              </el-button>
              <!-- 上架 -->
              <el-button
                v-if="threeItem.status === 0"
                v-permission="['product:category:updateStatus']"
                type="text"
                icon="el-icon-top"
                @click="enableOrDisable(threeItem.categoryId, threeItem.status, threeIdx)"
              >
                {{ $t('action.putOnShelf') }}
              </el-button>
              <!-- 下架 -->
              <el-button
                v-if="threeItem.status === 1"
                v-permission="['product:category:updateStatus']"
                type="text"
                icon="el-icon-bottom"
                @click="enableOrDisable(threeItem.categoryId, threeItem.status, threeIdx)"
              >
                {{ $t('action.offShelf') }}
              </el-button>
              <el-button
                v-permission="['product:category:delete']"
                type="text"
                icon="el-icon-delete"
                @click="onDelete(threeItem.categoryId)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!page.list.length"
        class="nodata"
      >
        暂无数据
      </div>
    </div>
    <!-- 分页条 -->
    <!-- <pagination v-show="page.total>0" :total="page.total" :page.sync="pageQuery.pageNum" :limit.sync="pageQuery.pageSize" @pagination="getPage()" /> -->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/product/category'
import { treeDataTranslate } from '@/utils'
import { ElMessageBox, ElMessage } from 'element-plus'

// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const page = reactive({
  list: [] // 返回的列表
  // total: 0, // 一共多少条数据
  // pages: 0 // 一共多少页
})
const secondList = ref([])
const threeList = ref([])
const secondIndex = ref('')
const threeIndex = ref('')
const secondItemId = ref(null)
const isSubmit = ref(true)
const firstItemId = ref(null)
const pageLoading = ref(true)
// 查询参数
const searchParam = {
}
const addOrUpdateVisible = ref(false)
const disable = ref(false)
onMounted(() => {
  isSubmit.value = false
  getPage()
})

const getPage = () => {
  pageLoading.value = true
  api.categoryPage({ ...pageQuery, ...searchParam }).then(pageVO => {
    secondList.value = threeList.value = []
    page.list = treeDataTranslate(pageVO, 'categoryId', 'parentId')
    pageLoading.value = false

    // 分类反显
    if (secondIndex !== '') {
      getSecondList(secondIndex)
      if (threeIndex !== '') {
        getThreeList(threeIndex)
      }
    }
  }).catch(() => {
    pageLoading.value = false
  })
}
const getSecondList = (idx) => {
  secondIndex.value = idx
  secondList.value = page.list[idx].children ? page.list[idx].children : []
  firstItemId.value = page.list[idx].categoryId
  threeList.value = []
}
const getThreeList = (idx) => {
  threeIndex.value = idx
  threeList.value = secondList.value[idx].children ? secondList.value[idx].children : []
  secondItemId.value = secondList.value[idx].categoryId
}

const addOrUpdateRef = ref(null)
/**
 * 更新
 */
const onAddOrUpdate = (categoryId, level) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(categoryId, level)
  })
}

/**
 * 导出
 */
const exportFrom = () => {
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    api.soldExcel({ ...pageQuery, ...searchParam }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      // var blob = data
      const fileName = '平台分类.xlsx'
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
      isSubmit.value = false
    }).catch((e) => {
      ElMessage.error(e)
      isSubmit.value = false
    })
  })
}
/**
 * 删除
 */
const onDelete = (categoryId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(categoryId))
}
const deleteById = (categoryId) => {
  api.deleteById(categoryId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

/**
 * 上架/下架分类
 */
const enableOrDisable = (categoryId, sts, idx) => {
  const categoryDTO = {}
  categoryDTO.categoryId = categoryId
  categoryDTO.status = sts === 0 ? 1 : 0
  ElMessageBox.confirm(sts === 1 ? '是否确认下架当前分类?' : '是否确认上架当前分类?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.enableOrDisable(categoryDTO).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => getPage()
      })
    })
  }).catch(() => {
  })
}

</script>

<style lang="scss">
.app-container {
  .cate-img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 200px;
  }
  .cate-icon-img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100px;
  }

  // 地址列表区域
  .category-list {
    // margin: 0 auto;
    display: flex;
    margin: 20px 30px;
    overflow-x: auto;
    .addr-list-box {
      width: 30%;
      min-width: 452px;
      padding: 15px 0;
      .addr-list {
        height: 650px;
        overflow: auto;
        .addr-item {
          font-size: 14px;
          color: #444;
          line-height: 2.5em;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .dot {
            position: relative;
            padding-left: 20px;
            cursor: pointer;
            width: 49%;
            min-width: 100px;
            box-sizing: border-box;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .dot::before {
            content: "";
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #bbb;
          }
          .btn {
            .tag {
              display: inline-block;
              margin-right: 10px;
            }
            min-width: 98px;
            margin-right: 10px;
            .el-button--text {
              color: #155bd4;
            }
          }
        }
        .addr-item:hover,
        .addr-item.active {
          background: #f5f7fa;
        }
      }
    }
    .addr-list-box.active {
      border: 1px solid #eee;
    }
    .addr-list-box.active:not(:first-child) {
      border-left: 0;
    }
    .nodata {
      width: 100%;
      text-align: center;
      font-size: 13px;
      color: #aaa;
      margin-top: 50px;
    }
  }
}
</style>
