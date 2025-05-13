import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'docs'
  },
  server: {
    https: true,
  },
  plugins: [
		// mkcert(),
		{
			name: 'vite-server-set-headers',
			configureServer(server) {
				// Add middleware to allow private network access
				server.middlewares.use((req, res, next) => {
					if ((req as any).method === 'OPTIONS') {
						// needed to work in browser cross domain (like in webflow)
						res.setHeader('Access-Control-Allow-Private-Network', 'true');
					}
					next();
				});
			},
			configurePreviewServer(server) {
				// Add middleware to allow private network access
				server.middlewares.use((req, res, next) => {
					if ((req as any).method === 'OPTIONS') {
						// needed to work in browser cross domain (like in webflow)
						res.setHeader('Access-Control-Allow-Private-Network', 'true');
					}
					next();
				});
			},
		  },
	  ]
})
