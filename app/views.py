'''
Imports
'''
import shutil
import json
import requests
from flask import request, flash, \
    redirect, url_for, render_template, make_response
from flask import jsonify
import os
from app import app
from app import midi_files_proc_music21 as mfpm
from flask_cors import CORS, cross_origin
import threading

UserIsLogged = False
sessionUser = ""
sessionEmail = ""
sessionPassword = ""
#this is to update the list of MIDI Files that the user uploaded
midiFilesList = []
#this variable will determine if you train the model or if you simply use the checkpoint
training = True

'''
homepage_not_log route, whenever you open https://localhost:port/, it will open this homepage
'''
@app.route('/', methods=['GET', 'POST'])
#We add the CORS package to solve the problems of CORS policy when we make Request to the Flask functions
@cross_origin(origin='*')
def homepage_not_log():
    global UserIsLogged    
    global sessionUser 
    global sessionEmail 
    global sessionPassword 
    global midiFilesList
    global training
    UserIsLogged = False
    sessionUser = ""
    sessionEmail = ""
    sessionPassword = ""
    midiFilesList = []
    training = True
    return render_template('homepage_not_logged.html')

@app.route('/checkIfMidiUploaded', methods=['GET'])
@cross_origin(origin='*')
def midiuploaded():
    global midiFilesList
    midiUpl = False
    cwd,directory,path_om,path_cm,path_MIDI_garbage = mfpm.path_establish(sessionUser)
    for f in os.scandir(directory):
        if (f.is_file() and f.name.endswith('.mid')):
            if f.name not in midiFilesList:
                midiFilesList.append(f.name)

            midiUpl = True
    
    response = jsonify(answer=midiUpl, midis=' '.join(midiFilesList))  
    return response

@app.route('/userstatus', methods=['GET'])
def redirect_user():
    if(UserIsLogged):
        return redirect(url_for('homepage_log', inputUsername=sessionUser))
    else:
        return(redirect(url_for('homepage_not_log')))
    
@app.route('/<string:inputUsername>', methods=['GET'])
def homepage_log(inputUsername):
    #Make sure that when we log the user for the first time there's any MIDI File in the Folder where we store the MIDI FIles before the Continue button
    #we make use of threading to create the user's folder before creating folders inside of the user's folder
    #we basically use the threads to make it sequential, bc we cannot use the processes module due to the Windows OS
    ospath = os.getcwd()
    userpath = os.getcwd() + '/users/' + sessionUser
    t1 = threading.Thread(target=recreateFolder, args=(ospath, '/users/' + sessionUser))
    t2 = threading.Thread(target=recreateFolder, args=(userpath, '/midi_files_checking'))
    t1.start()
    t1.join()
    t2.start()
    t2.join()
    return render_template('homepage_logged.html', rendTempUsername = sessionUser, rendTempEmail = sessionEmail)

'''
Constraints choosing route. Opened when the button 'Continue' is clicked from the mainpage 
See homepage.html button 'Continue' to see the link
'''
#if TRAIN ALGORITHM is selected, so we process the MIDI Files
#Check MainPage_logged.js, continueEnableDisable() function to see how this works
@app.route('/<int:firstprocess>', methods=['GET', 'POST'])
def fileProcessNew(firstprocess):
    global midiFilesList
    global training
    #variable training to True, we will train the algorithm with the MIDI Files we have in the user's folder
    training = True
    #if we train the algorythm
    # we establish our paths
    print('files processing')
    print(type(firstprocess),firstprocess)
    cwd, directory, path_om, path_cm, path_MIDI_garbage = mfpm.path_establish(sessionUser)

    if (firstprocess == 0):
        # we check if the files where we have to store the MIDI files have been created previously, in order to delete them and its content
        mfpm.delete_folder_if_exists(path_om)
        mfpm.delete_folder_if_exists(path_cm)
        mfpm.delete_folder_if_exists(path_MIDI_garbage)

    for f in os.scandir(directory):
        if (f.is_file() and f.name.endswith('.mid')):
            midifileMusicScore, partsMIDIMusicScore = mfpm.MIDIConverter(str(f.path), path_cm, path_om, path_MIDI_garbage)

            # MIDIFile with only Melody
            if partsMIDIMusicScore == 1:
                mfpm.create_folder_if_not_exists(path_om)
                shutil.move(str(f.path), path_om)
            else:
                display_text = "Interval: [0, " + str(partsMIDIMusicScore - 1) + "]"
                melody_name = str(f.path).split("\\")[1] 
                return render_template('PartsChoosing.html', PartsRange=display_text, CurrentMelodyNumberParts=partsMIDIMusicScore, CurrentMelodyName=melody_name)

    #we delete the MIDI FIles we could not move (the raw ones with M&C)
    mfpm.delete_folder_if_exists(path_MIDI_garbage)
    return redirect(url_for('MIDIUploadSelected', inputUsername=sessionUser))

