
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


//MIDI Files checker function - ONLY AVAILABLE IN MainPage_logged.js


//MAIN PAGE titles
const titlem1 = document.querySelector("#title-1");
const titlem2 = document.querySelector("#title-2");
const tlmt = new TimelineMax();
tlmt.fromTo(titlem1, 1, {y: -1000}, {y: 0});
tlmt.fromTo(titlem2, 1.5, {x: -1000}, {x: 0});

//MAIN PAGE curtain

const hero = document.querySelector(".hero");
const tlmc = new TimelineMax();
tlmc.fromTo(hero, 3, {height: "40%"}, {height: "100%"});
tlmc.fromTo(hero, 3, {width: "40%"}, {width: "100%"});

//MidiFile aeroplane
aeroplane_bck = document.getElementById("aeroplane_bckg_id");

const tll = new TimelineLite();
const flightPath = {
    curviness: 1,
    type: "thru",
    autoRotate: true,
    values: [
        {x: (window.innerWidth/3), y: -130},
        {x: ((window.innerWidth*2)/3), y: 0},
        {x: window.innerWidth, y: -130}
    ]
};

tll.add(
    TweenLite.to("#aeroplanenote", 1, {
        bezier: flightPath,
        ease: Power1.easeInOut
    })
);
var steplength = 1000;
var navheight = document.getElementById("navid").clientHeight;
var aeroplaneobject = document.getElementById("aeroplanenote");
const controller =  new ScrollMagic.Controller();
const scene = new ScrollMagic.Scene({
    triggerElement: ".noteaeroplane-animation",
    duration: steplength*3,
    offset: (navheight * (-1)),
    triggerHook: 0
})
    .setTween(tll)
    .setPin(".noteaeroplane-animation")
    .addTo(controller)
    .on("progress", callbackLogoChanger);


    function callbackLogoChanger(event){
        if(scene.progress() < (1/3)){
            aeroplaneobject.setAttribute("src", "/static/images/midifile.png");
        } else if((scene.progress() >= (1/3)) && (scene.progress() < (2/3))){
            aeroplaneobject.setAttribute("src", "/static/images/neuralnetwork.png");
        } else if(scene.progress() >= (2/3)){
            aeroplaneobject.setAttribute("src", "/static/images/notes.png");
        }
    }

//Containers that follow MIDIAeroplane
const controller2 =  new ScrollMagic.Controller();
var aeroplaneheight = document.getElementById("aeroplane-sec").clientHeight;
var navPlusAeroplaneHeight = navheight + aeroplaneheight;
var wipeAnimation = new TimelineMax()
    // animate to second panel
    .to("#slideContainer", 0.5, {z: -150, delay: 3})		// move back in 3D space
    .to("#slideContainer", 1,   {x: "-33,33333333333333333333%"})	// change from the first panel to the second panel
    .to("#slideContainer", 0.5, {z: 0})				// move back to origin in 3D space
    // animate to third panel
    .to("#slideContainer", 0.5, {z: -150, delay: 2.5}) // move back in 3D space
    .to("#slideContainer", 1,   {x: "-66,66666666666666666666%"}) // change from the second panel to the third panel
    .to("#slideContainer", 0.5, {z: 0}); // move back to origin in 3D space

