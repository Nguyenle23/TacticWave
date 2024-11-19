from routes.Record import Record


class Router:
    def run(app):
        app.register_blueprint(Record, url_prefix='/record')
