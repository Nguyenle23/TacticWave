from flask import Blueprint

from controllers.RunExpController import RunExpController

RunExp = Blueprint('RunExp', __name__)

RunExp.route('/', methods=['POST'])(RunExpController.send_motor_command_from_request)
