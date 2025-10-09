import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_URL; // e.g., http://localhost:3000
  return {
    plugins: [react()],
    server: {
      proxy: target
        ? {
            '/auth': { target, changeOrigin: true, secure: false },
            '/admin': { target, changeOrigin: true, secure: false },
          }
        : undefined,
    },
  };
});
