import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user';
import { ServiceProvider } from '@/services/service-provider';

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([]);
    const total = ref(0);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchUsers(params: { limit?: number; skip?: number; q?: string } = {}) {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await ServiceProvider.users.getAll(params);
            users.value = res.items;
            total.value = res.total;
        } catch (e) {
            error.value = (e as Error).message;
        } finally {
            isLoading.value = false;
        }
    }

    async function addUser(dto: CreateUserDto) {
        const created = await ServiceProvider.users.create(dto);
        users.value.unshift({ ...created, id: Date.now() });
        total.value += 1;
    }

    async function updateUser(id: number, dto: UpdateUserDto) {
        await ServiceProvider.users.update(id, dto);
        const index = users.value.findIndex((u) => u.id === id);
        if (index !== -1) {
            users.value[index] = { ...users.value[index], ...dto } as User;
        }
    }

    async function removeUser(id: number) {
        await ServiceProvider.users.delete(id);
        users.value = users.value.filter((u) => u.id !== id);
        total.value -= 1;
    }

    return { users, total, isLoading, error, fetchUsers, addUser, updateUser, removeUser };
});