// create scene to pin and link animation
new ScrollMagic.Scene({
    triggerElement: "#pinContainer",
    triggerHook: "onLeave",
    offset: (navPlusAeroplaneHeight)*(-1),
    duration: "300%"
    })
    .setPin("#pinContainer")
    .setTween(wipeAnimation)
    .addTo(controller2)
    .on("start", callbackContainer);

    function callbackContainer(event){
        document.getElementById("textFCont").style.color = "#Eff0f5";
        var styleTextFirstCont = document.createElement('style');
        styleTextFirstCont.innerHTML = `
        .typewriter p {

            overflow: hidden; /* Ensures the content is not revealed until the animation */
            border-right: 2px solid white; /* The typwriter cursor, how big is it */
            white-space: nowrap; /* Keeps the content on a single line */
            margin: 0 auto; /* Gives that scrolling effect as the typing happens */
            letter-spacing: 2px; /* Adjust as needed */
            animation: 
              typing 4s steps(40, end),
              blink-caret .5s step-end infinite;
          }
          
          /* The typing effect */
          @keyframes typing {
              from { width: 0% }
              to { width: 100% }
            }
          
            @keyframes blink-caret {
              from, to { border-color: transparent }
              50% { border-color: white }
            }
        `;
        document.head.appendChild(styleTextFirstCont);

    }

    //MAIN PAGE PopUp Forms

    //display Login Form - we use the class name instead of the ID (bc we have multiple login buttons)
    let loginButton = document.getElementsByClassName("loginButton");
    let signupButton = document.getElementById("signupButton");
    let loginFormPopup = document.getElementById("LoginFormID");
    let signupFormPopup = document.getElementById("SignupFormID");
    let closebuttonLogIn = document.getElementById("closeLogInForm");
    let closebuttonSignUp = document.getElementById("closeSignUpForm");
    let overlayCollection = document.getElementsByClassName("overlayPopUp");
    let body = document.getElementById("bodyID");
    let click = false;

    if(loginButton){
        for(var i = 0; i < loginButton.length; i++){
            loginButton[i].addEventListener('click', clicked);
            loginButton[i].addEventListener('click', openTheLoginForm);
        }
    }
    if(signupButton){
        signupButton.addEventListener('click', openTheSignUpForm);
    }

    if(closebuttonSignUp){
        closebuttonSignUp.addEventListener("click", crossbar);
        closebuttonSignUp.addEventListener("click", closeTheSignUpForm);
    }

    if(closebuttonLogIn){
        closebuttonLogIn.addEventListener("click", crossbar);
        closebuttonLogIn.addEventListener("click", closeTheLogInForm);
    }

    function clicked() {
        click = true;
    }

    function crossbar(){
        click = false;
    }


    function openTheLoginForm() {

            closeTheSignUpForm();
            var stringYMiddle = (window.scrollY + (window.innerHeight * 0.5)).toString() + "px";
            loginFormPopup.style.top = stringYMiddle;
            for (var i = 0; i < overlayCollection.length; i++){
                overlayCollection[i].classList.add("active");
            }
            loginFormPopup.classList.add("open-popup");
            body.style.overflow = "hidden";
        
    }
    
    function closeTheLogInForm(){
        for (var i = 0; i < overlayCollection.length; i++){
            overlayCollection[i].classList.remove("active");
        }
        loginFormPopup.classList.remove("open-popup");
        if(!click){
            body.style.overflow = "visible";
        }
    }

    function openTheSignUpForm(){
            closeTheLogInForm();
            var stringYMiddle = (window.scrollY + (window.innerHeight * 0.5)).toString() + "px";
            signupFormPopup.style.top = stringYMiddle;
            for (var i = 0; i < overlayCollection.length; i++){
                overlayCollection[i].classList.add("active");
            }
            signupFormPopup.classList.add("open-popup");    
    }

    function closeTheSignUpForm(){
        for (var i = 0; i < overlayCollection.length; i++){
            overlayCollection[i].classList.remove("active");
        }
        signupFormPopup.classList.remove("open-popup");
        if(!click){
            body.style.overflow = "visible";
        }
    }

    //RESTRICT THE KEYBOARD INPUT
    let inputs = document.getElementsByClassName("keyboardconst");
    let feedbckCollection = document.getElementsByClassName("feedbck");
    // SIGN UP FORM
    // 0 -> Username 
    // 1 -> Email 
    // 2 -> Password
    // 3 -> Repeated Password
    // LOGIN FORM
    // 4 -> Username Login
    // 5 -> Password Login
    let regexp = /[^a-z0-9.@\-_ñ]/gi;
    if(inputs){
        for (let j = 0; j < inputs.length; j++){
            inputs[j].addEventListener('keyup', (e) => {
                inputs[j].value = inputs[j].value.replace(regexp, "");
            });
        }
    }


    //SIGNUP AND LOGIN BUTTONS THAT CALL THE API
    //the inputs fields are contained in the inputs Collection
    let signupAPIbutton = document.getElementById("signupAPI");
    let loginAPIbutton = document.getElementById("loginAPI");
    let urlUsername = "http://127.0.0.1:5014/checkUsername";
    let urlEmail = "http://127.0.0.1:5014/checkEmail";

    
    //we pass the information to the server, he acts as an intermediator between frontend & DB
    function createUser(username, email, password){
        var xmlhttp = new XMLHttpRequest();
        //random number for the cluster ID, between 100 000 000 and 999 999 999
        var clusterNumber = Math.round(Math.random() * (999999999 - 100000000) + 100000000);
        xmlhttp.open("POST", "http://127.0.0.1:5014/createUserAPI");
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState === XMLHttpRequest.DONE){
                if(xmlhttp.status === 200){
                    //we proceed to show the new user status on the webpage
                    crossbar();
                    closeTheSignUpForm();
                    changeToUserStatus();
                } else {
                    //we didnt manage to create the user, so we do not do nothing
                    //anyways, we make sure previously that we can create the user
                    //So this part of the function will never be runned
                }
            }
        };
        xmlhttp.send(JSON.stringify({"Username": username, "Email": email, "Password": password, "ClusterRandomId": clusterNumber.toString()}));
    }

    if(signupAPIbutton && loginAPIbutton) {
        signupAPIbutton.addEventListener('click', signupAPI);
        loginAPIbutton.addEventListener('click', loginAPI);
    }

    function signupAPI(){
        //check that any input it's empty
        let inpEmpty = false;
        for (let i = 0; i < 4; i++){
            if(inputEmpty(i)){
                inpEmpty = true;
            }
        }
        //if there is any empty input, we proceed to check each input
        //first we want to remark if the passwords match each other
        if(!inpEmpty) {
            //we check if the passwords are equal
            if((inputs[2].value === inputs[3].value) && (inputs[2].value != "")){
                inputs[2].classList.remove("is-invalid");
                inputs[2].classList.add("is-valid");
                inputs[3].classList.remove("is-invalid");
                inputs[3].classList.add("is-valid");
                //here we do the HTTP Requests for the username and for the email, to respect the architecture we do the HTTP Request to the Server and he will contact with the DB
                usernameJSON = JSON.stringify({"Username": inputs[0].value})
                emailJSON = JSON.stringify({"Email": inputs[1].value})
                PromisesArr = [new Promise((resolve, reject) => {
                        var httpUsername = new XMLHttpRequest();
                        httpUsername.onreadystatechange = function() {
                            if(httpUsername.readyState === XMLHttpRequest.DONE){
                                if(httpUsername.status === 200){
                                    //the username already exists
                                    inputs[0].classList.remove("is-valid");
                                    inputs[0].classList.add("is-invalid");
                                    feedbckCollection[0].innerHTML= "Username already in use";
                                    reject(false);
                                } else {
                                    //the username does not exist yet
                                    inputs[0].classList.remove("is-invalid");
                                    inputs[0].classList.add("is-valid");
                                    feedbckCollection[0].innerHTML= "";
                                    resolve(true);
                                }
                            }
                        };
                        httpUsername.open("POST", urlUsername);
                        httpUsername.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        httpUsername.send(usernameJSON);
                    }),
                    new Promise((resolve, reject) => {
                        var httpEmail = new XMLHttpRequest();
                        httpEmail.onreadystatechange = function() {
                            if(httpEmail.readyState === XMLHttpRequest.DONE){
                                if(httpEmail.status === 200){ 
                                    //the email already exists
                                    inputs[1].classList.remove("is-valid");
                                    inputs[1].classList.add("is-invalid");
                                    feedbckCollection[1].innerHTML= "Email already in use";
                                    reject();
                        
                                }
                                else if(httpEmail.status === 404){
                                    //the email does not exist yet
                                    inputs[1].classList.remove("is-invalid");
                                    inputs[1].classList.add("is-valid");
                                    feedbckCollection[1].innerHTML= "";
                                    resolve();
                                }
                            }
                        };
                        httpEmail.open("POST", urlEmail);
                        httpEmail.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        httpEmail.send(emailJSON);
                    })
                ];
                
                Promise.all([PromisesArr[0], PromisesArr[1]]).then((resp) => {
                     
                    //Both promises returned resolve(), so we can:
                    //1. call this function, that is going to call the Flask Server and is going to contact with the DB to create the User
                    createUser(inputs[0].value, inputs[1].value, inputs[2].value);
                     
                }).catch((err) => {
                    //doesnt do nothing, one of the promises returned reject (or both)
                }) 
            }
            else
            {
                inputs[2].classList.remove("is-valid");
                inputs[2].classList.add("is-invalid");
                feedbckCollection[2].innerHTML= "Passwords must match";
                inputs[3].classList.remove("is-valid");
                inputs[3].classList.add("is-invalid");
                feedbckCollection[3].innerHTML= "Passwords must match";
            }
        }

    }
    

    function loginAPI(){
        let inpEmpty = false;
        for (let i = 4; i < 6; i++){
            if(inputEmpty(i)){
                inpEmpty = true;
            }
        }
        if(!inpEmpty){
            jsUser = inputs[4].value;
            jsPassword = inputs[5].value;
            var xmlhttp = new XMLHttpRequest();
            //from Flask, we only receive the response status number
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState === XMLHttpRequest.DONE){
                    if(xmlhttp.status === 200){ 
                        //user exists, so we proceed to log
                        inputs[4].classList.remove("is-invalid");
                        inputs[4].classList.add("is-valid");
                        inputs[5].classList.remove("is-invalid");
                        inputs[5].classList.add("is-valid");
                        feedbckCollection[4].innerHTML= "";
                        feedbckCollection[5].innerHTML= "";
                        crossbar();
                        closeTheLogInForm();
                        changeToUserStatus();
            
                    }
                    else if(xmlhttp.status === 404){
                        //user does not exist
                        inputs[4].classList.remove("is-valid");
                        inputs[4].classList.add("is-invalid");
                        inputs[5].classList.remove("is-valid");
                        inputs[5].classList.add("is-invalid");
                        feedbckCollection[4].innerHTML= "User does not exist";
                        feedbckCollection[5].innerHTML= "User does not exist";
                    }
                }
            };
            //connection with the web server (FLASK), he's the one that acts as an intermediator between frontend & API/database
            xmlhttp.open("POST", "http://127.0.0.1:5014/loginAPI");
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlhttp.send(JSON.stringify({"Username": jsUser, "Password": jsPassword}));
        }
    }

    function inputEmpty(index){
        let empty = false; 
        if(inputs[index].value === ""){
            empty = true;
            inputs[index].classList.remove("is-valid");
            inputs[index].classList.add("is-invalid");
            feedbckCollection[index].innerHTML= "Cannot be empty";
        }
        else {
            inputs[index].classList.remove("is-invalid");
            feedbckCollection[index].innerHTML= "";
        }
        return empty;
    }

    
    /*
    loginbutton[0] = navbar login button
    loginbutton[1] = login button in the carousel
    loginbutton[2] = login button inside of the SignUp form
    */

    function changeToUserStatus(){

        //we load this URL, that is going to load the homepage with the user logged
        window.location.href = "http://127.0.0.1:5014/userstatus";     
    
    }
 


      
    

   
    

   

	