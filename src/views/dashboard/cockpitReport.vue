<template>
  <div class="page-main-cockpit">
    <cockpitCard1 ref="cockpitCard1"></cockpitCard1>
    <cockpitCard2 ref="cockpitCard20" :type="1"></cockpitCard2>
    <cockpitCard2 ref="cockpitCard21" :type="2"></cockpitCard2>
    <cockpitCard2 ref="cockpitCard22" :type="3"></cockpitCard2>
    <cockpitCard3 ref="cockpitCard3"></cockpitCard3>
  </div>
</template>

<script>
import cockpitCard1 from './cockpit/cockpitCard1'
import cockpitCard2 from './cockpit/cockpitCard2'
import cockpitCard3 from './cockpit/cockpitCard3'

export default {
  components: {
    cockpitCard1,
    cockpitCard2,
    cockpitCard3,
  },
}
</script>
<style lang="less" scoped>
.page-main-cockpit {
  padding: 25px 24px;
  
}
</style>