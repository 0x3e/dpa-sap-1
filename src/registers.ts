import * as buffer from './buffers'
import * as gate from './gates'
import * as flipflop from './flipflops'
export interface FourInputOneOutput {
  i0: boolean;
  i1: boolean;
  i2: boolean;
  i3: boolean;
  o: boolean | undefined;
  input ( i1:boolean, i2:boolean, i3:boolean, i4:boolean ): boolean | undefined;
  output (): boolean | undefined;
}

export class Register implements FourInputOneOutput {
  not: buffer.NOT;
  and0: gate.AND;
  and1: gate.AND;
  or: gate.OR;
  d_latch: flipflop.DLatch;
  i0: boolean;
  i1: boolean;
  i2: boolean;
  i3: boolean;
  o: boolean | undefined;
  tristate: buffer.TriState;

  constructor() {
    this.not = new buffer.NOT();
    this.and0 = new gate.AND();
    this.and1 = new gate.AND();
    this.or = new gate.OR();
    this.d_latch = new flipflop.DLatch();
    this.i0 = buffer.random_bit();
    this.i1 = buffer.random_bit();
    this.i2 = buffer.random_bit();
    this.i3 = buffer.random_bit();
    this.o  = undefined;
    this.tristate = new buffer.TriState();
  }

  input( l:boolean, d:boolean, c:boolean, e:boolean ){
    buffer.throw_on_NaB(l, d, c);
    this.i0 = l; 
    this.i1 = d;
    this.i2 = c;
    this.i3 = e;
    this.processing();
    return this.output();
  }

  processing(){
    const step1 = this.not.input(this.i0);
    const step2 = this.and0.input(step1,this.d_latch.o0);
    const step3 = this.and1.input(this.i1,this.i0);
    const step4 = this.or.input(step2,step3);
    this.d_latch.input(this.i2,step4);
    this.o = this.tristate.input(this.d_latch.o0,this.i3);
  }

  output(){
    return this.o
  }
}
