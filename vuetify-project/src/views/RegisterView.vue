<!-- src/views/RegisterView.vue -->
<template>
  <v-container class="fill-height justify-center">
    <v-card width="400" class="pa-4" elevation="4">
      <v-card-title class="text-h5 text-center font-weight-bold">
        Crear Cuenta
      </v-card-title>

      <v-card-text>
        <v-alert v-if="msg" :type="msgType" variant="tonal" class="mb-4" closable>
          {{ msg }}
        </v-alert>

        <v-form @submit.prevent="handleRegister">
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
            color="success"
            block
            size="large"
            :loading="loading"
            class="mt-2"
          >
            Registrarse
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn variant="text" to="/login">
          ¿Ya tienes cuenta? Inicia Sesión
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const msg = ref('');
const msgType = ref<'success' | 'error'>('error');

const form = reactive({
  username: '',
  password: '',
});

const handleRegister = async () => {
  loading.value = true;
  msg.value = '';

  try {
    const res = await authStore.register(form);
    msgType.value = 'success';
    msg.value = res.message + ' Redirigiendo al login...';
    setTimeout(() => router.push('/login'), 1500);
  } catch (err: any) {
    msgType.value = 'error';
    msg.value = err.response?.data?.message || 'Error al registrar usuario';
  } finally {
    loading.value = false;
  }
};
</script>