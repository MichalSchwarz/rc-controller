/* globals document */
import Controller_printer from './class/Controller_printer';
import Touches from './class/Touches';
import config from '../../app_config.json';

var printer = new Controller_printer(document, config);
var touches = new Touches(printer);
printer.print();
touches.add_listeners();
