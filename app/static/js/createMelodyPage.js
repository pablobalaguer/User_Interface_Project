//CODE TO MAKE THE USER SCROLL TO THE TOP OF THE DOCUMENT

let bcktop = document.getElementById("btn-back-to-top");

if (bcktop) {
    bcktop.addEventListener("click", backToTop);
}

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//CUSTOMIZE YOUR NEW MELODY part
let measurebck = document.getElementsByClassName("meas-backg");
let firstGroupSepMes = []; //Dynamic array where we will store the first group in the Separated measures
//code for the consecutive measures
if (measurebck) {
    for (let i = 0; i < measurebck.length; i++) {
        measurebck[i].addEventListener('click', () => {
            if(consCarItem.classList.contains("active")){ //the measures will perform as Continuous only (red color)
                switch (i) {
                    case 0:
                        if (measurebck[(i + 1)].classList.contains("ActiveContinuous")) {
                            changeBckColor(i);
                        }
                        else {
                            if (measurebck[(i)].classList.contains("ActiveContinuous") && activeMeasureCounter() == 1) {
                                changeBckColor(i);
                            }
                            else {
                                disappearAllMeasures();
                                changeBckColor(i);
                            }
                        }
                        break;
    
                    case 31:
                        if (measurebck[(i - 1)].classList.contains("ActiveContinuous")) {
                            changeBckColor(i);
                        }
                        else {
                            if (measurebck[(i)].classList.contains("ActiveContinuous") && activeMeasureCounter() == 1) {
                                changeBckColor(i);
                            }
                            else {
                                disappearAllMeasures();
                                changeBckColor(i);
                            }
                        }
                        break;
                    default:
                        if (measurebck[(i - 1)].classList.contains("ActiveContinuous") || measurebck[(i + 1)].classList.contains("ActiveContinuous")) {
                            if (measurebck[(i - 1)].classList.contains("ActiveContinuous") && measurebck[(i + 1)].classList.contains("ActiveContinuous")) {
                                disappearAllMeasures();
                            }
                            else {
                                changeBckColor(i);
                            }
                        }
                        else {
                            if (measurebck[(i)].classList.contains("ActiveContinuous") && activeMeasureCounter() == 1) {
                                changeBckColor(i);
                            }
                            else {
                                disappearAllMeasures();
                                changeBckColor(i);
                            }
                        }
                }
            }
            else { //the measures will perform as Separated only (blue color)
                if(!switchSepMeasure.checked){ //if we are selecting the first group of measures performs like continuous
                    switch (i) {
                        case 0:
                            if (measurebck[(i + 1)].classList.contains("ActiveSeparated")) {
                                changeBckColor(i);
                            }
                            else {
                                if (measurebck[(i)].classList.contains("ActiveSeparated") && activeMeasureCounter() == 1) {
                                    changeBckColor(i);
                                }
                                else {
                                    disappearAllMeasures();
                                    changeBckColor(i);
                                }
                            }
                            break;
        
                        case 31:
                            if (measurebck[(i - 1)].classList.contains("ActiveSeparated")) {
                                changeBckColor(i);
                            }
                            else {
                                if (measurebck[(i)].classList.contains("ActiveSeparated") && activeMeasureCounter() == 1) {
                                    changeBckColor(i);
                                }
                                else {
                                    disappearAllMeasures();
                                    changeBckColor(i);
                                }
                            }
                            break;
                        default:
                            if (measurebck[(i - 1)].classList.contains("ActiveSeparated") || measurebck[(i + 1)].classList.contains("ActiveSeparated")) {
                                if (measurebck[(i - 1)].classList.contains("ActiveSeparated") && measurebck[(i + 1)].classList.contains("ActiveSeparated")) {
                                    disappearAllMeasures();
                                }
                                else {
                                    changeBckColor(i);
                                }
                            }
                            else {
                                if (measurebck[(i)].classList.contains("ActiveSeparated") && activeMeasureCounter() == 1) {
                                    changeBckColor(i);
                                }
                                else {
                                    disappearAllMeasures();
                                    changeBckColor(i);
                                }
                            }
                    }
                }
                else { //when we select the second group of measurements directly select the group of measurements where the constraint it's applied
                    //when we mark the checkbox (switchSeparatedMeasure) we store in the checkbox the activeMeasureCounter() value
                    let measuresFirstGroupLength = parseInt(switchSepMeasure.value);
                    let measuresSecondGroupLength;
                    switch (durSepSelector.selectedIndex) {
                        case 2: //Double up each duration
                            measuresSecondGroupLength = 2 * measuresFirstGroupLength;
                            break;
                        case 3: //Halve each duration
                            measuresSecondGroupLength = Math.round((measuresFirstGroupLength/2));
                            break;
                        default: 
                        measuresSecondGroupLength = measuresFirstGroupLength;
                    }
                    if((i > firstGroupSepMes[(firstGroupSepMes.length - 1)]) && (i + measuresSecondGroupLength) <= numberMeasuresDisplayed()){
                        activeSecondGroupMeasures(i, measuresSecondGroupLength);
                    }
                }   
            }
            
            activeMeasureCounter(); //we just recall this function to activate the Proxy Object and control the Save Button
        });
    }
}

