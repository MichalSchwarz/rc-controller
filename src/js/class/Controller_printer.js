export default class Controller_printer {
    constructor(document, config) {
        this.config = config;
        this.document = document;
        this.canvas_objects = null;
    }

    print() {
        var id, canvas;
        if(!this.is_controls_in_page())
        {
            this.append_controls_to_page();
        }
        for (id in this.canvas_objects ) {
            if (this.canvas_objects.hasOwnProperty(id)) {
                canvas = this.canvas_objects[id];
                canvas.width = this.config.axis_size;
                canvas.height = this.config.axis_size;
                this.clear_canvas(canvas);
            }
        }
    }

    get_control_point_size() {
        return this.config.control_point_size;
    }

    get_canvas_objects() {
      if(!this.is_controls_in_page())
      {
          throw 'Chces canvas, ale oni jeste nejsou na strance';
      }
      return this.canvas_objects;
    }

    append_controls_to_page() {
        var controls = this.document.createElement('div');
        controls.id = this.config.controls_id;
        this.canvas_objects = this.create_canvas_objects(this.document);
        controls.appendChild(this.canvas_objects[this.config.lc_id]);
        controls.appendChild(this.canvas_objects[this.config.rc_id]);
        this.document.body.appendChild(controls);
    }

    is_controls_in_page() {
        var result = false;
        if(this.document.getElementById([this.config.controls_id]))
        {
            result = true;
        }
        return result;
    }

    create_canvas_objects(document) {
      var canvas_objects = {};
      canvas_objects[this.config.lc_id] =  document.createElement('canvas');
      canvas_objects[this.config.rc_id] =  document.createElement('canvas');
      canvas_objects[this.config.lc_id].id = this.config.lc_id;
      canvas_objects[this.config.rc_id].id = this.config.rc_id;
      return canvas_objects;
    }

    draw_control_point(coords, canvas) {
        var context = canvas.getContext("2d");
        this.clear_canvas(canvas);
        context.fillStyle = this.config.control_point_style;
        context.fillRect(coords.x - this.get_control_point_size() / 2,
            coords.y - this.get_control_point_size() / 2,
            this.get_control_point_size(),
            this.get_control_point_size());
    }

    clear_canvas(canvas) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = this.config.axis_style;
        context.fillRect(this.config.axis_size / 2, 0, 1, canvas.height);
        context.fillRect(0, this.config.axis_size / 2, canvas.width, 1);
    }
}
