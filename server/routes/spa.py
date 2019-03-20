from flask import send_file
from main import blueprint


@blueprint.route("/", defaults={"path": ""})
@blueprint.route("/<path:path>")
def catch_all(path):
    return send_file("../client/build/index.html")
