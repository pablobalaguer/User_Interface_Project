from app import app

# Configure a secret key - useful for flask 'flash' (alerts) but not used right now
app.config['SECRET_KEY'] = 'qfhdrfghdfgdfh'

# Sometimes when you change js or html files, these won't be displayed (Pycharm IDE bug I guess)
# Just change the port here and in MainPage.js function sendMIDIFile
if __name__ == "__main__":
    app.run(port=5004, debug=True)
