#include <Arduino.h>
#include <ArduinoJson.h> // Include ArduinoJson library

// Structure to store information for each node
struct NodeInfo {
    int Node_number;
    int Intensity;
    int Duration;
};

NodeInfo nodeInfos[10]; // Array to store up to 10 NodeInfo
int numNodes = 0;       // Actual number of nodes

// Variables for motor control
int motorPins[10];            // Array to hold motor GPIO pins (max 10)
unsigned long activeDurations[10]; // Durations for each motor
unsigned long startTimes[10];  // Start times for motors
bool motorActive[10] = {false}; // Motor activity status
unsigned long lastActivationTime = 0; // Last time a motor was activated
int nextMotorToActivate = 0;   // Next motor to activate
int numMotors = 0;             // Number of motors
unsigned long delayBetweenMotors = 2000; // Delay between motor activations

int getMaxDuration() {
    int maxDuration = 0;
    for (int i = 0; i < numNodes; i++) {
        if (nodeInfos[i].Duration > maxDuration) {
            maxDuration = nodeInfos[i].Duration;
        }
    }
    return maxDuration;
}

void setup() {
    Serial.begin(115200); // Start serial communication
    Serial.println("ESP32 is ready to control motors.");
}

void handleSerialType(JsonObject obj) {
    JsonArray pinsArray = obj["motor_pins"];
    JsonArray vibrationTimesArray = obj["vibrationTime"];
    JsonArray intensityArray = obj["vibrationIntensity"];
    delayBetweenMotors = obj["delayBetweenMotors"];

    numMotors = pinsArray.size();

    if (vibrationTimesArray.size() != numMotors || intensityArray.size() != numMotors) {
        Serial.println("Error: Array sizes for motor_pins, vibrationTime, and intensity must match.");
        return;
    }

    for (int i = 0; i < numMotors; i++) {
        motorPins[i] = pinsArray[i];
        activeDurations[i] = vibrationTimesArray[i];
        pinMode(motorPins[i], OUTPUT);
        analogWrite(motorPins[i], 0); // Ensure motors start off
    }

    for (int i = 0; i < numMotors; i++) {
        int motorPin = motorPins[i];
        int intensity = intensityArray[i];
        unsigned long vibrationTime = activeDurations[i];

        analogWrite(motorPin, intensity);
        Serial.print("Motor ");
        Serial.print(motorPin);
        Serial.print(" turned on with intensity ");
        Serial.print(intensity);
        Serial.print(" for duration ");
        Serial.println(vibrationTime);

        delay(vibrationTime);
        analogWrite(motorPin, 0); // Turn off motor
        delay(delayBetweenMotors);
    }
}

