import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/api/axios';
import type { User, LoginRequest, RegisterRequest, ChangePasswordRequest, AuthResponse } from '@/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isChecked = ref(false); // Para saber si ya comprobamos la sesión al cargar la app

  const isAuthenticated = computed(() => user.value !== null);

  // 1. Iniciar Sesión
  async function login(credentials: LoginRequest) {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.user) {
      user.value = response.data.user;
    }
    return response.data;
  }

  // 2. Registrar Usuario
  async function register(credentials: RegisterRequest) {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  }

  // 3. Obtener Perfil (Comprobar si la sesión sigue activa)
  async function fetchProfile() {
    try {
      const response = await api.get<User>('/auth/profile');
      user.value = response.data;
    } catch (error) {
      user.value = null; // Si da 401 o falla, el usuario no está autenticado
    } finally {
      isChecked.value = true;
    }
  }

  // 4. Cambiar Contraseña
  async function changePassword(data: ChangePasswordRequest) {
    const response = await api.put<AuthResponse>('/auth/change-password', data);
    return response.data;
  }

  // 5. Cerrar Sesión
  async function logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      user.value = null; // Limpiamos el estado en el frontend
    }
  }

  return {
    user,
    isChecked,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    changePassword,
    logout,
  };
});