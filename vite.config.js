import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const externalHost = env.VITE_EXTERNAL_HOST

  return {
    server: {
      host: externalHost ? true : undefined,
      allowedHosts: externalHost ? [externalHost] : undefined,
      hmr: externalHost
        ? {
            host: externalHost,
            protocol: 'wss',
          }
        : undefined,
    },
  }
})
