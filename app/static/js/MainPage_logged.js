
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


//MIDI Files checker function - Only available in this .js file 

let MIDIloadButton = document.getElementById("formFileLg");

if(MIDIloadButton){
    MIDIloadButton.addEventListener("input", function() {
        for(var i = 0; i < MIDIloadButton.files.length; i++) {
            const midiFile = MIDIloadButton.files[i];
            alert("File selected: " + midiFile.name);
            sendMIDIFile(midiFile, i, MIDIloadButton.files.length);
        }
    });
}

// Send a POST request with midifile to the flask function
//it's necessary to send the MIDI Files to the Flask function sequentially bc
//if we add a counter it can be accessed by both httprequest at the same time and execute the function when it's not needed
function sendMIDIFile(midiFile, index, midilength) {
  try{
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:5014/saveMidFile", true);
      const formData = new FormData(); // creates a form object
      formData.append('midifile', midiFile);
      //only once we got the last POST reply we execute the function
      if(index == (midilength - 1)){
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    checkIfMidiUpld();
                }
            }
        };
      }
      xhr.send(formData);
      
  }
  catch(err){
    alert(err)
    }
}



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

    //enable/disable continue button depending on what option is selected and if we have uploaded MIDI Files (if train is selected)
    //change the ContinueButton.onclick function depending on what we selected
    let MIDIRadioButton = document.getElementById("IDradioMIDI");
    let CheckpointRadioButton = document.getElementById("IDradioCheckpoint");
    let continueButton = document.getElementById("contButton");
    let midiFilesRow = document.getElementById("midiFilesRow");
    let midiLabel = document.getElementById("midiFilesLabel");
    let usernameString = (document.getElementById("idusername").innerHTML).replace(/\s+/g, '');

    if(MIDIRadioButton){
        MIDIRadioButton.addEventListener('click', continueEnableDisable)
    }

    if(CheckpointRadioButton){
        CheckpointRadioButton.addEventListener('click', continueEnableDisable)
    }

    function continueEnableDisable(){
        if(CheckpointRadioButton.checked){
            continueButton.classList.remove('disabled-general');
            midiFilesRow.classList.add('disabled-general');
            continueButton.setAttribute("onclick", "document.location.href='/"+ usernameString + "/checkpointSelected';");
        }
        else {
            midiFilesRow.classList.remove('disabled-general');
            continueButton.setAttribute("onclick", "document.location.href='/0';")
            setTimeout(checkIfMidiUpld(), 3000);
        }
    }
    
    function checkIfMidiUpld(){
        
        xmlhttpmidi = new XMLHttpRequest();
        xmlhttpmidi.responseType = 'json';
        xmlhttpmidi.open("GET", "http://localhost:5014/checkIfMidiUploaded");
        xmlhttpmidi.onreadystatechange = () => {
            if(xmlhttpmidi.readyState === XMLHttpRequest.DONE){
                if(xmlhttpmidi.status === 200){
                    var jsonResponse = xmlhttpmidi.response;
                    if(jsonResponse['answer']){
                        continueButton.classList.remove('disabled-general');
                    }else{
                        continueButton.classList.add('disabled-general');
                    }
                    midiLabel.innerHTML = jsonResponse['midis'];
                    updateMidiArray(jsonResponse['midis']);
                    
                }
            }
        };
        xmlhttpmidi.send();
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


//Change the status of the MIDI Files uploaded 
midiArray = []
midiFilesListDisplay = document.getElementById("midifileslist");

function updateMidiArray(midi){
    //if we do not upload any MIDI File the response will be "", so we do not store it
    if(midi == ""){}
    else{
        let substrings = midi.split(" ");
        for(var i = 0; i < substrings.length; i++){
            let substr = substrings[i];
            if(!midiArray.includes(substr)){
                midiArray.push(substr);
            }
        }
        updateMIDIFilesDisplay();
    }
}

function updateMIDIFilesDisplay(){
    midiFilesListDisplay.innerHTML = "";
    if(midiArray.length == 0){
        //once we delete all the MIDI Files we can not continue if we have the Upload MIDI Files selected
        //Continue button will be available again only if we upload more MIDI Files or if we select the CHECKPOINT
        //We recall the function just in case we are deleting the MIDI Files when we have the checkpoint selected
        continueEnableDisable();
    } else {
        for(let j = 0; j < midiArray.length; j++){
            currentMidiFile = midiArray[j];
            li = document.createElement("li");
            li.classList.add("mb-4");
            removeButton = document.createElement("button");
            removeButton.innerHTML = "&times;";
            removeButton.style.cssText  = "background-color: #9b1c31;color: #fff;font-size: 15px;border: none;border-radius: 5px;padding: 2px 6px;cursor: pointer;text-align: center;text-decoration: none;display: inline-block;transition-duration: 0.4s;margin: 10px; ";
            removeButton.addEventListener("click", () => {
                removeMIDIFile(j);
            });
            li.appendChild(removeButton);
            imgAndSample(li, currentMidiFile);
            midiFilesListDisplay.appendChild(li);
        }
    }
    
}

//function that creates another ul (unordered list), and after we append 2 li, one with the image and the other one with the sample's name
function imgAndSample(liToAppend, sampletext){
    ulimgandtext = document.createElement("ul");
    ulimgandtext.style = "list-style-type: none;";
    //ulimgandtext.classList.add("border");
    //ulimgandtext.classList.add("rounded");
    liimg = document.createElement("li");
    liimg.style = "float: none";
    lisampletext = document.createElement("li");
    lisampletext.style = "float: none";
    img = new Image(50, 50);
    img.src = "static/images/midifile.png";
    img.classList.add("img-fluid");
    liimg.append(img);
    lisampletext.innerHTML = sampletext;
    ulimgandtext.append(liimg);
    ulimgandtext.append(lisampletext);
    liToAppend.append(ulimgandtext);
}

function removeMIDIFile(index) {
    httpRemoveMidi = new XMLHttpRequest();
    httpRemoveMidi.open("POST", "http://127.0.0.1:5014/deleteMidiFile");
    httpRemoveMidi.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpRemoveMidi.send(JSON.stringify({"Filename": midiArray[index]}));
    midiArray.splice(index, 1);
    updateMIDIFilesDisplay();
}

   
    

   

	