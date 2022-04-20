import * as buffer from './buffers';
export interface TwoInput {
  i0: boolean;
  i1: boolean;
  o: boolean;
  input ( i:boolean, j:boolean ): boolean;
  processing (): void;
  output (): boolean;
}

export class AND implements TwoInput {
  i0: boolean;
  i1: boolean;
  o: boolean;
  constructor() {
    this.i0 = buffer.random_bit();
    this.i1 = buffer.random_bit();
    this.o  = buffer.random_bit();
  }
  input(i0: boolean, i1: boolean) {
    buffer.throw_on_NaB(i0, i1);
    this.i0 = i0;
    this.i1 = i1;
    this.processing();

    return this.output();
  }
  processing() {
    this.o = this.i0 && this.i1;
  }
  output() {
    return this.o;
  }
}

export class OR extends AND implements TwoInput {
  processing(){
    this.o = this.i0 || this.i1;
  }
}

export class NAND extends AND implements TwoInput {
  not: buffer.NOT;
  constructor() {
    super();
    this.not = new buffer.NOT();
  }
  processing(){
    super.processing()
    this.o = this.not.input(super.output());
  }
}

export class NOR extends OR implements TwoInput {
  not: buffer.NOT;

/* why istanbul? why is this not tested? is this a bug? */
/* istanbul ignore next */
  constructor() {
    super();
    this.not = new buffer.NOT();
  }

  processing(){
    super.processing()
    this.o = this.not.input(super.output());
  }
}

export class XOR extends OR implements TwoInput {
  processing(){
    this.o = this.i0 != this.i1;
  }
}

export class XNOR extends OR implements TwoInput {
  processing(){
    this.o = this.i0 === this.i1;
  }
}
