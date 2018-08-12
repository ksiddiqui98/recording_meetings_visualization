import commHandler
import json
from flask import Flask, render_template,jsonify

def callback(ch, method, properties, body):
    print("check1")
    rec = json.dumps(body.decode('utf-8'))
    print(rec)
    write_file = open("templates\js9.json","w")
    write_file.write(rec)
    #rec is the json fil
comm = commHandler.commHandler()
comm.listen('amq.topic', 'abc', callback)

# ------------------------------------ flask code here

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('index.html')

@app.route("/js9")
def jsonfile():
    return render_template('js9.json')

# @app.route("/vis")
# def jsonfile():
#     return render_template('vis.html')

if __name__ == '__main__':
    app.run(debug=True)
# ------------------------------------

