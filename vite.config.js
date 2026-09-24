import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vituum from 'vituum'
import twig from '@vituum/vite-plugin-twig'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const srcDir = resolve(process.cwd(), 'src')
const assetPathPattern = /(["'(=,\s])(?:\.\/|\/)(?=(?:css|js|assets|fonts|images)\/)/g

function normalizeNestedPageAssets() {
	return {
		name: 'normalize-nested-page-assets',
		generateBundle: {
			order: 'post',
			handler(_, bundle) {
				for (const output of Object.values(bundle)) {
					if (output.type !== 'asset' || !output.fileName.endsWith('.html') || typeof output.source !== 'string') {
						continue
					}

					const pageDir = output.fileName.includes('/') ? output.fileName.slice(0, output.fileName.lastIndexOf('/')) : '.'
					const pageBase = pageDir === '.' ? './' : `${'../'.repeat(pageDir.split('/').length)}`

					output.source = output.source.replace(assetPathPattern, `$1${pageBase}`)
				}
			}
		}
	}
}

export default defineConfig({
	base: './',
	plugins: [
		vituum({
			input: [
				'./src/styles/main.scss',
				'./src/scripts/main.ts'
			],
			pages: {
				normalizeBasePath: true
			},
			imports: {
				paths: [],
				filenamePattern: {}
			}
		}),
		twig({
			namespaces: {
				layouts: resolve(srcDir, 'layouts'),
				components: resolve(srcDir, 'components')
			},
			data: [
				'src/components/**/*.twig.json'
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
		}),
		normalizeNestedPageAssets()
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
					const filename = assetInfo.names?.[0] ?? assetInfo.name ?? ''
					const extension = filename.split('.').pop()

					if (extension === 'css') {
						return `css/${filename}`
					}

					if (extension === 'woff2' || extension === 'woff') {
						return 'fonts/[name][extname]'
					}

					if (['avif', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension)) {
						return 'images/[name][extname]'
					}

					return 'assets/[name][extname]'
				},
				manualChunks(id) {
					if (id.includes('node_modules')) return 'vendor'
				}
			}
		}
	}
})