//FUNCTION THAT CHECKS WHAT NUMBER OF MEASURES ARE DISPLAYED
function numberMeasuresDisplayed(){
    if(measures32row[0].classList.contains("active")){
        return 32;
    }
    else if(measures16row[0].classList.contains("active")){
        return 16;
    }
    return 8;
}

//FUNCTION THAT CHECKS IF ALL OF THE CONSECUTIVE MEASURES AREN'T ACTIVE & ACTIVATES THEM (this is for the second group of measures)
function activeSecondGroupMeasures(index, length){
    let activeClass = currentActiveClass();
    let measuresActive = false;
    let finalindex = index + length;
    let musicScoreLength = numberMeasuresDisplayed();
    for (var i = 0; i < musicScoreLength; i++) {
        if (!firstGroupSepMes.includes(i)) {
            measurebck[(i)].classList.remove(activeClass);
        }
    }
    for(var j = index; (j < finalindex) && !measuresActive; j++){
        if(measurebck[j].classList.contains(activeClass)){
            measuresActive = true;
        }
    }
    if(!measuresActive){
        for(var j = index; (j < finalindex) && !measuresActive; j++){
            measurebck[j].classList.add("ActiveSeparated");
        }
    }
}

//FUNCTION WHERE WE FIND OUT WHAT IS THE CURRENT ACTIVE CLASS
function currentActiveClass(){
    let activeClassString = "ActiveContinuous";
    if(!consCarItem.classList.contains("active")){
        activeClassString = "ActiveSeparated";
    }
    return activeClassString;
    
}
//FUNCTION THAT CHANGES THE COLOR OF THE SELECTED MEASURE
function changeBckColor(measureNumber) {
    let activeClass = currentActiveClass();
    if (measurebck[measureNumber].classList.contains(activeClass)) {
        measurebck[measureNumber].classList.remove(activeClass);
    } else {
        measurebck[measureNumber].classList.add(activeClass);
    }
}

//SELECT NUMBER OF MEASURES - DROPDOWN BUTTONS
var measures8dropDown = document.getElementById("measures8-dropdown");
var measures16dropDown = document.getElementById("measures16-dropdown");
var measures32dropDown = document.getElementById("measures32-dropdown");

var nbActiveBars = 8;

//MEASURES WHERE IT AFFECTS
var measures16row = document.getElementsByClassName("measure16"); //this is only one row, the div that contains the 16 (8 to 15) measures -> Collection with only one row
var measures32row = document.getElementsByClassName("measure32"); //2 rows, the divs that contains the 32 (16 to 31) measures -> Collection with 2 rows of 8 bars

if (measures8dropDown) {
    measures8dropDown.addEventListener('click', display8bars);
}

if (measures16dropDown) {
    measures16dropDown.addEventListener('click', display16bars);
}

if (measures32dropDown) {
    measures32dropDown.addEventListener('click', display32bars);
}

function display8bars() {
    disappearMeasuresWhen8Selected();
    measures16row[0].classList.remove("active");
    for (var i = 0; i < measures32row.length; i++) { 
        measures32row[i].classList.remove("active");
    }
    nbActiveBars = 8;
}

