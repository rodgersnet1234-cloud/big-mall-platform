<template>
  <div class="app-container page-supplier-edit">
    <div class="head-title">
      供应商详情
    </div>
    <!-- 导航栏 -->
    <div class="nav-box">
      <div class="nav">
        <div
          :class="['nav-item', navStatus === 0 ? 'active' : '']"
          @click="switchNav(0)"
        >
          基本信息
        </div>
        <div
          :class="['nav-item', navStatus === 1 ? 'active' : '']"
          @click="switchNav(1)"
        >
          工商信息
        </div>
        <div
          :class="['nav-item', navStatus === 2 ? 'active' : '']"
          @click="switchNav(2)"
        >
          签约信息
        </div>
        <div
          :class="['nav-item', navStatus === 3 ? 'active' : '']"
          @click="switchNav(3)"
        >
          财务信息
        </div>
      </div>
    </div>
    <!-- 模块 -->
    <div class="shop-info-box">
      <el-alert
        v-if="supplierStatus.supplierStatus===6&&statusRemarks"
        :title="`您的开店申请未通过！原因是：${statusRemarks}。`"
        type="error"
        show-icon
        style="margin-top: 20px;"
      />
      <!-- 基本信息 -->
      <div
        v-if="navStatus === 0"
        class="basic-info-mod"
      >
        <!-- 店铺审核状态 -->
        <div class="audit-status">
          <!-- status 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核 -->
          <!-- supplierStatus 店铺状态(-1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5.审核失败 6.上线审核失败) -->
          <div
            v-if="shopAuditStatus"
            class="audit-item"
          >
            <span class="week">审核状态：</span>
            <span v-if="shopAuditStatus.status === -1">未通过</span>
            <span v-if="shopAuditStatus.status === 0">未审核</span>
            <span v-if="shopAuditStatus.status === 1">已通过</span>
            <span v-if="shopAuditStatus.status === 2">平台下线</span>
          </div>
          <div class="audit-item">
            <span class="week">帐号状态：</span>
            <span v-if="supplierStatus.accountStatus === 0">禁用</span>
            <span v-if="supplierStatus.accountStatus === 1">启用</span>
            <span v-if="supplierStatus.accountStatus === -1">删除</span>
          </div>
          <div class="audit-item">
            <span class="week">店铺状态：</span>
            <span v-if="supplierStatus.supplierStatus === -1">已删除</span>
            <span v-if="supplierStatus.supplierStatus === 0">停业中</span>
            <span v-if="supplierStatus.supplierStatus === 1">营业中</span>
            <span v-if="supplierStatus.supplierStatus === 2">平台下线</span>
            <span v-if="supplierStatus.supplierStatus === 3">开店待审核</span>
            <span v-if="supplierStatus.supplierStatus === 4">开店申请中</span>
            <span v-if="supplierStatus.supplierStatus === 5">上线待审核</span>
            <span v-if="paySettlementType ===1 && supplierStatus.supplierStatus === 6">上线审核失败</span>
            <span v-if="supplierStatus.supplierStatus === 7">系统下线</span>
          </div>
        </div>
        <!-- 信息 -->
        <div class="basic-info-list">
          <!-- 通联支付下平台开店且审核失败的供应商不可更改基本信息 -->
          <el-form
            ref="shopBasicInfoRef"
            :disabled="paySettlementType===1 && supplierStatus.supplierStatus===6 && !signingInfo.contractStartTime"
            label-width="120px"
            :model="shopBasicInfo"
            :rules="shopBasicInfoRules"
            @submit.prevent
          >
            <div class="basic-info-box">
              <div class="left-info">
                <el-form-item
                  label="供应商名称："
                  prop="supplierName"
                >
                  <p class="txt">
                    <el-input
                      v-model="shopBasicInfo.supplierName"
                      placeholder="请输入10字以内的供应商名称"
                      maxlength="10"
                      style="width: 400px"
                    />
                  </p>
                </el-form-item>
                <el-form-item
                  label="联系人："
                  prop="contactName"
                >
                  <p class="txt">
                    <el-input
                      v-model="shopBasicInfo.contactName"
                      placeholder="请输入常用联系人姓名"
                      maxlength="10"
                      style="width: 400px"
                    />
                  </p>
                </el-form-item>
                <el-form-item
                  label="联系方式："
                  prop="contactPhone"
                >
                  <p class="txt">
                    <el-input
                      v-model="shopBasicInfo.contactPhone"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      placeholder="请输入常用联系人11位手机号码"
                      maxlength="11"
                      style="width: 400px"
                    />
                  </p>
                </el-form-item>
                <el-form-item
                  label="联系邮箱："
                  prop="email"
                >
                  <p class="txt">
                    <el-input
                      v-model.trim="shopBasicInfo.email"
                      placeholder="请输入常用联系邮箱"
                      maxlength="30"
                      style="width: 400px"
                    />
                  </p>
                </el-form-item>

                <el-form-item
                  label="所在地区："
                  prop="currentAddr"
                >
                  <p class="txt">
                    <el-cascader
                      ref="cascaderAddrRef"
                      v-model="shopBasicInfo.currentAddr"
                      style="width: 400px"
                      :options="addrList"
                      :props="addrListTreeProps"
                      placeholder="请选择所在地区"
                      @change="handleAddrChange"
                    />
                  </p>
                </el-form-item>

                <el-form-item
                  label="详细地址："
                  prop="detailAddress"
                >
                  <p class="txt">
                    <el-input
                      v-model="shopBasicInfo.detailAddress"
                      placeholder="请输入50字以内的详细地址"
                      maxlength="50"
                      style="width: 400px"
                    />
                  </p>
                </el-form-item>
              </div>

              <div class="right-info">
                <el-form-item
                  label="店铺简介"
                  prop="intro"
                >
                  <el-input
                    v-model="shopBasicInfo.intro"
                    type="textarea"
                    style="width: 400px"
                    :rows="4"
                    maxlength="200"
                    placeholder="请输入200字以内店铺简介"
                  />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <!-- /基本信息 -->

      <!-- 工商信息 -->
      <div
        v-if="navStatus === 1"
        class="business-info-mod"
      >
        <!-- 开启通联支付后，平台只能修改没有签约日期的审核失败的自营供应商 -->
        <el-form
          ref="companyInfoFormRef"
          :model="companyInfoForm"
          :rules="companyInfoRule"
          label-width="auto"
          :disabled="paySettlementType === 1 && !(supplierStatus.supplierStatus===6 && signingInfo.type===1 && !signingInfo.contractStartTime)"
          @submit.prevent
        >
          <div class="ci-wrapper">
            <div class="left-info">
              <el-form-item
                label="统一社会信用代码"
                prop="creditCode"
              >
                <el-input
                  v-model.trim="companyInfoForm.creditCode"
                  maxlength="20"
                  placeholder="统一社会信用代码"
                />
              </el-form-item>
              <el-form-item
                label="企业名称"
                prop="firmName"
              >
                <el-input
                  v-model="companyInfoForm.firmName"
                  maxlength="50"
                  placeholder="输入50字以内的企业名称"
                />
              </el-form-item>
              <el-form-item
                label="住所"
                prop="residence"
              >
                <el-input
                  v-model="companyInfoForm.residence"
                  maxlength="50"
                  placeholder="输入50字以内的住所"
                />
              </el-form-item>
              <el-form-item
                label="法定代表人"
                prop="representative"
              >
                <el-input
                  v-model="companyInfoForm.representative"
                  prop="representative"
                  maxlength="20"
                  placeholder="输入20字以内的法定代表人"
                />
              </el-form-item>
              <el-form-item
                v-if="paySettlementType===1"
                label="法人身份证号"
                prop="legalIds"
              >
                <el-input
                  v-model="companyInfoForm.legalIds"
                  maxlength="18"
                  placeholder="输入法人身份证号"
                />
              </el-form-item>
              <el-form-item
                v-if="paySettlementType===1"
                label="法人手机号"
                prop="legalPhone"
              >
                <el-input
                  v-model="companyInfoForm.legalPhone"
                  maxlength="11"
                  placeholder="输入法人手机号"
                  @input="(val)=>{companyInfoForm.legalPhone=val.replace(/[^\d]/g,'')}"
                />
              </el-form-item>
              <el-form-item
                label="注册资本"
                class="capital-int"
                prop="capital"
              >
                <el-input
                  v-model="companyInfoForm.capital"
                  style="width:200px"
                  @input="changeNum"
                  @keydown="channelInputLimit"
                />
                <span class="price-unit-text">万元</span>
              </el-form-item>
              <el-form-item
                label="成立日期"
                prop="foundTime"
              >
                <el-date-picker
                  v-model="companyInfoForm.foundTime"
                  style="width:200px"
                  type="date"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
              <el-form-item
                label="营业期限"
                prop="startTime"
              >
                <div style="display: flex">
                  <el-date-picker
                    v-model="companyInfoForm.startTime"
                    style="width:170px;"
                    type="date"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="开始日期"
                    :clearable="false"
                  />
                  <span style="margin: 0 10px">-</span>
                  <span class="end-time">
                    <el-date-picker
                      ref="endTimeRef"
                      v-model="companyInfoForm.endTime"
                      style="width:170px;"
                      type="date"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      :placeholder="endTimeFlag && !companyInfoForm.endTime ? '' : '结束日期'"
                      clearable
                      @change="endTimeFlag = false"
                      @focus="endTimeFlag = false"
                    />
                    <span
                      v-if="endTimeFlag && !companyInfoForm.endTime"
                      class="text"
                      @click="focusEndTime"
                    >
                      无固定期限
                    </span>
                  </span>
                </div>
              </el-form-item>
              <el-form-item
                label="经营范围"
                prop="businessScope"
                style="margin-bottom:30px;"
              >
                <el-input
                  v-model="companyInfoForm.businessScope"
                  type="textarea"
                  resize="none"
                  :rows="4"
                  placeholder="请输入500字以内经营范围"
                  maxlength="500"
                />
              </el-form-item>
            </div>
            <div class="right-info">
              <el-form-item
                label="营业执照电子版"
                prop="businessLicense"
              >
                <div class="business-license-box">
                  <div class="license-content">
                    <img-upload v-model="companyInfoForm.businessLicense" />
                    <div class="example-box">
                      <img
                        src="@/assets/example-img/Business-license.png"
                        alt
                      >
                      <div class="tips">
                        示例
                      </div>
                    </div>
                  </div>
                  <div class="upload-tips">
                    仅限jpg、gif、png，仅限上传1张
                  </div>
                </div>
              </el-form-item>
              <div class="id-box">
                <div class="upload-content">
                  <div class="upload-img">
                    <el-form-item
                      label="法人身份证"
                      prop="identityCardFront"
                    >
                      <img-upload v-model="companyInfoForm.identityCardFront" />
                    </el-form-item>
                    <el-form-item
                      label-width="0"
                      prop="identityCardLater"
                    >
                      <img-upload v-model="companyInfoForm.identityCardLater" />
                    </el-form-item>
                  </div>
                  <div class="upload-example">
                    <div class="example-box">
                      <img
                        src="@/assets/example-img/idcard1.png"
                        alt
                      >
                      <div class="tips">
                        人像面示例
                      </div>
                    </div>
                    <div class="example-box">
                      <img
                        src="@/assets/example-img/idcard2.png"
                        alt
                      >
                      <div class="tips">
                        国徽面示例
                      </div>
                    </div>
                  </div>
                  <div class="upload-tips">
                    请上传身份证正反面照片，仅限jpg、gif、png，仅限上传2张
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <!-- /工商信息 -->

      <!-- 签约信息 -->
      <div
        v-if="navStatus === 2"
        class="contract-info table-box"
      >
        <!-- 签约类目 -->
        <div class="s-category-item s-item">
          <div class="table-data-title">
            <div class="text">
              <span class="stress">*</span>签约类目
            </div>
            <div class="tips">
              已签约
              <span class="txt-bold">{{ signCategoryList.length }}</span>
              个类目 最多可签约
              <span class="txt-bold">200</span>
              个类目
            </div>
            <div
              v-if="paySettlementType!==1||(paySettlementType===1&&!(supplierStatus.supplierStatus===6 && !signingInfo.contractStartTime))"
              class="edit-btn"
              @click="cateAddOrUpdateHandle(0)"
            >
              编辑签约类目
            </div>
          </div>
          <div class="si-content">
            <el-table
              :data="signCategoryList"
              :header-cell-style="{height:'50px',background:'#f7f8fa',color:'#000','font-weight': '600'}"
            >
              <!-- height="306" -->
              <el-table-column
                prop="name"
                label="类目"
                align="center"
              />
              <el-table-column
                prop="parentName"
                label="上级类目"
                align="center"
              />
              <el-table-column
                prop="platformRate"
                label="平台扣率"
                align="center"
              >
                <template #default="{ row }">
                  <span>{{ row.platformRate }} %</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="customizeRate"
                label="自定义类目扣率"
                align="center"
              >
                <template #default="{ row }">
                  <span v-if="row.customizeRate || row.customizeRate === 0">{{ row.customizeRate }} %</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="qualifications"
                label="经营资质"
                align="center"
              >
                <template #default="scope">
                  <div
                    v-if="scope.row.imgs.length"
                    class="img-box"
                  >
                    <el-image
                      v-for="(img,index) in scope.row.imgs"
                      :key="index"
                      class="tab-img"
                      :src="checkFileUrl(img)"
                      preview-teleported
                      :preview-src-list="[checkFileUrl(img)]"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                          alt
                        >
                      </template>
                    </el-image>
                  </div>
                  <span v-if="!scope.row.imgs.length">--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="categoryStatus"
                label="状态"
                width="80"
              >
                <template #default="scope">
                  <div
                    v-if="scope.row.categoryStatus === 1"
                    class="tag-txt"
                  >
                    正常
                  </div>
                  <div
                    v-if="scope.row.categoryStatus === 0"
                    class="tag-txt red-tag-txt"
                  >
                    下架
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 签约品牌 -->
        <div class="s-brand-item s-item">
          <div class="table-data-title">
            <div class="text">
              签约品牌
            </div>
            <div class="tips">
              已签约
              <span class="txt-bold">{{ signedBrands.length }}</span>
              个品牌，最多可签约
              <span class="txt-bold">50</span>
              个品牌
            </div>
            <div
              v-if="paySettlementType!==1||(paySettlementType===1&&!(supplierStatus.supplierStatus===6 && !signingInfo.contractStartTime))"
              class="edit-btn"
              @click="cateAddOrUpdateHandle(1)"
            >
              编辑签约品牌
            </div>
          </div>
          <div class="si-content">
            <el-table
              :data="signedBrands"
              :header-cell-style="{height:'50px',background:'#f7f8fa',color:'#000','font-weight': '600'}"
            >
              <!-- height="284" -->
              <el-table-column
                prop="name"
                label="品牌名称"
                align="center"
              />
              <el-table-column
                prop="firstLetter"
                label="检索首字母"
                align="center"
              />
              <el-table-column
                prop="parentName"
                label="上级类目"
              />
              <el-table-column
                prop="platformRate"
                label="品牌logo"
                align="center"
              >
                <template #default="scope">
                  <div class="img-box">
                    <el-image
                      v-if="scope.row.imgUrl"
                      class="tab-img"
                      :src="checkFileUrl(scope.row.imgUrl)"
                      preview-teleported
                      :preview-src-list="[checkFileUrl(scope.row.imgUrl)]"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                          alt
                        >
                      </template>
                    </el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="imgs"
                label="授权文件"
                align="center"
              >
                <template #default="scope">
                  <div
                    v-if="scope.row.imgs.length"
                    class="img-box"
                  >
                    <el-image
                      v-for="(img,index) in scope.row.imgs"
                      :key="index"
                      class="tab-img"
                      :src="checkFileUrl(img)"
                      preview-teleported
                      :preview-src-list="[checkFileUrl(img)]"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                          alt
                        >
                      </template>
                    </el-image>
                  </div>
                  <span v-if="!scope.row.imgs.length">--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="brandStatus"
                label="状态"
                width="80"
              >
                <template #default="scope">
                  <div
                    v-if="scope.row.brandStatus === 1"
                    class="tag-txt"
                  >
                    正常
                  </div>
                  <div
                    v-if="scope.row.brandStatus === 0"
                    class="tag-txt red-tag-txt"
                  >
                    下架
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 签约有效期 -->
        <div
          v-if="paySettlementType!==1"
          class="s-brand-item s-item"
        >
          <div class="table-data-title">
            <div class="text">
              <span class="stress">*</span>签约有效期
            </div>
            <div class="tips">
              供应商店铺有效期
            </div>
          </div>
          <div class="si-content">
            <div class="contract-time-box">
              <el-date-picker
                v-model="signingInfo.contractStartTime"
                style="width:170px;"
                type="date"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="开始日期"
                :clearable="false"
              />
              <span style="margin: 0 10px">-</span>
              <span class="end-time">
                <el-date-picker
                  ref="endTimeRef"
                  v-model="signingInfo.contractEndTime"
                  style="width:170px;"
                  type="date"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="endTimeFlag &&signingInfo.contractStartTime&& !signingInfo.contractEndTime ? '' : '结束日期'"
                  clearable
                  @change="endTimeFlag = false"
                  @focus="endTimeFlag = false"
                  @blur="onEndTimePickerBlur"
                />
                <span
                  v-if="endTimeFlag &&signingInfo.contractStartTime&& !signingInfo.contractEndTime"
                  class="text"
                  @click="focusEndTime"
                >
                  无固定期限
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- /签约信息 -->

      <!-- 财务信息 -->
      <div
        v-if="navStatus === 3"
        class="financial-info"
      >
        <!-- <div class="tips">
          <p class="tit"><span class="asterisk">*</span>结算日：</p>
          <p class="txt week">已添加3个结算日，最多可添加5个结算日</p>
        </div>
        <div class="tips">
          <p class="tit">每月：</p>
          <p class="txt">
            <span class="date-block">5</span>
            <span class="date-block">15</span>
            <span class="date-block">25</span>
            日
          </p>
          <p class="txt week">
            当月不包含所设日期时，将会顺延到下一个结算日
          </p>
        </div> -->
        <div class="table-data-title">
          <div class="text">
            <span class="stress">*</span>结算银行账户：
          </div>
          <div
            v-if="paySettlementType!==1"
            class="tips"
          >
            已添加
            <span class="txt-bold">{{ settlementAccounts.length }}</span>
            个结算账户，最多可添加
            <span class="txt-bold">5</span>
            个结算账户
          </div>
          <div
            v-if="paySettlementType===1 && supplierStatus.supplierStatus!==6"
            class="tips"
          >
            已添加
            <span class="txt-bold">{{ settlementAccounts.length }}</span>
            个结算账户，最多可添加
            <span class="txt-bold">10</span>
            个结算账户
            <span>
              ，
              <span class="txt-bold">1</span>
              个法人账户
            </span>
          </div>
          <div
            v-else-if="paySettlementType===1 "
            class="tips"
          >
            请添加1个对公账户
          </div>
        </div>
        <div class="table-box">
          <el-table
            v-if="supplierStatus.supplierStatus!==6 && paySettlementType===1 || paySettlementType!==1"
            :data="settlementAccounts"
            style="width: 100%"
            header-cell-class-name="table-header"
          >
            <el-table-column
              prop="bankName"
              label="银行"
            />
            <el-table-column
              align="left"
              prop="recipientName"
              :min-width="paySettlementType===1?'130':null"
              label="账户名"
            >
              <template #default="scope">
                <div class="recipient-name">
                  <span>{{ scope.row.recipientName }}</span>
                  <div
                    v-if="paySettlementType===1&&scope.row.bankCardPro===0"
                    class="tip"
                  >
                    法人账户
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :prop="paySettlementType===1?'bankCardNo':'cardNo'"
              min-width="150"
              label="账号"
            />
            <el-table-column
              prop="branchName"
              label="银行开户行"
            />
            <el-table-column
              prop="isDefault"
              label="主账号"
            >
              <template #default="scope">
                {{ scope.row.isDefault ? '是' : '否' }}
              </template>
            </el-table-column>
          </el-table>
          <!-- 通联支付开启且平台开店审核失败则需要重新提交 -->
          <el-form
            v-if="supplierStatus.supplierStatus===6 && paySettlementType===1"
            ref="bankCartInfoFormRef"
            :model="bankCartInfoForm"
            :rules="bankCartInfoForm.rule"
            @submit.prevent
          >
            <el-table
              ref="bankTableRef"
              class="add-bank-info-table"
              :data="bankCartInfoForm.data"
              :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                width="80"
              />
              <el-table-column
                prop="parentBankName"
                label="银行名称"
              >
                <template #default="scope">
                  <el-form-item
                    :prop="'data.' + scope.$index + '.parentBankName'"
                    :rules="bankCartInfoForm.rule.parentBankName"
                  >
                    <el-select
                      v-model="selectBank"
                      filterable
                      placeholder="请选择"
                      style="width:200px"
                      @change="changeBank"
                    >
                      <el-option
                        v-for="item in bankList"
                        :key="item.bankId"
                        :label="item.bankName"
                        :value="item.bankName"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="bankName"
                label="开户分行名称"
              >
                <template #default="scope">
                  <el-form-item
                    :prop="'data.' + scope.$index + '.bankName'"
                    :rules="bankCartInfoForm.rule.bankName"
                  >
                    <el-input
                      v-model="scope.row.bankName"
                      maxlength="20"
                      placeholder="例如：南京市雨花区雨花支行"
                      style="width:200px"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="accountNo"
                label="企业对公账户"
              >
                <template #default="scope">
                  <el-form-item
                    :prop="'data.' + scope.$index + '.accountNo'"
                    :rules="bankCartInfoForm.rule.accountNo"
                  >
                    <el-input
                      v-model.trim="scope.row.accountNo"
                      maxlength="19"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      placeholder="请输入企业对公账户"
                      style="width:200px"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="unionBank"
                label="支付行号"
              >
                <template #default="scope">
                  <el-form-item
                    :prop="'data.' + scope.$index + '.unionBank'"
                    :rules="bankCartInfoForm.rule.unionBank"
                  >
                    <el-input
                      v-model="scope.row.unionBank"
                      placeholder="请输入12位的支付行号"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      maxlength="12"
                      style="width:200px"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <!-- 通联支付开启时没有签约时间的自营店铺开店审核失败则需要重新提交 -->
          <div
            v-if="paySettlementType === 1 && supplierStatus.supplierStatus===6 && signingInfo.type===1 && !signingInfo.contractStartTime"
            class="footer"
          >
            <div class="foot-box">
              <div
                class="btn"
                @click="toNextStep"
              >
                提交
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /财务信息 -->
    </div>

    <!-- 脚部 -->
    <!--
      财务信息任何情况下都不显示保存（通联支付开启审核失败的自营店铺，且没有签约时间的情况下财务信息显示上面的提交按钮）
      当通联支付未开启显示保存
      通联支付开启时
        审核失败的没有签约时间的自营店铺，工商信息显示保存
        除审核失败且没有签约时间的店铺，基本信息和签约信息都显示保存
     -->
    <div
      v-if="navStatus !== 3 && (paySettlementType !== 1 || (paySettlementType === 1 && (navStatus !== 1 || (navStatus===1 && supplierStatus.supplierStatus===6 && signingInfo.type===1 && !signingInfo.contractStartTime)) && ((navStatus===0 || navStatus===2)&&!(supplierStatus.supplierStatus===6&&!signingInfo.contractStartTime) || !(navStatus===0 || navStatus===2))))"
      class="footer"
      style="z-index: 8;"
    >
      <div class="foot-box">
        <div
          class="btn"
          @click="updateShopApplyInfo"
        >
          保存
        </div>
      </div>
    </div>

    <category-add-or-update
      v-if="cateAddOrUpdateVisible"
      ref="cateAddOrUpdateRef"
      @close-popup="closePopup"
    />
    <brand-add-or-update
      v-if="brandAddOrUpdateVisible"
      ref="brandAddOrUpdateRef"
      @close-popup="closePopup"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/platform/audit-supplier'
