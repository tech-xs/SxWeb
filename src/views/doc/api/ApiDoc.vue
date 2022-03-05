<template>
  <Mgr>
    <iframe class="body" src="http://127.0.0.1:7788/swagger-ui/index.html"/>
  </Mgr>
</template>

<script>
import Mgr from '@/components/mgr/Mgr'

export default {
  name: "ApiDoc",
  components: {Mgr},
}
</script>

<style lang="less" scoped>

.body {
  width: 100%;
  height: 100%;
  border: none;
}

</style>