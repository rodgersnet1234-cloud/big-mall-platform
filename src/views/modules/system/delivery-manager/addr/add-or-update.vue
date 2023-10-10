<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.shopRefundAddrId? $t('table.edit'): $t('table.create')"
    :modal-append-to-body="blVisible"
    :append-to-body="true"
    class="component-addr"
    @close="handleClose"
  >
    <el-form
      ref="dataFormRef"
      :rules="dataRule"
      :model="dataForm"
      label-position="right"
      label-width="90px"
      style="width: 500px; margin-left:50px;"
      @submit.prevent
    >
      <el-form-item
        :label="$t('platform.shopAddr.province')"
        class="addr-lable"
      >
        <el-col
          :span="7"
          style="margin-right:10px"
        >
          <el-form-item prop="province">
            <el-select
              v-model="dataForm.province"
              :placeholder="$t('tip.select')"
              @change="selectProvince"
            >
              <el-option
                v-for="(province, index) in provinceList"
                :key="province.areaId"
                :label="province.areaName"
                :value="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="7"
          style="margin-right:10px"
        >
          <el-form-item prop="city">
            <el-select
              v-model="dataForm.city"
              :placeholder="$t('tip.select')"
              @change="selectCity"
            >
              <el-option
                v-for="(city, index) in cityList"
                :key="city.areaId"
                :label="city.areaName"
                :value="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="7"
          style="margin-right:10px"
        >
          <el-form-item prop="area">
            <el-select
              v-model="dataForm.area"
              :placeholder="$t('tip.select')"
              @change="selectArea"
            >
              <el-option
                v-for="(area, index) in areaList"
                :key="area.areaId"
                :label="area.areaName"
                :value="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 地址 -->
      <el-form-item
        :label="$t('platform.shopAddr.addr')"
        prop="addr"
      >
        <el-input
          v-model.trim="dataForm.addr"
          placeholder="详细地址"
          style="width: 250px;"
          maxlength="80"
          show-word-limit
        />
      </el-form-item>
      <!-- 邮编 -->
      <el-form-item
        :label="$t('platform.shopAddr.postCode')"
        prop="postCode"
        class="postCode-label"
      >
        <el-input
          v-model.trim="dataForm.postCode"
          placeholder="邮政编码"
          maxlength="6"
          style="width: 250px;"
          show-word-limit
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
</template>

<script setup>
import * as api from '@/api/platform/shop-addr'
import * as addrApi from '@/api/delivery/transport'
import { Debounce } from '@/utils/debounce'
import { validNoEmptySpace } from '@/utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const blVisible = ref(false)
const isSubmit = ref(false)
const provinceList = ref([])
const cityList = ref([])
const areaList = ref([])
const dataForm = reactive({
  shopRefundAddrId: 0,
  shopId: null,
  isDefault: 0,
  provinceId: null,
  province: null,
  cityId: null,
  city: null,
  areaId: null,
  area: null,
  addr: null,
  postCode: null,
  lng: null,
  lat: null
})
const initDataForm = reactive({
  province: null,
  city: null,
  area: null,
  addr: null
})
const isDefault = ref(false)
const validatePostCode = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('不能全为空格'))
    return
  }
  if (!/^[0-9]{6}$/.test(value) && value !== '' && value !== null) {
    callback(new Error('请输入正确的邮政编码'))
    return
  }
  callback()
}
const dataRule = {
  postCode: [{
    validator: validatePostCode, trigger: 'blur'
  }],
  addr: [{ required: true, message: $t('platform.shopAddr.addressCannotBeEmpty'), pattern: '[^ \x22]+', trigger: 'blur' }],
  city: [{ required: true, message: $t('platform.shopAddr.cityCannotBeEmpty'), trigger: 'blur' }],
  province: [
    { required: true, message: $t('platform.shopAddr.provinceCannotBeEmpty'), trigger: 'blur' }
  ],
  area: [{ required: true, message: $t('platform.shopAddr.districtCounEmpty'), trigger: 'blur' }]
}

const dataFormRef = ref('')
const init = (shopRefundAddrId) => {
  dataForm.shopRefundAddrId = shopRefundAddrId || 0
  visible.value = true
  blVisible.value = false
  isSubmit.value = false
  dataForm.provinceId = null
  dataForm.province = null
  provinceList.value = []
  cityList.value = []
  areaList.value = []
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.shopRefundAddrId) {
      return
    }
    api.get(shopRefundAddrId).then(data => {
      Object.assign(dataForm, data)
      Object.assign(initDataForm, dataForm)
    })
  })
  listArea()
}
defineExpose({
  init
})
const listArea = () => {
  addrApi.listAreaOfEnable().then(data => {
    provinceList.value = treeDataTranslate(data, 'areaId', 'parentId')
  })
}
const handleClose = () => {
  blVisible.value = true
}
// 选择省
const selectProvince = (index) => {
  dataForm.cityId = null
  dataForm.city = ''
  dataForm.areaId = null
  dataForm.area = ''
  const province = provinceList.value[index]
  dataForm.provinceId = province.areaId
  dataForm.province = province.areaName
  // 获取城市的select
  cityList.value = province.children
  areaList.value = []
  dataFormRef.value?.validateField('province')
}
// 选择市
const selectCity = (index) => {
  dataForm.areaId = null
  dataForm.area = ''
  const city = cityList.value[index]
  dataForm.cityId = city.areaId
  dataForm.city = city.areaName
  // 获取区的select
  areaList.value = city.children
  dataFormRef.value?.validateField('city')
}
// 选择区
const selectArea = (index) => {
  dataForm.areaId = null
  dataForm.area = ''
  const area = areaList.value[index]
  dataForm.areaId = area.areaId
  dataForm.area = area.areaName
  dataFormRef.value?.validateField('area')
}
// 表单提交
const onSubmit = Debounce(() => {
  dataForm.isDefault = isDefault.value ? 1 : 0
  dataFormRef.value?.validate(valid => {
    if (!valid || isSubmit.value) {
      return
    }
    if (dataForm.shopRefundAddrId) {
      api.isConfigByOutlet(dataForm.shopRefundAddrId).then((data) => {
        if (data && checkAddrChange()) {
          ElMessageBox.confirm($t('platform.shopAddr.changeAddrTip'), $t('platform.shopAddr.changeAddrTipTitle'), {
            confirmButtonText: $t('table.confirm'),
            cancelButtonText: $t('table.cancel'),
            type: 'warning'
          }).then(() => {
            onRequest()
          }).catch(() => {
          })
        } else {
          onRequest()
        }
      })
    } else {
      onRequest()
    }
  })
}, 1000)
const onRequest = () => {
  isSubmit.value = true
  const request = dataForm.shopRefundAddrId ? api.update(dataForm) : api.save(dataForm)
  request.then(() => {
    visible.value = false
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        blVisible.value = true
        emit('refreshDataList')
        dataFormRef.value?.resetFields()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
const checkAddrChange = () => {
  if (initDataForm.province !== dataForm.province) {
    return true
  }
  if (initDataForm.city !== dataForm.city) {
    return true
  }
  if (initDataForm.area !== dataForm.area) {
    return true
  }
  return initDataForm.addr !== dataForm.addr
}

</script>
<style lang="scss" scoped>
.component-addr {
  :deep(.postCode-label .el-form-item__label:before) {
    content: "";
    color: #ff4949;
    margin-right: 8px;
  }
  .addr-lable :deep(.el-form-item__label:before){
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
  .addr-lable :deep(.el-form-item--small.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
