// @flow

import Controller_printer from "./Controller_printer";
import State from "./State";
import Communicator from "./Communicator";

export default class Touches {

    printer: Controller_printer;
    state: State;
    listener: ?Communicator;
    config: Object;

    constructor(printer: Controller_printer, config: Object, state: State) {
        this.printer = printer;
        this.state = state;
        this.listener = null;
        this.config = config;
    }

    add_listeners() {
        var id;
        var canvas_objects = this.printer.get_canvas_objects();
        for (id in canvas_objects ) {
            this.add_touchstart(canvas_objects[id]);
            this.add_touchmove(canvas_objects[id]);
            this.add_touchend(canvas_objects[id]);
        }
        this.add_switch_arming_change(this.printer.get_switch_arming_object());
    }

    add_switch_arming_change(switch_arming: HTMLInputElement) {
        var that = this;
        switch_arming.addEventListener("change", function (e) {
            e.preventDefault();
            that.state.switch_arming = this.checked ? that.config.switch_on_value : that.config.switch_off_value;
            if(that.listener instanceof Communicator) {
                that.listener.set_state_changed(that.state);
            }
        }, false);
    }

    add_touchstart(canvas: HTMLCanvasElement) {
        var that = this;
        canvas.addEventListener("touchstart", function (e: TouchEvent) {
            e.preventDefault();
            var touch = that.get_touch_for_canvas(canvas, e.changedTouches);
            var display_coords = that.get_touch_coords(canvas, touch);
            var real_coords = that.get_real_coords(canvas, touch);
            that.process_state_change(real_coords, canvas);
            that.printer.draw_control_point(display_coords, canvas);
        }, false);
    }

    add_touchmove(canvas: HTMLCanvasElement) {
        var that = this;
        canvas.addEventListener("touchmove", function (e: TouchEvent) {
            e.preventDefault();
            var touch = that.get_touch_for_canvas(canvas, e.changedTouches);
            var display_coords = that.get_touch_coords(canvas, touch);
            var real_coords = that.get_real_coords(canvas, touch);
            that.process_state_change(real_coords, canvas);
            that.printer.draw_control_point(display_coords, canvas);
        }, false);
    }

    add_touchend(canvas: HTMLCanvasElement) {
        var that = this;
        canvas.addEventListener("touchend", function (e: TouchEvent) {
            e.preventDefault();
            var touch = that.get_touch_for_canvas(canvas, e.changedTouches);
            var display_coords = that.get_touch_coords(canvas, touch);
            var real_coords = that.get_real_coords(canvas, touch);
            display_coords.x = that.config.axis_size/2;
            real_coords.x = that.config.axis_size/2;
            if(canvas.id === that.config.rc_id)
            {
                display_coords.y = that.config.axis_size/2;
                real_coords.y = that.config.axis_size/2;
            }
            that.process_state_change(real_coords, canvas);
            that.printer.draw_control_point(display_coords, canvas);
        }, false);
    }

    set_state_listener(listener: Communicator) {
        this.listener = listener;
    }

    process_state_change(real_coords: Object, canvas: HTMLCanvasElement) {
        var canvas_width = Number.parseInt(canvas.width.toString());
        var canvas_height = Number.parseInt(canvas.height.toString());
        var real_x = 100 * Number.parseInt(real_coords.x);
        var real_y = 100 * Number.parseInt(real_coords.y);
        if(canvas.id === this.config.lc_id) {
            this.state.left_horizontal = Math.round(real_x / canvas_width);
            this.state.left_vertical = 100 - Math.round(real_y / canvas_height);
        } else {
            this.state.right_horizontal = Math.round( real_x / canvas_width );
            this.state.right_vertical = 100 - Math.round( real_y / canvas_height );
        }
        this.call_listener(this.state);
    }

    call_listener(state: State) {
        if(this.listener instanceof Communicator) {
            this.listener.set_state_changed(state);
        }
    }

    get_touch_for_canvas(canvas: HTMLCanvasElement, touches: TouchList) {
        var result = touches[0];
        var i;
        for (i = 1; i < touches.length; i = i + 1) {
            if (touches[i].target instanceof HTMLElement && canvas.id === touches[i].target.id) {
                result = touches[i];
                break;
            }
        }
        return result;
    }

    get_touch_coords(canvas: HTMLCanvasElement, touch: Touch) {
        var result = {
            x: touch.pageX - canvas.offsetLeft,
            y: touch.pageY - canvas.offsetTop
        };
        return this.get_coords_in_limits(canvas, result);
    }

    get_real_coords(canvas: HTMLCanvasElement, touch: Touch) {
        var result = {
            x: touch.pageX - canvas.offsetLeft,
            y: touch.pageY - canvas.offsetTop
        };
        return this.get_real_coords_in_limits(canvas, result);
    }

    get_coords_in_limits(canvas: HTMLCanvasElement, coords: Object) {
        var coordinate;
        for (coordinate in coords) {
            coords = this.get_coord_in_limits(canvas, coords, coordinate);
        }
        return coords;
    }

    get_real_coords_in_limits(canvas: HTMLCanvasElement, coords: Object) {
        var coordinate;
        for (coordinate in coords) {
            coords = this.get_real_coord_in_limits(canvas, coords, coordinate);
        }
        return coords;
    }

    get_real_coord_in_limits(canvas: HTMLCanvasElement, coords: Object, coordinate: string) {
        var dimensions = {
            x: 'width',
            y: 'height'
        };
        var dimension = dimensions[coordinate];
        // $FlowFixMe canvas.width || canvas.height
        var canvas_dimension = canvas[dimension];
        if (coords[coordinate] < 0) {
            coords[coordinate] = 0;
        } else if (coords[coordinate] > canvas_dimension) {
            coords[coordinate] = canvas_dimension;
        }
        return coords;
    }

    get_coord_in_limits(canvas: HTMLCanvasElement, coords: Object, coordinate: string) {
        var dimensions = {
            x: 'width',
            y: 'height'
        };
        var boundary = this.printer.get_control_point_size() / 2;
        var dimension = dimensions[coordinate];
        // $FlowFixMe canvas.width || canvas.height
        var canvas_dimension = canvas[dimension];
        if (coords[coordinate] < boundary) {
            coords[coordinate] = boundary;
        } else if (coords[coordinate] > (canvas_dimension - boundary)) {
            coords[coordinate] = canvas_dimension - boundary;
        }
        return coords;
    }
}