function display16bars() {
    disappearMeasuresWhen16Selected();
    measures16row[0].classList.add("active");
    for (var i = 0; i < measures32row.length; i++) {
        measures32row[i].classList.remove("active");
    }
    nbActiveBars = 16;

}
function display32bars() {
    measures16row[0].classList.add("active");
    for (var i = 0; i < measures32row.length; i++) {
        measures32row[i].classList.add("active");
    }
    nbActiveBars = 32;
}
//ACTIVE MEASURE COUNTER
    //we have to do it with a proxy ///Indeed, it was not necessary doing it with a proxy
const counterObj = {
    value : 0
};

const handler1 = {
    
    set: (o, property, newValue) => {
        if(consCarItem.classList.contains("active")){ //Save button behaviour for Consecutive Measures
            if(newValue <= 1) {
                saveConstraintsButton.classList.add("disabled-general");
            }
            else {
                saveConstraintsButton.classList.remove("disabled-general");
            }
        }
        else { //Save button behaviour for Separated Measures
                if(newValue == 0){
                switchSepMeasure.disabled = true;
                saveConstraintsButton.classList.add("disabled-general");
            } else {
                switchSepMeasure.disabled = false;
                if((switchSepMeasure.checked == true) && (newValue > firstGroupSepMes.length)){ //we make sure that we have selected the second group of measures
                    saveConstraintsButton.classList.remove("disabled-general");
                }
                else {
                    saveConstraintsButton.classList.add("disabled-general");
                }
            }

        }
        
        o[property] = newValue;
    }
};
const counterProxy = new Proxy(counterObj, handler1);


function activeMeasureCounter() {
    let activeClass = currentActiveClass();
    let j = 0;
    let musicScoreLength = numberMeasuresDisplayed();
    for (var i = 0; i < musicScoreLength; i++) {
        if (measurebck[(i)].classList.contains(activeClass)) {
            j++;
        }
    }
    counterProxy.value = j;
    return j;
}

//DELETE MARKED MEASURES WHEN THE MEASURE ROW DISSAPEARS
function disappearAllMeasures() {
    let activeClass = currentActiveClass();
    for (var i = 0; i < 8; i++) {
        measurebck[i].classList.remove(activeClass);
    }
    disappearMeasuresWhen8Selected();
}

function disappearMeasuresWhen8Selected() {
    let activeClass2 = currentActiveClass();
    for (var j = 8; j < 16; j++) {
        measurebck[j].classList.remove(activeClass2);
    }
    disappearMeasuresWhen16Selected();
}

function disappearMeasuresWhen16Selected() {
    let activeClass3 = currentActiveClass();
    for (var i = 16; i < 32; i++) {
        measurebck[i].classList.remove(activeClass3);
    }
    //we call to activeMeasureCounter()  to disable the Save Button when we have marked measures (ex: 30 and 31 measures selected)
    //but we "unmark" them via selecting a fever number of bars (from 32 bars to 8)
    activeMeasureCounter(); 
}


//DISABLE / ENABLE MUSIC SCORE

let pitchContSelector = document.getElementById("idConstraintPitchContGroup");
let durContSelector = document.getElementById("idConstraintDurationContGroup");
let pitchSepSelector = document.getElementById("idConstraintPitchSepGroup");
let durSepSelector = document.getElementById("idConstraintDurationSepGroup");
let musicScore = document.getElementById("musicscore");
let consCarItem = document.getElementById("consCarItem");
let arrowPrev = document.getElementById("carouselPrev");
let arrowPost = document.getElementById("carouselNext");
let saveConstraintsButton = document.getElementById("saveDurAndPitchRow");
let switchSepMeasure = document.getElementById("idInitialSepMeas");
let nextPageButton = document.getElementById("nextPageButton");

if (pitchContSelector) {
    pitchContSelector.addEventListener('click', enableDisableContent);
}

if (durContSelector) {
    durContSelector.addEventListener('click', enableDisableContent);
}

if (pitchSepSelector) {
    pitchSepSelector.addEventListener('click', enableDisableContent);
}

if(durSepSelector) {
    durSepSelector.addEventListener('click', enableDisableContent);
}

if(arrowPrev) {
    arrowPrev.addEventListener('click', enableDisableContentArrows);
}

