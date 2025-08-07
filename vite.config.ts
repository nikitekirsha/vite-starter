import { defineConfig } from 'vite'
// @ts-ignore
import vituum from 'vituum'
import twig from '@vituum/vite-plugin-twig'
import * as path from 'path'

export default defineConfig({
	resolve: {
		alias: {
			'@core': path.resolve(__dirname, 'src/scripts/core'),
			'@helpers': path.resolve(__dirname, 'src/scripts/helpers'),
			'@components': path.resolve(__dirname, 'src/scripts/components')
		}
	},
	plugins: [
		vituum({
			imports: {
				paths: [],
				filenamePattern: {}
			}
		}),
		twig({
			root: './src'
		})
	],
	build: {
		assetsInlineLimit: 0,
		modulePreload: {
			polyfill: false
		},
		rollupOptions: {
			output: {
				entryFileNames: 'js/[name].js',
				chunkFileNames: 'js/[name].js',
				assetFileNames: (assetInfo) => {
					const filename = assetInfo.names?.[0] ?? ''
					const extension = filename.split('.').pop()

					if (['png','jpg','jpeg','svg','gif','webp'].includes(extension || '')) {
						return `img/${ filename }`
					}

					if (extension === 'css') {
						return `css/${ filename }`
					}

					if (extension === 'woff2') {
						return `fonts/${ filename }`
					}

					return `assets/${ filename }`
				}
			}
		}
	}
})
