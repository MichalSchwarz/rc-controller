export default class Touches {
    constructor(printer) {
        this.printer = printer;
    }

    add_listeners() {
        var id;
        var canvas_objects = this.printer.get_canvas_objects();
        for (id in canvas_objects ) {
            if (canvas_objects.hasOwnProperty(id)) {
                this.add_touchstart(canvas_objects[id]);
                this.add_touchmove(canvas_objects[id]);
            }
        }
    }

    add_touchstart(canvas) {
        var that = this;
        canvas.addEventListener("touchstart", function (e) {
            e.preventDefault();
            var touch = that.get_touch_for_canvas(canvas, e.changedTouches);
            var coords = that.get_touch_coords(canvas, touch);
            that.printer.draw_control_point(coords, canvas);
        }, false);
    }

    add_touchmove(canvas) {
        var that = this;
        canvas.addEventListener("touchmove", function (e) {
            e.preventDefault();
            var touch = that.get_touch_for_canvas(canvas, e.changedTouches);
            var coords = that.get_touch_coords(canvas, touch);
            that.printer.draw_control_point(coords, canvas);
        }, false);
    }

    get_touch_for_canvas(canvas, touches) {
        var result = touches[0];
        var i;
        for (i = 1; i < touches.length; i = i + 1) {
            if (canvas.id === touches[i].target.id) {
                result = touches[i];
                break;
            }
        }
        return result;
    }

    get_touch_coords(canvas, touch) {
        var result = {
            x: touch.pageX - canvas.offsetLeft,
            y: touch.pageY - canvas.offsetTop
        };
        return this.get_coords_in_limits(canvas, result);
    }

    get_coords_in_limits(canvas, coords) {
        var coordinate;
        for (coordinate in coords) {
            if (coords.hasOwnProperty(coordinate)) {
                coords = this.get_coord_in_limits(canvas, coords, coordinate);
            }
        }
        return coords;
    }

    get_coord_in_limits(canvas, coords, coordinate) {
        var dimensions = {
            x: 'width',
            y: 'height'
        };
        var boundary = this.printer.get_control_point_size() / 2;

        if (coords[coordinate] < boundary) {
            coords[coordinate] = boundary;
        } else if (coords[coordinate] > (canvas[dimensions[coordinate]] - boundary)) {
            coords[coordinate] = canvas[dimensions[coordinate]] - boundary;
        }
        return coords;
    }
}
