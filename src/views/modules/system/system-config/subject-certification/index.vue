<template>
  <div class="page-subject-certification">
    <div class="title-tips">
      <el-icon color="#FFA900">
        <WarningFilled />
      </el-icon>
      <span>
        主体未认证时将会限制微信收款及余额提现等功能。为了不影响商城日常经营，建议及时完成主体认证。
      </span>
    </div>
    <div class="subject-certification">
      <h6 class="title">
        选择主体类型
      </h6>
      <div class="label-content">
        <div class="label-item">
          <div class="label-title">
            企业
          </div>
          <div class="label-messages">
            营业执照商的主体类型一般为有限公司、有限责任公司
          </div>
          <el-button
            type="primary"
            @click="toAccreditationPage"
          >
            选择
          </el-button>
        </div>
        <div class="label-item">
          <div class="label-title">
            企业
          </div>
          <div class="label-messages">
            营业执照商的主体类型一般为有限公司、有限责任公司
          </div>
          <el-button
            type="primary"
          >
            选择
          </el-button>
        </div>
        <div class="label-item">
          <div class="label-title">
            企业
          </div>
          <div class="label-messages">
            营业执照商的主体类型一般为有限公司、有限责任公司
          </div>
          <el-button
            type="primary"
          >
            选择
          </el-button>
        </div>        <div class="label-item">
          <div class="label-title">
            企业
          </div>
          <div class="label-messages">
            营业执照商的主体类型一般为有限公司、有限责任公司
          </div>
          <el-button
            type="primary"
          >
            选择
          </el-button>
        </div>        <div class="label-item">
          <div class="label-title">
            企业
          </div>
          <div class="label-messages">
            营业执照商的主体类型一般为有限公司、有限责任公司
          </div>
          <el-button
            type="primary"
          >
            选择
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const router = useRouter()
const toAccreditationPage = () => {
  router.push('certification-information')
}
</script>
<style lang="scss" scoped>
.page-subject-certification{
  min-height: 800px;
  background: #f9f9f9;
  .title-tips{
    width: 100%;
    line-height: 32px;
    font-size: 14px;
    color: #666666;
    background: #FFF7DD;
    border: 1px solid #FFD888;
    border-radius: 2px;
    padding: 5px 22px;
    margin-bottom: 20px;
    span{
      margin-left: 3px;
    }
  }
  .subject-certification{
      width: 100%;
      height: 868px;
      background: #FFFFFF;
      border: 1px solid #FFF;
      border-radius: 2px 2px 2px 2px;
      .title{
       width: 100%;
       height: 99px;
       line-height: 99px;
       font-weight: normal;
       text-align: center;
       font-size: 20px;
       font-family: Microsoft YaHei-Regular, sans-serif;
       margin: 0;
      }
      .label-content{
        display: flex;
        flex-wrap: wrap;
        padding: 0 75px;
        .label-item{
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 453px;
          height: 269px;
          border: 1px solid #E3E2E5;
          border-radius: 5px;
          margin: 0 60px 60px 0;
          padding: 50px 0 40px 0;
          &:nth-child(3n) {
            margin: 0;
          }
          .label-title{
            font-weight: 700;;
          }
          .label-messages{
            width: 300px;
            text-align: center;
            font-size: 14px;
            margin: 20px 0 60px 0;
            color:#999999;
          }
          :deep(.el-button){
            width: 94px;
            height: 36px;
          }
        }
      }
  }

}

</style>
