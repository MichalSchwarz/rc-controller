import Controller_printer from '../src/js/class/Controller_printer';
import config from '../app_config.json';
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
            printer = new Controller_printer(window.document, config);
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

    it('should print canvas to page', function() {
        assert.equal(printer.print(), undefined);
    });

    it('should return control_point_size', function() {
        assert.equal(printer.get_control_point_size(), config.control_point_size);
    });

    it('should return switch_arming_object', function() {
        assert.equal(Object.prototype.toString(printer.get_switch_arming_object()), '[object Object]');
    });

    it('should to detect if controlls is present in page', function() {
        assert.equal(printer.is_controls_in_page(), true);
    });

    it('should get canvas objects', function() {
        assert.equal(Object.prototype.toString(printer.get_canvas_objects()), '[object Object]');
    });

    it('should be able draw controll point', function() {
        var canvas = printer.get_canvas_objects()[config.lc_id];
        assert.equal(printer.draw_control_point({x: 10, y: 10}, canvas), undefined);
    });

    it('should throw error if input not exists', function() {
        var window = (new jsdom.JSDOM()).window;
        var printer = new Controller_printer(window.document, config);
        assert.throws(
        function ()
        {
            printer.get_switch_arming_object();
        });
    });
});