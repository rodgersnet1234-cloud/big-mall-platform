<template>
  <div class="mod-sys-area">
    <!-- 搜索相关区域 -->
    <div class="filter-container">
      <!-- <el-input v-model="areaName" class="area-search-input" placeholder="地区关键词" /> -->
    </div>
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
                type="text"
                @click="onAddOrUpdate(addr.areaId)"
              >
                编辑
              </el-button>
              <!-- @click="() => update(node, data)" -->
              <el-button
                v-permission="['system:addr:delete']"
                type="text"
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
                type="text"
                @click="onAddOrUpdate(provItem.areaId)"
              >
                编辑
              </el-button>
              <!-- @click="() => update(node, data)" -->
              <el-button
                v-permission="['system:addr:delete']"
                type="text"
                @click="onDelete(provItem.areaId)"
              >
                删除
              </el-button>
              <!-- @click="() => remove(node, data)" -->
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
                type="text"
                @click="onAddOrUpdate(city.areaId)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="['system:addr:delete']"
                type="text"
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
                type="text"
                @click="onAddOrUpdate(area.areaId)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="['system:addr:delete']"
                type="text"
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

// directives: { permission },

const data = ref([])
let oldRegionList = ref([]) // 旧的区域数据
let regionList = ref([]) // 区域
let provList = ref([]) // 省
let cityList = ref([]) // 市
let areaList = ref([]) // 区
const areaName = ref('')
const params = reactive({
  areaName: null
})
let pageLoading = ref(true)
const props = reactive({
  id: 'areaId',
  label: 'areaName',
  children: 'children'
})
let regionId = ref(0)
let provId = ref(0)
let cityId = ref(0)
// 查询参数
const searchParam = {
}
let addOrUpdateVisible = ref(false)
const disable = ref(false)
let selectProvIndex = ref('')
let selectCityIndex = ref('')
let selectAreaIndex = ref('')
// watch: {
//   areaName() {
//     if (areaName) {
//       var r = []
//       var p = []
//       var c = []
//       var a = []
//       regionList = JSON.parse(JSON.stringify(oldRegionList))
//       regionList.forEach((el, index) => {
//         if (el.areaName.match(areaName) != null) {
//           r.push(el)
//         }
//         if (el && el.children) {
//           el.children.forEach(prov => {
//             if (prov.areaName.match(areaName) != null) {
//               console.log(r, 'r')
//               p.push(prov)
//               r.push(el)
//               var obj = {}
//               r = r.reduce((cur, next) => {
//                 obj[next.areaName] ? '' : obj[next.areaName] = true && cur.push(next)
//                 return cur
//               }, [])
//               console.log(obj, '2')
//             }
//             if (prov && prov.children) {
//               prov.children.forEach(city => {
//                 if (city.areaName.match(areaName) != null) {
//                   c.push(city)
//                   r.push(el)
//                   p.push(prov)
//                   var obj = {}
//                   r = r.reduce((cur, next) => {
//                     obj[next.areaName] ? '' : obj[next.areaName] = true && cur.push(next)
//                     return cur
//                   }, [])
//                   obj = {}
//                   p = p.reduce((cur, next) => {
//                     obj[next.areaName] ? '' : obj[next.areaName] = true && cur.push(next)
//                     return cur
//                   }, [])
//                 }
//                 if (city && city.children) {
//                   city.children.forEach(area => {
//                     if (area.areaName.match(areaName) != null) {
//                       a.push(area)
//                       r.push(el)
//                       p.push(prov)
//                       c.push(city)
//                       var obj = {}
//                       r = r.reduce((cur, next) => {
//                         obj[next.areaName] ? '' : obj[next.areaName] = true && cur.push(next)
//                         return cur
//                       }, [])
//                       obj = {}
//                       p = p.reduce((cur, next) => {
//                         obj[next.areaName] ? '' : obj[next.areaName] = true && cur.push(next)
//                         return cur
//                       }, [])
//                       obj = {}
//                       c = c.reduce((cur, next) => {
//                         obj[next.areaName] ? '' : obj[next.areaName] = true && cur.push(next)
//                         return cur
//                       }, [])
//                     }
//                   })
//                 }
//               })
//             }
//           })
//         }
//       })
//       regionList = r
//       provList = p
//       cityList = c
//       areaList = a
//     } else {
//       getPage()
//     }
//   }
// },
onMounted(() => {
  getPage()
})

const getPage = () => {
  pageLoading = true
  api.page().then(data => {
    pageLoading = false
    const treeData = treeDataTranslate(data, 'areaId', 'parentId')
    data = regionList = treeData
    oldRegionList = treeData
    provList = cityList = areaList = []
    getProvList(selectProvIndex)
    getCityList(selectCityIndex)
    getAreaList(selectAreaIndex)
  }).catch(() => {
    pageLoading = false
  })
}
const getProvList = (idx) => {
  selectProvIndex = idx
  provList = data[idx].children ? data[idx].children : []
  cityList = areaList = []
  regionId = data[idx].areaId
}
const getCityList = (idx) => {
  selectCityIndex = idx
  cityList = provList[idx].children ? provList[idx].children : []
  areaList = []
  provId = provList[idx].areaId
}
const getAreaList = (idx) => {
  selectAreaIndex = idx
  areaList = cityList[idx].children ? cityList[idx].children : []
  cityId = cityList[idx].areaId
}

const addOrUpdateRef = ref(null)
/**
 * 新增
 */
const onAddOrUpdate = (areaId) => {
  addOrUpdateVisible = true
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

const filterNode = (value, data) => {
  if (!value) return true
  return data.areaName.indexOf(value) !== -1
}

</script>

<style lang="scss" scoped>
.mod-sys-area {
  background-color: #fff;
  padding: 20px;
  .filter-container {
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .area-search-input {
    width: 30%;
  }
  .area-add-btn {
    float: right;
  }
  .filter-item {
  }

  // 地址列表区域
  .addr {
    // margin: 0 auto;
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
