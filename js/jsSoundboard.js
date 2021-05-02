//File for playing sound bits

'use strict';

//const player = require('sound-play') //No pause ??
const Audic = require("audic") //Uses VLC ??
//const play = require('audio-play');  //Complicated...
//const load = require('audio-loader'); //Complicated...

export const playIcon = "<i class='fa fa-play' />"
const stopIcon = "<i class='fa fa-stop' />"
let curRow
let sound
let isPlaying = false

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

//We don't know how long a playback is,
//and our libary for audioplayback does not tell us how long a file is. So lets check 10 times a second :v
async function changeIcon(soundToChange, playCell){
    while(soundToChange.playing){
        await sleep(100) //Busy waiting!
    }
    playCell.innerHTML = playIcon
    //soundToChange.destroy()
}

export async function play_sound(soundFile, playCell, fun){
    if(curRow){
        curRow.innerHTML = playIcon
        if(isPlaying && curRow == playCell){
            stop_playing()
            return
        }
    }
    fun(soundFile)
    curRow = playCell
    await stop_playing()
    playCell.innerHTML = stopIcon
    sound = new Audic(soundFile.path)
    isPlaying = true
    await sound.play()
    await changeIcon(sound, playCell)

    //let audioBuffer = load(soundFile.path)
    //sound = play(audioBuffer)
    //sound.play() //.then((value) => {curRow.innerHTML = playIcon})
    //sound = player.play(soundFile.path).then((response) => console.log("done"))
}

export async function stop_playing(){
    if(sound){
      curRow.innerHTML = playIcon
      sound.pause()
      sound.destroy()
      isPlaying = false
    }
  }