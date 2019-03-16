from flask_socketio import emit
from .. import socketio

@socketio.on('text')
def text(message):
    emit('message', {'msg': message})