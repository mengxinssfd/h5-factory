import Vue from 'vue';
import App from './App';
import 'normalize.css/normalize.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import Components from './components';

Vue.use(ElementUI, {
  size: 'small',
});

const eventBus = {
  install(Vue) {
    Vue.prototype.$bus = new Vue();
  },
};
Vue.use(eventBus);
Vue.use(Components);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
