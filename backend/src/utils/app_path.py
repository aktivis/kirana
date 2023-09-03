import sys
from os.path import dirname, join


def app_path(path: str):
    if getattr(sys, "frozen", False):
        app_dir = join(dirname(sys.executable), "..", "Resources")
    else:
        app_dir = join(dirname(__file__), "..", "..")

    return join(app_dir, path)
