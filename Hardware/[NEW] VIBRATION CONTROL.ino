#include <Arduino.h>
#include <ArduinoJson.h> // Include ArduinoJson library

// Structure to store information for each node (from first code)
struct NodeInfo {
    int Node_number;
    int Intensity;
    int Duration;
};

NodeInfo nodeInfos[10]; // Array to store up to 10 NodeInfo
int numNodes = 0;       // Actual number of nodes

// Variables for motor control (from second code)
int motorPins[10];            // Array to hold motor GPIO pins (max 10)
int numMotors = 0;            // Number of motors
int delayBetweenMotors = 50;  // Delay between each motor

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

void loop() {
    if (Serial.available() > 0) {
        // Read the input string from Serial
        String input = Serial.readStringUntil('\n');
        Serial.print("Received: ");
        Serial.println(input);

        // Initialize JSON document
        const size_t capacity = JSON_ARRAY_SIZE(10) + JSON_OBJECT_SIZE(10) + 512; // Adjusted size
        DynamicJsonDocument doc(capacity); // Use DynamicJsonDocument for flexibility

        // Parse the JSON
        DeserializationError error = deserializeJson(doc, input);

        if (error) {
            Serial.print("JSON parse failed: ");
            Serial.println(error.c_str());
            return;
        }

        // Check the content of the JSON
        if (doc.is<JsonArray>()) {
            // If it's a JSON array, execute logic from the first code
            JsonArray arr = doc.as<JsonArray>();

            // Store data from JSON into NodeInfo array
            numNodes = 0; // Reset number of nodes
            for (JsonObject obj : arr) {
                if (numNodes < 10) { // Ensure we don't exceed array size
                    nodeInfos[numNodes].Node_number = obj["Node_number"];
                    nodeInfos[numNodes].Intensity = obj["Intensity"];
                    nodeInfos[numNodes].Duration = obj["Duration"];
                    numNodes++;
                } else {
                    Serial.println("Too many nodes specified, maximum is 10.");
                    break;
                }
            }

            // Set all nodes as OUTPUT and ensure they start in the OFF state
            for (int i = 0; i < numNodes; i++) {
                pinMode(nodeInfos[i].Node_number, OUTPUT);
                analogWrite(nodeInfos[i].Node_number, 0); // Set initial intensity to 0
            }

            // Turn on all nodes at the same time with corresponding intensity
            for (int i = 0; i < numNodes; i++) {
                analogWrite(nodeInfos[i].Node_number, nodeInfos[i].Intensity);
                Serial.print("Node ");
                Serial.print(nodeInfos[i].Node_number);
                Serial.print(" turned on with intensity ");
                Serial.println(nodeInfos[i].Intensity);
            }

            // Get the maximum Duration
            int maxDuration = getMaxDuration();
            Serial.print("Maximum Duration: ");
            Serial.println(maxDuration);

            // Add delay after turning on all nodes
            delay(maxDuration);

            // Turn off all nodes after delay
            for (int i = 0; i < numNodes; i++) {
                analogWrite(nodeInfos[i].Node_number, 0); // Turn off node
                Serial.print("Node ");
                Serial.print(nodeInfos[i].Node_number);
                Serial.println(" turned off.");
            }

        } else if (doc.is<JsonObject>()) {
            // If it's a JSON object, execute updated logic
            JsonObject obj = doc.as<JsonObject>();

            // Extract the "type" field
            const char* type = obj["type"];
            if (type && strcmp(type, "Serial") == 0) { // Check if type == "Serial"
                // Extract data
                JsonArray pinsArray = obj["motor_pins"];
                JsonArray vibrationTimesArray = obj["vibrationTime"];
                JsonArray intensityArray = obj["vibrationIntensity"];
                delayBetweenMotors = obj["delayBetweenMotors"];

                // Validate sizes of arrays
                numMotors = pinsArray.size();
                if (vibrationTimesArray.size() != numMotors || intensityArray.size() != numMotors) {
                    Serial.println("Error: Array sizes for motor_pins, vibrationTime, and intensity must match.");
                    return;
                }

                // Store pins and configure them as OUTPUT
                for (int i = 0; i < numMotors; i++) {
                    motorPins[i] = pinsArray[i];
                    pinMode(motorPins[i], OUTPUT);
                    analogWrite(motorPins[i], 0); // Turn off motors initially
                }

                // Activate motors sequentially with specified vibration time and intensity
                for (int i = 0; i < numMotors; i++) {
                    int motorPin = motorPins[i];
                    int vibrationTime = vibrationTimesArray[i];
                    int intensity = intensityArray[i];

                    analogWrite(motorPin, intensity); // Set motor intensity
                    Serial.print("Motor ");
                    Serial.print(motorPin);
                    Serial.print(" turned on with intensity ");
                    Serial.print(intensity);
                    Serial.print(" for duration ");
                    Serial.println(vibrationTime);

                    delay(vibrationTime);             // Vibrate for specified time
                    analogWrite(motorPin, 0);         // Turn off motor
                    delay(delayBetweenMotors);        // Wait before next motor
                }

            } else {
                Serial.println("Type is not 'Serial'. Logic skipped.");
            }

        } else {
            Serial.println("Invalid JSON format.");
        }
    }
}
