<template>
  <!--所有可以选择的组件-->
  <div
    v-show="isShowAllComponents"
    id="allComponents"
    class="all-grouped component-all-can-use-components"
  >
    <div class="add-component-grouped">
      <div class="add-component-grouped-item">
        <div class="add-grouped-item-title">
          {{ $t('shopFeature.allCanUse.basicComponents') }}
        </div>
        <div class="add-grouped-item-list">
          <vue-draggable-next
            v-model="componentLists"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="cloneDog"
            ghost-class="ghost"
            :disabled="!isDrag"
          >
            <div
              v-for="(item,index) in baseList"
              :key="index"
              class="add-grouped-item-list-btn"
            >
              <div
                v-if="!item.isHide"
                class="add-grouped-item-list-con"
                @click="addComponent(item, index)"
              >
                <div
                  class="add-grouped-item-list-btn-title"
                  :class="{'active': item.type === currentActiveType}"
                >
                  <div class="item-pic-container">
                    <img
                      v-if="item.type === currentActiveType "
                      :src="item.picActive"
                      alt=""
                    >
                    <img
                      v-else
                      :src="item.pic"
                      alt=""
                    >
                  </div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </vue-draggable-next>
        </div>
        <div class="add-grouped-item-title">
          {{ $t('shopFeature.allCanUse.productMarketing') }}
        </div>
        <div class="add-grouped-item-list">
          <vue-draggable-next
            v-model="componentLists"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="cloneDog"
            ghost-class="ghost"
            :disabled="!isDrag"
          >
            <div
              v-for="(item,index) in shopDisList"
              :key="index"
              class="add-grouped-item-list-btn"
            >
              <div
                v-if="!item.isHide"
                @click="addComponent(item, index)"
              >
                <div
                  class="add-grouped-item-list-btn-title"
                  :class="{'active': item.type === currentActiveType}"
                >
                  <div class="item-pic-container">
                    <img
                      v-if="item.type === currentActiveType "
                      :src="item.picActive"
                      alt=""
                    >
                    <img
                      v-else
                      :src="item.pic"
                      alt=""
                    >
                  </div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </vue-draggable-next>
        </div>
        <div class="add-grouped-item-title">
          {{ $t('shopFeature.allCanUse.extendComponent') }}
        </div>
        <div class="add-grouped-item-list">
          <vue-draggable-next
            v-model="componentLists"
            :group="{name: 'people', pull: 'clone', put: false}"
            :clone="cloneDog"
            ghost-class="ghost"
            :disabled="!isDrag"
          >
            <div
              v-for="(item, index) in extendComponentList"
              :key="index"
              class="add-grouped-item-list-btn"
            >
              <div
                v-if="!item.isHide"
                @click="addComponent(item)"
              >
                <div
                  class="add-grouped-item-list-btn-title"
                  :class="{'active': item.type === currentActiveType}"
                >
                  <div class="item-pic-container">
                    <img
                      v-if="item.type === currentActiveType "
                      :src="item.picActive"
                      alt=""
                    >
                    <img
                      v-else
                      :src="item.pic"
                      alt=""
                    >
                  </div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </vue-draggable-next>
        </div>
      </div>
    </div>
  </div>
  <!--end 所有可以选择的组件-->
</template>
<script setup>
import { VueDraggableNext } from 'vue-draggable-next'
import { componentLists as routerData } from './compRouterData.js'

const props = defineProps({
  /**
   * 结构
   * hideTheseComponents = [{type: 'config',isHide:true}]
   * */
  hideTheseComponents: { // 隐藏这些组件
    type: Array,
    default: () => []
  },
  showTheseComponents: { // 显示这些组件
    type: Array,
    default: () => []
  },
  isShowAllComponents: { // 是否隐藏所有组件
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['retAllCanUseComponents', 'addComponent'])
const componentLists = reactive(routerData)

const isDrag = ref(true)

watch(() => props.hideTheseComponents, () => {
  hideComponents()
}, { deep: true })

watch(() => props.showTheseComponents, () => {
  showComponents()
}, { deep: true })

onMounted(() => {
  groupcomponent()
  emit('retAllCanUseComponents', componentLists)
  hideComponents()
  showComponents()
})

const shopDisList = ref([])
const baseList = ref([])
const extendComponentList = ref([]) // 扩展组件
/**
 *  组件分组
 */
const groupcomponent = () => {
  const baseListPar = []
  const shopDisListPar = []
  const extendComponentPar = []
  for (let i = 0; i < componentLists.length; i++) {
    const item = componentLists[i]
    if (item.type === 'promotionalActivities' || item.type === 'goods' || item.type === 'goodsWaterfall') {
      shopDisListPar.push(item)
    } else if (item.type === 'goodsModule1' || item.type === 'goodsModule2' || item.type === 'goodsModule3' || item.type === 'goodsModule4' || item.type === 'goodsModule5') {
      extendComponentPar.push(item)
    } else {
      baseListPar.push(item)
    }
  }
  baseList.value = baseListPar
  shopDisList.value = shopDisListPar
  extendComponentList.value = extendComponentPar
}

const cloneDog = ({ type }) => {
  return componentLists.find(x => x.type === type)
}

// 当前选中的组件
const currentActiveType = ref('')
/** 添加组件 */
const addComponent = (item) => {
  currentActiveType.value = item.type
  emit('addComponent', item)
}

/** 隐藏组件 */
const hideComponents = () => {
  if (props.hideTheseComponents.length) { // 判断是否隐藏这些组件，那么其他的组件均显示（除了isHeader的）
    componentLists.forEach(res => {
      if (!res.isHeader) {
        res.isHide = false
      }
    })
  }
  isShowOrHide(props.hideTheseComponents, true)
}
const showComponents = () => {
  if (props.showTheseComponents.length) { // 判断是否显示这些组件，那么其他的组件均隐藏
    componentLists.forEach(res => {
      if (!res.isHeader) {
        res.isHide = true
      }
    })
  }
  isShowOrHide(props.showTheseComponents, false)
}

const isShowOrHide = ($data, isHide) => {
  if (!$data.length) return
  $data.forEach(res => {
    if (res.type) {
      const $index = componentLists.findIndex(x => x.type === res.type)
      if ($index >= 0) {
        componentLists[$index].isHide = isHide
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@use "index";
</style>
