from flask import request, jsonify
import os
from datetime import datetime
import pandas as pd
from utils.excel_util import export_data_to_excel

def export_data_to_excel(data):
    folder_name = "Experiment Data"
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

    creator = data.get('creator', 'Creator')
    experiment_name = data.get('experimentName', 'Experiment')
    matrix_size = data.get('matrixSize', 'Size')
    records = data.get('records', [])

    filename = os.path.join(
        folder_name, datetime.now().strftime('%Y-%m-%d %H' + "h" + '%M' + 'p') + '.xlsx')

    sheet_name = f"{experiment_name} - {matrix_size}x{matrix_size} - {creator}"

    df = pd.DataFrame(records)
    df.columns = ['Index', 'Node_number', 'Intensity', 'Duration', 'Order']

    with pd.ExcelWriter(filename, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name=sheet_name)

    return filename, os.path.abspath(filename)


def check_and_process_excel_files(folder_name):
    if not os.path.exists(folder_name):
        return jsonify({'error': 'Folder does not exist'}), 404

    excel_files = [f for f in os.listdir(folder_name) if f.endswith('.xlsx')]

    if not excel_files:
        return jsonify({"result": []})

    experiments = []

    for file in excel_files:
        file_path = os.path.join(folder_name, file)
        try:
            sheet_name = pd.ExcelFile(file_path).sheet_names[0]
            df = pd.read_excel(file_path, sheet_name=sheet_name)

            date = file.replace(".xlsx", "")  # Filename contains the date
            experiment_name, matrix_size, creator = sheet_name.split(" - ")
            total_nodes = len(df)
            config = df.iloc[0:].to_dict(orient='records')

            # Append data to experiments list
            experiments.append({
                'date': date,
                'experimentName': experiment_name,
                'matrixSize': matrix_size,
                'totalNodes': total_nodes,
                'creator': creator,
                'config': config
            })
        except Exception as e:
            print(e)
            return jsonify({'error': f"Error processing file {file}: {str(e)}"}), 500

    return jsonify({'result': experiments})


class RecordController:

    def getAndcreateRecord():
        if request.method == 'POST':
            data = request.json
            print(data)
            try:
                filename, location = export_data_to_excel(data)
                return jsonify({'filename': filename, 'location': location})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        elif request.method == 'GET':
            folder_name = "Experiment Data"
            return check_and_process_excel_files(folder_name)
        else:
            return jsonify({'error': 'Invalid request method'}), 405
