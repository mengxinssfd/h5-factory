<template>
  <div class="comp-content" :class="{ active: component.active }" :style="getStyle">
    <div
      v-if="textBase.visible"
      class="text-box"
      v-html="textBase.text || '请输入内容'"
      :style="textStyle"
    ></div>
    <button :style="buttonStyle" @click="handleClick">
      {{ buttonBase.text }}
    </button>
    <div
      v-if="stepsBase.visible"
      class="steps"
      :style="{ 'grid-template-columns': `repeat(${stepsBase.steps.length}, 1fr)` }"
    >
      <div class="step" v-for="(step, idx) in stepsBase.steps" :key="`step${idx}`">
        {{ idx + 1 }}.{{ step }}
      </div>
    </div>
  </div>
</template>

<script>
import { optionsToObj } from '@/utils/util';
import { copy2Clipboard } from '@mxssfd/ts-utils';

export default {
  name: 'OneKeyCopy',
  props: {
    component: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    text() {
      return this.component.children.text;
    },
    textStyle() {
      return optionsToObj(this.text.base.filter((i) => i.isStyle));
    },
    textBase() {
      return optionsToObj(this.text.base);
    },
    button() {
      return this.component.children.button;
    },
    buttonStyle() {
      const btn = this.button;
      const config = this.buttonBase;
      const style = optionsToObj(btn.base.filter((i) => i.isStyle));
      switch (config['button-style']) {
        case 'area':
          break;
        case 'line':
          style.border = `1px solid ${style.background}`;
          style.color = style.background;
          style.background = 'none';
          break;
      }
      return style;
    },
    buttonBase() {
      return optionsToObj(this.button.base);
    },
    steps() {
      return this.component.children.steps;
    },
    getStyle() {
      return '';
    },
    stepsBase() {
      return optionsToObj(this.steps.base);
    },
  },
  methods: {
    handleClick() {
      const config = this.buttonBase;
      let copyText = this.textBase.text;
      switch (config.btnAction) {
        case 'copyCustomText':
          copyText = config.customText;
        case 'copyText':
          copy2Clipboard(copyText).then(() => {
            if (config.copyTips) alert(config.copyTips);
          });
          break;
        default:
          window.open(config.link, '_blank');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$mt: 10px;
.comp-content {
  background: #f7f7f7;
  background-repeat: no-repeat;
  padding: 15px;
  border-radius: 3px;
  > :not(:first-child) {
    margin-top: $mt;
  }
}
.text-box {
  padding: 50px 10px;
  text-align: center;
  border-width: 1px;
  background: #fffbfb;
  border-radius: 3px;

  font-size: 14px;
  font-weight: 500;
  color: #ff4c42;
  line-height: 20px;
}
button {
  width: 100%;
  line-height: 50px;
  background: linear-gradient(270deg, #f73e28 0%, #fb884d 100%);
  border-radius: 3px;

  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  border: 0;
}
.steps {
  display: grid;
  grid-gap: 0;

  font-size: 12px;
  font-weight: bold;
  color: #ff4c42;

  $w: 15px;
  $w2: calc(100% - 15px);
  .step {
    padding: 10px 0;
    text-align: center;
    line-height: 16px;
    background: #ffe4e3;
    border: 1px dashed rgba(255, 163, 158, 0.3);
    clip-path: polygon($w2 0%, 100% 50%, $w2 100%, 0 100%, 0% 0);
    &:first-child {
      padding-right: 10px;
    }
    + .step {
      padding: 10px 12px;
      margin-left: -10px;
      clip-path: polygon($w2 0%, 100% 50%, $w2 100%, 0 100%, $w 50%, 0% 0);
    }
    &:last-child {
      padding-right: 0;
      clip-path: polygon(100% 0%, 100% 50%, 100% 100%, 0 100%, $w 50%, 0% 0);
    }
    &:only-child {
      clip-path: none;
    }
  }
}
</style>
