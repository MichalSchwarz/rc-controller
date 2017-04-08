/*jslint browser:true */
'use strict';
function Controller_printer(document, canvas_objects) {
    this.axis_size = 180;
    this.control_point_size = 10;
    this.control_point_style = 'black';
    this.axis_style = 'gay';
    this.document = document;
    this.canvas_objects = canvas_objects;

    this.init_controllers = function () {
        var id, canvas;
        for (id in this.canvas_objects ) {
            if (this.canvas_objects.hasOwnProperty(id)) {
                canvas = canvas_objects[id];
                canvas.width = this.axis_size;
                canvas.height = this.axis_size;
                this.clear_canvas(canvas);
            }
        }
    };
    this.draw_control_point = function (coords, canvas) {
        var context = canvas.getContext("2d");
        this.clear_canvas(canvas);
        context.fillStyle = this.control_point_style;
        context.fillRect(coords.x - this.control_point_size / 2,
            coords.y - this.control_point_size / 2,
            this.control_point_size,
            this.control_point_size);
    };
    this.clear_canvas = function (canvas) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = this.axis_style;
        context.fillRect(this.axis_size / 2, 0, 1, canvas.height);
        context.fillRect(0, this.axis_size / 2, canvas.width, 1);
    };
}
