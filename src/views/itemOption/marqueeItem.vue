<template>
  <div>
    <template v-if="items && items.length">
      <div class="form-list-panel" v-for="(item, idx) in items">
        <el-form-item class="small" label="滚动文案：">
          <el-input v-model="item.text" :maxlength="500" placeholder="滚动项文案"></el-input>
        </el-form-item>
        <template v-if="item.click">
          <el-form-item class="small" label="跳转到：">
            <span style="word-break: break-all">{{ item.click.href }}</span>
          </el-form-item>
        </template>
        <el-form-item class="small" label="点击配置：">
          <el-button icon="el-icon-edit" round @click="showClick(item, idx)">配置跳转</el-button>
        </el-form-item>
        <div class="list-item-opt">
          <a href="javascript:;" v-if="idx !== 0" @click="upItem(idx)">
            <i class="el-icon-arrow-up"></i>
          </a>
          <a href="javascript:;" v-if="idx !== items.length - 1" @click="downItem(idx)">
            <i class="el-icon-arrow-down"></i>
          </a>
          <a href="javascript:;" v-if="idx > 0" @click="delItem(idx)">
            <i class="el-icon-delete"></i>
          </a>
        </div>
      </div>
    </template>
    <el-button icon="el-icon-plus" style="margin-top: 15px" round @click="addItem">
      添加滚动项
    </el-button>
  </div>
</template>

<script>
import util from '@/utils/util.js';
import compConfig from '@/config/comp.config.js';
export default {
  data() {
    return {
      defaultConf: util.copyObj(compConfig['news-marquee']),
      items: this.marquees,
    };
  },
  props: {
    marquees: {
      type: Array,
    },
  },
  watch: {
    marquees: {
      handler(val) {
        this.items = val;
      },
      deep: true,
    },
  },
  methods: {
    showClick(banner, idx) {
      this.$bus.$emit('click:show', idx);
    },
    upItem(idx) {
      const tmp = util.copyObj(this.items[idx]);
      this.items.splice(idx, 1);
      this.items.splice(idx - 1, 0, tmp);
    },
    downItem(idx) {
      const tmp = util.copyObj(this.items[idx]);
      this.items.splice(idx, 1);
      this.items.splice(idx + 1, 0, tmp);
    },
    delItem(idx) {
      this.items.splice(idx, 1);
    },
    addItem() {
      if (this.items.length < 10) {
        this.items.push(util.copyObj(this.defaultConf.action.config[0]));
      } else {
        this.$alert('最多添加10个滚动项！');
      }
    },
  },
};
</script>

<style lang="scss"></style>
