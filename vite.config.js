import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vituum from 'vituum'
import twig from '@vituum/vite-plugin-twig'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
	plugins: [
		vituum({
			imports: {
				paths: [],
				filenamePattern: {}
			}
		}),
		twig({
			namespaces: {
				layouts: resolve(process.cwd(), 'src/layouts'),
				components: resolve(process.cwd(), 'src/components')
			},
			data: [
				'src/components/widgets/*.twig.json'
			]
		}),
		ViteImageOptimizer({
			png: {
				quality: 75
			},
			jpeg: {
				quality: 75
			},
			jpg: {
				quality: 75
			},
			svg: {
				plugins: [
					{ name: 'removeViewBox' },
					{ name: 'sortAttrs' }
				]
			}
		})
	],
	build: {
		chunkSizeWarningLimit: 2048,
		assetsInlineLimit: 0,
		modulePreload: {
			polyfill: false,
			resolveDependencies: () => []
		},
		rollupOptions: {
			output: {
				entryFileNames: 'js/[name].js',
				chunkFileNames: 'js/[name].js',
				assetFileNames: (assetInfo) => {
					const filename = assetInfo.names?.[0] ?? ''
					const extension = filename.split('.').pop()

					if (extension === 'css') {
						return `css/${filename}`
					}

					if (extension === 'woff2') {
						return `fonts/${filename}`
					}

					return `assets/${filename}`
				},
				manualChunks(id) {
					if (id.includes('node_modules')) return 'vendor'
				}
			}
		}
	}
})
