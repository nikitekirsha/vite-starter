import { AbstractComponent } from '@core/abstract'
import { showPopup } from '@helpers'
import { MESSAGE_ADD_DELAY } from './header.constants'

import type { HeaderRefs, HeaderOptions, HeaderState } from './header.types'

export class HeaderComponent extends AbstractComponent<HeaderRefs, HeaderOptions> {
	private state: HeaderState

	constructor(refs: HeaderRefs, options: HeaderOptions) {
		super(refs, options)

		this.state = {
			isMessageAdded: false
		}

		this.init()
	}

	init() {
		this.addDelayedMessage()
	}

	addDelayedMessage() {
		setTimeout(() => {
			if (this.refs.$message === null) return
			if (this.options.text === null) return

			this.refs.$message.textContent = this.options.text
			this.state.isMessageAdded = true

			setTimeout(() => {
				showPopup('popup shown')
			}, 1000)
		}, MESSAGE_ADD_DELAY)
	}
}
