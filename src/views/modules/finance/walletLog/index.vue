<template>
  <div class="page-walletLog">
    <div class="shop-walletLog">
      <div class="title">
        平台余额
      </div>
      <div class="head">
        <div class="head-item">
          <div class="text">
            <span style="margin-right:10px">平台收入金额（元）</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="用户确认收货15天后，增加平台收入金额（平台佣金 - 平台补贴金额）"
              placement="right"
            >
              <span><el-icon class="question"><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </div>
          <div class="balance">
            <span style="margin-right:20px">{{ amount(shopWalletInfo.settledAmount ) }}</span>
          </div>
        </div>
        <div
          class="head-item"
          style="margin-left:20px"
        >
          <div class="text">
            <span style="margin-right:10px">待结算金额(元)</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="用户购买商品之后，等待用户确认收货15天后，将会变成平台收入余额"
              placement="right"
            >
              <span><el-icon class="question"><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </div>
          <div class="balance">
            <span style="margin-right:30px">{{ amount(shopWalletInfo.unsettledAmount) }}</span>
          </div>
        </div>
      </div>
      <div class="table">
        <Trading />
      </div>
    </div>
  </div>
</template>

<script setup>
import Trading from './components/trading.vue'
import { shopWallet } from '@/api/wallet-log/index'
import { QuestionFilled } from '@element-plus/icons-vue'
import Big from 'big.js'

const amount = (value) => {
  if (!value) {
    return 0
  }
  return new Big(value).div(100).toFixed(2)
}

const shopWalletInfo = ref('')

onMounted(() => {
  onGetShopWallet()
})

// 获取店铺余额信息
const onGetShopWallet = () => {
  shopWallet().then(data => {
    shopWalletInfo.value = data
  })
}

</script>

<style lang="scss" scoped>
.page-walletLog {
    background: #F5F5F5;
    width: 100%;
    min-height: 100vh;
  .shop-walletLog {
   background: #FFFFFF;
   width: 100%;
   padding: 24px;
   .title {
     font-size: 18px;
     margin-bottom: 16px;
   }
   .head {
     background: #F5F5F5;
     height: 130px;
     padding: 20px;
     display: flex;
     justify-content: space-around;
     margin-bottom: 30px;
     .head-item {
       height: 100%;
       width: 230px;
       display: flex;
       flex-direction: column;
       justify-content: space-around;
       .balance {
         font-size: 22px;
       }
     }
   }
 }
  }

</style>
