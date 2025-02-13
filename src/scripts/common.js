import Header from './components/Header.js'

class App {
	constructor () {
		this.header = new Header()
	}

	init() {
		this.header.init()
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const app = new App()

	app.init()

	window.app = app
})