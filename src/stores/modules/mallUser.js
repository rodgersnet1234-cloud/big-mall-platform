/*
* Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
*
* https://www.mall4j.com/
*
* 未经允许，不可做商业用途！
*
* 版权所有，侵权必究！
*/
import { defineStore } from 'pinia'
import { getMallUserInfo } from '@/api/multishop/shop-event'

export const mallUserStore = defineStore('mallUser', {
  state: () => {
    return {
      mallName: '',
      merchantName: '',
      phone: '',
      platformStatus: '',
      subjectStatus: '',
      subjectType: '',
      tenantId: ''
    }
  },

  actions: {
    onGetMallUserInfo () {
      return new Promise((resolve, reject) => {
        getMallUserInfo().then(shopUser => {
          console.log(shopUser, 'shopUser')
          this.mallName = shopUser.mallName
          this.merchantName = shopUser.merchantName
          this.phone = shopUser.phone
          this.platformStatus = shopUser.platformStatus
          this.subjectStatus = shopUser.subjectStatus
          this.subjectType = shopUser.subjectType
          this.tenantId = shopUser.tenantId
          resolve(shopUser)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
})
