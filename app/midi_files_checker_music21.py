import music21
import os
import shutil
import stat
import sys

def MIDISelector(path_to_file, cm_path, om_path, garbage_path):

    midifileMusicScore = music21.converter.parse(path_to_file)
    partsMIDIMusicScore = len(midifileMusicScore.recurse().getElementsByClass(music21.stream.Part))

    #MIDIFile with only Melody
    if partsMIDIMusicScore == 1:
        create_folder_if_not_exists(om_path)
        shutil.move(path_to_file, om_path)

    #MIDIFile with Melody and Chords
    elif partsMIDIMusicScore > 1:
        create_folder_if_not_exists(cm_path)
        create_folder_if_not_exists(om_path)
        create_folder_if_not_exists(garbage_path)
        #the music Score we create as an output only for the Melody
        outputMusicScoreOM = music21.stream.Score()

        #the music Score we create as an output for the Melody + Chords 
        outputMusicScoreMC = music21.stream.Score() 

        #First we extract the Chord Part using .chordify()
        streamChords = midifileMusicScore.chordify()
        for c in streamChords.recurse().getElementsByClass('Chord'):
            c.closedPosition(forceOctave=4, inPlace=True)

        #Here the user needs to decide what part will he use as the melody
        print("Parts in the MIDI File: " + str(partsMIDIMusicScore) + "\n")
        part_vble = int(input("Select what part will act as a Melody: " + "[0, " + str(partsMIDIMusicScore - 1) + "] \n"))
        while(part_vble < 0 or part_vble >= partsMIDIMusicScore):
            part_vble = int(input('Please, select a correct part: \n'))

        print('Your part has been received correctly: ' + str(part_vble))
        streamMelody = midifileMusicScore.getElementsByClass(music21.stream.Part)[part_vble]
        print('--------------------------------------------------------------\n')

        #our MIDI File input contains Melody as well as Chords, so we create 2 MIDI Files, 1 with C&M, and the other one only with Melody
        outputMusicScoreMC.insert(0, streamMelody)
        outputMusicScoreMC.insert(0, streamChords)
        outputMusicScoreOM.insert(0, streamMelody)

        #for the MIDI File we created only for Melody
        shutil.move(str(outputMusicScoreOM.write(fmt="Midi")), om_path)
        #outputMusicScoreOM.show()                                      #this is the function for displaying the music score of the MIDI File which it's still in the 'music21' format. The bad part is that the code waits until we are done with MusicScore. Maybe we should parallelize this .show() section
        #for the MIDI File we created with M&C
        shutil.move(str(outputMusicScoreMC.write(fmt="Midi")), cm_path)
        #outputMusicScoreMC.show()                                       #this is the function for displaying the music score of the MIDI File which it's still in the 'music21' format. The bad part is that the code waits until we are done with MusicScore. Maybe we should parallelize this .show() section
        #we need to store the MIDI Files in the garbage that we used to create the MusicScores (used for generating more MIDI FIles), and delete them after
        shutil.move(path_to_file, garbage_path)

def delete_folder_if_exists(path_in):
    if(os.path.exists(path_in)):
        os.chmod(path_in, stat.S_IRWXU)
        shutil.rmtree(path_in)

def create_folder_if_not_exists(path_in):
    if(os.path.exists(path_in) == False):
        os.mkdir(path_in)


#------------------------------------MAIN------------------------------#
def process():
    #Temporary folder is here -> C:\Users\Pablo\AppData\Local\Temp\music21\
    #we establish our paths
    print('files processing')
    cwd = os.getcwd().replace('\\', '/')
    directory = cwd + '/midi_files_checking'
    path_om = directory + "/only_melody_midi"
    path_cm = directory + "/chords_melody_midi"
    path_MIDI_garbage = directory + "/garbage"

    #we check if the folders where we have to store the MIDI files have been created previously, in order to delete them and its content
    delete_folder_if_exists(path_om)
    delete_folder_if_exists(path_cm)
    #just if there's any problem with the garbage file where we store Files
    delete_folder_if_exists(path_MIDI_garbage)

    for f in os.scandir(directory):
        if (f.is_file() and f.name.endswith('.mid')):
            MIDISelector(str(f.path), path_cm, path_om, path_MIDI_garbage)


    #we delete the MIDI FIles we could not move (the raw ones with M&C)
    delete_folder_if_exists(path_MIDI_garbage)




