from flask import Flask, request, jsonify
import os
from datetime import datetime
import pandas as pd
import uuid


# Hàm xuất dữ liệu ra file Excel
def export_data_to_excel(nodes, intensity, duration, data_type, delay, matrixSize):
    folder_name = os.path.join("Experiment Data")
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

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

    return filename, os.path.abspath(file_path)

def get_elements_from_csv(csv_path, user_id):
    """
    Đọc file CSV và lấy danh sách các phần tử từ dòng tương ứng với user_id và cột G.
    Ví dụ: userID=1 => dòng 0, cột G (index=6)
    """
    try:
        df = pd.read_csv(csv_path, header=None)
        print(f"Đọc file CSV: {csv_path}")
        print(f"Số cột trong CSV: {df.shape[1]}")
        print(f"Số dòng trong CSV: {df.shape[0]}")

        # Tương ứng user_id với dòng index (user_id=1 => row_index=0)
        row_index = user_id - 1

        # Kiểm tra đủ số dòng
        if row_index >= df.shape[0]:
            print(f"File CSV chỉ có {df.shape[0]} dòng, không đủ để lấy dữ liệu từ dòng {user_id}.")
            return []

        # Cột G là cột index=6
        col_index = 6

        # Kiểm tra đủ số cột
        if df.shape[1] <= col_index:
            print(f"File CSV chỉ có {df.shape[1]} cột, không đủ để lấy dữ liệu từ cột G.")
            return []

        # Lấy giá trị ở dòng tương ứng và cột G
        g_value = str(df.iloc[row_index, col_index])
        print(f"Dữ liệu tại dòng {user_id}, cột G: {g_value}")

        # Tách chuỗi thành danh sách
        elements = g_value.strip().split()
        print(f"Danh sách các phần tử từ dòng {user_id}, cột G: {elements}")

        return elements

    except (FileNotFoundError, pd.errors.EmptyDataError):
        print(f"File CSV tại đường dẫn {csv_path} không tồn tại hoặc trống.")
        return []
    except Exception as e:
        print(f"Lỗi khi đọc CSV: {e}")
        return []


def get_matched_excel_files(folder_path, elements):
    if not os.path.isdir(folder_path):
        return []
    
    all_files = os.listdir(folder_path)

    excel_files = [f for f in all_files if f.endswith('.xlsx')]
    
    elements_copy = elements.copy()

    matched_files = []

    for element in elements_copy:
        for file in excel_files:
            file_name, _ = os.path.splitext(file)
            if file_name == element:
                matched_files.append(file)
                # excel_files.remove(file)
                break

    print("....", matched_files)

    return matched_files

def check_and_process_excel_files(csv_path, folder_path, user_id):
    """
    Đọc danh sách phần tử từ cột G{user_id} trong CSV,
    sau đó kiểm tra và xử lý các file Excel khớp với danh sách này.
    """
    # Lấy danh sách các phần tử tương ứng với userID
    elements = get_elements_from_csv(csv_path, user_id)
    
    if not elements:
        print(f'Không thể lấy danh sách các phần tử từ cột G{user_id} hoặc danh sách rỗng.')
        return jsonify({'error': f'Không thể lấy danh sách các phần tử từ cột G{user_id} hoặc danh sách rỗng.'}), 400
    
    unmatched_elements = elements.copy()
    experiments = []
    max_iterations = len(unmatched_elements)  # tránh vòng lặp vô hạn
    
    for iteration in range(max_iterations):
        matched_files = get_matched_excel_files(folder_path, unmatched_elements)
        if not matched_files:
            break
        
        new_matches_found = False
        for file in matched_files:
            file_path = os.path.join(folder_path, file)
            try:
                excel = pd.ExcelFile(file_path)
                sheet_name = excel.sheet_names[0]
                try:
                    _, matrixSize = sheet_name.split(" - ")
                except ValueError:
                    matrixSize = "Unknown"
                
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                date = file.replace(".xlsx", "")
    
                required_columns = ['type', 'delay', 'node', 'intensity', 'duration']
                if not all(col in df.columns for col in required_columns):
                    continue
    
                data_type = df['type'].iloc[0]
                delay = float(df['delay'].iloc[0])
                listings = df['node'].dropna().astype(str).tolist()
                intensity = df['intensity'].dropna().astype(float).tolist()
                duration = df['duration'].dropna().astype(float).tolist()

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

                
                file_name, _ = os.path.splitext(file)
                if file_name in unmatched_elements:
                    unmatched_elements.remove(file_name)
                    new_matches_found = True
                
            except Exception as e:
                return jsonify({'error': f"Error processing file {file}: {str(e)}"}), 500
        
        if not new_matches_found:
            break
    
    if experiments:
        return jsonify({'result': experiments})
    else:
        return jsonify({"result": [], "message": f"Không tìm thấy file Excel nào phù hợp với G{user_id}."})

class RecordController:
    def getAndcreateRecord(userID=None):
        if request.method == 'POST':
            data = request.json
            nodes = data.get("listings", [])
            data_type = data.get("type", None)
            duration = data.get("duration", [])
            intensity = data.get("intensity", [])
            delay = data.get("delay", None)
            matrixSize = data.get("matrixSize", None)

            if not (len(nodes) == len(intensity) == len(duration)):
                print('listings, intensity, và duration phải cùng độ dài')
                return jsonify({'error': 'listings, intensity, và duration phải cùng độ dài'}), 400

            # if not all([data_type, delay, matrixSize]):
            #     print(data_type, delay, matrixSize)
            #     print('Thiếu dữ liệu bắt buộc: type, delay, hoặc m  atrixSize')
            #     return jsonify({'error': 'Thiếu dữ liệu bắt buộc: type, delay, hoặc matrixSize'}), 400

            try:
                filename, location = export_data_to_excel(
                    nodes, intensity, duration, data_type, delay, matrixSize, 
                )
                return jsonify({'filename': filename, 'location': location})
            except Exception as e:
                return jsonify({'error': str(e)}), 500

        elif request.method == 'GET':
            # Lấy userID
            user_id = userID or request.args.get('userID', None)
            print(user_id)
            if not user_id:
                return jsonify({'error': 'Thiếu tham số userID trong yêu cầu GET.'}), 400
            
            # Ép user_id sang số nguyên để tính chỉ số cột
            try:
                user_id = int(user_id)
            except ValueError:
                return jsonify({'error': 'userID phải là số nguyên'}), 400

            # Kiểm tra phạm vi userID
            if not (1 <= user_id <= 16):
                return jsonify({'error': 'userID không hợp lệ. Phải nằm trong khoảng 1 đến 16.'}), 400

            csv_path = 'C:/Users/user/Documents/GitHub/TacticWave/Server/Fetch Data/Testing_Box.csv'
            folder_path = 'C:/Users/user/Documents/GitHub/TacticWave/Server/Experiment Data'

            if not os.path.exists(folder_path):
                return jsonify({'error': f'Thư mục {folder_path} không tồn tại.'}), 404

            return check_and_process_excel_files(csv_path, folder_path, user_id)

        else:
            return jsonify({'error': 'Invalid request method'}), 405


