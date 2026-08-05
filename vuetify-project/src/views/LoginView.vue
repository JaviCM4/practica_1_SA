<!-- src/views/LoginView.vue -->
<template>
  <v-container class="fill-height justify-center">
    <v-card width="400" class="pa-4" elevation="4">
      <v-card-title class="text-h5 text-center font-weight-bold">
        Iniciar Sesión
      </v-card-title>

      <v-card-text>
        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable>
          {{ errorMessage }}
        </v-alert>

        <v-form @submit.prevent="handleLogin" ref="formRef">
          <v-text-field
            v-model="form.username"
            label="Usuario"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            required
          />

          <v-text-field
            v-model="form.password"
            label="Contraseña"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            required
          />

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
            class="mt-2"
          >
            Ingresar
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn variant="text" to="/register">
          ¿No tienes cuenta? Regístrate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const errorMessage = ref('');

const form = reactive({
  username: '',
  password: '',
});

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(form);
    // Tras el login exitoso, la cookie connect.sid ya fue guardada por el navegador.
    // Redirigimos al perfil:
    router.push('/profile');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};
</script>