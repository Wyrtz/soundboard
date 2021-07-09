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
getSoundDevice()

//Get the sounddevice to play the audio on
//ToDo: jsSoundBoard should not be responsible of creating menu! prob main.js
async function getSoundDevice(){
    const currentMenu = Menu.buildFromTemplate(menuTemplate)
    let soundDevices = await navigator.mediaDevices.enumerateDevices()
    const outputDevices = soundDevices.filter(e => e.kind ==="audiooutput")    
    let outputDevice = soundDevices.filter(element => element.label === "VoiceMeeter Input (VB-Audio Virtual Cable)")
    const pickOutDeviceMenu = currentMenu.items[1].submenu
    outputDeviceID = outputDevice[0].deviceId
    outputDevices.forEach((element) => {
        const menuItem = new MenuItem({
            label: element.label,
            type: 'radio',
            click: () => {outputDeviceID = element.deviceId; console.log(element.label); menuItem.checked = true}
        })
        pickOutDeviceMenu.append(menuItem)
    })
    Menu.setApplicationMenu(currentMenu)
    console.log(currentMenu)
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
        utterance.lang='de-DE';
        utterance.text=text;
        window.speechSynthesis.speak(utterance);
}

//Stop whatever is playing atm.
export async function stop_playing(){
    if(sound){
      curRow.innerHTML = playIcon
      sound.pause()
    }
  }