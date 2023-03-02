'''
Imports
'''
import shutil
import json
from flask import request, flash, \
    redirect, url_for, render_template
from flask import jsonify
import os
#from werkzeug.urls import url_parse, secure_filename
from app import app
from app import midi_files_checker_music21
from app import midi_files_proc_music21 as mfpm
from flask_cors import CORS, cross_origin

UserIsLogged = False
sessionUser = ""
sessionEmail = ""
sessionPassword = ""


'''
homepage_not_log route, whenever you open https://localhost:port/, it will open this homepage
'''
@app.route('/', methods=['GET', 'POST'])
#We add the CORS package to solve the problems of CORS policy when we make Request to the Flask functions
@cross_origin(origin='*')
def homepage_not_log():
    #Make sure that when we open the webpage for the first time there's any MIDI File in the Folder where we store the MIDI FIles before the Continue button
    recreateFolder(os.getcwd(), '/midi_files_checking')
    global UserIsLogged    
    global sessionUser 
    global sessionEmail 
    global sessionPassword 
    UserIsLogged = False
    sessionUser = ""
    sessionEmail = ""
    sessionPassword = ""
    return render_template('homepage_not_logged.html')

@app.route('/postuserdata', methods=['POST'])
def userdata():
    #We call this function just to post the user data to the Flask logic
    global UserIsLogged    
    global sessionUser 
    global sessionEmail 
    global sessionPassword 
    UserIsLogged = True
    data_received = request.json
    sessionUser = data_received["Username"]
    sessionEmail = data_received["Email"]
    sessionPassword = data_received["Password"]
    return ""

@app.route('/getuserdata', methods=['GET'])
def getuserdata():
    #send user data via JSON to JS
    if(UserIsLogged):
        userdata = jsonify(username=sessionUser, email=sessionEmail, password=sessionPassword)
        return userdata
    else:
        return ""    

@app.route('/checkIfMidiUploaded', methods=['GET'])
@cross_origin(origin='*')
def midiuploaded():
    midiUpl = False
    cwd,directory,path_om,path_cm,path_MIDI_garbage = mfpm.path_establish()
    for f in os.scandir(directory):
        if (f.is_file() and f.name.endswith('.mid')):
            midiUpl = True
    
    response = jsonify(answer=midiUpl)  
    return response

@app.route('/userstatus', methods=['GET'])
def redirect_user():
    if(UserIsLogged):
        return redirect(url_for('homepage_log', inputUsername=sessionUser))
    else:
        return(redirect(url_for('homepage_not_log')))
    
@app.route('/<string:inputUsername>', methods=['GET'])
def homepage_log(inputUsername):
    return render_template('homepage_logged.html', rendTempUsername = sessionUser, rendTempEmail = sessionEmail)

'''
Constraints choosing route. Opened when the button 'Continue' is clicked from the mainpage 
See homepage.html button 'Continue' to see the link
'''
#WE CAN DELETE THIS PART I GUESS
@app.route('/constraints', methods=['GET', 'POST'])
def fileProcess():
    if not UserIsLogged:
        flash("You must log in", 'danger')      # flask.flash is used to display messages, but isn't working right now
        return(redirect(url_for('homepage_not_log')))

    # Process the midifiles in the folder
    # midi_files_checker_music21.py was changed to add the process function (main)
    midi_files_checker_music21.process()
    return render_template('constraints_flask_webpage.html')


'''
Constraints choosing route. Opened when the button 'Continue' is clicked from the mainpage 
See homepage.html button 'Continue' to see the link
'''
@app.route('/<int:firstprocess>', methods=['GET', 'POST'])
def fileProcessNew(firstprocess):

    # we establish our paths
    print('files processing')
    print(type(firstprocess),firstprocess)
    cwd, directory, path_om, path_cm, path_MIDI_garbage = mfpm.path_establish()

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
    return render_template('constraints_flask_webpage.html')


'''
Midi file parts choosing (for processing) route
'''
@app.route('/parts', methods=['POST'])
def ChooseParts():
    userinput = int(request.form['text'])
    print('received'+ str(userinput))
    cwd,directory,path_om,path_cm,path_MIDI_garbage = mfpm.path_establish()

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


'''
Midi file(s) saving route. Whenever a user changes the input of his uploaded midifiles, the function sendMIDIFile
in MainPage.js sends a POST request to /saveMidFile with the files.
'''
@app.route("/saveMidFile", methods=["OPTIONS", "POST"])
def receive_midi_file():
    # Change working directory to save midi files to /midi_files_checking
    cwd = os.getcwd().replace('\\', '/')
    os.chdir(cwd + '/midi_files_checking')
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
    #we do not need to return nothing so far to the JS call
    #Remember we are calling this function from the JS method, so it is not going to pop up any new template
    #basically, it is going to rerun the function of homepage and nothing more, with all that the function implies
    #like reset username, logged status, recreate folder... so that's why we just return nothing
    #MAYBE IT'S INTERESTING HERE TO RETURN THE NAME OF ALL THE MIDI FILES UPLOADED!
    return ""


@app.route("/chooseProject", methods=["GET", "POST"])
def choose_project():
    return render_template('project_choosing.html')

@app.route("/CMT", methods=["GET", "POST"])
def CMT_preprocess():
    print('preprocess cmt')
    return render_template('project_choosing.html')

@app.route("/RL", methods=["GET", "POST"])
def RL_Tuner_preprocess():
    print('preprocess rltuner')
    return render_template('project_choosing.html')

#FUNCTIONS USED WITHOUT ROUTING

def recreateFolder(cwd_path, folder):
    #First we delete the folder
    mfpm.delete_folder_if_exists(cwd_path + folder)
    #After we recreate it again
    mfpm.create_folder_if_not_exists(cwd_path + folder)

