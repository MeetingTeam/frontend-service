import SockJS from "sockjs-client";
import Stomp from "stompjs";
import CognitoService from "./CognitoService.js";
import { WEBSOCKET_SERVICE_ENDPOINT } from "../Configs/EnvConfig.js";

class WebsocketService {
  constructor() {
    this.sock = null;
    this.stompClient = null;
    this.subscriptions = new Map();
    this.timeInterval = 3000;
    this.websocketEndpoint = `${WEBSOCKET_SERVICE_ENDPOINT}/wss`;
  }

  async connect() {
    if (!this.sock || this.sock.readyState === SockJS.CLOSED) {
      this.sock = new SockJS(this.websocketEndpoint);
      this.stompClient = Stomp.over(this.sock);
      this.stompClient.debug = null
      
      const jwtToken= await CognitoService.getAccessToken()

      this.stompClient.connect(
        { "Authorization": jwtToken }, 
        this.onConnected.bind(this), 
        this.onError.bind(this)
      );
    }
  }

  onConnected() {
    console.log("Connected to WebSocket successfully");
  }

  onError(error) {
    console.log("WebSocket Error:", error);
    setTimeout(() => {
      this.connect();
      console.log("Reconnecting WebSocket...");
    }, this.timeInterval);
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect();
    }
    this.sock = null;
    this.stompClient = null;
    this.subscriptions = new Map();
    console.log("Disconnected from WebSocket");
  }

  subscribeToNewTopic(dest, newTopic, onMessageReceived) {
    const recInterval = setInterval(() => {
      if (this.stompClient && this.stompClient.connected) {
        if (this.subscriptions.has(dest)) {
          this.subscriptions.get(dest).topics.set(newTopic, onMessageReceived);
        } else {
          const callback = this.stompClient.subscribe(dest, (payload) => {
            const socketMessage = JSON.parse(payload.body);
            const subscription = this.subscriptions.get(dest);
            if (subscription && subscription.topics.has(socketMessage.topic)) {
              subscription.topics.get(socketMessage.topic)(socketMessage.payload);
            }
          });
          this.subscriptions.set(dest, {
            callback,
            topics: new Map([[newTopic, onMessageReceived]]),
          });
        }
        clearInterval(recInterval);
      }
    }, this.timeInterval);
  }

  unsubscribeTopic(dest, topic) {
    const subscription = this.subscriptions.get(dest);
    if (subscription) {
      subscription.topics.delete(topic);
    }
  }

  unsubscribeByTeamId(teamId) {
    const dest = `/topic/team.${teamId}`;
    const subscription = this.subscriptions.get(dest);
    if (subscription) {
      subscription.callback.unsubscribe();
      this.subscriptions.delete(dest);
    }
  }
}

export default new WebsocketService();
