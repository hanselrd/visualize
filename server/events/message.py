import time
from flask import request
from flask_socketio import emit
from main import socketio


_id = 1


@socketio.on("message_add")
def message_add(message):
    global _id
    emit(
        "message_add",
        {
            "id": _id,
            "message": {
                "sid": request.sid,
                "text": message,
                "created": int(time.time()),
            },
        },
        broadcast=True,
    )
    id += 1
