<template>
  <el-dialog
    class="preview-dialog"
    title="页面预览"
    :close-on-click-modal="false"
    :append-to-body="false"
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    width="395px"
  >
    <el-row>
      <el-col :span="12" style="text-align: center; width: 375px; background-color: #f2f3f4">
        <div class="phone">
          <template v-for="comp in cpnList">
            <component :is="comp.type" :component="comp"></component>
          </template>
        </div>

        <div class="pre-desc">
          <h3 style="color: red">预览说明：</h3>
          <p>1、部分组件尚未实现预览；</p>
          <p>2、组件尚未点击效果；</p>
          <p>3、预览仅供参考，不代表真机效果；</p>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    cpnList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      visible: this.show,
    };
  },
  watch: {
    show(val) {
      if (val && document.getElementById('ifr-preview')) {
        document.getElementById('ifr-preview').contentWindow.location.reload(true);
      }
      this.visible = this.show;
    },
  },
  methods: {
    cancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss">
.preview-dialog {
  .el-dialog {
    border-radius: 10px !important;
  }

  .el-dialog__body {
    padding: 0 10px 50px 10px !important;

    .pre-desc {
      position: absolute;
      left: 110%;
      top: 20%;
      width: 180px;
      height: 250px;
      padding: 10px;
      background-color: #fff;

      > p {
        margin: 0;
        text-align: left;
        line-height: 1.5;
      }
    }

    .phone {
      display: block;
      border: none;
      outline: 1px solid #e8e8e8;
      width: 375px;
      height: 630px;
      overflow: auto;
      padding: 0;
      background: white;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
