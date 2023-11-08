import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from 'axios'

const app = createApp(App);

app.use(Antd).mount('#app');
app.use(VueAxios, axios)