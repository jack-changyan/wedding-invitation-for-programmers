import Vue from "vue";
import Wedding from "./Wedding.vue";
import AV from "leancloud-storage";
AV.init({
  appId: "eH874D8yaZFzq2C25vuB7lN2-gzGzoHsz",
  appKey: "ZIS301rBjFyAa4pOUH9W7j6D",
  serverURL: "https://eh874d8y.lc-cn-n1-shared.com",
});
AV.debug.disable();
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(Wedding),
});
