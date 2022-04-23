const tap = require('tap')
const buffer = require('../dist/buffers')
const gate = require('../dist/gates')
const adder = require('../dist/adders')

tap.test('Adder  | a | b | c |  co |  s  |', t => {
  var bit_adder = new adder.BitAdder()
  const first_run = bit_adder.output()
  t.equal(typeof(first_run), 'number',
         '.      | ? | ? | ? | 0,1 | 0,1 |')
  t.throws(function(){bit_adder.input( false, '!')},{ message: 'NaB' },
         '.      | 0 |"!"| 0 | NaB | NaB |')
  t.throws(function(){bit_adder.input( '!', true)},{ message: 'NaB' },
         '.      |"!"| 1 | ? | NaB | NaB |')
  t.equal(bit_adder.input(false, true, false), 0b01,
         '.      | 0 | 1 | 0 |  0  |  1  |')
  t.equal(bit_adder.input(true, false, false), 0b01,
         '.      | 1 | 0 | 0 |  0  |  1  |')
  t.equal(bit_adder.input(true, true, false), 0b10,
         '.      | 1 | 1 | 0 |  1  |  0  |')
  t.equal(bit_adder.input(true, false, true), 0b10,
         '.      | 1 | 0 | 1 |  1  |  0  |')
  t.equal(bit_adder.input(true, true, true), 0b11,
         '.      | 1 | 1 | 1 |  1  |  1  |')
  t.end()
})
tap.test('FourBitAdder |  a | b  | c |  co |  s  |', t => {
  var four_bit_adder = new adder.FourBitAdder()
  xZ = [undefined, undefined, undefined, undefined]
  x0 = [false, false, false, false]
  x1 = [false, false, false, true]
  x5 = [false, true, false, true]
  x7 = [false, true, true, true]
  xE = [true, true, true, false]
  xF = [true, true, true, true]
//  input(a:boolean[], b:boolean[], ci:boolean){
  const first_run = four_bit_adder.output()
  t.equal(typeof(first_run), 'number',
         '.            |  ? |  ? | ? | 0,1 | 0,1 |')
  t.throws(function(){four_bit_adder.input(x0,xZ,false)},{ message: 'NaB' },
         '.            | x0 | xZ | 0 | NaB | NaB |')
  t.throws(function(){four_bit_adder.input( xZ, x0, true)},{ message: 'NaB' },
         '.            | xZ | xF | 1 | NaB | NaB |')
  t.equal(four_bit_adder.input(x0, x0, false), 0x0,
         '.            | x0 | x0 | 0 |  0  | 0x0 |')
  t.equal(four_bit_adder.input(xF, x0, false), 0xF,
         '.            | xF | x0 | 0 |  0  | 0x0 |')
  t.equal(four_bit_adder.input(xF, x1, true), 0x1,
         '.            | xF | x1 | 1 |  1  | 0x1 |')
  t.equal(four_bit_adder.input(xF, xF, true), 0xF,
         '.            | xF | xF | 1 |  1  | 0xF |')
  t.equal(four_bit_adder.input(x5, x7, false), 0xC,
         '.            | x5 | x7 | 0 |  0  | 0xC |')
  t.equal(four_bit_adder.input(x5, x7, true), 0xD,
         '.            | x5 | x7 | 1 |  0  | 0xD |')
  t.equal(four_bit_adder.input(xE, xF, true), 0xE,
          '.           | xE | xF | 1 |  1  | 0xE |')
  t.equal(four_bit_adder.input(xE, xF, false), 0xD,
          '.           | xE | xF | 1 |  0  | 0xD |')
  t.end()
})
