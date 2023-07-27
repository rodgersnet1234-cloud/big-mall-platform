<template>
  <div class="components-seckill-category app-container">
    <!-- 秒杀分类 -->
    <div class="content-box">
      <div class="content">
        <div class="message">
          操作提示:
        </div>
        <div class="description">
          <p>店铺参与整点秒杀可为商品选择相应分类，最多可维护16个，仅在移动端进行展示</p>
          <p>可进行拖拽排序，按照后台先后顺序展示至活动首页</p>
        </div>
      </div>
    </div>
    <div class="classify-btn">
      <el-button
        v-permission="['seckill:cateogry:save']"
        type="primary"
        @click="onAddClassify(null)"
      >
        新增分类
      </el-button>
    </div>
    <el-dialog
      v-model="dialogFormVisible"
      :title="showTitle"
    >
      <el-form
        @submit.prevent
      >
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="classifyName"
            type="text"
            placeholder="请输入分类名称"
            maxlength="10"
            show-word-limit
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="onAddOrUpdate()"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="classify-table">
      <table class="table-box">
        <tr class="t-head">
          <th class="name">
            分类名称
          </th>
          <th
            class="name"
            align="center"
          >
            操作
          </th>
        </tr>
        <vue-draggable-next
          v-model="dataList"
          v-loading="dataListLoading"
          element="div"
          @change="onListDragDrop"
        >
          <tr
            v-for="(item,index) in dataList"
            :key="index"
          >
            <td>{{ item.name }}</td>
            <td>
              <el-link
                v-permission="['seckill:cateogry:update']"
                type="primary"
                :underline="false"
                style="padding-right: 10px;"
                @click="onAddClassify(item.categoryId)"
              >
                编辑
              </el-link>
              <el-link
                v-permission="['seckill:cateogry:delete']"
                type="primary"
                :underline="false"
                @click="onDeleteClassify(item.categoryId)"
              >
                删除
              </el-link>
            </td>
          </tr>
        </vue-draggable-next>
      </table>
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/seckill/seckill-category.js'
import { VueDraggableNext } from 'vue-draggable-next'
import { ElMessageBox, ElMessage } from 'element-plus'

const dataList = ref([])
const dataListLoading = ref(true)
const isSubmit = ref(true)
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1
})
const dialogFormVisible = ref(false)
const classifyName = ref('')
const categoryId = ref(null)
const formLabelWidth = ref('100px')
const showTitle = ref('')

onMounted(() => {
  isSubmit.value = false
  getPageData()
})

const getPageData = () => {
  isSubmit.value = false
  classifyName.value = ''
  categoryId.value = null
  dataListLoading.value = true
  api.list({ ...searchForm }).then(data => {
    dataList.value = data
    dataListLoading.value = false
  })
}

// 分类弹窗
const onAddClassify = (id) => {
  showTitle.value = '新增秒杀分类'
  dialogFormVisible.value = true
  if (id) {
    showTitle.value = '秒杀分类'
    api.get(id).then(data => {
      classifyName.value = data.name
      categoryId.value = id
    })
  } else {
    classifyName.value = ''
  }
}
// 分类弹窗
const onAddOrUpdate = () => {
  if (!classifyName.value || classifyName.value.trim() === '') {
    ElMessage({
      message: '秒杀分类名称不能为空',
      type: 'error',
      duration: 1500
    })
    return
  }
  const data = {
    categoryId: categoryId.value,
    name: classifyName.value
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  const request = categoryId.value ? api.update(data) : api.save(data)
  request.then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        dialogFormVisible.value = false
        isSubmit.value = false
        getPageData()
      }
    })
  }).catch(() => {
    isSubmit.value = false
  })
}
// 删除分类按钮
const onDeleteClassify = (id) => {
  ElMessageBox.confirm('确定删除该分类？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.deleteById(id).then(() => {
      ElMessage({
        message: '删除成功!',
        type: 'success',
        duration: 1500,
        onClose: () => {
          isSubmit.value = false
          getPageData()
        }
      })
    }).catch(() => {
      isSubmit.value = false
    })
  })
}

/**
 * 拖拽排序
 */
const onListDragDrop = () => {
  const categoryIds = []
  dataList.value.forEach(el => {
    categoryIds.push(el.categoryId)
  })
  updateSeqOfCategories({
    categoryIds
  })
}
/**
 * 更新顺序
 */
const updateSeqOfCategories = (param) => {
  api.updateSeq(param).then(() => {
    getPageData()
  }).catch(() => {
    getPageData()
  })
}
</script>
<style lang="scss" scoped>
.content-box {
  margin-bottom: 16px;
  background-color: #cde3f8;
  border: 1px solid #7cbdfa;
  .content {
    padding: 15px;
    .description {
      font-size: 14px;
      line-height: 7px;
    }
  }
}
.classify-btn{
  margin: 20px 0;
}
// 秒杀分类列表
.classify-table{
  display: block;
  width: 100%;
  font-size: 14px;
  line-height: 2em;
  table.table-box, table.table-box tr {
    display: block;
    width: 100%;
  }
  table.table-box tr {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid #dfe6ec;
    padding: 0 10px;
  }
  table.table-box tr:hover {
    background: #f5f7fa;
  }
  table.table-box tr td, table.table-box tr th {
    flex: 1;
    text-align: center;
    padding: 10px 0;
  }
  table.table-box tr.t-head {
    background: #f9f9f9;
  }
}
</style>
