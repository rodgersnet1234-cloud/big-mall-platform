export default {
  install: () => {
    // 引入腾讯地图
    document.getElementById('qqMap').src = `https://map.qq.com/api/gljs?v=1.exp&libraries=service,tools&key=${import.meta.env.VITE_APP_MAP_KEY}`
  }
}
