from os import getenv
from dotenv import load_dotenv
from flask import Flask, make_response
from sqlalchemy import Engine, event
from sqlite3 import Connection as SQLiteConnection
from waitress import serve

from .routes.literature import literature_bp
from .databases.transactional import init_oltp, reg
from .routes.research import research_bp
from .routes.quantitative import quantitative_bp

# Load environment variables
load_dotenv()


# Define configurations
class Config:
    TRANSACTIONAL_DB = getenv("TRANSACTIONAL_DB") or "sqlite:///kirana.sqlite"
    ANALYTICAL_DB = getenv("ANALYTICAL_DB") or "kirana.duckdb"
    SERVER_HOST = getenv("SERVER_HOST") or "127.0.0.1"
    SERVER_PORT = getenv("SERVER_PORT") or "5000"


# Define app
def create_app():
    flask = Flask(__name__)
    flask.config.from_object(Config)

    # Initialize transactional database
    with flask.app_context():
        db = init_oltp()

        with db.engine.connect() as connection:
            cursor = connection.connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            reg.metadata.create_all(db.engine)
            cursor.close()

    # Register routes
    flask.register_blueprint(research_bp, url_prefix="/research")
    flask.register_blueprint(literature_bp, url_prefix="/literature")
    flask.register_blueprint(quantitative_bp, url_prefix="/quantitative")

    return flask


app = create_app()


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLiteConnection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()


# Add request  headers
@app.after_request
def after_request(response):
    response = make_response(response)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Content-Type"] = "application/json"
    return response


# Define server
def start_server():
    if app.debug:
        app.run()
    else:
        serve(app, host=app.config["SERVER_HOST"], port=app.config["SERVER_PORT"])


# Run the server
if __name__ == "__main__":
    start_server()
