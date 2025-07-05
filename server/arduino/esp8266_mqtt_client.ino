#include <ESP8266WiFi.h>           // Thu vien ket noi wifi
#include <PubSubClient.h>          // Thu vien cho phep publish len mqtt server
#include <SoftwareSerial.h>        // Thu vien cho phep tao mot ket noi de giao tiep mach dien tu khac
#include <ArduinoJson.h>           // For better JSON handling
#include <Adafruit_Fingerprint.h>  // Thu vien cho cam bien van tay AS608

// Network Configuration
const char* WIFI_SSID = "Vinh";
const char* WIFI_PASSWORD = "28282828";
const unsigned long WIFI_TIMEOUT = 15000;  // 15 seconds

// MQTT Configuration
const char* MQTT_SERVER = "192.168.0.100";  // Change to your actual server IP
const int MQTT_PORT = 1883;
const char* DEVICE_ID = "esp01_smashminton";
const char* CLIENT_ID = "esp01_client";
const unsigned long MQTT_RECONNECT_DELAY = 2000;  // 2 seconds

// MQTT Topics
const char* TOPIC_COMMAND = "smashminton/device/esp01/command";
const char* TOPIC_RESPONSE = "smashminton/device/esp01/response";
const char* TOPIC_INFO = "smashminton/device/esp01/info";
const char* TOPIC_STATUS = "smashminton/device/esp01/status";
const char* TOPIC_HEARTBEAT = "smashminton/device/esp01/heartbeat";
const char* TOPIC_FINGERPRINT = "smashminton/device/esp01/fingerprint";

// Hardware Configuration
#define FINGERPRINT_RX D3  // GPIO0 - connect to AS608 TX
#define FINGERPRINT_TX D4  // GPIO2 - connect to AS608 RX
#define BUZZER_PIN D5

// Timing
unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 30000;  // 30 seconds
unsigned long lastFingerprintScan = 0;
const unsigned long FINGERPRINT_SCAN_INTERVAL = 1000;  // 1 second
unsigned long lastEnrollmentTime = 0;
const unsigned long ENROLLMENT_COOLDOWN = 5000;  // 5 seconds cooldown after enrollment

WiFiClient espClient;
PubSubClient mqttClient(espClient);
SoftwareSerial mySerial(FINGERPRINT_RX, FINGERPRINT_TX);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

// State tracking
bool fingerprintInitialized = false;

void setup() {
  Serial.begin(115200);
  Serial.println("\n🚀 ESP8266 MQTT Client Starting...");

  connectToWiFi();
  setupMQTT();
  setupFingerprint();

  Serial.println("✅ Setup completed!");
}

void loop() {
  // Maintain MQTT connection
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();

  // Scan for fingerprints
  if (fingerprintInitialized) {
    scanFingerprint();
  }

  // Send periodic heartbeat
  sendHeartbeat();

  // Handle other tasks
  yield();  // Allow ESP8266 to handle background tasks
}

