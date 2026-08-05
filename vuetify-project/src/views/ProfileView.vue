<!-- src/views/ProfileView.vue -->
<template>
  <v-container class="mt-10">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Perfil de Usuario</span>
            <v-btn color="error" variant="outlined" prepend-icon="mdi-logout" @click="handleLogout">
              Cerrar Sesión
            </v-btn>
          </v-card-title>

          <v-divider class="my-3"></v-divider>

          <v-card-text>
            <p class="text-subtitle-1"><strong>ID:</strong> {{ authStore.user?.id }}</p>
            <p class="text-subtitle-1"><strong>Usuario:</strong> {{ authStore.user?.username }}</p>

            <v-expansion-panels class="mt-6">
              <v-expansion-panel title="Cambiar Contraseña">
                <v-expansion-panel-text>
                  <v-alert v-if="msg.text" :type="msg.type" variant="tonal" class="mb-3">
                    {{ msg.text }}
                  </v-alert>

                  <v-form @submit.prevent="handleChangePassword">
                    <v-text-field
                      v-model="pwdForm.currentPassword"
                      label="Contraseña Actual"
                      type="password"
                      variant="outlined"
                    />
                    <v-text-field
                      v-model="pwdForm.newPassword"
                      label="Nueva Contraseña"
                      type="password"
                      variant="outlined"
                    />
                    <v-btn type="submit" color="warning" block :loading="loadingPwd">
                      Actualizar
                    </v-btn>
                  </v-form>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const loadingPwd = ref(false);
const msg = reactive({ text: '', type: 'success' as 'success' | 'error' });

const pwdForm = reactive({
  currentPassword: '',
  newPassword: '',
});

const handleChangePassword = async () => {
  loadingPwd.value = true;
  msg.text = '';
  try {
    const res = await authStore.changePassword(pwdForm);
    msg.text = res.message;
    msg.type = 'success';
    pwdForm.currentPassword = '';
    pwdForm.newPassword = '';
  } catch (err: any) {
    msg.text = err.response?.data?.message || 'Error al cambiar contraseña';
    msg.type = 'error';
  } finally {
    loadingPwd.value = false;
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>