import Touches from '../src/js/class/Touches';
import Communicator from '../src/js/class/Communicator'
import Controller_printer from '../src/js/class/Controller_printer';
import State from '../src/js/class/State';
import config from '../src/js/config';
import assert from 'assert';
const fs = require('fs');
const jsdom = require("jsdom");

describe('Touches', function () {
    var printer: Controller_printer;
    var window: Window;
    var touches: Touches;
    var state: State;
    var events: Array<Object>;
    var touch_event_normal: Object;
    var touch_event_over: Object;
    var touch_event_below: Object;
    var communicator: Communicator;
    var listener = function (event_name, event) {
        events.push({
            'name': event_name,
            'event': event
        });
    };

    before(function (done) {
        var htmlContent = '';
        fs.readFile('src/html/index.html', 'utf8', function (err, fileContents) {
            if (err) throw err;
            var dom = new jsdom.JSDOM(fileContents);
            window = dom.window;
            global.HTMLElement = window.HTMLElement;
            global.HTMLInputElement = window.HTMLInputElement;
            global.HTMLBodyElement = window.HTMLBodyElement;
            printer = new Controller_printer(window.document);
            events = [];
            state = new State();
            touches = new Touches(printer, config, state);
            printer.get_switch_arming_object().addEventListener = listener;
            printer.leftCanvas.addEventListener = listener;
            printer.rightCanvas.addEventListener = listener;
            touch_event_normal = {
                preventDefault: function () { },
                changedTouches: [{
                    pageX: 10,
                    pageY: 10,
                    target: printer.leftCanvas
                },
                {
                    pageX: 20,
                    pageY: 20,
                    target: printer.rightCanvas
                }]
            };
            touch_event_over = {
                preventDefault: function () { },
                changedTouches: [{
                    pageX: 5000,
                    pageY: 5000,
                    target: printer.leftCanvas
                },
                {
                    pageX: 5000,
                    pageY: 5000,
                    target: printer.rightCanvas
                }]
            };
            touch_event_below = {
                preventDefault: function () { },
                changedTouches: [{
                    pageX: -100,
                    pageY: -100,
                    target: printer.leftCanvas
                },
                {
                    pageX: -200,
                    pageY: -200,
                    target: printer.rightCanvas
                }]
            };
            communicator = new Communicator(window);
            done();
        });
    });

    it('should be constructed', function () {
        assert.equal(Object.prototype.toString(touches), '[object Object]');
    });

    it('should add touch listeners to page', function () {
        assert.equal(touches.add_listeners(), undefined);
    });

    it('should process events without state listener', function () {
        events.forEach(function (event) {
            event.event(touch_event_normal);
        });
    });

    it('should be able to set state listener', function () {
        assert.equal(touches.set_state_listener(communicator), undefined);
    });

    it('should process events', function () {
        events.forEach(function (event) {
            event.event(touch_event_normal);
        });
    });

    it('should process events over limits', function () {
        events.forEach(function (event) {
            event.event(touch_event_over);
        });
    });

    it('should process events below limits', function () {
        events.forEach(function (event) {
            event.event(touch_event_below);
        });
    });

    it('should process arming click', function () {
        events.forEach(function (event) {
            printer.get_switch_arming_object().checked = true;
            event.event(touch_event_normal);
            printer.get_switch_arming_object().checked = false;
            event.event(touch_event_normal);
        });
    });
});