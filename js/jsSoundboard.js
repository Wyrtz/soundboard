//File for playing sound bits

//Outputdevice ?? 
//https://codepen.io/smujmaiku/pen/oNjBmVj
//https://superuser.com/questions/869892/force-javascript-to-use-a-non-default-sound-device

'use strict';

const {Howl, Howler} = require('howler');

export const playIcon = "<i class='fa fa-play' />"
const stopIcon = "<i class='fa fa-stop' />"
let curRow
let sound
let outputDeviceID = ""
getSoundDevice()

async function changeIcon(playCell){
    playCell.innerHTML = playIcon
}

async function getSoundDevice(){
    let soundDevices = await navigator.mediaDevices.enumerateDevices()
    let outputDevice = soundDevices.filter(element => element.label === "CABLE Input (VB-Audio Virtual Cable)")
    outputDeviceID = outputDevice[0].deviceId
}

//navigator.mediaDevices.enumerateDevices()
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
    playCell.innerHTML = stopIcon
    /*sound = new Howl({
        src:soundFile.path,
        onend:function(){
            changeIcon(playCell)
        }
    })*/
    //console.log(navigator.mediaDevices.enumerateDevices())
    sound = new Audio(soundFile.path)
    if(outputDeviceID !== ""){
        sound.setSinkId(outputDeviceID)
    }
    sound.autoplay = true
}

/*function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
  }*/

//  baseAudioContext.decodeAudioData
//Say whatever text!
export async function speak_text(text){
    var utterance = new SpeechSynthesisUtterance("");
        utterance.lang='en-GB'; 
        utterance.text=text;
        window.speechSynthesis.speak(utterance);
}

export async function stop_playing(){
    if(sound){
      curRow.innerHTML = playIcon
      sound.pause()
    }
  }