<template>
  <div class="app-body">
    <app-sidebar></app-sidebar>
    <div class="app-main">
      <app-toolbar
        v-on:showPageSet="showPageSet"
        v-on:savePageSet="savePageSet"
        v-on:showPreview="showPreview"
      ></app-toolbar>
      <div class="scroll-y">
        <div
          class="app-phone"
          @dragover.self="dragPhoneOver"
          @dragleave.self="dragPhoneLeave"
          @drop.self="dropPhone"
          @dragover.prevent
        >
          <!--占位提示控件-->
          <div
            class="place-holder"
            @dragover.stop="dragover"
            @dragleave.stop="dragleave"
            @drop.stop="drop"
            @dragover.prevent
          >
            放在这里
          </div>

          <template v-for="(comp, idx) in compList">
            <div
              :class="['tpl-container', comp.active ? 'current' : '']"
              :data-index="idx"
              @click.capture="clickComp"
            >
              <component :is="comp.type" :component="comp"></component>

              <!--控件操作-->
              <div class="comp-menu">
                <a
                  href="javascript:void(0)"
                  :class="[idx == 0 ? 'disabled' : '']"
                  @click="upComp(idx)"
                >
                  <span class="tips">上移</span>
                  <i class="fa fa-arrow-circle-up"></i>
                </a>
                <a
                  href="javascript:void(0)"
                  :class="[idx == compList.length - 1 ? 'disabled' : '']"
                  @click="downComp(idx)"
                >
                  <span class="tips">下移</span>
                  <i class="fa fa-arrow-circle-down"></i>
                </a>
                <a href="javascript:void(0)" @click="delComp(idx)">
                  <span class="tips">删除</span>
                  <i class="fa fa-trash"></i>
                </a>
              </div>
            </div>

            <div
              class="place-holder"
              @dragover.stop="dragover"
              @dragleave.stop="dragleave"
              @drop.stop="drop"
              @dragover.prevent
              :data-index="idx"
            >
              放在这里
            </div>
          </template>
        </div>

        <!--底部导航控件-->
        <div
          v-if="bottomMenu"
          :class="['absolute-tpl', bottomMenu.active ? 'current' : '']"
          @click="clickBtmMenu"
        >
          <bottom-menu :component="bottomMenu"></bottom-menu>
          <div class="comp-menu">
            <a href="javascript:void(0)" @click="delBtmMenu">
              <span class="tips">删除</span>
              <i class="fa fa-trash"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <preview-dialog :show.sync="previewShow" :cpnList="compList"></preview-dialog>

    <app-opt v-if="currentConfig" :option="currentConfig"></app-opt>
    <app-page-opt v-else :option="pageConfig"></app-page-opt>

    <click-config
      :show.sync="clickShow"
      :option="currentConfig"
      :comps="compList"
      :index="click.index"
      :tabs="click.tabs"
    ></click-config>
  </div>
</template>

<script>
import util from '@/utils/util.js';
import appSidebar from '@/views/layout/sidebar.vue';
import appToolbar from '@/views/layout/toolbar.vue';
import appOpt from '@/views/layout/option.vue';
import appPageOpt from '@/views/layout/pageOption.vue';
import clickConfig from '@/common/ClickConfig.vue';
import previewDialog from '@/common/PreviewDialog.vue';
// 页面默认配置
import pageOption from '@/config/page.config.js';
// 组件默认配置
import compConfig from '@/config/comp.config.js';

