import time
from flask_socketio import emit
from main import socketio
from services.market import gen_update


@socketio.on("market_subscribe")
def market_subscribe():
    for i in range(20):
        emit(
            "market_data",
            {"id": i, "timestamp": int(time.time()), "data": gen_update()},
        )
