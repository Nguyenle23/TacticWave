from routes.Record import Record
from routes.RunExp import RunExp


class Router:
    def run(app):
        app.register_blueprint(Record, url_prefix='/record')
        app.register_blueprint(RunExp, url_prefix='/runexp')
