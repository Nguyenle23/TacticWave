import time
import serial
import joblib
from pydub import AudioSegment
import librosa
from tensorflow.keras.models import load_model
import numpy as np
import speech_recognition as sr

emotion_model_path = 'TacticWave/Software/AI Models/model.h5'
model_svm_path = 'TacticWave/Software/AI Models/model_svm.pkl'
vectorizer_path = 'TacticWave/Software/AI Models/vectorizer.pkl'

ser = serial.Serial('/dev/cu.usbserial-0001', 115200)
time.sleep(2)


def convert_to_wav(filename):
    if filename.lower().endswith(".mp3"):
        audio = AudioSegment.from_mp3(filename)
        wav_filename = filename.replace(".mp3", ".wav")
        audio.export(wav_filename, format="wav")
        return wav_filename
    return filename


def extract_mfcc(filename, n_mfcc=40):
    try:
        y, sr = librosa.load(filename, duration=3, offset=0.5)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        mfcc_scaled = np.mean(mfcc.T, axis=0)
        return mfcc_scaled
    except Exception as e:
        print(f"Error processing {filename}: {e}")
        return None


def detect_alert(text):
    try:
        vectorizer_loaded = joblib.load(vectorizer_path)
        model_svm_loaded = joblib.load(model_svm_path)

        text_list = [text]
        X_test_sentences = vectorizer_loaded.transform(text_list)

        test_predictions = model_svm_loaded.predict(X_test_sentences)

        result = "Alert" if test_predictions[0] == 1 else "Non-alert"
        return result
    except Exception as e:
        print(f"Error in detect_alert: {e}")
        return None


def detect_emotion(mfcc_features):
    """Dự đoán cảm xúc từ đặc trưng MFCC của âm thanh."""
    try:
        emotion_model = load_model(emotion_model_path)

        mfcc_features = np.expand_dims(mfcc_features, axis=0)
        mfcc_features = np.expand_dims(mfcc_features, axis=-1)

        predicted_probs = emotion_model.predict(mfcc_features)
        predicted_label = np.argmax(predicted_probs, axis=1)[0]

        class_names = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad']
        emotion_result = class_names[predicted_label]
        return emotion_result, predicted_probs[0]
    except Exception as e:
        print(f"Error in detect_emotion: {e}")
        return None, None


def send_to_arduino_array(flag, text):
    data = f"{flag}, {text}"
    print(f"Sending to ESP32: {data}")
    ser.write(data.encode())
    ser.write(b'\n')

    response = ser.readline().decode('utf-8')
    print(f'Received from ESP32: {response}')

    ser.close()


def process_audio_file(file_path):
    file_path = convert_to_wav(file_path)

    recognizer = sr.Recognizer()
    audio_file = sr.AudioFile(file_path)

    with audio_file as source:
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio)
        print("Converted Text: ", text)

        text_result = detect_alert(text)
        print(f"Text Prediction: {text_result}")

    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand the audio")
        text_result = None
    except sr.RequestError as e:
        print(
            f"Could not request results from Google Speech Recognition service; {e}")
        text_result = None

    mfcc_features = extract_mfcc(file_path)

    if mfcc_features is not None:
        emotion_result, emotion_probs = detect_emotion(mfcc_features)
        if emotion_result is not None:
            print(f"Emotion Prediction: {emotion_result}")
            print(f"Emotion Probabilities: {emotion_probs}")

            sos_result = "SOS" if emotion_result == 'Fear' and text_result == 'Alert' else "Non-SOS"
            print(f"Final Result: {sos_result}")

            flag = 1 if sos_result == "SOS" else 0
            send_to_arduino_array(flag, text.upper())
        else:
            print("Error in emotion detection.")
    else:
        print("MFCC features could not be extracted.")


if __name__ == '__main__':
    try:
        file_path = "TacticWave/Software/Sample Test/Help, Help Me! Sound.wav"
        # file_path = "TacticWave/Software/Sample Test/Neeko Voice.wav"

        process_audio_file(file_path)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        ser.close()
