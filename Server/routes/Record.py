from flask import Blueprint

from controllers.RecordController import RecordController

Record = Blueprint('Record', __name__)

Record.route('/', methods=['GET', 'POST'])(RecordController.getAndcreateRecord)