#When CHECKPOINT is not selected, we upload the MIDI Files. We do all the process that is inside of @app.route('/<int:firstprocess>')...
#Once we have dealt with everything, we call this function just to open the 'constraints_flask_webpage.html' with a proper URL
@app.route('/<string:inputUsername>/MIDIUploadSelected', methods=['GET', 'POST'])
def MIDIUploadSelected(inputUsername):
    return render_template('constraints_flask_webpage.html', rendTempUsername = sessionUser, rendTempEmail = sessionEmail, stringMIDI = ' '.join(midiFilesList))

#if CHECKPOINT is selected, so we delete the MIDI Files and we do not pass throught PartsChoosing
#Check MainPage_logged.js, continueEnableDisable() function to see how this works
@app.route('/<string:inputUsername>/checkpointSelected', methods=['GET', 'POST'])
def checkpointSelected(inputUsername):
    global midiFilesList
    global training
    #variable training to False, we will use the CHECKPOINT (this is for further design, once you have to deal with the Cluster)
    #note that we delete the folder with the MIDI Files because they are no longer needed, due to we use the checkpoint
    training = False
    midiFilesList = []
    midiFilesList.append("CHECKPOINT SELECTED")
    userpath = os.getcwd() + '/users/' + sessionUser
    recreateFolder(userpath, '/midi_files_checking')
    return render_template('constraints_flask_webpage.html', rendTempUsername = sessionUser, rendTempEmail = sessionEmail, stringMIDI = ' '.join(midiFilesList))

'''
Midi file parts choosing (for processing) route
'''
@app.route('/parts', methods=['POST'])
def ChooseParts():
    userinput = int(request.form['text'])
    print('received'+ str(userinput))
    cwd,directory,path_om,path_cm,path_MIDI_garbage = mfpm.path_establish(sessionUser)

    for f in os.scandir(directory):
        if (f.is_file() and f.name.endswith('.mid')):
            MusicScore, partsMIDIMusicScore = mfpm.MIDIConverter(str(f.path), path_cm, path_om, path_MIDI_garbage)
            path_to_file = str(f.path)
            break

    if userinput < 0 or userinput >= partsMIDIMusicScore:
        display_text = "Please select a valid range: [0, " + str(partsMIDIMusicScore - 1) + "]"
        melody_name = str(f.path).split("\\")[1] 
        return render_template('PartsChoosing.html', PartsRange=display_text, CurrentMelodyNumberParts=partsMIDIMusicScore, CurrentMelodyName=melody_name)

    print('midiselector begin')
    mfpm.MIDISelector(path_to_file, path_cm, path_om, path_MIDI_garbage,MusicScore,userinput)
    print('midiselector done')
    return redirect(url_for('fileProcessNew', firstprocess=1))


@app.route("/saveMidFile", methods=["OPTIONS", "POST"])
def receive_midi_file():
    # Change working directory to save midi files to /midi_files_checking
    cwd = os.getcwd().replace('\\', '/')
    os.chdir(cwd +'/users/' + sessionUser +'/midi_files_checking')
    # Receive the request and get data
    data_received = request.get_data()
    filename = (str(data_received).split('filename="')[1]).split('"\\')[0]
    data_string = data_received.decode("ISO-8859-1")

    # Get midi data and encode it to bytes format (strip() removes the \n ; split() allows
    # to take just midi data
    midi_data = data_string.split('/mid')[1].split('------WebKitForm')[0].strip().encode("ISO-8859-1")

    # Write midifile to working directory
    with open(filename, 'wb') as saveMidFile:
        saveMidFile.write(midi_data)
        print('Downloaded {} successfully.'.format(filename))

    os.chdir(cwd)
    return ""

'''
Delete the MIDI File selected by the user.
'''
@app.route("/deleteMidiFile", methods=["POST"])
def delete_midifile():
    global midiFilesList
    found = False
    data_received = request.json
    midiFileToDelete = data_received["Filename"]
    cwd,directory,path_om,path_cm,path_MIDI_garbage = mfpm.path_establish(sessionUser)

    for f in os.scandir(directory):
        if (f.is_file() and f.name.endswith('.mid') and not found):
            if f.name == midiFileToDelete:
                path_to_file = str(f.path)
                #once we find it we delete the MIDI File
                delete_MIDI_path(path_to_file)
                midiFilesList.remove(f.name)
                found = True

    return ""

@app.route("/chooseProject", methods=["GET", "POST"])
def choose_project():
    return render_template('project_choosing.html', rendTempUsername = sessionUser, rendTempEmail = sessionEmail, stringMIDI = ' '.join(midiFilesList))

@app.route("/work_to_cluster", methods=["GET", "POST"])
def cluster():
    #Code that sends the data to the cluster
    #Either if it is for training (with the MIDI Files we have uploaded) + generating the output with the constraints we have applied
    #Or if it just to use the checkpoint + generating the output with the constraints we have applied
    return render_template('cluster_loading.html', rendTempUsername = sessionUser, rendTempEmail = sessionEmail, stringMIDI = ' '.join(midiFilesList))

