/*                                                                            *\
*                                                                              *
*                                                                              *
\*                                                                            */
import * as h from './helpers';

export interface OneInput {
  i: boolean;
  o: boolean;
  input ( i:boolean ): void;
  processing (): void;
  output (): boolean;
}

export interface ThreeState {
  a: boolean;
  b: boolean;
  o: boolean | undefined;
  input ( a:boolean, b:boolean ): void;
  processing (): void;
  output (): boolean | undefined;
}


export class Buffer implements OneInput {
  i: boolean;
  o: boolean;
  constructor() {
    this.i = h.random_bit();
    this.o = h.random_bit();
  }
  input(i: boolean) {
    h.throw_on_NaB(i);
    this.i = i;
    this.processing();
    return this.output();
  }
  processing() {
    this.o = this.i;
  }
  output() {
    return this.o;
  }
}

export class NOT extends Buffer implements OneInput {
  processing(){
    this.o = !this.i;
  }
}

export class TriState implements ThreeState {
  a: boolean;
  b: boolean;
  o: boolean | undefined;
  constructor() {
    this.a = h.random_bit();
    this.b = h.random_bit();
    this.processing();
  }
  input(a: boolean, b: boolean) {
    h.throw_on_NaB(a,b);
    this.a = a;
    this.b = b;
    this.processing();

    return this.output();
  }
  processing(){
    if(this.b)
      this.o = this.a;
    else
      this.o = undefined;
  }
  output(){
    return this.o;
  }
}
