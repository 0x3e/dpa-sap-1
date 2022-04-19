const tap = require('tap')
const buffer = require('../dist/buffers')
const gate = require('../dist/gates')
const flipflop = require('../dist/flipflops')

tap.test('SRLatch  | S | R |   Q   | !Q  |', t => {
/*
         '.        | 0 | 0 | Q     | Hold state  | 0 | 0    | 0 | X'
         '.        | 0 | 1 | 0     | Reset       | 0 | 1    | 1 | 0
         '.        | 1 | 0 | 1     | Set         | 1 | 0    | 0 | 1
         '.        | 1 | 1 | X     | Not allowed | 1 | 1    | X | 0'
*/
  var sr_latch = new flipflop.SRLatch()
  const first_run = sr_latch.output()
  t.equal(typeof(first_run), 'number',
         '.        | ? | ? | (0,1) |  ?  |')
  t.ok(first_run <=2 && first_run >=0,
         '.        | ? | ? | (0,1) |  ?  |')
  t.equal(sr_latch.input(true, false), 0b01,
         '.        | 1 | 0 |   1   |  0  |')
  t.equal(sr_latch.input(false, false), 0b01,
         '.        | 0 | 0 |   1   |  0  |')
  t.equal(sr_latch.input(false, true), 0b10,
         '.        | 0 | 1 |   0   |  1  |')
  t.equal(sr_latch.input(false, false), 0b10,
         '.        | 0 | 0 |   0   |  1  |')
  t.equal(sr_latch.input(true, false), 0b01,
         '.        | 1 | 0 |   1   |  0  |')
  t.equal(sr_latch.input(true, false), 0b01,
         '.        | 1 | 0 |   1   |  0  |')
  t.equal(sr_latch.input(false, false), 0b01,
         '.        | 0 | 0 |   1   |  0  |')
  t.equal(sr_latch.input(false, false), 0b01,
         '.       | 0 | 0 |   1   |  0  |')
  t.equal(sr_latch.input(false, true), 0b10,
         '.       | 0 | 1 |   0   |  1  |')
  t.equal(sr_latch.input(true, false), 0b01,
         '.       | 1 | 0 |   1   |  0  |')
  t.equal(sr_latch.input(false, true), 0b10,
         '.       | 0 | 1 |   0   |  1  |')
  t.equal(sr_latch.input(true, false), 0b01,
         '.       | 1 | 0 |   1   |  0  |')
  t.throws(function(){sr_latch.input( false, '!')},{ message: 'NaB' },
         '.       | 0 |"!"|  NaB  | NaB |')
  t.end()
})
tap.test('DLatch  | E |  D  |   Q   | !Q  | Comment', t => {
/*
E/C |  D  |   Q   | !Q    | Comment
0   |  X  | Qprev | Qprev | No change
1   |  0  |   0   | 1     | Reset
1   |  1  |   1   | 0     | Set
*/
  var d_latch = new flipflop.DLatch()
  const first_run = d_latch.output()
  t.equal(typeof(first_run), 'number',
         '.       | ? |  ?  | (0,1) |  ?  |')
  t.ok(first_run <=2 && first_run >=0,
         '.       | ? |  ?  | (0,1) |  ?  |')
  t.equal(d_latch.input(true, false), 0b10,
         '.       | 1 |  0  |   0   |  1  |')
  t.equal(d_latch.input(false, false), 0b10,
         '.       | 0 |  0  |   0   |  1  |')
  t.equal(d_latch.input(false, false), 0b10,
         '.       | 0 |  0  |   0   |  1  |')
  t.equal(d_latch.input(false, true), 0b10,
         '.       | 0 |  1  |   0   |  1  |')
  t.equal(d_latch.input(true, true), 0b01,
         '.       | 1 |  1  |   1   |  0  |')
  t.equal(d_latch.input(false, false), 0b01,
         '.       | 0 |  0  |   1   |  0  |')
  t.equal(d_latch.input(false, false), 0b01,
         '.       | 0 |  0  |   1   |  0  |')
  t.equal(d_latch.input(false, true), 0b01,
         '.      | 0 |  1  |   1   |  0  |')
  t.equal(d_latch.input(true, false), 0b10,
         '.      | 1 |  0  |   0   |  1  |')
  t.equal(d_latch.input(true, true), 0b01,
         '.      | 1 |  1  |   1   |  0  |')
  t.throws(function(){d_latch.input( false, '!')},{ message: 'NaB' },
         '.      | 0 | "! "|  NaB  | NaB |')
  t.end()
})
