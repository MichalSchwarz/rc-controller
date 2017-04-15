import Controller_printer from '../src/js/class/Controller_printer';
import config from '../app_config.json';
import { mocks } from 'mock-browser'
import assert from 'assert';

describe('Controller_printer', function() {
    var mock_browser = new mocks.MockBrowser();
    var printer = new Controller_printer(mock_browser.getDocument(), config);

    it('should be constructed', function() {
      assert.equal(Object.prototype.toString(printer), '[object Object]');
    });
});