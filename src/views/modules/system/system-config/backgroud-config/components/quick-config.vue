<template>
  <div class="mod-pay">
    <quickbird
      ref="quickbirdRef"
      :change-flag="changeFlag"
      @activation-config="activationConfig"
    />
    <quick100
      ref="quick100Ref"
      :change-flag="changeFlag"
      @activation-config="activationConfig"
    />
    <ali
      ref="aliRef"
      :change-flag="changeFlag"
      @activation-config="activationConfig"
    />
  </div>
</template>
<script setup>
import quickbird from './quickbird-config.vue'
import quick100 from './quick100-config.vue'
import ali from './quick-ali-config.vue'

const changeFlag = ref(true)

// 激活配置回调
const activationConfig = () => {
  changeFlag.value = !changeFlag.value
}

</script>
