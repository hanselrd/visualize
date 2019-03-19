import time
from flask import request
from flask_socketio import emit
from .. import socketio

id = 1

@socketio.on('message_add')
def text(message):
    global id
    emit('message_add',
         {'id': id, 'message': {'sid': request.sid, 'text': message, 'created': time.time()}},
         broadcast=True)
    id += 1
