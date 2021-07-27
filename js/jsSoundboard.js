//File for playing sound bits

//Outputdevice ?? 
//https://codepen.io/smujmaiku/pen/oNjBmVj
//https://superuser.com/questions/869892/force-javascript-to-use-a-non-default-sound-device

import { settings } from "./ourMain.js"

'use strict';
export const playIcon = "<i class='fa fa-play' />"
const stopIcon = "<i class='fa fa-stop' />"
let curRow
let sound

//curtesy of  Victor-Nikliaiev commented on 20 May https://github.com/electron/electron/issues/22844
//Ensures not an empty list from GetVoices()! 
const speech = window.speechSynthesis;
if(speech.onvoiceschanged !== undefined)
{
	speech.onvoiceschanged = () => speech.getVoices()
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
    if(settings.defaultOutputDevice !== ""){
        sound.setSinkId(settings.defaultOutputDevice)
    }
    await sound.play()
    playCell.innerHTML = stopIcon
    sound.onended = () => {playCell.innerHTML = playIcon}
}

//Say whatever text!
export async function speak_text(text){
    var utterance = new SpeechSynthesisUtterance("");
    //Language set as BCP 47 language tag
    speechSynthesis.getVoices()
        utterance.lang= settings.defaultVoice;
        utterance.text= text;
        speech.speak(utterance);
}

//Stop whatever is playing atm.
export async function stop_playing(){
    if(sound){
      curRow.innerHTML = playIcon
      sound.pause()
    }
  }