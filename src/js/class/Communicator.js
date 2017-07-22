export default class Communicator {
    constructor(config, xhr) {
        this.actual_state = null;
        this.config = config;
        this.is_sending_needed = true;
        this.is_xhr_in_progress = false;
        this.last_state_change_request = null;
        this.xhr = xhr;
        var that = this;
        this.xhr.addEventListener("loadend", function(){
            that.set_xhr_done();
        });
    }

    set_state_changed(state) {
        this.actual_state = state;
        this.send_request(state);
    }

    set_xhr_done() {
        this.is_xhr_in_progress = false;
        if(this.last_state_change_request !== null)
        {
            this.send_request(this.last_state_change_request);
            this.last_state_change_request = null;
        }
    }

    send_request(state) {
        if(!this.is_xhr_in_progress) {
            this.xhr.abort();
            this.xhr.open('GET', '/'+this.get_state_querystring(state), true);
            this.is_xhr_in_progress = true;
            this.xhr.send();
        } else {
            this.last_state_change_request = state;
        }

    }

    get_state_querystring(state) {
        var query = '?';
        query += 't='+this.get_normalized_value(state.left_horizontal);
        query += '&y='+this.get_normalized_value(state.left_vertical);
        query += '&p='+this.get_normalized_value(state.right_horizontal);
        query += '&r='+this.get_normalized_value(state.right_vertical);
        return query;
    }

    /**
     * 25 === full off, 90 === middle on, 155 === full on
     */
    get_normalized_value(value) {
        var normalized = this.config.control_range * (value / 100);
        return Number.parseInt( normalized ) + this.config.control_range_offset;
    }
}
