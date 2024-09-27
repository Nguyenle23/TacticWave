import speech_recognition as sr
import numpy as np
from tensorflow.keras.models import load_model
import librosa
from pydub import AudioSegment
import os
import joblib
import serial
import time

# Đường dẫn tới mô hình phát hiện cảm xúc từ âm thanh
emotion_model_path = 'model.h5'  # Thay bằng đường dẫn tới mô hình cảm xúc của bạn
model_svm_path = 'model_svm.pkl'
vectorizer_path = 'vectorizer.pkl'

# Cấu hình Serial (thay đổi cổng COM và tốc độ baud tương ứng với Arduino)
# Thay 'COM3' bằng cổng của bạn, ví dụ 'COM4', '/dev/ttyUSB0' cho Linux
ser = serial.Serial('/dev/cu.usbserial-0001', 115200)
time.sleep(2)  # Chờ một chút để kết nối ổn định


def convert_to_wav(filename):
    """Chuyển đổi tệp âm thanh sang định dạng .wav."""
    if filename.lower().endswith(".mp3"):
        audio = AudioSegment.from_mp3(filename)
        wav_filename = filename.replace(".mp3", ".wav")
        audio.export(wav_filename, format="wav")
        return wav_filename
    return filename


def extract_mfcc(filename, n_mfcc=40):
    """Trích xuất đặc trưng MFCC từ tệp âm thanh."""
    try:
        y, sr = librosa.load(filename, duration=3, offset=0.5)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        mfcc_scaled = np.mean(mfcc.T, axis=0)
        return mfcc_scaled
    except Exception as e:
        print(f"Error processing {filename}: {e}")
        return None


def detect_alert(text):
    """Dự đoán văn bản có phải là Alert/Non-alert không."""
    try:
        # Tải vectorizer và mô hình SVM đã lưu
        vectorizer_loaded = joblib.load(vectorizer_path)
        model_svm_loaded = joblib.load(model_svm_path)

        # Biến đổi văn bản thành đặc trưng số
        text_list = [text]
        X_test_sentences = vectorizer_loaded.transform(text_list)

        # Dự đoán kết quả từ mô hình SVM
        test_predictions = model_svm_loaded.predict(X_test_sentences)

        # Kiểm tra và trả về kết quả
        result = "Alert" if test_predictions[0] == 1 else "Non-alert"
        return result
    except Exception as e:
        print(f"Error in detect_alert: {e}")
        return None


def detect_emotion(mfcc_features):
    """Dự đoán cảm xúc từ đặc trưng MFCC của âm thanh."""
    try:
        # Tải mô hình cảm xúc đã lưu
        emotion_model = load_model(emotion_model_path)

        # Thêm chiều để phù hợp với đầu vào của mô hình
        mfcc_features = np.expand_dims(mfcc_features, axis=0)
        mfcc_features = np.expand_dims(mfcc_features, axis=-1)

        # Dự đoán cảm xúc
        predicted_probs = emotion_model.predict(mfcc_features)
        predicted_label = np.argmax(predicted_probs, axis=1)[0]

        # Gán nhãn cho từng lớp cảm xúc
        class_names = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad']
        emotion_result = class_names[predicted_label]
        return emotion_result, predicted_probs[0]
    except Exception as e:
        print(f"Error in detect_emotion: {e}")
        return None, None


# def send_to_arduino_array(data):
#     """Gửi dữ liệu dạng array đến Arduino từng ký tự một."""
#     ser.write(str(data).encode())  # Chuyển array thành chuỗi và gửi đến Arduino
#     ser.write(b'\n')  # Gửi ký tự xuống dòng để đánh dấu kết thúc

#     # Đọc phản hồi từ ESP32
#     response = ser.readline().decode('utf-8')
#     print(f'Received from ESP32: {response}')

#     ser.close()

def send_to_arduino_array(flag, text):
    data = f"{flag}, {text}"  # Tạo chuỗi dữ liệu với định dạng "flag, text"
    print(f"Sending to ESP32: {data}")
    ser.write(data.encode())  # Chuyển chuỗi thành dạng bytes và gửi đến ESP32
    ser.write(b'\n')

    # Đọc phản hồi từ ESP32
    response = ser.readline().decode('utf-8')
    print(f'Received from ESP32: {response}')

    ser.close()


# def process_audio_file(file_path):
#     """Xử lý tệp âm thanh và đưa ra dự đoán văn bản và cảm xúc."""
#     # Chuyển đổi tệp âm thanh sang định dạng .wav nếu cần thiết
#     file_path = convert_to_wav(file_path)
#     # Nhận diện giọng nói từ âm thanh
#     recognizer = sr.Recognizer()
#     audio_file = sr.AudioFile(file_path)

#     with audio_file as source:
#         audio = recognizer.record(source)

#     text_result = None
#     try:
#         # Chuyển đổi âm thanh thành văn bản
#         text = recognizer.recognize_google(audio)
#         print("Converted Text: ", text)

