//File for config of menu

const {Menu, MenuItem} = require('electron').remote;
import { settings } from "./ourMain.js"

const isMac = process.platform === 'darwin'

const appName = "sound-to-the-board"

//Build from this example: https://www.electronjs.org/docs/api/menu#menusetapplicationmenumenu
const menuTemplate = [
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

//Get the sounddevices to play the audio on
//ToDo: jsSoundBoard should not be responsible of creating menu! prob main.js
export async function getSoundDevice(){
    const currentMenu = Menu.buildFromTemplate(menuTemplate)
    let soundDevices = await navigator.mediaDevices.enumerateDevices()
    const outputDevices = soundDevices.filter(e => e.kind ==="audiooutput")    
    //let outputDevice = soundDevices.filter(element => element.label === "VoiceMeeter Inpgut (VB-Audio Virtual Cable)")
    const pickOutDeviceMenu = currentMenu.items[1].submenu
    const pickSpeakingVoice = currentMenu.items[2].submenu
    //outputDeviceID = outputDevice[0].deviceId
    outputDevices.forEach((e) => {
        const menuItem = new MenuItem({
            label: e.label,
            type: 'radio',
            checked: settings.defaultOutputDevice === e.deviceId ? true : false,
            click: (outputDeviceID) => {
              outputDeviceID = e.deviceId;
              menuItem.checked = true
              settings.defaultOutputDevice = e.deviceId
            }
        })
        pickOutDeviceMenu.append(menuItem)
    })
    const avaliableVoices = speechSynthesis.getVoices()
    avaliableVoices.forEach((e) => {
        const menuItem = new MenuItem({
            label: e.name,
            type: 'radio',
            checked: settings.defaultVoice === e.lang ? true : false,
            click: (utteranceLang) => {
              utteranceLang = e.lang; 
              menuItem.checked = true
              settings.defaultVoice = e.lang
            }
        })
        pickSpeakingVoice.append(menuItem)
    })
    Menu.setApplicationMenu(currentMenu)
}