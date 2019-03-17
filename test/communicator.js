import Communicator from '../src/js/class/Communicator';
import State from '../src/js/class/State';
import assert from 'assert';
import config from '../src/js/config';
const fs = require('fs');
const jsdom = require("jsdom");

describe('Communicator', function() {
  var events = [];
  var xhr_method = '';
  var xhr_url = '';
  var listener = function(event_name, event){
      events[event_name] = event;
  };
  function xhr() {
      this.addEventListener = listener;
      this.abort = function(){};
      this.open = function(method, url){
          xhr_url = url;
          xhr_method = method;
      };
      this.send = function(){};
  };
  var window: window;
  var communicator: Communicator;
  var state: State;
  var intervalFn: Function;

  before(function(done) {
    var htmlContent = '';
    fs.readFile('src/html/index.html', 'utf8', function(err, fileContents) {
        if (err) throw err;
        var dom = new jsdom.JSDOM(fileContents);
        window = dom.window;
        global.HTMLElement = window.HTMLElement;
        global.XMLHttpRequest = xhr;
        global.HTMLInputElement = window.HTMLInputElement;
        global.HTMLBodyElement = window.HTMLBodyElement;
        global.setInterval = function (callback) {
          intervalFn = callback;
        };
        state = new State();
        communicator = new Communicator(window);
        assert.equal(intervalFn(), undefined);
        done();
    });
});

    it('should be constructed', function() {
      assert.equal(Object.prototype.toString(communicator), '[object Object]');
    });

    it('should accept more state changes before loadend occurs', function() {
      console.log('prase');
      console.log(communicator.set_state_changed(state));
      assert.equal(communicator.set_state_changed(state), undefined);
      assert.equal(communicator.set_state_changed(state), undefined);
      assert.equal(events['loadend'](), undefined);
      assert.equal(events['loadend'](), undefined);
    });

    it('should send correct control string', function() {
      assert.equal(xhr_method, 'GET');
      assert.equal(xhr_url, '/control?0=1500&1=1500&2=1000&3=1500&4=1000');
    });

    it('should process check interval', function() {
      assert.equal(intervalFn(), undefined);
    });

    it('should accept state change and loadend event step by step', function() {
      assert.equal(communicator.set_state_changed(state), undefined);
      assert.equal(events['loadend'](), undefined);
    });
});