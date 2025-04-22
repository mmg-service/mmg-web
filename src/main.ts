import { createApp } from 'vue';
import App from './App.tsx';
import router from './router';
import './styles/global.css';

const app = createApp(App);

// 라우터 등록
app.use(router);

// 앱 마운트
app.mount('#app');