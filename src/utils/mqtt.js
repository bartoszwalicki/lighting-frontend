import * as mqtt from "mqtt";

const client = mqtt.connect("ws://192.168.0.23:9001");
client.on("connect", () => {
    console.log("MQTT connected.");
});

export default client;