void connectToWiFi() {
  Serial.printf("🌐 Connecting to WiFi: %s\n", WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long startTime = millis();

  while (WiFi.status() != WL_CONNECTED && (millis() - startTime) < WIFI_TIMEOUT) {
    Serial.print(".");
    delay(500);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n✅ WiFi Connected!\n");
    Serial.printf("   IP Address: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("   Signal Strength: %d dBm\n", WiFi.RSSI());
  } else {
    Serial.println("\n❌ WiFi Connection Failed!");
    Serial.println("   Restarting in 5 seconds...");
    delay(5000);
    ESP.restart();
  }
}

void setupMQTT() {
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(onMqttMessage);
  mqttClient.setKeepAlive(60);  // 60 seconds keep alive

  Serial.printf("📡 MQTT Server: %s:%d\n", MQTT_SERVER, MQTT_PORT);
}

void reconnectMQTT() {
  static unsigned long lastReconnectAttempt = 0;

  if (millis() - lastReconnectAttempt < MQTT_RECONNECT_DELAY) {
    return;  // Don't attempt too frequently
  }

  lastReconnectAttempt = millis();

  Serial.printf("🔄 Attempting MQTT connection...\n");

  if (mqttClient.connect(CLIENT_ID, TOPIC_STATUS, 0, true, "offline")) {
    Serial.println("✅ MQTT Connected!");

    // Subscribe to command topic
    if (mqttClient.subscribe(TOPIC_COMMAND)) {
      Serial.printf("📥 Subscribed to: %s\n", TOPIC_COMMAND);
    } else {
      Serial.println("❌ Failed to subscribe to command topic");
    }

    // Publish online status
    publishStatus("online");

    // Send device info
    sendDeviceInfo();

  } else {
    Serial.printf("❌ MQTT Connection failed, rc=%d\n", mqttClient.state());
    Serial.println("   Retrying in 2 seconds...");
  }
}

void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  // Convert payload to string
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.printf("📨 Message received [%s]: %s\n", topic, message.c_str());

  // Parse and handle command
  handleCommand(message);
}

void sendResponse(const JsonDocument& response) {
  String responseStr;
  serializeJson(response, responseStr);

  if (mqttClient.publish(TOPIC_RESPONSE, responseStr.c_str())) {
    Serial.printf("📤 Response sent: %s\n", responseStr.c_str());
  } else {
    Serial.println("❌ Failed to send response");
  }
}

void sendErrorResponse(const String& errorMessage, const String& requestId = "") {
  JsonDocument response;
  response["action"] = "error_response";
  response["status"] = "error";
  response["message"] = errorMessage;
  response["timestamp"] = millis();

  if (!requestId.isEmpty()) {
    response["requestId"] = requestId;
  }

  sendResponse(response);
}

void beepSuccess() {
  tone(BUZZER_PIN, 523, 150);
  delay(200);
  tone(BUZZER_PIN, 659, 150);
  delay(200);
  tone(BUZZER_PIN, 784, 200);
  delay(250);
  noTone(BUZZER_PIN);
}

void beepFail() {
  tone(BUZZER_PIN, 330, 200);
  delay(250);
  tone(BUZZER_PIN, 247, 200);
  delay(250);
  tone(BUZZER_PIN, 196, 300);
  delay(350);
  noTone(BUZZER_PIN);
}

void beepAgain() {
  tone(BUZZER_PIN, 440, 150);
  delay(200);
  tone(BUZZER_PIN, 523, 150);
  delay(200);
  tone(BUZZER_PIN, 587, 200);
  delay(250);
  noTone(BUZZER_PIN);
}

void handleCommand(const String& command) {
  // Parse JSON command
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, command);

  if (error) {
    Serial.printf("❌ JSON parsing failed: %s\n", error.c_str());
    sendErrorResponse("Invalid JSON format");
    return;
  }
  // Check if message has NestJS microservice format with pattern and data
  String action;
  String requestId;
  JsonDocument dataDoc;

  if (doc["pattern"].is<const char*>() && doc["data"].is<JsonObject>()) {
    // NestJS microservice format: {"pattern":"topic","data":{...}}
    Serial.println("🔍 Processing NestJS microservice format");
    dataDoc = doc["data"];
    action = dataDoc["action"] | "";
    requestId = dataDoc["requestId"] | "";
  } else {
    // Direct format: {"action":"...","requestId":"..."}
    Serial.println("🔍 Processing direct format");
    action = doc["action"] | "";
    requestId = doc["requestId"] | "";
    dataDoc = doc;
  }
  Serial.printf("📋 Parsed - Action: '%s', RequestId: '%s'\n", action.c_str(), requestId.c_str());

  if (action == "ping") {
    handlePingCommand(requestId);
  } else if (action == "get_status") {
    handleStatusCommand(requestId);
  } else if (action == "reset") {
    handleResetCommand(requestId);
  } else if (action == "enroll_finger") {
    handleEnrollFingerCommand(dataDoc, requestId);
  } else if (action == "delete_finger") {
    handleDeleteFingerCommand(dataDoc, requestId);
  } else if (action == "get_finger_count") {
    handleGetFingerCountCommand(requestId);
  } else {
    Serial.printf("❌ Unknown command: '%s'\n", action.c_str());
    sendErrorResponse("Unknown command: " + action, requestId);
  }
}

void handlePingCommand(const String& requestId) {
  JsonDocument response;
  response["status"] = "pong";
  response["timestamp"] = millis();
  response["uptime"] = millis();

  if (!requestId.isEmpty()) {
    response["requestId"] = requestId;
  }

  sendResponse(response);
}

void handleStatusCommand(const String& requestId) {
  JsonDocument response;
  response["status"] = "online";
  response["wifiSignal"] = WiFi.RSSI();
  response["freeHeap"] = ESP.getFreeHeap();
  response["uptime"] = millis();
  response["fingerprintStatus"] = fingerprintInitialized;

  if (!requestId.isEmpty()) {
    response["requestId"] = requestId;
  }

  sendResponse(response);
}

