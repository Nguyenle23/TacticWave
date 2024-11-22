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
        9: 4
    }

    return mapping.get(node_number, None)


def send_motor_command(node_number, duration):
    """
    Gửi lệnh điều khiển motor với node_number và thời gian duration (ms).
    """
    data = {
        "node_number": node_number,
        "duration": duration
    }

    try:
        with serial.Serial(esp32_port, baud_rate, timeout=timeout) as ser:
            json_data = json.dumps(data)
            ser.write((json_data + "\n").encode('utf-8'))
            print(f"Đã gửi: {json_data}")

            # Nhận phản hồi từ ESP32
            # Chờ duration + 1 giây để nhận phản hồi
            time.sleep(duration / 1000 + 1)
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

                # Check if motor_data is a list
                if isinstance(motor_data, list):
                    responses = []
                    for item in motor_data:
                        node_number = convert_node_number(
                            item.get('Node number'))
                        duration = item.get('Duration')*1000

                        # Validate required fields
                        if node_number is None or duration is None:
                            responses.append(
                                {'error': 'node_number and duration are required'})
                            continue

                        # Send the motor command
                        send_motor_command(node_number, duration)

                        # Collecting success response
                        responses.append({
                            'message': f'Motor command sent to node_number {node_number} with duration {duration} ms'
                        })

                    return jsonify(responses), 200
                else:
                    return jsonify({'error': 'Invalid data format. Expected a list of motor commands.'}), 400

            except Exception as e:
                print(e)
                return jsonify({'error': str(e)}), 500
        else:
            return jsonify({'error': 'Invalid request method'}), 405
