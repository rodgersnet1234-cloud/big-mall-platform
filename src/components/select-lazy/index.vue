<template>
  <div>
    <el-select
      v-model="selDvyId"
      :style="selStyle"
      filterable
      remote
      :remote-method="remoteMethod"
      :placeholder="placeTips"
      :disabled="disabled"
      @change="change"
      @focus="focus"
    >
      <el-option
        v-for="item in devList"
        :key="item.deliveryCompanyId"
        :label="item.name"
        :value="item.deliveryCompanyId"
      />
    </el-select>
  </div>
</template>

<script setup>
import * as deliveryCompanyApi from '@/api/delivery/delivery-company'

const props = defineProps({
  value: {
    type: [String, Number],
    default: ''
  },
  selStyle: {
    type: Object,
    default: () => {}
  },
  placeTips: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['input', 'update:modelValue'])

const selDvyId = ref('') // 当前选择的值
watch(() => props.value, (val) => {
  selDvyId.value = val
}, { immediate: true })

onMounted(() => {
  getDeliveryList()
})

const change = () => {
  emit('update:modelValue', selDvyId.value)
}

const devList = ref([])
const focus = () => {
  if (devList.value.length === 0) {
    remoteMethod()
  }
}

let isSearch = false
let current = 1
let dvyName = ''
const remoteMethod = (name) => {
  isSearch = true
  current = 1
  dvyName = name
  getDeliveryList()
}

const size = 20
// 获取物流列表
const getDeliveryList = () => {
  deliveryCompanyApi.page({
    pageSize: size,
    pageNum: current,
    name: dvyName
  }).then((data) => {
    if (current === 1) {
      devList.value = data.list
      if (selDvyId.value && !isSearch) {
        checkCurSel(devList.value, selDvyId.value)
      }
    } else {
      const fList = data.list.filter(r => r.deliveryCompanyId !== selDvyId.value)
      devList.value.push(...fList)
    }
  })
}

// 获取当前id的物流
const getDeliveryById = (deliveryCompanyId) => {
  deliveryCompanyApi.page({
    deliveryCompanyId,
    pageNum: 1,
    dvyName: 1
  }).then((data) => {
    devList.value.unshift(...data.list)
  })
}

// 筛查出当前所选的对象
const checkCurSel = (curList, curId) => {
  for (const item of curList) {
    if (item.deliveryCompanyId === curId) {
      return
    }
  }
  getDeliveryById(curId)
}

</script>
