import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiSession, apiJwt } from '@/api/axios';

export type AuthMode = 'session' | 'jwt';

export const useAuthStore = defineStore('auth', () => {
  // Guardamos el modo seleccionado ('session' o 'jwt')
  const mode = ref<AuthMode>((localStorage.getItem('auth_mode') as AuthMode) || 'session');
  const user = ref<any>(null);
  const jwtToken = ref<string | null>(localStorage.getItem('jwt_token'));

  // Estado de autenticación
  const isAuthenticated = computed(() => {
    if (mode.value === 'session') return user.value !== null;
    return jwtToken.value !== null;
  });

  // Cambiar de backend/modo
  function setMode(newMode: AuthMode) {
    logout(); // Limpiamos sesión previa al cambiar de modo
    mode.value = newMode;
    localStorage.setItem('auth_mode', newMode);
  }

  // 1. LOGIN DUAL
  async function login(credentials: any) {
    if (mode.value === 'session') {
      // Express
      const res = await apiSession.post('/auth/login', credentials);
      user.value = res.data.user;
      return res.data;
    } else {
      // Spring Boot JWT
      const res = await apiJwt.post('/auth/login', credentials);
      // Asumiendo que Spring responde { token: "..." } o similar
      const token = res.data.token || res.data; 
      jwtToken.value = token;
      localStorage.setItem('jwt_token', token);
      user.value = { username: credentials.username }; 
      return res.data;
    }
  }

  // 2. REGISTRO DUAL
  async function register(data: any) {
    const client = mode.value === 'session' ? apiSession : apiJwt;
    const res = await client.post('/auth/register', data);
    return res.data;
  }

  // 3. CAMBIAR CONTRASEÑA DUAL
  async function changePassword(data: any) {
    if (mode.value === 'session') {
      // Express (PUT /auth/change-password)
      const res = await apiSession.put('/auth/change-password', data);
      return res.data;
    } else {
      // Para Spring Boot construimos el objeto completo con userId
      const payload = {
        userId: user.value?.id || 1, // Envia el ID del usuario logueado
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      await apiJwt.patch('/auth/password', payload);
      return { message: 'Contraseña actualizada correctamente en Spring Boot.' };
    }
  }

  // 4. VERIFICAR PERFIL
  async function fetchProfile() {
    if (mode.value === 'session') {
      try {
        const res = await apiSession.get('/auth/profile');
        user.value = res.data;
      } catch {
        user.value = null;
      }
    } else {
      // En JWT, si tenemos token en localStorage mantenemos la sesión del front
      if (!jwtToken.value) {
        user.value = null;
      }
    }
  }

  // 5. LOGOUT DUAL
  async function logout() {
    if (mode.value === 'session') {
      try { await apiSession.post('/auth/logout'); } catch {}
    } else {
      try { await apiJwt.post('/auth/logout'); } catch {}
      jwtToken.value = null;
      localStorage.removeItem('jwt_token');
    }
    user.value = null;
  }

  return {
    mode,
    setMode,
    user,
    isAuthenticated,
    login,
    register,
    changePassword,
    fetchProfile,
    logout,
  };
});