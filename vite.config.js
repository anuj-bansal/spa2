import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    viteImagemin({
      webp: {
        quality: 80,
      },
      pngquant: {
        quality: [0.7, 0.9],
      },
      mozjpeg: {
        quality: 80,
      },
    }),
  ],
});
