const tap = require('tap')
const h = require('../dist/helpers')
const register = require('../dist/registers')
const adder = require('../dist/adders')
const ram = require('../dist/rams')
const bus = require('../dist/busses')

  xZ = [undefined, undefined, undefined, undefined]
  xZZ = xZ.concat(xZ)

tap.test('Bus', t => {
// adder uses a and b registers without the bus
  const a = new register.EightBitRegister()
    a.l = false 
    a.c = true 
    a.e = false 
    a.clr = false 
  const b = new register.EightBitRegister()
    b.l = false
    b.c = true 
    b.e = false
    b.clr = false 
  const add = new adder.EightBitAdder()
    add.a_register(a)
    add.b_register(b)
    add.c = true;
    add.e = false;
    t.equal(h.bits_to_num(add.o), 0x00)

  const the_ram = new ram.SixteenByEightBitRAM()
    the_ram.e = false
    the_ram.l = false
  t.same(the_ram.input(h.num_to_bits(0xE), h.num_to_bits(0x3E), true, false, true), xZZ, "load 0xE ram with 0x3E")
  t.same(the_ram.input(h.num_to_bits(0xD), h.num_to_bits(0x3D), true, false, true), xZZ, "load 0xD ram with 0x3D")

    the_ram.e = true
    the_bus = new bus.Bus()


    the_bus.member_name.push("Accumulator A")
    the_bus.member.push(a)
    the_bus.member_name.push("Adder")
    the_bus.member.push(add)
    the_bus.member_name.push("SixteenByEight RAM")
    the_bus.member.push(the_ram)
    the_bus.member_name.push("B register")
    the_bus.member.push(b)

//load ram address 0xE to bus
  the_ram.addr = h.num_to_bits(0xE)
  the_ram.e = true
  the_bus.propagate()
// load bus to a register
  the_ram.e = false
    a.l = true 
    a.c = true 
    a.e = false 

  the_bus.propagate()
//load ram address 0xD to bus
  the_ram.addr = h.num_to_bits(0xD)
  the_ram.e = true
    a.l = false 

  the_bus.propagate()
// load bus to b register
    b.l = true
    b.c = true 

  the_bus.propagate()

    b.l = false
    add.e = true;
  the_bus.propagate()
  t.equal(h.bits_to_num(the_bus.d), 0x3E+0x3D)
  t.end()
})
