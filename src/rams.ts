import * as h from './helpers';
import * as register from './registers';
import * as bus from './busses';

export interface IRAMs {
  addr: (boolean | undefined)[];
  d: (boolean | undefined)[];
  l: boolean;
  e: boolean;
  c: boolean;
  o: (boolean | undefined)[];

  input (addr: (boolean | undefined)[], d:(boolean | undefined)[], l:boolean, e:boolean, c: boolean ): (boolean | undefined)[];
  output (): (boolean | undefined)[];
}
//tap.test('SixteenByEightBitRAM    | addr |  d  | c | l | e |  o |', t => {
export class SixteenByEightBitRAM implements IRAMs, bus.IBussable {
  addr: (boolean | undefined)[];
  d: (boolean | undefined)[];
  l: boolean;
  e: boolean;
  c: boolean;

  o: (boolean | undefined)[];

  r: register.EightBitRegister[];

  constructor() {
    this.addr = h.random_bits(8);
    this.d = h.random_bits(8);
    this.l = h.random_bit();
    this.e = h.random_bit();
    this.c = h.random_bit();

    this.r = new Array(16).fill(0).map(() => { return new register.EightBitRegister() });
    this.o = h.random_bits(8);
  }

  input(addr: (boolean | undefined)[], d:(boolean | undefined)[], l:boolean, e:boolean, c: boolean){
    this.addr = addr.slice(0,4);
    this.d = d;
    this.l = l;
    this.e = e;
    this.c = c;

    this.processing();
    return this.output();
  }
  processing(){
    this.o = new Array(8).fill(undefined);
    this.addr = this.addr.slice(0,4);
    if(!h.is_bits(this.addr))
      return;
    const addr_num = h.bits_to_num(this.addr.slice(0,4));
    const reg = this.r[addr_num];
    if(this.e)
      this.o = reg.input(this.l, this.d, this.c, this.e);
    else if(this.l)
      reg.input(this.l, this.d, this.c, this.e);
  }
  bus(d: (boolean | undefined)[]){
    if(this.l)
      this.d = d;

    this.processing();

    if(this.e)
      return this.output();
    else
      return new Array(8).fill(undefined);
  }
  output(){
    return this.o;
  }
}
