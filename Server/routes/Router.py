from routes.Record import Record
from routes.Feedback import Feedback
from routes.RunExp import RunExp


class Router:
    def run(app):
        app.register_blueprint(Record, url_prefix='/record')
        app.register_blueprint(Feedback, url_prefix='/feedback')
        app.register_blueprint(RunExp, url_prefix='/runexp')
