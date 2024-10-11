const olClass="border-2 border-dashed border-[#345635]";
const divContainer="py-4 flex justify-evenly bg-[#8bc695] rounded-3xl";
const liClass="text-[#1b321c]";
const buttonClass="bg-[#E3EFD3] rounded-xl";
const svgURL="./delete-button.svg" ;

function setLocalStorage(userName){
    let userList=JSON.parse(localStorage.getItem("users"));
    if(userList===null || userList===undefined){
        userList=[userName,];

        userList=JSON.stringify(userList);
        localStorage.setItem("users" , userList); 
        setTimeout(()=>{location.reload(); },20); //Bug fixed
        //Bug reason is :
        //When the list is empty , the line 79 returns `null | undefined` because the 
        // 'emails' HTMLElement doesn't exist anymore !
        //This is a temporarily solution. it MAY cause a lot of damage in the future
        return;
    }
    else{
        if (userList.includes(userName))
        {alert("Already Exists");    return;}    
        userList.push(userName);
    }

    userList=JSON.stringify(userList);
    localStorage.setItem("users" , userList); 
}
function getLocalUsers(){
    let users=localStorage.getItem("users");

    return JSON.parse(users);
}
function removeLocalUser(index){
    let users=getLocalUsers();
    localStorage.removeItem("users");
    users.forEach(email => {
        if(email!==users[index])
            setLocalStorage(email);
    });

}
function removeEmailButtonHandler(index){
    let emailsNodeOl=document.getElementById(index);
    emailsNodeOl.parentElement.removeChild(emailsNodeOl);
    RemoveUserEmail(index);

}



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
function getNewButtonElement(index){
    let button=document.createElement("button");;
    button.className=buttonClass;
    button.onclick=(()=>removeEmailButtonHandler(index));

    let img=document.createElement("img");;
    img.src=svgURL;
    img.width=20;
    
    button.appendChild(img);
    return button;
}


function DisplayUsersEmail(){
    let emailsNodeOl=document.getElementById("emails").parentNode;
    emailsNodeOl.removeChild(emailsNodeOl.children.item(1));
    let newNodes=document.createElement("ol");;
    newNodes.className=olClass;
    newNodes.id="emails";
    
    const users=getLocalUsers();
    if (!users)
        return;
    
        users.forEach((user,index) => {

        let div=getNewDivContainer(index);
        let li=getNewLiElement(user);
        let button=getNewButtonElement(index);

        div.appendChild(li);
        div.appendChild(button);
        newNodes.appendChild(div);
    });
    emailsNodeOl.appendChild(newNodes);
}   



function AddUserEmail(e){
    let InputElement=document.getElementById("email");
    setLocalStorage(InputElement.value);
    InputElement.value="";
    DisplayUsersEmail();
}
function RemoveUserEmail(index){
    removeLocalUser(index);
    DisplayUsersEmail();
}



document.getElementById("EmailAdd").addEventListener("submit",(e)=>{
    e.preventDefault() ; 
    AddUserEmail();
});
document.addEventListener("DOMContentLoaded" ,()=>{DisplayUsersEmail();});
