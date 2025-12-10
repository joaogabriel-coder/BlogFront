// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path'; // Importe 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define que '@' aponta para o diretório 'src'
      "@": path.resolve(__dirname, "./src"), 
    },
  },
});