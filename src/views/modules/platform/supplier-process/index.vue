<template>
  <div class="shop-process-container">
    <div class="sp-wrapper">
      <div
        v-if="applyStep > 0"
        class="info-frame"
      >
        <div class="sbi-title title">
          创建供应商
        </div>

        <div class="sbi-content content">
          <!-- 步骤 -->
          <div class="progress-bar">
            <div
              class="first-step step"
              :class="{'active-step':applyStep>0}"
            >
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">
                    1
                  </div>
                  <div class="step-text">
                    基本信息
                  </div>
                </div>
              </div>
            </div>
            <div
              class="second-step step"
              :class="{'active-step':applyStep>1}"
            >
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">
                    2
                  </div>
                  <div class="step-text">
                    工商信息
                  </div>
                </div>
              </div>
            </div>
            <div
              class="third-step step"
              :class="{'active-step':applyStep>2}"
            >
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">
                    3
                  </div>
                  <div class="step-text">
                    签约信息
                  </div>
                </div>
              </div>
            </div>
            <div
              class="fourth-step step"
              :class="{'active-step':applyStep>3}"
            >
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">
                    4
                  </div>
                  <div class="step-text">
                    财务信息
                  </div>
                </div>
              </div>
            </div>
            <div
              class="fourth-step step"
              :class="{'active-step':applyStep>4}"
            >
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">
                    5
                  </div>
                  <div class="step-text">
                    注册信息
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 第一步 基本信息 -->
          <div
            v-if="applyStep === 1"
            class="shop-base-info"
          >
            <div class="company-info">
              <!-- native modifier has been removed, please confirm whether the function has been affected  -->
              <el-form
                ref="supplierDetailRef"
                :model="supplierDetail"
                :rules="shopDetailRule"
                class="base-info"
                label-width="100px"
                @submit.prevent
              >
                <div class="ci-wrapper">
                  <div class="left-info">
                    <el-form-item
                      label="供应商名称"
                      prop="supplierName"
                    >
                      <el-input
                        v-model="supplierDetail.supplierName"
                        placeholder="请输入10字以内的供应商名称"
                        maxlength="10"
                      />
                    </el-form-item>
                    <el-form-item
                      label="联系人"
                      prop="contactName"
                    >
                      <el-input
                        v-model="supplierDetail.contactName"
                        placeholder="请输入常用联系人姓名"
                        maxlength="10"
                      />
                    </el-form-item>
                    <el-form-item
                      label="联系方式"
                      prop="contactPhone"
                    >
                      <el-input
                        v-model="supplierDetail.contactPhone"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        placeholder="请输入11位手机号码"
                        maxlength="11"
                      />
                    </el-form-item>
                    <el-form-item
                      label="联系邮箱"
                      prop="email"
                    >
                      <el-input
                        v-model.trim="supplierDetail.email"
                        placeholder="请输入常用联系邮箱"
                        maxlength="30"
                      />
                    </el-form-item>
                    <el-form-item
                      label="所在地区"
                      prop="currentAddr"
                    >
                      <el-cascader
                        ref="cascaderAddrRef"
                        v-model="supplierDetail.currentAddr"
                        :options="addrList"
                        :props="addrListTreeProps"
                        style="width:100%"
                        placeholder="请选择所在地区"
                        @change="handleAddrChange"
                      />
                    </el-form-item>
                    <el-form-item
                      label="详细地址"
                      prop="detailAddress"
                    >
                      <el-input
                        v-model="supplierDetail.detailAddress"
                        placeholder="请输入50字以内的详细地址"
                        maxlength="50"
                      />
                    </el-form-item>
                  </div>
                  <div class="right-info">
                    <el-form-item
                      label="供应商简介"
                      prop="intro"
                    >
                      <div class="business-license-box">
                        <div class="license-content">
                          <el-input
                            v-model="supplierDetail.intro"
                            type="textarea"
                            :rows="4"
                            maxlength="200"
                            placeholder="请输入200字以内供应商简介"
                          />
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
          </div>

          <!-- 第二步 工商信息 -->
          <div
            v-if="applyStep === 2"
            class="company-info"
          >
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-form
              ref="supplierCompanyRef"
              :model="supplierCompany"
              :rules="shopCompanyRule"
              label-width="auto"
              @submit.prevent
            >
              <div class="ci-wrapper">
                <div class="left-info">
                  <el-form-item
                    label="统一社会信用代码"
                    prop="creditCode"
                  >
                    <el-input
                      v-model.trim="supplierCompany.creditCode"
                      maxlength="20"
                      placeholder="统一社会信用代码"
                    />
                  </el-form-item>
                  <el-form-item
                    label="企业名称"
                    prop="firmName"
                  >
                    <el-input
                      v-model="supplierCompany.firmName"
                      maxlength="50"
                      placeholder="输入50字以内的企业名称"
                    />
                  </el-form-item>
                  <el-form-item
                    label="住所"
                    prop="residence"
                  >
                    <el-input
                      v-model="supplierCompany.residence"
                      maxlength="50"
                      placeholder="输入50字以内的住所"
                    />
                  </el-form-item>
                  <el-form-item
                    label="法定代表人"
                    prop="representative"
                  >
                    <el-input
                      v-model="supplierCompany.representative"
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
                      v-model="supplierCompany.legalIds"
                      maxlength="18"
                      placeholder="输入法人身份证号"
                      :disabled="isNotEdit"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="paySettlementType===1"
                    label="法人手机号"
                    prop="legalPhone"
                  >
                    <el-input
                      v-model="supplierCompany.legalPhone"
                      maxlength="11"
                      placeholder="输入法人手机号"
                      :disabled="isNotEdit"
                      @input="(val)=>{supplierCompany.legalPhone=val.replace(/[^\d]/g,'')}"
                    />
                  </el-form-item>
                  <el-form-item
                    label="注册资本"
                    class="capital-int"
                  >
                    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
                    <el-input
                      v-model="supplierCompany.capital"
                      prop="capital"
                      type="number"
                      maxlength="10"
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
                      v-model="supplierCompany.foundTime"
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
                        v-model="supplierCompany.startTime"
                        style="width:100%; max-width: 191px"
                        type="date"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="开始日期"
                        :clearable="false"
                      />
                      <span style="margin: 0 10px">-</span>
                      <el-date-picker
                        ref="endTimeRef"
                        v-model="supplierCompany.endTime"
                        style="width:100%; max-width: 191px"
                        type="date"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="结束日期"
                        clearable
                      />
                    </div>
                  </el-form-item>
                  <el-form-item
                    label="经营范围"
                    prop="businessScope"
                    style="margin-bottom:30px;"
                  >
                    <el-input
                      v-model="supplierCompany.businessScope"
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
                        <img-upload
                          v-model:value="supplierCompany.businessLicense"
                          @input="imgChange(2, 'businessLicense')"
                        />
                        <div class="example-box">
                          <img src="@/assets/example-img/Business-license.png">
                          <div class="tips">
                            示例
                          </div>
                        </div>
                      </div>
                      <div class="upload-tips">
                        仅限jpg、gif、png、大小不超过2M，仅限上传1张
                      </div>
                    </div>
                  </el-form-item>
                  <div class="id-box">
                    <div class="upload-content">
                      <div class="upload-img">
                        <el-form-item
                          class="idcard"
                          label="法人身份证"
                          prop="identityCardFront"
                        >
                          <img-upload
                            v-model:value="supplierCompany.identityCardFront"
                            @input="imgChange(2, 'identityCardFront')"
                          />
                        </el-form-item>
                        <el-form-item
                          class="idcard"
                          label-width="0"
                          prop="identityCardLater"
                        >
                          <img-upload
                            v-model:value="supplierCompany.identityCardLater"
                            @input="imgChange(2, 'identityCardLater')"
                          />
                        </el-form-item>
                      </div>
                      <div class="upload-example">
                        <div class="example-box">
                          <img src="@/assets/example-img/idcard1.png">
                          <div class="tips">
                            人像面示例
                          </div>
                        </div>
                        <div class="example-box">
                          <img src="@/assets/example-img/idcard2.png">
                          <div class="tips">
                            国徽面示例
                          </div>
                        </div>
                      </div>
                      <div class="upload-tips">
                        请上传身份证正反面照片，仅限jpg、gif、png，大小不超过2M，仅限上传2张
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>

          <!-- 第三步 签约信息 -->
          <div
            v-if="applyStep === 3"
            class="content-wrapper signing-content"
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
              </div>
              <div class="si-content">
                <category-add-or-update
                  ref="cateAddOrUpdateRef"
                  :category-signing-list="signCategoryList"
                  @get-sign-category-list="getSignCategoryList"
                />
              </div>
            </div>
            <!-- 签约品牌 -->
            <div class="s-category-item s-item">
              <div class="table-data-title">
                <div class="text">
                  签约品牌
                </div>
                <div class="tips">
                  已签约
                  <span class="txt-bold">{{ signBrandList.length }}</span>
                  个品牌 最多可签约
                  <span class="txt-bold">50</span>
                  个品牌
                </div>
              </div>
              <div class="si-content">
                <brand-add-or-update
                  ref="brandAddOrUpdateRef"
                  :brand-signing-list="signBrandList"
                  @get-sign-brand-list="getSignBrandList"
                />
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
              </div>
              <div class="si-content">
                <el-date-picker
                  v-model="supplierDetail.contractTimeRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :clearable="false"
                  @change="getContractTimeRange"
                />
              </div>
            </div>
          </div>

          <!-- 第四步 财务信息 -->
          <div
            v-if="applyStep === 4"
            class="content-wrapper finance-info"
          >
            <div
              v-if="paySettlementType!==1"
              class="table-data-title"
            >
              <div class="text">
                <span class="stress">*</span>结算银行账户
              </div>
              <div class="tips">
                已添加
                <span class="txt-bold">{{ bankCartInfoForm.data.length }}</span>
                个结算账户，最多可添加
                <span class="txt-bold">5</span>
                个结算账户，如需修改结算账户请在商家端供应商信息模块操作
              </div>
              <div
                class="edit-btn"
                @click="addBankInfo"
              >
                新增
              </div>
            </div>
            <div
              v-else
              class="table-data-title"
            >
              <div class="text">
                <span class="stress">*</span>结算银行账户
              </div>
              <div class="tips">
                请填写
                <span class="txt-bold">1</span>
                个对公账户
              </div>
            </div>
            <div class="fi-content">
              <!-- 添加图表 -->
              <!-- 审核状态applyStatus 0 未审核 1已通过 -1未通过 -->
              <template v-if="paySettlementType!==1">
                <!-- native modifier has been removed, please confirm whether the function has been affected  -->
                <el-form
                  ref="bankCartInfoFormRef"
                  :model="bankCartInfoForm"
                  :rules="bankCartInfoForm.rule"
                  @submit.prevent
                >
                  <el-table
                    class="add-bank-info-table"
                    :data="bankCartInfoForm.data"
                    :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
                    style="width: 100%"
                  >
                    <el-table-column
                      type="index"
                      label="序号"
                      width="50"
                    />
                    <el-table-column
                      prop="bankName"
                      label="银行名称"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.bankName'"
                          :rules="bankCartInfoForm.rule.bankName"
                        >
                          <el-input
                            v-model="scope.row.bankName"
                            placeholder="输入银行名称"
                            maxlength="20"
                            clearable
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="recipientName"
                      label="账户名"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.recipientName'"
                          :rules="bankCartInfoForm.rule.recipientName"
                        >
                          <el-input
                            v-model="scope.row.recipientName"
                            maxlength="20"
                            placeholder="不超过20个字符"
                            clearable
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="cardNo"
                      label="账号"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.cardNo'"
                          :rules="bankCartInfoForm.rule.cardNo"
                        >
                          <el-input
                            v-model="scope.row.cardNo"
                            maxlength="19"
                            oninput="value=value.replace(/[^\d]/g,'')"
                            placeholder="输入账号"
                            clearable
                          />
                          <!-- <el-input v-model="scope.row.cardNo" maxlength="19" placeholder="不超过19个字符" clearable /> -->
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="branchName"
                      label="支行名称"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.branchName'"
                          :rules="bankCartInfoForm.rule.branchName"
                        >
                          <el-input
                            v-model="scope.row.branchName"
                            placeholder="例如：南京市雨花区雨花支行"
                            maxlength="30"
                            clearable
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column width="50">
                      <template #default="scope">
                        <i
                          v-if="bankCartInfoForm.data.length > 1"
                          class="el-icon-remove-outline"
                          @click="deleteBankInfoItem(scope.$index)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
              </template>
              <template v-else>
                <!-- native modifier has been removed, please confirm whether the function has been affected  -->
                <el-form
                  ref="allinpaySupplierBankCardFormRef"
                  :model="allinpaySupplierBankCardForm"
                  :rules="allinpaySupplierBankCardForm.rule"
                  @submit.prevent
                >
                  <el-table
                    ref="bankTableRef"
                    class="add-bank-info-table"
                    :data="allinpaySupplierBankCardForm.data"
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
                          :rules="allinpaySupplierBankCardForm.rule.parentBankName"
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
                          :rules="allinpaySupplierBankCardForm.rule.bankName"
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
                          :rules="allinpaySupplierBankCardForm.rule.accountNo"
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
                          :rules="allinpaySupplierBankCardForm.rule.unionBank"
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
              </template>
            </div>
          </div>

          <!-- 第五步 注册信息 -->
          <div
            v-if="applyStep === 5"
            class="content-wrapper"
          >
            <div class="register-info">
              <!-- native modifier has been removed, please confirm whether the function has been affected  -->
              <el-form
                ref="supplierUserRegisterInfoRef"
                :model="supplierUserRegisterInfo"
                :rules="shopUserRegisterRule"
                label-width="100px"
                @submit.prevent
              >
                <el-form-item
                  label="用户名"
                  prop="username"
                >
                  <el-input
                    v-model="supplierUserRegisterInfo.username"
                    maxlength="16"
                    placeholder="由4-16位非纯数字的字母、数字或下划线组成"
                  />
                </el-form-item>
                <el-form-item
                  label="登陆密码"
                  prop="password"
                >
                  <el-input
                    v-model="supplierUserRegisterInfo.password"
                    type="password"
                    maxlength="16"
                    placeholder="输入6-16位登录密码"
                    autocomplete="new-password"
                  />
                </el-form-item>
                <el-form-item
                  label="手机号"
                  prop="mobile"
                >
                  <div class="mobile-box">
                    <el-input
                      v-model="supplierUserRegisterInfo.mobile"
                      maxlength="11"
                      placeholder="输入11位手机号"
                    >
                      <template #append>
                        <div
                          class="mobile-btn"
                          @click="getRegisterCode"
                        >
                          {{ showGetCodeBtn ? '获取验证码' : count + ' s' }}
                        </div>
                      </template>
                    </el-input>
                  </div>
                </el-form-item>
                <el-form-item
                  label="验证码"
                  prop="validCode"
                >
                  <el-input
                    v-model="supplierUserRegisterInfo.validCode"
                    class="mobile-int"
                    placeholder="输入验证码"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="footer-box">
            <el-button
              v-if="applyStep !== 1"
              plain
              @click="toPrevStep"
            >
              上一步
            </el-button>
            <el-button
              v-if="applyStep !== 5"
              type="primary"
              @click="toNextStep"
            >
              下一步
            </el-button>
            <el-button
              v-if="applyStep === 5"
              type="primary"
              @click="toNextStep"
            >
              创建供应商
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import imgUpload from '@/components/ImgUpload'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import categoryAddOrUpdate from './category-add-or-update.vue'
import brandAddOrUpdate from './brand-add-or-update.vue'
import * as addrApi from '@/api/delivery/transport'
import * as api from '@/api/platform/audit-supplier'
import { treeDataTranslate } from '@/utils'
import { isMobile, isEmail, isCreditCode, isUserName, validNoEmptySpace, noSpacesBothSides, checkIDCard } from '@/utils/validate'
import moment from 'moment'
import { encrypt } from '@/utils/crypto'
import { useAllinpayStore } from '@/stores/modules/allinpay.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
// 步骤: 1基本信息 2工商信息 3签约信息 4财务信息 5商家注册信息
const applyStep = ref(1)

