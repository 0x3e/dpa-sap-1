import * as buffer from './buffers';
import * as gate from './gates';
export interface ISRLatch {
  s: boolean;
  r: boolean;
  q: boolean;
  not_q: boolean;
  input ( s:boolean, r:boolean ): number;
  processing (): void;
  output (): number;
}

export interface IDLatch {
  e: boolean;
  d: boolean;
  q: boolean;
  not_q: boolean;
  input ( e:boolean, d:boolean ): number;
  processing (): void;
  output (): number;
}

export class SRLatch implements ISRLatch {
  s: boolean;
  r: boolean;
  q: boolean;
  not_q: boolean;
  nor0: gate.NOR;
  nor1: gate.NOR;
  constructor() {
    this.s = buffer.random_bit();
    this.r = buffer.random_bit();
    this.q = buffer.random_bit();
    this.not_q = buffer.random_bit();
    this.nor0 = new gate.NOR();
    this.nor1 = new gate.NOR();
    this.processing();
    this.output();
  }
  input(s: boolean, r: boolean) {
    buffer.throw_on_NaB(s, r);
    this.s = s;
    this.r = r;
    this.processing();
    return this.output();
  }
  processing(){
    this.q = this.nor0.input(this.r, this.nor1.output());
    this.not_q = this.nor1.input(this.q, this.s);
    this.q = this.nor0.input(this.r, this.nor1.output());
    this.q = this.nor0.output();
    this.not_q = this.nor1.output();
  }
  output(){
    let out = 0;
    if(this.q)
      out = out + 0b01;
    if(this.not_q)
      out = out + 0b10;
    return out;
  }
}

export class DLatch implements IDLatch {
  e: boolean;
  d: boolean;
  q: boolean;
  not_q: boolean;
  not: buffer.NOT;
  and0: gate.AND;
  and1: gate.AND;
  sr_latch: SRLatch;
  constructor() {
    this.e = buffer.random_bit();
    this.d = buffer.random_bit();
    this.q = buffer.random_bit();
    this.not_q = buffer.random_bit();
    this.not = new buffer.NOT();
    this.and0 = new gate.AND();
    this.and1 = new gate.AND();
    this.sr_latch = new SRLatch();
    this.processing();
    this.output();
  }
  input(e: boolean, d: boolean) {
    buffer.throw_on_NaB(e, d);
    this.e = e;
    this.d = d;
    this.processing();

    return this.output();
  }
  processing(){
    const step1 = this.not.input(this.d);
    const step2 = this.and0.input(step1, this.e);
    const step3 = this.and1.input(this.e, this.d);
    const step4 = this.sr_latch.input(step3,step2);
    this.q = ((step4 >> 0) % 2) == 1;
    this.not_q = ((step4 >> 1) % 2 ) == 1;
  }

  output(){
    return this.sr_latch.output();
  }
}
