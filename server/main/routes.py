from flask import send_file, jsonify
from . import main

@main.route('/api/version', methods=['GET'])
def api_version():
    return jsonify({'major': 1,
                    'minor': 2,
                    'patch': 3})

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def catch_all(path):
    return send_file('../client/build/index.html')