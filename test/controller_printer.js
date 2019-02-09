import Controller_printer from '../src/js/class/Controller_printer';
import config from '../src/js/config';
import assert from 'assert';
const fs = require('fs');
const jsdom = require("jsdom");


describe('Controller_printer', function() {
    var printer;
    var window;

    before(function(done) {
        var htmlContent = '';
        fs.readFile('src/html/index.html', 'utf8', function(err, fileContents) {
            if (err) throw err;
            window = (new jsdom.JSDOM(fileContents)).window;
            global.HTMLElement = window.HTMLElement;
            global.HTMLInputElement = window.HTMLInputElement;
            global.HTMLBodyElement = window.HTMLBodyElement;
            printer = new Controller_printer(window.document);
            done();
        });
    });


    it('should be constructed', function() {
        assert.equal(Object.prototype.toString(printer), '[object Object]');
    });

    it('should throw error while calling premature get_canvas request', function() {
        var window = (new jsdom.JSDOM()).window;
        var printer = new Controller_printer(window.document, config);
        assert.throws(
        function ()
        {
            printer.get_canvas_objects();
        });
    });

    it('should throw error if body is not present', function() {
        assert.throws(
        function ()
        {
            new Controller_printer({}, config);
        });
    });

    it('should return control_point_size', function() {
        assert.equal(printer.get_control_point_size(), config.control_point_size);
    });

    it('should return switch_arming_object', function() {
        assert.equal(Object.prototype.toString(printer.get_switch_arming_object()), '[object Object]');
    });

    it('should throw error if input not exists', function() {
        var window = (new jsdom.JSDOM()).window;
        var printer = new Controller_printer(window.document);
        assert.throws(
        function ()
        {
            printer.get_switch_arming_object();
        });
    });
});