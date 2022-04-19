const tap = require('tap')
const buffer = require('../dist/buffers')

tap.test(                   'Buffer | input | output |', t => {
  var buf = new buffer.Buffer()
  t.equal(typeof(buf.output()), 'boolean',
                            '.      | (0,1) |  (0,1) |')
  t.ok(buf.input(true),     '.      |   1   |    1   |')
  t.notOk(buf.input(false), '.      |   0   |    0   |')
  t.throws(function(){buf.input('Stacy')},{ message: 'NaB' }
                           ,'.      |"Stacy"|  E NaB |')
  t.end()
})

tap.test(                   'NOT  | input | output |', t => {
  var not = new buffer.NOT()
  t.equal(typeof(not.output()), 'boolean',
                            '.    | (0,1) |  (0,1) |')
  t.notOk(not.input(true),  '.    |   1   |    0   |')
  t.ok(not.input(false),    '.    |   0   |    1   |')
  t.throws(function(){not.input('Kevin')},{ message: 'NaB' }
                           ,'.    |"Kevin"|  E NaB |')
  t.end()
})

tap.test(                   'TriState |   a   |   b   | output |', t => {
  var tristate = new buffer.TriState()
  t.equal(typeof(tristate.output()), 'boolean',
                                         '.   | (0,1) | (0,1) | (0,1,~)|')
  t.notOk(tristate.input(false, false),  '.   |   0   |   0   |    ~   |')
  t.notOk(tristate.input(true, false),   '.   |   1   |   0   |    ~   |')
  t.notOk(tristate.input(false, true),   '.   |   0   |   1   |    0   |')
  t.ok(tristate.input(true, true),       '.   |   1   |   1   |    1   |')
  t.end()
})