if(arrowPost) {
    arrowPost.addEventListener('click', enableDisableContentArrows);
}

if(saveConstraintsButton){
    saveConstraintsButton.addEventListener('click', saveConstraint);
}

if(nextPageButton){
    nextPageButton.addEventListener('click',removeUnusedConstraints);
}


if(switchSepMeasure){
    switchSepMeasure.addEventListener('click', countFirstGroup);
}

function enableDisableContent() {
    if (consCarItem.classList.contains("active")) {
        if (pitchContSelector.selectedIndex == 0 && durContSelector.selectedIndex == 0) {
            musicScore.classList.add("disabled-general");
            //saveConstraintsButton.classList.add("disabled-general"); Not necessary, this will be disabled when we call the proxy
            disappearAllMeasures();
        }
        else {
            musicScore.classList.remove("disabled-general");    
        }
    } else {
        if(pitchSepSelector.selectedIndex == 0 && durSepSelector.selectedIndex == 0){
            musicScore.classList.add("disabled-general");
            //saveConstraintsButton.classList.add("disabled-general"); Not necessary, this will be disabled when we call the proxy
            switchSepMeasure.checked = false;
            switchSepMeasure.disabled = true;
            if(firstGroupSepMes.length > 0){
                for(let j = 0; j < firstGroupSepMes.length; j++){
                    measurebck[firstGroupSepMes[j]].classList.remove("Saved");
                }
                firstGroupSepMes = []; //we need to empty the dynamic array because we remove every measure
            }
            disappearAllMeasures();
        }
        else if(firstGroupSepMes.length > 0){ //this implies we are selecting the second measures group, we have a first measure group
            let activeClass = currentActiveClass();
            let musicScoreLength = numberMeasuresDisplayed();
            for (var i = 0; i < musicScoreLength; i++) {
                if (!firstGroupSepMes.includes(i)) {
                    measurebck[(i)].classList.remove(activeClass);
                }
            }
            counterProxy.value = firstGroupSepMes.length;
        } else {
            musicScore.classList.remove("disabled-general");
        }
    }
}

function enableDisableContentArrows() {
    if(consCarItem.classList.contains("active")) {
        pitchContSelector.selectedIndex = 0;
        durContSelector.selectedIndex = 0;   
    } else {
        pitchSepSelector.selectedIndex = 0; 
        durSepSelector.selectedIndex = 0;
        switchSepMeasure.checked = false;
        switchSepMeasure.disabled = true;
        if(firstGroupSepMes.length > 0){
            for(let j = 0; j < firstGroupSepMes.length; j++){
                measurebck[firstGroupSepMes[j]].classList.remove("Saved");
            }
            firstGroupSepMes = []; //we need to empty the dynamic array because we remove every measure, and its Saved class
        }
    }
    disappearAllMeasures(); 
    //saveConstraintsButton.classList.add("disabled-general"); not necessary, dissapearAllMeasures() calls ActiveMeasuresCounter() and desactivates the savebutton
    musicScore.classList.add("disabled-general");
}

function countFirstGroup() {
    switchSepMeasure.value = firstGroupSepCounter();
}

function firstGroupSepCounter() {
    let activeClass = currentActiveClass();
    let musicScoreLength = numberMeasuresDisplayed();
    if(switchSepMeasure.checked == true){
        firstGroupSepMes = [];
        let j = 0;
        for (var i = 0; i < musicScoreLength; i++) {
            if (measurebck[(i)].classList.contains(activeClass)) {
                firstGroupSepMes.push(i); //this only makes sense for the Separated sequence, that's why we sort of implement again the method 'Active measures counter'
                measurebck[(i)].classList.add("Saved");
                j++;
            }
        }
        counterProxy.value = j;
        return j;
    }
    else if(switchSepMeasure.checked == false) {
        for (var i = 0; i < musicScoreLength; i++) {
            if (!firstGroupSepMes.includes(i)) {
                measurebck[(i)].classList.remove(activeClass);
            } else {
                measurebck[(i)].classList.remove("Saved");
            }

        }
        counterProxy.value = firstGroupSepMes.length;
        return firstGroupSepMes.length; //not necessary when the check is false
    }    
}

