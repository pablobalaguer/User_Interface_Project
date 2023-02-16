'''
Imports
'''
import shutil

from flask import request, flash, \
    redirect, url_for, render_template
import os
#from werkzeug.urls import url_parse, secure_filename
from app import app
from app import midi_files_checker_music21
from app import midi_files_proc_music21 as mfpm


UserIsLogged = True     # For now to build the logic without the api of the users


'''
Homepage route, whenever you open https://localhost:port/, it'll open this homepage
'''
@app.route('/', methods=['GET', 'POST'])
def homepage():
    return render_template('homepage.html')


'''
Constraints choosing route. Opened when the button 'Continue' is clicked from the mainpage 
See homepage.html button 'Continue' to see the link
'''
@app.route('/constraints', methods=['GET', 'POST'])
def fileProcess():
    if not UserIsLogged:
        flash("You must log in", 'danger')      # flask.flash is used to display messages, but isn't working right now
        return(redirect(url_for('homepage')))

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
    cwd,directory,path_om,path_cm,path_MIDI_garbage = mfpm.path_establish()

    if firstprocess==0:
        # we check if the files where we have to store the MIDI files have been created previously, in order to delete them and its content
        mfpm.delete_folder_if_exists(path_om)
        mfpm.delete_folder_if_exists(path_cm)
        # just if there's any problem with the garbage file where we store Files
        mfpm.delete_folder_if_exists(path_MIDI_garbage)

    for f in os.scandir(directory):
        if (f.is_file() and f.name.endswith('.mid')):
            midifileMusicScore,partsMIDIMusicScore = mfpm.MIDIConvertor(str(f.path), path_cm, path_om, path_MIDI_garbage)

            # MIDIFile with only Melody
            if partsMIDIMusicScore == 1:
                mfpm.create_folder_if_not_exists(path_om)
                shutil.move(str(f.path), path_om)
            else:
                display_text = "Type what part will act as a Melody: [0, " + str(partsMIDIMusicScore - 1) + "]"
                return render_template('PartsChoosing.html', PartsRange=display_text)

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
            MusicScore, nbparts = mfpm.MIDIConvertor(str(f.path), path_cm, path_om, path_MIDI_garbage)
            path_to_file = str(f.path)
            break

    if userinput < 0 or userinput >= nbparts:
        display_text = "Please select a valid range: [0, " + str(nbparts - 1) + "]"
        return render_template('PartsChoosing.html', PartsRange=display_text)

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
    return(redirect(url_for('homepage')))

