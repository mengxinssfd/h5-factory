<template>
  <div :class="['comp-content', component.active ? 'active' : '']" :style="getStyle">
    <div class="swiper-container" :id="component.domId" :style="{ width: width, height: height }">
      <div class="swiper-wrapper">
        <div v-for="banner in banners" class="swiper-slide">
          <img v-if="banner.val" :src="banner.val" />
          <div v-else class="image-placeholder"><i class="fa fa-caret-square-o-right"></i></div>
        </div>
      </div>
      <div v-show="pagination" class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';

export default {
  name: 'SwiperBanner',
  props: {
    component: {
      type: Object,
    },
  },
  data() {
    return {
      swiper: null,
      banners: this.component.action.config,
      pagination: this.component.base[1].val,
      height: this.getMaxHeight(),
      width: this.getWidth(),
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
        this.banners = this.component.action.config;
        this.pagination = this.component.base[1].val;
        this.height = this.getMaxHeight();
        this.width = this.getWidth();
        setTimeout(() => {
          this.swiper.update();
        }, 0);
      },
      deep: true,
    },
  },
  methods: {
    getMaxHeight() {
      let h = 0;
      if (this.component.action.config && this.component.action.config.length) {
        this.component.action.config.forEach((item) => {
          if (item.height && item.height > h) {
            h = item.height;
          }
        });
      }
      return h > 0 ? h / 2 + 'px' : '112px';
    },
    getWidth() {
      return (750 - this.component.style[2].val - this.component.style[4].val) / 2 + 'px';
    },
  },
  mounted() {
    this.swiper = new Swiper('#' + this.component.domId, {
      autoplay: false,
      pagination: {
        el: '.swiper-pagination',
      },
    });
  },
};
</script>

<style lang="scss" scoped>
.swiper-container {
  width: 100%;

  .swiper-slide {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    > img {
      width: 100%;
      height: auto;
    }
  }
}

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
</style>
