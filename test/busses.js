const tap = require('tap')
const buffer = require('../dist/buffers')
const gate = require('../dist/gates')
const flipflop = require('../dist/flipflops')
const register = require('../dist/registers')
const adder = require('../dist/adders')
const ram = require('../dist/rams')
const bus = require('../dist/busses')

  x0 = [false, false, false, false]
  xF = [true, true, true, true]
  x0F = x0.concat(xF);
tap.test('Bus', t => {
  var the_bus = new bus.Bus()
    the_bus.d = x0F
    const a = new register.EightBitRegister()
    const b = new register.EightBitRegister()
    a.l = true 
    a.c = true 
    a.e = false 
    a.clr = false 
    b.l = true
    b.c = true 
    b.e = false
    b.clr = false 
    const add = new adder.EightBitAdder()
    add.a_register(a)
    add.b_register(b)
    add.e = false;
    the_bus.member_name.push("Accumulator A")
    the_bus.member.push(a)
    the_bus.member_name.push("Adder")
    the_bus.member.push(add)
    the_bus.member_name.push("SixteenByEight RAM")
    the_ram = new ram.SixteenByEightBitRAM()
    the_ram.e = false
    the_ram.l = false
    the_bus.member.push(the_ram)
    the_bus.member_name.push("B register")
    the_bus.member.push(b)
  the_bus.propagate()
    a.l = false 
    b.l = false
    add.e = true;
  the_bus.propagate()
  t.end()
})
