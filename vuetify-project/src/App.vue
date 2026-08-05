<!-- src/App.vue -->
<template>
  <v-app>
    <v-app-bar color="primary" density="compact" elevation="2">
      <v-app-bar-title class="text-subtitle-1 font-weight-bold">
        Auth Demo
      </v-app-bar-title>

      <!-- SWITCH PARA CAMBIAR DE BACKEND -->
      <v-btn-toggle
        :model-value="authStore.mode"
        @update:model-value="authStore.setMode"
        mandatory
        rounded="pill"
        density="compact"
        class="mx-4"
        color="secondary"
      >
        <v-btn value="session" size="small" prepend-icon="mdi-cookie">
          Express (Cookie)
        </v-btn>
        <v-btn value="jwt" size="small" prepend-icon="mdi-key">
          Spring Boot (JWT)
        </v-btn>
      </v-btn-toggle>

      <v-spacer></v-spacer>

      <!-- BOTONES DE NAVEGACIÓN -->
      <v-btn to="/public" variant="text">Pública</v-btn>
      <v-btn v-if="!authStore.isAuthenticated" to="/login" variant="text">Login</v-btn>
      <v-btn v-if="!authStore.isAuthenticated" to="/register" variant="text">Registro</v-btn>
      <v-btn v-if="authStore.isAuthenticated" to="/profile" variant="text">Perfil</v-btn>
      <v-btn v-if="authStore.isAuthenticated" to="/private" variant="text">Privada</v-btn>
    </v-app-bar>

    <v-main>
      <v-alert
        :color="authStore.mode === 'session' ? 'info' : 'warning'"
        variant="tonal"
        density="compact"
        class="text-center rounded-0"
      >
        Backend activo: 
        <strong>{{ authStore.mode === 'session' ? 'Express (localhost:3000 - Sesiones)' : 'Spring Boot (localhost:8080 - JWT)' }}</strong>
      </v-alert>

      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchProfile();
});
</script>