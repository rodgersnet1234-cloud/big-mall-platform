<template>
  <div id="container" />
</template>

<script setup>
import { onMounted, watch } from 'vue'
const TMap = window.TMap
const props = defineProps({
  latLng: {
    type: Object,
    default: () => null
  },
  address: {
    type: String,
    default: ''
  },
  // 图形列表
  graphs: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['changeLatLng', 'setPolygonPath'])

// 监听坐标变化，更新标记
watch(() => props.latLng, (val) => {
  if (val) {
    cocateTimer && clearTimeout(cocateTimer)
    cocateTimer = null
    onUpdateMarker(new TMap.LatLng(val.lat, val.lng))
  }
})

const defMapCenter = new TMap.LatLng(23.136783, 113.327955) // 默认中心点坐标
let map = null
let cocateTimer = null
const init = () => {
  if (props.latLng) { // 是否存在坐标，存在则以坐标为中心点，不存在则以定位为中心点
    const mapCenter = new TMap.LatLng(props.latLng.lat, props.latLng.lng)// 设置中心点坐标
    map = new TMap.Map('container', {
      center: mapCenter,
      zoom: 10
    })
  } else {
    nextTick(() => {
      map = new TMap.Map('container', {
        zoom: 13
      })
    })
  }
  cocateTimer = setTimeout(() => {
    onLocate()
  }, 1500)

  nextTick(() => {
    // 处理标记
    onHandleMarker()

    // // 移动后获取中心点坐标添加标记
    map.on('dragend', (evt) => {
      emits('changeLatLng', evt.target.getCenter())
    })

    // 左键按下地图事件
    map.on('mousedown', () => {
      infoWindow.close() // 关闭信息窗关闭
    })
  })
}
onMounted(() => {
  init()
})

let markerLayer = null // 标记图层
let infoWindow = null // 窗体信息
const onHandleMarker = () => {
  markerLayer = new TMap.MultiMarker({
    id: 'marker-layer',
    map,
    styles: {
      marker: new TMap.MarkerStyle({
        width: 24,
        height: 32
      })
    }
  })

  // 初始化infoWindow
  infoWindow = new TMap.InfoWindow({
    map,
    position: defMapCenter,
    offset: { x: 0, y: -32 } // 设置信息窗相对position偏移像素
  })
  infoWindow.close()// 初始关闭信息窗关闭
  markerLayer.on('click', (evt) => {
    infoWindow.open()
    infoWindow.setPosition(evt.geometry.position)
    infoWindow.setContent(`<div class="info_card">${props.address || '店铺所在位置'}</div>`)
  })
}

let editor = null
let overlayId = 0
// 初始化几何图形和编辑器（无需编辑则无需调用）
const onInitGemotryEditor = (simplePath) => {
  editor = new TMap.tools.GeometryEditor({
    map, // 绑定的编辑器
    // 可编辑图层
    overlayList: [
      {
        overlay: new TMap.MultiPolygon({
          map,
          styles: {
            highlight: new TMap.PolygonStyle({
              color: 'rgba(255, 255, 255, 0.6)'
            })
          },
          geometries: [
            {
              id: 'polygonGeometries',
              paths: simplePath
            }
          ]
        }),
        id: 'polygon' + overlayId,
        selectedStyleId: 'highlight'
      }
    ],
    actionMode: TMap.tools.constants.EDITOR_ACTION.INTERACT, // 编辑器的工作模式
    activeOverlayId: 'polygon' + overlayId, // 激活图层
    selectable: true, // 开启点选功能
    snappable: true // 开启吸附
  })
  // 选中图形
  editor.select(['polygonGeometries'])
  // 添加修改事件监听
  editor.on('adjust_complete', (evtResult) => {
    emits('setPolygonPath', evtResult)
  })
}

// 重置几何图形和编辑器
const onResetGemotryEditor = (simplePath) => {
  const id = overlayId
  overlayId++
  editor.addOverlay({
    overlay: new TMap.MultiPolygon({
      map,
      styles: {
        highlight: new TMap.PolygonStyle({
          color: 'rgba(255, 255, 255, 0.6)'
        })
      },
      geometries: [
        {
          id: 'polygonGeometries',
          paths: simplePath
        }
      ]
    }),
    id: 'polygon' + overlayId,
    selectedStyleId: 'highlight'
  })
  // 删除当前图形与编辑图层，重新添加
  editor.delete()
  editor.removeOverlay('polygon' + id)
  editor.setActiveOverlay('polygon' + overlayId)
  editor.select(['polygonGeometries'])
}

// 更新点标记
const onUpdateMarker = (latLng) => {
  markerLayer.updateGeometries([
    {
      id: 'marker-layer', // 点标注数据数组
      styleId: 'marker',
      styles: {
        marker: new TMap.MarkerStyle({
          width: 24,
          height: 32
        })
      },
      position: latLng
    }
  ])
  map.setCenter(latLng)
}

// 设置地图层级 3-20
const onSetZoom = (zoom) => {
  map.setZoom(zoom)
}

const ipLocation = new TMap.service.IPLocation() // 新建一个IP定位类
function onLocate () {
  ipLocation
    .locate({})
    .then((res) => {
      const { result } = res
      onUpdateMarker(result.location)
      emits('changeLatLng', result.location)
    })
    .catch(() => {
      onUpdateMarker(defMapCenter)
      emits('changeLatLng', defMapCenter)
    })
}

const geocoder = new TMap.service.Geocoder() // 新建一个正逆地址解析类
// 坐标转地址
const onGetAddress = (location) => {
  location = new TMap.LatLng(location.lat, location.lng)
  map.setCenter(location)
  return new Promise((resolve, reject) => {
    geocoder.getAddress({ location }) // 将给定的坐标位置转换为地址
      .then((res) => {
      // 显示搜索到的地址
        resolve(res.result)
      }).catch(err => {
        reject(err)
      })
  })
}
// 地址转坐标
const onGetLocation = (address) => {
  return new Promise((resolve, reject) => {
    geocoder.getLocation({ address }) // 将给定的坐标位置转换为地址
      .then((res) => {
      // 显示坐标数值
        map.setCenter(res.result.location)
        resolve(res.result.location)
      }).catch(err => {
        reject(err)
      })
  })
}

defineExpose({
  onSetZoom,
  onGetAddress,
  onGetLocation,
  onInitGemotryEditor,
  onResetGemotryEditor
})

</script>

<style lang="scss" scoped>
#container{
  width: 100%;
  height: 100%;
}
</style>
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style>
.info_card{
  font-size: 12px;
}
</style>
