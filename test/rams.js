const tap = require('tap')
const buffer = require('../dist/buffers')
const gate = require('../dist/gates')
const flipflop = require('../dist/flipflops')
const ram = require('../dist/rams')

  xZ = [undefined, undefined, undefined, undefined]
  x0 = [false, false, false, false]
  x1 = [false, false, false, true]
  x5 = [false, true, false, true]
  x7 = [false, true, true, true]
  xE = [true, true, true, false]
  xF = [true, true, true, true]

  xZZ = xZ.concat(xZ)
  x00 = x0.concat(x0)
  x01 = x0.concat(x1)
  xFF = xF.concat(xF)
  x0F = x0.concat(xF)

tap.test('SixteenByEightBitRAM    | addr |  d  | l | e | c |  o  |', t => {
  var the_ram = new ram.SixteenByEightBitRAM()
  const first_run = the_ram.output()
  t.same(the_ram.input(xZ, xFF, false, false, true), xZZ,
         '.                       | xZ | xFF | 0 |  0  | 1 | 0xZZ |')
  t.same(the_ram.input(x00, xFF, false, false, true), xZZ,
         '.                       | x00 | xFF | 0 |  0  | 1 | 0xZZ |')
  t.same(the_ram.input(x00, xFF, true, false, true), xZZ,
         '.                       | x00 | xFF | 1 |  0  | 1 | 0xZZ |')
  t.same(the_ram.input(x00, xZZ, false, true, true), xFF,
         '.                       | x00 | xZZ | 0 |  1  | 1 | 0xFF |')
  t.same(the_ram.input(x1, xFF, true, false, true), xZZ,
         '.                       | x1 | xFF | 1 |  0  | 1 | 0xZZ |')
  t.same(the_ram.input(x1, xZZ, false, true, true), xFF,
         '.                       | x1 | xFF | 0 |  1  | 1 | 0xFF |')
  t.same(the_ram.input(x0F, x00, true, false, true), xZZ,
         '.                       | x1 | xFF | 1 |  0  | 1 | 0xZZ |')
  t.same(the_ram.input(x0F, xZZ, false, true, true), x00,
         '.                       | x1 | xFF | 0 |  1  | 1 | 0x00 |')
  t.end()
})
