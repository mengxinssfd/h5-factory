<template>
  <div>
    <el-form-item class="small" label="文本框：">
      <el-input v-model="config.children.text.value" :maxlength="128"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import util from '@/utils/util.js';
import compConfig from '@/config/comp.config.js';
export default {
  data() {
    return {
      list: this.items,
      defaultConf: util.copyObj(compConfig['one-key-copy']),
    };
  },
  props: {
    config: {
      type: Object,
      default() {
        return this.defaultConf;
      },
    },
  },
  mounted() {
    console.log('11111111111');
  },
  methods: {},
};
</script>

<style lang="scss"></style>
