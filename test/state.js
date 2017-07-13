import State from '../src/js/class/State';
import assert from 'assert';

describe('State', function() {
    var state = new State();

    it('should be constructed', function() {
      assert.equal(Object.prototype.toString(state), '[object Object]');
    });
});