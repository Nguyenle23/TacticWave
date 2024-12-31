# from flask import Blueprint

# from controllers.RecordController import RecordController

# Record = Blueprint('Record', __name__)

# Record.route('/', methods=['GET', 'POST'])(RecordController.getAndcreateRecord)


from flask import Blueprint
from controllers.RecordController import RecordController

Record = Blueprint('Record', __name__)

# Route hỗ trợ cả POST và GET với userID trong URL
Record.route('/', methods=['GET', 'POST'])(RecordController.getAndcreateRecord)
Record.route('/<userID>', methods=['GET', 'POST'])(RecordController.getAndcreateRecord)