@app.route("/generatedMIDI", methods=["GET", "POST"])
def playdownloadMIDI():
    return render_template('generatedMIDI.html', rendTempUsername = sessionUser, rendTempEmail = sessionEmail, stringMIDI = ' '.join(midiFilesList))



#FUNCTIONS USED WITHOUT ROUTING

def recreateFolder(cwd_path, folder):
    #First we delete the folder
    mfpm.delete_folder_if_exists(cwd_path + folder)
    #After we recreate it again
    mfpm.create_folder_if_not_exists(cwd_path + folder)

def delete_MIDI_path(path_in):
    if os.path.exists(path_in):
        os.remove(path_in)


#NEW ARCHITECTURE IMPLEMENTATION

@app.route('/loginAPI', methods=['POST'])
def logAPI():
    #We call this function to check if the user is in the DB
    global UserIsLogged    
    global sessionUser 
    global sessionEmail 
    global sessionPassword 
    data_received = request.json
    jsUser = data_received["Username"]
    jsPassword = data_received["Password"]
    strngUserPassw = "http://localhost:5000/api/users/byparameters?username=" + jsUser + "&password=" + jsPassword
    #from Flask, to respect the architecture, we call the DB and we send back the data to the frontend
    response = requests.get(strngUserPassw, verify=False)
    if response.status_code == 200:
    # If the user appears in the DB
        data = response.json()
        UserIsLogged = True
        sessionUser = data['username']
        sessionEmail = data['email']
        sessionPassword = data['password']
        flaskResponse = make_response('', 200)
        return flaskResponse
    elif response.status_code == 404:
    # If the user does not appear in the DB
        UserIsLogged = False
        flaskResponse = make_response('', 404)
        return flaskResponse
    
@app.route('/createUserAPI', methods=['POST'])
def creUserAPI():
    #We call this function to create the user in the DB, we previously checked if this was possible with this credentials
    global UserIsLogged    
    global sessionUser 
    global sessionEmail 
    global sessionPassword 
    data_received = request.json
    strngCreateUser = "http://localhost:5000/api/users/"
    #we just resend the JSON Object we receive from the frontend
    #from Flask, to respect the architecture, we call the DB and we post the user in the DB. We will send a response to the frontend to respect the architecture
    responseCreateUser = requests.post(strngCreateUser,json=data_received,verify=False)
 
    if responseCreateUser.status_code == 200:
    # If the user has been created succesfully in the DB
        data = responseCreateUser.json()
        UserIsLogged = True
        sessionUser = data['username']
        sessionEmail = data['email']
        sessionPassword = data['password']
        flaskResponse = make_response('', 200)
        return flaskResponse
    else:
    # If there has been any problem, we return a response with whatever status code it got
        UserIsLogged = False
        flaskResponse = make_response('', responseCreateUser.status_code)
        return flaskResponse
    
@app.route('/checkUsername', methods=['POST'])
def checkUserAPI():
    #We call this function to check if the username has been used already
    data_received = request.json
    jsUser = data_received["Username"]
    strngCheckUsername = "http://127.0.0.1:5000/api/users/byparameters/usr?username=" + jsUser
    #from Flask, to respect the architecture, we call the DB and we send back the data to the frontend
    response = requests.get(strngCheckUsername, verify=False)
    if response.status_code == 200:
    # If the username appears in the DB
        flaskResponse = make_response('', 200)
        return flaskResponse
    elif response.status_code == 404:
    # If the username does not appear in the DB
        flaskResponse = make_response('', 404)
        return flaskResponse

@app.route('/checkEmail', methods=['POST'])
def checkEmailAPI():
    #We call this function to check if the email has been used already
    data_received = request.json
    jsEmail = data_received["Email"]
    strngCheckEmail = "http://localhost:5000/api/users/byparameters/eml?email=" + jsEmail
    #from Flask, to respect the architecture, we call the DB and we send back the data to the frontend
    response = requests.get(strngCheckEmail, verify=False)
    if response.status_code == 200:
    # If the email appears in the DB
        flaskResponse = make_response('', 200)
        return flaskResponse
    elif response.status_code == 404:
    # If the email does not appear in the DB
        flaskResponse = make_response('', 404)
        return flaskResponse
    
@app.route('/deleteAccount', methods=['GET'])
def deleteAccountAPI():
    #We call this function to delete the user from the DB that is associated to the user's session
    urlUser = "http://localhost:5000/api/users/byparameters?username=" + sessionUser + "&password=" + sessionPassword
    #from Flask, to respect the architecture, we call the DB and we send back the data to the frontend
    responseDelete = requests.delete(urlUser, verify=False)
    if responseDelete.status_code == 204:
    # If the user is succesfully deleted
        flaskResponse = make_response('', 204)
        return flaskResponse
    elif responseDelete.status_code == 404:
    # If we can not find the user bc either doesnt appear or has been deleted already
        flaskResponse = make_response('', 404)
        return flaskResponse