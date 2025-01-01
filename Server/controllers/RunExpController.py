from flask import request, jsonify
import serial
import json
import time
import math

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
            'Node_number': convert_node_number(item.get('node')),
            'Duration': item.get('duration') * 1000 if item.get('duration') else None,
            'Intensity': item.get('intensity'),
            'Order': item.get('order')
        }
        transformed_data.append(transformed_item)

    return transformed_data


def group_dicts_by_order(data_list):
    array = transform_motor_data(data_list)
    grouped = {}
    for item in array:
        if 'Order' in item:
            order = item['Order']
            grouped.setdefault(order, []).append(item)
    return list(grouped.values())


def wrap_in_list(data):
    return [[item] for item in data]


def get_max_duration(data):

    max_durations = [max(group, key=lambda x: x['Duration'])[
        'Duration'] for group in data]
    return max_durations


def send_motor_command(item, max_duration, motor_delay):
    try:
        ser = serial.Serial(esp32_port, baud_rate, timeout=timeout)
        time.sleep(2)  # Đợi ESP32 ổn định kết nối
        print(f"Kết nối thành công tới {esp32_port}")

        # Chuyển mảng JSON thành chuỗi và thêm ký tự xuống dòng
        json_data = json.dumps(item) + '\n'
        print("#############", json_data)
        # Gửi dữ liệu qua Serial
        ser.write(json_data.encode('utf-8'))
        print(f"Dữ liệu đã gửi: {json_data}")

        # Chờ dựa trên max_duration và motor_delay
        time.sleep(max_duration / 1000 + float(motor_delay))

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
                print('hạahaha', request.json)
                # This is now expected to be a list of motor commands
                motor_data = request.json['listings']
                # This is now expected to be a list of motor commands
                motor_type = request.json['type']
                motor_delay = None

                if motor_type == 'Simultaneous':
                    grp_data = group_dicts_by_order(motor_data)
                    # print("@@@@@@", grp_data)
                    if isinstance(grp_data, list):
                        responses = []
                        max_durations = get_max_duration(grp_data)
                        for idx, item in enumerate(grp_data):
                            # No delay for Simultaneous type
                            send_motor_command(item, max_durations[idx], 0)
                            responses.append({
                                'message': f'Motor command sent to node_number'
                            })
                        print("yayayaya")
                        return jsonify(responses), 200
                    # else:
                    #     return jsonify({'error': 'Invalid request method'}), 405
                elif motor_type == 'Serial':
                    item = {
                        'type': motor_type,
                        'motor_pins': [convert_node_number(pin) for pin in motor_data if convert_node_number(pin) is not None],
                        'vibrationTime': [d * 1000 for d in request.json['duration']],
                        'vibrationIntensity': request.json['intensity'],
                        'delayBetweenMotors': request.json['delay']*1000
                    }
                    timeSleep = math.ceil(sum(
                        item['vibrationTime']) + item['delayBetweenMotors'] * (len(item['motor_pins']) - 1))
                    # No delay for Simultaneous type
                    send_motor_command(item, timeSleep, 1)
                    print("hohohoho", item)
                    return jsonify({"response": "ok"}), 200

                elif motor_type == 'Overlap':
                    item = {
                        'type': motor_type,
                        'motorPins': [convert_node_number(pin) for pin in motor_data if convert_node_number(pin) is not None],
                        'activeDurations': [d * 1000 for d in request.json['duration']],
                        'activeIntensity': request.json['intensity'],
                        'delayBetweenMotors': request.json['delay']*1000
                    }
                    timeSleep = max(i * item['delayBetweenMotors'] + duration for i,
                                    duration in enumerate(item['activeDurations'])) + 1000

                    # No delay for Simultaneous type
                    send_motor_command(item, timeSleep, 1)
                    print("ahihihihi", item)
                    return jsonify({"response": "ok"}), 200

                else:
                    motor_delay = request.json['delay']
                    grp_data = wrap_in_list(transform_motor_data(motor_data))
                    max_durations = get_max_duration(grp_data)
                    print('lalalala', grp_data)
                    responses = []
                    for idx, item in enumerate(grp_data):
                        send_motor_command(
                            item, max_durations[idx], motor_delay)
                        responses.append({
                            'message': f'Motor command sent to node_number'
                        })
                    return jsonify(responses), 200

            except Exception as e:
                print(e)
                return jsonify({'error': str(e)}), 500
        else:
            return jsonify({'error': 'Invalid request method'}), 405
