import { defineStore } from 'pinia'

import { getPaySettlementType } from '@/api/platform/sys-config'
export const useAllinpayStore = defineStore('allinpay', {
  state: () => {
    return {
      // 启用通联支付 1：启用 0：未启用
      paySettlementType: 0
    }
  },
  actions: {
    SET_PAY_SETTLEMENT_TYPE (paySettlementType) {
      this.paySettlementType = paySettlementType
    },
    getPaySettlementType () {
      getPaySettlementType().then((res) => {
        const data = res ? JSON.parse(res) : {}
        this.SET_PAY_SETTLEMENT_TYPE(data.paySettlementType ? data.paySettlementType : 0)
      })
    }
  }
})
