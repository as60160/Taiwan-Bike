import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import bootstrap from "bootstrap";

createApp(App).use(store).use(router).use(bootstrap).mount("#app");