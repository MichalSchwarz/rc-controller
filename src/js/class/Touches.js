// @flow

import Controller_printer from "./Controller_printer";
import State from "./State";
import Communicator from "./Communicator";
import config from '../config';
import Coords from "./Coords";

export default class Touches {

    printer: Controller_printer;
    state: State;
    listener: ?Communicator;

    constructor(printer: Controller_printer, state: State) {
        this.printer = printer;
        this.state = state;
        this.listener = null;
    }

    add_listeners() {
        this.add_touchstart(this.printer.get_right_canvas());
        this.add_touchstart(this.printer.get_left_canvas());
        this.add_touchmove(this.printer.get_right_canvas());
        this.add_touchmove(this.printer.get_left_canvas());
        this.add_touchend(this.printer.get_right_canvas());
        this.add_touchend(this.printer.get_left_canvas());
        this.add_switch_arming_change(this.printer.get_switch_arming_object());
    }

    add_switch_arming_change(switch_arming: HTMLInputElement) {
        var that = this;
        switch_arming.addEventListener("change", function (e) {
            e.preventDefault();
            that.state.switch_arming = switch_arming.checked ? config.switch_on_value : config.switch_off_value;
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
            display_coords.x = config.axis_size/2;
            real_coords.x = config.axis_size/2;
            if(canvas.id === config.rc_id)
            {
                display_coords.y = config.axis_size/2;
                real_coords.y = config.axis_size/2;
            }
            that.process_state_change(real_coords, canvas);
            that.printer.draw_control_point(display_coords, canvas);
        }, false);
    }

    set_state_listener(listener: Communicator) {
        this.listener = listener;
    }

    process_state_change(real_coords: Coords, canvas: HTMLCanvasElement) {
        var canvas_width = Number.parseInt(canvas.width.toString());
        var canvas_height = Number.parseInt(canvas.height.toString());
        var real_x = 100 * real_coords.x;
        var real_y = 100 * real_coords.y;
        if(canvas.id === config.lc_id) {
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

    get_touch_coords(canvas: HTMLCanvasElement, touch: Touch): Coords {
        var result = new Coords();
        result.x = touch.pageX - canvas.offsetLeft;
        result.y = touch.pageY - canvas.offsetTop;
        return this.get_coords_in_limits(canvas, result);
    }

    get_real_coords(canvas: HTMLCanvasElement, touch: Touch): Coords {
        var result = new Coords();
        result.x = touch.pageX - canvas.offsetLeft;
        result.y = touch.pageY - canvas.offsetTop;
        return this.get_real_coords_in_limits(canvas, result);
    }

    get_coords_in_limits(canvas: HTMLCanvasElement, coords: Coords) {
        var coordinate;
        for (coordinate in coords) {
            coords = this.get_coord_in_limits(canvas, coords, coordinate);
        }
        return coords;
    }

    get_real_coords_in_limits(canvas: HTMLCanvasElement, coords: Coords) {
        if (coords.x < 0) {
            coords.x = 0;
        } else if (coords.x > canvas.width) {
            coords.x = canvas.width;
        }
        if (coords.y < 0) {
            coords.y = 0;
        } else if (coords.y > canvas.height) {
            coords.y = canvas.height;
        }
        return coords;
    }

    get_coord_in_limits(canvas: HTMLCanvasElement, coords: Coords, coordinate: string) {
        var boundary = this.printer.get_control_point_size() / 2;
        if (coords.x < boundary) {
            coords.x = boundary;
        } else if (coords.x > (canvas.width - boundary)) {
            coords.x = canvas.width - boundary;
        }
        if (coords.y < boundary) {
            coords.y = boundary;
        } else if (coords.y > (canvas.height - boundary)) {
            coords.y = canvas.height - boundary;
        }
        return coords;
    }
}
