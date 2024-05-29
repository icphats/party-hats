import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import inject from '@rollup/plugin-inject';
import react from "@vitejs/plugin-react";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';


const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const { version } = JSON.parse(json);

export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
	  esbuildOptions: {
		// Node.js global to browser globalThis
		define: {
		  global: 'globalThis'
		},
		// Enable esbuild polyfill plugins
		plugins: [
		  NodeModulesPolyfillPlugin(),
		  {
			name: 'fix-node-globals-polyfill',
			setup(build) {
			  build.onResolve({ filter: /_virtual-process-polyfill_\.js/ }, ({ path }) => ({ path }));
			}
		  }
		]
	  }
	},
	build: {
	  rollupOptions: {
		plugins: [
		  inject({
			Buffer: ['buffer', 'Buffer']
		  })
		]
	  }
	}
  });