<template>
  <el-dialog
    v-model="visible"
    class="shop-in-category-pup-dialog"
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
            <!-- <i class="el-icon-close" /> -->
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
                <!-- <i class="el-icon-search" /> -->
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
                    <!-- <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl" style="width:57px;height:57px"> -->
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
                    <div class="business-qual">
                      <!-- <pics-upload :value="scope.row.qualification" @imgUrl="getImgUrl(arguments, scope.$index,0)" /> -->
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
                      type="text"
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
import * as api from '@/api/platform/audit-supplier'
// import imgsUpload from '@/components/ImgsUpload'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['closePopup'])

const shopId = ref(0)
// 图片前缀
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const keyword = ref('')
const allBrandList = ref([])
const visible = ref(false)
const signBrandList = ref([])
const customSignBrandList = ref([])
const customSignBrandRule = reactive({
  name: [
    { required: true, message: '品牌名称不能为空', trigger: 'blur' }
  ],
  logo: [
    { required: true, message: '请上传品牌logo', trigger: 'blur' }
  ]
})
const filterBrandList = ref([])
const imgs = ref('')

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
 * @param {Array} allBrandList 全部品牌
 * @param {Array} signBrandList 选中品牌和已签约品牌
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
  api.queryBrandSigning({ shopId: shopId.value, sysType: 3 }).then(data => {
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
  // customSignBrandList.value.forEach(item => {
  //   const param = {
  //     brandId: item.brandId,
  //     name: item.name,
  //     alias: item.alias,
  //     imgUrl: item.imgUrl,
  //     qualifications: item.qualifications
  //   }
  //   params.customizeBrandList.push(param)
  // })
  params.customizeBrandList = customSignBrandList.value
  api.signBrand(params, shopId.value).then(data => {
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
 * 获取图片路径
 */
const getImgUrl = (imgUrl, index, type) => {
  // signBrandList[index].qualifications = imgUrl[0]
  if (type === 1) {
    customSignBrandList.value[index].imgUrl += imgUrl[0]
  }
  if (type === 2) {
    customSignBrandList.value[index].qualifications += imgUrl[0] + ','
  }
  if (type === 0) {
    signBrandList.value[index].qualifications += imgUrl[0] + ','
  }
  // imgs = imgs + imgUrl[0] + ','
}

/**
 * 确认提交
 */
const comfirmSubmit = () => {
  // imgs = imgs.substr(0, imgs.length - 1)
  // if (!signBrandList.value.length && !customSignBrandList.value.length) {
  //   ElMessage.error('请先选择要签约的品牌')
  //   return
  // }
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
.shop-in-category-pup-dialog {
  ::v-deep(.el-dialog__header) {
    padding: 0;
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 0;
    padding-bottom: 0;
  }
  ::v-deep(.el-dialog) {
    min-width: 950px;
  }
  // margin-bottom: 200px;
  .popup {
    // position: absolute;
    // top: 0;
    // bottom: 0;
    // left: 50%;
    // transform: 50;
    // right: 0;
    // width: 1270px;
    // height: 730px;
    // background: #FFFFFF;
    // margin: auto;
    // z-index: 101;
    display: block;

    .red-tag-txt {
      color: #ff4949;
    }

    .text-blod {
      color: #000;
    }

    // 表格上的标题
    .title {
      display: flex;
      align-items: center;
      width: 100%;
      height: 60px;
      border-bottom: 1px solid #EAEAEA;
      .text {
        height: 23px;
        line-height: 21px;
        font-size: 16px;
        .stress {
          color: #FF2120;
        }
      }
      .tips {
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #999;
        margin-left: 10px;
      }
      .close-btn {
        font-size: 23px;
        color: #DEDEDE;
        margin-left: auto;
        margin-right: 10px;
        cursor: pointer;
      }
    }

    // 内容
    .content {
      display: flex;
      align-items: top;
      justify-content: space-between;
      margin-top: 20px;
      .left-box {
        width: 20%;
        .search-box {
          position: relative;
          // width: 262px;
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
          // width: 262px;
          width: 100%;
          height: 540px;
          border: 1px solid #E9EAEC;
          box-sizing: border-box;
          overflow-y: scroll;
          margin-top: 14px;
          .brand-list {
            .brand-item {
              width: 100%;
              height: 47px;
              line-height: 47px;
              font-size: 14px;
              padding-left: 14px;
              overflow: hidden;
              cursor: pointer;
              margin-bottom: 3px;
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
      .right-box {
        // width: 946px;
        width: 80%;
        margin-left: 21px;
        .table-box {
          // width: 100%;
          // height: 487px;
          // border: 1px solid #E9EAEC;
          border-left: 1px solid #E9EAEC;
          border-right: 1px solid #E9EAEC;
          box-sizing: border-box;
          ::v-deep(.el-table__body-wrapper) {
            max-height: 540px;
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
          // ::v-deep .el-table th.gutter {
          //   display: table-cell !important;
          // }
          // ::v-deep .el-table__body-wrapper .el-table__body {
          //   width: 100% !important;
          // }
          // ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
          //   /* 谷歌隐藏滚动条 */
          //   &::-webkit-scrollbar {
          //     display: none;
          //   }
          //   /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
          //   /* IE隐藏滚动条 */
          //   -ms-overflow-style: none;
          //   /* 火狐隐藏滚动条 */
          //   overflow: -moz-scrollbars-none;
          // }
          // ::v-deep tr.el-table__row:last-child {
          //   td {
          //     border-bottom: 0;
          //   }
          // }
          // 上传图片框
          // ::v-deep .el-upload {
          //   display: flex;
          //   align-items: center;
          //   justify-content: center;
          //   width: 65px;
          //   height: 65px;
          //   background: #FCFCFC;
          //   border: 1px solid #EAEAEA;
          //   border-radius: 0;
          //   box-sizing: border-box;
          //   .el-icon-plus {
          //     font-size: 22px;
          //     color: #EAEAEA;
          //   }
          //   img {
          //     width: 100%;
          //     height: 100%;
          //   }
          // }
          // ::v-deep  .el-upload-list__item {
          //   display: block;
          //   width: 65px;
          //   height: 65px;
          //   border-radius: 0;
          // }

          // 上传图片样式
          .business-qual {
            ::v-deep(.el-upload-list--picture-card .el-upload-list__item) {
              width: 80px;
              height: 80px;
              margin-bottom: 0;
            }
            ::v-deep(.el-upload--picture-card) {
              width: 80px;
              height: 80px;
              line-height: 80px;
            }
            ::v-deep .el-upload {
              width: 80px;
              height: 80px;
              line-height: 80px;
              .pic {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .custom-box {
          display: flex;
          align-items: center;
          width: 962px;
          height: 60px;
          font-size: 14px;
          background: #FAFAFA;
          border: 1px solid #EAEAEA;
          box-sizing: border-box;
          margin-top: 17px;
          .text {
            padding-left: 30px;
          }
          .add-btn {
            width: 140px;
            height: 36px;
            line-height: 34px;
            text-align: center;
            background: #FFFFFF;
            border: 1px solid #EAEAEA;
            box-sizing: border-box;
            margin-left: auto;
            margin-right: 25px;
            cursor: pointer;
          }
        }

      }
    }

    // 按钮
    .btn-box {
      display: flex;
      width: 202px;
      margin: 16px auto 0;
      padding-bottom: 30px;
      .cancel-btn {
        width: 91px;
        height: 36px;
        line-height: 34px;
        font-size: 14px;
        text-align: center;
        border: 1px solid #E2E2E2;
        border-radius: 4px;
        box-sizing: border-box;
        margin-right: 20px;
        cursor: pointer;
      }
      .confirm-btn{
        width: 91px;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        background: #155bd4;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  // .shelter-layer {
  //   position: fixed;
  //   top: 0;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   background: rgba(51, 51, 51, 0.6);
  //   z-index: 100;
  // }
}
</style>
