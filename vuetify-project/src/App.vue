<template>
  <v-app>
    <v-app-bar color="primary" density="compact" elevation="1">
      <v-app-bar-title>Mi Aplicación</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn to="/public" variant="text">Pública</v-btn>
      <v-btn v-if="!authStore.isAuthenticated" to="/login" variant="text">Login</v-btn>
      <v-btn v-if="!authStore.isAuthenticated" to="/register" variant="text">Registro</v-btn>
      <v-btn v-if="authStore.isAuthenticated" to="/profile" variant="text">Perfil</v-btn>
      <v-btn v-if="authStore.isAuthenticated" to="/private" variant="text">Privada</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Al montar el componente raíz (cuando Pinia ya está 100% encendido),
// comprobamos si hay una cookie activa en el navegador:
onMounted(async () => {
  await authStore.fetchProfile();
});
</script>