import { BrowserWindow } from 'electron'

const { PROD } = import.meta.env
const { page, preload } = import.meta.app


export function createSubWindow() {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload
		},
	})

	const { subpage } = (page as MultiplePage)

	PROD ? window.loadFile(subpage) : window.loadURL(subpage)
	return window
}

