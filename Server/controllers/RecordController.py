from flask import request, jsonify
import os
from datetime import datetime
import pandas as pd


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

    sheet_name = f"{experiment_name} - {matrix_size} - {creator}"

    df = pd.DataFrame(records)
    df.columns = ['Order', 'Node number', 'Intensity', 'Duration', 'Type']

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
        print()
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
            print(experiments)
        except Exception as e:
            print(e)
            return jsonify({'error': f"Error processing file {file}: {str(e)}"}), 500

    return jsonify({'result': experiments})


# def check_and_process_excel_files(folder_name):
#     if not os.path.exists(folder_name):
#         return jsonify({'error': 'Folder does not exist'}), 404

#     excel_files = [f for f in os.listdir(folder_name) if f.endswith('.xlsx')]

#     if not excel_files:
#         return jsonify({"result": []})

#     experiments = []
#     data_list = []  # List to store DataFrames

#     for file in excel_files:
#         file_path = os.path.join(folder_name, file)
#         print(f"Processing file: {file}")
#         try:
#             # Read the first sheet from the Excel file
#             sheet_name = pd.ExcelFile(file_path).sheet_names[0]
#             df = pd.read_excel(file_path, sheet_name=sheet_name)

#             # Extract file-related information (safe check for splitting sheet_name)
#             date = file.replace(".xlsx", "")  # Filename contains the date

#             # Safely split sheet name to avoid index errors
#             sheet_parts = sheet_name.split(" - ")
#             if len(sheet_parts) < 3:
#                 raise ValueError(f"Sheet name '{sheet_name}' does not have enough parts to split correctly.")

#             experiment_name, matrix_size, creator = sheet_parts
#             total_nodes = len(df)

#             # Check if the DataFrame has at least one row
#             if total_nodes < 1:
#                 raise ValueError(f"File {file} does not have enough rows (less than 1).")

#             # Get all rows except the header (first row)
#             remaining_rows = df.iloc[1:].reset_index(drop=True).to_dict(orient="records")  # Convert to list of dictionaries

#             # Append data to experiments list with rows (without config)
#             experiments.append({
#                 'date': date,
#                 'experimentName': experiment_name,
#                 'matrixSize': matrix_size,
#                 'totalNodes': total_nodes,
#                 'creator': creator,
#                 'data': remaining_rows  # Append the remaining rows here
#             })

#             # Append the DataFrame to data_list
#             data_list.append(df)

#             # For demonstration: print the DataFrame content (optional)
#             print(experiments[0])

#         except Exception as e:
#             print(e)
#             return jsonify({'error': f"Error processing file {file}: {str(e)}"}), 500

#     # Return the collected experiment information as a JSON response
#     return jsonify({'result': experiments, 'data': [df.to_dict() for df in data_list]})



class RecordController:

    def getAndcreateRecord():
        if request.method == 'POST':
            data = request.json
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
