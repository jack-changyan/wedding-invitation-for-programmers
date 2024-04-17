import Vue from "vue";
import Wedding from "./Wedding.vue";
import AV from "leancloud-storage";
AV.init({
  appId: "",
  appKey: "",
  serverURL: "",
});
AV.debug.disable();
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(Wedding),
});
