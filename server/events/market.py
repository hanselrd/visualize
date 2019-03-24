import time
from flask_socketio import emit
from main import socketio
from services.market import gen_update
from threading import Lock

thread = None
thread_lock = Lock()


def worker_thread(threshold):
    id = 0
    payload = []
    while True:
        socketio.sleep(1)
        payload.clear()
        for _ in range(threshold):
            id += 1
            payload.append(
                {"id": id, "timestamp": int(time.time()), "data": gen_update()}
            )
        socketio.emit("data", payload, namespace="/market")


@socketio.on("connect", namespace="/market")
def market_on_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(worker_thread, 1000)


# @socketio.on("subscribe", namespace='/market')
# def market_on_subscribe():
#    for i in range(20):
#        emit(
#            "data",
#            {"id": i, "timestamp": int(time.time()), "data": gen_update()},
#            namespace='/market'
#        )
