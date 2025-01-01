from flask import request, jsonify
# from utils.excel_util import export_data_to_excel


class FeedbackController:
    def createFeedback():
        if request.method == 'POST':
            data = request.json
            print(data)
            try:
                # filename, location = export_data_to_excel(data, "feedback")
                return jsonify({'filename': "filename", 'location': "location"})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
            except Exception as e:
                print(e)
                return jsonify({'error': str(e)}), 500
        else:
            return jsonify({'error': 'Invalid request method'}), 405
