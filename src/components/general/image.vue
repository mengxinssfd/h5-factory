<template>
  <div :class="['comp-content', component.active ? 'active' : '']" :style="getStyle">
    <div class="image-box">
      <img v-if="imgUrl" :src="imgUrl" />
      <div v-else class="image-placeholder"><i class="fa fa-image"></i></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseImage',
  props: {
    component: {
      type: Object,
    },
  },
  data() {
    return {
      imgUrl: this.component.style[1].val,
    };
  },
  computed: {
    getStyle() {
      const ret = [];
      this.component.style.forEach((item) => {
        const unit = item.unit || '';
        item.val && ret.push(item.attr + ':' + item.val + unit);
      });
      return ret.join(';');
    },
  },
  watch: {
    component: {
      handler() {
        this.imgUrl = this.component.style[1].val;
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.image-box {
  position: relative;
  overflow: hidden;

  .image-placeholder {
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;

    > .fa {
      color: #83c0ff;
      font-size: 40px;
    }
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    margin: 0;
    border: 0;
    -webkit-user-drag: none;
  }
}
</style>
