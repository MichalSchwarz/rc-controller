/* globals document */
import Controller_printer from './class/Controller_printer';
import Touches from './class/Touches';
import State from './class/State';
import Communicator from './class/Communicator';
import config from '../../app_config.json';

var printer = new Controller_printer(document, config);
var touches = new Touches(printer, config);
var state = new State();
var communicator = new Communicator(config);
printer.print();
var controllers = printer.get_canvas_objects();
for (var id in controllers ) {
    printer.clear_canvas(controllers[id]);
    printer.draw_control_point({x:config.axis_size/2, y:config.axis_size/2},
        controllers[id]);
}
touches.set_state_listener(communicator, state);
touches.add_listeners();
