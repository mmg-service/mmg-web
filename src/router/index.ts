import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// 라우트 정의
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login' // 루트 경로를 /login으로 리다이렉트
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index')
  },
//   {
//     path: '/home',
//     name: 'Home',
//     component: () => import('../views/home/index'),
//     meta: { requiresAuth: true } // 인증이 필요한 라우트
//   },
//   {
//     path: '/register',
//     name: 'Register',
//     component: () => import('../views/register/index')
//   },
//   {
//     path: '/forgot-password',
//     name: 'ForgotPassword',
//     component: () => import('../views/forgot-password/index')
//   },
  // 존재하지 않는 경로에 대한 처리
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

// 라우터 인스턴스 생성
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 네비게이션 가드 설정 (인증 확인)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('token');

  // 인증이 필요한 페이지이고 로그인되어 있지 않은 경우
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;