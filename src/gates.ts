import * as buffer from './buffers'
export interface TwoInput {
  input0: boolean;
  input1: boolean;
  input ( i:boolean, j:boolean ): boolean;
  output (): boolean;
}

export class AND implements TwoInput {
  input0: boolean;
  input1: boolean;
  constructor() {
    this.input0 = buffer.random_bit();
    this.input1 = buffer.random_bit();
  } 
  input(input0: boolean, input1: boolean) { 
    if(typeof(input0) !== 'boolean' || typeof(input1) !== 'boolean')
      throw new Error('NaB')
    this.input0 = input0;
    this.input1 = input1;
    return this.output();
  }
  output() {
    return this.input0 && this.input1;
  }
}

export class OR extends AND implements TwoInput {
  output(){
    return this.input0 || this.input1;
  }
}

export class NAND extends AND implements TwoInput {
  not: buffer.NOT;
  constructor() {
    super();
    this.not = new buffer.NOT();
  }
  output(){
    return this.not.input(super.output());
  }
}

export class NOR extends OR implements TwoInput {
  not: buffer.NOT;
  /* istanbul ignore next */
  constructor() {
    super();
    this.not = new buffer.NOT();
  }
  output(){
    return this.not.input(super.output());
  }
}

export class XOR extends OR implements TwoInput {
  output(){
    return this.input0 != this.input1;
  }
}

export class XNOR extends OR implements TwoInput {
  output(){
    return this.input0 === this.input1;
  }
}
