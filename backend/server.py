import sys
from src import app
from waitress import serve
from logging import StreamHandler, getLogger, INFO


# Define server
def start_server():
    if getattr(sys, "frozen", False):
        getLogger("waitress").addHandler(StreamHandler(sys.stdout))
        getLogger("waitress").setLevel(INFO)
        serve(app, host=app.config["SERVER_HOST"], port=app.config["SERVER_PORT"])
    else:
        app.debug = True
        app.run()


# Run the server
if __name__ == "__main__":
    start_server()