// const supplierId = reactive(useRoute().query.supplierId || 0)
// 图片资源地址（前缀）
// const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const currentAddr = ref([]) // 选中地址
const addrOpts = ref([]) // 地址数据
const picturePreviewVisible = ref(false) // 预览图片弹窗

// 分类弹窗显隐
const cateAddOrUpdateVisible = ref(false)
// 品牌弹窗显隐
const brandAddOrUpdateVisible = ref(false)

const applyStatus = ref(0) // 供应商申请状态 0：未审核 1：已通过 -1：未通过 -2：未提交过申请
const isNotEdit = ref(false) // 是否不可以编辑信息, 当申请状态为待审核时不能编辑
const auditingInfo = ref('') // 审核信息

// 第一步---基本信息
const addrList = ref([])
const addrListTreeProps = reactive({
  value: 'areaId',
  label: 'areaName'
})
const supplierDetail = reactive({
  supplierName: '',
  contactName: '',
  contactPhone: '',
  email: '',
  province: '',
  provinceId: '',
  city: '',
  cityId: '',
  area: '',
  areaId: '',
  currentAddr: '',
  detailAddress: '',
  supplierLogo: '',
  intro: '',
  // 签约有效期起始日期
  contractTimeRange: [],
  type: ''
})

// eslint-disable-next-line no-unused-vars
const vaildUserName = (rule, value, callback) => {
  if (!isUserName(value)) {
    callback(new Error('用户名由字母、数字或下划线 4-16位组成，且不能为纯数字'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateMobile = (rule, value, callback) => {
  if (!isMobile(value)) {
    callback(new Error('请输入正确的联系方式'))
  } else {
    callback()
  }
}

/**
  * 校验密码
*/
// eslint-disable-next-line no-unused-vars
const validPassword = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else if (noSpacesBothSides(value)) {
    callback(new Error('不允许使用空格作为密码的开头或结尾'))
  } else {
    callback()
  }
}

// eslint-disable-next-line no-unused-vars
const validEmptyTab = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
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
    // 检查统一信用码是否已存在
    api.checkForDuplicateCreditCode({
      creditCode: value,
      supplierId: -1
    }).then(data => {
      if (data) {
        callback(new Error(this.$t('该统一社会信用代码重复，请重新输入')))
      } else {
        callback()
      }
    }).catch(() => {
      callback()
    })
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

// 检查供应商名称是否已存在
// eslint-disable-next-line no-unused-vars
const validShopName = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    api.checkForDuplicateShopName({ shopName: value }).then(data => {
      if (data) {
        callback(new Error('该店铺名称已存在，请重新输入'))
      } else {
        callback()
      }
    }).catch(() => {
      callback()
    })
  }
}

// eslint-disable-next-line no-unused-vars
const validateCardNo = (rule, value, callback) => {
  if (this.bankCartInfoForm.data.length > 1) {
    let flag = 0
    for (const item of this.bankCartInfoForm.data) {
      if (item.cardNo === value) {
        flag++
      }
    }
    if (flag > 1) {
      callback(new Error(`银行卡号${value}重复`))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 基础信息验证
const shopDetailRule = reactive({
  supplierName: [
    { required: true, message: '供应商名称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '供应商名称长度在2-20个字符之间', trigger: 'blur' }
    // { validator: validShopName, trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: '联系人不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '联系人长度在2-10个字符之间', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
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
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  supplierLogo: [
    { required: true, message: '请上传供应商Logo', trigger: ['blur', 'change'] }
  ],
  mobileBackgroundPic: [
    { required: true, message: '请上传移动端背景图', trigger: 'change' }
  ],
  pcBackgroundPic: [
    { required: true, message: '请上传PC端背景图', trigger: 'change' }
  ],
  intro: [
    { validator: validEmptyTab, trigger: 'blur' }
  ]
})

// 第二步---工商信息
const supplierCompany = reactive({
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
// 成立日期：今日之前可选
const pickerOptions = reactive({
  disabledDate (time) {
    const date = moment().add(0, 'days').startOf('days')
    return (
      time.getTime() >= date.valueOf()
    )
  }
})
// 工商信息校验
const shopCompanyRule = reactive({
  creditCode: [
    { required: true, message: '请填写统一社会信用代码', trigger: 'blur' },
    { validator: vaildCreditCode, trigger: 'blur' }
  ],
  firmName: [
    { required: true, message: '企业名称不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  residence: [
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  businessScope: [
    { required: true, message: '经营范围不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始日期不能为空', trigger: 'change' }
  ],
  businessLicense: [
    { required: true, message: '上传营业执照', trigger: 'change' }
  ],
  representative: [
    { required: true, message: '法定代表人不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
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

// 第三步---签约信息
const signCategoryList = ref([]) // 选中的分类列表
const signBrandList = ref([]) // 选中的品牌列表
const categorySigningList = ref([]) // 签约分类列表
const brandSigningList = ref([]) // 签约品牌列表

// 第四步---财务信息
const bankCartInfoForm = reactive({
  data: [
    {
      bankName: '',
      recipientName: '',
      cardNo: '',
      branchName: ''
    }
  ],
  rule: {
    bankName: [
      { required: true, message: '银行名称不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '银行名称长度在2到20个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    recipientName: [
      { required: true, message: '账户名不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '账户名长度在2到20个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    cardNo: [
      { required: true, message: '账号不能为空', trigger: 'blur' },
      { validator: validateCardNo, trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    branchName: [
      { required: true, message: '支行名称不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '支行名称长度在2到20个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ]
  }
})
// 通联
const allinpaySupplierBankCardForm = reactive({
  data: [{
    accountNo: '',
    parentBankName: '',
    bankName: '',
    unionBank: '',
    bankCardPro: 1
  }],
  rule: {
    bankName: [
      { required: true, message: '请填写开户支行名称', trigger: 'blur' },
      { min: 2, max: 20, message: '开户支行名称长度在2到20个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
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
const bankList = ref([]) // 银行列表 通联
const selectBank = ref('') // 选择的银行，通联

// 第五步---商家注册信息
const supplierUserRegisterInfo = reactive({
  username: '',
  password: '',
  mobile: '',
  validCode: ''
})
// 正在获取验证码
const waitingReceive = ref(false)
// 展示获取验证码按钮
const showGetCodeBtn = ref(true)
// 验证码倒计时
const count = ref('')
const timer = ref('')

// 商家注册信息校验
const shopUserRegisterRule = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { validator: vaildUserName, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '登陆密码不能为空', trigger: 'blur' },
    { min: 6, max: 16, message: '登录密码长度为6-16位', trigger: 'blur' },
    { validator: validPassword, trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  validCode: [
    { required: true, message: '验证码不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ]
})

const paySettlementType = useAllinpayStore().paySettlementType // 是否开启通联支付 1：开启 0：关闭

onMounted(() => {
  // 请求地址列表
  queryAddressList()
})

/**
 * 请求地址列表
 */
const queryAddressList = () => {
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
    supplierDetail.province = labels[0]
    supplierDetail.provinceId = value[0]
    supplierDetail.city = labels[1]
    supplierDetail.cityId = value[1]
    supplierDetail.area = labels[2]
    supplierDetail.areaId = value[2]
  }
}

// 获取签约有效期
const getContractTimeRange = (date) => {
  supplierDetail.contractStartTime = date[0]
  supplierDetail.contractEndTime = date[1]
}

/**
 * 注册资本输入框长度限制
 */
const changeNum = () => {
  if (supplierCompany.capital < 1) {
    supplierCompany.capital = ''
  }
  if (supplierCompany.capital.length > 8) {
    supplierCompany.capital = supplierCompany.capital.slice(0, 8)
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
 * 获取签约分类列表
 */
const getSignCategoryList = (categories) => {
  console.log('选择的类目', categories)
  signCategoryList.value = categories
}

/**
 * 获取签约品牌列表
 */
const getSignBrandList = (brands) => {
  signBrandList.value = brands
}

/**
 * 增加银行信息项
 */
const addBankInfo = () => {
  if (bankCartInfoForm.data.length < 5) {
    bankCartInfoForm.data.push(
      {
        bankName: '',
        recipientName: '',
        cardNo: '',
        branchName: ''
      }
    )
  } else {
    ElMessage({
      message: '最多可添加5个结算账户',
      type: 'error',
      duration: 1000
    })
    // ElMessage.error('最多可添加5个结算账户')
  }
}

/**
 * 删除银行信息项
 * @param {Number} index 索引
 */
const deleteBankInfoItem = (index) => {
  bankCartInfoForm.data.splice(index, 1)
}

/**
 * 上一步
 */
const toPrevStep = () => {
  applyStep.value -= 1
}

const supplierDetailRef = ref(null)
const supplierCompanyRef = ref(null)
const allinpaySupplierBankCardFormRef = ref(null)
const bankCartInfoFormRef = ref(null)
const supplierUserRegisterInfoRef = ref(null)
/**
 * 下一步
 */
const toNextStep = () => {
  if (applyStep.value === 1) {
    // 第一步 基本信息
    supplierDetailRef.value?.validate((valid) => {
      if (valid) {
        applyStep.value += 1
      }
    })
    return
  }
  if (applyStep.value === 2) {
    // 第二步 工商信息
    supplierCompanyRef.value?.validate((valid) => {
      if (valid) {
        if (!supplierCompany.businessScope.trim()) {
          ElMessage({
            message: '经营范围不能为空或空格！',
            type: 'error',
            duration: 1000
          })
          return
        }
        if (supplierCompany.endTime && Date.parse(supplierCompany.startTime) >= Date.parse(supplierCompany.endTime)) {
          ElMessage({
            message: '营业起始日期不能大于营业终止时间',
            type: 'error',
            duration: 1000
          })
          return
        }
        applyStep.value += 1
      }
    })
    return
  }
  if (applyStep.value === 3) {
    // 第三步 签约信息
    if ((!supplierDetail.contractTimeRange || !supplierDetail.contractTimeRange.length) && paySettlementType !== 1) {
      ElMessage({
        message: '请选择签约有效期！',
        type: 'error',
        duration: 1000
      })
      return
    }
    handleSignedDate()
    if (paySettlementType === 1) {
      getBankList()
    }
    return
  }
  if (applyStep.value === 4) {
    // 第四步 财务信息
    if (paySettlementType === 1) {
      allinpaySupplierBankCardFormRef.value?.validate((valid) => {
        if (valid) {
          applyStep.value += 1
        }
      })
      return
    }
    bankCartInfoFormRef.value?.validate((valid) => {
      if (valid) {
        applyStep.value += 1
      }
    })
    // bankCartIsRepeated()
    return
  }
  if (applyStep.value === 5) {
    // 第五步 注册信息
    supplierUserRegisterInfoRef.value?.validate((valid) => {
      if (valid) {
        createStore()
      }
    })
  }
}

/**
 * 签约数据处理
 */
const handleSignedDate = () => {
  if (!signCategoryList.value.length) {
    ElMessage({
      message: '请至少选择一项类目',
      type: 'error',
      duration: 1000
    })
    return
  }
  if (signBrandList.value.length) {
    if (signBrandList.value.find(el => !el.qualifications)) {
      ElMessage({
        message: '品牌授权文件不能为空',
        type: 'error',
        duration: 1000
      })
      return
    }
  }
  // 分类
  const categories = []
  signCategoryList.value.forEach(el => {
    categories.push({
      categoryId: el.categoryId,
      qualifications: el.qualifications,
      rate: el.customizeRate || ''
    })
  })
  categorySigningList.value = categories
  // 品牌
  signBrandList.value.forEach(el => {
    el.type = 0 // 类型 0：平台品牌，1：供应商自定义品牌
  })
  brandSigningList.value = signBrandList.value

  applyStep.value += 1
}

/**
 * 获取注册验证码
 */
const getRegisterCode = () => {
  if (!isMobile(supplierUserRegisterInfo.mobile)) {
    ElMessage({
      message: '请输入正确的手机号',
      type: 'error',
      duration: 1000
    })
    return
  }
  if (waitingReceive.value) {
    return
  }
  waitingReceive.value = true
  const data = {
    mobile: supplierUserRegisterInfo.mobile,
    shopAccount: 1
  }
  api.getRegisterCode(data).then(() => {
    waitingReceive.value = false
    const timeCount = 60
    if (!timer.value) {
      count.value = timeCount
      showGetCodeBtn.value = false
      timer.value = setInterval(() => {
        if (count.value > 0 && count.value <= timeCount) {
          count.value--
        } else {
          clearInterval(timer.value)
          timer.value = null
          showGetCodeBtn.value = true
        }
      }, 1000)
    }
  }).catch((e) => {
    waitingReceive.value = false
  })
}
const bankCartIsRepeated = () => {
  // console.log(bankCartInfoForm.data)
}
/**
 * 创建供应商
 */
const createStore = () => {
  supplierUserRegisterInfoRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    let data = {}
    supplierUserRegisterInfo.password = encrypt(supplierUserRegisterInfo.password)
    data = {
      // 供应商基本信息
      supplierDetail: supplierDetail,
      // 供应商工商信息
      supplierCompany: supplierCompany,
      // 签约分类列表
      categorySigningList: categorySigningList.value,
      // 签约品牌列表
      brandSigningList: brandSigningList.value,
      // 供应商银行卡列表
      supplierBankCardList: paySettlementType !== 1 ? bankCartInfoForm.data : undefined,
      // 商家注册信息
      supplierUserRegisterInfo,
      // 通联银行卡信息
      allinpaySupplierBankCardDTO: paySettlementType === 1 ? allinpaySupplierBankCardForm.data[0] : undefined
    }
    api.create(data).then(() => {
      ElMessage({
        message: '供应商创建成功！',
        type: 'success',
        duration: 1500,
        onClose: () => {
          router.push('/platform/supplier-manage')
        }
      })
    })
  })
}
// 获取可选银行名称列表（通联）
const getBankList = () => {
  api.getBankList().then(data => {
    bankList.value = data
  })
}
const changeBank = (value) => {
  allinpaySupplierBankCardForm.data[0].parentBankName = value
}
/**
* 图片的值发生改变，重新校验对应表单字段
* @param {*} applyStep 表单类型 2-工商信息
* @param {*} prop 图片字段名
*/
const imgChange = (applyStep, prop) => {
  if (applyStep.value === 2) {
    supplierCompanyRef.value?.validateField(prop)
  }
}

</script>

<style lang="scss" scoped>
.shop-process-container {
  width: 100%;
  // height: 100%;
  // min-height: 100vh;
  max-height: auto;
  background: #fff;
  padding-bottom: 50px;
  .sp-wrapper {
    width:90%;
    margin: 0 auto;

    /****** 当前页通用样式 ******/
    .title {
      width: 100%;
      font-size: 22px;
      text-align: center;
      padding: 30px 0 15px;
    }
    .content {
      width: 100%;
      border: 1px solid #EAEAEA;
      margin: auto;
    }

    .sbi-content.content {
      border: none;
      .footer-box {
        margin-top: 30px;
        margin-bottom: 30px;
        text-align: center;
      }
    }

    // 供应商申请状态
    .status-tips {
      width: 100%;
      height: 38px;
      line-height: 36px;
      padding-left: 15px;
      box-sizing: border-box;
      .text {
        font-size: 14px;
        color: #666;
        padding-left: 10px;
      }
    }
    .submit-status-tips {
      background: #FFF7DD;
      border: 1px solid #FFD888;
      margin-top: 20px;
      .text-icon {
        color: #ffa900;
      }
    }
    // 失败提示
    .fail-status-tips {
      background: rgba(255, 33, 32, 0.05);
      border: 1px solid #FF2120;
      margin-top: 20px;
      .text-icon {
        color: #FF2120;
      }
    }
    // 等待审核状态
    .pedding-status-tips {
      background: rgba(24, 144, 255, 0.08);
      border: 1px solid #155bd4;
      margin-top: 20px;
      .text-icon {
        color: #155bd4;
      }
    }

    // 内容包裹
    .content-wrapper {
      display: block;
      width: 90%;
      margin: 50px auto;
    }

    // 进度条
    .progress-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 860px;
      overflow: hidden;
      margin: 50px auto 0;

      .step {
        position: relative;
        width: 315px;
        .step-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          .step-num {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            background: #D2D2D2;
            text-align: center;
            border: 4px solid #EFEFEF;
            border-radius: 50%;
            margin: 0 auto;
            z-index: 1;
          }
          .step-text {
            width: 64px;
            font-size: 16px;
            color: #999;
            margin-top: 18px;
          }
        }
        &::after {
          position: absolute;
          top: 15px;
          // left: -280px;
          left: -184px;
          content: '';
          display: block;
          // width: 300px;
          width: 204px;
          height: 6px;
          background: #F2F2F2;
        }
        &:nth-child(1) {
          &::after {
            display: none;
          }
        }
        &:nth-child(5) {
          width: 64px;
        }
      }
      .active-step {
        .step-item {
          .step-text {
            color: #155bd4;
          }
          .step-num {
            background: #155bd4;
            border: 4px solid #DEEFFF;
          }
        }
        &::after {
          background: #C1E1FF;
        }
      }
    }

    // 表格上的标题
    .table-data-title {
      display: flex;
      align-items: center;
      .text {
        font-size: 16px;
        .stress {
          color: #FF2120;
          padding-right: 5px;
        }
      }
      .tips {
        font-size: 12px;
        color: #999;
        margin-left: 10px;
        .txt-bold {
          color: #333;
        }
      }
      .edit-btn {
        width: 117px;
        height: 30px;
        line-height: 28px;
        font-size: 14px;
        color: #155bd4;
        background: #FFFFFF;
        text-align: center;
        border: 1px solid #155bd4;
        border-radius: 2px;
        box-sizing: border-box;
        margin-left: auto;
        cursor: pointer;
      }
    }

    // 表格
    table {
      border-collapse:collapse;
      width: 100%;
      font-size: 14px;
      .table-title {
        height: 50px;
        line-height: 50px;
        background: #F5F5F5;
        td {
          width: 25%;
          max-width: 0;
          padding: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &:nth-child(1) {
            padding-left: 25px;
          }
        }
      }
      .table-item {
        height: 49px;
        line-height: 49px;
        border-bottom: 1px solid #EAEAEA;
        td {
          width: 25%;
          padding: 0;
          max-width: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &:nth-child(1) {
            padding-left: 25px;
          }
        }
        &:nth-child(2n+1) {
          background: #FAFAFA;
        }
      }
    }

    // 上一步
    .prev-btn {
      width: 120px;
      height: 40px;
      line-height: 38px;
      font-size: 14px;
      text-align: center;
      border: 1px solid #E8E9EC;
      border-radius: 4px;
      box-sizing: border-box;
      cursor: pointer;
    }

    // 下一步
    .next-btn {
      width: 120px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #fff;
      background: #155bd4;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
    }
    /****** /当前页通用样式 ******/

    // 0-协议部分
    .shop-agreement {
      .sa-title {
        width: 100%;
        font-size: 22px;
        text-align: center;
        margin: 30px 0 0;
      }
      .sa-content {
        width: 100%;
        height: 517px;
        padding: 30px 33px 25px;
        border: 1px solid #EAEAEA;
        box-sizing: border-box;
        overflow-y: scroll;
        margin-top: 30px;
        /* 谷歌隐藏滚动条 */
        &::-webkit-scrollbar {
          display: none;
        }
        /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
        /* IE隐藏滚动条 */
        -ms-overflow-style: none;
        /* 火狐隐藏滚动条 */
        overflow: -moz-scrollbars-none;
      }
      .sa-checkbox {
        display: flex;
        justify-content: center;
        margin-top: 30px;
        cursor: pointer;
        .text {
          font-size: 14px;
          color: #000;
          .flag {
            color: #57A3E9;
          }
        }
      }
      .next-btn {
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        margin: 50px auto 0;
      }
    }

    // 1-填写基本信息
    .shop-base-info {
      .ci-wrapper {
        .left-info {
          ::v-deep(.el-date-editor--daterange.el-input),
          .el-date-editor--daterange.el-input__inner,
          .el-date-editor--timerange.el-input,
          .el-date-editor--timerange.el-input__inner {
            width: 100%;
          }
        }
      }
    }
    .btn {
      display: block;
      text-align: center;
      margin-bottom: 30px;
      margin-top: 20px;
      .next-btn {
        display: inline-block;
      }
    }
    // 2-填写营业信息
    .company-info {
      display: flex;
      justify-content: center;
      margin-top: 50px;
      .ci-wrapper {
        display: flex;
        .left-info {
          width: 50%;
          margin-left: 10px;
          .price-unit-text {
            font-size: 14px;
            color: #666;
            margin-left: 15px;
          }
          .capital-int {
            ::v-deep(.el-input__inner) {
              padding-right: 0;
            }
          }
        }
        .right-info {
          width: 50%;
          margin-left: 80px;
          .business-license-box {
            .license-content {
              display: flex;
              ::v-deep(.single-image-upload) {
                height: 120px;
              }
            }
          }
          .id-box {
            .upload-content {
              .upload-img {
                display: flex;
                div {
                  &:nth-child(2) {
                    margin-left: 20px;
                  }
                }
                .disabled-upload {
                  ::v-deep(.el-upload) {
                    background: #f5f7fa;
                  }
                }
                .single-image-upload {
                  height: 120px;
                }
              }
              .upload-example {
                display: flex;
                // margin-top: 15px;
                margin-left: 134px;
                .example-box {
                  margin-left: 0;
                  &:nth-child(2) {
                    margin-left: 20px;
                  }
                }
              }
              .upload-tips {
                margin-left: 134px;
              }
            }
          }
          .img-static {
            display: block;
            width: 120px;
            height: 120px;
            cursor: pointer;
          }
          .img-static:not(:first-child) {
            margin-left: 20px;
          }

          // 示例框
          .example-box {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 120px;
            height: 120px;
            background: #FFFFFF;
            border: 1px solid #EAEAEA;
            border-radius: 3px;
            box-sizing: border-box;
            margin-left: 20px;
            img {
              display: block;
              width: auto;
              max-width: 100%;
              height: auto;
              max-height: 100%;
            }
            .tips {
              position: absolute;
              left: -1px;
              bottom: 0;
              width: 120px;
              height: 20px;
              line-height: 20px;
              font-size: 12px;
              color: #fff;
              background: rgba(51, 51, 51, 0.5);
              text-align: center;
              border-radius: 0px 0px 3px 3px;
            }
          }

          .upload-tips {
            font-size: 12px;
            color: #999;
            height: 16px;
            line-height: 20px;
            margin-top: 5px;
            margin-bottom: 5px;
          }

          // 图片上传框样式修改
          ::v-deep .el-upload {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 121px;
            background: #FFFFFF;
            border: 1px solid #EAEAEA;
            border-radius: 3px;
            box-sizing: border-box;
            img {
              width: 120px;
            }
            .el-icon-plus {
              font-size: 22px;
              color: #EAEAEA;
            }
          }
          // 背景图
          .bg-img {
            display: flex;
            justify-content: flex-start;
            .business-license-box {
              margin-right: 30px;
              .img-tips {
                display: block;
                text-align: center;
                font-size: 12px;
                color: #666;
                line-height: 1.5em;
                margin-top: 8px;
                p  {
                  margin: 0;
                  padding: 0;
                }
              }
            }
          }
        }
      }
      .footer {
        display: block;
        width: 100%;
        .btn-box {
          display: flex;
          justify-content: center;
          // margin-left: 134px;
          margin-bottom: 30px;
          margin-top: 10px;
          .prev-btn {
            margin-right: 13px;
          }
        }
      }
    }

    // 3-选择签约信息
    .signing-content {
      .s-category-item {
        margin-bottom: 30px;
      }
      .s-item {
        .si-content {
          margin-top: 12px;
        }
      }
    }

    // 4-财务信息
    .finance-info {
      .edit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        box-sizing: border-box;
        .plus {
          font-size: 23px;
          padding-right: 5px;
        }
      }
      .fi-content {
        position: relative;
        min-height: 500px;
        margin-top: 12px;
        .add-bank-info-table {
          // 去除表格线
          ::v-deep(.el-table__row>td) {
            border: none;
          }
          ::v-deep td.el-table_1_column_6 {
            i {
              font-size: 22px;
              cursor: pointer;
            }
          }
          ::v-deep(.el-form-item) {
            margin-top: 16px;
            margin-bottom: 16px;
          }
        }
        // 去除表格下边框
        ::v-deep(.el-table::before) {
          height: 0;
        }
        .show-table {
          tr {
            border-bottom: 1px solid #EAEAEA;
          }
          .table-title,
          .table-item {
            td {
              &:nth-child(1) {
                width: 170px;
              }
              &:nth-child(2) {
                width: 250px;
              }
              &:nth-child(3) {
                width: 320px;
              }
              &:nth-child(4) {
                width: 270px;
              }
              &:nth-child(5) {
                width: 160px;
                padding-right: 40px;
                text-align: right;
              }
            }
          }
        }
        .btn-box {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -20px;
          display: flex;
          justify-content: center;
          // margin-left: -126px;
          .prev-btn:not(:last-child) {
            margin-right: 15px;
          }
        }
      }
      ::v-deep(.el-table th) {
        background: #F5F5F5;
        height: 50px;
      }
      // ::v-deep .el-table td .el-form-item__error {
      //   position: static;
      // }
      // ::v-deep .el-table td {
      //   height: 60px;
      // }
      // 移除icon
      .el-icon-remove-outline::before {
        font-size: 20px;
        cursor: pointer;
      }
    }

    // 注册信息
    .register-info {
      display: block;
      width: 450px;
      height: 300px;
      margin: 0 auto;
      margin-top: 80px;
      .mobile-box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #606266;
        .mobile-btn {
          cursor: pointer;
        }
        .mobile-btn:active {
          background: #f2f2f2;
        }
      }
    }

  }
}
@media (max-width:1440px) {
  .sp-wrapper {
    width:100% !important
  }
}
</style>
