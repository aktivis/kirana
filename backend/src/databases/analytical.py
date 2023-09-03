from contextlib import contextmanager
from flask import current_app
from duckdb import connect

from ..utils.app_path import app_path


@contextmanager
def init_olap():
    connection = connect(app_path(current_app.config["ANALYTICAL_DB"]))
    try:
        yield connection
    finally:
        connection.close()
