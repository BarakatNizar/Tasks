const waitNote=document.getElementById("waitNote");
const timeInput=document.getElementById("time");
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
    let message=document.getElementById("message").value;
    let userEmail=getLocalUsers()[getSelectedUserIndex()];
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
//





//Task3
function SetTimer(){
    let time=timeInput.value.split(":");
    if(time==null || time=="" || time?.length==0){
        alert("You must insert a valid time !");
        return;
    }
    let now=new Date();
    let next=new Date();
    next.setHours(Number(time[0]));
    next.setMinutes(Number(time[1]));
    let msDiff=next.getTime() - now.getTime();
    if(msDiff<=0){
        alert("You must insert a valid time not a passed time !");
        return;
    }
    setTimeout(() => {
        SendMessageButtonHandler();
    }, msDiff);
    alert("Activated !");

}
//


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
document.addEventListener("DOMContentLoaded",()=>DisplayUsersEmail());