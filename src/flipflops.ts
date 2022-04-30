import * as h from './helpers';
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

export interface IDFlipFlop {
  d: boolean;
  c: boolean;

  q: boolean;
  not_q: boolean;

  input ( d:boolean, c:boolean ): number;
  processing (): void;
  output (): number;
}
export interface IDDivider {
  i: boolean;

  input ( i:boolean ): boolean;
  processing (): void;
  output (): boolean;
}

export class SRLatch implements ISRLatch {
  s: boolean;
  r: boolean;
  q: boolean;
  not_q: boolean;

  nor0: gate.NOR;
  nor1: gate.NOR;

  constructor() {
    this.s = h.random_bit();
    this.r = h.random_bit();
    this.q = h.random_bit();
    this.not_q = h.random_bit();
    this.nor0 = new gate.NOR();
    this.nor1 = new gate.NOR();
    this.processing();
    this.output();
  }

  input(s: boolean, r: boolean) {
    h.throw_on_NaB(s, r);
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
    const out = h.bits_to_num([this.not_q,this.q]);
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
    this.e = h.random_bit();
    this.d = h.random_bit();
    this.q = h.random_bit();
    this.not_q = h.random_bit();
    this.not = new buffer.NOT();
    this.and0 = new gate.AND();
    this.and1 = new gate.AND();
    this.sr_latch = new SRLatch();
    this.processing();
    this.output();
  }

  input(e: boolean, d: boolean) {
    h.throw_on_NaB(e, d);
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

export class DFlipFlop implements IDFlipFlop {
  d: boolean;
  c: boolean;

  q: boolean;
  not_q: boolean;

  and: gate.AND[];
  not0: buffer.NOT;
  not1: buffer.NOT;
  sr_latch0: SRLatch;
  sr_latch1: SRLatch;

  constructor() {
    this.d = h.random_bit();
    this.c = h.random_bit();
    this.q = h.random_bit();
    this.not_q = h.random_bit();

    this.and = new Array(4).fill(0).map(() => { return new gate.AND() });
    this.not0 = new buffer.NOT();
    this.not1 = new buffer.NOT();
    this.sr_latch0 = new SRLatch();
    this.sr_latch1 = new SRLatch();

    this.processing();
    this.output();
  }

  input(d:boolean, c:boolean){
    h.throw_on_NaB(d, c);
    this.d = d;
    this.c = c;
    this.processing();

    return this.output();
  }

  processing(){
    const step1 = this.not0.input(this.d);
    const step2 = this.and[0].input(this.d, this.c);
    const step3 = this.and[1].input(step1, this.c);
    this.sr_latch0.input(step2,step3);
    const step4 = this.not1.input(this.c)
    const step5 = this.and[2].input(this.sr_latch0.q, step4);
    const step6 = this.and[3].input(this.sr_latch0.not_q, step4);
    this.sr_latch1.input(step5,step6);

    this.q = this.sr_latch1.q
    this.not_q = this.sr_latch1.not_q
  }

  output(){
    const out = h.bits_to_num([this.not_q,this.q]);
    return out;
  }
}
export class DDivider implements IDDivider {
  i: boolean;
  d_flipflop: DFlipFlop;

  constructor() {
    this.i = h.random_bit();
    this.d_flipflop = new DFlipFlop();
  }
  input(i:boolean){
    h.throw_on_NaB(i);
    this.i = i;
    this.processing();

    return this.output();
  }
  processing(){
    this.d_flipflop.input(this.d_flipflop.not_q, this.i)
  }
  output (){
    return this.d_flipflop.q
  }
}
