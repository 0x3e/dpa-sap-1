import * as buffer from './buffers';
import * as gate from './gates';
import * as flipflop from './flipflops';

export interface IRegister {
  l: boolean;
  d: boolean | undefined;
  c: boolean;
  e: boolean;
  o: boolean | undefined;
  input (l:boolean, d:boolean | undefined, c:boolean, e:boolean): boolean | undefined;
  output (): boolean | undefined;
}

export interface I8BitRegister {
  d: (boolean | undefined)[];
  o: (boolean | undefined)[];
  input ( l:boolean, d:(boolean | undefined)[], c:boolean, e:boolean, clr:boolean ): (boolean | undefined)[];
  output (): (boolean | undefined)[];
}

export class Register implements IRegister {
  l: boolean;
  d: boolean | undefined;
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
    this.l = buffer.random_bit();
    this.d = buffer.random_bit();
    this.c = buffer.random_bit();
    this.e = buffer.random_bit();
    this.o = buffer.random_bit();
    this.not = new buffer.NOT();
    this.and0 = new gate.AND();
    this.and1 = new gate.AND();
    this.or = new gate.OR();
    this.d_latch = new flipflop.DLatch();
    this.tristate = new buffer.TriState();
  }

  input(l:boolean, d:boolean | undefined, c:boolean, e:boolean){
/* why istanbul? why is this not tested? is this a bug? */
/* istanbul ignore next */
    if(this.d === undefined){
      this.o = undefined;
      return this.output();
    }
    buffer.throw_on_NaB(l, c, e);
    this.l = l;
    this.d = d;
    this.c = c;
    this.e = e;
    this.processing();
    return this.output();
  }

  processing(){
    if(this.d === undefined)
      return this.o = undefined;
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

export class EightBitRegister implements I8BitRegister {
  d: (boolean | undefined)[];
  clr: boolean;
  l: boolean;
  e: boolean;
  c: boolean;
  o: (boolean | undefined)[];
  r: Register[];

  constructor() {
    this.d = buffer.random_bits(8);
    this.clr = buffer.random_bit();
    this.l = buffer.random_bit();
    this.e = buffer.random_bit();
    this.c = buffer.random_bit();
    this.r = Array(8).fill(0).map(() => { return new Register() });
    this.o = this.r.map((r) => {return r.output()});
  }

  input(l:boolean, d:(boolean | undefined)[], c:boolean, e:boolean, clr:boolean ){
    this.d = d;
    this.clr = clr;
    this.l = l;
    this.e = e;
    this.c = c;

    this.processing();
    return this.output();
  }

  processing(){
    for (const i in this.r)
      this.r[i].input(this.l, this.d[i], this.c, this.e);
    if(this.clr)
      for (const r of this.r)
        r.input(true, false, true, false);
    this.o = this.r.map((r) => {return r.output()});
  }

  output(){
    return this.o;
  }
}
