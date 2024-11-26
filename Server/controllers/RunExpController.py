from flask import request, jsonify
import serial
import json
import time

esp32_port = 'COM4'  # Thay bằng cổng Serial ESP32
baud_rate = 115200
timeout = 1

def convert_node_number(node_number):
    """
    Convert node number according to the provided mapping:
    1 -> 23, 2 -> 22, 3 -> 21, 4 -> 19, 5 -> 18, 6 -> 5, 7 -> 17, 8 -> 16, 9 -> 4
    """
    mapping = {
        1: 23,
        2: 22,
        3: 21,
        4: 19,
        5: 18,
        6: 5,
        7: 17,
        8: 16,
        9: 4,
        10: 2,
        11: 15,
        12: 32,
        13: 33,
        14: 25,
        15: 26,
        16: 27
    }

    return mapping.get(node_number, None)

def transform_motor_data(data):
    transformed_data = []
    for item in data:
        # Extract and transform the values
        transformed_item = {
            'Node_number': convert_node_number(item.get('Node_number')),
            'Duration': item.get('Duration') * 1000 if item.get('Duration') else None,
            'Intensity': item.get('Intensity'),
            'Order': item.get('Order')
        }
        transformed_data.append(transformed_item)

    return transformed_data

def group_dicts_by_order(data_list):
    array = transform_motor_data(data_list)
    print(array)
    grouped = {}
    for item in array:
        if 'Order' in item:
            order = item['Order']
            grouped.setdefault(order, []).append(item)
    return list(grouped.values())

def get_max_duration(data):
    """
    Lấy Duration lớn nhất từ danh sách các phần tử.

    :param data: Danh sách chứa các danh sách nhỏ, mỗi danh sách chứa các dictionaries với key 'Duration'.
    :return: Duration lớn nhất của mỗi nhóm.
    """
    max_durations = [max(group, key=lambda x: x['Duration'])['Duration'] for group in data]
    return max_durations

def send_motor_command(item, max_duration):
    """
    Gửi lệnh điều khiển motor với node_number và thời gian duration (ms).
    """
    try:
        ser = serial.Serial(esp32_port, baud_rate, timeout=timeout)
        time.sleep(2)  # Đợi ESP32 ổn định kết nối
        print(f"Kết nối thành công tới {esp32_port}")

        # Chuyển mảng JSON thành chuỗi và thêm ký tự xuống dòng
        json_data = json.dumps(item) + '\n'

        # Gửi dữ liệu qua Serial
        ser.write(json_data.encode('utf-8'))
        print(f"Dữ liệu đã gửi: {json_data}")

        # Chờ dựa trên max_duration
        time.sleep(max_duration / 1000 + 1)

        if ser.in_waiting > 0:
            response = ser.readline().decode('utf-8').strip()
            print(f"Phản hồi từ ESP32: {response}")
        else:
            print("Không nhận được phản hồi từ ESP32.")

    except Exception as e:
        print(f"Lỗi: {e}")
        return jsonify({'error': str(e)}), 500

class RunExpController:
    def send_motor_command_from_request():
        if request.method == 'POST':
            try:
                motor_data = request.json  # This is now expected to be a list of motor commands
                grp_data = group_dicts_by_order(motor_data)
                print("lalalaa", grp_data)

                # Check if motor_data is a list
                if isinstance(grp_data, list):
                    responses = []
                    max_durations = get_max_duration(grp_data)
                    for idx, item in enumerate(grp_data):
                        # Send the motor command with the max duration for the group
                        send_motor_command(item, max_durations[idx])

                        # Collecting success response
                        responses.append({
                            'message': f'Motor command sent to node_number'
                        })

                    return jsonify(responses), 200
                else:
                    return jsonify({'error': 'Invalid data format. Expected a list of motor commands.'}), 400

            except Exception as e:
                print(e)
                return jsonify({'error': str(e)}), 500
        else:
            return jsonify({'error': 'Invalid request method'}), 405
