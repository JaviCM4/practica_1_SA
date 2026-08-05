import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ProfileView from '@/views/ProfileView.vue';
import PublicView from '@/views/PublicView.vue';
import PrivateView from '@/views/PrivateView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/public', component: PublicView },
    { path: '/login', component: LoginView, meta: { requiresGuest: true } },
    { path: '/register', component: RegisterView, meta: { requiresGuest: true } },
    { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/private', component: PrivateView, meta: { requiresAuth: true } },
    { path: '/', redirect: '/public' }
  ],
});

// Guardián de rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/profile');
  } else {
    next();
  }
});

export default router;