void handleOverlapType(JsonObject obj) {
    JsonArray pinsArray = obj["motorPins"];
    JsonArray durationsArray = obj["activeDurations"];
    JsonArray intensityArray = obj["activeIntensity"];
    delayBetweenMotors = obj["delayBetweenMotors"];
    Serial.print("Delay between motors: ");
    Serial.println(delayBetweenMotors);
    numMotors = pinsArray.size(); 

    if (durationsArray.size() != numMotors) {
        Serial.println("Error: activeDurations size must match motorPins size.");
        return;
    }

    // Setup motors
    for (int i = 0; i < numMotors; i++) {
        motorPins[i] = pinsArray[i];
        activeDurations[i] = durationsArray[i];
        ledcSetup(i, 5000, 8); // Set up PWM channel
        ledcAttachPin(motorPins[i], i);
        ledcWrite(i, 0); // Ensure motors start off
        Serial.print("Motor ");
        Serial.print(motorPins[i]);
        Serial.println(" setup for PWM.");
    }

    // Initialize variables for motor control
    unsigned long lastActivationTime = millis();
    unsigned long startTimes[10] = {0};  // Start times for motors
    bool motorActive[10] = {false};      // Motor activity status
    int nextMotorToActivate = 0;         // Next motor to activate

    while (true) {
        unsigned long currentMillis = millis();

        // Activate the next motor after delayBetweenMotors
        if ((currentMillis - lastActivationTime >= delayBetweenMotors || nextMotorToActivate == 0) && nextMotorToActivate < numMotors) {
            motorActive[nextMotorToActivate] = true;
            startTimes[nextMotorToActivate] = currentMillis;
            lastActivationTime = currentMillis;
            Serial.print("Activating motor ");
            Serial.println(motorPins[nextMotorToActivate]);
            nextMotorToActivate++;
        }

        // Handle the state of each motor
        for (int i = 0; i < numMotors; i++) {
            if (motorActive[i]) {
                if (currentMillis - startTimes[i] < activeDurations[i]) {
                    ledcWrite(i, intensityArray[i]); // Motor is active
                    // Optional: Uncomment to see continuous activity logs
                    // Serial.print("Motor ");
                    // Serial.print(motorPins[i]);
                    // Serial.println(" is active.");
                } else {
                    ledcWrite(i, 0); // Turn off motor
                    motorActive[i] = false;
                    Serial.print("Motor ");
                    Serial.print(motorPins[i]);
                    Serial.println(" turned off.");
                }
            }
        }

        // Check if all motors have been processed
        bool allMotorsProcessed = true;
        for (int i = 0; i < numMotors; i++) {
            if (motorActive[i]) {
                allMotorsProcessed = false;
                break;
            }
        }

        if (nextMotorToActivate >= numMotors && allMotorsProcessed) {
            Serial.println("All motors processed.");
            break; // Exit the loop
        }

        // Small delay to prevent the loop from hogging the CPU
        delay(10);
    }
}



void loop() {
    if (Serial.available() > 0) {
        String input = Serial.readStringUntil('\n');
        Serial.print("Received: ");
        Serial.println(input);

        const size_t capacity = JSON_ARRAY_SIZE(10) + JSON_OBJECT_SIZE(10) + 512;
        DynamicJsonDocument doc(capacity);

        DeserializationError error = deserializeJson(doc, input);
        if (error) {
            Serial.print("JSON parse failed: ");
            Serial.println(error.c_str());
            return;
        }

        if (doc.is<JsonArray>()) {
            JsonArray arr = doc.as<JsonArray>();
            numNodes = 0;
            for (JsonObject obj : arr) {
                if (numNodes < 10) {
                    nodeInfos[numNodes].Node_number = obj["Node_number"];
                    nodeInfos[numNodes].Intensity = obj["Intensity"];
                    nodeInfos[numNodes].Duration = obj["Duration"];
                    numNodes++;
                } else {
                    Serial.println("Too many nodes specified, maximum is 10.");
                    break;
                }
            }

            for (int i = 0; i < numNodes; i++) {
                pinMode(nodeInfos[i].Node_number, OUTPUT);
                analogWrite(nodeInfos[i].Node_number, 0);
            }

            for (int i = 0; i < numNodes; i++) {
                analogWrite(nodeInfos[i].Node_number, nodeInfos[i].Intensity);
                Serial.print("Node ");
                Serial.print(nodeInfos[i].Node_number);
                Serial.print(" turned on with intensity ");
                Serial.println(nodeInfos[i].Intensity);
            }

            int maxDuration = getMaxDuration();
            Serial.print("Maximum Duration: ");
            Serial.println(maxDuration);

            delay(maxDuration);

            for (int i = 0; i < numNodes; i++) {
                analogWrite(nodeInfos[i].Node_number, 0);
                Serial.print("Node ");
                Serial.print(nodeInfos[i].Node_number);
                Serial.println(" turned off.");
            }
        } else if (doc.is<JsonObject>()) {
            JsonObject obj = doc.as<JsonObject>();
            const char* type = obj["type"];
            if (type && strcmp(type, "Serial") == 0) {
                handleSerialType(obj);
            } else if (type && strcmp(type, "Overlap") == 0) {
                handleOverlapType(obj);
            } else {
                Serial.println("Unknown type or unsupported logic.");
            }
        } else {
            Serial.println("Invalid JSON format.");
        }
    }
}
