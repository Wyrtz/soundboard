//File for playing sound bits

'use strict';

//const player = require('sound-play')
//const Audic = require("audic")
const play = require('audio-play');
const load = require('audio-loader');

export const playIcon = "<i class='fa fa-play' />"
const stopIcon = "<i class='fa fa-stop' />"
let curRow
//let sound = new Audic()
let sound
let isPlaying = false

export async function play_sound(soundFile, playCell, fun){
    if(curRow){
        curRow.innerHTML = playIcon
        if(isPlaying && curRow == playCell){
            stop_playing()
            return
        }
    }
    //sound.src = soundFile.path
    //console.log(sound.src)
    fun(soundFile)
    curRow = playCell
    await stop_playing()
    playCell.innerHTML = stopIcon
    let audioBuffer = await load(soundFile.path)
    sound = play(audioBuffer)
    isPlaying = true

    //sound.play() //.then((value) => {curRow.innerHTML = playIcon})
    //sound = player.play(soundFile.path).then((response) => console.log("done"))
    //console.log(sound)
}

export async function stop_playing(){
    console.log("called")
    if(sound){
      curRow.innerHTML = playIcon
      sound.pause()
      isPlaying = false
    } else{
        console.log("nope!")
    }
  }