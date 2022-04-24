import * as buffer from './buffers';
import * as gate from './gates';

export interface IAdder {
  a: boolean;
  b: boolean;
  ci: boolean;
  s: boolean;
  co: boolean;
  input (a:boolean, b:boolean, ci:boolean): number;
  output (): number;
}

export interface IFourBitAdder {
  a: boolean[];
  b: boolean[];
  ci: boolean;
  s: boolean[];
  co: boolean;
  input (a:boolean[], b:boolean[], ci:boolean): number;
  output (): number;
}

export class BitAdder implements IAdder {
  a: boolean;
  b: boolean;
  ci: boolean;
  s: boolean;
  co: boolean;
  xor0: gate.XOR;
  xor1: gate.XOR;
  and0: gate.AND;
  and1: gate.AND;
  or: gate.OR;

  constructor() {
    this.a = buffer.random_bit();
    this.b = buffer.random_bit();
    this.ci = buffer.random_bit();
    this.s = buffer.random_bit();
    this.co = buffer.random_bit();
    this.xor0 = new gate.XOR();
    this.xor1 = new gate.XOR();
    this.and0 = new gate.AND();
    this.and1 = new gate.AND();
    this.or = new gate.OR();
  }

  input(a:boolean, b:boolean, ci:boolean){
    buffer.throw_on_NaB(a, b, ci);
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
    let out = 0;
    if(this.s)
      out += 0b01;
    if(this.co)
      out += 0b10;

    return out;
  }
}

export class FourBitAdder implements IFourBitAdder {
  a: boolean[];
  b: boolean[];
  ci: boolean;
  s: boolean[];
  co: boolean;
  o: number;
  ba: BitAdder[];

  constructor() {
    this.a = buffer.random_bits(4);
    this.b = buffer.random_bits(4);
    this.ci = buffer.random_bit();
    this.s = buffer.random_bits(4);
    this.co = buffer.random_bit();
    this.o = 0;
    this.ba = new Array(4).fill(0).map(() => { return new BitAdder() });
  }

  input(a:boolean[], b:boolean[], ci:boolean){
    this.a = a;
    this.b = b;
    this.ci = ci;
    this.processing();

    return this.output();
  }

  processing(){
    let carry = this.ci;
    for (const ri in this.ba){
      const i = this.ba.length - +ri - 1; // endian
      this.ba[i].input(this.a[i], this.b[i], carry)
      this.s[i] = this.ba[i].s;
      carry = this.ba[i].co;
    }
    this.co = carry;
  }

  output(){
    let out = buffer.bits_to_num(this.s);
    if(this.co)
      out += 0x10;
    return out;
  }
}
