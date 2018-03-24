'use strict';
var createIteratorConstructor = require('../internals/iterators-core').createIteratorConstructor;
var requireObjectCoercible = require('../internals/require-object-coercible');
var InternalStateModule = require('../internals/internal-state');
var createAt = require('../internals/string-at');
var STRING_ITERATOR = 'StringIterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);
var codePointAt = createAt(false);
var at = createAt(true);

// https://github.com/RReverser/string-prototype-codepoints
// TODO: unify with String#@@iterator
var $StringIterator = createIteratorConstructor(function StringIterator(string) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: string,
    index: 0
  });
}, 'String', function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = at(string, index);
  state.index += point.length;
  return { value: codePointAt(point, 0), done: false };
});

require('../internals/export')({ target: 'String', proto: true }, {
  codePoints: function codePoints() {
    return new $StringIterator(String(requireObjectCoercible(this)));
  }
});
