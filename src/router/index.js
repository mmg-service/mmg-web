import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignUpview from '../views/SignUpView.vue'
import MapView from '../components/map/MapView.vue'
import SearchView from '../views/SearchView.vue'
import DetailView from '../views/DetailView.vue'
import FilteredResultView from '../views/FilteredResultView.vue'
import CurationView from '../views/CurationView.vue'
import MenuOrderView from '../views/MenuOrderView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUpview
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/MapView.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchView
  },
  {
    path: '/restaurant/:id',
    name: 'Detail',
    component: DetailView,
    props: true
  },
  {
    path: '/filtered-results',
    name: 'FilteredResults',
    component: FilteredResultView
  },
  {
    path: '/curation',
    name: 'Curation',
    component: CurationView
  },
  {
    path: '/order',
    name: 'MenuOrder',
    component: MenuOrderView,
    meta: { reload: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// 인증이 필요한 라우트를 위한 네비게이션 가드
router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register']
//   const authRequired = !publicPages.includes(to.path)
//   const loggedIn = localStorage.getItem('user')

//   if (authRequired && !loggedIn) {
//     return next('/login')
//   }

  next()
})

router.afterEach((to, from) => {
  // 1) /order에 진입했고, 아직 리로드되지 않았다면
  if (to.meta.reload && !sessionStorage.getItem('reloaded-order')) {
    sessionStorage.setItem('reloaded-order', 'true');
    window.location.reload();
  }
  // 2) /order에서 다른 페이지로 나갈 때 플래그 초기화
  if (from.meta.reload) {
    sessionStorage.removeItem('reloaded-order');
  }
});

export default router