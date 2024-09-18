import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import { Ion } from "cesium";

Ion.defaultAccessToken = import.meta.env.VITE_ION_ACCESS_TOKEN;

createApp(App).mount("#app");
