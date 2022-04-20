import * as buffer from './buffers';
import * as gate from './gates';
import * as flipflop from './flipflops';
export interface IRegister {
  l: boolean;
  d: boolean;
  c: boolean;
  e: boolean;
  o: boolean | undefined;
  input (l:boolean, d:boolean, c:boolean, e:boolean): boolean | undefined;
  output (): boolean | undefined;
}

export interface I8BitRegister {
  d: boolean[];
  o: boolean[];
  input ( d:boolean[], clr:boolean, l:boolean, e:boolean, c:boolean ): boolean[] | undefined;
  output (): boolean[] | undefined[];
}

export class Register implements IRegister {
  not: buffer.NOT;
  and0: gate.AND;
  and1: gate.AND;
  or: gate.OR;
  d_latch: flipflop.DLatch;
  l: boolean;
  d: boolean;
  c: boolean;
  e: boolean;
  o: boolean | undefined;
  tristate: buffer.TriState;

  constructor() {
    this.not = new buffer.NOT();
    this.and0 = new gate.AND();
    this.and1 = new gate.AND();
    this.or = new gate.OR();
    this.d_latch = new flipflop.DLatch();
    this.l = buffer.random_bit();
    this.d = buffer.random_bit();
    this.c = buffer.random_bit();
    this.e = buffer.random_bit();
    this.o  = undefined;
    this.tristate = new buffer.TriState();
  }

  input(l:boolean, d:boolean, c:boolean, e:boolean){
    buffer.throw_on_NaB(l, d, c);
    this.l = l;
    this.d = d;
    this.c = c;
    this.e = e;
    this.processing();
    return this.output();
  }

  processing(){
    const step1 = this.not.input(this.l);
    const step2 = this.and0.input(step1,this.d_latch.o0);
    const step3 = this.and1.input(this.d,this.l);
    const step4 = this.or.input(step2,step3);
    this.d_latch.input(this.c,step4);
    this.o = this.tristate.input(this.d_latch.o0,this.e);
  }

  output(){
    return this.o;
  }
}

export class EightBitRegister implements I8BitRegister {
  d: boolean[];
  clr: boolean;
  l: boolean;
  e: boolean;
  c: boolean;
  r: Register[];
  o: boolean[];

  constructor() {
    this.d = [false];
    this.clr = buffer.random_bit();
    this.l = buffer.random_bit();
    this.e = buffer.random_bit();
    this.c = buffer.random_bit();
    this.r = [...Array(8)].map(() => { return new Register() });
    this.o = [false];

  }
  input(d:boolean[], clr:boolean, l:boolean, e:boolean, c:boolean){
    this.d = d;
    this.clr = clr;
    this.l = l;
    this.e = e;
    this.c = c;

    this.processing();
    return this.output();
  }
  processing(){
    this.o = [false];
  }
  output(){
    return this.o;
  }
}