void handleResetCommand(const String& requestId) {
  JsonDocument response;
  response["status"] = "resetting";
  response["message"] = "Device will restart in 2 seconds";

  if (!requestId.isEmpty()) {
    response["requestId"] = requestId;
  }

  sendResponse(response);

  Serial.println("🔄 Reset command received. Restarting...");
  delay(2000);
  ESP.restart();
}

void publishStatus(const String& status) {
  JsonDocument statusDoc;
  statusDoc["status"] = status;
  statusDoc["deviceId"] = DEVICE_ID;
  statusDoc["timestamp"] = millis();

  String statusStr;
  serializeJson(statusDoc, statusStr);

  mqttClient.publish(TOPIC_STATUS, statusStr.c_str(), true);  // Retained message
}

void sendDeviceInfo() {
  JsonDocument info;
  info["deviceId"] = DEVICE_ID;
  info["chipId"] = ESP.getChipId();
  info["flashChipId"] = ESP.getFlashChipId();
  info["flashChipSize"] = ESP.getFlashChipSize();
  info["freeHeap"] = ESP.getFreeHeap();
  info["wifiSignal"] = WiFi.RSSI();
  info["ipAddress"] = WiFi.localIP().toString();
  info["macAddress"] = WiFi.macAddress();

  String infoStr;
  serializeJson(info, infoStr);

  mqttClient.publish(TOPIC_INFO, infoStr.c_str());
  Serial.println("📋 Device info sent");
}

void sendHeartbeat() {
  if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    lastHeartbeat = millis();

    JsonDocument heartbeat;
    heartbeat["deviceId"] = DEVICE_ID;
    heartbeat["timestamp"] = millis();
    heartbeat["uptime"] = millis();
    heartbeat["freeHeap"] = ESP.getFreeHeap();
    heartbeat["wifiSignal"] = WiFi.RSSI();
    heartbeat["fingerprintStatus"] = fingerprintInitialized;

    String heartbeatStr;
    serializeJson(heartbeat, heartbeatStr);

    if (mqttClient.publish(TOPIC_HEARTBEAT, heartbeatStr.c_str())) {
      Serial.println("💓 Heartbeat sent");
    }
  }
}

// ===== FINGERPRINT FUNCTIONS =====

void setupFingerprint() {
  Serial.println("🔐 Initializing AS608 Fingerprint Sensor...");

  mySerial.begin(57600);
  delay(100);

  if (finger.verifyPassword()) {
    Serial.println("✅ AS608 Fingerprint sensor found!");
    fingerprintInitialized = true;

    // Get sensor info
    finger.getParameters();
    Serial.printf("📊 Sensor Info:\n");
    Serial.printf("   Status: 0x%X\n", finger.status_reg);
    Serial.printf("   System ID: 0x%X\n", finger.system_id);
    Serial.printf("   Capacity: %d\n", finger.capacity);
    Serial.printf("   Security Level: %d\n", finger.security_level);
    Serial.printf("   Device Address: 0x%X\n", finger.device_addr);
    Serial.printf("   Packet Length: %d\n", finger.packet_len);
    Serial.printf("   Baud Rate: %d\n", finger.baud_rate);

    // Count enrolled fingerprints
    finger.getTemplateCount();
    Serial.printf("   Enrolled Fingerprints: %d\n", finger.templateCount);

  } else {
    Serial.println("❌ AS608 Fingerprint sensor not found!");
    Serial.println("   Check wiring:");
    Serial.printf("   AS608 VCC → D1 R2 3V3\n");
    Serial.printf("   AS608 GND → D1 R2 GND\n");
    Serial.printf("   AS608 TX  → D1 R2 D3 (GPIO0)\n");
    Serial.printf("   AS608 RX  → D1 R2 D4 (GPIO2)\n");
    fingerprintInitialized = false;
  }
}

