// vite.config.js
import path from 'path';
import checker from 'file:///Users/rcglezreyes/Documents/maestria/HCI/project_hci/frontend/node_modules/vite-plugin-checker/dist/esm/main.js';
import { defineConfig } from 'file:///Users/rcglezreyes/Documents/maestria/HCI/project_hci/frontend/node_modules/vite/dist/node/index.js';
import react from 'file:///Users/rcglezreyes/Documents/maestria/HCI/project_hci/frontend/node_modules/@vitejs/plugin-react-swc/index.mjs';
import { VitePWA } from 'file:///Users/rcglezreyes/Documents/maestria/HCI/project_hci/frontend/node_modules/vite-plugin-pwa/dist/index.js';
var PORT = 3030;
var HOST = 'localhost';
var vite_config_default = defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5e6,
      },
      manifest: {
        name: 'MAS Home App',
        short_name: 'MAS Home',
        description: 'MAS Home',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: PORT,
    host: HOST,
    hmr: false,
  },
  preview: {
    port: PORT,
    host: HOST,
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcmNnbGV6cmV5ZXMvRG9jdW1lbnRzL21hZXN0cmlhL0hDSS9wcm9qZWN0X2hjaS9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3JjZ2xlenJleWVzL0RvY3VtZW50cy9tYWVzdHJpYS9IQ0kvcHJvamVjdF9oY2kvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3JjZ2xlenJleWVzL0RvY3VtZW50cy9tYWVzdHJpYS9IQ0kvcHJvamVjdF9oY2kvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IFBPUlQgPSAzMDMwO1xuY29uc3QgSE9TVCA9ICdsb2NhbGhvc3QnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBjaGVja2VyKHtcbiAgICAgIGVzbGludDoge1xuICAgICAgICBsaW50Q29tbWFuZDogJ2VzbGludCBcIi4vc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9XCInLFxuICAgICAgICBkZXY6IHsgbG9nTGV2ZWw6IFsnZXJyb3InXSB9LFxuICAgICAgfSxcbiAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgcG9zaXRpb246ICd0bCcsXG4gICAgICAgIGluaXRpYWxJc09wZW46IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLmljbycsICdyb2JvdHMudHh0JywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJ10sXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiA1MDAwMDAwLFxuICAgICAgfSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdOV1MgSG9tZSBBcHAnLFxuICAgICAgICBzaG9ydF9uYW1lOiAnTldTIEhvbWUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ05XUyBIb21lJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvaWNvbnMvaWNvbi0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvaWNvbnMvaWNvbi01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvaWNvbnMvaWNvbi01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IC9efiguKykvLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvJDEnKSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IC9ec3JjKC4rKS8sXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NyYy8kMScpLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiBQT1JULFxuICAgIGhvc3Q6IEhPU1QsXG4gICAgaG1yOiBmYWxzZSxcbiAgfSxcbiAgcHJldmlldzogeyBcbiAgICBwb3J0OiBQT1JULCBcbiAgICBob3N0OiBIT1NULFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRXLE9BQU8sVUFBVTtBQUM3WCxPQUFPLGFBQWE7QUFDcEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUl4QixJQUFNLE9BQU87QUFDYixJQUFNLE9BQU87QUFFYixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixhQUFhO0FBQUEsUUFDYixLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRTtBQUFBLE1BQzdCO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLGVBQWUsQ0FBQyxlQUFlLGNBQWMsc0JBQXNCO0FBQUEsTUFDbkUsU0FBUztBQUFBLFFBQ1AsK0JBQStCO0FBQUEsTUFDakM7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ1g7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxpQkFBaUI7QUFBQSxNQUN6RDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxLQUFLLFFBQVEsSUFBSSxHQUFHLFFBQVE7QUFBQSxNQUNoRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsRUFDUDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
