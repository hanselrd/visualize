import time
from flask import request
from flask_socketio import emit
from main import socketio


_id = 1


@socketio.on("add", namespace="/message")
def message_on_add(message):
    global _id
    emit(
        "add",
        {
            "id": _id,
            "message": {
                "sid": request.sid,
                "text": message,
                "created": int(time.time()),
            },
        },
        broadcast=True,
        namespace="/message",
    )
    _id += 1