void scanFingerprint() {
  if (millis() - lastFingerprintScan < FINGERPRINT_SCAN_INTERVAL) {
    return;
  }

  // Check if we're in cooldown period after enrollment
  if (millis() - lastEnrollmentTime < ENROLLMENT_COOLDOWN) {
    return;  // Skip scanning during cooldown
  }

  lastFingerprintScan = millis();

  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) {
    // Only log if it's not just "no finger" - reduces spam
    if (p != FINGERPRINT_NOFINGER) {
      Serial.printf("⚠️ Image capture issue: %d\n", p);
    }
    return;
  }

  // Convert image to template
  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) {
    // Handle common conversion errors more gracefully
    if (p == FINGERPRINT_IMAGEMESS) {
      Serial.println("⚠️ Fingerprint image unclear - try repositioning finger");
      beepFail();
    } else if (p == FINGERPRINT_FEATUREFAIL) {
      Serial.println("⚠️ Could not find fingerprint features");
      beepFail();
    } else {
      Serial.printf("❌ Failed to convert fingerprint image: %d\n", p);
      beepFail();
    }
    return;
  }

  // Search for matching fingerprint
  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    // Match found!
    Serial.printf("🎯 Fingerprint match found! ID: %d, Confidence: %d\n",
                  finger.fingerID, finger.confidence);
    beepSuccess();

    publishFingerprintEvent("match", finger.fingerID, finger.confidence);

    // Wait for finger removal to prevent multiple rapid matches
    Serial.println("✋ Please remove finger...");
    unsigned long waitStart = millis();
    while (finger.getImage() != FINGERPRINT_NOFINGER && (millis() - waitStart) < 3000) {
      yield();
      delay(100);
    }

  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("👤 Unknown fingerprint detected");
    beepFail();

    publishFingerprintEvent("unknown", 0, 0);

    // Wait for finger removal
    Serial.println("✋ Please remove finger...");
    unsigned long waitStart = millis();
    while (finger.getImage() != FINGERPRINT_NOFINGER && (millis() - waitStart) < 3000) {
      yield();
      delay(100);
    }

  } else {
    // Handle search errors more gracefully
    if (p == FINGERPRINT_IMAGEMESS) {
      // Don't spam console with this common error
      static unsigned long lastMessError = 0;
      if (millis() - lastMessError > 5000) {  // Only log every 5 seconds
        Serial.println("⚠️ Fingerprint sensor needs cleaning or finger repositioning");
        beepFail();
        lastMessError = millis();
      }
    } else {
      beepFail();
      Serial.printf("❌ Fingerprint search error: %d\n", p);
    }
  }
}

void publishFingerprintEvent(const String& eventType, uint16_t fingerID, uint16_t confidence) {
  JsonDocument event;
  event["deviceId"] = DEVICE_ID;
  event["eventType"] = eventType;
  event["fingerID"] = fingerID;
  event["confidence"] = confidence;
  event["timestamp"] = millis();

  String eventStr;
  serializeJson(event, eventStr);

  if (mqttClient.publish(TOPIC_FINGERPRINT, eventStr.c_str())) {
    Serial.printf("📤 Fingerprint event sent: %s\n", eventStr.c_str());
  }
}

// ===== MQTT COMMAND HANDLERS FOR FINGERPRINT =====

void handleEnrollFingerCommand(const JsonDocument& doc, const String& requestId) {
  uint8_t employeeID = doc["employeeID"] | 0;
  uint8_t fingerID = doc["fingerID"] | 1;

  Serial.printf("🔐 Starting fingerprint enrollment for employee ID: %d with finger ID: %d\n", employeeID, fingerID);

  JsonDocument response;
  response["requestId"] = requestId;
  response["action"] = "enroll_finger";
  response["employeeID"] = employeeID;
  response["fingerID"] = fingerID;

  // Check if fingerID is valid
  if (fingerID == 0 || fingerID > finger.capacity) {
    response["status"] = "error";
    response["message"] = "Invalid finger ID";
    sendResponse(response);
    return;
  }

  if (employeeID <= 0) {
    response["status"] = "error";
    response["message"] = "Invalid employee ID";
    sendResponse(response);
    return;
  }

  // Start enrollment process
  int enrollResult = enrollFingerprint(fingerID, employeeID);

  if (enrollResult == FINGERPRINT_OK) {
    response["status"] = "success";
    response["message"] = "Fingerprint enrolled successfully";
    beepSuccess();
  } else {
    response["status"] = "error";
    response["message"] = "Enrollment failed. Error code: " + String(enrollResult);
    beepFail();
  }

  sendResponse(response);
}

