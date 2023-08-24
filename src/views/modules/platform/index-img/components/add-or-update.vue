<template>
  <div class="index-img">
    <el-dialog
      v-model="visible"
      :title="dataForm.imgId? $t('table.edit'): $t('table.create')"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="10vh"
      width="750px"
      @close="closeDialog"
    >
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="90px"
        style="min-width: 600px; width: 600px; margin-left:35px;"
        @submit.prevent
      >
        <!-- 图片 -->
        <el-form-item
          label="轮播图片"
          prop="imgUrl"
        >
          <imgs-upload
            v-model="dataForm.imgUrl"
            :limit="1"
          />
          <div
            class=""
            style="width: 100%"
          >
            建议图片尺寸为{{ dataForm.imgType ? ' 1920*450': ' 750*400' }}
          </div>
        </el-form-item>
        <!-- 平台 -->
        <el-form-item
          label="平台"
          prop="imgType"
        >
          <el-radio
            v-model="dataForm.imgType"
            :label="0"
          >
            移动端
          </el-radio>
          <el-radio
            v-model="dataForm.imgType"
            :label="1"
          >
            PC端
          </el-radio>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-radio
            v-model="dataForm.status"
            :label="0"
          >
            禁用
          </el-radio>
          <el-radio
            v-model="dataForm.status"
            :label="1"
          >
            正常
          </el-radio>
        </el-form-item>
        <!-- 排序 -->
        <el-form-item
          label="排序"
          prop="seq"
        >
          <el-input-number
            v-model="dataForm.seq"
            :min="0"
            controls-position="right"
            :precision="0"
            @blur="seqChange"
          />
        </el-form-item>
        <!-- 类型 -->
        <el-form-item
          class="type-box"
          label="类型"
          prop=""
        >
          <el-radio
            v-model="relatedSpu"
            :label="0"
          >
            无
          </el-radio>
          <el-radio
            v-model="relatedSpu"
            :label="1"
          >
            商品
          </el-radio>
          <div v-if="relatedSpu === 1 && dataForm.spu && dataForm.spu.spuId">
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px;width: 120px"
            >
              <!-- <img :src="prods.imgUrls" style="height:104px;width:100%"> -->
              <!-- <img v-if="dataForm.spu.mainImgUrl" :src="(dataForm.spu.mainImgUrl).indexOf('http')===-1 ? resourcesUrl + dataForm.spu.mainImgUrl : dataForm.spu.mainImgUrl" style="height:104px;width:100%">
              <img v-if="!dataForm.spu.mainImgUrl" class="prod-img" src="~@/assets/images/def.png" style="height:104px;width:100%"> -->
              <ImgShow
                :src="dataForm.spu.mainImgUrl"
                :img-style="{height:'104px',width:'100%'}"
              />
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{ dataForm.spu.spuName || dataForm.spu.name }}</span>
                <el-button
                  link
                  type="primary"
                  class="card-prod-name-button"
                  @click="deleteCurrentProd"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </div>
          <div
            v-if="relatedSpu === 1 && !dataForm.spuId"
            class="select-pro"
          >
            <el-button @click="selectProds">
              选择商品
            </el-button>
          </div>
          <prods-select
            v-if="prodSelectVisible"
            ref="prodSelectRef"
            :is-single="true"
            @refresh-select-prods="getSelectedProd"
            @close-module="closeModule"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="visible = false"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/index-img.js'
import ProdsSelect from '@/components/prods-select/index.vue'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])

const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const visible = ref(false)
const dataForm = reactive({
  imgId: 0,
  imgUrl: null,
  seq: 0,
  imgType: 0,
  status: 1,
  spuId: null
})
const relatedSpu = ref(0)
// 关联数据
const card = reactive({
  id: 0,
  pic: '',
  name: '',
  realData: {
    prod: [],
    shop: [],
    activity: []
  }
})
const prodSelectVisible = ref(false)
const prods = reactive({})
const rules = {
  imgUrl: [
    { required: true, message: '请选择轮播图图片', trigger: 'blur' }
  ]
}

watch(relatedSpu, (nv) => {
  if (nv === 0) {
    deleteCurrentProd()
  }
})

const dataFormRef = ref('')
const init = (imgId) => {
  visible.value = true
  dataForm.imgId = imgId || 0
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.imgId) {
      return
    }
    api.get(imgId).then(data => {
      Object.assign(dataForm, data)
      if (data.spuId) {
        relatedSpu.value = 1
      }
    })
  })
}

const seqChange = () => {
  if (!dataForm.seq) {
    dataForm.seq = 0
  }
}

defineExpose({
  init
})

const prodSelectRef = ref('')
const selectProds = () => {
  prodSelectVisible.value = true
  nextTick(() => {
    prodSelectRef.value?.init(null, { indexImg: true, filterSup: true })
  })
}

const deleteCurrentProd = () => {
  dataForm.spu = {}
  dataForm.spuId = ''
}

const closeDialog = () => {
  Object.assign(dataForm, {
    imgId: 0,
    imgUrl: null,
    seq: 0,
    imgType: 0,
    status: 1,
    spuId: null,
    spu: {}
  })
  relatedSpu.value = 0
}

const getSelectedProd = (prods) => {
  // prods = prods[0]
  // dataForm.spuId = prods.spuId
  dataForm.spu = prods[0]
  dataForm.spuId = prods[0].spuId
  // prodSelectVisible = false
}

const closeModule = () => {
  prodSelectVisible.value = false
}

/**
 * 表单提交
 */
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    if (!dataForm.imgUrl) {
      ElMessage({
        message: '请选择轮播图片',
        type: 'warning',
        duration: 1500
      })
      return
    }
    if (relatedSpu === 1 && !dataForm.spuId) {
      ElMessage({
        message: '请选择商品',
        type: 'warning',
        duration: 1500
      })
      return
    }
    const request = dataForm.imgId ? api.update(dataForm) : api.save(dataForm)
    request.then(data => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    })
  })
}, 1000)
</script>

<style lang="scss" scoped>
.index-img {

  .type-box{
    :deep(.el-form-item__content){
      display: block;

    }
  }
  .el-form--label-left {
    .el-form-item__label {
      text-align: right !important;
    }
  }
  .select-pro {
    margin-top: 10px;
    width: 100%;
  }
  .card-prod-bottom {
    position: relative;
    text-align: left;
    top: -15px;
    .card-prod-name {
      margin: auto;
      padding: 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 118px;
      display: inline-block;
    }
    .card-prod-name-button {
      position: absolute;
      top: 30px;
      right: 0;
    }
    .el-button--medium {
      padding: 2px 6px !important;
    }
  }
}
</style>
