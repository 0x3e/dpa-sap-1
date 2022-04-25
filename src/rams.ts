import * as buffer from './buffers';
import * as register from './registers';

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
export class SixteenByEightBitRAM implements IRAMs{
  addr: (boolean | undefined)[];
  d: (boolean | undefined)[];
  l: boolean;
  e: boolean;
  c: boolean;

  o: (boolean | undefined)[];

  r: register.EightBitRegister[];

  constructor() {
    this.addr = buffer.random_bits(8);
    this.d = buffer.random_bits(8);
    this.l = buffer.random_bit();
    this.e = buffer.random_bit();
    this.c = buffer.random_bit();

    this.r = new Array(16).fill(0).map(() => { return new register.EightBitRegister() });
    this.o = buffer.random_bits(8);
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
    if(!buffer.is_bits(this.addr))
      return;
    const addr_num = buffer.bits_to_num(this.addr.slice(0,4));
    const reg = this.r[addr_num];
    if(this.e)
      this.o = reg.input(this.l, this.d, this.c, this.e, false);
    else if(this.l)
      reg.input(this.l, this.d, this.c, this.e, false);
  }
  output(){
    return this.o;
  }
}