export default {
  name: 'AppMain',
  components: {
    appSidebar,
    appToolbar,
    appOpt,
    appPageOpt,
    clickConfig,
    previewDialog,
  },
  data() {
    return {
      clickShow: false,
      previewShow: false,
      click: {
        index: 0,
        tabs: [],
      },
      compList: [],
      bottomMenu: null,
      pageConfig: util.copyObj(pageOption),
      currentIndex: -1,
      currentConfig: null,
    };
  },
  mounted() {
    this.$bus.$on('click:show', (idx, tabs) => {
      this.click.index = idx;
      if (Array.isArray(tabs) && tabs.length) this.click.tabs = tabs;
      else this.click.tabs = ['outside', 'page', 'tel'];
      this.clickShow = true;
    });
    this.$bus.$on('click:submit', (idx, config) => {
      if (idx > -1 && config) {
        if (this.currentIndex >= 0) {
          this.compList[this.currentIndex].action.config[idx].click = config;
        } else if (this.currentIndex === -2) {
          // 底部导航栏点击配置
          this.bottomMenu.action.config[idx].click = config;
        }
      }
    });
    this.readLocalData();
    this.showPageSet();
  },
  watch: {
    compList: {
      handler(val) {
        if (val && val.length > 1) {
          localStorage.setItem(
            'pageDateSet',
            JSON.stringify({
              time: Date.now(),
              menu: this.bottomMenu,
              config: val,
            }),
          );
        }
      },
      deep: true,
    },
    bottomMenu: {
      handler(val) {
        localStorage.setItem(
          'pageDateSet',
          JSON.stringify({
            time: Date.now(),
            menu: val,
            config: this.compList,
          }),
        );
      },
    },
  },
  methods: {
    showPageSet() {
      this.resetCompUnchecked();
      this.currentIndex = -1;
      this.currentConfig = null;
    },
    savePageSet() {
      console.warn('save Info: ', JSON.stringify(this.compList));
      this.$message({
        message: '打开chomre devtool查看保存的信息！',
        type: 'success',
      });
    },
    showPreview() {
      localStorage.setItem('pageConfig', JSON.stringify(this.pageConfig));
      this.previewShow = true;
    },
    readLocalData() {
      const tmp = localStorage.getItem('pageDateSet');
      if (tmp) {
        const localData = JSON.parse(tmp);
        const t = util.parseTime(localData.time);
        this.$confirm('您有一份【' + t + '】未保存的编辑内容, 是否恢复到当前编辑界面？', '提示', {
          confirmButtonText: '载入',
          cancelButtonText: '丢弃',
          type: 'warning',
          center: true,
        })
          .then(() => {
            this.compList = localData.config;
            this.bottomMenu = localData.menu;
            this.resetCompUnchecked();
          })
          .catch(() => {
            localStorage.setItem('pageDateSet', '');
          });
      }
    },
    resetCompUnchecked() {
      if (this.bottomMenu) this.bottomMenu.active = false;
      this.compList.forEach((val) => {
        if (val.active) {
          val.active = false;
        }
      });
    },
    addComp(index, key) {
      const comp = util.copyObj(compConfig[key]);
      const config = {
        type: key,
        active: true,
        domId: key + '-' + util.createDomID(),
      };
      Object.assign(comp, config);
      this.compList.splice(index + 1, 0, comp);
      // 显示配置项
      this.currentIndex = index + 1;
      this.currentConfig = comp;
    },
    addBottomMenu() {
      const comp = util.copyObj(compConfig['bottom-menu']);
      const config = {
        type: 'bottom-menu',
        active: true,
        domId: 'bottom-menu-' + util.createDomID(),
      };
      Object.assign(comp, config);
      this.bottomMenu = comp;
      // 显示配置项
      this.currentIndex = -1;
      this.currentConfig = comp;
    },
    clickComp(e) {
      if (this.bottomMenu) this.bottomMenu.active = false;
      const idx = parseInt(e.currentTarget.dataset.index);
      this.compList.forEach((val, index) => {
        if (index === idx) {
          val.active = true;
          this.currentIndex = index;
          this.currentConfig = val;
        } else {
          val.active = false;
        }
      });
    },
    clickBtmMenu() {
      this.resetCompUnchecked();
      if (this.bottomMenu) this.bottomMenu.active = true;
      this.currentIndex = -2;
      this.currentConfig = this.bottomMenu;
    },
    delBtmMenu() {
      this.bottomMenu = null;
      // 显示页面配置参数
      this.showPageSet();
    },
    upComp(idx) {
      if (idx < 1) return false;
      // 复制当前控件
      const tmp = util.copyObj(this.compList[idx]);
      // 再删除控件+占位坑
      this.compList.splice(idx, 1);
      // 再插入控件
      this.compList.splice(idx - 1, 0, tmp);
      // 显示当前组件配置
      this.currentIndex = idx - 1;
      this.currentConfig = this.compList[idx - 1];
    },
    downComp(idx) {
      if (idx === this.compList.length - 1) {
        return false;
      }
      // 复制当前控件
      const tmp = util.copyObj(this.compList[idx]);
      // 再删除控件
      this.compList.splice(idx, 1);
      // 再插入控件
      this.compList.splice(idx + 1, 0, tmp);
      // 显示当前组件配置
      this.currentIndex = idx + 1;
      this.currentConfig = this.compList[idx + 1];
    },
    delComp(idx) {
      // 删除控件
      this.compList.splice(idx, 1);
      // 显示页面配置参数
      this.showPageSet();
    },
    dragover(e) {
      const target = e.target;
      if (!target.classList.contains('active')) target.classList.add('active');
    },
    drop(e) {
      const target = e.target;
      target.classList.remove('active');
      const key = e.dataTransfer.getData('cmp-type');
      if (key === 'bottom-menu') return;
      const idx = parseInt(target.dataset.index);
      if (compConfig[key]) {
        this.resetCompUnchecked();
        this.addComp(idx, key);
      } else {
        this.$message.warning('没有查询到该组件的配置信息。。。');
      }
    },
    dragleave(e) {
      e.target.classList.remove('active');
    },
    dragPhoneOver() {
      const target = document.querySelector('.place-holder:last-child');
      if (target && !target.classList.contains('active')) target.classList.add('active');
    },
    dropPhone(e) {
      const target = document.querySelector('.place-holder:last-child');
      if (target) {
        target.classList.remove('active');
        const key = e.dataTransfer.getData('cmp-type');
        const idx = parseInt(target.dataset.index);
        if (compConfig[key]) {
          if (key === 'bottom-menu') {
            if (this.bottomMenu) {
              this.$message.info('已经存在一个底部导航组件了，请勿重复添加！');
            } else {
              this.addBottomMenu();
            }
          } else {
            this.resetCompUnchecked();
            this.addComp(idx, key);
          }
        } else {
          this.$message.warning('没有查询到该组件的配置信息。。。');
        }
      }
    },
    dragPhoneLeave() {
      const target = document.querySelector('.place-holder:last-child');
      target && target.classList.remove('active');
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  flex: 1;
  min-width: 377px;
  background-color: #f2f3f4;

  .scroll-y {
    position: absolute;
    top: 40px;
    bottom: 0;
    width: 100%;
    padding-top: 30px;
    padding-bottom: 30px;
    overflow-y: auto;
  }

  .app-phone {
    position: relative;
    box-sizing: border-box;
    width: 377px;
    min-height: 667px;
    padding-bottom: 200px;
    margin: 0 auto;
    background-color: #fff;
    transform: translateX(-20px);

    .place-holder {
      position: relative;
      display: block;
      height: 10px;
      text-align: center;
      font-size: 0;
      background: #fff;
      background-image: linear-gradient(#fff 2px, transparent 0),
        linear-gradient(90deg, #999 1px, transparent 0);
      background-size: 3px 3px, 3px 3px;

      &.active {
        height: 40px;
        line-height: 40px;
        border: 1px dashed #f32e37;
        background-color: #ffe800;
        background-image: none;
        color: #333;
        font-size: 14px;
        margin: 0;
      }
    }

    .tpl-container {
      position: relative;
      width: 100%;
      background-color: transparent;
      border: 1px solid #f2f3f4;
      transition: opacity 0.1s ease-out;
      user-select: none;
      box-sizing: border-box;
      z-index: auto;
      opacity: 1;
      cursor: pointer;

      &.current {
        border: 1px solid #2aa7ff;

        .comp-menu {
          display: block;
        }
      }

      .comp-content {
        position: relative;
      }
    }
  }

  .comp-menu {
    position: absolute;
    display: none;
    top: 0;
    right: -38px;
    width: 32px;

    > a {
      display: inline-block;
      position: relative;
      width: 36px;
      height: 36px;
      margin-bottom: 2px;
      text-align: center;
      color: #666;
      background: #fff;
      font-size: 18px;
      line-height: 36px;

      &.disabled {
        color: #e4e4e4;
      }

      &:hover {
        &.disabled {
          color: #e4e4e4;
        }
        color: #333;
        .tips {
          display: block;
        }
      }

      .tips {
        font-size: 12px;
        position: absolute;
        left: 120%;
        background-color: #111;
        height: 18px;
        padding: 0 5px;
        line-height: 19px;
        border-radius: 2px;
        white-space: nowrap;
        display: none;
        color: #eee;
        top: 5px;

        &::before {
          content: ' ';
          display: block;
          position: absolute;
          left: -5px;
          top: 4.5px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 5px 6px 5px 0;
          border-color: transparent #111 transparent transparent;
        }
      }
    }
  }

  .absolute-tpl {
    width: 377px;
    margin: 0 auto;
    transform: translateX(-20px);
    border-top: 1px solid #e8e8e8;

    &.current {
      border: 1px solid #2aa7ff;

      .comp-menu {
        display: block;
      }
    }
  }
}
</style>
