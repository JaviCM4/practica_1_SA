<!-- src/views/PublicView.vue -->
<template>
  <v-container class="mt-10 text-center">
    <v-card class="pa-6" elevation="2">
      <v-icon icon="mdi-earth" size="64" color="info" class="mb-2" />
      <v-card-title class="text-h4">Página Pública</v-card-title>
      <v-card-text class="text-body-1">
        Cualquier persona puede ver esta página sin necesidad de iniciar sesión.
      </v-card-text>
      <v-card-actions class="justify-center mt-4">
        <v-btn color="primary" variant="elevated" to="/login" prepend-icon="mdi-login">
          Ir al Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>