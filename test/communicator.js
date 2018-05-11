import Communicator from '../src/js/class/Communicator';
import State from '../src/js/class/State';
import assert from 'assert';
import config from '../app_config.json';

describe('Communicator', function() {
    var events = [];
    var xhr_method = '';
    var xhr_url = '';
    var listener = function(event_name, event){
        events[event_name] = event;
    };
    var xhr = {
        addEventListener: listener,
        abort: function(){},
        open: function(method, url){
            xhr_url = url;
            xhr_method = method;
        },
        send: function(){}
    };
    var state = new State();
    var communicator = new Communicator(config, xhr);

    it('should be constructed', function() {
      assert.equal(Object.prototype.toString(communicator), '[object Object]');
    });

    it('should accept more state changes before loadend occurs', function() {
      assert.equal(communicator.set_state_changed(state), undefined);
      assert.equal(communicator.set_state_changed(state), undefined);
      assert.equal(events['loadend'](), undefined);
      assert.equal(events['loadend'](), undefined);
    });

    it('should send correct control string', function() {
      assert.equal(xhr_method, 'GET');
      assert.equal(xhr_url, '/control?y=0&t=50&p=50&r=50');
    });

    it('should accept state change and loadend event step by step', function() {
      assert.equal(communicator.set_state_changed(state), undefined);
      assert.equal(events['loadend'](), undefined);
    });
});