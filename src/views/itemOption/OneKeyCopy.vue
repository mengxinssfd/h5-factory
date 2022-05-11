<template>
  <div>
    <template v-for="(item, idx) in text.base">
      <form-item :item="item" :index="idx" v-if="enable(item)"></form-item>
    </template>

    <template v-for="(item, idx) in button.base">
      <form-item :item="item" :index="idx" v-if="enable(item)"></form-item>
    </template>

    <template v-for="(item, idx) in steps.base">
      <form-item :item="item" :index="idx" v-if="enable(item)"></form-item>
    </template>
  </div>
</template>

<script>
import util, { computeEnable, optionsToObj } from '@/utils/util.js';
import compConfig from '@/config/comp.config.js';
import formItem from '@/common/formItem.vue';
export default {
  name: 'OneKeyCopyOptions',
  components: {
    formItem,
  },
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
  computed: {
    text() {
      return this.config.children.text;
    },
    button() {
      return this.config.children.button;
    },
    steps() {
      return this.config.children.steps;
    },
    base() {
      return {
        text: optionsToObj(this.text.base),
        button: optionsToObj(this.button.base),
        steps: optionsToObj(this.steps.base),
      };
    },
  },
  methods: {
    enable(item) {
      return computeEnable(this.base, item.enable);
    },
  },
};
</script>

<style lang="scss"></style>