//SAVE CONSTRAINTS IN A LIST

let pitchConstraints = [];
let durationConstraints = [];

function saveConstraint() {
    let stringPitchConst;
    let stringDurationConst;
    let musicScoreLength = numberMeasuresDisplayed();
    let activeClass = currentActiveClass();
    let firstMeasureFound = false;
    let firstMeasureNumber;
    let lastMeasureFound = false;
    let lastMeasureNumber;

    //we get the indexes of the continuous measures
    //Continuous -> Indexes of the continuous measures
    //Separated -> Indexes of the second group of continuous measures

    if(activeClass == "ActiveContinuous"){
        //we get the indexes of the continuous measures
        //Continuous -> Indexes of the continuous measures
        for(var i = 0; i < musicScoreLength && !lastMeasureFound; i++){
            if(!firstMeasureFound && measurebck[i].classList.contains(activeClass)){
                firstMeasureFound = true;
                firstMeasureNumber = i;
            }
            else if(firstMeasureFound && measurebck[i].classList.contains(activeClass)){
                lastMeasureNumber = i;
            }
            else if(firstMeasureFound){
                lastMeasureFound = true;
            }
        }
        if(pitchContSelector.selectedIndex != 0){
            stringPitchConst = pitchContSelector.value + ":" + firstMeasureNumber + ":" + lastMeasureNumber + ";";
            pitchConstraints.push(stringPitchConst);
        }
        if(durContSelector.selectedIndex != 0){
            stringDurationConst = durContSelector.value + ":" + firstMeasureNumber + ":" + lastMeasureNumber + ";";
            durationConstraints.push(stringDurationConst);
        }
    } else {
        //we get the indexes of the continuous measures
        //Separated -> Indexes of the second group of continuous measures
        //we create the distintion because we have to check if it does not contain Saved class
        for(var i = 0; i < musicScoreLength && !lastMeasureFound; i++){
            if(!firstMeasureFound && measurebck[i].classList.contains(activeClass) && !measurebck[i].classList.contains("Saved")){
                firstMeasureFound = true;
                firstMeasureNumber = i;
            }
            else if(firstMeasureFound && measurebck[i].classList.contains(activeClass) && !measurebck[i].classList.contains("Saved")){
                lastMeasureNumber = i;
            }
            else if(firstMeasureFound){
                lastMeasureFound = true;
            }
        }
        //unique case when the second group of consecutive measures == 1
        if(lastMeasureNumber == "undefined"){
            lastMeasureNumber = firstMeasureNumber;
        }
        if(pitchSepSelector.selectedIndex != 0){
            stringPitchConst = pitchSepSelector.value + ":" + firstGroupSepMes[0] + ":" + firstGroupSepMes[firstGroupSepMes.length - 1] + "-" + firstMeasureNumber + ":" + lastMeasureNumber + ";";
            pitchConstraints.push(stringPitchConst);
        }
        if(durSepSelector.selectedIndex != 0){
            stringDurationConst = durSepSelector.value + ":" + firstGroupSepMes[0] + ":" + firstGroupSepMes[firstGroupSepMes.length - 1] + "-" + firstMeasureNumber + ":" + lastMeasureNumber + ";";
            durationConstraints.push(stringDurationConst);
        }
    }

    enableDisableContentArrows();
    updatePitchConstraintsDisplay();
    updateDurConstraintsDisplay();


}

// DISPLAY CONSTRAINTS
// Functions to update the pitch constraints display
function updatePitchConstraintsDisplay() {
  const constraintsList = document.getElementById("pitch-constraints");
  constraintsList.innerHTML = "";
  let pitch = true;
  for (let i = 0; i < pitchConstraints.length; i++) {
    /*
    const constraint = pitchConstraints[i];
    const li = document.createElement("li");
    li.innerHTML = constraint;
    li.classList.add("border px-2 my-2");
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "&times;";
    removeButton.style.cssText  = "background-color: #9b1c31;color: #fff;font-size: 15px;border: none;border-radius: 5px;padding: 2px 6px;cursor: pointer;text-align: center;text-decoration: none;display: inline-block;transition-duration: 0.4s;margin: 10px; ";
    removeButton.addEventListener("click", function() {
      removePitchConstraint(i);
    });
    li.appendChild(removeButton);
    constraintsList.appendChild(li);
    */
    li = createDiv(pitchConstraints[i], i, pitch);
    constraintsList.appendChild(li);
  }
}

