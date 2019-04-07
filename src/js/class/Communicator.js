// @flow
import State from "./State";
import config from "../config";

export default class Communicator {
    actual_state: ?State;
    is_sending_needed: boolean;
    is_xhr_in_progress: boolean;
    last_state_change_request: ?State;
    checkTimer: ?TimeoutID;
    xhr: XMLHttpRequest;
    window: window;
    statusIndicator: HTMLElement;

    constructor(window: window) {
        this.window = window;
        this.actual_state = null;
        this.is_sending_needed = true;
        this.is_xhr_in_progress = false;
        this.last_state_change_request = null;
        this.xhr = new XMLHttpRequest();
        var that = this;
        var statusIndicator = window.document.getElementById(config.statusIndicatorId);
        if(!(statusIndicator instanceof HTMLElement)) {
            throw "Status indicator is not present";
        }
        this.statusIndicator = statusIndicator;
        this.xhr.addEventListener("loadend", function(){
            that.set_xhr_done();
        });
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

    set_xhr_done() {
        this.is_xhr_in_progress = false;
        if(this.last_state_change_request instanceof State)
        {
            this.send_request(this.last_state_change_request);
            this.last_state_change_request = null;
        }
        this.statusIndicator.style.backgroundColor = "green";
        if(this.checkTimer) {
            clearTimeout(this.checkTimer);
        }
        this.checkTimer = setTimeout(() => {
            this.statusIndicator.style.backgroundColor = "red";
        }, 600);
    }

    send_request(state: State) {
        if(!this.is_xhr_in_progress) {
            this.xhr.abort();
            this.xhr.open('GET', '/control'+this.get_state_querystring(state), true);
            this.is_xhr_in_progress = true;
            this.xhr.send();
        } else {
            this.last_state_change_request = state;
        }
    }

    get_state_querystring(state: State) {
        var query = '?';
        query += '0='+(state.right_horizontal + 1000);
        query += '&1='+(state.right_vertical + 1000);
        query += '&2='+(state.left_vertical + 1000);
        query += '&3='+(state.left_horizontal + 1000);
        query += '&4='+(state.switch_arming + 1000);
        return query;
    }
}
