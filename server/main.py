from flask import Flask, Blueprint
from flask_socketio import SocketIO

app = Flask(__name__, static_url_path="/static", static_folder="../client/build/static")
blueprint = Blueprint("main", __name__)
socketio = SocketIO()

from routes import *
from events import *

if __name__ == "__main__":
    app.config["SECRET_KEY"] = "secret"
    app.register_blueprint(blueprint)

    socketio.init_app(app)
    socketio.run(app, host="0.0.0.0", debug=True)