function createDiv(stringConstraint, index, pitch) {
    const li = document.createElement("li");
    li.classList.add("border");
    li.classList.add("border-dark");
    li.classList.add("px-2");
    li.classList.add("my-2");
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "&times;";
    removeButton.style.cssText  = "background-color: #9b1c31;color: #fff;font-size: 15px;border: none;border-radius: 5px;padding: 2px 6px;cursor: pointer;text-align: center;text-decoration: none;display: inline-block;transition-duration: 0.4s;margin: 10px; ";
    removeButton.addEventListener("click", function() {
        if(pitch){
            removePitchConstraint(index);
        }
        else {
            removeDurConstraint(index);
        }
    });
    let cfluid = document.createElement("div");
    cfluid.classList.add("container-fluid");
    cfluid.classList.add("justify-content-center");
    let row = document.createElement("div");
    row.classList.add("row");
    let col10 = document.createElement("div");
    col10.classList.add("col-10");
    col10.classList.add("align-self-center");
    let col2 = document.createElement("div");
    col2.classList.add("col-2");

    col2.appendChild(removeButton);
    col10.innerHTML = "<b>" + stringConstraint + "</b>";
    row.appendChild(col10);
    row.appendChild(col2);
    cfluid.appendChild(row);
    li.appendChild(cfluid);
    return li;
}


function removePitchConstraint(index) {
  pitchConstraints.splice(index, 1);
  updatePitchConstraintsDisplay();
}


// Functions to update the duration constraints display
function updateDurConstraintsDisplay() {
  const constraintsList = document.getElementById("dur-constraints");
  constraintsList.innerHTML = "";
  let pitch = false;
  for (let i = 0; i < durationConstraints.length; i++) {
    /*
    const constraint = durationConstraints[i];
    const li = document.createElement("li");
    li.innerHTML = constraint + "              ";
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "&times;";
    removeButton.style.cssText  = "background-color: #9b1c31;color: #fff;font-size: 15px;border: none;border-radius: 5px;padding: 2px 6px;cursor: pointer;text-align: center;text-decoration: none;display: inline-block;transition-duration: 0.4s;margin: 10px;";
    removeButton.addEventListener("click", function() {
      removeDurConstraint(i);
    });
    li.appendChild(removeButton);
    constraintsList.appendChild(li);
    */
    li = createDiv(durationConstraints[i], i, pitch);
    constraintsList.appendChild(li);
  }
}

function removeDurConstraint(index) {
  durationConstraints.splice(index, 1);
  updateDurConstraintsDisplay();
}


// Remove unused constraints when clicked 'continue' button

function removeUnusedConstraints() {
  // Pitch
  const toRemove = [];
  for (let i = 0; i < pitchConstraints.length; i++) {
    const constraint = pitchConstraints[i];
    const endInt = parseInt(constraint.split(":")[2]);
    const endIntSep = parseInt(constraint.split(":")[constraint.split(":").length - 1])
    if (endInt > nbActiveBars || endIntSep > nbActiveBars) {
      toRemove.push(constraint);
    }
  }

  for (let i = 0; i < toRemove.length; i++) {
    const constraint = toRemove[i];
    const index = pitchConstraints.indexOf(constraint);

    if (index !== -1) {
        removePitchConstraint(index)
        }
    }

  // Duration
  const toRemoveDur = [];
  for (let i = 0; i < durationConstraints.length; i++) {
    const constraint = durationConstraints[i];
    const endInt = parseInt(constraint.split(":")[2]);
    const endIntSep = parseInt(constraint.split(":")[constraint.split(":").length - 1])
    if (endInt > nbActiveBars || endIntSep > nbActiveBars) {
      toRemoveDur.push(constraint);
    }
  }

  for (let i = 0; i < toRemoveDur.length; i++) {
    const constraint = toRemoveDur[i];
    const index = durationConstraints.indexOf(constraint);

    if (index !== -1) {
        removeDurConstraint(index)
        }
    }

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