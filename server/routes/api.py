import random
from flask import jsonify
from main import blueprint


@blueprint.route("/api/version", methods=["GET"])
def api_version():
    return jsonify(
        {
            "major": random.randint(1, 10),
            "minor": random.randint(1, 10),
            "patch": random.randint(1, 10),
        }
    )
