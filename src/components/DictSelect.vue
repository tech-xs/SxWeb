<template>
  <a-select
      v-model:value="selectValue"
      @change="change"
      :options="options">
  </a-select>
</template>

<script>
const buildOptions = function (dict) {
  let options = []
  for (let item of dict.valueList) {
    let optionItem = {
      value: item.value,
      label: item.name
    }
    options.push(optionItem)
  }
  return options
}
export default {
  name: "DictSelect",
  props: ['value', 'dict'],
  setup(prop) {
    let options = []
    if (prop.dict && prop.dict.valueList) {
      options = buildOptions(prop.dict)
    }
    return {
      options,
    }
  },
  watch: {
    value(val) {
      this.selectValue = val
    },
    dict(val) {
      this.options = buildOptions(val)
    }
  },
  data() {
    return {
      selectValue: undefined,
    }
  },
  created() {
    this.selectValue = this.value
  },
  methods: {
    change(val) {
      this.$emit('update:value', val);
    },
  }
}
</script>

<style scoped>

</style>