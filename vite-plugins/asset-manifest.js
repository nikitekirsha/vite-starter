import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { posix, relative, resolve } from 'node:path'

const MANIFEST_FILE = 'js/assets-manifest.json'
const PRELOAD_DIR = 'js'
const SPRITE_MODULE = 'virtual:sprite'
const RESOLVED_SPRITE_MODULE = `\0${SPRITE_MODULE}`

const shortHash = source => createHash('sha256').update(source).digest('hex').slice(0, 8)

const withHash = (fileName, hash) => {
	const extension = posix.extname(fileName)

	return `${fileName.slice(0, -extension.length)}-${hash}${extension}`
}

const toPosix = path => path.split('\\').join('/')

export function assetManifest({ script, style, sprite }) {
	let root = process.cwd()
	let publicDir = resolve(root, 'public')
	let base = '/'
	let isBuild = false
	let spriteName = ''
	let spriteReference = ''

	const spritePath = () => resolve(root, sprite)
	const spritePublicName = () => toPosix(relative(publicDir, spritePath()))

	return {
		name: 'asset-manifest',
		enforce: 'post',

		configResolved(config) {
			root = config.root
			publicDir = config.publicDir
			base = config.base
			isBuild = config.command === 'build'
		},

		resolveId(id) {
			if (id === SPRITE_MODULE) return RESOLVED_SPRITE_MODULE
		},

		load(id) {
			if (id !== RESOLVED_SPRITE_MODULE) return

			return isBuild
				? `export default import.meta.ROLLUP_FILE_URL_${spriteReference}`
				: `export default ${JSON.stringify(`${base}${spritePublicName()}`)}`
		},

		buildStart() {
			if (!isBuild) return

			const source = readFileSync(spritePath())

			spriteName = withHash(spritePublicName(), shortHash(source))
			spriteReference = this.emitFile({ type: 'asset', fileName: spriteName, source })
		},

		generateBundle(_options, bundle) {
			const items = Object.values(bundle)
			const scriptId = resolve(root, script)
			const styleName = toPosix(relative(root, resolve(root, style)))

			const entry = items.find(item => item.type === 'chunk' && item.isEntry && item.facadeModuleId === scriptId)
			const styles = items.find(item => item.type === 'asset' && item.originalFileNames?.includes(styleName))
			const initial = new Set()
			const collect = fileName => {
				bundle[fileName]?.imports?.forEach(file => {
					if (initial.has(file)) return

					initial.add(file)
					collect(file)
				})
			}

			if (entry) collect(entry.fileName)

			const preloadSource = [...initial]
				.map(file => `import './${posix.relative(PRELOAD_DIR, file)}'`)
				.join('\n')
			const preloadName = `${PRELOAD_DIR}/preload-${shortHash(preloadSource)}.js`
			this.emitFile({ type: 'asset', fileName: preloadName, source: `${preloadSource}\n` })

			const manifest = {
				css: styles?.fileName,
				js: entry?.fileName,
				preload: preloadName,
				sprite: spriteName
			}

			const missing = Object.keys(manifest).filter(key => !manifest[key])
			if (missing.length) this.error(`asset manifest: ${missing.join(', ')} not found in the bundle`)

			this.emitFile({ type: 'asset', fileName: MANIFEST_FILE, source: `${JSON.stringify(manifest, null, '\t')}\n` })
		}
	}
}
