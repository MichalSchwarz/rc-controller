// @flow
/* globals document */
import Controller_printer from './class/Controller_printer';
import Touches from './class/Touches';
import State from './class/State';
import Communicator from './class/Communicator';
import config from './config';
import Coords from './class/Coords';

var printer = new Controller_printer(document);
var state = new State();
var touches = new Touches(printer, state);
var communicator = new Communicator(window);
printer.clear_canvas(printer.get_left_canvas());
printer.clear_canvas(printer.get_right_canvas());
var rightCoords = new Coords();
var leftCoords = new Coords();
rightCoords.x = config.axis_size/2;
rightCoords.y = config.axis_size/2;
leftCoords.x = config.axis_size/2;
leftCoords.y = config.axis_size-(config.control_point_size/2);
printer.draw_control_point(rightCoords, printer.get_right_canvas());
printer.draw_control_point(leftCoords, printer.get_left_canvas());
touches.set_state_listener(communicator);
touches.add_listeners();
