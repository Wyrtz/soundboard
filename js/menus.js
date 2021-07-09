//File for config of menu

const isMac = process.platform === 'darwin'

const appName = "sound-to-the-board"

//Build from this example: https://www.electronjs.org/docs/api/menu#menusetapplicationmenumenu
export const menuTemplate = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: appName,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'Output device menu' }
  {
    label: 'Pick output device',
    submenu: []
  },
  // { role: 'pick read-out-load voice' }
  {
    label: 'Pick speaking voice',
    submenu: []
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      /*{ type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },*/
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      /*{ role: 'zoom' },*/
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/Wyrtz/soundboard')
        }
      }
    ]
  }
]