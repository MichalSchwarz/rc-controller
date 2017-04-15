import Touches from '../src/js/class/Touches';
import assert from 'assert';
import sinon from 'sinon';

describe('Touches', function() {
    var printer = sinon.mock();
    var touches = new Touches(printer);
    
    it('should be constructed', function() {
      assert.equal(Object.prototype.toString(touches), '[object Object]');
    });
});