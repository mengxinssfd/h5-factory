<template>
  <div>
    <template v-if="menus && menus.length">
      <div v-for="(menu, idx) in menus" class="form-list-panel">
        <upload
          :label="'图片' + (idx + 1)"
          :index="idx"
          :item="menu"
          v-on:uploadSuccess="uploadSuccess"
        >
        </upload>
        <template v-if="menu.click">
          <el-form-item class="small" label="跳转到：">
            <span style="word-break: break-all">{{ menu.click.href }}</span>
          </el-form-item>
        </template>
        <el-form-item class="small" label="点击配置：">
          <el-button icon="el-icon-edit" round @click="showClick(menu, idx)">配置跳转</el-button>
        </el-form-item>
        <div class="list-item-opt">
          <a v-if="idx !== 0" href="javascript:;" @click="upItem(idx)">
            <i class="el-icon-arrow-up"></i>
          </a>
          <a v-if="idx !== menus.length - 1" href="javascript:;" @click="downItem(idx)">
            <i class="el-icon-arrow-down"></i>
          </a>
          <a v-if="idx > 0" href="javascript:;" @click="delItem(idx)">
            <i class="el-icon-delete"></i>
          </a>
        </div>
      </div>
    </template>
    <el-button icon="el-icon-plus" style="margin-top: 15px" round @click="addItem">
      添加导航项
    </el-button>
  </div>
</template>

<script>
import util from '@/utils/util.js';
import compConfig from '@/config/comp.config.js';
import upload from '@/common/upload.vue';
export default {
  data() {
    return {
      defaultConf: util.copyObj(compConfig['bottom-menu']),
      menus: this.items,
    };
  },
  components: {
    upload,
  },
  props: {
    items: {
      type: Array,
    },
  },
  watch: {
    items: {
      handler(val) {
        this.menus = val;
      },
      deep: true,
    },
  },
  methods: {
    showClick(banner, idx) {
      // 底部导航只可配置外链
      this.$bus.$emit('click:show', idx, ['outside']);
    },
    upItem(idx) {
      const tmp = util.copyObj(this.menus[idx]);
      this.menus.splice(idx, 1);
      this.menus.splice(idx - 1, 0, tmp);
    },
    downItem(idx) {
      const tmp = util.copyObj(this.slides[idx]);
      this.menus.splice(idx, 1);
      this.menus.splice(idx + 1, 0, tmp);
    },
    delItem(idx) {
      this.menus.splice(idx, 1);
    },
    addItem() {
      if (this.menus.length < 10) {
        this.menus.push(util.copyObj(this.defaultConf.action.config[0]));
      } else {
        this.$alert('最多添加5个导航项！');
      }
    },
    uploadSuccess(item) {
      console.log('uploadSuccess', item);
    },
  },
};
</script>

<style lang="scss"></style>
