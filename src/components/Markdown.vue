<template>
  <v-md-preview
      ref="md"
      :text="source"
      :before-change="beforeChange"/>
</template>

<script>
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

import Prism from 'prismjs';

VMdPreview.use(vuepressTheme, {
  Prism
});

/**
 * source markdown文本
 * beforePreview(text, next) 渲染之前调用的函数,需要渲染则调用next函数,参数为需要渲染的markdown文本
 * anchorAttribute(url) 需要替换的markdown中文本的链接,返回替换完毕的url  示例  [目录结构](/doc/web?resource=目录结构.md)
 * imgAnchorAttribute(url) 需要替换的markdown中图片链接,返回替换完毕的url 示例 ![avatar](./addVueFile.jpg)
 */
export default {
  name: "Markdown",
  components: {VMdPreview},
  props: ['source', 'beforePreview', 'anchorAttribute', 'imgAnchorAttribute'],
  methods: {
    beforeChange(text, next) {
      let callback = (md) => {
        next(this.anchorAttributeReplace(md))
      }
      if (this.beforePreview) {
        this.beforePreview(text, callback)
      } else {
        callback(text)
      }
    },
    anchorAttributeReplace(md) {
      if (!this.anchorAttribute && this.imgAnchorAttribute) {
        return md
      }
      let resMd = "";
      let anchorPattern = /[[][\S]+[\](]\S+[)]/g
      let matchList = md.match(anchorPattern);
      if (!matchList || matchList.length <= 0) {
        return md
      }
      let next = anchorPattern.exec(md)
      if (next.index > 0) {
        resMd += md.substring(0, next.index)
      }
      let anchorEndIndex
      while (next) {
        let anchor = next[0]
        anchorEndIndex = next.index + anchor.length
        resMd += anchor.substring(0, anchor.lastIndexOf('](') + 2)
        let attribute = anchor.substring(anchor.lastIndexOf('](') + 2, anchor.length - 1)
        let anchorKey = anchor.substring(1, anchor.lastIndexOf(']('))
        if ('avatar' == anchorKey || 'img.png' == anchorKey) {
          if (this.imgAnchorAttribute) {
            attribute = this.imgAnchorAttribute(attribute)
          }
        } else if (this.anchorAttribute) {
          attribute = this.anchorAttribute(attribute)
        }
        resMd = resMd + attribute + ")"
        next = anchorPattern.exec(md)
        if (next && anchorEndIndex < next.index) {
          resMd += md.substring(anchorEndIndex, next.index)
        }
      }
      if (anchorEndIndex < md.length) {
        resMd += md.substring(anchorEndIndex)
      }
      return resMd
    }
  }
}
</script>

<style scoped>

</style>