void handleDeleteFingerCommand(const JsonDocument& doc, const String& requestId) {
  uint8_t employeeID = doc["employeeID"] | 0;
  uint8_t fingerID = doc["fingerID"] | 1;

  Serial.printf("🗑️ Deleting fingerprint ID: %d\n", fingerID);

  JsonDocument response;
  response["requestId"] = requestId;
  response["action"] = "delete_finger";
  response["employeeID"] = employeeID;
  response["fingerID"] = fingerID;

  if (employeeID < 0) {
    response["status"] = "error";
    response["message"] = "Invalid employee ID";
    sendResponse(response);
    return;
  }

  uint8_t p = finger.deleteModel(fingerID);

  if (p == FINGERPRINT_OK) {
    response["status"] = "success";
    response["message"] = "Fingerprint deleted successfully";
    Serial.printf("✅ Fingerprint ID %d deleted for Employee ID %d\n", fingerID, employeeID);
  } else {
    response["status"] = "error";
    response["message"] = "Failed to delete fingerprint. Error code: " + String(p);
    Serial.printf("❌ Failed to delete fingerprint ID %d for Employee ID %d\n", fingerID, employeeID);
  }

  sendResponse(response);
}

void handleGetFingerCountCommand(const String& requestId) {
  finger.getTemplateCount();

  JsonDocument response;
  response["requestId"] = requestId;
  response["action"] = "get_finger_count";
  response["status"] = "success";
  response["enrolledCount"] = finger.templateCount;
  response["capacity"] = finger.capacity;

  sendResponse(response);

  Serial.printf("📊 Enrolled fingerprints: %d/%d\n", finger.templateCount, finger.capacity);
}

int enrollFingerprint(uint8_t fingerID, uint8_t employeeID) {
  int p = -1;
  unsigned long startTime;
  const unsigned long FINGER_TIMEOUT = 10000;  // 10 seconds timeout

  Serial.printf("📝 Place finger for ID %d...\n", fingerID);

  // Wait for finger with timeout
  startTime = millis();
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    yield();  // Keep ESP8266 responsive

    // Check timeout
    if (millis() - startTime > FINGER_TIMEOUT) {
      Serial.println("⏰ Timeout waiting for finger");
      return FINGERPRINT_IMAGEFAIL;
    }

    if (p == FINGERPRINT_NOFINGER) continue;
    if (p != FINGERPRINT_OK) return p;
  }

  // Convert first image
  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) return p;

  Serial.println("🔄 Remove finger and place again...");

  // Send intermediate status - remove finger
  JsonDocument stepResponse;
  stepResponse["action"] = "enroll_step";
  stepResponse["step"] = "remove_finger";
  stepResponse["employeeID"] = employeeID;
  stepResponse["fingerID"] = fingerID;
  stepResponse["timestamp"] = millis();

  String stepStr;
  serializeJson(stepResponse, stepStr);
  mqttClient.publish(TOPIC_RESPONSE, stepStr.c_str());

  delay(2000);

  // Wait for finger removal (shorter timeout)
  startTime = millis();
  while (finger.getImage() != FINGERPRINT_NOFINGER) {
    yield();
    if (millis() - startTime > 5000) {  // 5 seconds for removal
      break;                            // Continue anyway if user doesn't remove finger
    }
  }

  // Wait for finger again with timeout
  Serial.println("📝 Place finger again...");
  beepAgain();

  // Send intermediate status - place finger again
  JsonDocument placeAgainResponse;
  placeAgainResponse["action"] = "enroll_step";
  placeAgainResponse["step"] = "place_again";
  placeAgainResponse["employeeID"] = employeeID;
  placeAgainResponse["fingerID"] = fingerID;
  placeAgainResponse["timestamp"] = millis();

  String placeAgainStr;
  serializeJson(placeAgainResponse, placeAgainStr);
  mqttClient.publish(TOPIC_RESPONSE, placeAgainStr.c_str());

  p = -1;
  startTime = millis();
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    yield();

    // Check timeout
    if (millis() - startTime > FINGER_TIMEOUT) {
      Serial.println("⏰ Timeout waiting for second finger placement");
      return FINGERPRINT_IMAGEFAIL;
    }

    if (p == FINGERPRINT_NOFINGER) continue;
    if (p != FINGERPRINT_OK) return p;
  }

  // Convert second image
  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) return p;

  // Create model
  p = finger.createModel();
  if (p != FINGERPRINT_OK) return p;

  // Store model
  p = finger.storeModel(fingerID);
  if (p == FINGERPRINT_OK) {
    Serial.printf("✅ Fingerprint enrolled successfully with ID: %d\n", fingerID);
    lastEnrollmentTime = millis();  // Set cooldown timer prevent immediate scanning
  }

  return p;
}
