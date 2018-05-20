import Controller_printer from '../src/js/class/Controller_printer';
import config from '../app_config.json';
import assert from 'assert';

describe('Controller_printer', function() {
    var getElementFalse = function(){ return false; };
    var getElementCanvas = function(){ return {}; };
    var createElement = function (){
        document.getElementById = getElementCanvas;
        return {
            appendChild: getElementCanvas,
            getContext: function(){
                return {
                    clearRect: function(){},
                    fillRect: function(){}
                };
            }
        };
    };
    var document = {
        getElementById: getElementFalse,
        createElement: createElement,
        body: {appendChild: getElementCanvas}
    };
    var printer = new Controller_printer(document, config);

    it('should be constructed', function() {
      assert.equal(Object.prototype.toString(printer), '[object Object]');
    });

    it('should throw error while calling premature get_canvas request', function() {
        assert.throws(
        function ()
        {
            printer.get_canvas_objects();
        });
    });

    it('should print canvas to page', function() {
        assert.equal(printer.print(), undefined);
    });

    it('should return control_point_size', function() {
        assert.equal(printer.get_control_point_size(), config.control_point_size);
    });

    it('should return switch_arming_object', function() {
        assert.equal(printer.get_switch_arming_object(), '[object Object]');
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
});