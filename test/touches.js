import Touches from '../src/js/class/Touches';
import assert from 'assert';

describe('Touches', function() {
    var events = [];
    var touch_event_normal = {
      preventDefault: function(){},
      changedTouches: [{
          pageX: 10,
          pageY: 10,
          target: {id: 1}
      },
      {
          pageX: 20,
          pageY: 20,
          target: {id: 2}
      }]
    };
    var touch_event_over = {
      preventDefault: function(){},
      changedTouches: [{
          pageX: 5000,
          pageY: 5000,
          target: {id: 1}
      },
      {
          pageX: 5000,
          pageY: 5000,
          target: {id: 2}
      }]
    };
    var touch_event_below = {
      preventDefault: function(){},
      changedTouches: [{
          pageX: -100,
          pageY: -100,
          target: {id: 1}
      },
      {
          pageX: -200,
          pageY: -200,
          target: {id: 2}
      }]
    };
    var listener = function(event_name, event){
        events.push({
            'name': event_name,
            'event': event
        });
    };
    var printer = {
        get_canvas_objects: function(){
            return {
                lc: {
                    addEventListener: listener,
                    offsetLeft: 0,
                    offsetTop: 0,
                    width: 100,
                    height: 100,
                    id: 1
                },
                rc: {
                    addEventListener: listener,
                    offsetLeft: 0,
                    offsetTop: 0,
                    width: 100,
                    height: 100,
                    id: 2
                }
            };
        },
        get_control_point_size: function(){
            return 10;
        },
        draw_control_point: function(){}
    };
    var touches = new Touches(printer);

    it('should be constructed', function() {
      assert.equal(Object.prototype.toString(touches), '[object Object]');
    });

    it('should add touch listeners to page', function() {
      assert.equal(touches.add_listeners(),  undefined);
    });

    it('should process events', function() {
      events.forEach(function(event){
          event.event(touch_event_normal);
      });
    });

    it('should process events over limits', function() {
      events.forEach(function(event){
          event.event(touch_event_over);
      });
    });

    it('should process events below limits', function() {
      events.forEach(function(event){
          event.event(touch_event_below);
      });
    });
});