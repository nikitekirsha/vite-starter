import { HeaderComponent } from './header.component'

import { HeaderRefs, HeaderOptions, HeaderTag } from './header.types'

export const initHeader = () => {
	try {
		const $header: HeaderTag | null = document.querySelector('header[data-header]')

		if ($header === null) return

		const headerRefs: HeaderRefs = {
			$root: $header,
			$message: $header.querySelector('[data-header-message]')
		}

		const headerOptions: HeaderOptions = {
			text: $header.getAttribute('data-header-text')
		}

		new HeaderComponent(headerRefs, headerOptions)
	} catch (e) {
		console.error(e)
	}
}
