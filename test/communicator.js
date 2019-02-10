import Communicator from '../src/js/class/Communicator';
import State from '../src/js/class/State';
import assert from 'assert';
import config from '../src/js/config';
const fs = require('fs');
const jsdom = require("jsdom");

describe('Communicator', function() {
    var window: window;
    var communicator: Communicator;
    var state: State;
    var intervalFn: Function;
    var lastSent: Uint16Array;

    before(function(done) {
        var htmlContent = '';
        fs.readFile('src/html/index.html', 'utf8', function(err, fileContents) {
            if (err) throw err;
            var dom = new jsdom.JSDOM(fileContents);
            window = dom.window;
            global.HTMLElement = window.HTMLElement;
            global.HTMLInputElement = window.HTMLInputElement;
            global.HTMLBodyElement = window.HTMLBodyElement;
            global.WebSocket = window.WebSocket;
            global.setInterval = function (callback) {
              intervalFn = callback;
            };
            state = new State();
            communicator = new Communicator(window);
            assert.equal(intervalFn(), undefined);
            var evt = new window.Event("open", {"bubbles":true});
            communicator.socket.send = function (result) {
              lastSent = result;
            };
            communicator.socket.dispatchEvent(evt);
            done();
        });
    });

    it('should be constructed', function() {
      assert.equal(Object.prototype.toString(communicator), '[object Object]');
    });

    it('should accept state changes', function() {
      var message = new Uint16Array(14);
      for (let index = 0; index < message.length; index++) {
        message[index] = 1500;
      }
      message[2] = 1000;
      message[4] = 1000;
      communicator.set_state_changed(state);
      assert.deepStrictEqual(lastSent, message);
      var state2 = new State();
      state2.left_vertical = 120;
      state2.left_horizontal = 121;
      state2.right_horizontal = 122;
      state2.right_vertical = 123;
      state2.switch_arming = 1000;
      communicator.set_state_changed(state2);
      message[0] = 1122;
      message[1] = 1123;
      message[2] = 1120;
      message[3] = 1121;
      message[4] = 2000;
      assert.deepStrictEqual(lastSent, message);
    });

    it('should send keep alive', function() {
      var message = new Uint16Array(14);
      for (let index = 0; index < message.length; index++) {
        message[index] = 1500;
      }
      message[2] = 1000;
      message[4] = 1000;
      communicator.set_state_changed(state);
      intervalFn();
      assert.deepStrictEqual(lastSent, message);
    });

    after(function (done) {
      communicator.socket.close();
      done();
  });
});