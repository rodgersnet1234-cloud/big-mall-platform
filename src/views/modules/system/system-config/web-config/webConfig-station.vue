<template>
  <div class="mod-webConfig-webConfig">
    <div class="main-container">
      <!-- 操作栏 -->
      <div class="operation-bar">
        <div
          v-if="isAuth('sys:webConfig:save')"
          class="default-btn primary-btn"
          @click="onAddOrUpdate(configType)"
        >
          {{ $t("brand.add") }}
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-con webConfig-station-table">
        <el-table
          ref="webConfigStationTableRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
        >
          <!-- 序号 -->
          <el-table-column
            fixed
            type="index"
            :label="$t('formData.serialNumber')"
            width="80"
          />
          <!-- 登录logo -->
          <el-table-column
            prop="stationLoginLogoImg"
            :label="$t('webInfoConfig.loginLogo')"
          >
            <template #default="{row}">
              <div class="table-cell-image">
                <!-- <img v-if="scope.row.stationLoginLogoImg" :src="scope.row.stationLoginLogoImg"> -->
                <ImgShow :src="row.stationLoginLogoImg" />
              </div>
            </template>
          </el-table-column>
          <!-- 激活状态 -->
          <el-table-column
            prop="isActivity"
            :label="$t('webInfoConfig.activationStatus')"
          >
            <template #default="scope">
              <span
                v-if="scope.row.isActivity === 0"
                class="tag-text"
              >{{
                $t("webInfoConfig.close")
              }}</span>
              <span
                v-if="scope.row.isActivity === 1"
                class="tag-text"
              >{{
                $t("webInfoConfig.open")
              }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="150"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('sys:webConfig:update')"
                  class="default-btn text-btn"
                  @click="onAddOrUpdate(configType, scope.row.id)"
                >
                  {{ $t('brand.revise') }}
                </div>
                <div
                  v-if="isAuth('sys:webConfig:delete') && scope.row.isActivity === 0"
                  class="default-btn text-btn"
                  @click="onDelete(scope.row.id)"
                >
                  {{ $t('brand.delete') }}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <el-pagination
        v-if="dataList.length"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './webConfig-add-or-update.vue'
import { ElMessageBox } from 'element-plus'

const dataList = ref([])
const aa = ref(false)
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const searchForm = reactive({}) // 搜索
const dataListLoading = ref(false)
let addOrUpdateVisible = ref(false)
const configType = ref(5) // 配置类型（1:平台端 2:PC端 3:h5端 4:商家端 5:自提点端）

const getDataList = (pageParam) => {
  dataListLoading.value = true
  // http({
  //   url: http.adornUrl('/sys/webConfig/page'),
  //   method: 'get',
  //   params: http.adornParams(
  //     Object.assign(
  //       {
  //         current: pageParam == null ? page.currentPage : pageParam.currentPage,
  //         size: pageParam == null ? page.pageSize : pageParam.pageSize,
  //         configType
  //       },
  //       searchForm
  //     )
  //   )
  // }).then(({ data }) => {
  //   dataList = data.records
  //   page.total = data.total
  //   dataListLoading.value = false
  // })
}

const addOrUpdateRef = ref()
// 新增 / 修改
const onAddOrUpdate = (configType, id) => {
  addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value?.init(configType, id)
  })
}
const onDelete = (id) => {
  ElMessageBox.confirm($t('seckill.isDeleOper'), $t('remindPop.operation'), {
    confirmButtonText: $t('remindPop.confirm'),
    cancelButtonText: $t('remindPop.cancel'),
    type: 'warning'
  }).then(() => {
    // http({
    //   url: http.adornUrl('/sys/webConfig/operate/' + id),
    //   method: 'delete',
    //   data: http.adornData({})
    // }).then(({ data }) => {
    //   ElMessage({
    //     message: $t('remindPop.succeeded'),
    //     type: 'success',
    //     duration: 1500,
    //     onClose: () => {
    //       refreshChange()
    //     }
    //   })
    // })
  }).catch(() => {
  })
}
/**
 * 刷新回调
 */
const refreshChange = () => {
  page.currentPage = 1
  getDataList(page)
}
const onSearch = () => {
  page.currentPage = 1
  getDataList(page)
}

const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList(page)
}
const onPageChange = (val) => {
  page.currentPage = val
  getDataList(page)
}

</script>

<style lang="scss" scoped>
.mod-webConfig-webConfig {
  .operation-bar {
    margin-top: 5px;
  }
}
</style>
