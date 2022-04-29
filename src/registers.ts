import * as h from './helpers';
import * as buffer from './buffers';
import * as gate from './gates';
import * as flipflop from './flipflops';
import * as bus from './busses';

export interface IRegister {
  l: boolean;
  d: boolean;
  c: boolean;
  e: boolean;
  o: boolean | undefined;
  input (l:boolean, d:boolean | undefined, c:boolean, e:boolean): boolean | undefined;
  output (): boolean | undefined;
}

export interface I8BitRegister {
  d: (boolean | undefined)[];
  o: (boolean | undefined)[];
  input ( l:boolean, d:(boolean | undefined)[], c:boolean, e:boolean ): (boolean | undefined)[];
  output (): (boolean | undefined)[];
}

export class Register implements IRegister {
  l: boolean;
  d: boolean;
  c: boolean;
  e: boolean;
  o: boolean | undefined;
  not: buffer.NOT;
  and0: gate.AND;
  and1: gate.AND;
  or: gate.OR;
  d_latch: flipflop.DLatch;
  tristate: buffer.TriState;

  constructor() {
    this.l = h.random_bit();
    this.d = h.random_bit();
    this.c = h.random_bit();
    this.e = h.random_bit();
    this.o = h.random_bit();
    this.not = new buffer.NOT();
    this.and0 = new gate.AND();
    this.and1 = new gate.AND();
    this.or = new gate.OR();
    this.d_latch = new flipflop.DLatch();
    this.tristate = new buffer.TriState();
  }

  input(l:boolean, d:boolean | undefined, c:boolean, e:boolean){
    if(typeof d === 'undefined')
      this.d = h.random_bit();
    else
      this.d = d;
    h.throw_on_NaB(l, this.d, c, e);
    this.l = l;
    this.c = c;
    this.e = e;
    this.processing();
    return this.output();
  }

  processing(){
    const step1 = this.not.input(this.l);
    const step2 = this.and0.input(step1,this.d_latch.q);
    const step3 = this.and1.input(this.d,this.l);
    const step4 = this.or.input(step2,step3);
    this.d_latch.input(this.c,step4);
    this.o = this.tristate.input(this.d_latch.q,this.e);
  }

  output(){
    return this.o;
  }
}

export class EightBitRegister implements I8BitRegister, bus.IBussable {
  d: (boolean | undefined)[];
  l: boolean;
  e: boolean;
  c: boolean;
  o: (boolean | undefined)[];
  r: Register[];

  constructor() {
    this.d = h.random_bits(8);
    this.l = h.random_bit();
    this.e = h.random_bit();
    this.c = h.random_bit();
    this.r = new Array(8).fill(0).map(() => { return new Register() });
    this.o = this.r.map((r) => {return r.output()});
  }

  input(l:boolean, d:(boolean | undefined)[], c:boolean, e:boolean ){
    this.l = l;
    this.e = e;
    this.c = c;

    if(this.l)
      this.d = d;

    this.processing();
    return this.output();
  }

  bus(d:(boolean | undefined)[]){
    if(this.l)
      this.d = d;

    if(this.e || this.l)
      this.processing();
    
    return this.output();
  }

  processing(){
    for (const i in this.r)
      this.r[i].input(true, this.d[i], this.c, true);

    this.o = this.r.map((r) => {return r.output()});
  }

  output(){
    if(!this.e)
      return new Array(8).fill(undefined);

    return this.o;
  }
}
