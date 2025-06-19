#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>  // For better JSON handling

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
const char* TOPIC_STATUS = "smashminton/device/esp01/status";
const char* TOPIC_HEARTBEAT = "smashminton/device/esp01/heartbeat";

// Timing
unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 30000;  // 30 seconds

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// State tracking
bool isRegistered = false;
String userId = "";

void setup() {
  Serial.begin(115200);
  Serial.println("\n🚀 ESP8266 MQTT Client Starting...");

  connectToWiFi();
  setupMQTT();

  Serial.println("✅ Setup completed!");
}

void loop() {
  // Maintain MQTT connection
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();

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
  response["status"] = "error";
  response["message"] = errorMessage;
  response["timestamp"] = millis();

  if (!requestId.isEmpty()) {
    response["requestId"] = requestId;
  }

  sendResponse(response);
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

  String action = doc["action"] | "";
  String requestId = doc["requestId"] | "";

  if (action == "register") {
    handleRegisterCommand(doc, requestId);
  } else if (action == "ping") {
    handlePingCommand(requestId);
  } else if (action == "get_status") {
    handleStatusCommand(requestId);
  } else if (action == "reset") {
    handleResetCommand(requestId);
  } else {
    Serial.printf("❌ Unknown command: %s\n", action.c_str());
    sendErrorResponse("Unknown command: " + action, requestId);
  }
}

void handleRegisterCommand(const JsonDocument& doc, const String& requestId) {
  String deviceName = doc["deviceName"] | "ESP01_Device";
  String location = doc["location"] | "Unknown";

  Serial.println("🔐 Processing registration...");

  // Simulate registration logic
  userId = "user_" + String(ESP.getChipId(), HEX);
  isRegistered = true;

  // Send registration response
  JsonDocument response;
  response["status"] = "success";
  response["message"] = "Device registered successfully";
  response["userId"] = userId;
  response["deviceId"] = DEVICE_ID;
  response["timestamp"] = millis();

  if (!requestId.isEmpty()) {
    response["requestId"] = requestId;
  }

  sendResponse(response);

  Serial.printf("✅ Registration successful! User ID: %s\n", userId.c_str());
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
  response["registered"] = isRegistered;
  response["userId"] = userId;
  response["wifiSignal"] = WiFi.RSSI();
  response["freeHeap"] = ESP.getFreeHeap();
  response["uptime"] = millis();

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

  mqttClient.publish("smashminton/device/esp01/info", infoStr.c_str());
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

    String heartbeatStr;
    serializeJson(heartbeat, heartbeatStr);

    if (mqttClient.publish(TOPIC_HEARTBEAT, heartbeatStr.c_str())) {
      Serial.println("💓 Heartbeat sent");
    }
  }
}
