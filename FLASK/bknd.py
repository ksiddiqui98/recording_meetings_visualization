import commHandler
import os
import json
from flask import Flask, render_template,jsonify

def callback(ch, method, properties, body):
    rec = json.loads(body.decode('utf-8'))
    if(os.stat("templates\js9.json").st_size!=0):
        write_file = open("templates\js9.json","r")
        temp_string = write_file.read()
        temp_string=json.loads(temp_string)
        temp_list=[]
        for i in range(len(temp_string)):
            temp_list.append(temp_string[i])
        temp_list.append(rec)
        write_file.close()
        write_file = open("templates\js9.json","w")
        for i in range(len(temp_list)):
            if(i==0):
                write_file.write("[")
            write_file.write(json.dumps(temp_list[i]))
            if(i!=len(temp_list)-1):
                write_file.write(",")
        write_file.write("]")
    else:
        write_file = open("templates\js9.json","w")
        write_file.write("["+json.dumps(rec)+"]")
comm = commHandler.commHandler()
#def callback2(ch, method, properties, body):
#comm2 = commHandler.commHandler()
#comm2.listen('amq.topic', 'abc', callback2)
comm.listen('amq.topic', 'abc', callback)
# ------------------------------------ flask code here
app = Flask(__name__)

@app.route("/")
def level1():
    return render_template('testing.html')

@app.route("/js9")
def jsonfile9():
    return render_template('js9.json')

if __name__ == '__main__':
    app.run(debug=True)
# ------------------------------------

