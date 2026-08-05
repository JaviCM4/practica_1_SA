import type { App } from 'vue' // Types
import vuetify from './vuetify' // Plugins

export function registerPlugins (app: App) {
  app.use(vuetify)
}
