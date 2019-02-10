// @flow
import State from "./State";
import config from "../config";

export default class Communicator {
    actual_state: ?State;
    is_sending_needed: boolean;
    is_xhr_in_progress: boolean;
    last_state_change_request: ?State;
    socket: WebSocket;
    isWebSocketReady: boolean;
    window: window;

    constructor(window: window) {
        this.window = window;
        this.actual_state = null;
        this.is_sending_needed = true;
        this.last_state_change_request = null;
        this.isWebSocketReady = false;
        this.initWebSocket();
        this.startKeepAlive();
    }

    set_state_changed(state: State) {
        this.actual_state = state;
        this.send_request(state);
    }

    startKeepAlive() {
        var that = this;
        setInterval(() => {
            if(that.actual_state instanceof State) {
                that.send_request(that.actual_state);
            }
        }, config.keepAliveInterval);
    }

    initWebSocket() {
        var that = this;
        this.socket = new WebSocket('ws://'+this.window.location.host+'/ws');
        this.socket.addEventListener('open', function (event) {
          that.isWebSocketReady = true;
        });
    }

    send_request(state: State) {
        if (this.isWebSocketReady) {
            this.socket.send(this.getWebsocketMessage(state));
        }
    }

    getWebsocketMessage(state: State) {
        var message = new Uint16Array(14);
        message[0] = state.right_horizontal + 1000;
        message[1] = state.right_vertical + 1000;
        message[2] = state.left_vertical + 1000;
        message[3] = state.left_horizontal + 1000;
        message[4] = state.switch_arming + 1000;
        for (let index = 5; index < message.length; index++) {
          message[index] = 1500;
        }
        return message;
    }
}
