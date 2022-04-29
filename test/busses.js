const tap = require('tap')
const h = require('../dist/helpers')
const register = require('../dist/registers')
const adder = require('../dist/adders')
const ram = require('../dist/rams')
const bus = require('../dist/busses')
let sleep = require('util').promisify(setTimeout);

  xZ = [undefined, undefined, undefined, undefined]
  xZZ = xZ.concat(xZ)

tap.test('Bus', t => {
// adder uses a and b registers without the bus
  const a = new register.EightBitRegister()
    a.l = false 
    a.c = true 
    a.e = false 
  const b = new register.EightBitRegister()
    b.l = false
    b.c = true 
    b.e = false // b register cannot l
  const add = new adder.EightBitAdder()
    add.a_register(a)
    add.b_register(b)
    add.c = true;
    add.e = false;

  const the_ram = new ram.SixteenByEightBitRAM()
    the_ram.e = false
    the_ram.c = true
    the_ram.l = true
    for(i=0;i<0x10;i+=1){
      the_ram.addr = h.num_to_bits(i,4)
      the_ram.bus(h.num_to_bits(0,8))
    }
    the_ram.input(h.num_to_bits(0xE,4),h.num_to_bits(0x3E,8), true, false, true)
    the_ram.input(h.num_to_bits(0xD,4),h.num_to_bits(0x3D,8), true, false, true)
    the_ram.l = false

    the_bus = new bus.Bus()
    the_bus.d = h.num_to_bits(0,8)


    the_bus.member_name.push("Accumulator A")
    the_bus.member.push(a)
    the_bus.member_name.push("Adder")
    the_bus.member.push(add)
    the_bus.member_name.push("SixteenByEight RAM")
    the_bus.member.push(the_ram)
    the_bus.member_name.push("B register")
    the_bus.member.push(b)
  a.l = false 
  b.l = false 

//load ram address 0xE to bus
  the_ram.addr = h.num_to_bits(0xE,4)
  the_ram.e = true
  the_ram.l = false
  the_bus.propagate()
// load bus to a register
  the_ram.e = false
    a.l = true 
    a.c = true 
    a.e = false 

  the_bus.propagate()
  a.l = false 
  b.l = false 
//load ram address 0xD to bus
  the_ram.addr = h.num_to_bits(0xD,4)
  the_ram.e = true
  the_ram.l = false

  the_bus.propagate()
//  console.log("a.o",h.bits_to_num(a.o).toString(16))

// load bus to b register
  the_ram.e = false
    b.l = true
    b.c = true 

  the_bus.propagate()
//  console.log("a.o",h.bits_to_num(a.o).toString(16))
//  console.log("b.o",h.bits_to_num(b.o).toString(16))
    b.l = false

    add.e = true;


  the_bus.propagate()
  t.equal(h.bits_to_num(the_bus.d), 0x3E+0x3D)
  t.end()
})
