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
tap.test('DFlipFlop  | D | C | !Q | Q |', t => {
  var d_flipflop = new flipflop.DFlipFlop()
  const first_run = d_flipflop.output()
  d_flipflop.input(false, false)
  d_flipflop.input(false, true)
  d_flipflop.input(false, false)
  d_flipflop.input(false, true)
  t.equal(d_flipflop.input(false, true), 0b10,
  '1:         | 0 | 1 |  1 | 0 |')
  t.equal(d_flipflop.input(false, false),0b10,
  '2:         | 0 | 0 |  1 | 0 |')
  t.equal(d_flipflop.input(false, true), 0b10,
  '3:         | 0 | 1 |  1 | 0 |')
  t.equal(d_flipflop.input(false, false),0b10,
  '4:         | 0 | 0 |  1 | 0 |')
  t.equal(d_flipflop.input(true, true),  0b10,
  '5:         | 1 | 1 |  1 | 0 |')
  t.equal(d_flipflop.input(true, false), 0b01,
  '6:         | 1 | 0 |  0 | 1 |')
  t.equal(d_flipflop.input(true, true),  0b01,
  '7:         | 1 | 1 |  0 | 1 |')
  t.equal(d_flipflop.input(true, false), 0b01,
  '8:         | 1 | 0 |  0 | 1 |')
  t.equal(d_flipflop.input(false, true), 0b01,
  '9:         | 0 | 1 |  0 | 1 |')
  t.equal(d_flipflop.input(false, false),0b10,
   '10:       | 0 | 0 |  1 | 0 |')
  t.equal(d_flipflop.input(false, true), 0b10,
   '11:       | 0 | 1 |  1 | 0 |')
  t.equal(d_flipflop.input(true, false), 0b10,
   '12:       | 1 | 0 |  1 | 0 |')
  t.equal(d_flipflop.input(false, true), 0b10,
   '13:       | 0 | 1 |  1 | 0 |')
  t.equal(d_flipflop.input(false, false),0b10,
   '14:       | 0 | 0 |  1 | 0 |')
  t.equal(d_flipflop.input(false, true), 0b10,
   '15:       | 0 | 1 |  1 | 0 |')
  t.equal(d_flipflop.input(true, false), 0b10,
   '16:       | 1 | 0 |  1 | 0 |')
  t.equal(d_flipflop.input(true, true),  0b10,
   '17:       | 1 | 1 |  1 | 0 |')
  t.equal(d_flipflop.input(true, false), 0b01,
   '18:       | 1 | 0 |  0 | 1 |')
  t.equal(d_flipflop.input(true, true),  0b01,
   '19:       | 1 | 1 |  0 | 1 |')
  t.equal(d_flipflop.input(true, false), 0b01,
   '20:       | 1 | 0 |  0 | 1 |')
  t.equal(d_flipflop.input(true, true),  0b01,
   '21:       | 1 | 1 |  0 | 1 |')
  t.equal(d_flipflop.input(true, false), 0b01,
   '22:       | 1 | 0 |  0 | 1 |')
  t.equal(d_flipflop.input(true, true),  0b01,
   '23:       | 1 | 1 |  0 | 1 |')
  t.equal(d_flipflop.input(true, false), 0b01,
   '24:       | 1 | 0 |  0 | 1 |')
  t.equal(d_flipflop.input(false, true), 0b01,
   '25:       | 0 | 1 |  0 | 1 |')
  t.equal(d_flipflop.input(false, false),0b10,
   '26:       | 0 | 0 |  1 | 0 |')
  t.equal(d_flipflop.input(true, true),  0b10,
   '27:       | 1 | 1 |  1 | 0 |')
  t.equal(d_flipflop.input(false, false),0b01,
   '28:       | 0 | 0 |  0 | 1 |')
  t.equal(d_flipflop.input(true, true),  0b01,
   '29:       | 1 | 1 |  0 | 1 |')
  t.equal(d_flipflop.input(true, false), 0b01,
   '30:       | 1 | 0 |  0 | 1 |')
  t.equal(d_flipflop.input(true, true),  0b01,
   '31:       | 1 | 1 |  0 | 1 |')
  t.equal(d_flipflop.input(true, false), 0b01,
   '32:       | 1 | 0 |  0 | 1 |')
  t.equal(d_flipflop.input(true, true),  0b01,
   '33:       | 1 | 1 |  0 | 1 |')
  t.end()
})
tap.test('DDivider  | i | o |', t => {
  var d_divider = new flipflop.DDivider()
  const first_run = d_divider.output()
  d_divider.d_flipflop.input(true, false)
  d_divider.d_flipflop.input(true, true)
  t.equal(d_divider.input(false),  true,
   '1:        | 0 | 1 |')
  t.equal(d_divider.input(true),  true,
   '2:        | 1 | 1 |')
  t.equal(d_divider.input(false),  false,
   '3:        | 0 | 0 |')
  t.equal(d_divider.input(true),  false,
   '4:        | 1 | 0 |')
  t.equal(d_divider.input(false),  true,
   '5:        | 0 | 1 |')
  t.equal(d_divider.input(true),  true,
   '6:        | 1 | 1 |')
  t.equal(d_divider.input(false),  false,
   '7:        | 0 | 0 |')
  t.equal(d_divider.input(true),  false,
   '8:        | 1 | 0 |')
  t.end()
})
