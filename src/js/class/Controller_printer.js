// @flow

import config from '../config';
import Coords from '../class/Coords';
export default class Controller_printer {
    document: Document;
    body: HTMLBodyElement;
    rightCanvas: HTMLCanvasElement;
    leftCanvas: HTMLCanvasElement;

    constructor(document: Document) {
        this.document = document;
        if(! (this.document.body instanceof HTMLBodyElement)) {
            throw 'body is not HTMLBodyElement';
        }
        this.body = this.document.body;
        this.print();
    }

    print() {
        this.append_controls_to_page();
        this.rightCanvas.width = config.axis_size;
        this.rightCanvas.height = config.axis_size;
        this.leftCanvas.width = config.axis_size;
        this.leftCanvas.height = config.axis_size;
    }

    get_control_point_size() {
        return config.control_point_size;
    }

    get_right_canvas() {
      return this.rightCanvas;
    }

    get_left_canvas() {
      return this.leftCanvas;
    }

    get_switch_arming_object(): HTMLInputElement {
        var result = this.document.getElementById(config.switch_arming_id);
        if(!(result instanceof HTMLInputElement)) {
            throw "Cannot find arming_switch";
        }
        return result;
    }

    append_controls_to_page() {
        var controls = this.document.createElement('div');
        controls.id = config.controls_id;
        this.create_canvas_objects(this.document);
        controls.appendChild(this.leftCanvas);
        controls.appendChild(this.rightCanvas);
        this.body.appendChild(controls);
    }

    create_canvas_objects(document: Document) {
      this.rightCanvas =  document.createElement('canvas');
      this.leftCanvas =  document.createElement('canvas');
      this.leftCanvas.id = config.lc_id;
      this.rightCanvas.id = config.rc_id;
    }

    draw_control_point(coords: Coords, canvas: HTMLCanvasElement) {
        var context = canvas.getContext("2d");
        this.clear_canvas(canvas);
        context.fillStyle = config.control_point_style;
        context.fillRect(coords.x - this.get_control_point_size() / 2,
            coords.y - this.get_control_point_size() / 2,
            this.get_control_point_size(),
            this.get_control_point_size());
    }

    clear_canvas(canvas: HTMLCanvasElement) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = config.axis_style;
        context.fillRect(config.axis_size / 2, 0, 1, canvas.height);
        context.fillRect(0, config.axis_size / 2, canvas.width, 1);
    }
}
