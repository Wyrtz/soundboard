//File for playing sound bits

//Outputdevice ?? 
//https://codepen.io/smujmaiku/pen/oNjBmVj
//https://superuser.com/questions/869892/force-javascript-to-use-a-non-default-sound-device

'use strict';

export const playIcon = "<i class='fa fa-play' />"
const stopIcon = "<i class='fa fa-stop' />"
let curRow
let sound
let outputDeviceID = ""
getSoundDevice()

//Get the sounddevice to play the audio on
async function getSoundDevice(){
    let soundDevices = await navigator.mediaDevices.enumerateDevices()
    let outputDevice = soundDevices.filter(element => element.label === "CABLE Input (VB-Audio Virtual Cable)")
    outputDeviceID = outputDevice[0].deviceId
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
        utterance.lang='en-GB'; 
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