<template>
  <div class="brand-components">
    <div class="content">
      <!-- 左边 -->
      <div class="left-box">
        <!-- 搜索 -->
        <div class="search-box">
          <input
            v-model="keyword"
            class="search-input"
            placeholder="请输入品牌名称"
            @keyup.enter="searchBrand"
          >
          <div
            class="search-btn"
            @click="searchBrand"
          >
            <el-icon>
              <Search />
            </el-icon>
          </div>
        </div>
        <!-- 平台全部品牌列表 -->
        <div class="brand-box">
          <div
            v-if="allBrandList.length"
            class="brand-list"
          >
            <div
              v-for="(item, index) in allBrandList"
              :key="index"
              class="brand-item"
              :class="{'active':item.isSelected===true}"
              @click="addBrand(item, index)"
            >
              <el-tooltip
                :content="item.name"
                placement="right"
                :open-delay="500"
                effect="light"
              >
                <span class="brand-name">{{ item.name }}</span>
              </el-tooltip>
            </div>
          </div>
          <div
            v-if="!allBrandList.length"
            class="brands-empty"
          >
            暂无数据
          </div>
        </div>
      </div>

      <!-- 右边-已选品牌+自定义品牌 -->
      <div class="right-box">
        <!-- 选择的平台品牌 -->
        <div class="table-box big-tb">
          <el-table
            :data="signBrandList"
            :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
          >
            <el-table-column
              prop="name"
              label="品牌名称"
            />
            <el-table-column
              label="上级类目"
            >
              <template #default="{row}">
                {{ categoryLevelFormat(row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="firstLetter"
              label="品牌首字母"
              align="center"
            />
            <el-table-column
              prop="imgUrl"
              label="品牌logo"
            >
              <template #default="scope">
                <img-show
                  :src="scope.row.imgUrl"
                  :style="{width:'57px',height:'57px'}"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="qualifications"
              label="授权文件"
              width="230"
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
              width="80"
            >
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="deleteBrand(scope.row.brandId, scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- /选择的平台品牌 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/audit-shop.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  brandSigningList: {
    type: Array,
    default () {
      return []
    }
  }
})
const emit = defineEmits(['getSignBrandList'])
// 全部品牌列表
const allBrandList = ref([])
// 已选品牌
const signBrandList = ref(props.brandSigningList || [])
// 搜索品牌关键字
const keyword = ref('')

watch(
  signBrandList, () => {
    emit('getSignBrandList', signBrandList.value)
  }
)

onMounted(() => {
  getPlatformBrand()
})

/**
 * 上级类目展示
 */
const categoryLevelFormat = (row) => {
  let levelStr = ''
  try {
    row.categories[0].categories.forEach(item => {
      levelStr += item.name + '>'
    })
    levelStr += row.categories[0].name
    return levelStr
  } catch (error) {
    return ''
  }
}

/**
 * 获取平台全部品牌
 */
const getPlatformBrand = () => {
  api.getPlatformBrand({ name: keyword.value, status: 1 }).then(data => {
    const _signBrandList = signBrandList.value
    brandEcho(data, _signBrandList)
  })
}

/**
 * 左侧回显选中品牌或已签约品牌
 * @param _allBrandList
 * @param {Array} _signBrandList 选中品牌和已签约品牌
 */
const brandEcho = (_allBrandList, _signBrandList) => {
  _allBrandList.forEach(item => {
    item.isSelected = false
  })
  if (_signBrandList.length > 0 && _allBrandList.length > 0) {
    for (let i = 0; i < _signBrandList.length; i++) {
      for (let j = 0; j < _allBrandList.length; j++) {
        if (_signBrandList[i].brandId === _allBrandList[j].brandId) {
          _allBrandList[j].isSelected = true
          break
        }
      }
    }
  }
  allBrandList.value = _allBrandList
}

/**
 * 搜索品牌
 */
const searchBrand = () => {
  getPlatformBrand()
}

/**
 * 选中添加品牌
 */
const addBrand = (brandObj, index) => {
  const length = signBrandList.value.length
  if (length >= 50) {
    ElMessage.warning('您最多只能签约50个品牌')
  } else {
    if (brandObj.isSelected === false) {
      signBrandList.value.push(brandObj)
    }
    allBrandList.value[index].isSelected = true
  }
}

/**
 * 删除选中品牌
 * @param {Number} id 品牌id
 * @param {Number} index 选中品牌列表索引
 */
const deleteBrand = (id, index) => {
  // 去除选中样式
  allBrandList.value.forEach(brandItem => {
    if (brandItem.brandId === id) {
      brandItem.isSelected = false
    }
  })
  signBrandList.value.splice(index, 1)
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
