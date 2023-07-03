//CODE TO MAKE THE USER SCROLL TO THE TOP OF THE DOCUMENT

let bcktop = document.getElementById("btn-back-to-top");

// When the user clicks on the button, scroll to the top of the document
if(bcktop) {
    bcktop.addEventListener("click", backToTop);
}

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


//JAVASCRIPT RELATED TO THE USER STATUS

//display Login Form - we use the class name instead of the ID (bc we have multiple login buttons)
let userStatusButton = document.getElementById("userstatusButton");
let overlayCollection = document.getElementsByClassName("overlayPopUp");
let userstatusFormPopup = document.getElementById("UserStatusID");
let closeuserstatusColl = document.getElementsByClassName("closeUserStatusForm");
let logoutButton = document.getElementById("logoutButton");
let body = document.getElementById("bodyID");
let click = false;

if(userStatusButton){
    userStatusButton.addEventListener('click', openUserStatus);
    userStatusButton.addEventListener('click', clicked);
}


if(closeuserstatusColl){
    for(var i = 0; i < closeuserstatusColl.length; i++){
        closeuserstatusColl[i].addEventListener('click', crossbar);
        closeuserstatusColl[i].addEventListener('click', closeTheUserStatusForm);
    }
}

if(logoutButton){
    logoutButton.addEventListener('click', logout);
}

function logout(){
    //Simply go to the homepage_not_logged
    goToMainPage();
}

function clicked() {
    click = true;
}

function crossbar(){
    click = false;
}
function openUserStatus(){
        var stringYMiddle = (window.scrollY + (window.innerHeight * 0.5)).toString() + "px";
        userstatusFormPopup.style.top = stringYMiddle;
        for (var i = 0; i < overlayCollection.length; i++){
            overlayCollection[i].classList.add("active");
        }
        userstatusFormPopup.classList.add("open-popup");
        body.style.overflow = "hidden";
}

function closeTheUserStatusForm(){
    for (var i = 0; i < overlayCollection.length; i++){
        overlayCollection[i].classList.remove("active");
    }
    userstatusFormPopup.classList.remove("open-popup");
    if(!click){
        body.style.overflow = "visible";
    }
}

//delete account
let deleteButton = document.getElementById("deleteButton")
if(deleteButton){
    deleteButton.addEventListener('click', deleteAccount)
}

function deleteAccount(){
    //we ask the server to delete our user, and the server will contact the API. No need to send any info about the user, he already knows
    xmlhttpDeleteUser = new XMLHttpRequest();
    xmlhttpDeleteUser.open("GET", "http://127.0.0.1:5014/deleteAccount");
    xmlhttpDeleteUser.onreadystatechange = () => {
        if(xmlhttpDeleteUser.readyState === XMLHttpRequest.DONE){
            if(xmlhttpDeleteUser.status === 204){
                //when the request to the SERVER has succeded, it returns a 204 No Content, because it has been deleted
                //Only when it has been deleted we can come back to the Main Page
                goToMainPage();   
            }
        }
    };
    xmlhttpDeleteUser.send();
}

function goToMainPage(){

//we load this URL, that is going to load the homepage without any user logged
window.location.href = "http://127.0.0.1:5014/";     

}

//JS that makes the Continue button appear once some time passes

setTimeout(function() {
    var loadingImage = document.getElementById("loading");
    var contButton = document.getElementById("contButtonCluster");
    loadingImage.style.animation = "transitionImageToButton 0.5s forwards";
  
    setTimeout(function() {
      loadingImage.remove();
      contButton.classList.remove("hidden");
      contButton.classList.add("show");
    }, 500);
  }, 5000);
  
  