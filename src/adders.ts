import * as h from './helpers';
import * as gate from './gates';
import * as register from './registers';
import * as bus from './busses';

export interface IAdder {
  a: boolean;
  b: boolean;
  ci: boolean;
  s: boolean;
  co: boolean;
  o: number;
  input (a:boolean, b:boolean, ci:boolean): number;
  output (): number;
}

export interface IBitsAdder {
  a: boolean[];
  b: boolean[];
  ci: boolean;
  s: boolean[];
  co: boolean;
  bits: number;
  input (a:boolean[], b:boolean[], ci:boolean): number;
  output (): number;
}

export class BitAdder implements IAdder {
  a: boolean;
  b: boolean;
  ci: boolean;
  s: boolean;
  co: boolean;
  o: number;
  xor0: gate.XOR;
  xor1: gate.XOR;
  and0: gate.AND;
  and1: gate.AND;
  or: gate.OR;

  constructor() {
    this.a = h.random_bit();
    this.b = h.random_bit();
    this.ci = h.random_bit();
    this.s = h.random_bit();
    this.co = h.random_bit();
    this.o = h.bits_to_num(h.random_bits(1));
    this.xor0 = new gate.XOR();
    this.xor1 = new gate.XOR();
    this.and0 = new gate.AND();
    this.and1 = new gate.AND();
    this.or = new gate.OR();
  }

  input(a:boolean, b:boolean, ci:boolean){
    h.throw_on_NaB(a, b, ci);
    this.a = a;
    this.b = b;
    this.ci = ci;
    this.processing();

    return this.output();
  }

  processing(){
    const step1 = this.xor0.input(this.a, this.b);
    this.s = this.xor1.input(step1, this.ci);
    const step2 = this.and0.input(step1, this.ci);
    const step3 = this.and1.input(this.a, this.b);
    this.co = this.or.input(step2, step3);
  }

  output(){
    this.o = 0;
    if(this.s)
      this.o += 0b01;
    if(this.co)
      this.o += 0b10;

    return this.o;
  }
}

export abstract class BitsAdder implements IBitsAdder {
  a: boolean[];
  b: boolean[];
  ci: boolean;
  s: boolean[];
  co: boolean;
  o: number;
  bits: number;

  constructor(n: number) {
    this.bits = n;
    this.a = h.random_bits(this.bits);
    this.b = h.random_bits(this.bits);
    this.ci = h.random_bit();
    this.s = h.random_bits(this.bits);
    this.co = h.random_bit();
    this.o = h.bits_to_num(h.random_bits(this.bits));
  }

  input(a:boolean[], b:boolean[], ci:boolean){
    this.a = a;
    this.b = b;
    this.ci = ci;
    this.processing();

    return this.output();
  }

  abstract processing(): void;

  output(){
    this.o = h.bits_to_num(this.s);
    if(this.co)
      this.o += 1 << this.bits;

    return this.o;
  }
}
export class FourBitAdder extends BitsAdder implements IBitsAdder {
  ba: BitAdder[];

  constructor() {
    super(4);
    this.ba = new Array(4).fill(0).map(() => { return new BitAdder() });
  }

  processing(){
    let carry = this.ci;
    for (const i in this.ba){
      const ri = this.ba.length - +i - 1; //endian
      this.ba[ri].input(this.a[ri], this.b[ri], carry);
      this.s[ri] = this.ba[ri].s;
      carry = this.ba[ri].co;
    }
    this.co = carry;
  }
}

export class EightBitAdder extends BitsAdder implements IBitsAdder, bus.IBussable {
  e: boolean;
  ba: FourBitAdder[];
  r: register.EightBitRegister[];

  constructor() {
    super(8);
    this.ci = false;
    this.e = false;
    this.ba = new Array(2).fill(0).map(() => { return new FourBitAdder() });
    this.r = [];
  }
  a_register(a: register.EightBitRegister){
    this.r[0]=a;
  }

  b_register(b: register.EightBitRegister){
    this.r[1]=b;
  }

  processing(){
    this.ba[0].input(this.a.slice(4), this.b.slice(4), this.ci);
    this.ba[1].input(this.a.slice(0,4), this.b.slice(0,4), this.ba[0].co);
    this.s = this.ba[1].s.concat(this.ba[0].s);
    this.co = this.ba[1].co;
  }

  bus(){
    this.ci = false;
    const a = this.r[0].o;
    const b = this.r[1].o;
/* istanbul ignore next */
    if(h.is_bits(a))
      this.a = a;
/* istanbul ignore next */
    if(h.is_bits(b))
      this.b = b;

    this.processing();

    if(!this.e)
      return new Array(8).fill(undefined);
    else
      return this.s;
  }
}
