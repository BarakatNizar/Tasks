const waitNote=document.getElementById("waitNote");
const timeInput=document.getElementById("time");
const alarmsSection=document.getElementById("alarms");


//Alarm object: userEmail-timeOutID-time
let alarms=[];

const olClass="border-2 border-dashed border-[#345635]";
const divContainer="py-4 flex justify-evenly bg-[#8bc695] rounded-3xl";
const liClass="text-[#1b321c] text-sm";
const buttonClass="bg-[#E3EFD3] rounded-xl";
const svgURL="./delete-button.svg" ;

//Task2
emailjs.init({
    publicKey:"HTswG8Zv1d7pVw5UW",
    blockHeadless:true,
    limitRate:{
        throttle:5000
    }
});

function sendEmailTo(email , message){
  
    const userName= email.slice(0,email.indexOf('@'));
    emailjs.send("service_0emwccg" ,"template_4lgnf7i",{
        from_name:"NB",
        to_email:email,
        to_name:`Great ${userName}`,
        message:message
    }).then((res,rej)=>{
        waitNote.classList.add("offset");
        if (res)
            alert(`Email has sent succefully to ${email}\nstatus${res.status}`);
        else 
         alert(`Email sending Failed\n${rej}`);

    })
}

function getLocalUsers(){
    let users=localStorage.getItem("users");
    return JSON.parse(users);
}

function getSelectedUserIndex(){
    let su=document.getElementById("usersEmail");
    
    let value=(su?.selectedOptions[0]?.value);
    if (!value || value==undefined || value==null)
        return -1;
    else return value;

}

function DisplayUsersEmail(){
    let users=getLocalUsers();
    console.log(users);
    let options=document.getElementById("usersEmail");
    if (!users || users?.length==0)
        return;
    users.forEach((userEmail,index) => {
        let opt=document.createElement("option");
        opt.value=index;
        opt.text=userEmail;
        options.appendChild(opt);
    });
}

function ClearTextAreaMessage(){
    let message=document.getElementById("message");
    message.value="";
}

function SendMessageButtonHandler(){
    let userEmail=getLocalUsers()[getSelectedUserIndex()];
    let message=document.getElementById("message").value;
    if (message==="" || message==undefined || message==null){
        waitNote.classList.add("offset");
        alert("Empty Message !");
        return;
    }
    if (userEmail==="" || userEmail==undefined || userEmail==null){
        waitNote.classList.add("offset");
        alert("Choose user email to sent to !");
        return;
    }

    sendEmailTo(userEmail ,message);
}
//End of Task2





//Task3


// Alarms Storing Management + Support(Update the alarms section automatically) At any change for `alarms`: 
function saveAlarm(alarm){
    if(alarm?.timeOutId<=0){
        alert("Please try again");
        return;
    }
    alarms.push(alarm);
    UpdateOlElement(alarms);
}
function getAlarmByTimeOutId(T_Id){
    return alarms.find(alarm=>alarm.timeOutId===T_Id);
}
function removeAlarmByTimeOutId(T_Id){
    alarms=alarms.filter(alarm=>alarm.timeOutId!==T_Id);
    UpdateOlElement(alarms);
}
//

//Alarm Setter and Remover
function SetTimer(){
    let time=timeInput.value.split(":");
    if(time==null || time=="" || time?.length==0){
        alert("You must insert a valid time !");
        return;
    }
    let next=new Date();
    next.setHours(Number(time[0]));
    next.setMinutes(Number(time[1]));
    next.setSeconds(0);
    next.setMilliseconds(0);
    let msDiff=next.getTime() -( new Date().getTime());
    //Collecting data:
    let alarm={
        userEmail:getLocalUsers()[getSelectedUserIndex()],
        message:document.getElementById("message").value,
        time:timeInput.value,
        timeOutId:-1,
    }

    //Data Validation
    if (!alarm.userEmail || alarm.userEmail==null){
        alert("You must select an email!");
        return;
    }
    if (alarm.message==="" || alarm.message==undefined || alarm.message==null){
        alert("Empty Message !");
        return;
    }
    if(msDiff<=0){
        alert("You must insert a valid time not a passed time !");
        return;
    }

    //We have all in its place.
    let Tid=setTimeout(() => {
            sendEmailTo(alarm.userEmail ,alarm.message);
            }, msDiff);

    setTimeout(() => {
            removeAlarmByTimeOutId(Tid);
    }, msDiff+40);
    alarm.timeOutId=Tid;
    
    saveAlarm(alarm);
    alert("Activated !");

}
function RemoveTimerButtonHandler(T_Id){
    //We need to remove it from local storage then remove the item that displays it with its timeOut
    removeAlarmByTimeOutId(T_Id);
    clearTimeout(T_Id);
}
//

//Elements Creation for each Alarm Element: div-(li+button)
function getNewDivContainer(index){
    let div=document.createElement("div");
    div.className=divContainer;
    div.id=index; //For delete operation.
    return div;
}
function getNewLiElement(text){
    let li=document.createElement("li");;
    li.className=liClass;
    li.innerText=text;
    return li;
}
function getNewButtonElement(T_Id){
    let button=document.createElement("button");;
    button.className=buttonClass;
    button.onclick=(()=>RemoveTimerButtonHandler(T_Id));

    let img=document.createElement("img");;
    img.src=svgURL;
    img.width=20;
    
    button.appendChild(img);
    return button;
}

//Alarm Section Creation:

function createAlarmElement(alarm){
    let div=getNewDivContainer(alarm.timeOutId);
    let li=getNewLiElement(`${alarm.userEmail}-${alarm.time}`);
    let button=getNewButtonElement(alarm.timeOutId);
    div.appendChild(li);
    div.appendChild(button);
    
    return div;
}

function createOlAlarmElement(data){
    if (!data || data===null || data===undefined || data?.length===0){
        console.log("There is no data for Ol element creation");
        return;
    }

    let newOl=document.createElement("ol");;
    newOl.className=olClass;
    
    data.forEach((alarm) => {
        newOl.appendChild(createAlarmElement(alarm));
    });

    return newOl;
}

function UpdateOlElement(data){
    //data:[{userEmail , time , timeOutId } , ....];
    if (alarmsSection==undefined)
        return;
    if (alarmsSection.children.length===2)
        alarmsSection.removeChild(alarmsSection.children.item(1));
    
    let OlElement= createOlAlarmElement(data);
    if(OlElement===undefined || OlElement===null)
        return;
    alarmsSection.appendChild(OlElement);
}
//End of Task3


document.getElementById("timerButton").addEventListener("click" , ()=>{
    SetTimer();
})
document.getElementById("sendButton").addEventListener("click", ()=>{
    waitNote.classList.remove("offset");
    SendMessageButtonHandler();
});
document.getElementById("clearButton").addEventListener("click", ()=>{
    ClearTextAreaMessage();
})
document.addEventListener("DOMContentLoaded",()=>{DisplayUsersEmail();});
