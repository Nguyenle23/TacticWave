from flask import Blueprint

from controllers.FeedbackController import FeedbackController

Feedback = Blueprint('Feedback', __name__)

Feedback.route('/', methods=['GET', 'POST']
               )(FeedbackController.createFeedback)
