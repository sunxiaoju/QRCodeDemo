import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const fs = require('fs')
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    host: '0.0.0.0',
    https: {
      // 主要是下面两行的配置文件，不要忘记引入 fs 和 path 两个对象
      cert: fs.readFileSync(path.join(__dirname, 'src/ssl/cert.crt')),
      key: fs.readFileSync(path.join(__dirname, 'src/ssl/cert.key'))
    }
  },
})
