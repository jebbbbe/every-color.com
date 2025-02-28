import { constants } from "../constants.js"

export let isPlaying = false;
export let isIncreaseing = true;
let animationFrame;
let lastFrameTime = 0;
const frameDelay = 60; // 100ms = 10 FPS
// const frameDelay = 33; // ~30 FPS

function play(position,rowCount, update=()=>{}){
    if (!isPlaying) return; // Stop if animation is paused

    const now = performance.now();
    if (now - lastFrameTime < frameDelay) {
        animationFrame = requestAnimationFrame(() => play(position, rowCount, update));
        return;
    }
    lastFrameTime = now; // Update last frame time

    if(position == constants.absoluteMin){
        isIncreaseing = true
    }else if(position + rowCount-1  >= constants.absoluteMax){
        isIncreaseing = false
    }
    if(isIncreaseing ){
        position ++ 
    }else{
        position -- 
    }
    update(position)
    
    // Schedule next frame
    animationFrame = requestAnimationFrame(() => play(position, rowCount, update));
}

export function togglePlay(position, rowCount, update=()=>{}){
    if(isPlaying == false){
        isPlaying = true
        play(position, rowCount, update)
    }else{
        isPlaying = false
        cancelAnimationFrame(animationFrame);
    }
    console.log("isPlaying",isPlaying)
}

export function pausePlay(){
    isPlaying = false
    cancelAnimationFrame(animationFrame);
}