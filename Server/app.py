from flask import Flask
from routes.Router import Router
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/')
def index():
    return '<h1>RESTAPIs ARE SUCCESSFULLY CALLED</h1>'


Router.run(app)

if __name__ == '__main__':
    app.run(host="localhost", port=5555, debug=True)
