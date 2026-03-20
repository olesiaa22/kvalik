import * as path from 'path'
import {fileURLToPath} from 'url'
import {app, BrowserWindow} from 'electron/main'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 1000,
        minHeight: 600,
    })

    const isDev = !app.isPackaged

    if (isDev) {
        win.loadURL('http://localhost:5173')
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
})
