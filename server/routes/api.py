import random
from flask import jsonify
from main import blueprint
from services.market import Trigger, Book, BookUpdate, gen_update


@blueprint.route("/api/version", methods=["GET"])
def api_version():
    return jsonify(
        {
            "major": random.randint(1, 10),
            "minor": random.randint(1, 10),
            "patch": random.randint(1, 10),
        }
    )


@blueprint.route("/api/triggers", methods=["GET"])
def api_triggers():
    return jsonify(
        {
            "Trigger.NONE": Trigger.NONE,
            "Trigger.OPEN": Trigger.OPEN,
            "Trigger.CLOSE": Trigger.CLOSE,
            "Trigger.LOW": Trigger.LOW,
            "Trigger.HIGH": Trigger.HIGH,
            "Trigger.VWAP": Trigger.VWAP,
            "Trigger.ALL": Trigger.ALL,
        }
    )


@blueprint.route("/api/gen_update", methods=["GET"])
def api_gen_update():
    return gen_update().toJSON()
