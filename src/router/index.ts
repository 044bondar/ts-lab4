import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
            meta: { title: 'Головна — Vue Lottery', layout: 'default' },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/AboutView.vue'),
            meta: { title: 'Про автора — Vue Lottery', layout: 'default' },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: { title: 'Авторизація — Vue Lottery', layout: 'auth', guestOnly: true },
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('@/views/UsersView.vue'),
            meta: { title: 'Користувачі — Vue Lottery', layout: 'default', requiresAuth: true },
        },
        {
            path: '/users/:id',
            name: 'user-detail',
            component: () => import('@/views/UserDetailView.vue'),
            props: true,
            meta: { title: 'Профіль користувача', layout: 'default', requiresAuth: true },
            children: [
                {
                    path: 'edit',
                    name: 'user-edit',
                    component: () => import('@/views/UserEditView.vue'),
                    meta: { title: 'Редагування користувача', layout: 'default', requiresAuth: true },
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
            meta: { title: '404 — Сторінку не знайдено', layout: 'default' },
        },
    ],
});

// Захист маршрутів
router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: 'login', query: { redirect: to.fullPath } };
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
        return { name: 'users' };
    }
});

// Динамічна зміна заголовка вкладки
router.afterEach((to) => {
    document.title = (to.meta.title as string) || 'Vue Lottery App';
});

export default router;