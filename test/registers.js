const tap = require('tap')
const buffer = require('../dist/buffers')
const gate = require('../dist/gates')
const flipflop = require('../dist/flipflops')
const register = require('../dist/registers')
tap.test('Register  | l | d | c | e | Out |', t => {
  //input( l:boolean, d:boolean, c:boolean, e:boolean ){
  var r = new register.Register()
  t.equal(typeof(r.input(false, false, false, false)), 'undefined',
         '.         | 0 | 0 | 0 | 0 |  ~  |')
  t.equal(typeof(r.input(true, false, false, false)), 'undefined',
         '.         | 1 | 0 | 0 | 0 |  ~  |')
  t.equal(typeof(r.input(true, true, false, false)), 'undefined',
         '.         | 1 | 1 | 0 | 0 |  ~  |')
  t.equal(typeof(r.input(true, true, true, false)), 'undefined',
         '.         | 1 | 1 | 1 | 0 |  ~  |')
  t.equal(typeof(r.input(false, true, true, false)), 'undefined',
         '.         | 0 | 1 | 1 | 0 |  ~  |')
  t.equal(typeof(r.input(false, false, true, false)), 'undefined',
         '.         | 0 | 0 | 1 | 0 |  ~  |')
  t.equal(typeof(r.input(false, false, false, true)), 'boolean',
         '.         | 0 | 0 | 0 | 1 |  1  |')
  t.equal(r.input(false, false, false, true), true,
         '.         | 0 | 0 | 0 | 1 |  1  |')
  t.equal(typeof(r.input(true, false, true, false)), 'undefined',
         '.         | 1 | 0 | 1 | 0 |  ~  |')
  t.equal(typeof(r.input(false, false, false, true)), 'boolean',
         '.        | 0 | 0 | 0 | 1 |  0  |')
  t.equal(r.input(false, false, false, true), false,
         '.        | 0 | 0 | 0 | 1 |  0  |')
//         '.         | 1 | 0 | 1 | 0 |  ~  |')
  t.end();
})
