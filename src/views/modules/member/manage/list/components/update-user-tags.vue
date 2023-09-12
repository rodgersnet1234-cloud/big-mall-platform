<template>
  <div>
    <el-dialog
      v-model="visible"
      :title="$t('user.userManager.selectTag')"
      width="690px"
      class="component-user-tags"
    >
      <div class="box">
        <div class="search-bar">
          <el-input
            v-model="tagName"
            :placeholder="$t('user.userManager.tagTip1')"
            clearable
            style="width:200px;margin-right:10px"
          />
          <el-button
            type="primary"
            @click="onSearch"
          >
            {{ $t("table.search") }}
          </el-button>
        </div>
        <el-main>
          <div class="main">
            <div
              v-for="item in tagList"
              :key="item.tagId"
            >
              <span
                :class="active.includes(item)?'active':'Classification'"
                class="tag-name"
                @click="onCheck(item)"
              >{{ item.tagName }}</span>
            </div>
          </div>
          <div
            v-if="tagList.length < 1"
            class="no-data"
          >
            {{ $t('user.userManager.noData') }}
          </div>
        </el-main>
        <!-- 分页 -->
        <pagination
          v-show="pageVO.total>0"
          v-model:page="pageQuery.pageNum"
          v-model:limit="pageQuery.pageSize"
          class="pagination"
          :total="pageVO.total"
          @pagination="onGetTagList()"
        />
        <div class="btn-bar">
          <el-button
            @click="visible = false"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            :loading="confirmLoad"
            @click="onConfirm"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/user/user-tag.js'
import { batchUpdateUserTag } from '@/api/user/user-tag-user.js'
import { ElMessage } from 'element-plus'
const props = defineProps({
  value: {
    default: '',
    type: String
  },
  // 最大上传数量
  limit: {
    default: 10,
    type: Number
  }
})
const emit = defineEmits(['refreshDataList'])

const dataForm = {
  tagList: [], // 标签
  userIds: []
}
const searchForm = {
  tagType: 0, // 标签类型0手动1条件2系统
  tagName: null
}
const tagName = ref(null)
const visible = ref(false)
const tagList = ref([]) // 标签
const onInit = (ids) => {
  tagList.value = []
  tagName.value = ''
  searchForm.tagName = ''
  visible.value = true
  dataForm.userIds = ids
  onGetTagList()
}
// 分页获取标签
const pageVO = ref({ // 返回参数
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const pageQuery = ref({ // 查询的参数
  pageSize: 15,
  pageNum: 1
})
const onGetTagList = () => {
  api.getTagPage({ ...pageQuery.value, ...searchForm }).then(resPageVO => {
    pageVO.value = resPageVO
    tagList.value = pageVO.value.list
  })
}
// 搜索
const active = ref([]) // 选种的标签
const onSearch = () => {
  searchForm.tagName = tagName.value
  active.value = []
  onGetTagList()
}
// 多选
const onCheck = (item) => {
  if (active.value.includes(item)) {
    const index = active.value.indexOf(item)
    active.value.splice(index, 1)
  } else {
    active.value.push(item)
  }
  if (active.value.length > props.limit) {
    const index = active.value.indexOf(item)
    active.value.splice(index, 1)
    return ElMessage.error($t('user.userManager.tipError2').replace('NUM', props.limit))
  }
}
const confirmLoad = ref(false)
const onConfirm = () => {
  if (!dataForm.userIds) {
    return
  }
  if (!active.value.length) {
    return ElMessage.error('请选择标签！')
  }
  confirmLoad.value = true
  dataForm.tagList = []
  active.value.forEach(item => {
    dataForm.tagList.push(item.userTagId)
  })
  batchUpdateUserTag(dataForm).then(() => {
    active.value = []
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        visible.value = false
        confirmLoad.value = false
        emit('refreshDataList')
      }
    })
  })
}
defineExpose({ onInit })
</script>
<style lang="scss" scoped>
.component-user-tags{
  .active {
    float: left;
    margin-left: 10px;
    padding: 10px;
    background: #155bd4;
    margin-bottom: 10px;
    border-radius: 4px;
    font-size: 14px;
    color:#f7f7f7;
    min-width: 100px;
    text-align: center;
  }
  .Classification {
    float: left;
    margin-left: 10px;
    padding: 10px;
    background: #f7f7f7;
    margin-bottom: 10px;
    border-radius: 4px;
    font-size: 14px;
    min-width: 100px;
    text-align: center;
  }
  .tag-name {
    cursor:pointer;
  }
  .search-bar {
    padding: 20px;
  }
  .pagination {
    padding-left: 30px;
    padding-top: 0;
    margin-top: 0;
  }
  .btn-bar {
    text-align: right;
    margin-right: 30px;
  }
  .no-data{
    text-align: center;
  }
}
</style>
