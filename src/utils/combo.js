/**
 * 处理数组数据，并根据 key 进行分组
 * @param array 数组数据
 * @param key 分组的键值依据
 * @param resKey 分组后数据存放的列表
 * @param arrKey  分组时需要提取出来的属性列表
 */
const handleOrderItems = (array = [], key, resKey = 'list', arrKey = []) => {
  if (!key) return array
  const aMap = []
  const aResult = []
  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    if (aMap.indexOf(item[key]) === -1) {
      const oItem = {}
      oItem[resKey] = [item]
      oItem[key] = item[key]
      if (item[key] !== 0 && item[key]) {
        oItem.spuMold = 2
      } else {
        oItem.spuMold = 0
      }
      if (arrKey.length > 0) {
        arrKey.forEach(keyItem => {
          oItem[keyItem] = item[keyItem]
        })
      }
      aResult.push(oItem)
      aMap.push(item[key])
    } else {
      const index = aMap.indexOf(item[key])
      aResult[index][resKey].push(item)
    }
  }
  return aResult
}

/**
 * 根据所传数组及 key,计算并返回总和
 * @param list 数组
 * @param priceKey 数据 列：价格
 * @param countKey 数量
 * @returns {number}
 */
const countComboPrice = (list, priceKey, countKey) => {
  let s = 0
  for (let i = 0; i < list.length; i++) {
    if (list[i][priceKey]) {
      s += parseFloat(list[i][priceKey] * list[i][countKey])
    }
  }
  s = s.toFixed(3) * 1000 / 1000
  return s || 0
}

export {
  handleOrderItems,
  countComboPrice
}
