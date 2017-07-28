var test = require('tape');
var qp = require('../index');
var _str = 'param1=yes&param2=no';
var _obj = {
  param1: 'yes',
  param2: 'no'
};
var _obj2 = {
  param2: 'no',
  param1: 'yes'
};

test('To String', function (t) {
  t.plan(1);
  t.equal(qp.toString(_obj), _str, 'Converts object to borwser ready string');
});

test('To Object', function (t) {
  t.plan(1);
  t.deepEqual(qp.toObject(_str), _obj, 'Converts a query string to an object');
});

test('To String (sorted)', function(t) {
  t.plan(1);
  t.deepEqual(qp.toString(_obj), qp.toString(_obj2), 'Both strings should be equal');
});
