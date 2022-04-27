const tap = require('tap')
const buffer = require('../dist/buffers')
const gate = require('../dist/gates')
const flipflop = require('../dist/flipflops')
const register = require('../dist/registers')

tap.test('Register  | l | d | c | e | Out |', t => {
  //input( l:boolean, d:boolean, c:boolean, e:boolean ){
  var r = new register.Register()
  t.equal(typeof(r.input(false, false, false, false)), 'undefined',
         '.         | 0 | 0 | 0 | 0 |  Z  |')
  t.equal(typeof(r.input(true, false, false, false)), 'undefined',
         '.         | 1 | 0 | 0 | 0 |  Z  |')
  t.equal(typeof(r.input(true, true, false, false)), 'undefined',
         '.         | 1 | 1 | 0 | 0 |  Z  |')
  t.equal(typeof(r.input(true, true, true, false)), 'undefined',
         '.         | 1 | 1 | 1 | 0 |  Z  |')
  t.equal(typeof(r.input(false, true, true, false)), 'undefined',
         '.         | 0 | 1 | 1 | 0 |  Z  |')
  t.equal(typeof(r.input(false, false, true, false)), 'undefined',
         '.         | 0 | 0 | 1 | 0 |  Z  |')
  t.equal(typeof(r.input(false, false, false, true)), 'boolean',
         '.         | 0 | 0 | 0 | 1 |  1  |')
  t.equal(r.input(false, false, false, true), true,
         '.         | 0 | 0 | 0 | 1 |  1  |')
  t.equal(typeof(r.input(true, false, true, false)), 'undefined',
         '.         | 1 | 0 | 1 | 0 |  Z  |')
  t.equal(typeof(r.input(false, false, false, true)), 'boolean',
         '.        | 0 | 0 | 0 | 1 |  0  |')
  t.equal(r.input(false, false, false, true), false,
         '.        | 0 | 0 | 0 | 1 |  0  |')
  t.equal(typeof(r.input(true, undefined, true, false)), 'undefined',
         '.        | 0 | Z | 0 | 1 |  Z  |')
//         '.         | 1 | 0 | 1 | 0 |  Z  |')
  t.end();
})
tap.test('EightBitRegister  | l |  d[] | c | e | Out |', t => {
//  input(l:boolean, d:(boolean | undefined)[], c:boolean, e:boolean, clr:boolean ){
  var r8 = new register.EightBitRegister()
  x00 = [false, false, false, false, false, false, false, false]
  xFF = [true, true, true, true, true, true, true, true]
  xZZ = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
//  console.log(r8.input(false, x00, false, false))
//  test('EightBitRegister  | l |  d[] | c | e | Out |'
          t.same(r8.input(false, x00, false, false), xZZ,
         '.                 | 0 | 0x00 | 0 | 0 | 0xZZ |')
          t.same(r8.input(false, x00, true, false), xZZ,
         '.                 | 0 | 0x00 | 1 | 0 | 0xZZ |')
          t.same(r8.input(true, x00, false, false), xZZ,
         '.                 | 1 | 0x00 | 0 | 0 | 0xZZ |')
          t.same(r8.input(false, xFF, false, false), xZZ,
         '.                 | 0 | 0xFF | 0 | 0 | 0xZZ |')
          t.same(r8.input(false, xFF, true, false), xZZ,
         '.                 | 0 | 0xFF | 1 | 0 | 0xZZ |')
          t.same(r8.input(true, xFF, false, false), xZZ,
         '.                 | 1 | 0xFF | 0 | 0 | 0xZZ |')
          t.same(r8.input(false, xFF, false, true), x00,
         '.                 | 0 | 0xFF | 0 | 1 | 0x00 |')
          t.same(r8.input(false, xFF, false, false), xZZ,
         '.                 | 0 | 0xFF | 0 | 0 | 0xZZ |')
          t.same(r8.input(false, xFF, false, true), x00,
         '.                 | 0 | 0xFF | 0 | 1 | 0x00 |')
          t.same(r8.input(true, xFF, false, false), xZZ,
          '.                | 1 | 0xFF | 0 | 0 | 0xZZ |')
          t.same(r8.input(false, xFF, false, true), x00,
          '.                | 0 | 0xFF | 0 | 1 | 0x00 |')
          t.same(r8.input(true, xFF, true, false), xZZ,
          '.                | 1 | 0xFF | 1 | 0 | 0xZZ |')
          t.same(r8.input(false, xFF, false, true), xFF,
          '.                | 0 | 0xFF | 0 | 1 | 0xFF |')
          t.same(r8.input(false, xFF, false, true), xFF,
          '.                | 0 | 0xFF | 0 | 1 | 0xFF |')
  t.end();
})
