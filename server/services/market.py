import random
from enum import IntEnum, unique
import json


@unique
class Trigger(IntEnum):
    NONE = 0
    OPEN = 1 << 0
    CLOSE = 1 << 1
    LOW = 1 << 2
    HIGH = 1 << 3
    VWAP = 1 << 4
    ALL = OPEN | CLOSE | LOW | HIGH | VWAP


class BookUpdate:
    def __init__(self, price, volume):
        self.price = price
        self.volume = volume

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)


class Book:
    def __init__(self):
        self.deltas = []
        self.vwap = 0
        self.total_volume = 0

    def update(self, delta):
        self.deltas.append(delta)
        self.vwap = ((self.vwap * self.total_volume) + (delta.price * delta.volume)) / (
            self.total_volume + delta.volume
        )
        self.total_volume += delta.volume

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)


def gen_update():
    return BookUpdate(random.randint(1, 20), random.randint(1, 20)).__dict__
