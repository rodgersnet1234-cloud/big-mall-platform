<template>
  <div class="component-select-lazy">
    <el-select
      v-model="selDvyId"
      v-loadmore="loadmore"
      :style="selStyle"
      filterable
      class="def-width"
      remote
      :remote-method="remoteMethod"
      :placeholder="placeTips"
      :disabled="disabled"
      clearable
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

const emit = defineEmits([
  'update:modelValue'
])

const vLoadmore = {
  mounted: (el, binding) => {
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    SELECTWRAP_DOM?.addEventListener('scroll', function () {
      const condition =
        document.documentElement.scrollHeight - document.documentElement.scrollTop <=
        document.documentElement.clientHeight
      if (condition) {
        binding.value()
      }
    })
  }
}

const props = defineProps({
  modelValue: {
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

const selDvyId = ref('') // 当前选择的值
const size = ref(20)
const current = ref(1)
const dvyName = ref('')
const pages = ref(0)
const devList = reactive([])
const isSearch = ref(false)

onMounted(() => {
  getDeliveryList()
})

watch(
  () => props.modelValue,
  val => {
    selDvyId.value = val
  },
  { immediate: true }
)

const change = () => {
  emit('update:modelValue', selDvyId.value)
}

const focus = () => {
  if (devList.length === 0) {
    remoteMethod()
  }
}
const remoteMethod = (name) => {
  isSearch.value = true
  current.value = 1
  dvyName.value = name
  getDeliveryList()
}

// 获取物流列表
const getDeliveryList = () => {
  deliveryCompanyApi.page({
    pageSize: size.value,
    pageNum: current.value,
    name: dvyName.value
  }).then((data) => {
    pages.value = data.pages
    if (current.value === 1) {
      devList.length = 0
      devList.push(...data.list)
      if (selDvyId.value && !isSearch.value) {
        checkCurSel(devList, selDvyId.value)
      }
    } else {
      const fList = data.list.filter(r => r.deliveryCompanyId !== selDvyId.value)
      devList.push(...fList)
    }
  })
}

// 获取当前id的物流
const getDeliveryById = (deliveryCompanyId) => {
  deliveryCompanyApi.page({
    deliveryCompanyId,
    pageNum: 1,
    pageSize: size.value
  }).then((data) => {
    devList.unshift(...data.list)
  })
}
// 分页加载
const loadmore = () => {
  if (current.value < pages.value) {
    current.value++
    getDeliveryList()
  }
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

<style lang="scss" scoped>
.component-select-lazy {
  .def-width {
    width: 200px;
  }
}
</style>
