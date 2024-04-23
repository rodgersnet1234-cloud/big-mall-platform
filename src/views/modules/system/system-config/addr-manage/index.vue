<template>
  <div class="mod-sys-area">
    <div class="filter-item">
      <el-button
        v-permission="['system:addr:save']"
        type="primary"
        class="rea-add-btn"
        @click="onAddOrUpdate()"
      >
        {{ $t('table.create') }}
      </el-button>
    </div>

    <!--  列表相关区域 -->
    <div class="addr">
      <!-- 地区 -->
      <div
        v-if="regionList.length"
        :class="['addr-list-box', regionList.length?'active':'']"
      >
        <div class="addr-list">
          <div
            v-for="(addr, index) in regionList"
            :key="index"
            :class="['addr-item', regionId===addr.areaId?'active':'']"
          >
            <div
              class="dot"
              @click="getProvList(index)"
            >
              {{ addr.areaName }}
            </div>
            <div class="btn">
              <el-button
                v-permission="['system:addr:update']"
                link
                type="primary"
                @click="onAddOrUpdate(addr.areaId)"
              >
                编辑
              </el-button>
              <!-- @click="() => update(node, data)" -->
              <el-button
                v-permission="['system:addr:delete']"
                link
                type="primary"
                @click="onDelete(addr.areaId)"
              >
                删除
              </el-button>
              <!-- @click="() => remove(node, data)" -->
            </div>
          </div>
        </div>
      </div>
      <!-- 省 -->
      <div
        v-if="provList.length"
        :class="['addr-list-box', provList.length?'active':'']"
      >
        <div class="addr-list">
          <div
            v-for="(provItem, provIdx) in provList"
            :key="provIdx"
            :class="['addr-item', provId===provItem.areaId?'active':'']"
          >
            <div
              class="dot"
              @click="getCityList(provIdx)"
            >
              {{ provItem.areaName }}
            </div>
            <div class="btn">
              <el-button
                v-permission="['system:addr:update']"
                link
                type="primary"
                @click="onAddOrUpdate(provItem.areaId)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="['system:addr:delete']"
                link
                type="primary"
                @click="onDelete(provItem.areaId)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 市 -->
      <div
        v-if="cityList.length"
        :class="['addr-list-box', cityList.length?'active':'']"
      >
        <div class="addr-list">
          <div
            v-for="(city, cityIdx) in cityList"
            :key="cityIdx"
            :class="['addr-item', cityId===city.areaId?'active':'']"
          >
            <div
              class="dot"
              @click="getAreaList(cityIdx)"
            >
              {{ city.areaName }}
            </div>
            <div class="btn">
              <el-button
                v-permission="['system:addr:update']"
                link
                type="primary"
                @click="onAddOrUpdate(city.areaId)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="['system:addr:delete']"
                link
                type="primary"
                @click="onDelete(city.areaId)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 区 -->
      <div
        v-if="areaList.length"
        :class="['addr-list-box', areaList.length?'active':'']"
      >
        <div class="addr-list">
          <div
            v-for="(area, areaIdx) in areaList"
            :key="areaIdx"
            class="addr-item"
          >
            <div class="dot">
              {{ area.areaName }}
            </div>
            <div class="btn">
              <el-button
                v-permission="['system:addr:update']"
                link
                type="primary"
                @click="onAddOrUpdate(area.areaId)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="['system:addr:delete']"
                link
                type="primary"
                @click="onDelete(area.areaId)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!data.length && !cityList.length && !areaList.length"
        class="nodata"
      >
        暂无数据
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/system/addr-manage.js'
import AddOrUpdate from './add-or-update.vue'
import { treeDataTranslate } from '@/utils/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const data = ref([])
const oldRegionList = ref([]) // 旧的区域数据
const regionList = ref([]) // 区域
const provList = ref([]) // 省
const cityList = ref([]) // 市
const areaList = ref([]) // 区
const pageLoading = ref(true)

const regionId = ref(0)
const provId = ref(0)
const cityId = ref(0)

const addOrUpdateVisible = ref(false)
const selectProvIndex = ref('')
const selectCityIndex = ref('')
const selectAreaIndex = ref('')

onMounted(() => {
  getPage()
})

const getPage = () => {
  pageLoading.value = true
  api.page().then(res => {
    pageLoading.value = false
    const treeData = treeDataTranslate(res, 'areaId', 'parentId')
    data.value = regionList.value = treeData
    oldRegionList.value = treeData
    provList.value = cityList.value = areaList.value = []
    getProvList(selectProvIndex.value)
    getCityList(selectCityIndex.value)
    getAreaList(selectAreaIndex.value)
  }).catch(() => {
    pageLoading.value = false
  })
}
const getProvList = (idx) => {
  selectProvIndex.value = idx
  provList.value = data.value[idx].children ? data.value[idx].children : []
  cityList.value = areaList.value = []
  regionId.value = data.value[idx].areaId
}
const getCityList = (idx) => {
  selectCityIndex.value = idx
  cityList.value = provList.value[idx].children ? provList.value[idx].children : []
  areaList.value = []
  provId.value = provList.value[idx].areaId
}
const getAreaList = (idx) => {
  selectAreaIndex.value = idx
  areaList.value = cityList.value[idx].children ? cityList.value[idx].children : []
  cityId.value = cityList.value[idx].areaId
}

const addOrUpdateRef = ref(null)
/**
 * 新增
 */
const onAddOrUpdate = (areaId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(areaId)
  })
}

/**
 * 删除
 */
// remove(node, data) {
//   onDelete(data.areaId)
// },
const onDelete = (areaId) => {
  ElMessageBox.confirm('确认删除当前地址项?', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(areaId))
}
const deleteById = (areaId) => {
  api.deleteById(areaId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

</script>

<style lang="scss" scoped>
.mod-sys-area {
  background-color: #fff;
  padding: 20px;
  // 地址列表区域
  .addr {
    display: flex;
    margin: 20px 0;
    overflow-x: auto;
    .addr-list-box {
      width: 22%;
      min-width: 350px;
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
            width: 60%;
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
            min-width: 98px;
            margin-right: 15px;
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
