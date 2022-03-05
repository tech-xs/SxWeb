<template>
  <Mgr>
    <Markdown :source="mdText"
              :anchorAttribute="anchorAttribute"
              :imgAnchorAttribute="imgAnchorAttribute"/>
  </Mgr>
</template>

<script>
import Mgr from '@/components/mgr/Mgr'
import Markdown from "@/components/Markdown";
import {getDocContent} from "@/api/doc/doc";

export default {
  name: "WebDoc",
  components: {Mgr, Markdown},
  watch: {
    '$route'() {
      this.setContent()
    }
  },
  data() {
    return {
      mdText: ''
    }
  },
  created() {
    this.setContent();
  },
  methods: {
    setContent() {
      let resource = this.$route.query.resource
      if (!resource || resource == "") {
        resource = '/web/webDoc.md'
      } else {
        resource = '/web/' + resource
      }
      getDocContent(resource).then(res => {
        this.mdText = res
      })
    },
    imgAnchorAttribute(url) {
      if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
        return url
      }
      if (url.indexOf('./') >= 0) {
        url = url.substring(2)
      }
      let resource = this.$route.query.resource
      let dirEndIndex = resource.lastIndexOf('/')
      let dirPath = '';
      if (dirEndIndex > 0) {
        dirPath = resource.substring(0, dirEndIndex + 1);
      }
      let rootPath = document.location.origin;
      return rootPath + '/doc/web/' + dirPath + url;
    },
    anchorAttribute(url) {
      if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
        return url
      }
      if (url.indexOf('./') >= 0) {
        url = url.substring(2)
      }
      url = this.$route.href + '?resource=' + url
      return url
    }
  }
}
</script>
<style lang="less" scoped>
.body {
  margin-left: 50px;
  margin-right: 50px;
}
</style>