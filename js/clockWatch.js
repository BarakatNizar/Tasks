let mInput= document.getElementById("m");
let sInput= document.getElementById("s");
let msInput= document.getElementById("ms");
let KnockButton=document.getElementById("KnockButton");
let PauseButton=document.getElementById("PauseButton");
let ResumeButton=document.getElementById("ResumeButton");
let ResetButton=document.getElementById("ResetButton");
let StopButton=document.getElementById("StopButton");


let intervalTime=-1;
let startTime=0 , countedTime=0;
let Mode=false; //0 -> WaitMode , 1 -> CountMode 

function ToggleMode(){
    Mode=!Mode;
    let divCount=document.getElementById("CountMode");
    divCount.classList.toggle('hidden');    
    let divWait=document.getElementById("WaitMode");
    divWait.classList.toggle('hidden');
    if( !Mode && countedTime){
        KnockButton.classList.toggle("hidden");
    }else if (!Mode)
        KnockButton.classList.toggle("hidden");

}
function ResetClock(){
    mInput.value=sInput.value=msInput.value="00";    
    startTime=countedTime=0;
}
function DisplayClockEachMS(ms){
    let date=new Date(ms);
    if (!date){
        alert("Something Wrong ! try later");
        return;
    }
    mInput.value=date.getMinutes();
    sInput.value=date.getSeconds();
    msInput.value=date.getMilliseconds();
}


function Knock(){
    startTime=new Date();
    intervalTime=setInterval(()=>{
        DisplayClockEachMS(Date.now()-(startTime-countedTime));
    },0);
    ToggleMode();
}

function Pause(){
    clearInterval(intervalTime);
    countedTime=Date.now() -startTime;
    ToggleMode();
    
}
function Stop(){
    clearInterval(intervalTime);
    startTime=countedTime=0;
    ToggleMode();
}

KnockButton.addEventListener('click' ,()=>{countedTime=0;Knock();})
ResumeButton.addEventListener('click' ,()=>{Knock();})
PauseButton.addEventListener('click', ()=>{
    Pause();
})
ResetButton.addEventListener('click' ,()=>{
    ResetClock();
    ToggleMode();
    ToggleMode();
})
StopButton.addEventListener('click' , ()=>{
    Stop();
})
