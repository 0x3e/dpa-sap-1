const tap = require('tap')
const buffer = require('../dist/buffers')
const gate = require('../dist/gates')

tap.test(                          'AND  |  A    | B      | output |', t => {
  var and = new gate.AND()
  t.equal(typeof(and.output()), 'boolean',
                                   '.    | (0,1) |  (0,1) |  (0,1) |')
  t.notOk(and.input(false, false), '.    |   0   |    0   |    0   |' )
  t.notOk(and.input(false, true),  '.    |   0   |    1   |    0   |' )
  t.notOk(and.input(true, false),  '.    |   1   |    0   |    0   |' )
  t.ok(and.input(true, true),      '.    |   1   |    1   |    1   |' )
  t.throws(function(){and.input('Jack', 'Diane')},{ message: 'NaB' },
                                   '.    |"Jack" |"Diane" | E NaB  |' )
  t.throws(function(){and.input('Jack', true)},{ message: 'NaB' },
                                   '.    |"Jack" |    1   | E NaB  |' )
  t.throws(function(){and.input( false, 'Diane')},{ message: 'NaB' },
                                   '.    |   0   |"Diane" | E NaB  |' )
  t.end()
})

tap.test(                          'OR  |  A    | B      | output |', t => {
  var or = new gate.OR()
  t.equal(typeof(or.output()), 'boolean',
                                   '.    | (0,1) |  (0,1) |  (0,1) |')
  t.notOk(or.input(false, false),  '.    |   0   |    0   |    0   |' )
  t.ok(or.input(false, true),      '.    |   0   |    1   |    1   |' )
  t.ok(or.input(true, false),      '.    |   1   |    0   |    1   |' )
  t.ok(or.input(true, true),       '.    |   1   |    1   |    1   |' )
  t.throws(function(){or.input('Jack', 'Diane')},{ message: 'NaB' },
                                   '.    |"Jack" |"Diane" | E NaB  |' )
  t.throws(function(){or.input('Jack', true)},{ message: 'NaB' },
                                   '.    |"Jack" |    1   | E NaB  |' )
  t.throws(function(){or.input( false, 'Diane')},{ message: 'NaB' },
                                   '.    |   0   |"Diane" | E NaB  |' )
  t.end()
})

tap.test(                            'NAND  |  A    | B      | output |', t => {
  var nand = new gate.NAND()
  t.equal(typeof(nand.output()), 'boolean',
                                     '.     | (0,1) |  (0,1) |  (0,1) |')
  t.ok(nand.input(false, false),     '.     |   0   |    0   |    1   |' )
  t.ok(nand.input(false, true),      '.     |   0   |    1   |    1   |' )
  t.ok(nand.input(true, false),      '.     |   1   |    0   |    1   |' )
  t.notOk(nand.input(true, true),    '.     |   1   |    1   |    0   |' )
  t.throws(function(){nand.input('Jack', 'Diane')},{ message: 'NaB' },
                                   '.     |"Jack" |"Diane" | E NaB  |' )
  t.throws(function(){nand.input('Jack', true)},{ message: 'NaB' },
                                   '.     |"Jack" |    1   | E NaB  |' )
  t.throws(function(){nand.input( false, 'Diane')},{ message: 'NaB' },
                                   '.     |   0   |"Diane" | E NaB  |' )
  t.end()
})

tap.test(                            'NOR  |  A    | B      | output |', t => {
  var nor = new gate.NOR()
  t.equal(typeof(nor.output()), 'boolean',
                                    '.     | (0,1) |  (0,1) |  (0,1) |')
  t.ok(nor.input(false, false),     '.     |   0   |    0   |    1   |' )
  t.notOk(nor.input(false, true),   '.     |   0   |    1   |    0   |' )
  t.notOk(nor.input(true, false),   '.     |   1   |    0   |    0   |' )
  t.notOk(nor.input(true, true),    '.     |   1   |    1   |    0   |' )
  t.throws(function(){nor.input('Jack', 'Diane')},{ message: 'NaB' },
                                    '.     |"Jack" |"Diane" | E NaB  |' )
  t.throws(function(){nor.input('Jack', true)},{ message: 'NaB' },
                                    '.     |"Jack" |    1   | E NaB  |' )
  t.throws(function(){nor.input( false, 'Diane')},{ message: 'NaB' },
                                    '.     |   0   |"Diane" | E NaB  |' )
  t.end()
})

tap.test(                            'XOR  |  A    | B      | output |', t => {
  var xor = new gate.XOR()
  t.equal(typeof(xor.output()), 'boolean',
                                    '.     | (0,1) |  (0,1) |  (0,1) |')
  t.notOk(xor.input(false, false),     '.     |   0   |    0   |    0   |' )
  t.ok(xor.input(false, true),      '.     |   0   |    1   |    1   |' )
  t.ok(xor.input(true, false),      '.     |   1   |    0   |    1   |' )
  t.notOk(xor.input(true, true),    '.     |   1   |    1   |    0   |' )
  t.throws(function(){xor.input('Jack', 'Diane')},{ message: 'NaB' },
                                    '.     |"Jack" |"Diane" | E NaB  |' )
  t.throws(function(){xor.input('Jack', true)},{ message: 'NaB' },
                                    '.     |"Jack" |    1   | E NaB  |' )
  t.throws(function(){xor.input( false, 'Diane')},{ message: 'NaB' },
                                    '.     |   0   |"Diane" | E NaB  |' )
  t.end()
})

tap.test(                          'XNOR  |  A    | B      | output |', t => {
  var xnor = new gate.XNOR()
  t.equal(typeof(xnor.output()), 'boolean',
                                   '.     | (0,1) |  (0,1) |  (0,1) |')
  t.ok(xnor.input(false, false),   '.     |   0   |    0   |    1   |' )
  t.notOk(xnor.input(false, true), '.     |   0   |    1   |    0   |' )
  t.notOk(xnor.input(true, false), '.     |   1   |    0   |    0   |' )
  t.ok(xnor.input(true, true),     '.     |   1   |    1   |    1   |' )
  t.throws(function(){xnor.input('Jack', 'Diane')},{ message: 'NaB' },
                                    '.     |"Jack" |"Diane" | E NaB  |' )
  t.throws(function(){xnor.input('Jack', true)},{ message: 'NaB' },
                                    '.     |"Jack" |    1   | E NaB  |' )
  t.throws(function(){xnor.input( false, 'Diane')},{ message: 'NaB' },
                                    '.     |   0   |"Diane" | E NaB  |' )
  t.end()
})
