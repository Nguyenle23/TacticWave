# from flask import request, jsonify
# import os
# from datetime import datetime
# import pandas as pd
# from utils.excel_util import export_data_to_excel

# def export_data_to_excel(data):
#     folder_name = "Experiment Data"
#     if not os.path.exists(folder_name):
#         os.makedirs(folder_name)

#     creator = data.get('creator', 'Creator')
#     experiment_name = data.get('experimentName', 'Experiment')
#     matrix_size = data.get('matrixSize', 'Size')
#     records = data.get('records', [])

#     filename = os.path.join(
#         folder_name, datetime.now().strftime('%Y-%m-%d %H' + "h" + '%M' + 'p') + '.xlsx')

#     sheet_name = f"{experiment_name} - {matrix_size}x{matrix_size} - {creator}"

#     df = pd.DataFrame(records)
#     df.columns = ['Index', 'Node_number', 'Intensity', 'Duration', 'Order']

#     with pd.ExcelWriter(filename, engine='openpyxl') as writer:
#         df.to_excel(writer, index=False, sheet_name=sheet_name)

#     return filename, os.path.abspath(filename)


# def check_and_process_excel_files(folder_name):
#     if not os.path.exists(folder_name):
#         return jsonify({'error': 'Folder does not exist'}), 404

#     excel_files = [f for f in os.listdir(folder_name) if f.endswith('.xlsx')]

#     if not excel_files:
#         return jsonify({"result": []})

#     experiments = []

#     for file in excel_files:
#         file_path = os.path.join(folder_name, file)
#         try:
#             sheet_name = pd.ExcelFile(file_path).sheet_names[0]
#             df = pd.read_excel(file_path, sheet_name=sheet_name)

#             date = file.replace(".xlsx", "")  # Filename contains the date
#             experiment_name, matrix_size, creator = sheet_name.split(" - ")
#             total_nodes = len(df)
#             config = df.iloc[0:].to_dict(orient='records')

#             # Append data to experiments list
#             experiments.append({
#                 'date': date,
#                 'experimentName': experiment_name,
#                 'matrixSize': matrix_size,
#                 'totalNodes': total_nodes,
#                 'creator': creator,
#                 'config': config
#             })
#         except Exception as e:
#             print(e)
#             return jsonify({'error': f"Error processing file {file}: {str(e)}"}), 500

#     return jsonify({'result': experiments})


# class RecordController:

#     def getAndcreateRecord():
#         if request.method == 'POST':
#             data = request.json
#             print(data)
#             try:
#                 filename, location = export_data_to_excel(data)
#                 return jsonify({'filename': filename, 'location': location})
#             except Exception as e:
#                 return jsonify({'error': str(e)}), 500
#         elif request.method == 'GET':
#             folder_name = "Experiment Data"
#             return check_and_process_excel_files(folder_name)
#         else:
#             return jsonify({'error': 'Invalid request method'}), 405


from flask import request, jsonify
import os
from datetime import datetime
import pandas as pd
import uuid


def export_data_to_excel(nodes, intensity, duration, data_type, delay, matrixSize):
    folder_name = "Experiment Data"
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

    # filename = datetime.now().strftime('%Y-%m-%d_%Hh%Mp') + '.xlsx'
    filename = str(uuid.uuid4()) + '.xlsx'

    file_path = os.path.join(folder_name, filename)

    # Tạo DataFrame
    df = pd.DataFrame({
        'node': nodes,
        'intensity': intensity,
        'duration': duration,
        'type': [data_type]*len(nodes),
        'delay': [delay]*len(nodes)
    })

    # Ghi DataFrame ra file Excel
    with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name=f'{data_type} - {matrixSize}')

    return file_path, os.path.abspath(file_path)

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
            # Đọc file Excel
            sheet_name = pd.ExcelFile(file_path).sheet_names[0]
            _, matrixSize = sheet_name.split(" - ")
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            date = file.replace(".xlsx", "")

            data_type = df['type'].iloc[0]
            delay = df['delay'].iloc[0].astype(float)

            # Tái tạo lại dictionary
            listings = df['node'].tolist()
            intensity = df['intensity'].tolist()
            duration = df['duration'].tolist()

            config = {
                "listings": listings,
                "type": data_type,
                "duration": duration,
                "intensity": intensity,
                "delay": delay
            }

            experiments.append({
                'date': date,
                'config': config,
                'matrixSize': matrixSize,
                'type': data_type
            })
        except Exception as e:
            print(e)
            return jsonify({'error': f"Error processing file {file}: {str(e)}"}), 500

    return jsonify({'result': experiments})

class RecordController:
    def getAndcreateRecord():
        if request.method == 'POST':
            data = request.json
            nodes = data.get("listings", [])
            data_type = data.get("type", None)
            duration = data.get("duration", [])
            intensity = data.get("intensity", [])
            delay = data.get("delay", None)
            matrixSize = data.get("matrixSize", None)

            # Kiểm tra xem listings, intensity, duration có cùng độ dài không
            if not (len(nodes) == len(intensity) == len(duration)):
                return jsonify({'error': 'listings, intensity, và duration phải cùng độ dài'}), 400

            try:
                filename, location = export_data_to_excel(nodes, intensity, duration, data_type, delay, matrixSize)
                return jsonify({'filename': filename, 'location': location})
            except Exception as e:
                return jsonify({'error': str(e)}), 500

        elif request.method == 'GET':
            folder_name = "Experiment Data"
            return check_and_process_excel_files(folder_name)
        else:
            return jsonify({'error': 'Invalid request method'}), 405

