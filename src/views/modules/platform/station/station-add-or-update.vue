<template>
  <el-dialog
    v-model="visible"
    title="查看"
    :close-on-click-modal="false"
    width="764px"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="100px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="门店名称"
        prop="stationName"
        style="width:530px;"
      >
        <el-input
          disabled
          :value="dataForm.stationName"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.imgUrl"
        label="门店图片"
        prop="imgUrl"
      >
        <img-upload
          v-model="dataForm.imgUrl"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input
          disabled
          :value="(dataForm.mobilePrefix ? dataForm.mobilePrefix + ' - ' : '') + dataForm.mobile"
        />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
      >
        <el-radio-group
          v-model="status"
          disabled
        >
          <el-radio :label="1">
            营业
          </el-radio>
          <el-radio :label="0">
            关闭
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="地址"
        prop="status"
      >
        <el-input
          disabled
          type="textarea"
          rows="3"
          :value="dataForm.province + dataForm.city + dataForm.area + dataForm.addr"
        />
      </el-form-item>
      <el-form-item>
        <div class="map">
          <tmap
            ref="tmapRef"
            :lat-lng="center"
          />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">返回</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/station/index'

const visible = ref(false)
const dataForm = ref({
  stationId: null,
  stationName: null,
  imgUrl: null,
  mobilePrefix: null,
  mobile: null,
  status: 0,
  provinceId: null,
  province: null,
  cityId: null,
  city: null,
  areaId: null,
  area: null,
  addr: null,
  lng: null,
  lat: null
})
const status = ref(0)
const center = ref(null)

// 重置表单
const dataFormRef = ref('')
const init = (stationId) => {
  dataForm.value.stationId = stationId || 0
  visible.value = true

  nextTick(async () => {
    dataFormRef.value?.resetFields()
    dataForm.value.provinceId = null
    dataForm.value.cityId = null
    dataForm.value.areaId = null
    if (dataForm.value.stationId) {
      getDataInfo()
    }
  })
}
defineExpose({
  init
})

// 获取店铺详情数据
const getDataInfo = () => {
  api.getStationInfo({ stationId: dataForm.value.stationId }).then((data) => {
    dataForm.value = data
    status.value = dataForm.value.status === 1 ? 1 : 0
    center.value = {
      lng: dataForm.value.lng,
      lat: dataForm.value.lat
    }
  })
}

</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 220px;
}
</style>
