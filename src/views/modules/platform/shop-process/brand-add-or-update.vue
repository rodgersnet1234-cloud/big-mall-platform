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
            <i class="el-icon-search" />
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
                <!-- <img :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl" style="width:57px;height:57px"> -->
                <ImgShow
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
                  type="text"
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
import * as api from '@/api/platform/audit-shop'
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

// 图片前缀
// const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
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
 * @param {Array} allBrandList 全部品牌
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
.brand-components {
  .content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    color: #606266;

    // 左边盒子
    .left-box {
      width: 20%;
      min-width: 200px;
      margin-right: 10px;
      font-size: 14px;
      .search-box {
        position: relative;
        width: 100%;
        height: 36px;
        background: #FFFFFF;
        border: 1px solid #E8E9EC;
        box-sizing: border-box;
        .search-input {
          width: 100%;
          height: 100%;
          padding: 0 67px 0 12px;
          border: none;
          outline: none;
          box-sizing: border-box;
        }
        input::-webkit-input-placeholder {
          font-size: 14px;
          color: #999;
        }
        .search-btn {
          position: absolute;
          right: 0;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 55px;
          height: 100%;
          font-size: 20px;
          color: #CBCED4;
          border-left: 1px solid #E8E9EC;
          cursor: pointer;
        }
      }
      .brand-box {
        width: 100%;
        height: 400px;
        border: 1px solid #E9EAEC;
        box-sizing: border-box;
        overflow-y: scroll;
        padding: 10px 0;
        margin-top: 14px;
        .brands-empty {
          font-size: 12px;
          color: #aaa;
          text-align: center;
          padding: 13px 0;
        }
        .brand-list {
          .brand-item {
            width: 100%;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            padding: 0 10px;
            margin-bottom: 5px;
            cursor: pointer;
            box-sizing: border-box;
            .brand-name {
              display: inline-block;
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .active {
            background: rgba(24, 144, 255, 0.13);
          }
        }
        /* 谷歌隐藏滚动条 */
        &::-webkit-scrollbar {
          display: none;
        }
        /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
        /* IE隐藏滚动条 */
        -ms-overflow-style: none;
        /* 火狐隐藏滚动条 */
        overflow: -moz-scrollbars-none;
      }
      /* 谷歌隐藏滚动条 */
      &::-webkit-scrollbar {
        display: none;
      }
      /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
      /* IE隐藏滚动条 */
      -ms-overflow-style: none;
      /* 火狐隐藏滚动条 */
      overflow: -moz-scrollbars-none;
    }

    // 右边表格
    .right-box {
      position: relative;
      display: block;
      width: 80%;
      max-height: 500px;
      border: 1px solid #E9EAEC;
      border-bottom: 0;
      box-sizing: border-box;
      .table-box {
        // 上传图片样式
        .business-qual {
          ::v-deep(.mul-pic-upload .el-upload-list--picture-card .el-upload-list__item) {
            width: 80px;
            height: 80px;
            line-height: 80px;
            margin-bottom: 0;
          }
          ::v-deep(.mul-pic-upload .el-upload--picture-card) {
            width: 80px;
            height: 80px;
            line-height: 80px;
          }
        }

        // 表格
        ::v-deep(.el-table__body-wrapper) {
          max-height: 400px;
          overflow-y: scroll;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        ::v-deep(.el-table__body-wrapper::-webkit-scrollbar) {
          display: none; /* Chrome Safari */
        }
        ::v-deep(.el-table__body) {
          width: 100%;
        }
      }
    }
  }
}
</style>
