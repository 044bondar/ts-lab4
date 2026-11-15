import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AuthUser, LoginDto } from '@/types/auth';
import { ServiceProvider } from '@/services/service-provider';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    const accessToken = ref<string | null>(localStorage.getItem('accessToken'));

    const isAuthenticated = computed(() => !!accessToken.value);

    async function login(credentials: LoginDto) {
        const response = await ServiceProvider.auth.login(credentials);
        user.value = response;
        accessToken.value = response.accessToken;

        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
    }

    function logout() {
        user.value = null;
        accessToken.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    return { user, accessToken, isAuthenticated, login, logout };
});