#     except sr.UnknownValueError:
#         print("Google Speech Recognition could not understand the audio")
#         text_result = None
#     except sr.RequestError as e:
#         print(
#             f"Could not request results from Google Speech Recognition service; {e}")
#         text_result = None

#     # Trích xuất đặc trưng MFCC và dự đoán cảm xúc từ âm thanh
#     mfcc_features = extract_mfcc(file_path)

#     if mfcc_features is not None:
#         # Dự đoán cảm xúc từ đặc trưng MFCC
#         emotion_result, emotion_probs = detect_emotion(mfcc_features)
#         if emotion_result is not None:
#             print(f"Emotion Prediction: {emotion_result}")
#             print(f"Emotion Probabilities: {emotion_probs}")

#             # Kiểm tra điều kiện kết hợp
#             sos_result = "SOS" if emotion_result == 'Fear' and text_result == 'Alert' else "Non-SOS"
#             print(f"Final Result: {sos_result}")

#             # Gửi kết quả SOS hoặc Non-SOS đến ESP32
#             flag = 1 if sos_result == "SOS" else 0
#             send_to_arduino_array(flag, text)
#         else:
#             print("Error in emotion detection.")
#     else:
#         print("MFCC features could not be extracted.")

#     # Xóa tệp .wav sau khi xử lý xong nếu nó được tạo từ .mp3
#     if file_path.endswith(".wav"):
#         os.remove(file_path)


def process_audio_file(file_path):
    """Xử lý tệp âm thanh và đưa ra dự đoán văn bản và cảm xúc."""
    # Chuyển đổi tệp âm thanh sang định dạng .wav nếu cần thiết
    file_path = convert_to_wav(file_path)

    # Nhận diện giọng nói từ âm thanh
    recognizer = sr.Recognizer()
    audio_file = sr.AudioFile(file_path)

    with audio_file as source:
        audio = recognizer.record(source)

    try:
        # Chuyển đổi âm thanh thành văn bản
        text = recognizer.recognize_google(audio)
        print("Converted Text: ", text)

        # Dự đoán văn bản có phải là Alert hay không
        text_result = detect_alert(text)
        print(f"Text Prediction: {text_result}")

    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand the audio")
        text_result = None
    except sr.RequestError as e:
        print(
            f"Could not request results from Google Speech Recognition service; {e}")
        text_result = None

    # Trích xuất đặc trưng MFCC và dự đoán cảm xúc từ âm thanh
    mfcc_features = extract_mfcc(file_path)

    if mfcc_features is not None:
        # Dự đoán cảm xúc từ đặc trưng MFCC
        emotion_result, emotion_probs = detect_emotion(mfcc_features)
        if emotion_result is not None:
            print(f"Emotion Prediction: {emotion_result}")
            print(f"Emotion Probabilities: {emotion_probs}")

            # Kiểm tra điều kiện kết hợp
            sos_result = "SOS" if emotion_result == 'Fear' and text_result == 'Alert' else "Non-SOS"
            print(f"Final Result: {sos_result}")

            # Gửi kết quả SOS hoặc Non-SOS đến ESP32
            flag = 1 if sos_result == "SOS" else 0
            send_to_arduino_array(flag, text.upper())
            # send_to_arduino_array(flag, "H")

            # # Kiểm tra điều kiện kết hợp
            # sos_result = "SOS" if emotion_result == 'Fear' and text_result == 'Alert' else "Non-SOS"
            # print(f"Final Result: {sos_result}")
            # # nếu sos_result = "SOS" thì gửi kết quả SOS đến Arduino là 1, ngược lại là 0
            # # Nếu sos_result = "Non-SOS" thì gửi kết quả Non-SOS đến Arduino là 0
            # # Chú ý: Ở đây, chỉ đưa ra kết quả SOS hoặc Non-SOS, để phù hợp với arduino, bạn cần thêm code gửi kết quả SOS hoặc Non-SOS đến Arduino tương ứng.
            # # Ví dụ:
            # if sos_result == "SOS":
            #     send_to_arduino_array(1, text)
            # else:
            #     send_to_arduino_array(0, text)
            # Gửi kết quả SOS hoặc Non-SOS đến Arduino
            # send_to_arduino_array([sos_result])
        else:
            print("Error in emotion detection.")
    else:
        print("MFCC features could not be extracted.")

    # Xóa tệp .wav sau khi xử lý xong nếu nó được tạo từ .mp3
    # if file_path.endswith(".wav"):
    #     os.remove(file_path)


if __name__ == '__main__':
    try:
        # Đường dẫn tới tệp âm thanh cần kiểm tra
        # Thay bằng đường dẫn tệp của bạn
        file_path = "y2meta.com - Help, Help Me! Sound effect from tiktok. (128 kbps) (1).mp3"

        # Xử lý tệp âm thanh và đưa ra dự đoán
        process_audio_file(file_path)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        ser.close()  # Đóng cổng Serial khi kết thúc
