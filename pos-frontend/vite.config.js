import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/allProducts': 'http://localhost:3000',
      '/deleteProduct': 'http://localhost:3000',
      '/createProduct': 'http://localhost:3000',
      '/updateProduct': 'http://localhost:3000',

      '/createNewOrder': 'http://localhost:3000',
      '/paymentOrder': 'http://localhost:3000',
      '/resetNewOrder': 'http://localhost:3000',

      '/allTotal': 'http://localhost:3000',
      '/resetOrder': 'http://localhost:3000'
    }
  }
})
