import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const rawExternalHost = env.VITE_EXTERNAL_HOST?.trim();
  const externalHost = rawExternalHost
    ? rawExternalHost.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    : undefined;
  const hmrProtocol = rawExternalHost?.startsWith("http://") ? "ws" : "wss";

  return {
    server: {
      host: externalHost ? true : undefined,
      allowedHosts: externalHost ? [externalHost] : undefined,
      hmr: externalHost
        ? {
            host: externalHost,
            protocol: hmrProtocol,
          }
        : undefined,
    },
  };
});
