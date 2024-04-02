<template>
  <el-dialog
    v-model="visible"
    class="component-shop-brand-dialog"
    width="80%"
    :show-close="false"
    top="8vh"
  >
    <div class="">
      <div class="popup">
        <div class="title">
          <div class="text">
            编辑签约品牌
          </div>
          <div class="tips">
            已签约
            <span class="text-blod">{{ signBrandList.length + customSignBrandList.length }}</span>
            个品牌，最多可签约
            <span class="text-blod">50</span>
            个品牌，上传授权文件申请通过率更高哦~
          </div>
          <div
            class="close-btn"
            @click="closePopup"
          >
            <el-icon><Close /></el-icon>
          </div>
        </div>
        <div class="content">
          <div class="left-box">
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
                <el-icon><Search /></el-icon>
              </div>
            </div>
            <div class="brand-box">
              <div class="brand-list">
                <div
                  v-for="(item, index) in allBrandList"
                  :key="index"
                  class="brand-item"
                  :class="{'active':item.isSelected===true}"
                  @click="addBrand(item, index)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <div class="right-box">
            <div class="table-box">
              <!-- height="575" -->
              <el-table
                :data="signBrandList"
                width="100%"
                :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
              >
                <el-table-column
                  prop="name"
                  label="品牌名称"
                />
                <el-table-column
                  prop="firstLetter"
                  label="检索首字母"
                  align="center"
                />
                <el-table-column
                  prop="parentName"
                  label="上级类目"
                />
                <el-table-column
                  prop="imgUrl"
                  label="品牌logo"
                >
                  <template #default="scope">
                    <ImgShow
                      :src="scope.row.imgUrl"
                      :img-style="{width:'57px',height:'57px'}"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="qualifications"
                  label="授权文件"
                  width="230px"
                >
                  <template #default="scope">
                    <div
                      :key="scope.row.qualifications"
                      class="business-qual"
                    >
                      <imgs-upload
                        v-model="scope.row.qualifications"
                        :limit="2"
                      />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="brandStatus"
                  label="状态"
                  width="80"
                >
                  <template #default="scope">
                    <div
                      v-if="scope.row.brandStatus === 1"
                      class="tag-txt"
                    >
                      正常
                    </div>
                    <div
                      v-if="scope.row.brandStatus === 0"
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
                      @click="deleteBrand(scope.row.brandId, scope.$index)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
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
import * as api from '@/api/platform/audit-shop.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['closePopup'])

const shopId = ref(0)
const keyword = ref('')
const allBrandList = ref([])
const visible = ref(false)
const signBrandList = ref([])
const customSignBrandList = ref([])

// 初始化
const init = (shopIds) => {
  shopId.value = shopIds
  visible.value = true
  getPlatformBrand()
  getSignBrandList()
}
defineExpose({
  init
})
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
 * @param {Array} _allBrandList 全部品牌
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
 * 获取签约品牌列表
 */
const getSignBrandList = () => {
  api.queryBrandSigning({ shopId: shopId.value, sysType: 1 }).then(data => {
    data.platformBrandList.forEach((item) => {
      let parentName = ''
      if (item.categories) {
        parentName = `${item.categories[0].categories[0].name}>${item.categories[0].categories[1].name}>${item.categories[0].name}`
      }
      item.parentName = parentName
    })
    signBrandList.value = data.platformBrandList
    customSignBrandList.value = data.customizeBrandList
    brandEcho(allBrandList.value, signBrandList.value)
  })
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
  brandObj.brandStatus = brandObj.status
  const length = signBrandList.value.length + customSignBrandList.value.length
  if (length > 50) {
    ElMessage.warning('您最多只能签约50个品牌')
  } else {
    if (brandObj.isSelected === false) {
      if (brandObj.categories) {
        brandObj.parentName = `${brandObj.categories[0].categories[0].name}>${brandObj.categories[0].categories[1].name}>${brandObj.categories[0].name}`
      }
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

/**
 * 签约品牌
 */
const signBrand = () => {
  const params = {
    platformBrandList: [],
    customizeBrandList: []
  }
  signBrandList.value.forEach(item => {
    const param = {
      brandId: item.brandId,
      name: item.name,
      imgUrl: item.imgUrl,
      qualifications: item.qualifications
    }
    params.platformBrandList.push(param)
  })
  params.customizeBrandList = customSignBrandList.value
  api.signBrand(params, shopId.value).then(() => {
    if (params.platformBrandList.length || params.customizeBrandList.length) {
      ElMessage({
        message: '品牌保存成功！',
        type: 'success',
        duration: 1000
      })
    }
    closePopup()
  })
}

/**
 * 确认提交
 */
const comfirmSubmit = () => {
  if (signBrandList.value.find(el => !el.imgUrl)) {
    ElMessage.error('品牌logo不能为空')
    return
  }
  if (signBrandList.value.find(el => !el.qualifications)) {
    ElMessage.error('品牌授权文件不能为空')
    return
  }
  if (customSignBrandList.value && customSignBrandList.value.find(el => !el.imgUrl)) {
    ElMessage.error('品牌logo不能为空')
    return
  }
  if (customSignBrandList.value && customSignBrandList.value.find(el => !el.qualifications)) {
    ElMessage.error('品牌授权文件不能为空')
    return
  }
  signBrand()
}

/**
 * 关闭弹窗
 */
const closePopup = () => {
  emit('closePopup', 'brand')
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
