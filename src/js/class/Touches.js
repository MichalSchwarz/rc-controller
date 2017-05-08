export default class Touches {
    constructor(printer, config) {
        this.printer = printer;
        this.state = null;
        this.listener = null;
        this.config = config;
    }

    add_listeners() {
        var id;
        var canvas_objects = this.printer.get_canvas_objects();
        for (id in canvas_objects ) {
            this.add_touchstart(canvas_objects[id]);
            this.add_touchmove(canvas_objects[id]);
        }
    }

    add_touchstart(canvas) {
        var that = this;
        canvas.addEventListener("touchstart", function (e) {
            e.preventDefault();
            var touch = that.get_touch_for_canvas(canvas, e.changedTouches);
            var display_coords = that.get_touch_coords(canvas, touch);
            var real_coords = that.get_real_coords(canvas, touch);
            that.process_state_change(real_coords, canvas);
            that.printer.draw_control_point(display_coords, canvas);
        }, false);
    }

    add_touchmove(canvas) {
        var that = this;
        canvas.addEventListener("touchmove", function (e) {
            e.preventDefault();
            var touch = that.get_touch_for_canvas(canvas, e.changedTouches);
            var display_coords = that.get_touch_coords(canvas, touch);
            var real_coords = that.get_real_coords(canvas, touch);
            that.process_state_change(real_coords, canvas);
            that.printer.draw_control_point(display_coords, canvas);
        }, false);
    }

    set_state_listener(listener, state) {
        this.state = state;
        this.listener = listener;
    }

    process_state_change(real_coords, canvas) {
        if(this.state !== null) {
            if(canvas.id === this.config.lc_id) {
                this.state.left_horizontal
                        = Number.parseInt( 100 * real_coords.x / canvas.width );
                this.state.left_vertical = 100 -
                        Number.parseInt( 100 * real_coords.y / canvas.height );
            }
            else if(canvas.id === this.config.rc_id) {
                this.state.right_horizontal
                        = Number.parseInt( 100 * real_coords.x / canvas.width );
                this.state.right_vertical = 100 -
                        Number.parseInt( 100 * real_coords.y / canvas.height );
            }
        }
        this.call_listener(this.state);
    }

    call_listener(state) {
        if(this.listener !== null) {
            this.listener.set_state_changed(state);
        }
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

    get_real_coords(canvas, touch) {
        var result = {
            x: touch.pageX - canvas.offsetLeft,
            y: touch.pageY - canvas.offsetTop
        };
        return this.get_real_coords_in_limits(canvas, result);
    }

    get_coords_in_limits(canvas, coords) {
        var coordinate;
        for (coordinate in coords) {
            coords = this.get_coord_in_limits(canvas, coords, coordinate);
        }
        return coords;
    }

    get_real_coords_in_limits(canvas, coords) {
        var coordinate;
        for (coordinate in coords) {
            coords = this.get_real_coord_in_limits(canvas, coords, coordinate);
        }
        return coords;
    }

    get_real_coord_in_limits(canvas, coords, coordinate) {
        var dimensions = {
            x: 'width',
            y: 'height'
        };
        if (coords[coordinate] < 0) {
            coords[coordinate] = 0;
        } else if (coords[coordinate] > canvas[dimensions[coordinate]]) {
            coords[coordinate] = canvas[dimensions[coordinate]];
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