import * as addrApi from '@/api/delivery/transport'
import { treeDataTranslate } from '@/utils'
import { isMobile, isEmail, isCreditCode, validNoEmptySpace, checkIDCard } from '@/utils/validate'
import categoryAddOrUpdate from './components/category-add-or-update/index.vue'
import BrandAddOrUpdate from './components/brand-add-or-update/index.vue'
import moment from 'moment'
import { ElMessage } from 'element-plus'

const allinPayStore = useAllinpayStore()
const paySettlementType = allinPayStore.paySettlementType // 是否开启通联支付 1：开启 0：关闭
const router = useRouter()
const route = useRoute()
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const supplierId = ref(route.query.supplierId || 0)
const navStatus = ref(0)
const cateAddOrUpdateRef = ref(null)
const brandAddOrUpdateRef = ref(null)

// 店铺审核状态
const shopAuditStatus = ref({})
// 店铺状态
const supplierStatus = ref({})

// 店铺基本信息
const shopBasicInfo = ref({})

// eslint-disable-next-line no-unused-vars
const validateMobile = (rule, value, callback) => {
  if (!isMobile(value)) {
    callback(new Error('请输入正确的联系方式'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateEmail = (rule, value, callback) => {
  if (!isEmail(value) || value.indexOf(' ') !== -1) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const vaildCreditCode = (rule, value, callback) => {
  if (!isCreditCode(value)) {
    callback(new Error('请输入正确的统一社会信用代码'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateNotEmpty = (role, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('输入值不能全为空格'))
  } else {
    callback()
  }
}

// 店铺工商信息
const companyInfoForm = ref({
  creditCode: '',
  firmName: '',
  residence: '',
  representative: '',
  capital: '',
  foundTime: '',
  startTime: '',
  endTime: '',
  businessScope: '',
  businessLicense: '',
  identityCardFront: '',
  identityCardLater: '',
  legalIds: '',
  legalPhone: ''
})
// eslint-disable-next-line no-unused-vars
const validateNotEmptyRep = (role, value, callback) => {
  companyInfoForm.value.representative = companyInfoForm.value.representative.trim()
  if (companyInfoForm.value.representative === '' || companyInfoForm.value.representative.indexOf(' ') !== -1) {
    callback(new Error('法定代表人不能有空格'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validIDCard = (rule, value, callback) => {
  if (!value || !checkIDCard(value)) {
    callback(new Error('请输入正确的法人身份证'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validMobile = (rule, value, callback) => {
  if (!value || !isMobile(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const shopBasicInfoRules = reactive({
  supplierName: [
    { required: true, message: '供应商名称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '供应商名称长度在2-10个字符之间', trigger: 'blur' },
    { validator: validateNotEmpty, trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: '联系人不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '联系人长度在2-10个字符之间', trigger: 'blur' },
    { validator: validateNotEmpty, trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请填写联系方式', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '联系邮箱不能为空', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  currentAddr: [
    { required: true, message: '请选择所在地区', trigger: ['blur', 'change'] }
  ],
  detailAddress: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { validator: validateNotEmpty, trigger: 'blur' }
  ],
  supplierLogo: [
    { required: true, message: '请上传店铺logo', trigger: 'change' }
  ],
  mobileBackgroundPic: [
    { required: true, message: '请上传移动端背景图', trigger: 'change' }
  ],
  pcBackgroundPic: [
    { required: true, message: '请上传PC端背景图', trigger: 'change' }
  ],
  intro: [
    { validator: validateNotEmpty, trigger: 'blur' }
  ]
})
// 省市区
const addrList = ref([])
const addrListTreeProps = reactive({
  value: 'areaId',
  label: 'areaName'
})

const endTimeFlag = ref(true)
// 店铺签约信息
const signingInfo = reactive({
  contractStartTime: '', // 签约起始时间
  contractEndTime: '', // 签约终止时间
  type: '' // 店铺类型 1自营店 2普通店
})
const pickerOptions = reactive({
  disabledDate (time) {
    const date = moment().add(0, 'days').startOf('days')
    return (
      time.getTime() >= date.valueOf()
    )
  }
})
const valiStartTime = (rule, value, callback) => {
  if (companyInfoForm.value.endTime && new Date(companyInfoForm.value.startTime).getTime() >= new Date(companyInfoForm.value.endTime).getTime()) {
    callback(new Error('营业起始日期不能大于营业终止时间'))
  } else {
    callback()
  }
}
const companyInfoRule = reactive({
  creditCode: [
    { required: true, message: '请填写统一社会信用代码', trigger: 'blur' },
    { validator: vaildCreditCode, trigger: 'blur' }
  ],
  firmName: [
    { required: true, message: '企业名称不能为空', trigger: 'blur' },
    { validator: validateNotEmpty, trigger: 'blur' }
  ],
  residence: [
    { validator: validateNotEmpty, trigger: 'blur' }
  ],
  businessScope: [
    { required: true, message: '经营范围不能为空', trigger: 'blur' },
    { validator: validateNotEmpty, trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始日期不能为空', trigger: 'change' },
    { validator: valiStartTime, trigger: 'change' }
  ],
  businessLicense: [
    { required: true, message: '营业执照需要上传', trigger: 'change' }
  ],
  representative: [
    { required: true, message: '法定代表人不能为空', trigger: 'blur' },
    { validator: validateNotEmptyRep, trigger: 'blur' }
  ],
  legalIds: [
    { required: true, message: '法人身份证不能为空', trigger: 'blur' },
    { validator: validIDCard, trigger: 'blur' }
  ],
  legalPhone: [
    { required: true, message: '法人手机号不能为空', trigger: 'blur' },
    { validator: validMobile, trigger: 'blur' }
  ],
  identityCardFront: [
    { required: true, message: '上传法人身份证人像面', trigger: 'change' }
  ],
  identityCardLater: [
    { required: true, message: '上传法人身份证国徽面', trigger: 'change' }
  ]
})

// 店铺分类签约信息
const signCategoryList = ref([])
// 平台品牌签约信息
const signedBrands = ref([]) // 平台品牌+自定义品牌
// 自增签约品牌信息
const cateAddOrUpdateVisible = ref(false)
const brandAddOrUpdateVisible = ref(false)

// 店铺财务信息
const settlementAccounts = ref([])
const bankCartInfoForm = reactive({
  data: [
    {
      bankName: '',
      recipientName: '',
      cardNo: '',
      branchName: '',
      accountNo: '', // 企业对公账户
      parentBankName: '', // 开户银行名称
      unionBank: '', // 支付行号 12位数字
      bankCardPro: 1 // 银行卡属性 0法人 1企业对公
    }
  ],
  rule: {
    bankName: [
      { required: true, message: '请填写开户支行名称', trigger: 'blur' },
      { min: 2, max: 20, message: '开户支行名称长度在2到20个字符', trigger: 'blur' },
      { validator: validateNotEmpty, trigger: 'blur' }
    ],
    cardNo: [
      { required: true, message: '账号不能为空', trigger: 'blur' },
      { validator: validateNotEmpty, trigger: 'blur' }
    ],
    branchName: [
      { required: true, message: '支行名称不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '支行名称长度在2到20个字符', trigger: 'blur' },
      { validator: validateNotEmpty, trigger: 'blur' }
    ],
    accountNo: [
      { required: true, message: '请填写企业对公账户', trigger: 'blur' }
    ],
    parentBankName: [
      { required: true, message: '请填写开户银行名称', trigger: 'change' }
    ],
    unionBank: [
      { required: true, message: '请填写支付行号', trigger: 'blur' },
      { min: 12, max: 12, message: '请填写正确的支付行号', trigger: 'blur' }
    ]
  }
})
const selectBank = ref('') // 选择的银行，通联
const bankList = ref([]) // 银行列表，通联
const submit = ref(false)
const statusRemarks = ref('')

onMounted(() => {
  // 查询基本信息
  switchNav(0)
  getAddrList()
  // 店铺审核状态
  queryShopAuditStatus()
})

const switchNav = (value) => {
  navStatus.value = value
  if (value === 1) {
    // 查询工商信息
    queryShopBusinessInfo()
  } else if (value === 2) {
    // 查询分类签约信息
    getSignCategoryList()
    // 查询品牌签约信息
    getSignBrandList()
  } else if (value === 3) {
    // 查询财务信息
    queryShopFinancialInfo()
  } else {
    // 查询基本信息
    queryShopBasicInfo()
  }
}

/**
 * 店铺审核状态
 */
const queryShopAuditStatus = () => {
  api.getShopAuditStatus(supplierId.value).then(data => {
    shopAuditStatus.value = data
    supplierStatus.value = data.supplierDetail
    if (supplierStatus.value.supplierStatus === 6 && paySettlementType === 1) {
      statusRemarks.value = data.remarks || ''
      getBankList()
    }
  })
}

/**
 * 查询基本信息
 */
const queryShopBasicInfo = () => {
  api.getManageDetail({ supplierId: supplierId.value }).then(data => {
    shopBasicInfo.value = data
    signingInfo.type = data.type
    signingInfo.contractStartTime = data.contractStartTime
    signingInfo.contractEndTime = data.contractEndTime
    shopBasicInfo.value.currentAddr = [
      data.provinceId,
      data.cityId,
      data.areaId
    ]
  })
}

/**
 * 省市区
 */
const getAddrList = () => {
  addrApi.listAreaOfEnable({}).then(data => {
    addrList.value = treeDataTranslate(data, 'areaId', 'parentId')
  })
}
const cascaderAddrRef = ref(null)
/**
 * 监听地址改变
 */
const handleAddrChange = (value) => {
  if (value.length > 0) {
    const labels = cascaderAddrRef.value.getCheckedNodes()[0].pathLabels
    shopBasicInfo.value.province = labels[0]
    shopBasicInfo.value.provinceId = value[0]
    shopBasicInfo.value.city = labels[1]
    shopBasicInfo.value.cityId = value[1]
    shopBasicInfo.value.area = labels[2]
    shopBasicInfo.value.areaId = value[2]
  }
}

/**
 * 查询工商信息
 */
const queryShopBusinessInfo = () => {
  api.queryBusinessInfo({ supplierId: supplierId.value }).then(data => {
    companyInfoForm.value = data
    endTimeFlag.value = true
  })
}
const endTimeRef = ref(null)
const focusEndTime = () => {
  endTimeRef.value?.focus()
}
const onEndTimePickerBlur = () => {
  if (!signingInfo.contractEndTime) {
    endTimeFlag.value = true
  }
}

// 限制长度
const changeNum = () => {
  if (companyInfoForm.value.capital < 1) {
    companyInfoForm.value.capital = ''
  }
  if (companyInfoForm.value.capital.length > 8) {
    companyInfoForm.value.capital = companyInfoForm.value.capital.slice(0, 8)
  }
}
const channelInputLimit = (e) => {
  const key = e.key
  // 不允许输入'-'
  if (key === '-' || key === '+') {
    e.returnValue = false
    return false
  }
  return true
}

/**
 * 签约类目列表
 */
const getSignCategoryList = () => {
  api.queryCategoryContract({ shopId: supplierId.value, sysType: 3 }).then((data) => {
    if (data) {
      signCategoryList.value = data
      signCategoryList.value.forEach(item => {
        item.imgs = item.qualifications ? item.qualifications.split(',') : []
      })
    }
  })
}
/**
 * 获取签约品牌列表
 */
const getSignBrandList = () => {
  api.queryBrandSigning({ shopId: supplierId.value, sysType: 3 }).then(data => {
    data.platformBrandList.forEach((item) => {
      let parentName = ''
      if (item.categories) {
        parentName = `${item.categories[0].categories[0].name}>${item.categories[0].categories[1].name}>${item.categories[0].name}`
      }
      item.parentName = parentName
    })
    signedBrands.value = data.platformBrandList
    signedBrands.value.forEach(el => {
      el.imgs = el.qualifications ? el.qualifications.split(',') : []
    })
  })
}
/**
 * 编辑签约信息弹窗
 * @param {Number} type 签约类型 0:类别 1:品牌
 */
const cateAddOrUpdateHandle = (type) => {
  if (type === 0) {
    cateAddOrUpdateVisible.value = true
    nextTick(() => {
      cateAddOrUpdateRef.value?.init(supplierId.value, signCategoryList.value)
    })
  } else if (type === 1) {
    brandAddOrUpdateVisible.value = true
    nextTick(() => {
      brandAddOrUpdateRef.value?.init(supplierId.value)
    })
  }
}

/**
 * 关闭弹窗
 */
const closePopup = (val) => {
  if (val === 'category') {
    cateAddOrUpdateVisible.value = false
    getSignCategoryList()
  } else if (val === 'brand') {
    brandAddOrUpdateVisible.value = false
    getSignBrandList()
  }
}

/**
 * 查询财务信息
 */
const queryShopFinancialInfo = () => {
  api.queryFinancialInfo({ supplierId: supplierId.value }).then(data => {
    settlementAccounts.value = data
    if (supplierStatus.value.supplierStatus === 6) {
      bankCartInfoForm.data = [{
        ...data[0],
        parentBankName: data[0].bankName,
        bankName: data[0].branchName,
        accountNo: data[0].bankCardNo
      }]
      selectBank.value = data[0].bankName
    }
  })
}

const shopBasicInfoRef = ref(null)
const companyInfoFormRef = ref(null)
/**
 * 更新店铺申请信息
 */
const updateShopApplyInfo = () => {
  if (navStatus.value === 0) {
    // 基本信息
    shopBasicInfoRef.value?.validate((valid) => {
      if (!valid) {
        return
      }
      updateShopBasicInfo()
    })
    return
  }
  if (navStatus.value === 1) {
    // 工商信息
    companyInfoFormRef.value?.validate((valid) => {
      if (!valid) {
        return
      }
      updateCompanyInfo()
    })
    return
  }
  if (navStatus.value === 2) {
    updateSigningInfo()
  }
}

// 更新基本信息
const updateShopBasicInfo = () => {
  api.updateBasicInfo(shopBasicInfo.value).then(() => {
    ElMessage({
      message: '基本信息更新成功！',
      type: 'success',
      duration: 1000
    })
    queryShopBasicInfo()
  })
}

/**
 * 储存工商信息
 */
const updateCompanyInfo = () => {
  companyInfoForm.value.supplierId = supplierId.value
  api.updateCompanyInfo(companyInfoForm.value).then(() => {
    ElMessage({
      message: '工商信息更新成功！',
      type: 'success',
      duration: 1000
    })
    queryShopBusinessInfo()
    queryShopAuditStatus()
  })
}

/**
 * 更新签约信息
 */
const updateSigningInfo = () => {
  if (signingInfo.contractEndTime && new Date(signingInfo.contractStartTime).getTime() > new Date(signingInfo.contractEndTime).getTime()) {
    ElMessage({
      message: '签约结束时间不能在签约开始时间之前',
      type: 'error',
      duration: 1000
    })
    return
  }
  signingInfo.supplierId = supplierId.value
  api.updateSigningInfo(signingInfo).then(() => {
    ElMessage({
      message: '签约信息更新成功',
      type: 'success',
      duration: 1000
    })
    // 更新签约信息成功后，需要更新店铺基本信息，因为店铺状态有可能发生改变
    queryShopBasicInfo()
  })
}
// 获取可选银行名称列表（通联）
const getBankList = () => {
  api.getBankList().then(data => {
    bankList.value = data
  })
}

const changeBank = (value) => {
  bankCartInfoForm.data[0].parentBankName = value
}

const bankCartInfoFormRef = ref(null)
const toNextStep = () => {
  bankCartInfoFormRef.value?.validate((valid) => {
    if (valid) {
      if (submit.value) {
        return
      }
      submit.value = true
      const data = {
        ...bankCartInfoForm.data[0],
        supplierId: supplierId.value
      }
      const req = api.reSubmitAudit(data)
      req.then(() => {
        ElMessage({
          message: '提交成功！',
          type: 'success',
          duration: 1500,
          onClose: () => {
            router.push('/platform/supplier-manage')
          }
        })
      }).finally(() => {
        submit.value = false
      })
    }
  })
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
