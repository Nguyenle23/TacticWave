const int LED_BUILTIN = 2;

int nodes[9] = {23, 32, 14, 21, 22, 12, 19, 20, 21};  
int nodeCount = 9;

struct CharNodeMapping {
  char character;
  int node1;
  int node2;
};

CharNodeMapping charNodeMap[] = {
  {'H', 1, 3},  // H: Node 1 + Node 3
  {'E', 2, -1}, // E: Node 2 
  {'L', 4, 6},  // L: Node 4 + Node 6
  {'P', 8, 9},  // P: Node 8 + Node 9
  {'M', 5, 6},  // M: Node 5 + Node 6
  {' ', 5, -1}  // Break: Node 5
};

int charNodeMapSize = sizeof(charNodeMap) / sizeof(charNodeMap[0]);

void setup() {
  Serial.begin(115200);  
  delay(2000);           

  for (int i = 0; i < nodeCount; i++) {
    pinMode(nodes[i], OUTPUT);  
    analogWrite(nodes[i], 0);
  }

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);  
}


void loop() {
  if (Serial.available() > 0) {
    digitalWrite(LED_BUILTIN, HIGH);  
    String inputData = Serial.readStringUntil('\n');  
    //Serial.println(inputData);
    
    int commaIndex = inputData.indexOf(',');
    if (commaIndex > 0) {
      String flagStr = inputData.substring(0, commaIndex);  
      String text = inputData.substring(commaIndex + 2);  

      int flag = flagStr.toInt();  

      int speedValue;
      if (flag == 1) {
        speedValue = 255;  
        Serial.println("SOS detected!");
      } else if (flag == 0) {
        speedValue = 125; 
        Serial.println("No SOS detected.");
      }

      int textLength = text.length();
      char charArray[textLength + 1];
      text.toCharArray(charArray, textLength + 1);

      for (int i = 0; i < textLength; i++) {
        char c = charArray[i];
        Serial.print("Character: ");
        Serial.println(c);

        for (int j = 0; j < charNodeMapSize; j++) {
          if (charNodeMap[j].character == c) {
            int node1 = charNodeMap[j].node1;
            int node2 = charNodeMap[j].node2;
            Serial.print("Node1: ");
            Serial.println(node1);
            Serial.print("Node2: ");
            Serial.println(node2);

            if (node1 > 0) {
              analogWrite(nodes[node1 - 1], speedValue);  
            }

            if (node2 > 0) {
              analogWrite(nodes[node2 - 1], speedValue);  
            }

            delay(1000);  

            if (node1 > 0) {
              analogWrite(nodes[node1 - 1], 0);  
            }

            if (node2 > 0) {
              analogWrite(nodes[node2 - 1], 0); 
            }

            delay(1000);  
            break;
          }
        }
      }
    } else {
      Serial.println("Invalid data format received.");
    }
    digitalWrite(LED_BUILTIN, LOW);
  }
}
