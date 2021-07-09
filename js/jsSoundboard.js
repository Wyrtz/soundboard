//File for playing sound bits

//Outputdevice ?? 
//https://codepen.io/smujmaiku/pen/oNjBmVj
//https://superuser.com/questions/869892/force-javascript-to-use-a-non-default-sound-device

'use strict';
import {menuTemplate} from "./menus.js";
const {Menu, MenuItem} = require('electron').remote;
export const playIcon = "<i class='fa fa-play' />"
const stopIcon = "<i class='fa fa-stop' />"
let curRow
let sound
let outputDeviceID = ""
let utteranceLang = ""
getSoundDevice()

//curtesy of  Victor-Nikliaiev commented on 20 May https://github.com/electron/electron/issues/22844
//Ensures not an empty list from GetVoices()! 
const speech = window.speechSynthesis;
if(speech.onvoiceschanged !== undefined)
{
	speech.onvoiceschanged = () => speech.getVoices()
}
//Get the sounddevice to play the audio on
//ToDo: jsSoundBoard should not be responsible of creating menu! prob main.js
async function getSoundDevice(){
    const currentMenu = Menu.buildFromTemplate(menuTemplate)
    let soundDevices = await navigator.mediaDevices.enumerateDevices()
    const outputDevices = soundDevices.filter(e => e.kind ==="audiooutput")    
    //let outputDevice = soundDevices.filter(element => element.label === "VoiceMeeter Inpgut (VB-Audio Virtual Cable)")
    const pickOutDeviceMenu = currentMenu.items[1].submenu
    const pickSpeakingVoice = currentMenu.items[2].submenu
    //outputDeviceID = outputDevice[0].deviceId
    outputDevices.forEach((element) => {
        const menuItem = new MenuItem({
            label: element.label,
            type: 'radio',
            click: () => {outputDeviceID = element.deviceId; menuItem.checked = true}
        })
        pickOutDeviceMenu.append(menuItem)
    })
    const avaliableVoices = speechSynthesis.getVoices()
    avaliableVoices.forEach((e) => {
        const menuItem = new MenuItem({
            label: e.name,
            type: 'radio',
            click: () => {utteranceLang = e.lang; menuItem.checked = true}
        })
        pickSpeakingVoice.append(menuItem)
    })
    Menu.setApplicationMenu(currentMenu)
}

//Play the given sound
export async function play_sound(soundFile, playCell, fun){
    if(sound){
        curRow.innerHTML = playIcon
        if(!sound.paused && curRow == playCell){
            stop_playing()
            return
        }
    }
    
    fun(soundFile)
    curRow = playCell
    await stop_playing()
    sound = new Audio(soundFile.path)
    if(outputDeviceID !== ""){
        sound.setSinkId(outputDeviceID)
    }
    await sound.play()
    playCell.innerHTML = stopIcon
    sound.onended = () => {playCell.innerHTML = playIcon}
}

//Say whatever text!
export async function speak_text(text){
    var utterance = new SpeechSynthesisUtterance("");
    //Language set as BCP 47 language tag
    //speechSynthesis.getVoices()
        utterance.lang= utteranceLang;
        utterance.text=text;
        speech.speak(utterance);
}

//Stop whatever is playing atm.
export async function stop_playing(){
    if(sound){
      curRow.innerHTML = playIcon
      sound.pause()
    }
  }