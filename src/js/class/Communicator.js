export default class Communicator {
    constructor(config) {
        this.actual_state = null;
        this.config = config;
        this.is_sending_needed = true;
        this.xhr = new XMLHttpRequest();
    }

    set_state_changed(state) {
        this.actual_state = state;
        this.send_request(state);
    }

    send_request(state) {
        if(this.is_sending_needed) {
            this.xhr.abort();
            this.xhr.open('GET', '/'+this.get_state_querystring(state), true);
            this.xhr.send();
            this.set_sending_filter();
        }
    }

    get_state_querystring(state) {
        var query = '?';
        query += 't='+this.get_normalized_value(state.left_horizontal);
        query += '&p='+this.get_normalized_value(state.left_vertical);
        query += '&r='+this.get_normalized_value(state.right_horizontal);
        query += '&s='+this.get_normalized_value(state.right_vertical);
        return query;
    }

    get_normalized_value(value) {
        return Number.parseInt( 180 * (value / 100) );
    }

    set_sending_filter() {
        this.is_sending_needed = false;
        var that = this;
        setTimeout(function(){
            that.is_sending_needed = true;
        }, this.config.xhr_filter);
    }


}
