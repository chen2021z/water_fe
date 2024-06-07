import App from './App'
import io from '@hyoga/uni-socket.io'
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
// 全局组件
import divider from '@/components/common/divider.vue'
// 引入请求库
import $H from './common/request.js';
import config from "@/common/config.js"


const socket = io.connect(config.websocketUrl, {
	query: {},
	transports: ['websocket', 'polling'],
	timeout: 5000,
})
Vue.component('divider',divider)
Vue.prototype.$H = $H
Vue.prototype.$socket = socket;










try {
  function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }

  // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });
} catch (error) { }

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif