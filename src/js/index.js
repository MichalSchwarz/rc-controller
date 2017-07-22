/* globals document */
import Controller_printer from './class/Controller_printer';
import Touches from './class/Touches';
import State from './class/State';
import Communicator from './class/Communicator';
import config from '../../app_config.json';

var printer = new Controller_printer(document, config);
var state = new State();
var touches = new Touches(printer, config, state);
var xhr = new XMLHttpRequest();
var communicator = new Communicator(config, xhr);
printer.print();
var controllers = printer.get_canvas_objects();
for (var id in controllers ) {
    printer.clear_canvas(controllers[id]);
    var y_position = config.axis_size/2;
    if(id === config.lc_id)
    {
        y_position = config.axis_size-(config.control_point_size/2);
    }
    printer.draw_control_point({x:config.axis_size/2, y:y_position},
        controllers[id]);
}
touches.set_state_listener(communicator);
touches.add_listeners();
