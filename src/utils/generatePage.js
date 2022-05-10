export function generatePage(config) {
  config = JSON.stringify(config);
  const componentsUrl = import.meta.env.VITE_APP_COMPONETS_URL;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <meta content="telephone=no,email=no" name="format-detection">
  <meta http-equiv="Cache-Control" content="no-siteapp">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <style>
      .intersecting-circles-spinner-wrapper {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .intersecting-circles-spinner,
      .intersecting-circles-spinner * {
        box-sizing: border-box;
      }
      .intersecting-circles-spinner {
        height: 70px;
        width: 70px;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      .intersecting-circles-spinner .spinnerBlock {
        animation: intersecting-circles-spinners-animation 1200ms linear infinite;
        transform-origin: center;
        display: block;
        height: 35px;
        width: 35px;
      }
      .intersecting-circles-spinner .circle {
        display: block;
        border: 2px solid #ff1d5e;
        border-radius: 50%;
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
      .intersecting-circles-spinner .circle:nth-child(1) {
        left: 0;
        top: 0;
      }
      .intersecting-circles-spinner .circle:nth-child(2) {
        left: calc(35px * -0.36);
        top: calc(35px * 0.2);
      }
      .intersecting-circles-spinner .circle:nth-child(3) {
        left: calc(35px * -0.36);
        top: calc(35px * -0.2);
      }
      .intersecting-circles-spinner .circle:nth-child(4) {
        left: 0;
        top: calc(35px * -0.36);
      }
      .intersecting-circles-spinner .circle:nth-child(5) {
        left: calc(35px * 0.36);
        top: calc(35px * -0.2);
      }
      .intersecting-circles-spinner .circle:nth-child(6) {
        left: calc(35px * 0.36);
        top: calc(35px * 0.2);
      }
      .intersecting-circles-spinner .circle:nth-child(7) {
        left: 0;
        top: calc(35px * 0.36);
      }
      @keyframes intersecting-circles-spinners-animation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    </style>
  <style>
    :root, body {
      margin: 0;
      padding: 0;
    }

    #main {
      max-width: 750px;
      margin: auto;
      box-shadow: 0 0 10px 10px #f5f5f5;
    }
  </style>
</head>
<body>
<div id="app">
  <div class="intersecting-circles-spinner-wrapper">
        <div class="intersecting-circles-spinner">
          <div class="spinnerBlock">
            <span class="circle"></span>
            <span class="circle"></span>
            <span class="circle"></span>
            <span class="circle"></span>
            <span class="circle"></span>
            <span class="circle"></span>
            <span class="circle"></span>
          </div>
        </div>
      </div>
</div>
<script src="https://cdn.staticfile.org/vue/2.6.9/vue.min.js"></script>
<script src="${componentsUrl}"></script>
<script>
  /*
  * npm run components后把这个文件放dist里面，就可以看到生成的页面了
  * */
  const config = ${config};
  components.install(Vue);
  new Vue({
    template: \`
      <div id="main" :style="appStyle">
      <template v-for="(comp, idx) in config.components">
        <component :is="comp.type" :component="comp"></component>
      </template>
      </div>\`,
    data() {return {config:config}},
    computed: {
    appStyle() {
      const style = config.page.style.reduce((prev, cur) => {
        prev[cur.attr] = (cur.val || '') + (cur.unit || '');
        return prev;
      }, {});
      if (style.background) {
        style.background = \`url(\${style.background})\`;
      }
      return style;
    },
  },
  }).$mount('#app')
</script>
</body>
</html>
`;
}
