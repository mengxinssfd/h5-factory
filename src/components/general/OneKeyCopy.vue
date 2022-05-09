<template>
  <div :class="['comp-content', component.active ? 'active' : '']" :style="getStyle">
    <div class="text-box" v-html="component.children.text.value || '请输入内容'"></div>
    <button>{{ component.children.button.label }}</button>
    <div class="steps">
      <div class="step" v-for="step in component.children.steps.value" :key="step">{{ step }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OneKeyCopy',
  props: {
    component: {
      type: Object,
    },
  },
  computed: {
    getStyle() {
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.comp-content {
  background-repeat: no-repeat;
}
.text-box {
  display: block;
}
.steps {
  display: flex;
  align-items: center;
}
</style>
