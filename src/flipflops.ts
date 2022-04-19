import * as buffer from './buffers'
import * as gate from './gates'
export interface TwoInputTwoOutput {
  input0: boolean;
  input1: boolean;
  input ( i:boolean, j:boolean ): number;
  output (): number; // two bit number first bit Q second !Q
}

export class SRLatch implements TwoInputTwoOutput {
  nor0: gate.NOR;
  nor1: gate.NOR;
  input0: boolean;
  input1: boolean;
  s: boolean;
  r: boolean;
  constructor() {
    this.nor0 = new gate.NOR();
    this.nor1 = new gate.NOR();
    this.s = buffer.random_bit();
    this.input0 = this.s
    this.r = buffer.random_bit();
    this.input1 = this.r
    this.output()
  }
  input(s: boolean, r: boolean) { 
    if(typeof(s) !== 'boolean' || typeof(r) !== 'boolean')
      throw new Error('NaB')
    this.s = s;
    this.input0 = s
    this.r = r;
    this.input1 = r
    return this.output();
  }
  output(){
    let nor0_out = this.nor0.input(this.r, this.nor1.output())
    let nor1_out = this.nor1.input(nor0_out, this.s)
    nor0_out = this.nor0.input(this.r, this.nor1.output())
    nor0_out = this.nor0.output()
    nor1_out = this.nor1.output()
    let return_val = 0
    if(nor0_out)
      return_val = return_val + 1
    if(nor1_out)
      return_val = return_val + 2
    return return_val
  }
}

export class DLatch implements TwoInputTwoOutput {
  sr_latch: SRLatch;
  not: buffer.NOT
  and0: gate.AND;
  and1: gate.AND;
  input0: boolean;
  input1: boolean;
  d: boolean;
  e: boolean;
  constructor() {
    this.sr_latch = new SRLatch();
    this.not = new buffer.NOT()
    this.and0 = new gate.AND()
    this.and1 = new gate.AND()
    this.e = buffer.random_bit();
    this.input0 = this.e
    this.d = buffer.random_bit();
    this.input1 = this.d
    this.output()
  }
  input(e: boolean, d: boolean) { 
    if(typeof(d) !== 'boolean' || typeof(e) !== 'boolean')
      throw new Error('NaB')
    this.e = e;
    this.input0 = e
    this.d = d;
    this.input1 = d

    return this.output();
  }
  output(){
    const step1 = this.not.input(this.d)
    const step2 = this.and0.input(step1,this.e)
    const step3 = this.and0.input(this.e,this.d)
    const return_val = this.sr_latch.input(step3,step2)

    return return_val
  }
}
