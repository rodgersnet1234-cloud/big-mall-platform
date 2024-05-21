<template>
  <div class="select-account-range">
    <el-form-item
      label=""
      prop="type"
    >
      <el-button @click="dialogVisible = true">
        选择{{ name }}
      </el-button>
    </el-form-item>
    <el-form-item
      v-if="tableData.length > 0"
      label=""
      prop="type"
    >
      <el-table
        :data="tableData"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
      >
        <el-table-column
          :prop="propList[0]"
          :label="`${name}名称`"
        />
        <el-table-column
          v-if="type !== 2"
          :prop="propList[1]"
          label="联系人"
        />
        <el-table-column
          :prop="propList[2]"
          label="联系电话"
        />
        <el-table-column
          class="table-item"
          label="操作"
          align="center"
        >
          <template #default="{row}">
            <div class="table-btn-con">
              <el-button
                link
                type="primary"
                @click="onDelete(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-dialog
      v-model="dialogVisible"
      :title="`选择${name}`"
      append-to-body
    >
      <el-form
        :inline="true"
        :model="searchParam"
        class="demo-form-inline"
        @submit.prevent
      >
        <el-form-item :label="`${name}名称`">
          <el-input
            v-model="searchParam[propList[0]]"
            :placeholder="`${name}名称`"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="searchInfo()"
          >
            查询
          </el-button>
          <el-button @click="clearSearchInfo()">
            {{ $t('table.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTableRef"
        v-loading="pageLoading"
        :data="pageVO.list"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        :row-key="getRowKeys"
        @selection-change="onSelectSome"
      >
        <el-table-column
          v-if="singleElection === 1"
          width="50"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <div>
              <el-radio
                v-model="singleShopId"
                :label="scope.row[idKey]"
                @change="getSelectShopRow(scope.$index,scope.row)"
              >
                &nbsp;
              </el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="singleElection === 0"
          type="selection"
          :reserve-selection="true"
          width="55"
        />
        <el-table-column
          :prop="propList[0]"
          :label="`${name}名称`"
        />
        <el-table-column
          v-if="type !== 2"
          :prop="propList[1]"
          label="联系人"
        />
        <el-table-column
          :prop="propList[2]"
          label="联系电话"
        />
        <el-table-column
          :prop="propList[3]"
          label="状态"
        >
          <template #default="{row}">
            <span v-if="row[propList[3]] === -1">未开通</span>
            <span v-if="row[propList[3]] === 0">{{ type === 2 ? '禁用' : '停业中' }}</span>
            <span v-if="row[propList[3]] === 1">{{ type === 2 ? '正常' : '营业中' }}</span>
            <span v-if="row[propList[3]] === 2">平台下线</span>
            <span v-if="row[propList[3]] === 3">开店待审核</span>
            <span v-if="row[propList[3]] === 4">店铺申请中</span>
            <span v-if="row[propList[3]] === 5">上线待审核</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页条 -->
      <pagination
        v-if="pageVO.total>0"
        v-model:page="searchParam.pageNum"
        v-model:limit="searchParam.pageSize"
        :total="pageVO.total"
        @pagination="getPage()"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Pagination from '@/components/pagination/index.vue'
import * as shopApi from '@/api/platform/audit-shop'
import * as supplierApi from '@/api/platform/audit-supplier'
import * as userApi from '@/api/user/user-manager'

const emit = defineEmits(['getIds', 'getIds'])

const tableData = ref([])
const dialogVisible = ref(false)
const multipleSelection = ref([])
const searchParam = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const props = defineProps({
  type: {
    type: Number,
    default: 0
  },
  tableList: {
    type: Array,
    default: () => []
  },
  shopId: {
    type: Number,
    default: 0
  },
  singleElection: {
    type: Number,
    default: 0
  }
})
const multipleTableRef = ref()
const name = computed(() => {
  return props.type === 1 ? '商家' : props.type === 2 ? '用户' : '供应商'
})
const api = computed(() => {
  return props.type === 1 ? shopApi.managePage : props.type === 2 ? userApi.list : supplierApi.managePage
})
const propList = computed(() => {
  const shopProp = ['shopName', 'contactName', 'contactPhone', 'shopStatus']
  const supplierProp = ['supplierName', 'contactName', 'contactPhone', 'supplierStatus']
  const userProp = ['nickName', 'realName', 'phone', 'status']
  return props.type === 1 ? shopProp : props.type === 2 ? userProp : supplierProp
})
const idKey = computed(() => {
  return props.type === 1 ? 'shopId' : props.type === 2 ? 'userId' : 'supplierId'
})

watch(() => dialogVisible.value, (data) => {
  if (data) {
    nextTick(() => {
      multipleTableRef.value?.clearSelection()
      multipleSelection.value = tableData.value.map(item => item[idKey.value])
      tableData.value.forEach(row => {
        const index = pageVO.list.findIndex(item => item[idKey.value] === row[idKey.value])
        if (index >= 0) {
          multipleTableRef.value.toggleRowSelection(pageVO.list[index], true)
        }
      })
    })
  }
})

onMounted(() => {
  getPage()
  tableData.value = props.tableList
  singleShopId.value = props.shopId
})

const getPage = () => {
  pageLoading.value = true
  api.value(searchParam).then(res => {
    pageVO.list = res.list
    pageVO.total = res.total
    pageVO.pages = res.pages
    tableData.value.forEach(row => {
      const index = pageVO.list.findIndex(item => item[idKey.value] === row[idKey.value])
      if (index >= 0) {
        multipleTableRef.value.toggleRowSelection(pageVO.list[index], true)
      }
    })
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const onSelectSome = (val) => {
  multipleSelection.value = val
}
const onSubmit = () => {
  dialogVisible.value = false
  tableData.value = multipleSelection.value
  if (props.singleElection === 1) {
    emit('getIds', singleShopId.value)
    return
  }
  const ids = tableData.value.map(item => props.type === 1 ? item.shopId : props.type === 2 ? item.userId : item.supplierId)
  emit('getIds', ids)
}
// 清空搜索内容
const clearSearchInfo = () => {
  searchParam[propList.value[0]] = null
  getPage()
}
const searchInfo = () => {
  searchParam.current = 1
  getPage()
}
// 记录选中状态
const getRowKeys = (row) => {
  return row[idKey.value]
}
const onDelete = (row) => {
  tableData.value = tableData.value.filter(item => item[idKey.value] !== row[idKey.value])
  multipleSelection.value = tableData.value
  const ids = tableData.value.map(item => item[idKey.value])
  emit('getIds', ids)
}

const singleShopId = ref(null)
/**
 * 获取当选的行
 * @param index
 * @param row
 */
// eslint-disable-next-line no-unused-vars
const getSelectShopRow = (index, row) => {
  tableData.value = []
  tableData.value.push(row)
  singleShopId.value = row[idKey.value]
}

</script>

<style lang="scss" scoped>
</style>
