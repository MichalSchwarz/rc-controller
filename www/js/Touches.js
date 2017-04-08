/*jslint browser:true */
'use strict';
function Touches(canvas_objects, printer) {
    this.canvas_objects = canvas_objects;
    this.printer = printer;
    this.add_listeners = function () {
        var id;
        for (id in this.canvas_objects ) {
            if (this.canvas_objects.hasOwnProperty(id)) {
                this.add_touchstart(this.canvas_objects[id]);
                this.add_touchmove(this.canvas_objects[id]);
            }
        }
    };

    this.add_touchstart = function (canvas) {
        var that = this;
        canvas.addEventListener("touchstart", function (e) {
            e.preventDefault();
            var touch = that.get_touch_for_canvas(canvas, e.changedTouches);
            var coords = that.get_touch_coords(canvas, touch);
            that.printer.draw_control_point(coords, canvas);
        }, false);
    };

    this.add_touchmove = function (canvas) {
        var that = this;
        canvas.addEventListener("touchmove", function (e) {
            e.preventDefault();
            var touch = that.get_touch_for_canvas(canvas, e.changedTouches);
            var coords = that.get_touch_coords(canvas, touch);
            that.printer.draw_control_point(coords, canvas);
        }, false);
    };

    this.get_touch_for_canvas = function (canvas, touches) {
        var result = touches[0];
        var i;
        for (i = 1; i < touches.length; i = i + 1) {
            if (canvas.id === touches[i].target.id) {
                result = touches[i];
                break;
            }
        }
        return result;
    };

    this.get_touch_coords = function (canvas, touch) {
        var result = {
            x: touch.pageX - canvas.offsetLeft,
            y: touch.pageY - canvas.offsetTop
        };
        return this.get_coords_in_limits(canvas, result);
    };

    this.get_coords_in_limits = function (canvas, coords) {
        var coordinate;
        for (coordinate in coords) {
            if (coords.hasOwnProperty(coordinate)) {
                coords = this.get_coord_in_limits(canvas, coords, coordinate);
            }
        }
        return coords;
    };

    this.get_coord_in_limits = function (canvas, coords, coordinate) {
        var dimensions = {
            x: 'width',
            y: 'height'
        };
        var boundary = this.printer.control_point_size / 2;
        if (coords[coordinate] < boundary) {
            coords[coordinate] = boundary;
        } else if (coords[coordinate] > (canvas[dimensions[coordinate]] - boundary)) {
            coords[coordinate] = canvas[dimensions[coordinate]] - boundary;
        }
        return coords;
    };
}
